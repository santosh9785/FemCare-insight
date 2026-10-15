"""
Appointment Booking and Management Routes for Sahaaya.
Handles full appointment lifecycle: request submission, demo payments,
doctor confirmation/rejection, and status notifications.
"""
from flask import Blueprint, request, jsonify
import uuid
from models.database import get_db

appointment_bp = Blueprint('appointments', __name__)

@appointment_bp.route('/', methods=['GET'])
def get_appointments():
    user_id = request.args.get('user_id')
    doctor_id = request.args.get('doctor_id')

    conn = get_db()
    cursor = conn.cursor()

    if doctor_id:
        cursor.execute("""
            SELECT a.*, d.display_name as doctor_name, d.specialty, d.avatar_url
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE a.doctor_id = ?
            ORDER BY a.created_at DESC
        """, (doctor_id,))
    elif user_id:
        cursor.execute("""
            SELECT a.*, d.display_name as doctor_name, d.specialty, d.avatar_url
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE a.patient_id = ?
            ORDER BY a.created_at DESC
        """, (user_id,))
    else:
        cursor.execute("""
            SELECT a.*, d.display_name as doctor_name, d.specialty, d.avatar_url
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.id
            ORDER BY a.created_at DESC
        """)

    rows = cursor.fetchall()
    conn.close()

    appointments = [dict(r) for r in rows]
    return jsonify({"appointments": appointments})

@appointment_bp.route('/', methods=['POST'])
def create_appointment():
    data = request.get_json() or {}
    patient_id = data.get('patient_id', 'user-demo-priya')
    patient_name = data.get('patient_name', 'Priya Sharma')
    patient_phone = data.get('patient_phone', '+91 98765 43210')
    doctor_id = data.get('doctor_id')
    requested_slot = data.get('requested_slot')
    consultation_type = data.get('consultation_type', 'video')
    symptoms_summary = data.get('symptoms_summary', '')
    amount = data.get('amount', 750)

    if not doctor_id or not requested_slot:
        return jsonify({"error": "Doctor and requested slot are required"}), 400

    appt_id = f"appt-{uuid.uuid4().hex[:8]}"
    payment_id = f"DEMO-PAY-{uuid.uuid4().hex[:6].upper()}"

    # Status must be pending_confirmation per PRD Test F!
    status = "pending_confirmation"
    payment_status = "demo_paid"

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO appointments (
            id, patient_id, patient_name, patient_phone, doctor_id,
            requested_slot, consultation_type, status, payment_status,
            payment_id, amount, symptoms_summary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        appt_id, patient_id, patient_name, patient_phone, doctor_id,
        requested_slot, consultation_type, status, payment_status,
        payment_id, amount, symptoms_summary
    ))

    # Create notification for doctor
    notif_id = f"notif-{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO notifications (id, user_id, type, title, message)
        VALUES (?, ?, 'appointment_request', 'New Consultation Request', ?)
    """, (notif_id, doctor_id, f"{patient_name} requested a {consultation_type} consultation for {requested_slot}."))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Appointment request submitted successfully",
        "appointment": {
            "id": appt_id,
            "status": status,
            "status_label": "Pending Doctor Confirmation",
            "requested_slot": requested_slot,
            "consultation_type": consultation_type,
            "payment_id": payment_id,
            "amount": amount
        }
    }), 201

@appointment_bp.route('/<appt_id>/status', methods=['PATCH'])
def update_status(appt_id):
    data = request.get_json() or {}
    new_status = data.get('status') # 'confirmed', 'rejected', 'completed'
    confirmed_slot = data.get('confirmed_slot')
    doctor_notes = data.get('doctor_notes')

    if not new_status:
        return jsonify({"error": "New status is required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM appointments WHERE id = ?", (appt_id,))
    appt = cursor.fetchone()
    if not appt:
        conn.close()
        return jsonify({"error": "Appointment not found"}), 404

    slot = confirmed_slot if confirmed_slot else appt['requested_slot']
    cursor.execute("""
        UPDATE appointments
        SET status = ?, confirmed_slot = ?, doctor_notes = COALESCE(?, doctor_notes)
        WHERE id = ?
    """, (new_status, slot, doctor_notes, appt_id))

    # Notify patient
    patient_id = appt['patient_id']
    notif_id = f"notif-{uuid.uuid4().hex[:8]}"
    title = f"Appointment {new_status.replace('_', ' ').capitalize()}"
    msg = f"Your appointment for {slot} has been {new_status} by the doctor."
    cursor.execute("""
        INSERT INTO notifications (id, user_id, type, title, message)
        VALUES (?, ?, 'appointment_status', ?, ?)
    """, (notif_id, patient_id, title, msg))

    conn.commit()
    conn.close()

    return jsonify({
        "message": f"Appointment status updated to {new_status}",
        "appointment_id": appt_id,
        "status": new_status,
        "confirmed_slot": slot
    })
