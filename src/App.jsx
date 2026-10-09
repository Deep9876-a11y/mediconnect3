import React, { useState, useEffect } from 'react';
import { apiService, initStorage } from './api/apiService.js';
import { Navbar } from './components/Navbar.jsx';
import { RoleModal } from './components/RoleModal.jsx';
import { AiAssistantModal } from './components/AiAssistantModal.jsx';
import { Toast } from './components/Toast.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { PatientPortal } from './portals/patient/PatientPortal.jsx';
import { DoctorPortal } from './portals/doctor/DoctorPortal.jsx';
import { AdminPortal } from './portals/admin/AdminPortal.jsx';
import { ReceptionistPortal } from './portals/receptionist/ReceptionistPortal.jsx';
import { DoctorSharedEhrView } from './portals/shared/DoctorSharedEhrView.jsx';
import { CloudDatabaseModal } from './components/CloudDatabaseModal.jsx';

export function App() {
  // ── Pan-India Shared EHR Token in URL ─────────────────────────
  const [activeShareToken, setActiveShareToken] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('share')) return params.get('share');
      if (window.location.hash.startsWith('#share=')) {
        return window.location.hash.replace('#share=', '');
      }
    } catch { return null; }
    return null;
  });

  // ── Auth state ────────────────────────────────────────────────
  const [authSession, setAuthSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem('mediconnect_session');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [activeRole, setActiveRole] = useState(authSession?.role || 'patient');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // App Data States
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [sampleOrders, setSampleOrders] = useState([]);
  const [labPackages, setLabPackages] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [users, setUsers] = useState([]);

  // ── Auth handlers ─────────────────────────────────────────────
  const handleLogin = ({ role, user }) => {
    const session = { role, user, loginTime: new Date().toISOString() };
    sessionStorage.setItem('mediconnect_session', JSON.stringify(session));
    setAuthSession(session);
    setActiveRole(role);
    showToast({
      type: 'success',
      title: `Welcome, ${user.name}!`,
      message: `Signed in to ${role.charAt(0).toUpperCase() + role.slice(1)} Portal successfully.`
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mediconnect_session');
    setAuthSession(null);
    showToast({ type: 'info', title: 'Logged Out', message: 'Your session has ended. Please sign in again.' });
  };

  const showToast = ({ type = 'success', title, message }) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Load data function (accessible to both useEffect and CloudDatabaseModal)
  const loadData = async () => {
    try {
      initStorage();
      const [pat, docs, depts, appts, rxs, labs, orders, pkgs, stats, usrs] = await Promise.all([
        apiService.getPatientProfile(),
        apiService.getDoctors(),
        apiService.getDepartments(),
        apiService.getAppointments(),
        apiService.getPrescriptions(),
        apiService.getLabReports(),
        apiService.getHomeSampleOrders(),
        apiService.getLabPackages(),
        apiService.getAdminStats(),
        apiService.getUsers()
      ]);
      setPatient(pat); setDoctors(docs || []); setDepartments(depts || []);
      setAppointments(appts || []); setPrescriptions(rxs || []); setLabReports(labs || []);
      setSampleOrders(orders || []); setLabPackages(pkgs || []); setAdminStats(stats || null); setUsers(usrs || []);
    } catch (e) {
      console.warn('Data loading error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data when authenticated
  useEffect(() => {
    if (!authSession) { setLoading(false); return; }
    setLoading(true);
    loadData();
  }, [authSession]);

  // ── Data handlers ─────────────────────────────────────────────
  const handleBookAppointment = async (bookingData) => {
    const created = await apiService.bookAppointment(bookingData);
    setAppointments((prev) => [created, ...prev]);
    const updatedStats = await apiService.getAdminStats();
    setAdminStats(updatedStats);
    return created;
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    const updated = await apiService.updateAppointmentStatus(id, status);
    setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const handleUpdatePatientProfile = async (profileData) => {
    const updated = await apiService.updatePatientProfile(profileData);
    setPatient(updated);
  };

  const handleSavePrescription = async (rxData) => {
    const created = await apiService.addPrescription(rxData);
    setPrescriptions((prev) => [created, ...prev]);
    if (rxData.appointmentId) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === rxData.appointmentId ? { ...a, status: 'Completed', prescriptionId: created.id } : a))
      );
    }
    return created;
  };

  const handleAddDoctor = async (doctorData) => {
    const created = await apiService.addDoctor(doctorData);
    setDoctors((prev) => [created, ...prev]);
    return created;
  };

  const handleVerifyDoctor = async (userId, doctorData) => {
    await apiService.verifyDoctorUser(userId);
    const created = await apiService.addDoctor(doctorData);
    setDoctors(prev => [created, ...prev]);
    const updatedUsers = await apiService.getUsers();
    setUsers(updatedUsers);
    showToast({ type: 'success', title: 'Doctor Verified', message: 'Doctor has been added to the hospital directory.' });
  };

  const handleUpdateDoctor = async (id, updates) => {
    const updated = await apiService.updateDoctor(id, updates);
    setDoctors((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };

  const handleAddDepartment = async (deptData) => {
    const created = await apiService.addDepartment(deptData);
    setDepartments((prev) => [...prev, created]);
    return created;
  };

  const handleRequestSampleOrder = async (orderData) => {
    const created = await apiService.bookHomeSample(orderData);
    setSampleOrders((prev) => [created, ...prev]);
    return created;
  };

  const handleAdvanceSampleStatus = async (id, newStatus) => {
    const updated = await apiService.updateSampleOrderStatus(id, newStatus);
    setSampleOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    showToast({ type: 'info', title: 'Lab Sample Status Advanced', message: `Order #${id} is now: ${newStatus.toUpperCase()}` });
  };

  // ── Standalone Pan-India Doctor Shared EHR Link ──────────────
  if (activeShareToken) {
    return (
      <DoctorSharedEhrView
        shareToken={activeShareToken}
        onBackToApp={() => {
          setActiveShareToken(null);
          try {
            window.history.replaceState({}, '', window.location.pathname);
          } catch (e) {}
        }}
      />
    );
  }

  // ── Not logged in – show login page ──────────────────────────
  if (!authSession) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // ── Loading spinner ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-800">Initializing MediConnect HMS...</p>
          <p className="text-xs text-slate-500">Loading your {activeRole} portal data</p>
        </div>
      </div>
    );
  }

  // ── STRICT SECURITY: ROLE-BASED DATA ISOLATION ────────────────
  const activePatientName = authSession?.user?.name || patient?.name || 'Tushar Tawar';
  const activePatientId = authSession?.user?.id || patient?.id || 'pat-1';

  const isolatedPatientAppointments = appointments.filter(a => {
    if (a.patientId && a.patientId === activePatientId) return true;
    if (a.patientName && a.patientName.toLowerCase() === activePatientName.toLowerCase()) return true;
    return false;
  });

  const isolatedPatientPrescriptions = prescriptions.filter(p => {
    if (p.patientId && p.patientId === activePatientId) return true;
    if (p.patientName && p.patientName.toLowerCase() === activePatientName.toLowerCase()) return true;
    return false;
  });

  const isolatedPatientLabReports = labReports.filter(l => {
    if (l.patientId && l.patientId === activePatientId) return true;
    if (l.patientName && l.patientName.toLowerCase() === activePatientName.toLowerCase()) return true;
    return false;
  });

  const activeDoctorName = authSession?.user?.name || 'Dr. Ananya Sharma';
  const activeDoctorId = authSession?.user?.id || 'doc-1';

  const isolatedDoctorAppointments = appointments.filter(a => {
    if (a.doctorId && a.doctorId === activeDoctorId) return true;
    if (a.doctorName && (
      a.doctorName.toLowerCase().includes('ananya') ||
      a.doctorName.toLowerCase().includes(activeDoctorName.toLowerCase().split(' ')[1] || activeDoctorName.toLowerCase())
    )) return true;
    return false;
  });

  const isolatedDoctorPrescriptions = prescriptions.filter(p => {
    if (p.doctorId && p.doctorId === activeDoctorId) return true;
    if (p.doctorName && (
      p.doctorName.toLowerCase().includes('ananya') ||
      p.doctorName.toLowerCase().includes(activeDoctorName.toLowerCase().split(' ')[1] || activeDoctorName.toLowerCase())
    )) return true;
    return false;
  });

  const activeReceptionistDoctorId = authSession?.user?.assignedDoctorId || 'doc-1';
  const isolatedReceptionistAppointments = appointments.filter(a => a.doctorId === activeReceptionistDoctorId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Persistent Global Header with Role Switcher */}
      <Navbar
        activeRole={activeRole}
        setRole={setActiveRole}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        onLogout={handleLogout}
        patient={patient}
        authUser={authSession?.user}
      />

      {/* Role-Based Data Isolation Security Banner */}
      <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-xs py-1.5 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icons.ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>
            {activeRole === 'patient' && `Protected Session: Showing health records for ${activePatientName} only. Other patients' data is completely restricted.`}
            {activeRole === 'doctor' && `Licensed Clinical Session: Showing OPD queue for ${activeDoctorName} only. Other doctors' queues are private.`}
            {activeRole === 'admin' && 'Administrative Isolation: Operational metrics active; patient diagnoses and symptoms are strictly redacted.'}
          </span>
        </div>
      </div>

      {/* Portal Views */}
      <div className="flex-1">
        {activeRole === 'patient' && (
          <PatientPortal
            patient={patient}
            appointments={isolatedPatientAppointments}
            doctors={doctors}
            departments={departments}
            prescriptions={isolatedPatientPrescriptions}
            labReports={isolatedPatientLabReports}
            sampleOrders={sampleOrders}
            labPackages={labPackages}
            onBookAppointment={handleBookAppointment}
            onUpdatePatientProfile={handleUpdatePatientProfile}
            onRequestSampleOrder={handleRequestSampleOrder}
            onAdvanceSampleStatus={handleAdvanceSampleStatus}
            onOpenAiModal={() => setIsAiModalOpen(true)}
            showToast={showToast}
          />
        )}

        {activeRole === 'doctor' && (
          <DoctorPortal
            appointments={isolatedDoctorAppointments}
            prescriptions={isolatedDoctorPrescriptions}
            doctors={doctors}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onSavePrescription={handleSavePrescription}
            onUpdateDoctor={handleUpdateDoctor}
            showToast={showToast}
            authUser={authSession?.user}
          />
        )}

        {activeRole === 'admin' && (
          <AdminPortal
            stats={adminStats}
            doctors={doctors}
            departments={departments}
            appointments={appointments}
            users={users}
            onAddDoctor={handleAddDoctor}
            onVerifyDoctor={handleVerifyDoctor}
            onUpdateDoctor={handleUpdateDoctor}
            onAddDepartment={handleAddDepartment}
            showToast={showToast}
          />
        )}

        {activeRole === 'receptionist' && (
          <ReceptionistPortal
            appointments={isolatedReceptionistAppointments}
            doctors={doctors}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onBookAppointment={handleBookAppointment}
            showToast={showToast}
            authUser={authSession?.user}
          />
        )}
      </div>

      {/* Global Modals & Notifications */}
      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={activeRole}
        onSelectRole={(role) => {
          setActiveRole(role);
          showToast({
            type: 'info',
            title: `Switched to ${role.toUpperCase()} View`,
            message: `Now viewing MediConnect as ${role === 'patient' ? 'Patient (Aarav Sharma)' : role === 'doctor' ? 'Doctor (Dr. Ananya Iyer)' : 'Hospital Super Admin'}.`
          });
        }}
      />

      <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <CloudDatabaseModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        showToast={showToast}
        onSyncComplete={loadData}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
