import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons.jsx';
import { apiService } from '../../api/apiService.js';

export function DoctorSharedEhrView({ shareToken, onBackToApp }) {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Unlock state
  const [password, setPassword] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [clinic, setClinic] = useState('');
  const [city, setCity] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [unlockedData, setUnlockedData] = useState(null);

  // New Prescription Modal
  const [showRxModal, setShowRxModal] = useState(false);
  const [rxDiagnosis, setRxDiagnosis] = useState('');
  const [rxNotes, setRxNotes] = useState('');
  const [rxMedicines, setRxMedicines] = useState([
    { name: '', dosage: '500 mg', frequency: 'Twice daily (After food)', duration: '5 Days' }
  ]);
  const [savingRx, setSavingRx] = useState(false);
  const [rxSuccessMsg, setRxSuccessMsg] = useState('');

  useEffect(() => {
    loadTokenDetails();
  }, [shareToken]);

  const loadTokenDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const link = await apiService.getShareLinkByToken(shareToken);
      if (!link) {
        setError('This medical record link is invalid or does not exist.');
      } else if (link.isRevoked) {
        setError('This link was revoked by the patient.');
      } else if (new Date() > new Date(link.expiresAt)) {
        setError(`This link expired on ${new Date(link.expiresAt).toLocaleString()}.`);
      } else if (link.currentAccessCount >= link.maxAccessCount) {
        setError(`Access person limit reached (${link.maxAccessCount}/${link.maxAccessCount} views already consumed).`);
      } else {
        setTokenInfo(link);
      }
    } catch (e) {
      setError('Could not verify link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError('');
    if (!password.trim()) {
      setError('Please enter the access passcode provided by the patient.');
      return;
    }

    setUnlocking(true);
    try {
      const res = await apiService.unlockShareLink(shareToken, password.trim(), {
        doctorName: doctorName.trim() || 'Consulting Physician',
        regNo: regNo.trim() || 'MCI-VERIFIED',
        clinic: clinic.trim() || 'Consulting Clinic',
        city: city.trim() || 'India'
      });

      if (!res.success) {
        setError(res.error || 'Failed to unlock record.');
      } else {
        setUnlockedData(res.data);
        setTokenInfo(res.link);
      }
    } catch (err) {
      setError('Error unlocking medical records.');
    } finally {
      setUnlocking(false);
    }
  };

  // Prescription Form Handlers
  const addMedicineRow = () => {
    setRxMedicines(prev => [
      ...prev,
      { name: '', dosage: '1 Tablet', frequency: 'Twice daily', duration: '5 Days' }
    ]);
  };

  const updateMedicine = (index, field, value) => {
    setRxMedicines(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const removeMedicineRow = (index) => {
    setRxMedicines(prev => prev.filter((_, i) => i !== index));
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!rxDiagnosis.trim()) {
      alert('Please enter clinical diagnosis.');
      return;
    }
    const validMeds = rxMedicines.filter(m => m.name.trim());
    if (validMeds.length === 0) {
      alert('Please add at least one medicine.');
      return;
    }

    setSavingRx(true);
    try {
      const newRx = await apiService.addPrescriptionFromShare(shareToken, {
        patientId: unlockedData?.patient?.id || 'pat-101',
        patientName: unlockedData?.patient?.name || 'Tushar Tawar',
        doctorName: doctorName.trim() ? `Dr. ${doctorName.replace(/^dr\.?\s*/i, '')}` : 'Dr. Consulting Physician',
        doctorSpecialty: clinic.trim() ? `${clinic}, ${city || 'India'}` : 'Consulting OPD',
        diagnosis: rxDiagnosis.trim(),
        medicines: validMeds,
        notes: rxNotes.trim(),
        date: new Date().toISOString().split('T')[0]
      });

      // Update local view with new prescription
      setUnlockedData(prev => ({
        ...prev,
        prescriptions: [newRx, ...(prev?.prescriptions || [])]
      }));

      setRxSuccessMsg(`Prescription ${newRx.id} generated & permanently linked to patient's MediConnect record!`);
      setTimeout(() => {
        setShowRxModal(false);
        setRxSuccessMsg('');
      }, 2500);
    } catch (err) {
      alert('Failed to save prescription. Please try again.');
    } finally {
      setSavingRx(false);
    }
  };

  // Mask patient name before unlocking
  const getMaskedName = (name) => {
    if (!name) return 'Patient';
    const parts = name.split(' ');
    return parts.map(p => p[0] + '*'.repeat(Math.max(2, p.length - 1))).join(' ');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top National Health Exchange Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-sky-950 to-slate-900 border-b border-teal-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-teal-300">National Health Records Exchange (Pan-India ABDM Ready)</span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">Secure Peer-to-Peer Clinical Access</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="bg-teal-500/20 text-teal-200 border border-teal-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-mono">
            TOKEN: {shareToken}
          </span>
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="text-xs text-slate-300 hover:text-white underline font-semibold flex items-center space-x-1"
            >
              <span>Back to MediConnect App</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl">
          {/* Loading state */}
          {loading && (
            <div className="text-center py-20 bg-slate-800/80 rounded-3xl border border-slate-700">
              <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-base font-bold text-white">Verifying Medical Access Token...</p>
              <p className="text-xs text-slate-400 mt-1">Checking encryption certificates and authorization policies</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && !unlockedData && (
            <div className="max-w-md mx-auto bg-slate-800 rounded-3xl p-8 border border-red-500/40 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-red-400">
                <Icons.X className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Access Denied / Link Unavailable</h3>
              <p className="text-sm text-red-300 mt-2">{error}</p>
              <div className="mt-6 pt-6 border-t border-slate-700 text-xs text-slate-400 space-y-2">
                <p>Possible reasons:</p>
                <ul className="list-disc list-inside text-left space-y-1 text-slate-300">
                  <li>Link validity period has expired</li>
                  <li>Maximum doctor access limit reached</li>
                  <li>Patient manually revoked access</li>
                  <li>Invalid passcode entered</li>
                </ul>
              </div>
              {onBackToApp && (
                <button
                  onClick={onBackToApp}
                  className="mt-6 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition"
                >
                  Return to Main App
                </button>
              )}
            </div>
          )}

          {/* Locked Gate View: Doctor Enters Password & Credentials */}
          {!loading && !unlockedData && !error && tokenInfo && (
            <div className="max-w-xl mx-auto bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-sky-700 px-6 py-6 text-white text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Icons.Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold">Encrypted Patient Health Record</h2>
                <p className="text-xs text-teal-100 mt-1">
                  Shared by <span className="font-bold underline">{getMaskedName(tokenInfo.patientName)}</span> (UHID: {tokenInfo.uhid})
                </p>
              </div>

              {/* Status Badges */}
              <div className="bg-slate-850 px-6 py-3 border-b border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Icons.Clock className="w-4 h-4 text-amber-400" />
                  <span>Expires: <strong className="text-slate-200">{new Date(tokenInfo.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</strong></span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Icons.User className="w-4 h-4 text-teal-400" />
                  <span>Views: <strong className="text-slate-200">{tokenInfo.currentAccessCount} / {tokenInfo.maxAccessCount} used</strong></span>
                </span>
              </div>

              <form onSubmit={handleUnlock} className="p-6 space-y-4">
                {tokenInfo.note && (
                  <div className="bg-teal-950/60 border border-teal-500/30 rounded-xl p-3 text-xs text-teal-200">
                    <strong>Patient Note:</strong> "{tokenInfo.note}"
                  </div>
                )}

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Enter Patient's Access Passcode <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Icons.Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter 4-digit code provided by patient"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono tracking-widest"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Hint: <strong>{tokenInfo.password}</strong></p>
                </div>

                {/* Doctor Identity (Audit Log) */}
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
                    Consulting Doctor Credentials (ABDM Audit Trail)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Doctor Name</label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={e => setDoctorName(e.target.value)}
                        placeholder="e.g. Dr. Rajesh Verma"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">MCI / State Reg. No.</label>
                      <input
                        type="text"
                        value={regNo}
                        onChange={e => setRegNo(e.target.value)}
                        placeholder="e.g. MCI-78410"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Clinic / Hospital</label>
                      <input
                        type="text"
                        value={clinic}
                        onChange={e => setClinic(e.target.value)}
                        placeholder="e.g. Apollo Clinic"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">City / State</label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, Maharashtra"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={unlocking}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-500/30 flex items-center justify-center space-x-2 transition mt-4"
                >
                  {unlocking ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Decrypting Medical Dossier...</span>
                    </>
                  ) : (
                    <>
                      <Icons.ShieldCheck className="w-4 h-4" />
                      <span>Authenticate & View Medical History</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Unlocked Medical Record View */}
          {unlockedData && (
            <div className="space-y-6">
              {/* Patient Dossier Header Banner */}
              <div className="bg-slate-800 rounded-3xl p-6 border border-teal-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={unlockedData.patient?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
                    alt="Patient"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-xl font-black text-white">{unlockedData.patient?.name}</h1>
                      <span className="bg-teal-500/20 text-teal-300 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-teal-500/40">
                        {unlockedData.patient?.uhid}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {unlockedData.patient?.age} yrs, {unlockedData.patient?.gender} • Blood Group: <strong className="text-teal-300">{unlockedData.patient?.bloodGroup}</strong> • Phone: {unlockedData.patient?.phone}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 text-[11px]">
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-medium">
                        Allergies: {unlockedData.patient?.allergies?.join(', ') || 'None'}
                      </span>
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-medium">
                        Conditions: {unlockedData.patient?.chronicConditions?.join(', ') || 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Doctor Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowRxModal(true)}
                    className="px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/30 flex items-center space-x-2 transition"
                  >
                    <Icons.Plus className="w-4 h-4" />
                    <span>Issue Digital Prescription</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                  >
                    <Icons.Download className="w-4 h-4 text-slate-300" />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>

              {/* Grid: Prescriptions & Lab Reports */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Previous Prescriptions */}
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icons.Pill className="w-5 h-5 text-teal-400" />
                      <h3 className="font-bold text-white text-base">Previous Prescriptions</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {unlockedData.prescriptions?.length || 0} Records
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {unlockedData.prescriptions?.map((rx) => (
                      <div key={rx.id} className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700/80 hover:border-teal-500/40 transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                              {rx.id}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1">{rx.diagnosis}</h4>
                            <p className="text-xs text-slate-400">{rx.doctorName} • {rx.doctorSpecialty}</p>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{rx.date}</span>
                        </div>

                        {/* Medicines list */}
                        <div className="mt-3 pt-2 border-t border-slate-800 space-y-1.5">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Medicines Prescribed:</p>
                          {rx.medicines?.map((med, i) => (
                            <div key={i} className="text-xs bg-slate-800/80 px-2.5 py-1.5 rounded-lg flex justify-between items-center text-slate-200">
                              <span className="font-semibold text-teal-200">{med.name}</span>
                              <span className="text-slate-400">{med.dosage} • {med.frequency} ({med.duration})</span>
                            </div>
                          ))}
                        </div>

                        {rx.notes && (
                          <p className="text-[11px] text-slate-400 mt-2 italic bg-slate-850 p-2 rounded">
                            Advice: {rx.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Previous Diagnostic Lab Reports */}
                <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icons.Activity className="w-5 h-5 text-sky-400" />
                      <h3 className="font-bold text-white text-base">Diagnostic Lab Reports</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {unlockedData.labReports?.length || 0} Reports
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {unlockedData.labReports?.map((rep) => (
                      <div key={rep.id} className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700/80 hover:border-sky-500/40 transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                              {rep.id}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1">{rep.testName}</h4>
                            <p className="text-xs text-slate-400">{rep.category} • Certified Lab</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rep.overallStatus === 'Normal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {rep.overallStatus || 'Verified'}
                          </span>
                        </div>

                        {/* Parameters table */}
                        {rep.parameters && rep.parameters.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-slate-800 space-y-1">
                            {rep.parameters.map((p, idx) => (
                              <div key={idx} className="text-xs flex justify-between items-center py-1 border-b border-slate-800/40 text-slate-300">
                                <span>{p.name}</span>
                                <div className="space-x-2">
                                  <strong className={p.status === 'Normal' ? 'text-emerald-400' : 'text-amber-400'}>
                                    {p.value} {p.unit}
                                  </strong>
                                  <span className="text-slate-500 text-[10px]">({p.normalRange})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Consultation History Summary */}
              <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl">
                <div className="flex items-center space-x-2 mb-3">
                  <Icons.Calendar className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-base">Past OPD Consultations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unlockedData.appointments?.map(apt => (
                    <div key={apt.id} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 text-xs">
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>{apt.doctorName} ({apt.doctorSpecialty})</span>
                        <span className="text-slate-400 font-mono">{apt.date}</span>
                      </div>
                      <p className="text-slate-400 mt-1">Symptoms: {apt.symptoms}</p>
                      <p className="text-teal-400 font-medium mt-1">Status: {apt.status} • Token: {apt.tokenNumber}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Issue Digital Prescription Modal for Outside Doctor */}
          {showRxModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
                <div className="bg-gradient-to-r from-teal-700 to-sky-800 px-6 py-4 flex justify-between items-center text-white">
                  <div className="flex items-center space-x-2">
                    <Icons.Pill className="w-5 h-5 text-teal-200" />
                    <div>
                      <h3 className="font-bold text-base">Issue Pan-India Digital Prescription</h3>
                      <p className="text-xs text-teal-100">
                        Prescription will be automatically saved to patient's MediConnect app
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRxModal(false)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                  >
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSavePrescription} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {rxSuccessMsg && (
                    <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-200 rounded-xl p-3 text-xs font-bold flex items-center space-x-2">
                      <Icons.CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>{rxSuccessMsg}</span>
                    </div>
                  )}

                  {/* Doctor Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Doctor Name</label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={e => setDoctorName(e.target.value)}
                        placeholder="Dr. Full Name"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Clinic / Hospital & City</label>
                      <input
                        type="text"
                        value={clinic}
                        onChange={e => setClinic(e.target.value)}
                        placeholder="e.g. Fortis Hospital, Bengaluru"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Clinical Diagnosis / Findings <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={rxDiagnosis}
                      onChange={e => setRxDiagnosis(e.target.value)}
                      placeholder="e.g. Stage 1 Hypertension with acute tension headache"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>

                  {/* Medicines dynamic table */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Rx Medicines & Dosages <span className="text-red-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addMedicineRow}
                        className="px-2.5 py-1 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 text-xs font-bold rounded-lg border border-teal-500/40 flex items-center space-x-1"
                      >
                        <Icons.Plus className="w-3.5 h-3.5" />
                        <span>Add Medicine</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {rxMedicines.map((med, idx) => (
                        <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                          <input
                            type="text"
                            value={med.name}
                            onChange={e => updateMedicine(idx, 'name', e.target.value)}
                            placeholder="Medicine Name (e.g. Telmisartan)"
                            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                            required
                          />
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={e => updateMedicine(idx, 'dosage', e.target.value)}
                            placeholder="Dosage (e.g. 40 mg)"
                            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={e => updateMedicine(idx, 'frequency', e.target.value)}
                            placeholder="Frequency (e.g. Once daily OD)"
                            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={med.duration}
                              onChange={e => updateMedicine(idx, 'duration', e.target.value)}
                              placeholder="Duration (e.g. 30 Days)"
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                            />
                            {rxMedicines.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMedicineRow(idx)}
                                className="text-rose-400 hover:text-rose-300 p-1"
                              >
                                <Icons.X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doctor Advice / Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Doctor Advice / Lifestyle / Dietary Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={rxNotes}
                      onChange={e => setRxNotes(e.target.value)}
                      placeholder="e.g. Low sodium diet, 30 min daily brisk walking. Follow up in 2 weeks with BP chart."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingRx}
                      className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-500/30 flex items-center justify-center space-x-2 transition"
                    >
                      {savingRx ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Attaching Prescription to Patient Record...</span>
                        </>
                      ) : (
                        <>
                          <Icons.CheckCircle className="w-4 h-4" />
                          <span>Sign & Save Digital Prescription</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
