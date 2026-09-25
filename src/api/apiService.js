/**
 * MediConnect API Service v2.0
 * All calls now hit the real Node.js + SQLite backend at localhost:5000.
 * Falls back gracefully to localStorage mock data if the server is offline.
 */

// Cross-browser compatible timeout signal helper
function timeoutSignal(ms) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

import { INITIAL_DEPARTMENTS, INITIAL_DOCTORS, CURRENT_PATIENT, INITIAL_APPOINTMENTS, INITIAL_PRESCRIPTIONS, INITIAL_LAB_REPORTS, AVAILABLE_LAB_PACKAGES, INITIAL_HOME_SAMPLE_ORDERS, INITIAL_ADMIN_STATS, INITIAL_SHARE_LINKS, INITIAL_USERS } from '../data/mockData.js';
import { firebaseService } from './firebaseService.js';

const BASE_URL = '/api';
let serverAvailable = null; // null triggers automatic health check to connect to Python SQLite backend

// LocalStorage Keys (fallback)
const STORAGE_KEYS = {
  DOCTORS: 'mediconnect_doctors',
  DEPARTMENTS: 'mediconnect_departments',
  PATIENT: 'mediconnect_patient',
  APPOINTMENTS: 'mediconnect_appointments',
  PRESCRIPTIONS: 'mediconnect_prescriptions',
  LAB_REPORTS: 'mediconnect_lab_reports',
  SAMPLE_ORDERS: 'mediconnect_sample_orders',
  ADMIN_STATS: 'mediconnect_admin_stats',
  SHARE_LINKS: 'mediconnect_share_links',
  USERS: 'mediconnect_users'
};

function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* noop */ }
}

export function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) setStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) setStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  if (!localStorage.getItem(STORAGE_KEYS.PATIENT)) setStored(STORAGE_KEYS.PATIENT, CURRENT_PATIENT);
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) setStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  if (!localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) setStored(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  if (!localStorage.getItem(STORAGE_KEYS.LAB_REPORTS)) setStored(STORAGE_KEYS.LAB_REPORTS, INITIAL_LAB_REPORTS);
  if (!localStorage.getItem(STORAGE_KEYS.SAMPLE_ORDERS)) setStored(STORAGE_KEYS.SAMPLE_ORDERS, INITIAL_HOME_SAMPLE_ORDERS);
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_STATS)) setStored(STORAGE_KEYS.ADMIN_STATS, INITIAL_ADMIN_STATS);
  if (!localStorage.getItem(STORAGE_KEYS.SHARE_LINKS)) setStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
}

// ── HTTP helpers ─────────────────────────────────────────────────────────────
async function checkServer() {
  if (serverAvailable !== null) return serverAvailable;
  try {
    const res = await fetch(`${BASE_URL}/health`, { signal: timeoutSignal(2000) });
    serverAvailable = res.ok;
  } catch (e) {
    serverAvailable = false;
  }
  return serverAvailable;
}

async function apiFetch(path, options = {}) {
  const online = await checkServer();
  if (!online) return null; // caller handles fallback

  try {
    const fetchOptions = {
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }
    const res = await fetch(`${BASE_URL}${path}`, fetchOptions);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    serverAvailable = false;
    return null;
  }
}

const delay = (ms = 100) => new Promise(r => setTimeout(r, ms));

