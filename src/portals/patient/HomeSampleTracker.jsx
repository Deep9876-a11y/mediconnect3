import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function HomeSampleTracker({ orders, packages, onRequestSample, onAdvanceStatus, patient }) {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState(packages[0]?.id || 'pkg-3');
  const [address, setAddress] = useState(patient?.address || 'A-42, Green Park Extension, New Delhi');
  const [dateSlot, setDateSlot] = useState('Tomorrow 07:30 AM - 08:30 AM');
  const [phone, setPhone] = useState(patient?.phone || '+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default to the first order to display in tracker
  const [activeOrderId, setActiveOrderId] = useState(orders[0]?.id || null);
  const currentOrder = orders.find((o) => o.id === activeOrderId) || orders[0];

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const pkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
    const orderData = {
      packageId: pkg.id,
      packageName: pkg.name,
      patientName: patient?.name || 'Aarav Sharma',
      patientPhone: phone,
      address,
      preferredDate: 'Tomorrow',
      preferredSlot: dateSlot,
      amount: pkg.price
    };

    const newOrd = await onRequestSample(orderData);
    setIsSubmitting(false);
    setShowOrderForm(false);
    setActiveOrderId(newOrd.id);
  };

  const stepsMeta = [
    { key: 'requested', label: 'Order Requested', icon: Icons.Calendar },
    { key: 'assigned', label: 'Phlebotomist Assigned', icon: Icons.User },
    { key: 'collected', label: 'Sample Collected', icon: Icons.FlaskConical },
    { key: 'processing', label: 'Lab Processing', icon: Icons.Activity },
    { key: 'ready', label: 'Report Ready', icon: Icons.FileText }
  ];

  const getStepIndex = (status) => {
    const keys = ['requested', 'assigned', 'collected', 'processing', 'ready'];
    return keys.indexOf(status);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-white/20 text-teal-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            NABL Certified Pathology at Doorstep
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1">
            Home Sample Collection & Lab Tests
          </h2>
          <p className="text-xs text-teal-100 mt-1 max-w-xl">
            Certified vaccinated phlebotomists collect blood & urine samples in temperature-controlled barcoded vacutainers. Reports delivered directly to your app.
          </p>
        </div>

        <button
          onClick={() => setShowOrderForm(!showOrderForm)}
          className="px-5 py-2.5 bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5 flex-shrink-0"
        >
          <Icons.Plus className="w-4 h-4 text-teal-700" />
          <span>{showOrderForm ? 'Close Booking Form' : 'Book Home Collection'}</span>
        </button>
      </div>

      {/* Booking Form Dropdown/Modal */}
      {showOrderForm && (
        <div className="bg-white rounded-2xl p-6 border-2 border-teal-500/40 shadow-xl animate-fadeIn">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Request Home Sample Collection</h3>
              <p className="text-xs text-slate-500">Select test package and confirm doorstep location.</p>
            </div>
            <button onClick={() => setShowOrderForm(false)} className="text-slate-400 hover:text-slate-600">
              <Icons.X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateOrder} className="space-y-4">
            {/* Package selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">Select Diagnostic Package</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all ${
                      selectedPkgId === pkg.id
                        ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-900">{pkg.name}</span>
                      <span className="text-xs font-black text-teal-700">₹{pkg.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{pkg.description}</p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-2 font-medium">
                      <span>{pkg.testsCount}</span>
                      <span>•</span>
                      <span>{pkg.fasting}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Slot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Doorstep Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="Flat, building, locality, pincode..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Preferred Time Slot</label>
                <select
                  value={dateSlot}
                  onChange={(e) => setDateSlot(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Tomorrow 06:30 AM - 07:30 AM (Fasting)">Tomorrow 06:30 AM - 07:30 AM (Fasting)</option>
                  <option value="Tomorrow 07:30 AM - 08:30 AM (Fasting)">Tomorrow 07:30 AM - 08:30 AM (Fasting)</option>
                  <option value="Tomorrow 09:00 AM - 10:00 AM">Tomorrow 09:00 AM - 10:00 AM</option>
                  <option value="Tomorrow 04:00 PM - 05:00 PM">Tomorrow 04:00 PM - 05:00 PM</option>
                </select>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-amber-900">
              <Icons.AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>For fasting blood sugar and lipid panels, minimum 10-12 hours fasting is required before sample collection.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
              >
                <span>{isSubmitting ? 'Booking...' : 'Confirm Home Collection Request'}</span>
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Real-Time Status Tracker UI */}
      {currentOrder && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Live Sample Tracker
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">Order ID: {currentOrder.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{currentOrder.packageName}</h3>
              <p className="text-xs text-slate-500">
                Scheduled for: <span className="font-semibold text-slate-700">{currentOrder.preferredDate}, {currentOrder.preferredSlot}</span>
              </p>
            </div>

            {/* Advance Stage Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const seq = ['requested', 'assigned', 'collected', 'processing', 'ready'];
                  const curIdx = seq.indexOf(currentOrder.status);
                  const nextStatus = seq[(curIdx + 1) % seq.length];
                  onAdvanceStatus(currentOrder.id, nextStatus);
                }}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1"
                title="Advance to next stage"
              >
                <Icons.Activity className="w-3.5 h-3.5 text-sky-600" />
                <span>Simulate Next Stage</span>
              </button>
            </div>
          </div>

          {/* Visual Step Tracker Bar */}
          <div className="relative py-4">
            <div className="hidden sm:block absolute top-1/2 left-6 right-6 h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
              {stepsMeta.map((s, idx) => {
                const IconComp = s.icon;
                const currentIdx = getStepIndex(currentOrder.status);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={s.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-md scale-110'
                          : isPassed
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <p className={`text-xs font-bold mt-2 ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {s.label}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {isPassed ? (isCurrent ? 'In Progress' : 'Completed') : 'Upcoming'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phlebotomist Details Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-base shadow-sm">
                RK
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  {currentOrder.phlebotomist.badge}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  {currentOrder.phlebotomist.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {currentOrder.phlebotomist.rating} • {currentOrder.phlebotomist.vehicle}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={`tel:${currentOrder.phlebotomist.phone}`}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <Icons.Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>Call Phlebotomist</span>
              </a>
              {currentOrder.status === 'ready' && (
                <button
                  onClick={() => alert("Simulated PDF Download: Report for " + currentOrder.packageName)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <Icons.Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Catalog Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3">Popular Preventive Health Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  {pkg.discount}
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-2 leading-snug">{pkg.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{pkg.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">₹{pkg.price}</span>
                  <span className="text-[10px] text-slate-400 line-through ml-1.5">₹{pkg.originalPrice}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedPkgId(pkg.id);
                    setShowOrderForm(true);
                  }}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
