import React from 'react';
import MapPlaceholder from '../../components/MapPlaceholder';
import { mockHazards } from '../../data/mockData';
import {
  IoPulseOutline, IoTrendingUpOutline, IoTimeOutline, IoCheckmarkCircleOutline,
  IoAlertCircleOutline, IoCalendarOutline, IoChevronForwardOutline, IoShieldCheckmarkOutline
} from 'react-icons/io5';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function AdminRoadPrediction() {
  
  const predictions = [
    { id: "PRD-01", type: "Pothole Collapse Risk", loc: "Shahrah-e-Faisal, Karachi", timeline: "15 Days", prob: "85%", risk: "High Risk", riskColor: "bg-red-50 text-red-600 border-red-100" },
    { id: "PRD-02", type: "Longitudinal Cracking", loc: "Korangi Road, Karachi", timeline: "30 Days", prob: "72%", risk: "Medium Risk", riskColor: "bg-orange-50 text-orange-500 border-orange-100" },
    { id: "PRD-03", type: "Waterlogging Hazard", loc: "University Road Underpass", timeline: "5 Days", prob: "90%", risk: "High Risk", riskColor: "bg-red-50 text-red-600 border-red-100" },
    { id: "PRD-04", type: "Pavement Deterioration", loc: "Model Town Circular Road", timeline: "60 Days", prob: "65%", risk: "Low Risk", riskColor: "bg-green-50 text-green-700 border-green-100" }
  ];

  const deteriorationTrend = [
    { week: 'Wk 1', rate: 10 },
    { week: 'Wk 2', rate: 12 },
    { week: 'Wk 3', rate: 14 },
    { week: 'Wk 4', rate: 13 },
    { week: 'Wk 5', rate: 15 },
    { week: 'Wk 6', rate: 14 }
  ];

  return (
    <div className="space-y-6 text-left font-sans text-slate-800">
      
      {/* Top statistic cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0"><IoPulseOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Avg Road Deterioration</span>
            <span className="block text-2xl font-extrabold text-slate-800">14%</span>
            <span className="text-[9px] font-bold text-red-500">↑ 1.2% this year</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0"><IoAlertCircleOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Critical Hazards Predicted</span>
            <span className="block text-2xl font-extrabold text-slate-800">48</span>
            <span className="text-[9px] font-bold text-red-500">15 days timeline</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center shrink-0"><IoShieldCheckmarkOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pre-emptive Maintenance</span>
            <span className="block text-2xl font-extrabold text-slate-800">12 Jobs</span>
            <span className="text-[9px] font-bold text-green-600">Active schedule</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><IoCheckmarkCircleOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">AI Engine Status</span>
            <span className="block text-2xl font-extrabold text-slate-800">93.6%</span>
            <span className="text-[9px] font-bold text-green-600">Accuracy active</span>
          </div>
        </div>

      </div>

      {/* Row 1: Deterioration map and Prediction list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Deterioration Heatmap Map (Col 1-2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[380px]">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Deterioration Forecasting Map</span>
          <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-150 relative">
            <MapPlaceholder hazards={mockHazards.slice(0, 3)} mode="admin" />
          </div>
        </div>

        {/* Prediction log checklist (Col 3) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[380px]">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Predicted Hazards Risk</span>
          
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto pr-1 text-xs">
            {predictions.map((prd, i) => (
              <div key={i} className="flex gap-3 py-3 first:pt-1 last:pb-0 text-left items-start">
                <IoAlertCircleOutline className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div className="leading-tight flex-1">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-extrabold text-slate-850 block">{prd.type}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{prd.id}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-0.5">📍 {prd.loc}</span>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[10px] text-slate-500 font-bold">Timeline: {prd.timeline}</span>
                    <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded border uppercase tracking-wider ${prd.riskColor}`}>{prd.risk} ({prd.prob})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Deterioration trend chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Deterioration trend */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-72">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Weekly Road Deterioration Rate</span>
          
          <div className="w-full h-44 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deteriorationTrend} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="rate" name="Deterioration Rate (%)" stroke="#6366f1" fill="#6366f1" fillOpacity={0.05} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pre-emptive Maintenance Costs list */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-72">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Pre-emptive Maintenance Savings</span>
          
          <div className="flex-1 flex flex-col gap-4 justify-center text-xs font-semibold text-slate-500">
            <div className="flex justify-between items-center">
              <span>Estimated Cost (After collapse)</span>
              <span className="text-red-500 font-extrabold text-sm">$45,800</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pre-emptive Repair Cost (Before collapse)</span>
              <span className="text-green-600 font-extrabold text-sm">$12,400</span>
            </div>
            <div className="border-t border-slate-50 pt-3 flex justify-between items-center font-bold text-slate-800">
              <span className="text-xs">Net Projected Savings</span>
              <span className="text-green-600 text-base font-extrabold">$33,400 (73%)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
