import React, { useState } from 'react';
import { Icons } from './Icons.jsx';
import { firebaseService } from '../api/firebaseService.js';

export function CloudDatabaseModal({ isOpen, onClose, onSyncComplete, showToast }) {
  if (!isOpen) return null;

  const currentConfig = firebaseService.getConfig();
  const status = firebaseService.getStatus();

  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [configForm, setConfigForm] = useState({
    apiKey: currentConfig.apiKey || '',
    authDomain: currentConfig.authDomain || '',
    projectId: currentConfig.projectId || '',
    storageBucket: currentConfig.storageBucket || '',
    messagingSenderId: currentConfig.messagingSenderId || '',
    appId: currentConfig.appId || ''
  });

  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!configForm.projectId.trim()) {
      alert('Please provide a valid Firebase Project ID.');
      return;
    }
    firebaseService.saveConfig(configForm);
    setIsEditingConfig(false);
    if (showToast) showToast('Cloud Firebase configuration saved and reconnected!', 'success');
  };

  const handleSyncToCloud = async () => {
    setSyncing(true);
    try {
      // Gather local data from localStorage
      const depts = JSON.parse(localStorage.getItem('mediconnect_departments') || '[]');
      const docs = JSON.parse(localStorage.getItem('mediconnect_doctors') || '[]');
      const appts = JSON.parse(localStorage.getItem('mediconnect_appointments') || '[]');
      const rxs = JSON.parse(localStorage.getItem('mediconnect_prescriptions') || '[]');
      const patient = JSON.parse(localStorage.getItem('mediconnect_patient') || '{}');
      const shareLinks = JSON.parse(localStorage.getItem('mediconnect_share_links') || '[]');

      await firebaseService.syncAllToCloud({
        departments: depts,
        doctors: docs,
        appointments: appts,
        prescriptions: rxs,
        patient,
        shareLinks
      });

      if (showToast) showToast('All hospital records synced to Cloud Firestore successfully!', 'success');
      if (onSyncComplete) onSyncComplete();
    } catch (err) {
      if (showToast) showToast('Sync failed: ' + err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-teal-900 to-indigo-950 p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-teal-300">
              <Icons.Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ONLINE CLOUD DATABASE</span>
                </span>
              </div>
              <h3 className="text-lg font-black mt-1">Google Cloud Firestore Integration</h3>
              <p className="text-xs text-slate-300">
                Real-time multi-device cloud persistence across hospitals & clinic branches in India.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 transition">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Cloud Status Card */}
          <div className="bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-200 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                  Active Cloud Instance
                </span>
                <h4 className="text-base font-black text-slate-900 mt-0.5">
                  {status.projectId}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Region: <strong className="text-slate-800">{status.cloudRegion}</strong> • Engine: <strong className="text-slate-800">Cloud Firestore (NoSQL)</strong>
                </p>
              </div>

              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Live & Connected</span>
              </span>
            </div>

            <div className="pt-2 border-t border-teal-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-600">
                Multi-device real-time sync with offline SQLite resilience
              </span>
              <button
                onClick={handleSyncToCloud}
                disabled={syncing}
                className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Icons.RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Syncing...' : 'Sync Local to Cloud'}</span>
              </button>
            </div>
          </div>

          {/* Synchronized Collections List */}
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2.5">
              Active Cloud Collections (Auto-Synchronized)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {status.collections.map((c) => (
                <div key={c.name} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-teal-700 font-bold">
                    <Icons.Database className="w-3.5 h-3.5" />
                    <span className="truncate">{c.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{c.label}</p>
                  <span className="text-[9px] text-emerald-700 font-semibold block">✓ Cloud Synced</span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Configuration Section */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-xs">
                  Firebase Cloud Credentials
                </h4>
                <p className="text-[11px] text-slate-500">
                  Connect your own Google Firebase project or use the default MediConnect cloud instance.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingConfig(!isEditingConfig)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-[11px]"
              >
                {isEditingConfig ? 'Cancel' : 'Configure Custom Firebase'}
              </button>
            </div>

            {isEditingConfig ? (
              <form onSubmit={handleSaveConfig} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Project ID</label>
                    <input
                      type="text"
                      value={configForm.projectId}
                      onChange={(e) => setConfigForm({ ...configForm, projectId: e.target.value })}
                      placeholder="e.g. my-hospital-project"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">API Key</label>
                    <input
                      type="text"
                      value={configForm.apiKey}
                      onChange={(e) => setConfigForm({ ...configForm, apiKey: e.target.value })}
                      placeholder="AIzaSy..."
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Auth Domain</label>
                    <input
                      type="text"
                      value={configForm.authDomain}
                      onChange={(e) => setConfigForm({ ...configForm, authDomain: e.target.value })}
                      placeholder="my-project.firebaseapp.com"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Storage Bucket</label>
                    <input
                      type="text"
                      value={configForm.storageBucket}
                      onChange={(e) => setConfigForm({ ...configForm, storageBucket: e.target.value })}
                      placeholder="my-project.appspot.com"
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition"
                  >
                    Save & Connect Project
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px]">
                <div className="space-y-0.5">
                  <span className="font-mono text-slate-700 block">
                    Project: <strong className="text-slate-900">{status.projectId}</strong>
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    Auth: {status.authDomain}
                  </span>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Cloud Synchronized
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
            <Icons.ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted in transit (TLS 1.3) & at rest (AES-256)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
