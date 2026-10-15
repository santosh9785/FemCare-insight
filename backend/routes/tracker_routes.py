"""
Period and Symptom Tracking Routes for Sahaaya.
Allows users to log cycles, record daily symptoms, view timelines, and manage privacy.
"""
from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
from models.database import get_db

tracker_bp = Blueprint('tracker', __name__)

@tracker_bp.route('/', methods=['GET'])
def get_tracker_data():
    user_id = request.args.get('user_id', 'user-demo-priya')
    conn = get_db()
    cursor = conn.cursor()

    # Get cycle records
    cursor.execute("""
        SELECT id, period_start, period_end, flow, cramps_severity, notes, created_at
        FROM cycle_records
        WHERE user_id = ?
        ORDER BY period_start DESC
    """, (user_id,))
    cycle_rows = cursor.fetchall()
    cycles = [dict(r) for r in cycle_rows]

    # Calculate average cycle length if >= 2 cycles
    avg_cycle = None
    if len(cycles) >= 2:
        try:
            diffs = []
            for i in range(len(cycles) - 1):
                d1 = datetime.strptime(cycles[i]['period_start'], "%Y-%m-%d")
                d2 = datetime.strptime(cycles[i+1]['period_start'], "%Y-%m-%d")
                diffs.append(abs((d1 - d2).days))
            if diffs:
                avg_cycle = round(sum(diffs) / len(diffs))
        except:
            avg_cycle = None

    # Get symptom records
    cursor.execute("""
        SELECT id, symptom_type, severity, onset_date, notes, created_at
        FROM symptom_records
        WHERE user_id = ?
        ORDER BY onset_date DESC
    """, (user_id,))
    symptom_rows = cursor.fetchall()
    symptoms = [dict(r) for r in symptom_rows]

    conn.close()

    return jsonify({
        "cycles": cycles,
        "symptoms": symptoms,
        "metrics": {
            "total_cycles_logged": len(cycles),
            "average_cycle_length_days": avg_cycle,
            "last_period_date": cycles[0]['period_start'] if cycles else None,
            "privacy_notice": "Your cycle logs are encrypted and stored solely for your personal insight and consultation prep. You can permanently erase them at any time."
        }
    })

@tracker_bp.route('/cycles', methods=['POST'])
def add_cycle():
    data = request.get_json() or {}
    user_id = data.get('user_id', 'user-demo-priya')
    period_start = data.get('period_start')
    period_end = data.get('period_end')
    flow = data.get('flow', 'medium')
    cramps = data.get('cramps_severity', 'moderate')
    notes = data.get('notes', '')

    if not period_start or not period_end:
        return jsonify({"error": "Period start and end dates are required"}), 400

    cycle_id = f"cycle-{uuid.uuid4().hex[:8]}"
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO cycle_records (id, user_id, period_start, period_end, flow, cramps_severity, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (cycle_id, user_id, period_start, period_end, flow, cramps, notes))
    conn.commit()
    conn.close()

    return jsonify({
        "message": "Cycle logged successfully",
        "cycle": {
            "id": cycle_id,
            "period_start": period_start,
            "period_end": period_end,
            "flow": flow,
            "cramps_severity": cramps,
            "notes": notes
        }
    }), 201

@tracker_bp.route('/symptoms', methods=['POST'])
def add_symptom():
    data = request.get_json() or {}
    user_id = data.get('user_id', 'user-demo-priya')
    symptom_type = data.get('symptom_type')
    severity = data.get('severity', 'moderate')
    onset_date = data.get('onset_date', datetime.today().strftime('%Y-%m-%d'))
    notes = data.get('notes', '')

    if not symptom_type:
        return jsonify({"error": "Symptom type is required"}), 400

    symptom_id = f"sym-{uuid.uuid4().hex[:8]}"
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO symptom_records (id, user_id, symptom_type, severity, onset_date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (symptom_id, user_id, symptom_type, severity, onset_date, notes))
    conn.commit()
    conn.close()

    return jsonify({
        "message": "Symptom logged successfully",
        "symptom": {
            "id": symptom_id,
            "symptom_type": symptom_type,
            "severity": severity,
            "onset_date": onset_date,
            "notes": notes
        }
    }), 201

@tracker_bp.route('/records/<record_id>', methods=['DELETE'])
def delete_record(record_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cycle_records WHERE id = ?", (record_id,))
    cursor.execute("DELETE FROM symptom_records WHERE id = ?", (record_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Record deleted permanently", "deleted_id": record_id})
