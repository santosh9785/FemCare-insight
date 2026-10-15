"""
Sahaaya Women's Health Platform — Backend Server.
Python Flask REST API with Supabase & SQLite multi-engine support.
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from models.database import init_db
from routes.auth_routes import auth_bp
from routes.assistant_routes import assistant_bp
from routes.tracker_routes import tracker_bp
from routes.doctor_routes import doctor_bp
from routes.appointment_routes import appointment_bp
from routes.report_routes import report_bp

app = Flask(__name__)
# Enable CORS for frontend Vite dev server and production origins
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(assistant_bp, url_prefix='/api/assistant')
app.register_blueprint(tracker_bp, url_prefix='/api/tracker')
app.register_blueprint(doctor_bp, url_prefix='/api/doctors')
app.register_blueprint(appointment_bp, url_prefix='/api/appointments')
app.register_blueprint(report_bp, url_prefix='/api')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Sahaaya Health AI Platform",
        "version": "1.0.0",
        "database": "SQLite (Supabase Ready)",
        "supported_languages": ["en", "kn", "te", "hi", "ta"]
    })

if __name__ == '__main__':
    # Initialize DB on startup
    init_db()
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Sahaaya Backend API on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
