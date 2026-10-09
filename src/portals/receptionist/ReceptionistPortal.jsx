import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons.jsx';
import { apiService } from '../../api/apiService.js';

export function ReceptionistPortal({
  appointments,
  doctors,
  onUpdateAppointmentStatus,
  onBookAppointment,
  showToast,
  authUser
}) {
  const [assignedDoctor, setAssignedDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('queue'); // queue, walkin
  const [walkinData, setWalkinData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'Male',
    symptoms: '',
    timeSlot: '' // Must pick an empty one
  });

  // Resolve assigned doctor
  useEffect(() => {
    if (authUser && authUser.assignedDoctorId) {
      const doc = doctors.find(d => d.id === authUser.assignedDoctorId);
      setAssignedDoctor(doc || doctors[0]);
    } else {
      // fallback for demo
      setAssignedDoctor(doctors[0]);
    }
  }, [authUser, doctors]);

  if (!assignedDoctor) {
    return <div className="p-10 text-center">Loading Doctor Details...</div>;
  }

  // Filter appointments for this doctor only
  const docAppointments = appointments.filter(a => a.doctorId === assignedDoctor.id);

  // Generate available slots (e.g., 9:00 AM to 5:00 PM, 30 min intervals)
  const generateSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    for (let h = startHour; h < endHour; h++) {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const displayH = h > 12 ? h - 12 : h;
      slots.push(`${displayH}:00 ${ampm}`);
      slots.push(`${displayH}:30 ${ampm}`);
    }
    return slots;
  };

  const allSlots = generateSlots();
  // Filter out slots that are already booked
  const bookedSlots = docAppointments.map(a => a.timeSlot);
  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s));

  const handleStatusChange = async (appointmentId, newStatus) => {
    await onUpdateAppointmentStatus(appointmentId, newStatus);
    showToast({
      type: 'info',
      title: 'Queue Updated',
      message: `Appointment marked as ${newStatus}.`
    });
  };

  const handleWalkinSubmit = async (e) => {
    e.preventDefault();
    if (!walkinData.patientName || !walkinData.timeSlot) {
      showToast({ type: 'error', title: 'Error', message: 'Name and Slot are required.' });
      return;
    }

    // Book appointment
    await onBookAppointment({
      ...walkinData,
      doctorId: assignedDoctor.id,
      doctorName: assignedDoctor.name,
      department: assignedDoctor.specialty,
      date: new Date().toISOString().split('T')[0],
      type: 'Walk-in',
      status: 'Upcoming',
      bookingMethod: 'receptionist'
    });

    showToast({ type: 'success', title: 'Walk-in Booked', message: `Added ${walkinData.patientName} to the queue.` });
    setWalkinData({ patientName: '', patientAge: '', patientGender: 'Male', symptoms: '', timeSlot: '' });
    setActiveTab('queue');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Banner */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-700 flex items-center justify-center font-bold">
              {authUser?.name ? authUser.name.charAt(0) : 'R'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Reception Desk: {assignedDoctor.name}</h2>
              <p className="text-[11px] text-slate-500">Managing OPD Queue & Walk-ins</p>
            </div>
          </div>
          
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'queue' ? 'bg-white shadow-sm text-fuchsia-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Queue
            </button>
            <button
              onClick={() => setActiveTab('walkin')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'walkin' ? 'bg-white shadow-sm text-fuchsia-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Walk-in Patient
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'queue' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Today's Appointments</h3>
              <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-full">Total: {docAppointments.length}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {docAppointments.map(app => (
                <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-700 text-sm">
                        {app.tokenNumber || '#'}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{app.patientName}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {app.type || 'Online'}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      app.status === 'Waiting' ? 'bg-amber-100 text-amber-800' :
                      app.status === 'In-Consultation' ? 'bg-sky-100 text-sky-800' :
                      app.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mb-4 flex items-center space-x-2">
                    <Icons.Clock className="w-3.5 h-3.5" />
                    <span className="font-semibold">{app.timeSlot}</span>
                  </div>

                  <div className="mt-auto border-t border-slate-100 pt-3">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">UPDATE STATUS</label>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-700 focus:ring-2 focus:ring-fuchsia-500"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Waiting">Patient Arrived (Waiting)</option>
                      <option value="In-Consultation">In Consultation</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-fuchsia-100 text-fuchsia-600 rounded-xl flex items-center justify-center">
                <Icons.User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Add Walk-in Patient</h3>
                <p className="text-xs text-slate-500">Book an immediate available slot for an offline patient.</p>
              </div>
            </div>

            <form onSubmit={handleWalkinSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name</label>
                  <input type="text" value={walkinData.patientName} onChange={e => setWalkinData({...walkinData, patientName: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input type="number" value={walkinData.patientAge} onChange={e => setWalkinData({...walkinData, patientAge: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select value={walkinData.patientGender} onChange={e => setWalkinData({...walkinData, patientGender: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Available Slot</label>
                  <select value={walkinData.timeSlot} onChange={e => setWalkinData({...walkinData, timeSlot: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl font-semibold text-fuchsia-700" required>
                    <option value="">Select a slot...</option>
                    {availableSlots.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Symptoms / Notes</label>
                <textarea value={walkinData.symptoms} onChange={e => setWalkinData({...walkinData, symptoms: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl h-24" placeholder="Brief description..." />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button type="submit" className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-sm font-bold shadow-sm">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
