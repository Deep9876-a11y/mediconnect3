import React, { useState } from 'react';
import { Icons } from '../../components/Icons.jsx';

export function ReportsAnalytics({ stats }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const weeklyData = stats?.weeklyAppointments || [
    { day: "Mon", count: 82, revenue: 142000 },
    { day: "Tue", count: 94, revenue: 168500 },
    { day: "Wed", count: 88, revenue: 159000 },
    { day: "Thu", count: 76, revenue: 152400 },
    { day: "Fri", count: 104, revenue: 184000 },
    { day: "Sat", count: 112, revenue: 201000 },
    { day: "Sun", count: 68, revenue: 118000 }
  ];

  const maxCount = Math.max(...weeklyData.map((d) => d.count));

  const deptData = stats?.departmentBreakdown || [
    { name: "General Medicine", count: 320, percentage: 28, color: "#0d9488" },
    { name: "Cardiology", count: 245, percentage: 21, color: "#f43f5e" },
    { name: "Orthopedics", count: 195, percentage: 17, color: "#0284c7" },
    { name: "Pediatrics", count: 170, percentage: 15, color: "#f59e0b" },
    { name: "Dermatology", count: 130, percentage: 11, color: "#ec4899" },
    { name: "Neurology", count: 92, percentage: 8, color: "#8b5cf6" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
            Hospital Analytics & Operational Reports
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Clinical Operations & Patient Flow Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Real-time OPD throughput, weekly appointment demand curve, and department patient distribution.
          </p>
        </div>

        <button
          onClick={() => alert("Simulated Hospital Executive Summary PDF generated!")}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm flex-shrink-0"
        >
          <Icons.Download className="w-4 h-4 text-slate-600" />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {/* Grid of 2 major visual charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Weekly Appointments Trend (Custom responsive SVG & Bar Chart) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Weekly Appointment Volume</h3>
              <p className="text-xs text-slate-500">Total appointments booked across 7 days</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg">
              Avg: 89 / day
            </span>
          </div>

          {/* SVG Bar Chart with Hover Tooltip */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-3 px-2 border-b border-slate-200">
              {weeklyData.map((item) => {
                const heightPercent = (item.count / maxCount) * 100;
                const isHovered = hoveredDay === item.day;

                return (
                  <div
                    key={item.day}
                    onMouseEnter={() => setHoveredDay(item.day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  >
                    {/* Floating Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg font-bold shadow-xl whitespace-nowrap z-20 animate-fadeIn">
                        <span>{item.count} Appointments</span>
                        <span className="block text-teal-300 font-mono">₹{(item.revenue / 1000).toFixed(1)}k rev</span>
                      </div>
                    )}

                    {/* Bar */}
                    <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end overflow-hidden h-40">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isHovered
                            ? 'bg-teal-500 shadow-lg'
                            : 'bg-gradient-to-t from-sky-600 to-teal-500'
                        }`}
                      ></div>
                    </div>

                    <span className="text-xs font-bold text-slate-700 mt-2">{item.day}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-teal-500"></span>
              <span>In-Clinic OPD Consultations</span>
            </span>
            <span className="font-semibold text-slate-700">Peak Day: Saturday (112 patients)</span>
          </div>
        </div>

        {/* Chart 2: Department-Wise Patient Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Department Patient Distribution</h3>
              <p className="text-xs text-slate-500">Active OPD distribution by clinical specialty</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg">
              Total: 1,152 Consults
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {deptData.map((dept) => (
              <div key={dept.name} className="space-y-1 text-xs">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-800">{dept.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 font-mono">{dept.count} patients</span>
                    <span className="text-slate-900 font-bold">{dept.percentage}%</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    style={{ width: `${dept.percentage}%`, backgroundColor: dept.color }}
                    className="h-full rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Streams Comparison */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Hospital Revenue Streams (Today's Breakdown)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-teal-900">OPD Consultations</span>
              <span className="text-[10px] font-bold bg-teal-200/60 text-teal-900 px-2 py-0.5 rounded">62%</span>
            </div>
            <p className="text-xl font-black text-teal-950 mt-2">₹94,500</p>
            <p className="text-[11px] text-teal-700 mt-1">76 doctors consults billed</p>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-sky-900">Diagnostics & Home Labs</span>
              <span className="text-[10px] font-bold bg-sky-200/60 text-sky-900 px-2 py-0.5 rounded">24%</span>
            </div>
            <p className="text-xl font-black text-sky-950 mt-2">₹36,500</p>
            <p className="text-[11px] text-sky-700 mt-1">28 home collections & CBC panels</p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-indigo-900">Hospital Pharmacy</span>
              <span className="text-[10px] font-bold bg-indigo-200/60 text-indigo-900 px-2 py-0.5 rounded">14%</span>
            </div>
            <p className="text-xl font-black text-indigo-950 mt-2">₹21,400</p>
            <p className="text-[11px] text-indigo-700 mt-1">Digital prescriptions dispensed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