// ── API Service ───────────────────────────────────────────────────────────────
export const apiService = {

  // DEPARTMENTS
  async getDepartments() {
    const data = await apiFetch('/departments');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  async addDepartment(deptData) {
    const data = await apiFetch('/departments', { method: 'POST', body: deptData });
    const newDept = data || { ...deptData, id: deptData.name.toLowerCase().replace(/\s+/g, '_') };
    firebaseService.saveDoc('departments', newDept.id, newDept);
    if (data) return data;
    await delay();
    const depts = getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    setStored(STORAGE_KEYS.DEPARTMENTS, [...depts, newDept]);
    return newDept;
  },

  // DOCTORS
  async getDoctors() {
    const data = await apiFetch('/doctors');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  async getDoctorById(id) {
    const data = await apiFetch(`/doctors/${id}`);
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS).find(d => d.id === id) || null;
  },

  async addDoctor(doctorData) {
    const data = await apiFetch('/doctors', { method: 'POST', body: doctorData });
    const newDoc = data || { ...doctorData, id: `doc-${Date.now()}`, rating: 5.0, reviewsCount: 1, isPractoVerified: true, availableToday: true, availableSlots: ['10:00 AM','12:00 PM','03:00 PM','05:00 PM'] };
    firebaseService.saveDoc('doctors', newDoc.id, newDoc);
    if (data) return data;
    await delay();
    const docs = getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    setStored(STORAGE_KEYS.DOCTORS, [newDoc, ...docs]);
    return newDoc;
  },

  async updateDoctor(id, updates) {
    const data = await apiFetch(`/doctors/${id}`, { method: 'PUT', body: updates });
    firebaseService.saveDoc('doctors', id, updates);
    if (data) return data;
    await delay();
    const docs = getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    const updated = docs.map(d => d.id === id ? { ...d, ...updates } : d);
    setStored(STORAGE_KEYS.DOCTORS, updated);
    return updated.find(d => d.id === id);
  },

  // PATIENT
  async getPatientProfile() {
    const data = await apiFetch('/patients/current');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.PATIENT, CURRENT_PATIENT);
  },

  async updatePatientProfile(profileData) {
    const data = await apiFetch('/patients/current', { method: 'PUT', body: profileData });
    firebaseService.saveDoc('patients', profileData.id || 'pat-1', profileData);
    if (data) return data;
    await delay();
    setStored(STORAGE_KEYS.PATIENT, profileData);
    return profileData;
  },

  // APPOINTMENTS
  async getAppointments() {
    const data = await apiFetch('/appointments');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },

  async bookAppointment(bookingData) {
    const data = await apiFetch('/appointments', { method: 'POST', body: bookingData });
    const newAppt = data || { ...bookingData, id: `APT-${Math.floor(1000 + Math.random() * 9000)}`, status: 'Upcoming', tokenNumber: `A-${Math.floor(10 + Math.random() * 90)}` };
    // Real-time Cloud Firestore Persistence
    firebaseService.saveDoc('appointments', newAppt.id, newAppt);
    if (data) return data;
    await delay(180);
    const appointments = getStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    setStored(STORAGE_KEYS.APPOINTMENTS, [newAppt, ...appointments]);
    const stats = getStored(STORAGE_KEYS.ADMIN_STATS, INITIAL_ADMIN_STATS);
    stats.todayAppointments += 1;
    stats.dailyRevenue += Number(bookingData.fee || 800);
    setStored(STORAGE_KEYS.ADMIN_STATS, stats);
    return newAppt;
  },

  async updateAppointmentStatus(id, newStatus) {
    const data = await apiFetch(`/appointments/${id}/status`, { method: 'PATCH', body: { status: newStatus } });
    firebaseService.saveDoc('appointments', id, { status: newStatus });
    if (data) return data;
    await delay();
    const appointments = getStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
    setStored(STORAGE_KEYS.APPOINTMENTS, updated);
    return updated.find(a => a.id === id);
  },

  // PRESCRIPTIONS
  async getPrescriptions() {
    const data = await apiFetch('/prescriptions');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  },

  async addPrescription(prescriptionData) {
    const data = await apiFetch('/prescriptions', { method: 'POST', body: prescriptionData });
    const newRx = data || { ...prescriptionData, id: `RX-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toISOString().split('T')[0] };
    // Real-time Cloud Firestore Persistence
    firebaseService.saveDoc('prescriptions', newRx.id, newRx);
    if (data) return data;
    await delay(150);
    const prescriptions = getStored(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    setStored(STORAGE_KEYS.PRESCRIPTIONS, [newRx, ...prescriptions]);
    if (prescriptionData.appointmentId) await this.updateAppointmentStatus(prescriptionData.appointmentId, 'Completed');
    return newRx;
  },

  // LAB
  async getLabReports() {
    const data = await apiFetch('/lab/reports');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.LAB_REPORTS, INITIAL_LAB_REPORTS);
  },

  async getLabPackages() {
    const data = await apiFetch('/lab/packages');
    if (data) return data;
    return AVAILABLE_LAB_PACKAGES;
  },

  async getHomeSampleOrders() {
    const data = await apiFetch('/lab/home-sample');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.SAMPLE_ORDERS, INITIAL_HOME_SAMPLE_ORDERS);
  },

  async bookHomeSample(orderData) {
    const data = await apiFetch('/lab/home-sample', { method: 'POST', body: orderData });
    if (data) return data;
    await delay(180);
    const orders = getStored(STORAGE_KEYS.SAMPLE_ORDERS, INITIAL_HOME_SAMPLE_ORDERS);
    const newOrder = {
      ...orderData, id: `HSL-${Math.floor(1000 + Math.random() * 9000)}`, status: 'requested',
      phlebotomist: { name: 'Assigning Phlebotomist...', phone: '--', rating: '4.9 ★', badge: 'Verified Specialist', vehicle: 'MediConnect Sample Bike' },
      timeline: [
        { step: 'requested', title: 'Order Placed', time: 'Just now', done: true, current: true },
        { step: 'assigned', title: 'Phlebotomist Assigned', time: 'Pending', done: false, current: false },
        { step: 'collected', title: 'Sample Collection at Doorstep', time: 'Pending', done: false, current: false },
        { step: 'processing', title: 'Lab Testing & Quality Check', time: 'Pending', done: false, current: false },
        { step: 'ready', title: 'Digital Report Ready', time: 'Pending', done: false, current: false },
      ]
    };
    setStored(STORAGE_KEYS.SAMPLE_ORDERS, [newOrder, ...orders]);
    return newOrder;
  },

  async updateSampleOrderStatus(id, newStatus) {
    const data = await apiFetch(`/lab/orders/${id}/status`, { method: 'PATCH', body: { status: newStatus } });
    if (data) return data;
    await delay();
    const orders = getStored(STORAGE_KEYS.SAMPLE_ORDERS, INITIAL_HOME_SAMPLE_ORDERS);
    const stepsOrder = ['requested', 'assigned', 'collected', 'processing', 'ready'];
    const currentIdx = stepsOrder.indexOf(newStatus);
    const updated = orders.map(ord => {
      if (ord.id !== id) return ord;
      const updatedTimeline = ord.timeline.map((step, idx) => ({ ...step, done: idx <= currentIdx, current: idx === currentIdx, time: idx <= currentIdx ? (step.time === 'Pending' ? 'Updated just now' : step.time) : 'Pending' }));
      const phlebo = newStatus !== 'requested' ? { name: 'Ramesh Kumar', phone: '+91 98112 84729', rating: '4.9 ★ (1,200+ samples)', badge: 'Vaccinated & Apollo Certified', vehicle: 'MediConnect Sample Bike (DL 3S CK 4912)' } : ord.phlebotomist;
      return { ...ord, status: newStatus, phlebotomist: phlebo, timeline: updatedTimeline };
    });
    setStored(STORAGE_KEYS.SAMPLE_ORDERS, updated);
    return updated.find(o => o.id === id);
  },

  // ADMIN STATS
  async getAdminStats() {
    const data = await apiFetch('/admin/stats');
    if (data) return data;
    await delay();
    return getStored(STORAGE_KEYS.ADMIN_STATS, INITIAL_ADMIN_STATS);
  },

  // ── PAN-INDIA DOCTOR EHR SHARE LINKS ─────────────────────────────────────
  async getShareLinks() {
    await delay();
    return getStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
  },

  async createShareLink(linkData) {
    await delay(120);
    const links = getStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
    const token = `SHR-${Math.floor(10000 + Math.random() * 90000)}`;
    const hours = Number(linkData.durationHours || 24);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + hours * 3600 * 1000).toISOString();

    const newLink = {
      id: token,
      token,
      patientId: linkData.patientId || 'pat-101',
      patientName: linkData.patientName || 'Tushar Tawar',
      uhid: linkData.uhid || 'MC-2026-9082',
      createdAt: now.toISOString(),
      expiresAt,
      durationHours: hours,
      password: String(linkData.password || '1234'),
      maxAccessCount: Number(linkData.maxAccessCount || 1),
      currentAccessCount: 0,
      doctorRecipient: linkData.doctorRecipient || 'Any Consulting Doctor in India',
      note: linkData.note || 'Full Medical History & Diagnostic Records Access',
      isRevoked: false,
      accessLogs: []
    };

    // Real-time Cloud Firestore Persistence
    firebaseService.saveDoc('share_links', newLink.id, newLink);

    const updated = [newLink, ...links];
    setStored(STORAGE_KEYS.SHARE_LINKS, updated);
    return newLink;
  },

  async getShareLinkByToken(token) {
    await delay(60);
    const links = getStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
    return links.find(l => l.token === token) || null;
  },

  async unlockShareLink(token, password, doctorInfo = {}) {
    await delay(180);
    const links = getStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
    const link = links.find(l => l.token === token);

    if (!link) {
      return { success: false, error: 'Share link not found or invalid.' };
    }
    if (link.isRevoked) {
      return { success: false, error: 'This access link has been revoked by the patient.' };
    }
    if (new Date() > new Date(link.expiresAt)) {
      return { success: false, error: 'This access link has expired. Please ask the patient for a new link.' };
    }
    if (link.currentAccessCount >= link.maxAccessCount) {
      return { success: false, error: `Access person limit reached (${link.maxAccessCount}/${link.maxAccessCount} views used).` };
    }
    if (String(link.password).trim() !== String(password).trim()) {
      return { success: false, error: 'Incorrect access passcode. Please check with the patient.' };
    }

    // Success: increment access count and log access
    const updatedCount = link.currentAccessCount + 1;
    const logEntry = {
      doctorName: doctorInfo.doctorName || 'Consulting Physician',
      regNo: doctorInfo.regNo || 'MCI-VERIFIED',
      clinic: doctorInfo.clinic || 'Pan-India Clinical OPD',
      city: doctorInfo.city || 'India',
      accessedAt: new Date().toISOString()
    };

    const updatedLinks = links.map(l => {
      if (l.token === token) {
        return {
          ...l,
          currentAccessCount: updatedCount,
          accessLogs: [logEntry, ...(l.accessLogs || [])]
        };
      }
      return l;
    });
    setStored(STORAGE_KEYS.SHARE_LINKS, updatedLinks);

    // Fetch patient data for the doctor view
    const patient = getStored(STORAGE_KEYS.PATIENT, CURRENT_PATIENT);
    const prescriptions = getStored(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    const labReports = getStored(STORAGE_KEYS.LAB_REPORTS, INITIAL_LAB_REPORTS);
    const appointments = getStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);

    return {
      success: true,
      link: { ...link, currentAccessCount: updatedCount },
      data: { patient, prescriptions, labReports, appointments }
    };
  },

  async revokeShareLink(token) {
    await delay(100);
    const links = getStored(STORAGE_KEYS.SHARE_LINKS, INITIAL_SHARE_LINKS);
    const updated = links.map(l => l.token === token ? { ...l, isRevoked: true } : l);
    setStored(STORAGE_KEYS.SHARE_LINKS, updated);
    return true;
  },

  async addPrescriptionFromShare(token, rxData) {
    await delay(200);
    const newRx = await this.addPrescription({
      ...rxData,
      notes: `${rxData.notes || ''} [Issued via Pan-India Shared Record Portal: ${token}]`
    });
    return newRx;
  },

  // ── USER AUTH & SECURITY ──────────────────────────────────────────────────
  async getUsers() {
    return getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  async registerUser(userData) {
    // Attempt backend registration in SQLite database
    const backendRes = await apiFetch('/auth/signup', {
      method: 'POST',
      body: userData
    });
    if (backendRes) {
      if (!backendRes.success) {
        throw new Error(backendRes.error || 'Registration failed');
      }
      return backendRes.user;
    }

    await delay(200);
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);

    const exists = users.some(u =>
      (userData.email && u.email?.toLowerCase() === userData.email.toLowerCase()) ||
      (userData.phone && u.phone?.replace(/\D/g, '') === userData.phone.replace(/\D/g, '')) ||
      (userData.username && u.username?.toLowerCase() === userData.username.toLowerCase())
    );

    if (exists) {
      throw new Error('An account with this email, phone number, or username already exists.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      securityPin: userData.securityPin || '1234',
      name: userData.name,
      role: userData.role || 'patient',
      status: userData.role === 'doctor' ? 'pending' : 'active',
      uhid: userData.role === 'patient' ? `MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      dept: userData.dept || (userData.role === 'doctor' ? 'General Medicine' : undefined),
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    };

    const updatedUsers = [...users, newUser];
    setStored(STORAGE_KEYS.USERS, updatedUsers);

    // If new user is patient, also update patient profile
    if (newUser.role === 'patient') {
      const patient = getStored(STORAGE_KEYS.PATIENT, CURRENT_PATIENT);
      const updatedPatient = {
        ...patient,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        uhid: newUser.uhid
      };
      setStored(STORAGE_KEYS.PATIENT, updatedPatient);
    }

    return newUser;
  },
  
  async verifyDoctorUser(userId) {
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = users.map(u => u.id === userId ? { ...u, status: 'active' } : u);
    setStored(STORAGE_KEYS.USERS, updated);
    return true;
  },

  async loginUser(identifier, password, role) {
    // Attempt SQLite backend login first
    const backendRes = await apiFetch('/auth/login', {
      method: 'POST',
      body: { identifier, password, role }
    });
    if (backendRes) {
      return backendRes;
    }

    await delay(150);
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const user = users.find(u => {
      const matchRole = !role || u.role === role;
      const matchUsername = u.username?.toLowerCase() === cleanId;
      const matchEmail = u.email?.toLowerCase() === cleanId;
      const matchPhone = cleanDigits && u.phone?.replace(/\D/g, '').endsWith(cleanDigits);
      return matchRole && (matchUsername || matchEmail || matchPhone);
    });

    if (!user) {
      return { success: false, error: 'No account found with this Email / Phone / Username for this role.' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again or use Forgot Password.' };
    }
    if (user.status === 'pending') {
      return { success: false, error: 'Your account is pending verification by an Admin. Please wait for approval.' };
    }

    return { success: true, user };
  },

  async resetPassword(identifier, securityPin, newPassword) {
    // Attempt SQLite backend password reset first
    const backendRes = await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { identifier, securityPin, newPassword }
    });
    if (backendRes) {
      return backendRes;
    }

    await delay(200);
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const userIdx = users.findIndex(u => {
      const matchUsername = u.username?.toLowerCase() === cleanId;
      const matchEmail = u.email?.toLowerCase() === cleanId;
      const matchPhone = cleanDigits && u.phone?.replace(/\D/g, '').endsWith(cleanDigits);
      return matchUsername || matchEmail || matchPhone;
    });

    if (userIdx === -1) {
      return { success: false, error: 'No account found matching this Email or Phone.' };
    }

    const user = users[userIdx];
    if (user.securityPin && user.securityPin !== securityPin.trim()) {
      return { success: false, error: 'Invalid 4-digit Security Key. Verification failed.' };
    }

    users[userIdx] = { ...user, password: newPassword };
    setStored(STORAGE_KEYS.USERS, users);
    return { success: true, user: users[userIdx] };
  }
};

