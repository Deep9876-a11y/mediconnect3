import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function ManageDoctors({ doctors, departments, users = [], onAddDoctor, onVerifyDoctor, onUpdateDoctor, showToast }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const [newDoctor, setNewDoctor] = useState({
    name: '',
    title: 'Consultant Specialist',
    specialty: 'Cardiology',
    departmentId: 'cardiology',
    experience: '8+ years',
    qualification: 'MBBS, MD',
    hospital: 'MediConnect Central Hospital',
    location: 'New Delhi',
    fee: 800,
    avatar: 'https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=350',
    about: 'Experienced clinical practitioner dedicated to patient outcomes.'
  });

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === 'All' || doc.specialty === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const pendingDoctors = users.filter(u => u.role === 'doctor' && u.status === 'pending');

  const handleVerifyPendingDoctor = async (user) => {
    const deptObj = departments.find(d => d.name === user.dept) || departments[0];
    const newDoc = {
      name: `Dr. ${user.name}`,
      title: 'Consultant Specialist',
      specialty: user.dept || 'General Medicine',
      departmentId: deptObj ? deptObj.id : 'general',
      experience: '5+ years',
      qualification: 'MBBS, MD',
      hospital: 'MediConnect Central Hospital',
      location: 'New Delhi',
      fee: 800,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1594824813689-58d197a1d13f?auto=format&fit=crop&q=80&w=350',
      about: 'Newly registered practitioner.'
    };
    if (onVerifyDoctor) {
      await onVerifyDoctor(user.id, newDoc);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newDoctor.name) return;

    await onAddDoctor(newDoctor);
    showToast({
      type: 'success',
      title: 'Doctor Added',
      message: `${newDoctor.name} added to the hospital directory.`
    });

    setShowAddModal(false);
    setNewDoctor({
      name: '',
      title: 'Consultant Specialist',
      specialty: 'Cardiology',
      departmentId: 'cardiology',
      experience: '8+ years',
      qualification: 'MBBS, MD',
      hospital: 'MediConnect Central Hospital',
      location: 'New Delhi',
      fee: 800,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=350',
      about: 'Experienced clinical practitioner dedicated to patient outcomes.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
            Hospital Administration
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Manage Medical Doctors Roster</h2>
          <p className="text-xs text-slate-500">
            Total {doctors.length} verified doctors registered across 8 clinical departments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5 flex-shrink-0"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Pending Doctors Verification */}
      {pendingDoctors.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Icons.ShieldCheck className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-900 text-sm">Pending Doctor Verifications</h3>
          </div>
          <div className="space-y-3">
            {pendingDoctors.map(user => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-amber-100 shadow-sm gap-4">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Email: {user.email} | Phone: {user.phone} | Dept: {user.dept}
                  </p>
                </div>
                <button
                  onClick={() => handleVerifyPendingDoctor(user)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                >
                  Verify & Add to Directory
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors by name or specialty..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="All">All Departments</option>
            {(departments || []).map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Table / Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Doctor</th>
                <th className="py-3.5 px-4">Specialty & Dept</th>
                <th className="py-3.5 px-4">Experience & Degree</th>
                <th className="py-3.5 px-4">Fee</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">{doc.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                      {doc.specialty}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-slate-900">{doc.experience}</p>
                    <p className="text-[11px] text-slate-400">{doc.qualification}</p>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹{doc.fee}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1 font-bold text-amber-600">
                      <Icons.Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({doc.reviewsCount})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.availableToday ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${doc.availableToday ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      <span>{doc.availableToday ? 'On Duty' : 'On Leave'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        onUpdateDoctor(doc.id, { availableToday: !doc.availableToday });
                        showToast({
                          type: 'info',
                          title: 'Doctor Status Toggled',
                          message: `${doc.name} marked as ${!doc.availableToday ? 'On Duty' : 'On Leave'}.`
                        });
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg"
                    >
                      Toggle Shift
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-700 to-sky-800 p-5 text-white flex justify-between items-center">
              <h3 className="text-base font-bold">Add Doctor to MediConnect Roster</h3>
              <button onClick={() => setShowAddModal(false)} className="text-indigo-200 hover:text-white">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Doctor Name (with prefix) *</label>
                <input
                  type="text"
                  required
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  placeholder="e.g. Dr. Harish Chandra"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Department</label>
                  <select
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {(departments || []).map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={newDoctor.fee}
                    onChange={(e) => setNewDoctor({ ...newDoctor, fee: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Experience</label>
                  <input
                    type="text"
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                    placeholder="e.g. 12+ years"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={newDoctor.qualification}
                    onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                    placeholder="e.g. MBBS, MD, DM"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Photo URL</label>
                <input
                  type="text"
                  value={newDoctor.avatar}
                  onChange={(e) => setNewDoctor({ ...newDoctor, avatar: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors"
                >
                  Save to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
