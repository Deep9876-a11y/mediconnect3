import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function SlotManager({ doctor, onUpdateDoctor, showToast }) {
  const [slots, setSlots] = useState(
    doctor?.availableSlots || [
      '09:30 AM',
      '10:00 AM',
      '10:30 AM',
      '11:00 AM',
      '11:30 AM',
      '02:00 PM',
      '02:30 PM',
      '03:30 PM',
      '04:30 PM',
      '05:30 PM'
    ]
  );

  const [activeDays, setActiveDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [isAvailableToday, setIsAvailableToday] = useState(doctor?.availableToday ?? true);

  const toggleSlot = (slot) => {
    if (slots.includes(slot)) {
      setSlots(slots.filter((s) => s !== slot));
    } else {
      setSlots([...slots, slot]);
    }
  };

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlotTime) return;
    if (!slots.includes(newSlotTime)) {
      setSlots([...slots, newSlotTime]);
      setNewSlotTime('');
    }
  };

  const handleSave = () => {
    onUpdateDoctor(doctor.id, {
      availableSlots: slots,
      availableToday: isAvailableToday
    });
    showToast({
      type: 'success',
      title: 'OPD Schedule Updated',
      message: `Updated availability slots for ${doctor.name}.`
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
            Cardiology OPD Wing • Room 102
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Doctor Availability & Slot Management
          </h2>
          <p className="text-xs text-slate-500">
            Define daily consultation slots, mark emergency surgery leaves, and set weekly clinic timings.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 flex-shrink-0"
        >
          <Icons.CheckCircle className="w-4 h-4" />
          <span>Save OPD Availability</span>
        </button>
      </div>

      {/* Today's Switch */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${isAvailableToday ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            <Icons.Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today's Clinic Status</h3>
            <p className="text-xs text-slate-500">
              {isAvailableToday
                ? 'Doctor is currently accepting OPD patients & queue walk-ins.'
                : 'Doctor is marked away (In Surgery / Off duty). New bookings temporarily paused.'}
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAvailableToday}
            onChange={(e) => setIsAvailableToday(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      {/* Weekly Working Days */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Weekly Working Schedule
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
            const isActive = activeDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => {
                  if (isActive) setActiveDays(activeDays.filter((d) => d !== day));
                  else setActiveDays([...activeDays, day]);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot Chips Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Time Slots ({slots.length} Slots Enabled)
            </h3>
            <p className="text-xs text-slate-500">
              Click any slot chip to toggle between Available (Teal) and Blocked/Unavailable (Slate).
            </p>
          </div>
        </div>

        {/* All master standard slots */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {[
            '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
            '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
            '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
          ].map((time) => {
            const isEnabled = slots.includes(time);
            return (
              <button
                key={time}
                onClick={() => toggleSlot(time)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                  isEnabled
                    ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-xs ring-1 ring-teal-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                <span>{time}</span>
                {isEnabled ? (
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add custom slot form */}
        <form onSubmit={handleAddSlot} className="pt-4 border-t border-slate-100 flex items-center space-x-2">
          <input
            type="text"
            value={newSlotTime}
            onChange={(e) => setNewSlotTime(e.target.value)}
            placeholder="Add custom slot (e.g. 07:15 PM)"
            className="text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none w-64"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Add Slot
          </button>
        </form>
      </div>
    </div>
  );
}
