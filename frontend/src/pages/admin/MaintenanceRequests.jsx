import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoBuildOutline, IoTimeOutline, IoCheckmarkCircleOutline,
  IoLocationOutline, IoPersonOutline, IoAddCircleOutline,
  IoArrowBackOutline, IoAlertCircleOutline
} from 'react-icons/io5';

export default function AdminMaintenanceRequests() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    { id: "WO-9021", type: "Pothole Filling", road: "Shahrah-e-Faisal, Karachi", severity: "Critical", team: "KMC Central Zone", status: "Pending", date: "2026-07-25" },
    { id: "WO-9022", type: "Crack Sealing", road: "Korangi Industrial Area Road", severity: "Moderate", team: "East Roads Division", status: "In Progress", date: "2026-07-24" },
    { id: "WO-9023", type: "Manhole Cover Replacement", road: "Clifton Block 5", severity: "Critical", team: "Sewerage Repair Board", status: "Pending", date: "2026-07-26" },
    { id: "WO-9024", type: "Resurfacing Bumps", road: "University Road, Near Civic Center", severity: "Moderate", team: "KMC Highways", status: "Completed", date: "2026-07-22" },
    { id: "WO-9025", type: "Flooding Drainage Clearing", road: "National Stadium Road", severity: "Critical", team: "Water Board Team A", status: "In Progress", date: "2026-07-24" }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState('Pothole Filling');
  const [newRoad, setNewRoad] = useState('');
  const [newSeverity, setNewSeverity] = useState('Critical');
  const [newTeam, setNewTeam] = useState('KMC Central Zone');

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      type: newType,
      road: newRoad || "General Main Boulevard",
      severity: newSeverity,
      team: newTeam,
      status: "Pending",
      date: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [newTask, ...prev]);
    setShowAddModal(false);
    setNewRoad('');
  };

  const columns = ["Pending", "In Progress", "Completed"];

  return (
    <div className="space-y-6 text-left font-sans relative min-h-[80vh]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl focus:outline-none"
          >
            <IoArrowBackOutline className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-extrabold text-slate-800">Maintenance & Work Orders</h2>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Track repairs and dispatch road maintenance teams</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
        >
          <IoAddCircleOutline className="w-4.5 h-4.5" />
          <span>New Work Order</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((colName) => {
          const colTasks = tasks.filter(t => t.status === colName);
          return (
            <div key={colName} className="bg-slate-50/50 border border-slate-100/80 rounded-3xl p-5 min-h-[60vh] flex flex-col gap-4">
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  {colName === 'Pending' && <IoTimeOutline className="w-4.5 h-4.5 text-orange-500" />}
                  {colName === 'In Progress' && <IoBuildOutline className="w-4.5 h-4.5 text-blue-500" />}
                  {colName === 'Completed' && <IoCheckmarkCircleOutline className="w-4.5 h-4.5 text-green-500" />}
                  <span>{colName}</span>
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-extrabold rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[70vh]">
                {colTasks.length === 0 ? (
                  <div className="text-slate-400 text-xs font-semibold py-8 text-center border border-dashed border-slate-200 rounded-2xl bg-white/50">
                    No tickets in this section
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div key={task.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                      
                      {/* Ticket header */}
                      <div className="flex justify-between items-start">
                        <div className="leading-tight">
                          <span className="text-xs font-extrabold text-slate-850 block">{task.type}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{task.id}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide border ${
                          task.severity === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-500 border-orange-100'
                        }`}>
                          {task.severity}
                        </span>
                      </div>

                      {/* Info lines */}
                      <div className="space-y-1.5 text-[10px] font-bold text-slate-500 leading-tight">
                        <div className="flex items-center gap-1.5">
                          <IoLocationOutline className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-slate-600 truncate">{task.road}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <IoPersonOutline className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-slate-600">{task.team}</span>
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="border-t border-slate-50 pt-3 flex justify-between items-center mt-1">
                        <span className="text-[9px] text-slate-400 font-bold">Scheduled: {task.date}</span>
                        
                        {/* Selector to change status */}
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className="px-2 py-1 border border-slate-200 rounded-lg text-[9px] bg-slate-50 text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-50 pb-2">New Work Order</h3>
            
            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Repair Task Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                >
                  <option value="Pothole Filling">Pothole Filling</option>
                  <option value="Crack Sealing">Crack Sealing</option>
                  <option value="Manhole Cover Replacement">Manhole Cover Replacement</option>
                  <option value="Flooding Drainage Clearing">Flooding Drainage Clearing</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Road Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shahrah-e-Faisal, Karachi"
                  value={newRoad}
                  onChange={(e) => setNewRoad(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Priority Severity</label>
                <div className="flex gap-2">
                  {["Moderate", "Critical"].map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setNewSeverity(l)}
                      className={`flex-1 py-2 border rounded-xl font-bold uppercase tracking-wider ${
                        newSeverity === l ? 'border-blue-600 bg-blue-50/20 text-blue-600' : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500">Assigned Team</label>
                <select
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none bg-slate-50"
                >
                  <option value="KMC Central Zone">KMC Central Zone</option>
                  <option value="East Roads Division">East Roads Division</option>
                  <option value="Sewerage Repair Board">Sewerage Repair Board</option>
                  <option value="Water Board Team A">Water Board Team A</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
