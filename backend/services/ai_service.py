"""
Multilingual AI Symptom Assistant Service for Sahaaya.
Handles natural language, code-mixed regional input (Kannada, Telugu, Hindi, Tamil, English),
follow-up questions, 6-part structured medical explanations, and safe care routing.
"""
import os
import json
import re
import requests
from services.safety_service import evaluate_safety_and_urgency, DISCLAIMER_BY_LANG, GENERAL_DISCLAIMER

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Language detection heuristics
LANG_SCRIPTS = {
    "kn": re.compile(r'[\u0C80-\u0CFF]'),
    "te": re.compile(r'[\u0C00-\u0C7F]'),
    "hi": re.compile(r'[\u0900-\u097F]'),
    "ta": re.compile(r'[\u0B80-\u0BFF]'),
}

# Code-mixed keyword indicators
CODE_MIXED_MARKERS = {
    "hi": ["bhi", "hain", "hai", "pe", "ka", "ki", "dard", "mahina", "ruk", "pimples", "gaya", "aaya", "hota"],
    "kn": ["inda", "illa", "matte", "ide", "nanna", "aagide", "nodiri", "swalpa", "beku"],
    "te": ["nundi", "raaledu", "unnaayi", "meeda", "chala", "undhi", "naaku", "enti"],
    "ta": ["ila", "varala", "irukku", "enakku", "romba", "vali", "epdi"]
}

def detect_language(text: str, user_preference: str = "en") -> str:
    """Detects script or code-mixed language or returns user preference."""
    if not text:
        return user_preference

    # Check native unicode scripts first
    for lang, pattern in LANG_SCRIPTS.items():
        if pattern.search(text):
            return lang

    clean = text.lower()
    words = set(re.findall(r'\b\w+\b', clean))

    # Check code-mixed markers
    for lang, markers in CODE_MIXED_MARKERS.items():
        if any(m in words for m in markers):
            return lang

    return user_preference if user_preference in ["en", "kn", "te", "hi", "ta"] else "en"

