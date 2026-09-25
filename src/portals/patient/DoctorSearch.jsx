import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function DoctorSearch({ doctors, departments, onSelectDoctorForBooking }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const doctorList = doctors || [];
  const specialties = ['All', ...new Set(doctorList.map((d) => d?.specialty).filter(Boolean))];

  const filteredDoctors = doctorList
    .filter((doc) => {
      if (!doc) return false;
      const matchesSearch =
        (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.specialty || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.hospital || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;

      const matchesAvailability = !onlyAvailableToday || doc.availableToday;

      return matchesSearch && matchesSpecialty && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'fee-low') return (a.fee || 0) - (b.fee || 0);
      if (sortBy === 'fee-high') return (b.fee || 0) - (a.fee || 0);
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-teal-400/20 text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-teal-400/30">
            Verified Doctors Directory
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1">
            Find & Book Top Medical Specialists
          </h2>
          <p className="text-xs text-sky-200 mt-1">
            Over 48+ certified doctors available for in-clinic OPD and instant tele-consultation.
          </p>

          {/* Search Input Box */}
          <div className="mt-4 flex bg-white rounded-xl shadow-xl p-1.5 border border-white/20">
            <div className="flex items-center pl-3 pr-2 text-slate-400">
              <Icons.Search className="w-5 h-5 text-teal-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, hospital branch (e.g. Cardiologist, Ananya, Saket)..."
              className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-2"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 text-slate-400 hover:text-slate-600"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <Icons.Stethoscope className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Specialty chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Sort & Availability options */}
        <div className="flex items-center space-x-3 text-xs flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <label className="flex items-center space-x-1.5 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={onlyAvailableToday}
              onChange={(e) => setOnlyAvailableToday(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span>Available Today</span>
          </label>

          <div className="flex items-center space-x-1 text-slate-500">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="rating">Top Rated (4.8+)</option>
              <option value="fee-low">Fee: Low to High</option>
              <option value="fee-high">Fee: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200">
            <Icons.Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No doctors match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing search filters or selecting "All" specialties.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
                setOnlyAvailableToday(false);
              }}
              className="mt-3 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Doctor Head Info */}
                <div className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
                    />
                    {doctor.availableToday && (
                      <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border-2 border-white shadow">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base leading-tight hover:text-teal-700 cursor-pointer">
                        {doctor.name}
                      </h3>
                      {doctor.isPractoVerified && (
                        <span className="inline-flex items-center space-x-0.5 text-teal-600 bg-teal-50 px-1.5 py-0.2 rounded text-[10px] font-bold">
                          <Icons.ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-teal-700 mt-0.5">
                      {doctor.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {doctor.qualification}
                    </p>

                    <div className="flex items-center space-x-3 text-xs text-slate-600 mt-2">
                      <span className="flex items-center space-x-1 font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Icons.Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{doctor.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({doctor.reviewsCount})</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>{doctor.experience} exp</span>
                    </div>
                  </div>
                </div>

                {/* Location & Hospital */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center space-x-1 truncate max-w-[70%]">
                    <Icons.MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{doctor.hospital}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                    <span className="font-bold text-slate-900 text-sm">₹{doctor.fee}</span>
                  </div>
                </div>

                {/* Next Slot Preview Pill */}
                <div className="mt-3 bg-slate-50 rounded-lg p-2 flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Icons.Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Next Slot:</span>
                    <span className="font-semibold text-teal-800">
                      {doctor.availableSlots?.[0] || '10:00 AM Today'}
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium">
                    {doctor.languages?.join(', ')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectDoctorForBooking(doctor)}
                  className="w-full py-2 px-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-1"
                >
                  <Icons.Calendar className="w-3.5 h-3.5" />
                  <span>Book Hospital Visit</span>
                </button>
                <button
                  onClick={() => onSelectDoctorForBooking(doctor)}
                  className="w-full py-2 px-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1"
                >
                  <Icons.Video className="w-3.5 h-3.5" />
                  <span>Video Consult</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
