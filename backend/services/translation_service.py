"""
Live Consultation Translation Service for Sahaaya.
Enables doctor-patient bilingual communication across Indian languages and English.
Preserves medical terminology and flags translations for clinician verification.
"""

TRANSLATION_PAIRS = {
    # Telugu to English
    "నాకు మూడు నెలలుగా పీరియడ్స్ రాలేదు, కడుపులో స్వల్పంగా నొప్పి ఉంది": {
        "translated": "My periods have not come for three months, and I have mild discomfort in my lower abdomen.",
        "medical_terms": ["Amenorrhea / Missed cycle (3 months)", "Mild lower abdominal discomfort"]
    },
    "డాక్టర్ గారు, నాకు పీసీఓఎస్ ఉందా? బరువు కూడా పెరిగాను": {
        "translated": "Doctor, do I have PCOS? I have also gained weight recently.",
        "medical_terms": ["Patient query regarding PCOS", "Weight gain"]
    },
    # Kannada to English
    "ನನಗೆ ಎರಡು ತಿಂಗಳಿಂದ ಪೀರಿಯಡ್ಸ್ ಬಂದಿಲ್ಲ, ಮುಖದಲ್ಲಿ ಮೊಡವೆಗಳು ಹೆಚ್ಚಾಗಿವೆ": {
        "translated": "My periods have not arrived for two months, and acne breakouts on my face have increased.",
        "medical_terms": ["Secondary amenorrhea (2 months)", "Facial acne / hormonal breakouts"]
    },
    # Hindi to English
    "पीरियड्स तीन महीने से रुके हुए हैं और चेहरे पर पिंपल्स निकल रहे हैं": {
        "translated": "My periods have been delayed for three months and pimples are breaking out on my face.",
        "medical_terms": ["Oligomenorrhea / delayed cycles", "Facial cystic acne"]
    },
    # English to Telugu
    "Please do not worry. We will do a pelvic ultrasound and a basic hormone panel to check your ovaries.": {
        "translated": "దయచేసి ఆందోళన చెందకండి. మీ అండాశయాల పరిస్థితిని పరీక్షించడానికి మేము పెల్విక్ అల్ట్రాసೌండ్ మరియు ప్రాథమిక హార్మోన్ పరీక్షలను చేస్తాము.",
        "medical_terms": ["Pelvic Ultrasound (USG)", "Hormone blood panel (LH/FSH/TSH)"]
    },
    # English to Kannada
    "Please do not worry. We will do a pelvic ultrasound and a basic hormone panel to check your ovaries.": {
        "translated": "ದಯವಿಟ್ಟು ಚಿಂತಿಸಬೇಡಿ. ನಿಮ್ಮ ಅಂಡಾಶಯಗಳನ್ನು ಪರೀಕ್ಷಿಸಲು ನಾವು ಪೆಲ್ವಿಕ್ ಅಲ್ಟ್ರಾಸೌಂಡ್ ಮತ್ತು ಮೂಲ ಹಾರ್ಮೋನ್ ರಕ್ತ ಪರೀಕ್ಷೆಯನ್ನು ಮಾಡುತ್ತೇವೆ.",
        "medical_terms": ["Pelvic Ultrasound (USG)", "Hormone blood panel"]
    },
    # English to Hindi
    "Please do not worry. We will do a pelvic ultrasound and a basic hormone panel to check your ovaries.": {
        "translated": "कृपया चिंता न करें। आपके अंडाशय की जांच के लिए हम एक पेल्विक अल्ट्रासाउंड और बुनियादी हार्मोन रक्त परीक्षण करेंगे।",
        "medical_terms": ["Pelvic Ultrasound (USG)", "Hormone panel"]
    }
}

def translate_consultation_message(source_text: str, source_lang: str, target_lang: str) -> dict:
    """Translates clinical consultation messages preserving medical caveats."""
    clean = source_text.strip()
    
    # Check pre-mapped clinical phrases
    if clean in TRANSLATION_PAIRS:
        item = TRANSLATION_PAIRS[clean]
        return {
            "original_text": clean,
            "translated_text": item["translated"],
            "source_language": source_lang,
            "target_language": target_lang,
            "medical_terms_identified": item["medical_terms"],
            "clinician_confirmation_required": True,
            "disclaimer": "AI translation preview for supportive communication. Clinician must verify critical instructions."
        }

    # Contextual medical term extraction
    terms = []
    if any(k in clean.lower() for k in ["period", "bleeding", "cycle", "masika", "mahina"]):
        terms.append("Menstrual cycle observation")
    if any(k in clean.lower() for k in ["pain", "cramp", "dard", "novu", "noppi"]):
        terms.append("Pelvic / abdominal sensation")
    if any(k in clean.lower() for k in ["ultrasound", "scan", "usg"]):
        terms.append("Pelvic Ultrasound request")

    # Simple simulated translated response if custom text
    translated = clean
    if target_lang == "en" and source_lang in ["kn", "te", "hi", "ta"]:
        translated = f"[Translated to English]: {clean}"
    elif target_lang in ["kn", "te", "hi", "ta"] and source_lang == "en":
        sample_responses = {
            "kn": f"[ಕನ್ನಡ ಅನುವಾದ]: {clean}",
            "te": f"[తెలుగు అనువాదం]: {clean}",
            "hi": f"[हिंदी अनुवाद]: {clean}",
            "ta": f"[தமிழ் மொழிபெயர்ப்பு]: {clean}"
        }
        translated = sample_responses.get(target_lang, clean)

    return {
        "original_text": clean,
        "translated_text": translated,
        "source_language": source_lang,
        "target_language": target_lang,
        "medical_terms_identified": terms or ["General clinical query"],
        "clinician_confirmation_required": True,
        "disclaimer": "AI translation preview for supportive communication. Clinician must verify critical instructions."
    }
