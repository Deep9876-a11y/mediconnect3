import React, { useState } from 'react';
import { Icons } from './Icons.jsx';

export function Navbar({ activeRole, setRole, onOpenRoleModal, onOpenAiModal, onOpenCloudModal, onLogout, patient, authUser, notifications = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = authUser?.name || (
    activeRole === 'patient' ? 'Aarav Sharma' :
    activeRole === 'doctor'  ? 'Dr. Ananya Iyer' : 'Super Admin'
  );

  const displayAvatar = authUser?.avatar || (
    activeRole === 'patient'
      ? (patient?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100")
      : activeRole === 'doctor'
        ? "https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=100"
        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
  );

  const roleBadge = {
    patient: { label: 'Patient', color: 'bg-teal-600', dot: 'bg-teal-500' },
    doctor:  { label: 'Doctor',  color: 'bg-sky-600',  dot: 'bg-sky-500'  },
    admin:   { label: 'Admin',   color: 'bg-indigo-600', dot: 'bg-indigo-500' },
    receptionist: { label: 'Receptionist', color: 'bg-fuchsia-600', dot: 'bg-fuchsia-500' }
  }[activeRole] || { label: 'Staff', color: 'bg-slate-600', dot: 'bg-slate-500' };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-all">
      {/* Top emergency & quick info bar */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 text-white text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>24x7 Emergency OPD:</span>
            <a href="tel:108" className="underline font-bold text-sky-200 hover:text-white">108</a>
            <span className="text-sky-400">|</span>
            <a href="tel:1800633422" className="underline font-semibold text-sky-200 hover:text-white">1800-MEDI-CONNECT</a>
          </span>
          <span className="hidden md:inline-block text-sky-300">
            NABH Accredited Multi-Specialty Hospital Network
          </span>
        </div>
        <div className="flex items-center space-x-3">

        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Icons.HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Medi<span className="text-teal-600">Connect</span>
                </span>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  HMS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide leading-none hidden sm:block">
                Secure Role-Based Portal
              </p>
            </div>
          </div>



          {/* Right Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Online Cloud Database Status Button */}
            <button
              onClick={onOpenCloudModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold transition shadow-xs"
              title="Google Cloud Firestore Online Database"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Icons.Cloud className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Cloud DB</span>
            </button>

            {/* Ask AI Assistant Button */}
            <button
              onClick={onOpenAiModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/10 to-sky-500/10 hover:from-teal-500/20 hover:to-sky-500/20 border border-teal-300/40 text-teal-800 text-xs font-semibold transition-all shadow-sm"
              title="AI Triage & Clinical Assistant"
            >
              <Icons.Bot className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Ask AI</span>

            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
                title="Notifications"
              >
                <Icons.Activity className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Hospital Alerts</span>
                    <span className="text-[10px] text-teal-600 font-semibold cursor-pointer" onClick={() => setShowNotifications(false)}>Close</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2">
                    {[
                      { title: 'Dr. Ananya Iyer confirmed slot', body: 'Appointment #APT-9102 scheduled for tomorrow at 11:30 AM.', time: '10 mins ago' },
                      { title: 'Phlebotomist Assigned', body: 'Ramesh Kumar assigned for Order #HSL-9281 (Full Body Panel).', time: '1 hour ago' },
                      { title: 'Prescription Updated', body: 'Digital prescription #RX-4412 ready for download.', time: 'Yesterday' }
                    ].map((n, i) => (
                      <div key={i} className="py-2 text-xs">
                        <p className="font-semibold text-slate-800">{n.title}</p>
                        <p className="text-slate-500 text-[11px]">{n.body}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar + Dropdown with Logout */}
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-left"
              >
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full object-cover border border-white shadow-sm"
                />
                <div className="hidden sm:block text-xs leading-tight">
                  <p className="font-bold text-slate-800">{displayName}</p>
                  <p className="text-[10px] text-teal-600 font-medium capitalize flex items-center space-x-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot} inline-block`}></span>
                    <span>{activeRole} Portal</span>
                  </p>
                </div>
                <Icons.ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                  {/* User info header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <img src={displayAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{activeRole} · Logged in</p>
                      </div>
                    </div>
                  </div>
                  {/* Menu items */}
                  <div className="py-1.5">

                    <button
                      onClick={() => { setShowUserMenu(false); onOpenAiModal(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors"
                    >
                      <Icons.Bot className="w-4 h-4 text-slate-400" />
                      <span>AI Assistant</span>
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => { setShowUserMenu(false); onLogout(); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2.5 transition-colors"
                      >
                        <Icons.X className="w-4 h-4 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </header>
  );
}
