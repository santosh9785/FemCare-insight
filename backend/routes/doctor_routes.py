"""
Doctor Discovery Routes for Sahaaya.
Provides verified doctor directories, specialty filters, languages, and time slots.
"""
from flask import Blueprint, request, jsonify
import json
from models.database import get_db

doctor_bp = Blueprint('doctors', __name__)

@doctor_bp.route('/', methods=['GET'])
def get_doctors():
    specialty = request.args.get('specialty')
    language = request.args.get('language')

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, display_name, specialty, qualifications, experience_years,
               supported_languages, consultation_fee, verification_status,
               rating, reviews_count, avatar_url, bio, available_days
        FROM doctors
    """)
    rows = cursor.fetchall()
    conn.close()

    doctors = []
    for r in rows:
        langs = json.loads(r['supported_languages']) if r['supported_languages'] else []
        days = json.loads(r['available_days']) if r['available_days'] else []

        # Filter by language if provided
        if language and language.lower() not in [l.lower() for l in langs]:
            continue

        # Filter by specialty if provided
        if specialty and specialty.lower() not in r['specialty'].lower():
            continue

        doctors.append({
            "id": r['id'],
            "display_name": r['display_name'],
            "specialty": r['specialty'],
            "qualifications": r['qualifications'],
            "experience_years": r['experience_years'],
            "supported_languages": langs,
            "consultation_fee": r['consultation_fee'],
            "verification_status": r['verification_status'],
            "rating": r['rating'],
            "reviews_count": r['reviews_count'],
            "avatar_url": r['avatar_url'],
            "bio": r['bio'],
            "available_days": days
        })

    return jsonify({"doctors": doctors})

@doctor_bp.route('/<doc_id>/slots', methods=['GET'])
def get_slots(doc_id):
    date = request.args.get('date', '2026-10-18')
    # Standard clinic slots for demo
    slots = [
        {"time": "09:30 AM", "available": True},
        {"time": "10:30 AM", "available": True},
        {"time": "11:45 AM", "available": False},
        {"time": "02:15 PM", "available": True},
        {"time": "04:00 PM", "available": True},
        {"time": "05:30 PM", "available": True}
    ]
    return jsonify({
        "doctor_id": doc_id,
        "date": date,
        "slots": slots
    })
