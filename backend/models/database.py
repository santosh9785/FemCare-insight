"""
Database models and storage for Sahaaya Health Platform.
Supports SQLite out of the box with comprehensive mock seed data,
and ready hooks for Supabase PostgreSQL.
"""
import sqlite3
import os
import json
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sahaaya.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'patient',
        preferred_language TEXT DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Symptom conversations table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS symptom_conversations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        language TEXT DEFAULT 'en',
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Symptom messages table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS symptom_messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        detected_language TEXT,
        structured_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Symptom records table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS symptom_records (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        symptom_type TEXT NOT NULL,
        severity TEXT DEFAULT 'moderate',
        onset_date TEXT NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Cycle records table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS cycle_records (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        period_start TEXT NOT NULL,
        period_end TEXT NOT NULL,
        flow TEXT DEFAULT 'medium',
        cramps_severity TEXT DEFAULT 'mild',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Doctors table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        qualifications TEXT NOT NULL,
        experience_years INTEGER NOT NULL,
        supported_languages TEXT NOT NULL,
        consultation_fee INTEGER NOT NULL,
        verification_status TEXT DEFAULT 'verified',
        rating REAL DEFAULT 4.9,
        reviews_count INTEGER DEFAULT 120,
        avatar_url TEXT,
        bio TEXT,
        available_days TEXT
    )
    ''')

    # Appointments table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        patient_name TEXT,
        patient_phone TEXT,
        doctor_id TEXT NOT NULL,
        requested_slot TEXT NOT NULL,
        confirmed_slot TEXT,
        consultation_type TEXT DEFAULT 'video',
        status TEXT DEFAULT 'pending_confirmation',
        payment_status TEXT DEFAULT 'demo_paid',
        payment_id TEXT,
        amount INTEGER DEFAULT 600,
        symptoms_summary TEXT,
        doctor_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Reports table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        doctor_id TEXT,
        report_title TEXT NOT NULL,
        report_type TEXT NOT NULL,
        storage_url TEXT NOT NULL,
        summary TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Doctor Referral / Test Requests table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS test_referrals (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        test_name TEXT NOT NULL,
        clinical_reason TEXT NOT NULL,
        instructions TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Prescriptions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS prescriptions (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        doctor_id TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        diagnosis_impression TEXT NOT NULL,
        medicines_json TEXT NOT NULL,
        advice TEXT,
        status TEXT DEFAULT 'issued',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Notifications table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    conn.commit()
    seed_initial_data(conn)
    conn.close()

def seed_initial_data(conn):
    cursor = conn.cursor()

    # Seed Demo Users
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        demo_users = [
            ("user-demo-priya", "Priya Sharma", "priya@sahaaya.demo", "demo_hash_priya", "patient", "en"),
            ("user-demo-deepa", "Deepa Hegde", "deepa@sahaaya.demo", "demo_hash_deepa", "patient", "kn"),
            ("user-demo-lakshmi", "Lakshmi Rao", "lakshmi@sahaaya.demo", "demo_hash_lakshmi", "patient", "te"),
            ("doc-santosh", "Dr. Santosh (MD, OB-GYN)", "santosh1@gmail.com", "1000daaa89371b1e3f17fc9d2b0ddd3f174ccc8e68d6d027093d9270dd5907b7", "doctor", "en"),
            ("doc-ananya", "Dr. Ananya Sharma", "dr.ananya@sahaaya.demo", "demo_doc_ananya", "doctor", "en"),
            ("doc-kavitha", "Dr. Kavitha Reddy", "dr.kavitha@sahaaya.demo", "demo_doc_kavitha", "doctor", "te")
        ]
        cursor.executemany("INSERT INTO users (id, display_name, email, password_hash, role, preferred_language) VALUES (?, ?, ?, ?, ?, ?)", demo_users)

    # Always ensure santosh1@gmail.com is present with password boss143
    cursor.execute("SELECT id FROM users WHERE email = 'santosh1@gmail.com'")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO users (id, display_name, email, password_hash, role, preferred_language)
            VALUES ('doc-santosh', 'Dr. Santosh (MD, OB-GYN)', 'santosh1@gmail.com', '1000daaa89371b1e3f17fc9d2b0ddd3f174ccc8e68d6d027093d9270dd5907b7', 'doctor', 'en')
        """)
    else:
        cursor.execute("""
            UPDATE users SET password_hash = '1000daaa89371b1e3f17fc9d2b0ddd3f174ccc8e68d6d027093d9270dd5907b7', role = 'doctor'
            WHERE email = 'santosh1@gmail.com'
        """)

    # Seed Doctors
    cursor.execute("SELECT COUNT(*) FROM doctors")
    if cursor.fetchone()[0] == 0:
        doctors = [
            (
                "doc-ananya",
                "Dr. Ananya Sharma",
                "Gynecologist & PCOS Specialist",
                "MD (OB-GYN), DGO, Fellowship in Reproductive Endocrinology (AIIMS)",
                14,
                json.dumps(["English", "Hindi"]),
                750,
                "verified",
                4.95,
                248,
                "https://images.unsplash.com/photo-1594824813626-d6a031e4d156?w=200&h=200&fit=crop&crop=faces",
                "Specialist in PCOS management, hormonal imbalances, irregular menstrual cycles, and adolescent gynecology. Believes in empathetic, non-judgmental care.",
                json.dumps(["Mon", "Tue", "Thu", "Fri", "Sat"])
            ),
            (
                "doc-kavitha",
                "Dr. Kavitha Reddy",
                "Consultant Obstetrician & Gynecologist",
                "MBBS, MS (OBG), MRCOG (UK)",
                12,
                json.dumps(["Telugu", "Kannada", "English"]),
                800,
                "verified",
                4.92,
                190,
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=faces",
                "Fluent in Telugu and Kannada. Expert in pelvic discomfort, endometriosis screening, fertility counseling, and pre-conceptional health.",
                json.dumps(["Mon", "Wed", "Thu", "Sat"])
            ),
            (
                "doc-meera",
                "Dr. Meera Nambiar",
                "Reproductive Health & Endocrinology Specialist",
                "MBBS, DNB (Obstetrics & Gynecology)",
                9,
                json.dumps(["Tamil", "English", "Hindi"]),
                650,
                "verified",
                4.88,
                142,
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces",
                "Passionate about demystifying menstrual irregularities and metabolic wellness. Focuses on safe clinical evidence and personalized care plans.",
                json.dumps(["Tue", "Wed", "Fri", "Sun"])
            ),
            (
                "doc-priya",
                "Dr. Priya Desai",
                "Consultant Dermatologist & Trichologist",
                "MD (Dermatology, Venereology & Leprosy)",
                11,
                json.dumps(["Hindi", "English"]),
                700,
                "verified",
                4.91,
                165,
                "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=faces",
                "Specializes in hormonal acne, adult female androgenetic alopecia (hair thinning), and hirsutism associated with endocrine conditions.",
                json.dumps(["Mon", "Wed", "Fri", "Sat"])
            )
        ]
        cursor.executemany("""
            INSERT INTO doctors (id, display_name, specialty, qualifications, experience_years, supported_languages, consultation_fee, verification_status, rating, reviews_count, avatar_url, bio, available_days)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, doctors)

    # Seed Sample Cycle Records for Priya
    cursor.execute("SELECT COUNT(*) FROM cycle_records")
    if cursor.fetchone()[0] == 0:
        cycles = [
            ("cycle-1", "user-demo-priya", "2026-08-10", "2026-08-15", "medium", "moderate", "Period delayed by 18 days. Experienced acne breakout around chin."),
            ("cycle-2", "user-demo-priya", "2026-06-22", "2026-06-27", "light", "mild", "Light flow, cycle length 42 days."),
            ("cycle-3", "user-demo-priya", "2026-05-08", "2026-05-13", "heavy", "severe", "Severe cramps on day 1-2.")
        ]
        cursor.executemany("INSERT INTO cycle_records (id, user_id, period_start, period_end, flow, cramps_severity, notes) VALUES (?, ?, ?, ?, ?, ?, ?)", cycles)

    # Seed Sample Symptom Records
    cursor.execute("SELECT COUNT(*) FROM symptom_records")
    if cursor.fetchone()[0] == 0:
        symptoms = [
            ("sym-1", "user-demo-priya", "Irregular Periods / Oligomenorrhea", "moderate", "2026-08-10", "Cycle gap exceeding 40 days repeatedly"),
            ("sym-2", "user-demo-priya", "Hormonal Acne (Jawline)", "moderate", "2026-08-15", "Painful cystic acne along jawline and cheeks"),
            ("sym-3", "user-demo-priya", "Hair Thinning / Scalp Shedding", "mild", "2026-09-01", "Increased shedding during washing")
        ]
        cursor.executemany("INSERT INTO symptom_records (id, user_id, symptom_type, severity, onset_date, notes) VALUES (?, ?, ?, ?, ?, ?)", symptoms)

    # Seed Demo Appointments
    cursor.execute("SELECT COUNT(*) FROM appointments")
    if cursor.fetchone()[0] == 0:
        appts = [
            (
                "appt-demo-1",
                "user-demo-priya",
                "Priya Sharma",
                "+91 98765 43210",
                "doc-ananya",
                "2026-10-18 10:30 AM",
                None,
                "video",
                "pending_confirmation",
                "demo_paid",
                "PAY-DEMO-98213",
                750,
                "Consultation for irregular cycle (3 months delayed) and jawline acne",
                ""
            )
        ]
        cursor.executemany("""
            INSERT INTO appointments (id, patient_id, patient_name, patient_phone, doctor_id, requested_slot, confirmed_slot, consultation_type, status, payment_status, payment_id, amount, symptoms_summary, doctor_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, appts)

    # Seed Notifications
    cursor.execute("SELECT COUNT(*) FROM notifications")
    if cursor.fetchone()[0] == 0:
        notifs = [
            ("notif-1", "user-demo-priya", "welcome", "Welcome to Sahaaya", "Your safe, private women's health space. Talk naturally about your symptoms anytime.", None),
            ("notif-2", "user-demo-priya", "appointment", "Appointment Request Submitted", "Your video consultation request with Dr. Ananya Sharma has been sent. Status: Pending Doctor Confirmation.", None),
            ("notif-3", "doc-ananya", "new_appointment", "New Consultation Request", "Priya Sharma has requested a video consultation for Oct 18, 10:30 AM.", None)
        ]
        cursor.executemany("INSERT INTO notifications (id, user_id, type, title, message, read_at) VALUES (?, ?, ?, ?, ?, ?)", notifs)

    conn.commit()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully with seed data.")
