import React from 'react';
import { Icons } from './Icons.jsx';

export function RoleModal({ isOpen, onClose, currentRole, onSelectRole }) {
  if (!isOpen) return null;

  const roles = [
    {
      id: 'patient',
      title: 'Patient Portal',
      persona: 'Aarav Sharma (Patient)',
      color: 'teal',
      border: 'border-teal-200 hover:border-teal-500 hover:bg-teal-50/50',
      badgeBg: 'bg-teal-100 text-teal-800',
      icon: Icons.User,
      description: 'Book doctor appointments, view real-time home sample collection tracker, inspect medical prescriptions and lab diagnostic records.',
      features: ['Find & Filter Doctors', 'Interactive Booking Stepper', 'Home Sample Collection Tracker', 'Health Records Timeline']
    },
    {
      id: 'doctor',
      title: 'Doctor Portal',
      persona: 'Dr. Ananya Iyer (Cardiologist)',
      color: 'sky',
      border: 'border-sky-200 hover:border-sky-500 hover:bg-sky-50/50',
      badgeBg: 'bg-sky-100 text-sky-800',
      icon: Icons.Stethoscope,
      description: 'Manage live daily OPD patient queue, inspect patient clinical dossiers, write prescriptions with auto-save to health records, manage slot availability.',
      features: ["Today's Patient Queue", 'Patient Medical History', 'Prescription Writing Form', 'Slot & Availability Manager']
    },
    {
      id: 'admin',
      title: 'Admin Portal',
      persona: 'Hospital Executive & Super Admin',
      color: 'indigo',
      border: 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50',
      badgeBg: 'bg-indigo-100 text-indigo-800',
      icon: Icons.ShieldCheck,
      description: 'Monitor hospital KPIs (revenue, bed occupancy, appointments), manage doctor rosters, oversee departments, and analyze operational trends.',
      features: ['Executive Dashboard Metrics', 'Doctor Management (Add/Edit)', 'Hospital Departments', 'Weekly Analytics & Revenue Charts']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 p-6 text-white flex justify-between items-center">
          <div>
            <span className="inline-block bg-teal-500/20 text-teal-300 text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 border border-teal-500/30">
              Role Selector
            </span>
            <h2 className="text-xl font-bold tracking-tight">Select Presentation Perspective</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Switch roles instantly during your faculty pitch to showcase each stakeholder portal.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role) => {
            const IconComp = role.icon;
            const isSelected = currentRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => {
                  onSelectRole(role.id);
                  onClose();
                }}
                className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between ${isSelected
                    ? 'border-teal-600 bg-teal-50/40 shadow-md ring-2 ring-teal-500/20'
                    : role.border + ' bg-white shadow-sm'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{role.title}</h3>
                  <p className="text-[11px] font-semibold text-teal-700 mb-2">{role.persona}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {role.description}
                  </p>
                </div>

                <div>
                  <div className="space-y-1 mb-4">
                    {role.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                        <Icons.CheckCircle className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${isSelected
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                  >
                    {isSelected ? 'Currently Viewing' : `Switch to ${role.title}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>* Role switching retains simulated appointments & prescriptions across sessions.</span>
          <button
            onClick={onClose}
            className="font-semibold text-slate-700 hover:text-slate-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
