import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function PatientProfile({ patient, onUpdateProfile }) {
  const [formData, setFormData] = useState({ ...patient });
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={formData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}
            alt="Profile Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900">{formData.name}</h2>
              <span className="bg-teal-100 text-teal-800 text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                {formData.uhid}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Registered Patient • MediConnect Central Hospital
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors shadow-sm"
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs flex items-center space-x-2">
          <Icons.CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully to patient record!</span>
        </div>
      )}

      {/* Form / Details View */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
          Personal & Medical Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 mb-1 font-medium">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-medium">Age & Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                disabled={!isEditing}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <select
                disabled={!isEditing}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-medium">Blood Group</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-500 mb-1 font-medium">Phone Number</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-medium">Email Address</label>
            <input
              type="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="text-xs">
          <label className="block text-slate-500 mb-1 font-medium">Residential Address</label>
          <input
            type="text"
            disabled={!isEditing}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
          <div>
            <label className="block text-slate-500 mb-1 font-medium">Known Medical Allergies</label>
            <input
              type="text"
              disabled={!isEditing}
              value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="e.g. Penicillin, Sulfa"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-medium">Chronic Health Conditions</label>
            <input
              type="text"
              disabled={!isEditing}
              value={Array.isArray(formData.chronicConditions) ? formData.chronicConditions.join(', ') : formData.chronicConditions}
              onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full p-2.5 border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-700 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="e.g. Mild Hypertension"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        )}
      </form>

      {/* Security & Data Privacy Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Icons.ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Data Privacy & Security Controls (ABHA & DISHA)
              </h3>
              <p className="text-xs text-slate-500">
                Manage who can view your clinical diagnoses, prescriptions, and lab history.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full border border-emerald-300">
            🔒 SQLite Database Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Control 1: Admin Isolation */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Icons.Lock className="w-4 h-4 text-emerald-600" />
                <span>Hospital Admin Clinical Barrier</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                Active (Locked)
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Hospital Administration staff is restricted from viewing your clinical diagnosis, symptoms, prescriptions, and lab results. They can only see tokens and billing.
            </p>
          </div>

          {/* Control 2: Doctor Consent PIN */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex justify-between items-start">
              <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Icons.User className="w-4 h-4 text-sky-600" />
                <span>Doctor Consultation Consent Lock</span>
              </span>
              <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[10px]">
                PIN Required
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Doctors outside your direct consultation cannot view your past health records without entering your 4-digit Security Key.
            </p>
          </div>
        </div>

        {/* 4-Digit Security Key Management */}
        <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Personal Security Key
            </span>
            <p className="font-bold text-slate-900 text-xs mt-0.5">
              4-Digit Doctor Consent PIN: <span className="font-mono text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-300 ml-1 font-black tracking-widest">{formData.securityPin || '1234'}</span>
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Share this PIN with consulting doctors or when generating Pan-India medical links.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const newPin = prompt("Enter new 4-digit Security Key (PIN):", formData.securityPin || "1234");
              if (newPin && newPin.length === 4 && /^\d+$/.test(newPin)) {
                const updated = { ...formData, securityPin: newPin };
                setFormData(updated);
                onUpdateProfile(updated);
                alert("Security Key updated successfully in SQLite database!");
              } else if (newPin !== null) {
                alert("Please enter exactly 4 numeric digits.");
              }
            }}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex-shrink-0"
          >
            Change Security Key
          </button>
        </div>
      </div>
    </div>
  );
}
