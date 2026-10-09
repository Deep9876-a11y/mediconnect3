import React, { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons.jsx';
import { apiService } from '../../api/apiService.js';

export function ManageReceptionist({ doctor, showToast }) {
  const [loading, setLoading] = useState(false);
  const [receptionists, setReceptionists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    securityPin: ''
  });

  useEffect(() => {
    loadReceptionists();
  }, []);

  const loadReceptionists = async () => {
    try {
      const users = await apiService.getUsers();
      const mapped = users.filter(u => u.role === 'receptionist' && u.assignedDoctorId === doctor.id);
      setReceptionists(mapped);
    } catch (err) {
      console.warn("Could not load receptionists", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password || formData.securityPin.length !== 4) {
      showToast({ type: 'error', title: 'Invalid Form', message: 'Please fill all fields correctly.' });
      return;
    }

    setLoading(true);
    try {
      const newRecp = await apiService.registerUser({
        ...formData,
        role: 'receptionist',
        status: 'active',
        assignedDoctorId: doctor.id
      });

      setReceptionists([...receptionists, newRecp]);
      showToast({ type: 'success', title: 'Account Created', message: 'Receptionist account created successfully.' });
      setIsCreating(false);
      setFormData({ name: '', email: '', phone: '', password: '', securityPin: '' });
    } catch (err) {
      showToast({ type: 'error', title: 'Creation Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">Manage Receptionist</h2>
          <p className="text-sm text-slate-500">Create and manage your front-desk staff accounts.</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-sm font-bold rounded-xl flex items-center space-x-2"
          >
            <Icons.Plus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
        )}
      </div>

      {isCreating ? (
        <form onSubmit={handleCreate} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Create New Receptionist Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" placeholder="e.g. Anjali Sharma" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" placeholder="desk@clinic.com" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" placeholder="9876543210" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl" placeholder="Min 6 characters" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">4-Digit Security PIN</label>
              <input type="password" maxLength={4} value={formData.securityPin} onChange={e => setFormData({...formData, securityPin: e.target.value.replace(/\D/g, '')})} className="w-full px-3 py-2 text-sm border rounded-xl" placeholder="1234" required />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-sm font-bold">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      ) : null}

      <div className="space-y-3">
        {receptionists.length === 0 && !isCreating ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Icons.Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-600">No receptionists mapped yet.</p>
          </div>
        ) : (
          receptionists.map(r => (
            <div key={r.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-fuchsia-100 text-fuchsia-700 rounded-full flex items-center justify-center font-bold">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{r.name}</h4>
                  <p className="text-xs text-slate-500">{r.email} • {r.phone}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Active</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
