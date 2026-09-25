import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function ManageDepartments({ departments, onAddDepartment, showToast }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDept, setNewDept] = useState({
    name: '',
    description: '',
    leadDoctor: '',
    room: 'Block A - OPD 204',
    doctorCount: 4
  });

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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newDept.name) return;

    await onAddDepartment(newDept);
    showToast({
      type: 'success',
      title: 'Department Added',
      message: `${newDept.name} department created successfully.`
    });
    setShowAddModal(false);
    setNewDept({
      name: '',
      description: '',
      leadDoctor: '',
      room: 'Block A - OPD 204',
      doctorCount: 4
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
            Hospital Infrastructure
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Hospital Clinical Departments</h2>
          <p className="text-xs text-slate-500">
            {departments.length} active departments covering specialized OPD wings, ICU, diagnostics and surgical theatres.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 flex-shrink-0"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(departments || []).length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <Icons.Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No hospital departments created yet</p>
            <p className="text-xs text-slate-500 mt-1">Click "Add Department" to configure the first medical wing</p>
          </div>
        ) : (
          (departments || []).map((dept) => {
          const IconComp = specialtyIcons[dept.id] || Icons.Building;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                    Active Wing
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dept.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Lead Consultant:</span>
                    <span className="font-bold text-slate-900">{dept.leadDoctor}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>OPD Location:</span>
                    <span className="font-mono text-slate-700 text-[11px]">{dept.room}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {dept.doctorCount} Doctors on Duty
                </span>
                <button
                  onClick={() => alert(`Department details for ${dept.name}: OPD timings 08:30 AM - 08:00 PM.`)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Manage Wing
                </button>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-sky-800 p-5 text-white flex justify-between items-center">
              <h3 className="text-base font-bold">Add Clinical Department</h3>
              <button onClick={() => setShowAddModal(false)} className="text-teal-200 hover:text-white">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  placeholder="e.g. Ophthalmology & Eye Care"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Description / Services</label>
                <textarea
                  rows="2"
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Clinical scope, diagnostic procedures..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Head of Dept (HOD)</label>
                  <input
                    type="text"
                    value={newDept.leadDoctor}
                    onChange={(e) => setNewDept({ ...newDept, leadDoctor: e.target.value })}
                    placeholder="e.g. Dr. K. Raman"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Room / OPD Wing</label>
                  <input
                    type="text"
                    value={newDept.room}
                    onChange={(e) => setNewDept({ ...newDept, room: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm transition-colors"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
