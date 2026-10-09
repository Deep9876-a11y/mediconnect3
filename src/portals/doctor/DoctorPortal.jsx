import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';
import { PatientHistoryModal } from './PatientHistoryModal.jsx';
import { PrescriptionModal } from './PrescriptionModal.jsx';
import { SlotManager } from './SlotManager.jsx';
import { ManageReceptionist } from './ManageReceptionist.jsx';

export function DoctorPortal({
  appointments,
  prescriptions,
  doctors,
  onUpdateAppointmentStatus,
  onSavePrescription,
  onUpdateDoctor,
  showToast,
  authUser
}) {
  const [activeSubTab, setActiveSubTab] = useState('queue'); // 'queue' or 'availability'
  const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);
  const [selectedAppointmentForRx, setSelectedAppointmentForRx] = useState(null);
  const [queueFilter, setQueueFilter] = useState('All');

  // Currently logged-in doctor resolved dynamically
  const currentDoctor = doctors.find((d) =>
    (authUser?.id && d.id === authUser.id) ||
    (authUser?.name && d.name.toLowerCase().includes(authUser.name.toLowerCase().split(' ')[1] || authUser.name.toLowerCase())) ||
    (authUser?.email && d.email && d.email.toLowerCase() === authUser.email.toLowerCase())
  ) || doctors.find((d) => d.id === 'doc-1') || doctors[0];

  // Strictly doctor's own queue (No other doctor's patients can be viewed)
  const doctorAppointments = appointments.filter(
    (a) => a.doctorId === currentDoctor.id || a.doctorName?.toLowerCase().includes(currentDoctor.name?.toLowerCase().split(' ')[1] || currentDoctor.name?.toLowerCase())
  );

  const filteredQueue = doctorAppointments.filter((a) => {
    if (queueFilter === 'All') return true;
    return a.status.toLowerCase() === queueFilter.toLowerCase();
  });

  const waitingCount = doctorAppointments.filter((a) => a.status === 'Waiting' || a.status === 'Upcoming').length;
  const inConsultCount = doctorAppointments.filter((a) => a.status === 'In-Consultation').length;
  const completedCount = doctorAppointments.filter((a) => a.status === 'Completed').length;

  const handleStatusChange = async (appointmentId, newStatus) => {
    await onUpdateAppointmentStatus(appointmentId, newStatus);
    showToast({
      type: 'info',
      title: 'Queue Status Updated',
      message: `Appointment marked as ${newStatus}.`
    });
  };

  const handlePrescriptionSaved = async (rxData) => {
    const newRx = await onSavePrescription(rxData);
    showToast({
      type: 'success',
      title: 'Prescription Issued!',
      message: `Prescription #${newRx.id} generated for ${newRx.patientName}. Patient records updated.`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Sub-nav banner */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <img
                src={currentDoctor.avatar}
                alt={currentDoctor.name}
                className="w-10 h-10 rounded-xl object-cover border border-sky-400 shadow-xs"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-bold text-slate-900">{currentDoctor.name}</h2>
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {currentDoctor.specialty}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Room 102 • Cardiology Wing • OPD Duty Active</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold">
              <button
                onClick={() => setActiveSubTab('queue')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeSubTab === 'queue'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icons.Users className="w-4 h-4" />
                <span>Today's Patient Queue ({doctorAppointments.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab('availability')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeSubTab === 'availability'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icons.Calendar className="w-4 h-4" />
                <span>Availability & Calendar</span>
              </button>

              <button
                onClick={() => setActiveSubTab('staff')}
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                  activeSubTab === 'staff'
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icons.Users className="w-4 h-4" />
                <span>Manage Staff</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {activeSubTab === 'queue' ? (
          <>
            {/* KPI Metric cards for OPD session */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Total Scheduled</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{doctorAppointments.length}</p>
                </div>
                <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                  <Icons.Calendar className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-600 font-medium">Waiting in Lounge</span>
                  <p className="text-2xl font-black text-amber-700 mt-0.5">{waitingCount}</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Icons.Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-sky-600 font-medium">In Consultation</span>
                  <p className="text-2xl font-black text-sky-700 mt-0.5">{inConsultCount}</p>
                </div>
                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                  <Icons.Stethoscope className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-600 font-medium">Consultations Completed</span>
                  <p className="text-2xl font-black text-emerald-700 mt-0.5">{completedCount}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Icons.CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Queue Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">Filter Queue:</span>
                {['All', 'Waiting', 'In-Consultation', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setQueueFilter(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      queueFilter === status
                        ? 'bg-sky-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400">
                Sorted by appointment time slot
              </span>
            </div>

            {/* Patient Queue Cards / Table */}
            <div className="space-y-3">
              {filteredQueue.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <Icons.Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No patients in this queue filter</p>
                </div>
              ) : (
                filteredQueue.map((appointment) => {
                  const statusColors = {
                    Upcoming: 'bg-blue-50 text-blue-800 border-blue-200',
                    Waiting: 'bg-amber-50 text-amber-800 border-amber-200',
                    'In-Consultation': 'bg-sky-100 text-sky-800 border-sky-300 animate-pulse',
                    Completed: 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  };

                  return (
                    <div
                      key={appointment.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      {/* Left: Patient Details */}
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-700 text-white flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0">
                          {appointment.tokenNumber}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900">
                              {appointment.patientName}
                            </h3>
                            <span className="text-xs text-slate-500">
                              ({appointment.patientAge || 32} yrs, {appointment.patientGender || 'Male'})
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                statusColors[appointment.status] || 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center space-x-1 font-semibold text-sky-800">
                              <Icons.Clock className="w-3.5 h-3.5" />
                              <span>{appointment.timeSlot}</span>
                            </span>
                            <span>•</span>
                            <span className="text-slate-600">{appointment.type}</span>
                            <span>•</span>
                            <span className="text-slate-400">Token #{appointment.tokenNumber}</span>
                          </div>

                          <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2 rounded-lg leading-relaxed max-w-2xl">
                            <span className="font-semibold text-slate-900">Complaint:</span> {appointment.symptoms}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* Status Select dropdown */}
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                          className="text-xs border border-slate-300 rounded-xl px-2.5 py-2 font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="Waiting">Mark Waiting</option>
                          <option value="In-Consultation">Call In Consultation</option>
                          <option value="Completed">Mark Completed</option>
                        </select>

                        {/* View History dossier */}
                        <button
                          onClick={() => setSelectedPatientHistory(appointment)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
                        >
                          <Icons.FileText className="w-3.5 h-3.5 text-slate-600" />
                          <span>History Dossier</span>
                        </button>

                        {/* Write Prescription button */}
                        <button
                          onClick={() => setSelectedAppointmentForRx(appointment)}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center space-x-1"
                        >
                          <Icons.Pill className="w-3.5 h-3.5" />
                          <span>Write Rx</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : activeSubTab === 'availability' ? (
          <SlotManager
            doctor={currentDoctor}
            onUpdateDoctor={onUpdateDoctor}
            showToast={showToast}
          />
        ) : (
          <ManageReceptionist
            doctor={currentDoctor}
            showToast={showToast}
          />
        )}
      </main>

      {/* Patient Medical History Dossier Modal */}
      <PatientHistoryModal
        isOpen={Boolean(selectedPatientHistory)}
        onClose={() => setSelectedPatientHistory(null)}
        patientAppointment={selectedPatientHistory}
        prescriptions={prescriptions}
      />

      {/* Write Prescription Modal */}
      <PrescriptionModal
        isOpen={Boolean(selectedAppointmentForRx)}
        onClose={() => setSelectedAppointmentForRx(null)}
        appointment={selectedAppointmentForRx}
        onSavePrescription={handlePrescriptionSaved}
      />
    </div>
  );
}
