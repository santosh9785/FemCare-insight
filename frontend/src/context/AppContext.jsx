import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' }
];

export const UI_STRINGS = {
  en: {
    appName: 'FemCare Insight',
    tagline: 'Your Multilingual Women’s Health Companion',
    getStarted: 'Get Started',
    exploreHealth: 'Explore Women’s Health',
    heroTitle: 'Your health deserves understanding, not judgment.',
    heroSubtitle: 'Not sure how to explain what you’re feeling? You’re welcome to share your concerns here, in your own words and your own language. FemCare Insight helps you understand health information, explore possible next steps and find the right care when you need it.',
    trustNote: 'Your concerns matter. Share only what you’re comfortable sharing. This assistant provides health information, not a medical diagnosis.',
    dashboard: 'Dashboard',
    aiAssistant: 'AI Health Assistant',
    myTracker: 'Cycle & Symptoms',
    pcosHub: 'PCOS Learning Hub',
    findDoctor: 'Find a Doctor',
    appointments: 'Appointments',
    doctorPortal: 'Doctor Portal',
    liveTranslate: 'Live Consultation Translate',
    reports: 'Medical Reports',
    medicineOrder: 'Medicines (Demo)',
    notifications: 'Notifications',
    signOut: 'Sign Out',
    demoModeNotice: 'Demo Mode Active — Hackathon Evaluation'
  },
  kn: {
    appName: 'ಸಹಾಯಾ',
    tagline: 'ನಿಮ್ಮ ಬಹುಭಾಷಾ ಮಹಿಳಾ ಆರೋಗ್ಯ ಸಹವರ್ತಿ',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    exploreHealth: 'ಮಹಿಳಾ ಆರೋಗ್ಯ ತಿಳಿಯಿರಿ',
    heroTitle: 'ನಿಮ್ಮ ಆರೋಗ್ಯಕ್ಕೆ ತಿಳುವಳಿಕೆ ಮತ್ತು ಕಾಳಜಿಯ ಅಗತ್ಯವಿದೆ.',
    heroSubtitle: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ವಿವರಿಸಲು ಹಿಂಜರಿಕೆ ಬೇಡ. ನಿಮ್ಮ ಸ್ವಂತ ಭಾಷೆ ಮತ್ತು ಶಬ್ದಗಳಲ್ಲಿ ಮುಕ್ತವಾಗಿ ಹಂಚಿಕೊಳ್ಳಿ. ಸರಿಯಾದ ಮಾಹಿತಿ ಮತ್ತು ಸೂಕ್ತ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಲು ಸಹಾಯಾ ನಿಮ್ಮ ಜೊತೆಗಿದೆ.',
    trustNote: 'ನಿಮ್ಮ ಆರೋಗ್ಯವೇ ಮುಖ್ಯ. ಈ ಸಹಾಯಕಿ ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿ ನೀಡುತ್ತದೆ, ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ.',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    aiAssistant: 'AI ಆರೋಗ್ಯ ಸಹಾಯಕ',
    myTracker: 'ಮುಟ್ಟಿನ ಟ್ರ್ಯಾಕರ್',
    pcosHub: 'PCOS ಮಾಹಿತಿ ಕೇಂದ್ರ',
    findDoctor: 'ವೈದ್ಯರನ್ನು ಹುಡುಕಿ',
    appointments: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
    doctorPortal: 'ವೈದ್ಯರ ಪೋರ್ಟಲ್',
    liveTranslate: 'ನೇರ ಸಮಾಲೋಚನೆ ಭಾಷಾಂತರ',
    reports: 'ವೈದ್ಯಕೀಯ ವರದಿಗಳು',
    medicineOrder: 'ಔಷಧಗಳು (ಡೆಮೊ)',
    notifications: 'ಸೂಚನೆಗಳು',
    signOut: 'ನಿರ್ಗಮಿಸಿ',
    demoModeNotice: 'ಡೆಮೊ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ'
  },
  te: {
    appName: 'సహాయ',
    tagline: 'మీ బహుభాషా మహిళా ఆరోగ్య సహచరుడు',
    getStarted: 'ప్రారంభించండి',
    exploreHealth: 'ఆరోగ్య సమాచారం చూడండి',
    heroTitle: 'మీ ఆరోగ్యానికి అర్థం చేసుకునే సహృదయత కావాలి.',
    heroSubtitle: 'మీ భావనలను ఎలా వ్యక్తపరచాలో తెలియకపోయినా, మీ సొంత భాషలో మరియు మాటలలో నిర్భయంగా చెప్పవచ్చు. సరైన సమాచారం మరియు తగిన వైద్య సంరక్షణను కనుగొనడంలో సహాయ మీకు తోడుగా ఉంటుంది.',
    trustNote: 'మీ భావనలు ముఖ్యమైనవి. ఈ అసిస్టెంట్ కేవలం సమాచారం అందిస్తుంది, రోగ నిర్ధారణ కాదు.',
    dashboard: 'డ్యాష్‌బోర్డ్',
    aiAssistant: 'AI ఆరోగ్య అసిస్టెంట్',
    myTracker: 'పీరియడ్ ట్రాకర్',
    pcosHub: 'PCOS నాలెడ్జ్ హబ్',
    findDoctor: 'డాక్టర్‌ను వెతకండి',
    appointments: 'అపాయింట్‌మెంట్లు',
    doctorPortal: 'డాక్టర్ పోర్టల్',
    liveTranslate: 'లైవ్ అనువాదం',
    reports: 'మెడికల్ రిపోర్ట్స్',
    medicineOrder: 'మందులు (డెమో)',
    notifications: 'నోటిఫికేషన్లు',
    signOut: 'లాగ్ అవుట్',
    demoModeNotice: 'డెమో మోడ్ యాక్టివ్‌గా ఉంది'
  },
  hi: {
    appName: 'सहाया',
    tagline: 'आपकी बहुभाषी महिला स्वास्थ्य साथी',
    getStarted: 'शुरू करें',
    exploreHealth: 'स्वास्थ्य जानकारी देखें',
    heroTitle: 'आपका स्वास्थ्य समझ का हकदार है, निर्णय का नहीं।',
    heroSubtitle: 'क्या आप समझ नहीं पा रही हैं कि अपनी समस्या कैसे बताएं? अपनी भाषा में, अपने शब्दों में बेझिझक साझा करें। सहाया आपको सही स्वास्थ्य जानकारी और उपयुक्त देखभाल तक पहुंचने में मदद करता है।',
    trustNote: 'आपकी चिंताएं महत्वपूर्ण हैं। यह सहायक स्वास्थ्य जानकारी प्रदान करता है, चिकित्सीय निदान नहीं।',
    dashboard: 'डैशबोर्ड',
    aiAssistant: 'AI स्वास्थ्य सहायक',
    myTracker: 'पीरियड ट्रैकर',
    pcosHub: 'PCOS ज्ञान केंद्र',
    findDoctor: 'डॉक्टर खोजें',
    appointments: 'अपॉइंटमेंट',
    doctorPortal: 'डॉक्टर पोर्टल',
    liveTranslate: 'लाइव अनुवाद परामर्श',
    reports: 'मेडिकल रिपोर्ट्स',
    medicineOrder: 'दवाइयां (डेमो)',
    notifications: 'सूचनाएं',
    signOut: 'लॉग आउट',
    demoModeNotice: 'डेमो मोड सक्रिय है'
  },
  ta: {
    appName: 'சஹாயா',
    tagline: 'உங்கள் பன்மொழி பெண்கள் சுகாதார துணைவர்',
    getStarted: 'தொடங்குங்கள்',
    exploreHealth: 'மகளிர் நலம் அறிய',
    heroTitle: 'உங்கள் ஆரோக்கியம் புரிதலை விரும்புகிறது, தீர்ப்பையல்ல.',
    heroSubtitle: 'உங்கள் அறிகுறிகளை விவரிக்க தயக்கமா? உங்கள் சொந்த மொழியில் தயக்கமின்றி பகிருங்கள். சஹாயா உங்களுக்கு மருத்துவத் தகவல்களை எளிதாகப் புரியவைத்து சரியான சிகிச்சைக்கு வழிகாட்டுகிறது.',
    trustNote: 'உங்கள் நலம் முக்கியமானது. இந்த உதவியாளர் சுகாதார வழிகாட்டுதலை மட்டுமே வழங்குகிறது, நோயறிதல் அல்ல.',
    dashboard: 'டாஷ்போர்டு',
    aiAssistant: 'AI சுகாதார உதவியாளர்',
    myTracker: 'மாதவிடாய் டிராக்கர்',
    pcosHub: 'PCOS தகவல் மையம்',
    findDoctor: 'மருத்துவரைத் தேடுங்கள்',
    appointments: 'முன்பதிவுகள்',
    doctorPortal: 'மருத்துவர் தளம்',
    liveTranslate: 'நேரடி மொழிபெயர்ப்பு',
    reports: 'மருத்துவ அறிக்கைகள்',
    medicineOrder: 'மருந்துகள் (டெமோ)',
    notifications: 'அறிவிப்புகள்',
    signOut: 'வெளியேறு',
    demoModeNotice: 'டெமோ பயன்முறை செயலில் உள்ளது'
  }
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('femcare_user');
    return saved ? JSON.parse(saved) : {
      id: 'user-demo-priya',
      display_name: 'Priya Sharma',
      email: 'priya@femcare.demo',
      role: 'patient',
      preferred_language: 'en'
    };
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('femcare_lang') || 'en';
  });

  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('femcare_role') || 'patient';
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('femcare_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('femcare_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('femcare_user', JSON.stringify(user));
      loadNotifications();
    } else {
      localStorage.removeItem('femcare_user');
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const targetId = activeRole === 'doctor' ? (user?.id || 'doc-santosh') : (user?.id || 'user-demo-priya');
      const res = await api.getNotifications(targetId);
      if (res.notifications) {
        setNotifications(res.notifications);
        setUnreadCount(res.notifications.filter(n => !n.read_at).length);
      }
    } catch (e) {
      console.warn('Could not fetch notifications:', e);
    }
  };

  const loginAsDemo = async (role = 'patient', lang = null) => {
    try {
      const selectedLang = lang || language;
      const res = await api.demoLogin(role, selectedLang);
      if (res.user) {
        setUser(res.user);
        setActiveRole(res.user.role);
        if (lang) setLanguage(lang);
      }
    } catch (e) {
      // Local fallback
      const demoUser = role === 'doctor'
        ? { id: 'doc-santosh', display_name: 'Dr. Santosh (MD, OB-GYN)', email: 'santosh1@gmail.com', role: 'doctor', preferred_language: 'en' }
        : { id: 'user-demo-priya', display_name: 'Priya Sharma', email: 'priya@femcare.demo', role: 'patient', preferred_language: 'en' };
      setUser(demoUser);
      setActiveRole(role);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('femcare_user');
  };

  const t = UI_STRINGS[language] || UI_STRINGS.en;

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      language,
      setLanguage,
      activeRole,
      setActiveRole,
      loginAsDemo,
      logout,
      t,
      notifications,
      unreadCount,
      loadNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
