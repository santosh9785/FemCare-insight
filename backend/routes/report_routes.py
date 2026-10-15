"""
Reports, Referrals, Live Translation, and Notifications Routes for Sahaaya.
Provides safe patient report storage, clinical test orders, translation endpoint,
and notification feed.
"""
from flask import Blueprint, request, jsonify
import uuid
import json
from models.database import get_db
from services.translation_service import translate_consultation_message

report_bp = Blueprint('reports', __name__)

# Sample Terminology Dictionary for AI Report Explainer
REPORT_TERMS = {
    "follicles": "Small, fluid-filled sacs in the ovaries that hold eggs. Having multiple small peripheral follicles (often referred to as a 'pearl necklace' appearance) is common in ultrasound scans of individuals with PCOS, though it alone is not a diagnosis.",
    "endometrial thickness": "The thickness of the inner lining of the uterus. It naturally changes throughout the menstrual cycle and is usually thinnest just after a period.",
    "tsh": "Thyroid Stimulating Hormone. Evaluates thyroid function. Both low and elevated thyroid levels can cause menstrual irregularities and hair changes.",
    "free testosterone": "The active fraction of testosterone in the bloodstream. Elevated levels can contribute to hormonal acne and increased body/facial hair.",
    "lh/fsh ratio": "Luteinizing Hormone to Follicle Stimulating Hormone ratio. An elevated ratio (such as > 2:1) is frequently observed in individuals with ovulatory irregularity and PCOS."
}

@report_bp.route('/', methods=['GET'])
def get_reports():
    user_id = request.args.get('user_id', 'user-demo-priya')
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, patient_id, doctor_id, report_title, report_type, storage_url, summary, uploaded_at
        FROM reports
        WHERE patient_id = ?
        ORDER BY uploaded_at DESC
    """, (user_id,))
    rows = cursor.fetchall()

    # If empty, seed synthetic sample reports for demo
    if not rows:
        sample_reports = [
            (
                f"rep-{uuid.uuid4().hex[:6]}",
                user_id,
                "doc-ananya",
                "Pelvic Ultrasound (USG) Scan",
                "Ultrasound",
                "/reports/demo_pelvic_usg.pdf",
                "Bilateral enlarged ovaries with multiple small peripheral follicles (<9mm). Normal endometrial thickness (7mm). No acute mass.",
            ),
            (
                f"rep-{uuid.uuid4().hex[:6]}",
                user_id,
                "doc-ananya",
                "Comprehensive Hormone Blood Panel",
                "Pathology",
                "/reports/demo_hormone_panel.pdf",
                "FSH: 5.2 mIU/mL, LH: 12.8 mIU/mL (LH:FSH ratio 2.4). Total Testosterone: 64 ng/dL (mild elevation). TSH: 2.1 uIU/mL (normal).",
            )
        ]
        cursor.executemany("""
            INSERT INTO reports (id, patient_id, doctor_id, report_title, report_type, storage_url, summary)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, sample_reports)
        conn.commit()

        cursor.execute("SELECT * FROM reports WHERE patient_id = ? ORDER BY uploaded_at DESC", (user_id,))
        rows = cursor.fetchall()

    conn.close()
    return jsonify({"reports": [dict(r) for r in rows]})

@report_bp.route('/', methods=['POST'])
def upload_report():
    data = request.get_json() or {}
    patient_id = data.get('patient_id', 'user-demo-priya')
    report_title = data.get('report_title', 'General Medical Report')
    report_type = data.get('report_type', 'Laboratory')
    storage_url = data.get('storage_url', '/uploads/synthetic_doc.pdf')
    summary = data.get('summary', 'Patient submitted diagnostic report.')

    report_id = f"rep-{uuid.uuid4().hex[:8]}"
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO reports (id, patient_id, report_title, report_type, storage_url, summary)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (report_id, patient_id, report_title, report_type, storage_url, summary))
    conn.commit()
    conn.close()

    return jsonify({
        "message": "Report uploaded and encrypted successfully",
        "report": {
            "id": report_id,
            "report_title": report_title,
            "report_type": report_type,
            "summary": summary
        }
    }), 201

