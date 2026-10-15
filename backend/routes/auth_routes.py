"""
Authentication Routes for Sahaaya.
Provides secure user registration, login, and quick demo mode switching.
"""
from flask import Blueprint, request, jsonify
import uuid
import hashlib
from models.database import get_db

auth_bp = Blueprint('auth', __name__)

def hash_pw(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    display_name = data.get('display_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    preferred_language = data.get('preferred_language', 'en')
    role = data.get('role', 'patient')

    if not display_name or not email or not password:
        return jsonify({"error": "Display name, email, and password are required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"error": "An account with this email already exists"}), 409

    user_id = f"user-{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO users (id, display_name, email, password_hash, role, preferred_language)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, display_name, email, hash_pw(password), role, preferred_language))
    conn.commit()
    conn.close()

    return jsonify({
        "message": "Account created successfully",
        "user": {
            "id": user_id,
            "display_name": display_name,
            "email": email,
            "role": role,
            "preferred_language": preferred_language
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, display_name, email, password_hash, role, preferred_language FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user or user['password_hash'] != hash_pw(password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user['id'],
            "display_name": user['display_name'],
            "email": user['email'],
            "role": user['role'],
            "preferred_language": user['preferred_language']
        }
    })

@auth_bp.route('/demo', methods=['POST'])
def demo_login():
    """Instant demo mode for hackathon evaluation."""
    data = request.get_json() or {}
    role = data.get('role', 'patient')
    lang = data.get('language', 'en')

    conn = get_db()
    cursor = conn.cursor()
    if role == 'doctor':
        cursor.execute("SELECT id, display_name, email, role, preferred_language FROM users WHERE id = 'doc-ananya'")
    else:
        cursor.execute("SELECT id, display_name, email, role, preferred_language FROM users WHERE id = 'user-demo-priya'")
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({
            "message": "Demo mode active",
            "is_demo": True,
            "user": {
                "id": user['id'],
                "display_name": user['display_name'],
                "email": user['email'],
                "role": user['role'],
                "preferred_language": lang or user['preferred_language']
            }
        })

    # Fallback synthetic demo user
    return jsonify({
        "message": "Demo mode active",
        "is_demo": True,
        "user": {
            "id": "user-demo-priya",
            "display_name": "Priya Sharma",
            "email": "priya@sahaaya.demo",
            "role": "patient",
            "preferred_language": lang
        }
    })

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    user_id = request.args.get('user_id', 'user-demo-priya')
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, display_name, email, role, preferred_language FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": {
            "id": user['id'],
            "display_name": user['display_name'],
            "email": user['email'],
            "role": user['role'],
            "preferred_language": user['preferred_language']
        }
    })
