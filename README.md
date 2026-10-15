# Sahaaya — Women's Health Companion

> Your health deserves understanding, not judgment.

Sahaaya is an AI-powered, multilingual women's health support platform designed to help women understand health information, describe symptoms comfortably, track menstrual cycles, and connect with healthcare professionals.

## Key Features

- **Multilingual AI Assistant:** Helps users explain symptoms in English, Kannada, Telugu, Hindi, and Tamil, including mixed-language messages.
- **Health Guidance:** Explains possible causes, uncertainty, next steps, and warning signs without claiming to diagnose conditions.
- **PCOS Knowledge Hub:** Provides educational information, myth-busting content, and questions to discuss with a doctor.
- **Cycle and Symptom Tracker:** Supports optional tracking of menstrual cycles and symptoms.
- **Doctor Discovery and Appointments:** Helps users explore doctors and manage appointment requests.
- **Live Consultation Translation:** Demonstrates language assistance for consultations, with clinician verification.
- **Reports Explainer:** Explains common medical terminology in accessible language.

## Technology Stack

- **Frontend:** React, Vite, and JavaScript
- **Backend:** Python and Flask REST API
- **Database:** SQLite for local/demo operation
- **Optional integrations:** Supabase authentication and database; Gemini API for AI-generated responses

## Run Locally

### Backend

```bash
cd backend
python -m pip install -r requirements.txt
python models/database.py
python app.py
```

The backend is expected to run at `http://127.0.0.1:5000`.

### Frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## Environment Configuration

See `backend/.env.example` and `frontend/.env.example` for the required environment variable names.

Create local `.env` files when needed and add real credentials only to local environment files or your hosting provider's secure environment settings. Never commit API keys, passwords, or private credentials.

## Testing

Run the backend acceptance tests with:

```bash
python backend/tests/verify_acceptance_criteria.py
```

## Safety Notice

Sahaaya is an educational health-support prototype, not a substitute for a qualified healthcare professional or emergency medical care. AI-generated information may be incomplete or incorrect. Users should seek professional medical advice when needed.

## Project Status

Developed as a women's health technology project. Some integrations and workflows may require additional configuration before production use.