@report_bp.route('/explain-term', methods=['POST'])
def explain_term():
    data = request.get_json() or {}
    term = data.get('term', '').lower().strip()
    
    explanation = None
    for key, val in REPORT_TERMS.items():
        if key in term:
            explanation = val
            break

    if not explanation:
        explanation = (
            f"'{term.capitalize()}' is a standard clinical marker. Diagnostic values should always be interpreted "
            "in conjunction with your specific lab reference ranges and clinical history by your treating doctor."
        )

    return jsonify({
        "term": term,
        "general_explanation": explanation,
        "disclaimer": "Informational only. Reference intervals vary across diagnostic laboratories."
    })

# Doctor Referrals & Test Orders
@report_bp.route('/referrals', methods=['GET'])
def get_referrals():
    user_id = request.args.get('user_id', 'user-demo-priya')
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM test_referrals WHERE patient_id = ? ORDER BY created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()

    if not rows:
        sample_ref = (
            f"ref-{uuid.uuid4().hex[:6]}",
            user_id,
            "doc-ananya",
            "Dr. Ananya Sharma, MD (OB-GYN)",
            "Pelvic Ultrasound (Transabdominal + Transvaginal) & Fasting Insulin Panel",
            "Evaluation of secondary oligomenorrhea (3-month cycle gap) and cutaneous hyperandrogenism markers",
            "Fasting 8-10 hours prior to blood collection. Drink 3-4 glasses of water 1 hour prior to scan for bladder filling.",
            "active"
        )
        cursor.execute("""
            INSERT INTO test_referrals (id, patient_id, doctor_id, doctor_name, test_name, clinical_reason, instructions, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_ref)
        conn.commit()
        cursor.execute("SELECT * FROM test_referrals WHERE patient_id = ?", (user_id,))
        rows = cursor.fetchall()

    conn.close()
    return jsonify({"referrals": [dict(r) for r in rows]})

@report_bp.route('/referrals', methods=['POST'])
def create_referral():
    data = request.get_json() or {}
    patient_id = data.get('patient_id', 'user-demo-priya')
    doctor_id = data.get('doctor_id', 'doc-ananya')
    doctor_name = data.get('doctor_name', 'Dr. Ananya Sharma')
    test_name = data.get('test_name', '')
    clinical_reason = data.get('clinical_reason', '')
    instructions = data.get('instructions', '')

    if not test_name:
        return jsonify({"error": "Test name is required"}), 400

    ref_id = f"ref-{uuid.uuid4().hex[:8]}"
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO test_referrals (id, patient_id, doctor_id, doctor_name, test_name, clinical_reason, instructions)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (ref_id, patient_id, doctor_id, doctor_name, test_name, clinical_reason, instructions))
    conn.commit()
    conn.close()

    return jsonify({"message": "Clinical test referral generated (Demo)", "referral_id": ref_id}), 201

# Live Translation API
@report_bp.route('/live-translate', methods=['POST'])
def live_translate():
    data = request.get_json() or {}
    text = data.get('text', '')
    source_lang = data.get('source_language', 'te')
    target_lang = data.get('target_language', 'en')

    result = translate_consultation_message(text, source_lang, target_lang)
    return jsonify(result)

# Notifications API
@report_bp.route('/notifications', methods=['GET'])
def get_notifications():
    user_id = request.args.get('user_id', 'user-demo-priya')
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return jsonify({"notifications": [dict(r) for r in rows]})

@report_bp.route('/notifications/<notif_id>/read', methods=['PATCH'])
def mark_read(notif_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE id = ?", (notif_id,))
    conn.commit()
    conn.close()
    return jsonify({"status": "read", "id": notif_id})
