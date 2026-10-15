const API_BASE = '/api';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(displayName, email, password, preferredLanguage, role = 'patient') {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: displayName,
        email,
        password,
        preferred_language: preferredLanguage,
        role
      })
    });
    return res.json();
  },

  async demoLogin(role = 'patient', language = 'en') {
    const res = await fetch(`${API_BASE}/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, language })
    });
    return res.json();
  },

  // Assistant
  async sendMessage(message, language = 'en', userId = 'user-demo-priya', conversationId = null) {
    const res = await fetch(`${API_BASE}/assistant/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        language,
        user_id: userId,
        conversation_id: conversationId
      })
    });
    return res.json();
  },

  async getConversations(userId = 'user-demo-priya') {
    const res = await fetch(`${API_BASE}/assistant/conversations?user_id=${userId}`);
    return res.json();
  },

  async getConversationDetail(convId) {
    const res = await fetch(`${API_BASE}/assistant/conversations/${convId}`);
    return res.json();
  },

  async deleteConversation(convId) {
    const res = await fetch(`${API_BASE}/assistant/conversations/${convId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Tracker
  async getTrackerData(userId = 'user-demo-priya') {
    const res = await fetch(`${API_BASE}/tracker/?user_id=${userId}`);
    return res.json();
  },

  async logCycle(data) {
    const res = await fetch(`${API_BASE}/tracker/cycles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async logSymptom(data) {
    const res = await fetch(`${API_BASE}/tracker/symptoms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteRecord(recordId) {
    const res = await fetch(`${API_BASE}/tracker/records/${recordId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Doctors
  async getDoctors(specialty = '', language = '') {
    const params = new URLSearchParams();
    if (specialty) params.append('specialty', specialty);
    if (language) params.append('language', language);
    const res = await fetch(`${API_BASE}/doctors/?${params.toString()}`);
    return res.json();
  },

  async getDoctorSlots(docId, date) {
    const res = await fetch(`${API_BASE}/doctors/${docId}/slots?date=${date}`);
    return res.json();
  },

  // Appointments
  async getAppointments(userId = null, doctorId = null) {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (doctorId) params.append('doctor_id', doctorId);
    const res = await fetch(`${API_BASE}/appointments/?${params.toString()}`);
    return res.json();
  },

  async createAppointment(appointmentData) {
    const res = await fetch(`${API_BASE}/appointments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    return res.json();
  },

  async updateAppointmentStatus(apptId, status, confirmedSlot = null, doctorNotes = '') {
    const res = await fetch(`${API_BASE}/appointments/${apptId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        confirmed_slot: confirmedSlot,
        doctor_notes: doctorNotes
      })
    });
    return res.json();
  },

  // Reports
  async getReports(userId = 'user-demo-priya') {
    const res = await fetch(`${API_BASE}/reports?user_id=${userId}`);
    return res.json();
  },

  async uploadReport(data) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async explainTerm(term) {
    const res = await fetch(`${API_BASE}/explain-term`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term })
    });
    return res.json();
  },

  async getReferrals(userId = 'user-demo-priya') {
    const res = await fetch(`${API_BASE}/referrals?user_id=${userId}`);
    return res.json();
  },

  // Live Consultation Translation
  async translateConsultation(text, sourceLanguage, targetLanguage) {
    const res = await fetch(`${API_BASE}/live-translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        source_language: sourceLanguage,
        target_language: targetLanguage
      })
    });
    return res.json();
  },

  // Notifications
  async getNotifications(userId = 'user-demo-priya') {
    const res = await fetch(`${API_BASE}/notifications?user_id=${userId}`);
    return res.json();
  },

  async markNotificationRead(notifId) {
    const res = await fetch(`${API_BASE}/notifications/${notifId}/read`, {
      method: 'PATCH'
    });
    return res.json();
  }
};
