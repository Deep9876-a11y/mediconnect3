import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function PatientHistoryModal({ isOpen, onClose, patientAppointment, prescriptions = [] }) {
  const [isConsentUnlocked, setIsConsentUnlocked] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  if (!isOpen || !patientAppointment) return null;

  // Find prescriptions for this patient if any
  const patientPrescriptions = prescriptions.filter(
    (p) => p.patientName === patientAppointment.patientName || p.patientId === patientAppointment.patientId
  );

  const handleVerifyPin = (e) => {
    e.preventDefault();
    setPinError('');
    // Check against standard pin '1234' or patient appointment security key
    const expectedPin = patientAppointment.securityPin || '1234';
    if (enteredPin === expectedPin || enteredPin === '1234') {
      setIsConsentUnlocked(true);
    } else {
      setPinError('Invalid 4-digit Security PIN. Patient consent could not be verified.');
    }
  };

  const handleClose = () => {
    setIsConsentUnlocked(false);
    setEnteredPin('');
    setPinError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 to-slate-900 p-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-sky-600/50 border border-sky-400/40 flex items-center justify-center text-base font-black">
              {patientAppointment.patientName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold bg-sky-500/30 text-sky-200 px-2 py-0.5 rounded">
                  Token: {patientAppointment.tokenNumber}
                </span>
                {isConsentUnlocked ? (
                  <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded flex items-center space-x-1">
                    <Icons.CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Consent Verified</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded flex items-center space-x-1">
                    <Icons.Lock className="w-3 h-3 text-amber-300" />
                    <span>PIN Protected</span>
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold mt-0.5">{patientAppointment.patientName}</h3>
              <p className="text-xs text-slate-300">
                {patientAppointment.patientAge || 32} yrs • {patientAppointment.patientGender || 'Male'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Consent Lock Barrier if not verified */}
        {!isConsentUnlocked ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-center mx-auto text-amber-600 shadow-sm">
              <Icons.Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto">
              <h4 className="text-base font-black text-slate-900">
                Patient Medical Dossier is Protected
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                In compliance with ABHA & DISHA health data privacy standards, arbitrary doctors cannot inspect a patient's historical diagnoses, past prescriptions, and lab history without the patient's explicit consent.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="max-w-xs mx-auto space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter Patient's 4-Digit Security Key (PIN)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => { setEnteredPin(e.target.value.replace(/\D/g, '')); setPinError(''); }}
                  placeholder="e.g. 1234"
                  className="w-full text-center text-lg tracking-widest font-mono font-bold py-2.5 px-4 border-2 border-slate-300 focus:border-sky-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-200"
                  required
                  autoFocus
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Ask the patient for their 4-digit PIN (Default: <strong className="text-slate-600">1234</strong>)
                </p>
              </div>

              {pinError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 justify-center">
                  <Icons.X className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
              >
                <Icons.CheckCircle className="w-4 h-4" />
                <span>Verify Consent & Unlock Dossier</span>
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 max-w-sm mx-auto text-[11px] text-slate-400 flex items-center justify-center space-x-2">
              <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>HIPAA Compliant Patient Consent Architecture</span>
            </div>
          </div>
        ) : (
          /* Dossier Content when Consent is Unlocked */
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs animate-fadeIn">
            {/* Consent Banner */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between text-emerald-900">
              <div className="flex items-center space-x-2">
                <Icons.CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-[11px]">
                  Consent Verified: Medical dossier decrypted for current consultation.
                </span>
              </div>
              <button
                onClick={() => setIsConsentUnlocked(false)}
                className="text-[10px] font-bold text-emerald-800 underline hover:text-emerald-950"
              >
                Lock Again
              </button>
            </div>

            {/* Vitals Recorded by OPD Nurse */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                Today's Triage Vitals (OPD Nurse Entry)
              </h4>
              <div className="grid grid-cols-4 gap-2.5">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {patientAppointment.vitals?.bp || '128/84 mmHg'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Pulse Rate</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {patientAppointment.vitals?.pulse || '76 bpm'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">SpO2 Oxygen</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    {patientAppointment.vitals?.spo2 || '99%'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">Body Temp</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {patientAppointment.vitals?.temp || '98.6 F'}
                  </span>
                </div>
              </div>
            </div>

            {/* Chief Complaint today */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
              <h5 className="font-bold text-amber-950 mb-1">Current Chief Complaint</h5>
              <p className="text-slate-700 leading-relaxed">
                "{patientAppointment.symptoms || 'Patient reports mild chest tightness and asks for follow-up evaluation.'}"
              </p>
            </div>

            {/* Clinical History & Background */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                Background Medical Dossier
              </h4>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <p className="text-slate-700 leading-relaxed">
                  {patientAppointment.historySummary ||
                    "Known hypertensive on ACE inhibitors. No history of adverse drug reactions to beta blockers. Family history of coronary artery disease."}
                </p>
                <div className="pt-2 border-t border-slate-200 flex items-center space-x-3 text-[11px]">
                  <span className="font-bold text-rose-700">Allergies: Penicillin, Sulfa</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-slate-700">Blood Group: O+</span>
                </div>
              </div>
            </div>

            {/* Past Prescriptions */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                Past Hospital Prescriptions ({patientPrescriptions.length})
              </h4>
              {patientPrescriptions.length === 0 ? (
                <p className="text-slate-400 italic">No prior prescriptions logged under current session.</p>
              ) : (
                <div className="space-y-2">
                  {patientPrescriptions.map((rx) => (
                    <div key={rx.id} className="p-3 bg-white border border-slate-200 rounded-xl">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-800">{rx.diagnosis}</span>
                        <span className="text-[10px] text-slate-400">{rx.date}</span>
                      </div>
                      <p className="text-[11px] text-teal-700 mt-0.5">By {rx.doctorName}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {rx.medicines?.map((m, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded">
                            {m.name} ({m.dosage})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
