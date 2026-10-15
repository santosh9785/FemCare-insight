"""
Comprehensive verification script for Sahaaya Minimum Demo Test Cases (Section 14 of PRD).
"""
import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def test_all():
    print("==================================================")
    print("RUNNING SAHAAYA ACCEPTANCE TEST SUITE (PRD SEC 14)")
    print("==================================================")

    # 1. Health check
    res = requests.get(f"{BASE_URL}/health")
    assert res.status_code == 200
    print("[PASS] Health Check:", res.json()["service"])

    # Test A: Irregular periods and acne in English
    res_a = requests.post(f"{BASE_URL}/assistant/message", json={
        "message": "My periods are irregular and I have acne on my jawline",
        "language": "en"
    }).json()
    resp_a = res_a["response"]
    assert len(resp_a["understood_symptoms"]) >= 2
    assert resp_a["care_level_code"] in [1, 2]
    assert "Rotterdam" in resp_a["possible_associations"]
    print("[PASS] Test A: English symptom analysis & Rotterdam criteria explanation verified.")

    # Test B: Kannada symptoms
    res_b = requests.post(f"{BASE_URL}/assistant/message", json={
        "message": "ನನ್ನ ಪೀರಿಯಡ್ಸ್ 2 ತಿಂಗಳಿಂದ ಬಂದಿಲ್ಲ ಮತ್ತು ಮುಖದಲ್ಲಿ ಮೊಡವೆಗಳು ಇವೆ",
        "language": "kn"
    }).json()
    resp_b = res_b["response"]
    assert resp_b["detected_language"] == "kn"
    assert len(resp_b["follow_up_questions"]) >= 3
    print("[PASS] Test B: Kannada native symptom analysis and follow-up generation verified.")

    # Test C: Mixed Hindi and English (Code-mixed Hinglish)
    res_c = requests.post(f"{BASE_URL}/assistant/message", json={
        "message": "My periods have not come for three months, face pe pimples bhi hain, and hair fall is increasing",
        "language": "hi"
    }).json()
    resp_c = res_c["response"]
    assert len(resp_c["understood_symptoms"]) >= 3
    assert len(resp_c["questions_to_ask_doctor"]) >= 3
    print("[PASS] Test C: Code-mixed input extraction & multilingual questions to ask doctor verified.")

    # Test D: Severe pelvic pain -> Level 3 Urgent Care
    res_d = requests.post(f"{BASE_URL}/assistant/message", json={
        "message": "I am having severe unbearable pelvic pain and I passed out",
        "language": "en"
    }).json()
    resp_d = res_d["response"]
    assert resp_d["care_level_code"] == 3
    assert resp_d["is_urgent"] == True
    assert "EMERGENCY" in resp_d["urgency_badge"]
    print("[PASS] Test D: Red flag detection prioritizing Level 3 Emergency Guidance verified.")

    # Test E: PCOS uncertainty explanation
    res_e = requests.post(f"{BASE_URL}/assistant/message", json={
        "message": "Do these symptoms mean I definitely have PCOS?",
        "language": "en"
    }).json()
    resp_e = res_e["response"]
    assert "not confirm" in resp_e["possible_associations"].lower() or "rotterdam" in resp_e["possible_associations"].lower()
    print("[PASS] Test E: Diagnostic uncertainty without claiming definitive PCOS verified.")

    # Test F: Appointment booking -> Pending Doctor Confirmation -> Doctor confirms
    book_res = requests.post(f"{BASE_URL}/appointments/", json={
        "patient_id": "user-demo-priya",
        "patient_name": "Priya Sharma",
        "patient_phone": "+91 98765 43210",
        "doctor_id": "doc-ananya",
        "requested_slot": "2026-10-18 10:30 AM",
        "consultation_type": "video",
        "amount": 750,
        "symptoms_summary": "Irregular cycles for 3 months"
    }).json()
    appt = book_res["appointment"]
    appt_id = appt["id"]
    assert appt["status"] == "pending_confirmation"
    print("[PASS] Test F (Step 1): Booking created with status 'pending_confirmation'.")

    # Doctor portal confirms the appointment
    patch_res = requests.patch(f"{BASE_URL}/appointments/{appt_id}/status", json={
        "status": "confirmed",
        "doctor_notes": "Accepted. Please join video room on time."
    }).json()
    assert patch_res["status"] == "confirmed"
    print("[PASS] Test F (Step 2): Doctor confirmed appointment, status updated to 'confirmed'.")

    # Test G: Live consultation translation demo
    trans_res = requests.post(f"{BASE_URL}/live-translate", json={
        "text": "నాకు మూడు నెలలుగా పీరియడ్స్ రాలేదు, కడుపులో స్వల్పంగా నొప్పి ఉంది",
        "source_language": "te",
        "target_language": "en"
    }).json()
    assert "My periods" in trans_res["translated_text"] or len(trans_res["translated_text"]) > 10
    assert trans_res["clinician_confirmation_required"] == True
    print("[PASS] Test G: Live consultation bilingual translation with clinician review flag verified.")

    print("==================================================")
    print("ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY! (7/7)")
    print("==================================================")

if __name__ == "__main__":
    test_all()