// ── Chat Service ──────────────────────────────────────────────────────────────
export const chatService = {
  SESSION_KEY: 'mediconnect_chat_session',

  getSessionId() {
    let sid = localStorage.getItem(this.SESSION_KEY);
    if (!sid) {
      sid = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(this.SESSION_KEY, sid);
    }
    return sid;
  },

  async getHistory() {
    const sid = this.getSessionId();
    try {
      const res = await fetch(`${BASE_URL}/chat/history?sessionId=${sid}`, { signal: timeoutSignal(2000) });
      if (res.ok) return await res.json();
    } catch (e) { /* noop - fallback below */ }
    try { return JSON.parse(localStorage.getItem('mediconnect_chat_history') || '[]'); } catch (e) { return []; }
  },

  async saveMessage(sender, message, role = 'patient') {
    const sid = this.getSessionId();
    const msgObj = { id: `local-${Date.now()}`, sessionId: sid, sender, message, timestamp: new Date().toISOString(), role };
    try {
      const res = await fetch(`${BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, sender, message, role }),
        signal: timeoutSignal(2000)
      });
      if (res.ok) return await res.json();
    } catch (e) { /* noop - fallback below */ }
    const history = JSON.parse(localStorage.getItem('mediconnect_chat_history') || '[]');
    history.push(msgObj);
    localStorage.setItem('mediconnect_chat_history', JSON.stringify(history));
    return msgObj;
  },

  async clearHistory() {
    const sid = this.getSessionId();
    try {
      await fetch(`${BASE_URL}/chat/history?sessionId=${sid}`, { method: 'DELETE', signal: timeoutSignal(2000) });
    } catch (e) { /* noop */ }
    localStorage.removeItem('mediconnect_chat_history');
  }
};
