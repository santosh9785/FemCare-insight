"""
Safety and Triage Service for Sahaaya Women's Health Platform.
Implements 3-tier care guidance and red flag detection according to clinical PRD standards.
"""
import re

RED_FLAGS = [
    {
        "id": "severe_pelvic_pain",
        "patterns": [r"severe pain", r"unbearable pain", r"extreme pain", r"excruciating", r"can't stand", r"severe abdominal", r"fainting", r"passed out", r"dizzy.*fall", r"chakkar aana", r"behosh", r"bahut jyada dard", r"sahan nahi ho raha", r"tೀವ್ರ ನೋವು", r"తీవ్రమైన నొప్పి", r"கடுமையான வலி"],
        "reason": "Severe acute pelvic or abdominal pain or syncopal episodes (fainting) may indicate acute gynecological or abdominal emergencies (e.g. ovarian torsion, ruptured cyst, or ectopic pregnancy).",
        "action": "Seek immediate emergency medical evaluation at the nearest hospital emergency room."
    },
    {
        "id": "heavy_flooding_bleeding",
        "patterns": [r"soaking.*pad.*hour", r"flooding", r"blood clots.*lemon", r"continuous bleeding", r"blood pouring", r"huge clots", r"bahut jyada bleeding", r"raktasrava", r"ಅತಿಯಾದ ರಕ್ತಸ್ರಾವ", r"ఎక్కువ రక్తస్రావం", r"அதிக இரத்தப்போக்கு"],
        "reason": "Bleeding that soaks through one or more sanitary pads/tampons per hour for consecutive hours or large blood clots can lead to significant blood loss and acute anemia.",
        "action": "Urgent in-person clinical assessment is recommended immediately."
    },
    {
        "id": "pregnancy_with_pain",
        "patterns": [r"pregnant.*pain", r"positive test.*bleeding", r"pregnancy.*spotting.*cramp", r"missed period.*sharp pain", r"garbhavastha.*dard"],
        "reason": "Sharp or one-sided pelvic pain with spotting or bleeding when pregnancy is possible is a red flag for ectopic pregnancy until proven otherwise by ultrasound.",
        "action": "Immediate emergency obstetric/gynecological evaluation is required without delay."
    }
]

GENERAL_DISCLAIMER = (
    "Sahaaya is an educational AI health companion, not a licensed medical practitioner. "
    "This guidance is for informational and supportive purposes only and does not establish a diagnosis, "
    "provide prescriptions, or replace formal clinical judgment from a qualified doctor."
)

DISCLAIMER_BY_LANG = {
    "en": GENERAL_DISCLAIMER,
    "kn": "ಸಹಾಯಾ ಶೈಕ್ಷಣಿಕ AI ಆರೋಗ್ಯ ಸಹವರ್ತಿಯಾಗಿದೆ, ವೈದ್ಯರಲ್ಲ. ಈ ಮಾಹಿತಿಯು ರೋಗನಿರ್ಣಯ ಅಥವಾ ಔಷಧಿ ಚೀಟಿಯಲ್ಲ. ದಯವಿಟ್ಟು ಅರ್ಹ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    "te": "సహాయ ఒక విద్యా AI ఆరోగ్య సహచరుడు, వైద్యుడు కాదు. ఈ సమాచారం రోగ నిర్ధారణ లేదా చికిత్స కాదు. దయచేసి అర్హత కలిగిన వైద్యుడిని సంప్రదించండి.",
    "hi": "सहाया एक शैक्षणिक AI स्वास्थ्य साथी है, डॉक्टर नहीं। यह जानकारी चिकित्सीय निदान या नुस्खा नहीं है। कृपया योग्य चिकित्सक से परामर्श लें।",
    "ta": "சஹாயா ஒரு கல்வி சார்ந்த AI சுகாதார துணைவர், மருத்துவர் அல்ல. இந்த தகவல் மருத்துவ பரிசோதனை அல்லது மருந்தல்ல. தகுதிவாய்ந்த மருத்துவரை அணுகவும்."
}

def evaluate_safety_and_urgency(text: str, language: str = "en") -> dict:
    """
    Evaluates input text for clinical red flags and returns care level (1, 2, or 3).
    """
    clean_text = text.lower()
    matched_flags = []

    for rf in RED_FLAGS:
        for pat in rf["patterns"]:
            if re.search(pat, clean_text, re.IGNORECASE):
                matched_flags.append(rf)
                break

    if matched_flags:
        # Level 3: Urgent Emergency Care
        reasons = " ".join([f["reason"] for f in matched_flags])
        actions = " ".join([f["action"] for f in matched_flags])
        return {
            "level": 3,
            "level_name": "Level 3 — Urgent Emergency Evaluation Needed",
            "is_urgent": True,
            "urgency_badge": "EMERGENCY / RED FLAG",
            "reason": reasons,
            "recommended_action": actions,
            "self_care_allowed": False,
            "disclaimer": DISCLAIMER_BY_LANG.get(language, GENERAL_DISCLAIMER)
        }

    # Check for persistent / moderate symptoms -> Level 2
    level2_keywords = [
        "month", "months", "irregular", "missed", "delayed", "acne", "hair fall", "weight gain",
        "hirsutism", "pcos", "cyst", "period gap", "pelvic", "cramps", "spotting",
        "pimples", "mahina", "ruksawat", "masika", "ತಿಂಗಳು", "నెలలు", "மாதங்கள்"
    ]
    if any(k in clean_text for k in level2_keywords):
        return {
            "level": 2,
            "level_name": "Level 2 — Arrange Medical Consultation",
            "is_urgent": False,
            "urgency_badge": "CLINICAL EVALUATION RECOMMENDED",
            "reason": "Persistent cycle variations, hormonal skin/hair changes, or prolonged cycle delays warrant professional clinical examination (such as hormonal panel or pelvic ultrasound) to understand the root cause.",
            "recommended_action": "Schedule a consultation with a Gynecologist or Reproductive Endocrinologist. Maintain a cycle journal for your appointment.",
            "self_care_allowed": True,
            "disclaimer": DISCLAIMER_BY_LANG.get(language, GENERAL_DISCLAIMER)
        }

    # Level 1: Self-care and monitoring
    return {
        "level": 1,
        "level_name": "Level 1 — Self-care and Monitoring",
        "is_urgent": False,
        "urgency_badge": "SELF-CARE & TRACKING",
        "reason": "Symptoms appear mild, recent, or general. Supportive lifestyle habits and cycle logging can help observe patterns.",
        "recommended_action": "Maintain balanced hydration, consistent sleep (7-8 hrs), mindful nutrition, and track any recurring changes in your Sahaaya Tracker.",
        "self_care_allowed": True,
        "disclaimer": DISCLAIMER_BY_LANG.get(language, GENERAL_DISCLAIMER)
    }
