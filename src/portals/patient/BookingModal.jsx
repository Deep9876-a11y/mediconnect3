import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function BookingModal({ isOpen, onClose, selectedDoctor, onBookingComplete, patient }) {
  if (!isOpen || !selectedDoctor) return null;

  const [step, setStep] = useState(1);
  const [consultType, setConsultType] = useState('In-Clinic Consultation');
  const [selectedDate, setSelectedDate] = useState('2026-09-18');
  const [selectedSlot, setSelectedSlot] = useState(selectedDoctor.availableSlots?.[0] || '10:00 AM');
  const [symptoms, setSymptoms] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const dates = [
    { label: 'Today', date: '2026-09-17', day: 'Thu' },
    { label: 'Tomorrow', date: '2026-09-18', day: 'Fri' },
    { label: 'Sep 19', date: '2026-09-19', day: 'Sat' },
    { label: 'Sep 21', date: '2026-09-21', day: 'Mon' }
  ];

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const bookingData = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      doctorAvatar: selectedDoctor.avatar,
      patientId: patient?.id || 'pat-101',
      patientName: patient?.name || 'Aarav Sharma',
      patientAge: patient?.age || 32,
      patientGender: patient?.gender || 'Male',
      date: selectedDate,
      timeSlot: selectedSlot,
      type: consultType,
      room: consultType === 'In-Clinic Consultation' ? 'Block A - Room 102' : 'Tele-OPD Room 3',
      symptoms: symptoms || 'General follow-up consultation',
      fee: selectedDoctor.fee,
      paymentStatus: paymentMethod === 'Pay at Clinic' ? 'Pay at Clinic' : `Paid (${paymentMethod})`
    };

    const result = await onBookingComplete(bookingData);
    setIsSubmitting(false);
    setConfirmedBooking(result);
    setStep(4); // Success step
  };

  const handleClose = () => {
    setStep(1);
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 to-sky-800 p-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src={selectedDoctor.avatar}
              alt={selectedDoctor.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white/40 shadow-sm"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-teal-100">
                Apollo & Practo Verified Doctor
              </span>
              <h3 className="text-base font-bold leading-tight">{selectedDoctor.name}</h3>
              <p className="text-xs text-sky-200">{selectedDoctor.specialty} • {selectedDoctor.experience}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg text-sky-200 hover:text-white hover:bg-white/10">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {step < 4 && (
          <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>1</span>
              <span className={step === 1 ? 'font-bold text-teal-900' : 'text-slate-500'}>Mode</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>2</span>
              <span className={step === 2 ? 'font-bold text-teal-900' : 'text-slate-500'}>Date & Slot</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>3</span>
              <span className={step === 3 ? 'font-bold text-teal-900' : 'text-slate-500'}>Details & Pay</span>
            </div>
          </div>
        )}

        {/* Step 1: Mode Selection */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Select Consultation Mode</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setConsultType('In-Clinic Consultation')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  consultType === 'In-Clinic Consultation'
                    ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                  <Icons.Building className="w-5 h-5" />
                </div>
                <p className="font-bold text-xs text-slate-900">In-Clinic Visit</p>
                <p className="text-[11px] text-slate-500 mt-1">Visit MediConnect Hospital OPD. In-person physical checkup.</p>
                <p className="text-xs font-bold text-teal-700 mt-3">₹{selectedDoctor.fee}</p>
              </button>

              <button
                type="button"
                onClick={() => setConsultType('Video Consultation')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  consultType === 'Video Consultation'
                    ? 'border-sky-600 bg-sky-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                  <Icons.Video className="w-5 h-5" />
                </div>
                <p className="font-bold text-xs text-slate-900">Video Consult</p>
                <p className="text-[11px] text-slate-500 mt-1">HD Tele-consultation via MediConnect secure video room.</p>
                <p className="text-xs font-bold text-sky-700 mt-3">₹{selectedDoctor.fee}</p>
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg flex items-center space-x-2 text-xs text-slate-600">
              <Icons.ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Includes free 7-day follow-up consultation with {selectedDoctor.name}.</span>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <span>Continue to Date & Slot</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Slot */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">1. Select Appointment Date</h4>
              <div className="grid grid-cols-4 gap-2">
                {dates.map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`py-2 px-1 text-center rounded-xl border transition-all ${
                      selectedDate === d.date
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-[10px] opacity-80 uppercase">{d.day}</span>
                    <span className="block text-xs font-bold mt-0.5">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">2. Available Time Slots</h4>
              <div className="grid grid-cols-3 gap-2">
                {(selectedDoctor.availableSlots || ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '05:30 PM']).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 text-xs rounded-lg border font-medium transition-all ${
                      selectedSlot === slot
                        ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <span>Continue to Patient Details</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Patient Details & Payment */}
        {step === 3 && (
          <div className="p-6 space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500">Patient:</span>{' '}
                  <span className="font-bold text-slate-800">{patient?.name || 'Aarav Sharma'} (32, M)</span>
                </div>
                <div>
                  <span className="text-slate-500">UHID:</span>{' '}
                  <span className="font-mono font-semibold text-slate-700">{patient?.uhid || 'MC-2026-8941'}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Slot: <span className="font-semibold text-teal-700">{selectedDate} at {selectedSlot}</span> ({consultType})
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Reason for Visit / Chief Symptoms (Optional)
              </label>
              <textarea
                rows="2"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Mild headache, fever since yesterday, routine BP checkup..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Payment Option
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['UPI', 'Card / NetBanking', 'Pay at Clinic'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-1 text-center rounded-lg border font-medium transition-all ${
                      paymentMethod === method
                        ? 'border-teal-600 bg-teal-50 text-teal-800 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-teal-800 font-medium">Consultation Fee</p>
                <p className="text-[10px] text-slate-500">Includes hospital registration & GST</p>
              </div>
              <span className="text-base font-black text-teal-900">₹{selectedDoctor.fee}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Confirming Booking...</span>
                ) : (
                  <>
                    <span>Confirm & Book Appointment</span>
                    <Icons.CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation Screen */}
        {step === 4 && confirmedBooking && (
          <div className="p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Icons.CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Appointment Confirmed
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Booking ID: {confirmedBooking.id}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirmation SMS & WhatsApp sent to {patient?.phone || '+91 98765 43210'}.
              </p>
            </div>

            {/* Token Card */}
            <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-4 rounded-xl text-left shadow-lg">
              <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-2">
                <div>
                  <p className="text-[10px] text-teal-300 font-bold uppercase">OPD Token Number</p>
                  <p className="text-2xl font-black tracking-wider text-white">{confirmedBooking.tokenNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-300">Room / OPD Wing</p>
                  <p className="text-xs font-bold text-teal-200">{confirmedBooking.room}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400">Doctor</p>
                  <p className="font-semibold text-slate-100">{confirmedBooking.doctorName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Slot</p>
                  <p className="font-semibold text-slate-100">{confirmedBooking.date} • {confirmedBooking.timeSlot}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Go to My Appointments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
