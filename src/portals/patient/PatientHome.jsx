import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function PatientHome({
  patient,
  appointments,
  doctors,
  departments,
  onNavigateTab,
  onSelectDoctorForBooking,
  onOpenAiModal
}) {
  const [heroSearch, setHeroSearch] = useState('');

  // Find next upcoming appointment
  const upcomingAppointment = appointments.find((a) => a.status === 'Upcoming');

  const specialtyIcons = {
    cardiology: Icons.Heart,
    orthopedics: Icons.Bone,
    neurology: Icons.Brain,
    pediatrics: Icons.Baby,
    dermatology: Icons.Sparkles,
    general_medicine: Icons.Activity,
    radiology: Icons.Activity,
    pathology: Icons.FlaskConical
  };

  return (
    <div className="space-y-8">
      {/* Hero Search Section - Apollo 24/7 & Practo Aesthetic */}
      <div className="relative bg-gradient-to-br from-sky-900 via-sky-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-teal-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Welcome back, {patient?.name?.split(' ')[0] || 'Aarav'}</span>
            <span>•</span>
            <span className="text-white/80">UHID: {patient?.uhid || 'MC-2026-8941'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Comprehensive Hospital Care, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-200">
              Verified Doctors & Fast Diagnostics
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-sky-100 mt-2 max-w-2xl leading-relaxed">
            Connect with Apollo-certified consultants, schedule home blood sample pickups, and track your clinical history in one integrated health portal.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-6 bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-white/30">
            <div className="flex items-center flex-1 px-3 py-1.5 text-slate-400">
              <Icons.Search className="w-5 h-5 text-teal-600 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search doctors, specialties (e.g. Cardiologist, Fever, Ortho)..."
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              onClick={() => onNavigateTab('doctors')}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>Search Doctors</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Popular search tags */}
          <div className="mt-3 flex items-center space-x-2 text-[11px] text-sky-200 overflow-x-auto pb-1 scrollbar-none">
            <span className="font-semibold text-white/90">Popular:</span>
            {['Cardiologist', 'Dermatologist', 'Fever & Flu', 'Knee Pain', 'Full Body Checkup'].map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigateTab('doctors')}
                className="bg-white/10 hover:bg-white/20 border border-white/10 px-2 py-0.5 rounded-full text-sky-100 transition-colors whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Ambient background hospital illustration */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <Icons.HeartPulse className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* 4 Quick Action Banners */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('doctors')}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Icons.Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
            Book Appointment
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Consult in-clinic or via secure HD video call.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-teal-700 mt-3 group-hover:translate-x-1 transition-transform">
            <span>Find Doctor</span>
            <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('sample')}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Icons.FlaskConical className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
            Home Sample Collection
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Doorstep phlebotomist pickup with live tracking.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-emerald-700 mt-3 group-hover:translate-x-1 transition-transform">
            <span>Book Lab Test</span>
            <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('records')}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Icons.FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
            My Health Records
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Access past prescriptions, test reports & timelines.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-sky-700 mt-3 group-hover:translate-x-1 transition-transform">
            <span>View Timeline</span>
            <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>

        <div
          onClick={onOpenAiModal}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Icons.Bot className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
            Ask MediConnect AI
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Intelligent symptom triage & medical Q&A roadmap.
          </p>
          <span className="inline-flex items-center text-xs font-bold text-emerald-700 mt-3 group-hover:translate-x-1 transition-transform">
            <span>Explore Roadmap</span>
            <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>
      </div>

      {/* Upcoming Appointment Spotlight Card (if any) */}
      {upcomingAppointment && (
        <div className="bg-white rounded-2xl p-6 border-2 border-teal-500/30 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={upcomingAppointment.doctorAvatar}
                  alt={upcomingAppointment.doctorName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-teal-600 text-white rounded-full p-1">
                  <Icons.Calendar className="w-3 h-3" />
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Confirmed Appointment
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Token: {upcomingAppointment.tokenNumber}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {upcomingAppointment.doctorName}
                </h3>
                <p className="text-xs text-slate-500">
                  {upcomingAppointment.doctorSpecialty} • {upcomingAppointment.type}
                </p>

                <div className="flex items-center space-x-4 text-xs font-semibold text-teal-800 mt-2">
                  <span className="flex items-center space-x-1">
                    <Icons.Calendar className="w-3.5 h-3.5" />
                    <span>{upcomingAppointment.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icons.Clock className="w-3.5 h-3.5" />
                    <span>{upcomingAppointment.timeSlot}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-slate-600">
                    <Icons.MapPin className="w-3.5 h-3.5" />
                    <span>{upcomingAppointment.room}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                onClick={() => alert(`Directions for ${upcomingAppointment.room} sent to phone!`)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Directions / Room
              </button>
              <button
                onClick={() => onNavigateTab('records')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Departments Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              Explore Medical Departments
            </h2>
            <p className="text-xs text-slate-500">Find doctors by specialized clinical department.</p>
          </div>
          <button
            onClick={() => onNavigateTab('doctors')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
          >
            <span>View All Doctors</span>
            <Icons.ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {departments.slice(0, 6).map((dept) => {
            const IconComp = specialtyIcons[dept.id] || Icons.Activity;
            return (
              <div
                key={dept.id}
                onClick={() => onNavigateTab('doctors')}
                className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition-colors">
                  {dept.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{dept.doctorCount} Doctors</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Doctors Showcase */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              Top Rated Practitioners Today
            </h2>
            <p className="text-xs text-slate-500">Highest rated specialists with slots open today.</p>
          </div>
          <button
            onClick={() => onNavigateTab('doctors')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
          >
            <span>Browse All ({doctors.length})</span>
            <Icons.ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {doctors.slice(0, 3).map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{doctor.name}</h4>
                  <p className="text-xs font-semibold text-teal-700">{doctor.specialty}</p>
                  <p className="text-[11px] text-slate-500 truncate">{doctor.experience} exp</p>
                  <div className="flex items-center space-x-1 text-xs text-amber-600 mt-1 font-bold">
                    <Icons.Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{doctor.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({doctor.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Fee</span>
                  <span className="font-bold text-xs text-slate-900">₹{doctor.fee}</span>
                </div>
                <button
                  onClick={() => onSelectDoctorForBooking(doctor)}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
