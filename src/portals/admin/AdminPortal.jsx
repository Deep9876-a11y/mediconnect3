import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';
import { ManageDoctors } from './ManageDoctors.jsx';
import { ManageDepartments } from './ManageDepartments.jsx';
import { ReportsAnalytics } from './ReportsAnalytics.jsx';

export function AdminPortal({
  stats,
  doctors,
  departments,
  appointments,
  users,
  onAddDoctor,
  onVerifyDoctor,
  onUpdateDoctor,
  onAddDepartment,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, doctors, departments, analytics

  const navItems = [
    { id: 'overview', label: 'Executive Dashboard', icon: Icons.Activity },
    { id: 'doctors', label: `Manage Doctors (${doctors.length})`, icon: Icons.Stethoscope },
    { id: 'departments', label: `Departments (${departments.length})`, icon: Icons.Building },
    { id: 'privacy_roster', label: `Patient Flow & Data Privacy (${appointments.length})`, icon: Icons.ShieldCheck },
    { id: 'analytics', label: 'Reports & Analytics', icon: Icons.TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Sub-nav banner */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive Welcome & Live Badge */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-sky-950 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-indigo-400/30">
                  Hospital Central Operations Center
                </span>
                <h1 className="text-2xl font-black tracking-tight mt-1">
                  MediConnect Executive Overview
                </h1>
                <p className="text-xs text-slate-300 mt-1">
                  NABH Compliant Multi-Specialty Hospital Network • Saket, Connaught Place & Gurugram Wings.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Hospital Systems Operational (100%)</span>
                </span>
              </div>
            </div>

            {/* 5 Key Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Total Patients</span>
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <Icons.Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-2">{stats.totalPatients?.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">↑ +14% this month</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Active Doctors</span>
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                    <Icons.Stethoscope className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 mt-2">{doctors.length}</p>
                <span className="text-[10px] text-indigo-600 font-bold mt-1 inline-block">8 Departments</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Today's Appointments</span>
                  <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                    <Icons.Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-teal-700 mt-2">{stats.todayAppointments}</p>
                <span className="text-[10px] text-teal-600 font-bold mt-1 inline-block">64 Clinic + 12 Tele-OPD</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Daily Revenue</span>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                    <Icons.Activity className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-emerald-700 mt-2">₹{(stats.dailyRevenue / 1000).toFixed(1)}k</p>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">Billed Today</span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-500">Bed Occupancy</span>
                  <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
                    <Icons.Bed className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-sky-700 mt-2">{stats.bedOccupancyRate}%</p>
                <span className="text-[10px] text-slate-500 font-semibold mt-1 inline-block">214 of 250 Beds</span>
              </div>
            </div>

            {/* Split layout: Quick shortcuts & Live Activity Log */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 cols: Quick admin actions and department snapshot */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-slate-900">Hospital Management Shortcuts</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveTab('doctors')}
                      className="p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all group"
                    >
                      <Icons.User className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-bold text-xs text-slate-900">Add or Edit Doctors</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Manage doctor credentials & roster</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('departments')}
                      className="p-4 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all group"
                    >
                      <Icons.Building className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-bold text-xs text-slate-900">Manage Departments</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">OPD rooms & clinical wings</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="p-4 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl text-left transition-all group"
                    >
                      <Icons.TrendingUp className="w-5 h-5 text-sky-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-bold text-xs text-slate-900">View Weekly Analytics</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Charts, revenue & throughput</p>
                    </button>
                  </div>
                </div>

                {/* Department Capacity Snapshot */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900">Active Department Roster</h3>
                    <button
                      onClick={() => setActiveTab('departments')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      View All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {departments.slice(0, 4).map((d) => (
                      <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{d.room}</span>
                        <p className="font-bold text-xs text-slate-900 mt-1 truncate">{d.name}</p>
                        <p className="text-[11px] text-indigo-700 font-semibold mt-0.5">{d.doctorCount} Doctors</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 1 col: Live Activity Feed */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Real-Time Hospital Audit Feed</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="space-y-3">
                  {stats.recentActivity?.map((act) => (
                    <div key={act.id} className="flex items-start space-x-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-slate-800 font-medium leading-relaxed">{act.text}</p>
                        <span className="text-[10px] text-slate-400">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <ManageDoctors
            doctors={doctors}
            departments={departments}
            users={users}
            onAddDoctor={onAddDoctor}
            onVerifyDoctor={onVerifyDoctor}
            onUpdateDoctor={onUpdateDoctor}
            showToast={showToast}
          />
        )}

        {activeTab === 'departments' && (
          <ManageDepartments
            departments={departments}
            onAddDepartment={onAddDepartment}
            showToast={showToast}
          />
        )}

        {activeTab === 'privacy_roster' && (
          <div className="space-y-6">
            {/* Privacy Compliance Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-emerald-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                    <Icons.ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-400/30">
                      DPDP & HIPAA Health Privacy Safeguards
                    </span>
                    <h2 className="text-xl font-black mt-1">
                      Patient Clinical Data Access Isolation
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                      Administrative roles have strictly operational visibility (tokens, departments, billing, and scheduling). Personal medical diagnoses, clinical notes, prescriptions, and lab specimens are cryptographically redacted and restricted solely to licensed treating physicians with verified patient consent.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-center">
                  <span className="text-[10px] text-emerald-300 font-bold block uppercase">Admin Clinical Status</span>
                  <span className="text-sm font-black text-white flex items-center justify-center space-x-1 mt-0.5">
                    <Icons.Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>PHI Restrict Active</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Operational Table with Masked Records */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Hospital OPD Queue & Patient Flow ({appointments.length} Total Visits)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Operational roster showing appointment tokens, assigned clinics, and redacted clinical fields.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Icons.Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Clinical Data Masked</span>
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Token & Type</th>
                      <th className="py-3 px-4">Patient (Anonymized)</th>
                      <th className="py-3 px-4">Assigned Doctor</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Date & Slot</th>
                      <th className="py-3 px-4">Clinical Diagnosis / PHI</th>
                      <th className="py-3 px-4">OPD Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(appointments || []).length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-400">
                          No hospital OPD appointments scheduled for today.
                        </td>
                      </tr>
                    ) : (
                      (appointments || []).map((apt) => {
                        // Mask patient name for administrative staff privacy protection
                        const rawName = apt.patientName || 'Tushar Tawar';
                        const parts = rawName.split(' ');
                        const maskedName = parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : rawName;

                        return (
                          <tr key={apt.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
                              {apt.tokenNumber || 'T-100'}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{apt.type || 'In-Person'}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900">{maskedName}</p>
                            <span className="text-[10px] text-slate-400 font-mono">UHID: MC-****-{apt.id.slice(-4)}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            {apt.doctorName}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                              {apt.department}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <span className="font-medium block">{apt.date}</span>
                            <span className="text-[10px] text-slate-400">{apt.time || apt.slot}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[10px] font-bold">
                              <Icons.Lock className="w-3 h-3 text-amber-600 flex-shrink-0" />
                              <span>🔒 Protected PHI — Doctor Eyes Only</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              apt.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'In-Consultation'
                                ? 'bg-sky-100 text-sky-800 animate-pulse'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}>
                              {apt.status || 'Scheduled'}
                            </span>
                          </td>
                        </tr>
                      );
                    }))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <ReportsAnalytics stats={stats} />
        )}
      </main>
    </div>
  );
}
