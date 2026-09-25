import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function PrescriptionModal({ isOpen, onClose, appointment, onSavePrescription }) {
  if (!isOpen || !appointment) return null;

  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '1 tab', frequency: 'Once daily after breakfast (OD)', duration: '14 days', instructions: 'Take with water' }
  ]);
  const [advice, setAdvice] = useState('Maintain low sodium diet, avoid strenuous exertion, take readings daily.');
  const [followUp, setFollowUp] = useState('After 2 weeks or if symptoms persist');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '1 tab', frequency: 'Twice daily after food (BD)', duration: '7 days', instructions: '' }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = medicines.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis) {
      alert("Please enter a clinical diagnosis");
      return;
    }

    setIsSaving(true);
    const prescriptionData = {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      doctorId: appointment.doctorId || 'doc-1',
      doctorName: appointment.doctorName || 'Dr. Ananya Iyer',
      doctorSpecialty: appointment.doctorSpecialty || 'Cardiology',
      diagnosis,
      medicines: medicines.filter((m) => m.name.trim() !== ''),
      advice,
      followUp
    };

    await onSavePrescription(prescriptionData);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-sky-800 p-5 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Clinical EMR • Prescription Desk
            </span>
            <h3 className="text-base font-bold mt-1">Write Medical Prescription</h3>
            <p className="text-xs text-teal-100">
              Patient: {appointment.patientName} (Token: {appointment.tokenNumber})
            </p>
          </div>
          <button onClick={onClose} className="text-teal-200 hover:text-white p-1">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Patient Quick Strip */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800">{appointment.patientName} ({appointment.patientAge || 32} yrs)</p>
              <p className="text-[11px] text-slate-500">Chief Complaint: {appointment.symptoms}</p>
            </div>
            <span className="bg-teal-100 text-teal-800 font-bold px-2 py-1 rounded text-[10px]">
              Dr. Ananya Iyer (Consultant)
            </span>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Clinical Diagnosis / Assessment *
            </label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Essential Stage 1 Hypertension with mild anxiety-related palpitations"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium text-slate-800"
            />
          </div>

          {/* Medicines Dynamic Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Prescribed Medicines & Dosage
              </label>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="text-teal-700 hover:text-teal-800 font-bold flex items-center space-x-1"
              >
                <Icons.Plus className="w-3.5 h-3.5" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-3">
              {medicines.map((med, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-900 text-[11px]">Medicine #{idx + 1}</span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(idx)}
                        className="text-rose-500 hover:text-rose-700 text-[11px] font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        value={med.name}
                        onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                        placeholder="Drug / Brand name (e.g. Tab. Telmisartan 40mg)"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                        placeholder="Dosage (e.g. 1 tab)"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <select
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="Once daily in morning (OD)">Once daily in morning (OD)</option>
                        <option value="Once daily at night (OD)">Once daily at night (OD)</option>
                        <option value="Twice daily after meals (BD)">Twice daily after meals (BD)</option>
                        <option value="Three times daily (TDS)">Three times daily (TDS)</option>
                        <option value="As needed for SOS pain (SOS)">As needed for SOS (SOS)</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                        placeholder="Duration (e.g. 5 days, 30 days)"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Lifestyle */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Dietary & Lifestyle Advice
            </label>
            <textarea
              rows="2"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-800"
            ></textarea>
          </div>

          {/* Follow up */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Recommended Follow-Up
            </label>
            <input
              type="text"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <Icons.CheckCircle className="w-4 h-4" />
              <span>{isSaving ? 'Saving & Signing Rx...' : 'Sign & Issue Digital Prescription'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
