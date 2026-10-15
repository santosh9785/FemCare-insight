# Sahaaya — Your Multilingual Women's Health Companion

> **"Your health deserves understanding, not judgment."**

An AI-powered, multilingual women's health platform designed to help women comfortably explain symptoms in their own words and languages (English, Kannada, Telugu, Hindi, Tamil, and code-mixed speech), explore evidence-based health guidance without diagnostic alarmism, track cycles, and connect with qualified healthcare professionals.

---

## 🌟 Key Differentiators & Highlights

1. **Multilingual AI Symptom Assistant (P0)**:
   - Understands informal, code-mixed speech (e.g., Hinglish: *"My periods have not come for 3 months, face pe pimples bhi hain, and hair fall is increasing"*).
   - Generates 3–5 contextual follow-up questions.
   - Outputs a **6-part clinical response card**:
     1. *What I Understood*
     2. *What These Symptoms May Relate To* (explaining uncertainties; never diagnosing)
     3. *Why This Matters*
     4. *What You Can Do Next* (Level 1, 2, or 3 care guidance)
     5. *When to Seek Urgent Care* (Red flags)
     6. *Questions to Ask Your Doctor*
2. **3-Tier Safe Care Triage**:
   - **Level 1**: Self-care, sleep, nutrition, and tracking for mild/transient symptoms.
   - **Level 2**: Medical consultation recommended for persistent cycle variations or hormonal shifts.
   - **Level 3**: Emergency red flag triage for severe pelvic pain, fainting, or flooding bleeding.
3. **PCOS Knowledge Hub**:
   - Medically grounded in the international **Rotterdam Criteria**.
   - Myth busters debunking common fertility and dietary falsehoods.
   - Doctor consultation checklist.
4. **Cycle & Symptom Tracker**:
   - Optional, confidential logging with data deletion capabilities.
5. **Doctor Discovery & Booking Lifecycle**:
   - Filter by specialty and language (Kannada, Telugu, Hindi, Tamil, English).
   - Booking transitions to **Pending Doctor Confirmation** (Test F).
   - Dedicated **Doctor Portal** for clinicians (Dr. Ananya Sharma) to review patient concerns and confirm appointments.
6. **AI-Assisted Live Consultation Translation**:
   - Dual-language simulated consultation (Telugu/Kannada/Hindi <-> English) with mandatory clinician verification.
7. **Diagnostic Reports & AI Terminology Explainer**:
   - Safe lab uploads and plain-language explainers for terms like *follicles*, *endometrial thickness*, *TSH*, and *LH/FSH ratio*.

---

## 🏗️ Technical Architecture

- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons + React Router.
- **Backend**: Python Flask REST API with rule-guided clinical fallback engine & optional Gemini API integration.
- **Database & Auth**:
  - **Supabase ready**: Built-in `@supabase/supabase-js` integration for PostgreSQL & Authentication.
  - **Zero-config fallback**: Bundled SQLite database with rich synthetic seed data for instant evaluation out-of-the-box.

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
# In the project root:
cd backend
python -m pip install -r requirements.txt
python models/database.py  # Seeds SQLite database
python app.py             # Runs Flask API on http://127.0.0.1:5000
```

### 2. Frontend Setup
```bash
# In the frontend folder:
cd frontend
npm install
npm run dev               # Runs Vite on http://localhost:5173
```

---

## 🔑 Supabase Configuration (Optional)

To connect your Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Copy your **Project URL** and **Anon Key**.
3. Create `.env` in `frontend/`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Sahaaya will automatically activate live Supabase Authentication!

---

## 🧪 Minimum Demo Test Cases (Section 14 of PRD)

Run the automated test suite anytime:
```bash
python backend/tests/verify_acceptance_criteria.py
```
- **Test A**: Irregular periods and acne (English) -> Explains Rotterdam criteria without diagnosing.
- **Test B**: Kannada (ಕನ್ನಡ) symptom description -> Responds in native Kannada.
- **Test C**: Code-mixed input (Hinglish) -> Extracts all symptoms and provides doctor questions.
- **Test D**: Severe pelvic pain & fainting -> Triggers Level 3 Urgent Emergency Evaluation immediately.
- **Test E**: Diagnostic inquiry ("Do I definitely have PCOS?") -> Clearly explains uncertainty and required clinical tests.
- **Test F**: Booking workflow -> Created as `Pending Doctor Confirmation` -> Doctor confirms via Doctor Portal -> Status updates to `Confirmed by Doctor`.
- **Test G**: AI service fallback -> Graceful error handling without fabricated clinical advice.

---

## 👩‍⚕️ Clinician & Demo Accounts

### 🔒 Private Doctor Portal (Protected Clinical Access)
Doctor view and clinical records are strictly protected:
- **Doctor User ID / Email:** `santosh1@gmail.com`
- **Security Password:** `boss143`
- **Name:** Dr. Santosh, MD (OB-GYN)

### 🌸 Demo Patient Accounts
- **Patient**: Priya Sharma (`priya@sahaaya.demo`) — English / Hindi
- **Patient**: Deepa Hegde (`deepa@sahaaya.demo`) — Kannada (ಕನ್ನಡ)
- **Patient**: Lakshmi Rao (`lakshmi@sahaaya.demo`) — Telugu (తెలుగు)
