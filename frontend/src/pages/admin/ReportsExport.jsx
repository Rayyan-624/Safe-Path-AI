import React, { useState } from 'react';
import {
  IoDocumentTextOutline, IoCalendarOutline, IoChevronDownOutline,
  IoCloudDownloadOutline, IoMailOutline, IoTimeOutline, IoCheckmarkCircleOutline
} from 'react-icons/io5';

export default function AdminReportsExport() {
  const [reportType, setReportType] = useState('Hazard Density Report');
  const [format, setFormat] = useState('PDF');
  
  const [dataOptions, setDataOptions] = useState({
    coords: true, photos: true, history: true, diagnostics: false, costs: true
  });

  const [exportOptions, setExportOptions] = useState({
    charts: true, signature: false, watermark: false, maps: true
  });

  return (
    <div className="space-y-6 text-left font-sans text-slate-800">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">Reports & Export</h2>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Generate custom reports and export data in various formats</p>
        </div>
      </div>

      {/* Main split content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Generator (Col 1-2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-6">
          <span className="text-xs font-extrabold text-slate-850 border-b border-slate-50 pb-2 block">Generate Custom Report</span>
          
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Template Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 font-bold focus:outline-none cursor-pointer"
                >
                  <option>Hazard Density Report</option>
                  <option>Road Quality Index</option>
                  <option>Maintenance Cost</option>
                  <option>User Contributions</option>
                  <option>AI System Performance</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date Range</label>
                <div className="relative">
                  <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-750 font-bold focus:outline-none cursor-pointer">
                    <option>Last 30 Days (May 2024)</option>
                    <option>Last 7 Days</option>
                    <option>Custom Date Range</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File Format Selection */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">File Format</label>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { id: 'PDF', label: 'PDF Document', desc: 'Best for printing', icon: '📄' },
                  { id: 'Excel', label: 'Excel (XLSX)', desc: 'Best for data analysis', icon: '📊' },
                  { id: 'CSV', label: 'CSV File', desc: 'Raw spreadsheet data', icon: '📑' },
                  { id: 'JSON', label: 'JSON Format', desc: 'Best for developers', icon: '💻' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormat(item.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all focus:outline-none select-none cursor-pointer ${
                      format === item.id
                        ? 'border-blue-600 bg-blue-50/20 text-blue-600 font-bold ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <span className="text-lg mb-1">{item.icon}</span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider">{item.id}</span>
                    <span className="text-[8px] text-slate-400 font-semibold mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Data options checklist */}
            <div className="space-y-2.5 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Include Data</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'coords', label: 'Hazard Coordinates' },
                  { key: 'photos', label: 'Attached Photos' },
                  { key: 'history', label: 'User Verification History' },
                  { key: 'diagnostics', label: 'AI Diagnostics logs' },
                  { key: 'costs', label: 'Maintenance costs' }
                ].map((option) => (
                  <label key={option.key} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold text-slate-650 cursor-pointer select-none leading-none">
                    <span>{option.label}</span>
                    <input
                      type="checkbox"
                      checked={dataOptions[option.key]}
                      onChange={() => setDataOptions(o => ({ ...o, [option.key]: !o[option.key] }))}
                      className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Export Layout Options */}
            <div className="space-y-2.5 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Export Options</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'charts', label: 'Include Charts/Graphs' },
                  { key: 'signature', label: 'Signature page' },
                  { key: 'watermark', label: 'Watermark' },
                  { key: 'maps', label: 'High-res maps' }
                ].map((option) => (
                  <label key={option.key} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold text-slate-650 cursor-pointer select-none leading-none">
                    <span>{option.label}</span>
                    <input
                      type="checkbox"
                      checked={exportOptions[option.key]}
                      onChange={() => setExportOptions(o => ({ ...o, [option.key]: !o[option.key] }))}
                      className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 border-t border-slate-150 pt-4 justify-end text-xs font-bold">
              <button className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl focus:outline-none cursor-pointer">
                Download Raw Data
              </button>
              <button className="px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer">
                <IoCloudDownloadOutline className="w-4.5 h-4.5" />
                <span>Generate Report</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Logs & Schedule (Col 3) */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* Recent Exports */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
            <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Recent Exports</span>
            
            <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
              {[
                { name: "hazard_density_report_may2024.pdf", type: "PDF", size: "2.4 MB", time: "Just now" },
                { name: "road_quality_index_karachi.xlsx", type: "Excel", size: "12.8 MB", time: "2 hours ago" },
                { name: "maintenance_costs_q2.csv", type: "CSV", size: "512 KB", time: "1 day ago" },
                { name: "ai_accuracy_diagnostics.json", type: "JSON", size: "8.4 MB", time: "3 days ago" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 text-xs font-semibold text-slate-500">
                  <div className="leading-tight text-left">
                    <span className="font-bold text-slate-800 block truncate max-w-[150px]">{item.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{item.type} • {item.size} • {item.time}</span>
                  </div>
                  <button className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg focus:outline-none">
                    <IoCloudDownloadOutline className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Automatic Scheduling */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
            <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Automatic Reports Scheduling</span>
            
            <div className="space-y-3">
              {[
                { name: "Monthly Hazard Density Report", sub: "Send to email on 1st of month", detail: "PDF format • Active" },
                { name: "Weekly Maintenance status", sub: "Send on Monday 9 AM", detail: "Excel format • Active" },
                { name: "Daily AI Diagnostics logs", sub: "Send at midnight", detail: "CSV format • Inactive" }
              ].map((sch, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 rounded-xl border border-slate-100 text-xs font-semibold text-slate-500">
                  <div className="leading-tight text-left">
                    <span className="font-bold text-slate-800 block">{sch.name}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{sch.sub}</span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{sch.detail}</span>
                  </div>
                  <button className={`w-10 h-5.5 rounded-full transition-colors relative focus:outline-none flex-shrink-0 ${sch.detail.includes('Active') ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${sch.detail.includes('Active') ? 'translate-x-4.5' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