def analyze_symptoms_fallback(user_text: str, target_lang: str) -> dict:
    """
    Expert clinical fallback engine providing high-fidelity structured analysis
    even when external LLM API is unavailable or unconfigured.
    """
    clean_text = user_text.lower()
    safety = evaluate_safety_and_urgency(clean_text, target_lang)

    # Symptom feature extraction
    has_irregular_periods = any(w in clean_text for w in ["period", "menstrua", "irregular", "delay", "month", "months", "mahina", "tingalu", "nelalu", "missed", "ruk"])
    has_acne = any(w in clean_text for w in ["acne", "pimple", "pimples", "breakout", "skin", "chehra"])
    has_hair_fall = any(w in clean_text for w in ["hair", "hairfall", "fall", "thinning", "shedding", "baal", "koodalu", "ventrukalu"])
    has_weight_change = any(w in clean_text for w in ["weight", "gain", "vajan", "fat", "bloat", "mota"])
    has_pelvic_pain = any(w in clean_text for w in ["pain", "cramp", "cramps", "pelvic", "dard", "novu", "noppi", "vali"])
    has_pcos_query = "pcos" in clean_text or "pcod" in clean_text or "cyst" in clean_text

    # Synthesize understood items
    extracted_symptoms = []
    if has_irregular_periods:
        extracted_symptoms.append("Irregular or delayed menstrual cycles")
    if has_acne:
        extracted_symptoms.append("Persistent facial or jawline acne / breakouts")
    if has_hair_fall:
        extracted_symptoms.append("Excessive scalp hair shedding / thinning")
    if has_weight_change:
        extracted_symptoms.append("Unexplained weight fluctuations")
    if has_pelvic_pain:
        extracted_symptoms.append("Lower abdominal or pelvic discomfort")
    if not extracted_symptoms:
        extracted_symptoms.append("General reproductive / hormonal health inquiry")

    # Smart follow-up questions
    follow_ups = []
    if safety["level"] == 3:
        follow_ups = [
            "Are you currently experiencing sudden dizziness, confusion, or cold sweats?",
            "Is there any possibility of current pregnancy?",
            "Are you accompanied by a family member or friend to reach urgent clinical care immediately?"
        ]
    else:
        if has_irregular_periods:
            follow_ups.append("How many months or weeks has your cycle been irregular, and were they previously regular?")
        if has_acne or has_hair_fall:
            follow_ups.append("Did the skin breakouts or hair shedding coincide with periods of increased stress or weight change?")
        follow_ups.append("Have you noticed any unwanted facial hair growth (hirsutism) on the chin or upper lip?")
        follow_ups.append("Are you currently taking any hormonal medications, emergency contraceptives, or thyroid supplements?")
        if len(follow_ups) < 3:
            follow_ups.append("Have you ever had a pelvic ultrasound (USG) or thyroid (TSH) checkup in the past?")

    # Multilingual translation dictionary for structured cards
    localized_content = {
        "en": {
            "understood_prefix": "Based on what you shared, I noted:",
            "possible_associations": (
                "The combination of irregular or missed menstrual cycles together with hormonal acne and increased hair shedding "
                "is frequently seen in endocrine and metabolic shifts, such as Polycystic Ovary Syndrome (PCOS), elevated androgen activity, "
                "thyroid variations (hypothyroidism), or elevated prolactin/cortisol levels. "
                "Importantly, having these symptoms does NOT confirm a diagnosis of PCOS on its own. Clinicians use the international Rotterdam criteria, "
                "which require formal blood tests and a pelvic ultrasound alongside your clinical history."
            ),
            "why_it_matters": (
                "Hormones operate like an orchestra. When one hormone (like insulin, luteinizing hormone, or androgens) changes, it can temporarily "
                "pause regular ovulation, leading to cycle delays and stimulating sebaceous glands to cause acne. Understanding these patterns early "
                "empowers you to address metabolic wellness before symptoms become chronic."
            ),
            "what_to_do_next": [
                "Track your cycle start dates, flow intensity, and skin/hair changes in your Sahaaya Tracker.",
                "Schedule a routine consultation with a Gynecologist or Reproductive Endocrinologist for evaluation.",
                "Prioritize balanced meals with low-glycemic complex carbohydrates, consistent hydration, and 7-8 hours of restful sleep."
            ],
            "urgent_warning": "If you experience severe sudden lower abdominal stabbing pain, heavy flooding bleeding (soaking through a pad an hour), or fainting, seek emergency medical care immediately.",
            "questions_for_doctor": [
                "Do you recommend checking my hormone profile (FSH, LH, TSH, Total Testosterone, Fasting Insulin)?",
                "Would a pelvic ultrasound scan be beneficial to examine my ovaries and uterine lining?",
                "What personalized lifestyle, dietary, or clinical steps do you recommend for my symptoms?"
            ]
        },
        "kn": {
            "understood_prefix": "ನೀವು ಹಂಚಿಕೊಂಡ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ:",
            "possible_associations": (
                "ಅನಿಯಮಿತ ಅಥವಾ ವಿಳಂಬವಾದ ಮುಟ್ಟಿನ ಜೊತೆಗೆ ಮುಖದ ಮೊಡವೆಗಳು ಮತ್ತು ಕೂದಲು ಉದುರುವುದು ಹಾರ್ಮೋನ್ ಏರುಪೇರು, "
                "ಪಾಲಿಸಿಸ್ಟಿಕ್ ಓವರಿ ಸಿಂಡ್ರೋಮ್ (PCOS), ಥೈರಾಯ್ಡ್ ವ್ಯತ್ಯಾಸಗಳು ಅಥವಾ ಆಂಡ್ರೊಜೆನ್ ಹಾರ್ಮೋನ್ ಹೆಚ್ಚಳದ ಲಕ್ಷಣಗಳಾಗಿರಬಹುದು. "
                "ಆದರೆ ಈ ಲಕ್ಷಣಗಳ ಆಧಾರದ ಮೇಲೆ ಮಾತ್ರ PCOS ರೋಗನಿರ್ಣಯವನ್ನು ಖಚಿತಪಡಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. "
                "ವೈದ್ಯರು ರಕ್ತ ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ಪೆಲ್ವಿಕ್ ಸ್ಕ್ಯಾನಿಂಗ್ ಮೂಲಕ ಮಾತ್ರ ಸರಿಯಾದ ತಪಾಸಣೆ ಮಾಡುತ್ತಾರೆ."
            ),
            "why_it_matters": (
                "ಹಾರ್ಮೋನ್‌ಗಳಲ್ಲಿನ ಸಣ್ಣ ವ್ಯತ್ಯಾಸವು ನಿಯಮಿತ ಅಂಡೋತ್ಪತ್ತಿಯನ್ನು ನಿಧಾನಗೊಳಿಸುತ್ತದೆ, ಇದು ಮುಟ್ಟಿನ ವಿಳಂಬಕ್ಕೆ ಕಾರಣವಾಗುತ್ತದೆ. "
                "ಆರಂಭಿಕ ಹಂತದಲ್ಲೇ ಇದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು ಆರೋಗ್ಯಕರ ಜೀವನಶೈಲಿಗೆ ಸಹಾಯಕವಾಗಿದೆ."
            ),
            "what_to_do_next": [
                "ನಿಮ್ಮ ಮುಟ್ಟಿನ ದಿನಾಂಕಗಳು ಮತ್ತು ಬದಲಾವಣೆಗಳನ್ನು ಸಹಾಯಾ ಟ್ರ್ಯಾಕರ್‌ನಲ್ಲಿ ದಾಖಲಿಸಿಕೊಳ್ಳಿ.",
                "ಸರಿಯಾದ ಪರೀಕ್ಷೆಗಾಗಿ ಸ್ತ್ರೀರೋಗ ತಜ್ಞರನ್ನು (Gynecologist) ಭೇಟಿ ಮಾಡಿ.",
                "ಪೌಷ್ಟಿಕ ಆಹಾರ, ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯುವುದು ಮತ್ತು ದಿನಕ್ಕೆ 7-8 ಗಂಟೆಗಳ ಕಾಲ ನಿದ್ರೆಗೆ ಆದ್ಯತೆ ನೀಡಿ."
            ],
            "urgent_warning": "ತೀವ್ರವಾದ ಹೊಟ್ಟೆ ನೋವು, ಅತಿಯಾದ ರಕ್ತಸ್ರಾವ ಅಥವಾ ತಲೆತಿರುಗುವಿಕೆ ಕಂಡುಬಂದರೆ ತಕ್ಷಣ ತುರ್ತು ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.",
            "questions_for_doctor": [
                "ನನ್ನ ಹಾರ್ಮೋನ್ ಪರೀಕ್ಷೆ (TSH, LH, Testosterone) ಮಾಡಿಸುವುದು ಅಗತ್ಯವೇ?",
                "ನನಗೆ ಅಲ್ಟ್ರಾಸೌಂಡ್ ಸ್ಕ್ಯಾನ್ ಅಗತ್ಯವಿದೆಯೇ?",
                "ನನ್ನ ಲಕ್ಷಣಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಯಾವ ಕ್ರಮಗಳು ಉತ್ತಮ?"
            ]
        },
        "te": {
            "understood_prefix": "మీరు పంచుకున్న వివరాల ప్రకారం:",
            "possible_associations": (
                "క్రమం తప్పిన రుతుచక్రం, మొటిమలు మరియు జుట్టు రాలడం వంటి లక్షణాలు హార్మోన్ల అసమతుల్యత, "
                "పాలిసిస్టిక్ ఓవరీ సిండ్రోమ్ (PCOS), థైరాయిడ్ సమస్యలు లేదా ఆండ్రోజెన్ హార్మోన్ల పెరుగుదలతో సంబంధం కలిగి ఉండవచ్చు. "
                "లక్షణాల ఆధారంగా మాత్రమే PCOS అని నిర్ధారించలేము. "
                "వైద్యులచే అధికారిక రక్త పరీక్షలు మరియు పెల్విక్ అల్ట్రాసౌండ్ ద్వారా మాత్రమే ఖచ్చితమైన కారణం తెలుస్తుంది."
            ),
            "why_it_matters": (
                "హార్మోన్ల మార్పుల వల్ల అండం విడుదల కావడంలో ఆలస్యం జరిగి పీరియడ్స్ ఆలస్యం అవుతాయి. "
                "ఈ లక్షణాలను ముందుగానే అర్థం చేసుకోవడం ద్వారా సరైన వైద్య సంరక్షణ తీసుకోవచ్చు."
            ),
            "what_to_do_next": [
                "మీ పీరియడ్స్ మరియు లక్షణాలను సహాయా ట్రాకర్‌లో నమోదు చేసుకోండి.",
                "స్త్రీల వైద్య నిపుణురాలిని (Gynecologist) సంప్రదించి పరీక్ష చేయించుకోండి.",
                "సమతుల్య ఆహారం, తగినంత నిద్ర మరియు క్రమం తప్పని వ్యాయామం అలవాటు చేసుకోండి."
            ],
            "urgent_warning": "తీవ్రమైన కడుపు నొప్పి, విపరీతమైన రక్తస్రావం లేదా కళ్ళు తిరగడం ఉంటే వెంటనే అత్యవసర చికిత్స పొందండి.",
            "questions_for_doctor": [
                "నాకు హార్మోన్ పరీక్షలు (TSH, LH, టెస్టోస్టెరాన్) అవసరమా?",
                "పెల్విక్ అల్ట్రాసౌండ్ స్కాన్ అవసరమా?",
                "నాకు తగిన సురక్షితమైన చికిత్స మరియు జీవనశైలి ఏమిటి?"
            ]
        },
        "hi": {
            "understood_prefix": "आपके द्वारा साझा किए गए विवरण के अनुसार:",
            "possible_associations": (
                "अनियमित या देरी से मासिक धर्म, चेहरे पर मुंहासे (एक्ने) और बालों का झड़ना हार्मोनल असंतुलन, "
                "पॉलीसिस्टिक ओवरी सिंड्रोम (PCOS), थायरॉयड या एंड्रोजन हार्मोन के स्तर में बदलाव से जुड़े हो सकते हैं। "
                "कृपया ध्यान दें कि केवल इन लक्षणों से PCOS का निश्चित निदान नहीं होता। "
                "डॉक्टर रक्त परीक्षण (हार्मोन पैनल) और पेल्विक अल्ट्रासाउंड के बाद ही सही पुष्टि करते हैं।"
            ),
            "why_it_matters": (
                "हार्मोनल बदलाव सामान्य ओव्यूलेशन को प्रभावित कर सकते हैं, जिससे पीरियड में देरी होती है। "
                "समय रहते इन संकेतों को समझना और सही डॉक्टर की सलाह लेना बहुत महत्वपूर्ण है।"
            ),
            "what_to_do_next": [
                "सहाया ट्रैकर में अपने पीरियड की तारीखें और लक्षणों को नियमित रूप से नोट करें।",
                "उचित जांच के लिए स्त्री रोग विशेषज्ञ (Gynecologist) से परामर्श लें।",
                "संतुलित पौष्टिक आहार लें, पर्याप्त पानी पिएं और 7-8 घंटे की नींद लें।"
            ],
            "urgent_warning": "यदि अचानक पेट में तेज असहनीय दर्द हो, अत्यधिक रक्तस्राव हो या बेहोशी महसूस हो, तो तुरंत आपातकालीन चिकित्सा सहायता लें।",
            "questions_for_doctor": [
                "क्या मुझे हार्मोनल टेस्ट (LH, FSH, TSH, टेस्टोस्टेरोन) कराने की सलाह है?",
                "क्या मुझे पेल्विक अल्ट्रासाउंड सोनोग्राफी करानी चाहिए?",
                "मेरी स्थिति के लिए कौन से सुरक्षित जीवनशैली बदलाव उपयुक्त हैं?"
            ]
        },
        "ta": {
            "understood_prefix": "நீங்கள் பகிர்ந்த தகவலின்படி:",
            "possible_associations": (
                "மாதவிடாய் சுழற்சி தாமதம் அல்லது ஒழுங்கற்ற தன்மை, முகப்பரு மற்றும் முடி உதிர்தல் போன்றவை ஹார்மோன் சமநிலையின்மை, "
                "பாலிசிஸ்டிக் ஓவரி சிண்ட்ரோம் (PCOS), தைராய்டு மாற்றங்கள் அல்லது ஆண்ட்ரோஜன் அளவுகளுடன் தொடர்புடையதாக இருக்கலாம். "
                "இந்த அறிகுறிகள் மட்டுமே PCOS நோயைக் குறிக்காது. "
                "முறையான இரத்தப் பரிசோதனை மற்றும் அல்ட்ராசவுண்ட் ஸ்கேன் மூலம் மட்டுமே மருத்துவர்கள் இதை உறுதிப்படுத்த முடியும்."
            ),
            "why_it_matters": (
                "ஹார்மோன் மாற்றங்கள் முட்டை வெளியாவதை தாமதப்படுத்துவதால் மாதவிடாய் தள்ளிப்போகிறது. "
                "இதனை தொடக்கத்திலேயே கவனிப்பது உங்கள் நல்வாழ்வுக்கு நல்லது."
            ),
            "what_to_do_next": [
                "உங்கள் மாதவிடாய் சுழற்சி விவரங்களை சஹாயா டிராக்கரில் பதிவு செய்யுங்கள்.",
                "மகப்பேறு மருத்துவரிடம் (Gynecologist) ஆலோசனை பெறுங்கள்.",
                "சீரான உணவு, போதுமான நீர் மற்றும் நல்ல தூக்கத்தை உறுதி செய்யுங்கள்."
            ],
            "urgent_warning": "கடுமையான அடிவயிற்று வலி, அதிக இரத்தப்போக்கு அல்லது மயக்கம் ஏற்பட்டால் உடனடியாக அவசர மருத்துவ சிகிச்சை பெறவும்.",
            "questions_for_doctor": [
                "எனக்கு ஹார்மோன் பரிசோதனை (TSH, LH, Testosterone) தேவையா?",
                "அல்ட்ராசவுண்ட் ஸ்கேன் செய்ய வேண்டுமா?",
                "என் அறிகுறிகளை கட்டுப்படுத்த என்ன செய்ய வேண்டும்?"
            ]
        }
    }

    content = localized_content.get(target_lang, localized_content["en"])

    # If Level 3 urgent, tailor explanations to emergency safety
    if safety["level"] == 3:
        possible_assoc = (
            "The symptoms described (severe acute pain, heavy flooding bleeding, or syncopal episodes) require immediate "
            "clinical assessment to rule out conditions such as ectopic pregnancy, ruptured ovarian cysts, or ovarian torsion."
        ) if target_lang == "en" else content["urgent_warning"]
        next_steps = [
            "Seek immediate evaluation at an emergency department or nearest hospital.",
            "Do not take unprescribed painkillers or hot compresses until examined by a clinician.",
            "Have someone accompany you to the hospital."
        ]
    else:
        possible_assoc = content["possible_associations"]
        next_steps = content["what_to_do_next"]

    return {
        "detected_language": target_lang,
        "understood_symptoms": extracted_symptoms,
        "follow_up_questions": follow_ups,
        "general_explanation": content["why_it_matters"],
        "possible_associations": possible_assoc,
        "self_care_information": next_steps,
        "recommended_care_level": safety["level_name"],
        "care_level_code": safety["level"],
        "urgency_badge": safety["urgency_badge"],
        "is_urgent": safety["is_urgent"],
        "urgent_warning": content["urgent_warning"],
        "questions_to_ask_doctor": content["questions_for_doctor"],
        "medical_disclaimer": safety["disclaimer"],
        "ai_engine": "sahaaya-rule-guided-clinical-engine"
    }

