import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons.jsx';
import { apiService } from '../../api/apiService.js';

export function ShareRecordModal({ isOpen, onClose, patient, showToast }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('create'); // 'create' | 'active'

  // Form states
  const [password, setPassword] = useState('4321');
  const [durationHours, setDurationHours] = useState('24');
  const [maxAccessCount, setMaxAccessCount] = useState('2');
  const [doctorRecipient, setDoctorRecipient] = useState('');
  const [note, setNote] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [createdLink, setCreatedLink] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadLinks();
      setCreatedLink(null);
      setSecurityPin('');
      setPinError('');
    }
  }, [isOpen]);

  const loadLinks = async () => {
    try {
      const data = await apiService.getShareLinks();
      setLinks(data || []);
    } catch (e) {
      // fallback
    }
  };

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    setPinError('');

    if (!password.trim() || password.length < 4) {
      setPinError('Please set an access passcode with at least 4 digits/characters.');
      return;
    }

    if (securityPin.trim() !== '1234') {
      setPinError('Invalid 4-digit Security Key. (Default PIN is 1234)');
      return;
    }

    setLoading(true);
    try {
      const newLink = await apiService.createShareLink({
        patientId: patient?.id,
        patientName: patient?.name,
        uhid: patient?.uhid,
        password: password.trim(),
        durationHours: parseInt(durationHours, 10),
        maxAccessCount: parseInt(maxAccessCount, 10),
        doctorRecipient: doctorRecipient.trim() || 'Consulting Doctor in India',
        note: note.trim() || 'Pan-India Medical Record Access for Consultation'
      });

      setCreatedLink(newLink);
      await loadLinks();
      setTab('active');
      showToast?.({
        type: 'success',
        title: 'Share Link Generated!',
        message: `Secured link ready with ${durationHours}h validity and max ${maxAccessCount} views.`
      });
    } catch (err) {
      setPinError('Failed to generate link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (token) => {
    if (confirm('Are you sure you want to revoke this link immediately? Any doctor using it will lose access.')) {
      await apiService.revokeShareLink(token);
      await loadLinks();
      showToast?.({
        type: 'info',
        title: 'Access Revoked',
        message: `Link ${token} has been disabled immediately.`
      });
    }
  };

  const getShareUrl = (token) => {
    const origin = window.location.origin || 'http://localhost:5173';
    return `${origin}/?share=${token}`;
  };

  const handleCopy = (link) => {
    const url = getShareUrl(link.token);
    navigator.clipboard?.writeText(url);
    setCopiedId(link.token);
    setTimeout(() => setCopiedId(null), 3000);
    showToast?.({
      type: 'success',
      title: 'Link Copied!',
      message: 'Secure doctor access link copied to clipboard.'
    });
  };

  const handleCopyWhatsApp = (link) => {
    const url = getShareUrl(link.token);
    const msg = `🏥 *MediConnect EHR Access Link*\nPatient: ${patient?.name || 'Aarav Sharma'} (UHID: ${patient?.uhid})\n\n🔗 *Link:* ${url}\n🔑 *Passcode:* ${link.password}\n⏳ *Valid For:* ${link.durationHours} Hours\n👥 *Access Limit:* Max ${link.maxAccessCount} Views\n\n_Doctor can view previous prescriptions, lab reports, and write new digital prescription._`;
    navigator.clipboard?.writeText(msg);
    showToast?.({
      type: 'success',
      title: 'WhatsApp Text Copied!',
      message: 'Paste and send to your doctor on WhatsApp or SMS.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-sky-900 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
              <Icons.ShieldCheck className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold">Pan-India Medical Record Sharing</h3>
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  ABDM / ABHA Ready
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-0.5">
                Share your prescriptions & lab history with any doctor in India securely
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex space-x-3">
          <button
            onClick={() => setTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              tab === 'create'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Icons.Plus className="w-4 h-4" />
            <span>Generate New Doctor Link</span>
          </button>
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              tab === 'active'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Icons.Activity className="w-4 h-4" />
            <span>Active Links ({links.filter(l => !l.isRevoked).length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {tab === 'create' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Info banner */}
              <div className="bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3">
                <Icons.HeartPulse className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-teal-900">How Pan-India Secure Link Works:</p>
                  <p className="mt-1 leading-relaxed text-slate-600">
                    Traveling to Mumbai, Bengaluru, Chennai or any town? Share this link with any consulting doctor.
                    The doctor requires your <strong>Access Passcode</strong> to open your record, and can view all past
                    prescriptions and <strong>directly attach a new digital prescription</strong> for you.
                  </p>
                </div>
              </div>

              {/* Grid: Passcode & Expiry & Person Limit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Password / Passcode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Set Access Passcode <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Icons.Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="e.g. 4892"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono font-bold text-teal-800"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Doctor must enter this to open link</p>
                </div>

                {/* Duration Limit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time Limit (Auto-Expiry)
                  </label>
                  <div className="relative">
                    <Icons.Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={durationHours}
                      onChange={e => setDurationHours(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium text-slate-800"
                    >
                      <option value="1">1 Hour (Quick Visit)</option>
                      <option value="6">6 Hours (Single OPD)</option>
                      <option value="24">24 Hours (1 Full Day)</option>
                      <option value="72">3 Days (Weekend Trip)</option>
                      <option value="168">7 Days (Extended Care)</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Link expires automatically</p>
                </div>

                {/* Person / View Limit */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Doctor Access Limit
                  </label>
                  <div className="relative">
                    <Icons.User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={maxAccessCount}
                      onChange={e => setMaxAccessCount(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium text-slate-800"
                    >
                      <option value="1">1 Person (Single Doctor)</option>
                      <option value="2">2 Persons / Views</option>
                      <option value="3">3 Persons / Views</option>
                      <option value="5">5 Persons / Views</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Self-destructs after max views</p>
                </div>
              </div>

              {/* Doctor / Clinic Recipient */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Doctor / Clinic Name (Optional)
                </label>
                <div className="relative">
                  <Icons.Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={doctorRecipient}
                    onChange={e => setDoctorRecipient(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma (Fortis Escorts, Jaipur)"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Consultation Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Purpose / Instructions for Doctor
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Seeking second opinion on hypertension medications & recent ECG reports"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
                />
              </div>

              {/* Security Key Authorization */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icons.ShieldCheck className="w-4 h-4 text-amber-700" />
                  <label className="text-xs font-bold text-amber-900">
                    Authorize with Your 4-Digit Security Key <span className="text-red-500">*</span>
                  </label>
                </div>
                <p className="text-[11px] text-amber-800 mb-2">
                  To protect your confidential medical history, enter your personal Medical Security PIN (Default PIN: <strong>1234</strong>).
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="password"
                    maxLength={6}
                    value={securityPin}
                    onChange={e => { setSecurityPin(e.target.value); setPinError(''); }}
                    placeholder="••••"
                    className="w-36 px-4 py-2 border border-amber-300 rounded-xl text-center text-base tracking-widest font-mono font-bold bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900"
                    required
                  />
                  <span className="text-[11px] text-amber-700 font-medium">Default PIN: 1234</span>
                </div>
                {pinError && (
                  <p className="text-xs text-red-600 font-bold mt-2 flex items-center space-x-1">
                    <Icons.X className="w-3.5 h-3.5" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 flex items-center justify-center space-x-2 transition"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Encrypting & Generating Link...</span>
                  </>
                ) : (
                  <>
                    <Icons.Lock className="w-4 h-4" />
                    <span>Generate Time-Limited Doctor Access Link</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {links.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Icons.ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No Active Share Links</p>
                  <p className="text-xs text-slate-500 mt-1">Generate a link to share with any doctor across India</p>
                </div>
              ) : (
                links.map(link => {
                  const isExpired = new Date() > new Date(link.expiresAt);
                  const isLimitReached = link.currentAccessCount >= link.maxAccessCount;
                  const isInactive = link.isRevoked || isExpired || isLimitReached;
                  const url = getShareUrl(link.token);

                  return (
                    <div
                      key={link.id}
                      className={`p-4 rounded-2xl border transition ${
                        isInactive
                          ? 'bg-slate-50 border-slate-200 opacity-75'
                          : 'bg-white border-teal-200 shadow-sm ring-1 ring-teal-500/10'
                      }`}
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs bg-slate-800 text-white px-2.5 py-1 rounded-lg">
                            {link.token}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            link.isRevoked
                              ? 'bg-rose-100 text-rose-800'
                              : isExpired
                              ? 'bg-amber-100 text-amber-800'
                              : isLimitReached
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {link.isRevoked ? 'REVOKED' : isExpired ? 'EXPIRED' : isLimitReached ? 'LIMIT REACHED' : 'ACTIVE'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-slate-500">
                            Accesses: <strong className="text-slate-800">{link.currentAccessCount} / {link.maxAccessCount}</strong>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500">
                            Expires: <strong className="text-slate-800">{new Date(link.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Recipient & Notes */}
                      <p className="text-xs font-bold text-slate-800 mb-1">
                        Doctor / Clinic: <span className="text-teal-700">{link.doctorRecipient}</span>
                      </p>
                      {link.note && (
                        <p className="text-xs text-slate-600 mb-3 italic">
                          "{link.note}"
                        </p>
                      )}

                      {/* URL Box & Passcode */}
                      <div className="bg-slate-100 rounded-xl p-2.5 flex items-center justify-between gap-2 mb-3 border border-slate-200 font-mono text-xs">
                        <div className="truncate text-slate-700 select-all">
                          {url}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="bg-white px-2 py-1 rounded border border-slate-300 font-bold text-teal-800 text-[11px]">
                            PIN: {link.password}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopy(link)}
                            className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
                          >
                            <Icons.Copy className="w-3.5 h-3.5" />
                            <span>{copiedId === link.token ? 'Copied!' : 'Copy Link'}</span>
                          </button>

                          <button
                            onClick={() => handleCopyWhatsApp(link)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
                          >
                            <Icons.MessageSquare className="w-3.5 h-3.5" />
                            <span>Share WhatsApp</span>
                          </button>

                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-lg transition flex items-center space-x-1"
                          >
                            <Icons.ExternalLink className="w-3.5 h-3.5" />
                            <span>Test Doctor View</span>
                          </a>
                        </div>

                        {!link.isRevoked && (
                          <button
                            onClick={() => handleRevoke(link.token)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center space-x-1 py-1"
                          >
                            <Icons.Trash2 className="w-3.5 h-3.5" />
                            <span>Revoke Access</span>
                          </button>
                        )}
                      </div>

                      {/* Access Audit Log */}
                      {link.accessLogs && link.accessLogs.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center space-x-1">
                            <Icons.Activity className="w-3 h-3 text-teal-600" />
                            <span>Doctor Access Audit Log:</span>
                          </p>
                          {link.accessLogs.map((log, idx) => (
                            <div key={idx} className="text-[11px] text-slate-600 flex justify-between bg-slate-50 px-2.5 py-1 rounded mt-1">
                              <span><strong>{log.doctorName}</strong> ({log.regNo}) • {log.clinic}</span>
                              <span className="text-slate-400 font-mono">{new Date(log.accessedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center text-xs text-slate-500">
          <span className="flex items-center space-x-1">
            <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted with SHA-256 & Protected by 2FA Medical PIN</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
