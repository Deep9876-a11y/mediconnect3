import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';
import { ShareRecordModal } from './ShareRecordModal.jsx';

export function HealthRecords({ appointments, prescriptions, labReports, patient, showToast }) {
  const [activeTab, setActiveTab] = useState('all'); // all, prescriptions, labs, visits
  const [selectedRx, setSelectedRx] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Filter combined timeline
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={patient?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
            alt="Patient"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900">{patient?.name || 'Aarav Sharma'}</h2>
              <span className="bg-teal-100 text-teal-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                {patient?.uhid || 'MC-2026-8941'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {patient?.age} yrs, {patient?.gender} • Blood Group: <span className="font-bold text-slate-700">{patient?.bloodGroup}</span>
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                Allergies: {patient?.allergies?.join(', ') || 'None reported'}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                Condition: {patient?.chronicConditions?.join(', ') || 'None'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-teal-600/20 flex items-center space-x-1.5"
          >
            <Icons.ShieldCheck className="w-4 h-4 text-teal-200" />
            <span>Share with Doctor (Pan-India Link)</span>
          </button>
          <button
            onClick={() => alert("Simulated Clinical Summary PDF downloaded for " + patient.name)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Icons.Download className="w-4 h-4 text-slate-600" />
            <span>Download Dossier</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Medical History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 flex items-center space-x-2">
          <Icons.Activity className="w-4 h-4 text-rose-500" />
          <span>Comprehensive Medical History</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vitals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Current Vitals</h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 grid grid-cols-2 gap-3">
              <div>
                <span className="block text-[10px] text-slate-500">Blood Pressure</span>
                <span className="text-sm font-bold text-slate-800">{patient?.vitals?.bp || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">Blood Sugar</span>
                <span className="text-sm font-bold text-slate-800">{patient?.vitals?.sugar || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">Heart Rate</span>
                <span className="text-sm font-bold text-slate-800">{patient?.vitals?.heartRate || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Past Diseases */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Previous Diseases</h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {patient?.medicalHistory?.previousDiseases?.length > 0 ? (
                  patient.medicalHistory.previousDiseases.map((d, i) => <li key={i}>{d}</li>)
                ) : <li>None reported</li>}
              </ul>
            </div>
          </div>

          {/* Surgeries & Accidents */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Surgeries & Accidents</h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Surgeries/Operations:</span>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                  {patient?.medicalHistory?.surgicalHistory?.length > 0 ? (
                    patient.medicalHistory.surgicalHistory.map((s, i) => <li key={i}>{s}</li>)
                  ) : <li>None</li>}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block mb-1">Accidents:</span>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                  {patient?.medicalHistory?.accidentalHistory?.length > 0 ? (
                    patient.medicalHistory.accidentalHistory.map((a, i) => <li key={i}>{a}</li>)
                  ) : <li>None</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Hospital Admissions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Hospital Admissions</h4>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {patient?.medicalHistory?.hospitalAdmissions?.length > 0 ? (
                  patient.medicalHistory.hospitalAdmissions.map((h, i) => <li key={i}>{h}</li>)
                ) : <li>No prior admissions</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pan-India Health Locker Info Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-sky-950 to-slate-900 rounded-2xl p-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-teal-500/30 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center flex-shrink-0">
            <Icons.Activity className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-xs text-white">Universal EHR: Consult Any Doctor Across India</h4>
              <span className="bg-teal-400/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-400/30">ABHA Compatible</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Visiting another city or consulting a specialist? Share a secure time-limited link protected with your passcode.
              Doctor can review your entire history and attach a fresh digital prescription.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition flex-shrink-0 flex items-center space-x-1"
        >
          <Icons.ExternalLink className="w-3.5 h-3.5" />
          <span>Create Secure Doctor Link</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'all'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Timeline View ({completedAppointments.length + prescriptions.length + labReports.length})
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'prescriptions'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Prescriptions ({prescriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('labs')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'labs'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Diagnostic Reports ({labReports.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {/* Prescriptions Section */}
        {(activeTab === 'all' || activeTab === 'prescriptions') && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Icons.Pill className="w-4 h-4 text-teal-600" />
              <span>Medical Prescriptions & Doctor Advice</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(prescriptions || []).length === 0 ? (
                <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Icons.Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-500">No medical prescriptions on record yet</p>
                </div>
              ) : (
                (prescriptions || []).map((rx) => (
                  <div
                    key={rx.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="bg-teal-50 text-teal-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {rx.id}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">{rx.diagnosis}</h4>
                          <p className="text-xs text-slate-500">{rx.doctorName} • {rx.doctorSpecialty}</p>
                        </div>
                        <span className="text-[11px] text-slate-400">{rx.date}</span>
                      </div>

                      <div className="mt-3 bg-slate-50 p-2.5 rounded-lg space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Prescribed Medicines ({rx.medicines?.length || 0})</p>
                        {rx.medicines?.slice(0, 2).map((m, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-slate-700">
                            <span className="font-medium truncate">{m.name}</span>
                            <span className="text-slate-500 font-mono text-[11px]">{m.frequency}</span>
                          </div>
                        ))}
                        {rx.medicines?.length > 2 && (
                          <p className="text-[10px] text-teal-600 font-medium">+ {rx.medicines.length - 2} more medicines</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 truncate max-w-[60%]">{rx.advice}</span>
                      <button
                        onClick={() => setSelectedRx(rx)}
                        className="px-3 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                      >
                        View Rx
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Lab Reports Section */}
        {(activeTab === 'all' || activeTab === 'labs') && (
          <div className="space-y-3 pt-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Icons.FlaskConical className="w-4 h-4 text-sky-600" />
              <span>Diagnostic Lab Test Reports</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(labReports || []).length === 0 ? (
                <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Icons.FlaskConical className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-500">No lab diagnostic reports uploaded yet</p>
                </div>
              ) : (
                (labReports || []).map((lab) => (
                <div
                  key={lab.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-sky-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-sky-50 text-sky-800 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {lab.id}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{lab.testName}</h4>
                        <p className="text-xs text-slate-500">{lab.category} • Ref: {lab.doctorName}</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        {lab.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-lg leading-relaxed">
                      {lab.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Reported: {lab.reportDate}</span>
                    <button
                      onClick={() => setSelectedReport(lab)}
                      className="px-3 py-1 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                    >
                      View Biomarkers
                    </button>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Prescription Detail Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-sky-800 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                  {selectedRx.id}
                </span>
                <h3 className="text-base font-bold mt-1">Digital Medical Prescription</h3>
                <p className="text-xs text-teal-100">{selectedRx.doctorName} ({selectedRx.doctorSpecialty})</p>
              </div>
              <button onClick={() => setSelectedRx(null)} className="text-teal-200 hover:text-white">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Patient:</span> <span className="font-bold text-slate-800">{selectedRx.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Date:</span> <span className="font-bold text-slate-800">{selectedRx.date}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Clinical Diagnosis:</span>{' '}
                  <span className="font-bold text-teal-800">{selectedRx.diagnosis}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Rx Medications</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {selectedRx.medicines?.map((med, idx) => (
                    <div key={idx} className="p-3 bg-white hover:bg-slate-50">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{idx + 1}. {med.name}</span>
                        <span className="text-teal-700">{med.duration}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px] mt-1">
                        <span>Dosage: {med.dosage}</span>
                        <span className="font-semibold text-slate-700">{med.frequency}</span>
                      </div>
                      {med.instructions && (
                        <p className="text-[11px] text-amber-700 mt-1 italic">Note: {med.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedRx.advice && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900">
                  <p className="font-bold mb-1">Doctor's Advice:</p>
                  <p>{selectedRx.advice}</p>
                </div>
              )}

              {selectedRx.followUp && (
                <div className="bg-slate-100 rounded-xl p-2.5 text-xs text-slate-700 flex items-center justify-between">
                  <span className="font-medium">Follow-up:</span>
                  <span className="font-bold text-teal-800">{selectedRx.followUp}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">Digitally signed & verified by MediConnect Clinical EMR</span>
              <button
                onClick={() => setSelectedRx(null)}
                className="px-4 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lab Biomarkers Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-800 to-indigo-900 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                  {selectedReport.id}
                </span>
                <h3 className="text-base font-bold mt-1">{selectedReport.testName}</h3>
                <p className="text-xs text-sky-200">Department of Pathology & Laboratory Medicine</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-sky-200 hover:text-white">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between">
                <div>
                  <p className="text-slate-500">Collected: <span className="font-bold text-slate-800">{selectedReport.sampleDate}</span></p>
                  <p className="text-slate-500">Reported: <span className="font-bold text-slate-800">{selectedReport.reportDate}</span></p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    Verified by Pathologist
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Test Parameters & Findings</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="grid grid-cols-3 bg-slate-100 p-2.5 font-bold text-slate-600 text-[11px]">
                    <span>Investigation</span>
                    <span className="text-center">Observed Value</span>
                    <span className="text-right">Reference Interval</span>
                  </div>
                  {selectedReport.keyMetrics?.map((metric, idx) => (
                    <div key={idx} className="grid grid-cols-3 p-2.5 items-center">
                      <span className="font-medium text-slate-900">{metric.parameter}</span>
                      <span className={`text-center font-bold font-mono ${
                        metric.status === 'Borderline' ? 'text-amber-600' : 'text-slate-800'
                      }`}>
                        {metric.value}
                      </span>
                      <span className="text-right text-slate-500">{metric.normalRange}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900 leading-relaxed">
                <p className="font-bold mb-1">Pathologist Impression:</p>
                <p>{selectedReport.summary}</p>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-1.5 bg-sky-700 text-white text-xs font-bold rounded-lg hover:bg-sky-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pan-India Doctor Share Modal */}
      <ShareRecordModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        patient={patient}
        showToast={showToast}
      />
    </div>
  );
}