def generate_symptom_response(user_text: str, user_lang: str = "en", conversation_history: list = None) -> dict:
    """
    Main entry point for AI Symptom Guidance.
    Uses LLM API if key is configured, with seamless fallback to clinical engine.
    """
    detected_lang = detect_language(user_text, user_lang)

    # First evaluate safety deterministically
    safety = evaluate_safety_and_urgency(user_text, detected_lang)

    # If GEMINI_API_KEY is available, attempt real LLM completion with structured format
    if GEMINI_API_KEY:
        try:
            system_prompt = (
                "You are Sahaaya, a compassionate multilingual women's health information assistant. "
                "Understand the user's symptoms in their own words, including Indian languages (Kannada, Telugu, Hindi, Tamil) and code-mixed speech. "
                f"Respond in the language: {detected_lang}. "
                "CRITICAL RULES: Do NOT diagnose or confirm medical conditions (e.g., do not say 'you have PCOS'). "
                "Explain uncertainties, provide safe self-care recommendations, ask 3 relevant follow-ups, and provide questions for a doctor. "
                "Return a strict JSON object with fields: "
                "detected_language, understood_symptoms (array), follow_up_questions (array of 3 strings), "
                "general_explanation (string), possible_associations (string), self_care_information (array of strings), "
                "recommended_care_level (string), urgent_warning (string), questions_to_ask_doctor (array of 3 strings)."
            )
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser health concern: {user_text}"}]}
                ],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.2
                }
            }
            res = requests.post(url, json=payload, timeout=6)
            if res.status_code == 200:
                data = res.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(raw_text)
                parsed["care_level_code"] = safety["level"]
                parsed["is_urgent"] = safety["is_urgent"]
                parsed["urgency_badge"] = safety["urgency_badge"]
                parsed["medical_disclaimer"] = safety["disclaimer"]
                parsed["ai_engine"] = "gemini-1.5-flash"
                return parsed
        except Exception as e:
            # Fall back smoothly to high-fidelity clinical engine
            pass

    # High-fidelity fallback engine
    fallback = analyze_symptoms_fallback(user_text, detected_lang)
    return fallback
