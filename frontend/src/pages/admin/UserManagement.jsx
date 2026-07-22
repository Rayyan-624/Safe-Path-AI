import React, { useState } from 'react';
import { mockUsers } from '../../data/mockData';
import {
  IoPeopleOutline, IoPersonOutline, IoShieldCheckmarkOutline, IoTimeOutline,
  IoSearchOutline, IoFunnelOutline, IoAddCircleOutline, IoEllipsisVerticalOutline
} from 'react-icons/io5';

export default function AdminUserManagement() {
  const [search, setSearch] = useState('');

  const users = [
    {
      name: "Ali Haider",
      email: "ali.haider@gmail.com",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100",
      level: "Level 7 Road Guardian",
      role: "Driver",
      roleColor: "bg-blue-50 text-blue-600 border-blue-100",
      status: "Active",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      reports: 15
    },
    {
      name: "Usman Khan",
      email: "usman.khan@yahoo.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      level: "Level 5 Road Guard",
      role: "Driver",
      roleColor: "bg-blue-50 text-blue-600 border-blue-100",
      status: "Active",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      reports: 8
    },
    {
      name: "Admin User",
      email: "admin@safepath.gov",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      level: "Super Admin",
      role: "Municipality",
      roleColor: "bg-purple-50 text-purple-600 border-purple-100",
      status: "Active",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      reports: 0
    },
    {
      name: "Sarah Ahmed",
      email: "sarah.ahmed@hotmail.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      level: "Pending Approval",
      role: "Driver",
      roleColor: "bg-blue-50 text-blue-600 border-blue-100",
      status: "Pending",
      statusColor: "bg-orange-50 text-orange-500 border-orange-100",
      reports: 0
    },
    {
      name: "Bilal Raza",
      email: "bilal.raza@outlook.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      level: "Inactive Driver",
      role: "Driver",
      roleColor: "bg-blue-50 text-blue-600 border-blue-100",
      status: "Inactive",
      statusColor: "bg-slate-100 text-slate-500 border-slate-200",
      reports: 2
    }
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Top statistic cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><IoPeopleOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Users</span>
            <span className="block text-2xl font-extrabold text-slate-800">12,845</span>
            <span className="text-[9px] font-bold text-green-600">↑ 15% vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center shrink-0"><IoPersonOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Active Drivers</span>
            <span className="block text-2xl font-extrabold text-slate-800">9,864</span>
            <span className="text-[9px] font-bold text-green-600">80% active rate</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-650 flex items-center justify-center shrink-0"><IoShieldCheckmarkOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Municipal Admins</span>
            <span className="block text-2xl font-extrabold text-slate-800">45</span>
            <span className="text-[9px] font-bold text-purple-600">12 Online</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><IoTimeOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pending Approvals</span>
            <span className="block text-2xl font-extrabold text-slate-800">12</span>
            <span className="text-[9px] font-bold text-red-500">4 Critical</span>
          </div>
        </div>

      </div>

      {/* Filters row actions */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-48">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IoSearchOutline className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          <select className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 font-semibold focus:outline-none cursor-pointer">
            <option>All User Roles</option>
            <option>Driver</option>
            <option>Municipality</option>
          </select>

          <select className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 font-semibold focus:outline-none cursor-pointer">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
        </div>

        <button
          className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
        >
          <IoAddCircleOutline className="w-4.5 h-4.5" />
          <span>Add New User</span>
        </button>

      </div>

      {/* Users Log Table view */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              <th className="p-4 pl-6 w-12"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4" /></th>
              <th className="p-4">User Details</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Reports</th>
              <th className="p-4 pr-6 w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {users.map((usr, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4" /></td>
                
                {/* Details */}
                <td className="p-4 flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img src={usr.avatar} alt={usr.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5 text-left leading-tight">
                    <span className="font-extrabold text-slate-800 text-xs block group-hover:text-blue-600 transition-colors">{usr.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">{usr.email}</span>
                    <span className="text-[9px] text-slate-400 block font-bold">{usr.level}</span>
                  </div>
                </td>

                {/* Role */}
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${usr.roleColor}`}>
                    {usr.role}
                  </span>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${usr.statusColor}`}>
                    {usr.status}
                  </span>
                </td>

                {/* Reports */}
                <td className="p-4 font-extrabold text-slate-800 text-xs">
                  {usr.reports > 0 ? `${usr.reports} reports` : '—'}
                </td>

                {/* Actions */}
                <td className="p-4 pr-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2.5">
                    <button className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
                    <button className="text-slate-355 hover:text-slate-500 focus:outline-none"><IoEllipsisVerticalOutline className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-4">
        <span>Showing 1 to 5 of 12,845 users</span>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-40 select-none">&lt;</button>
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">1</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">2</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">3</span>
          <span className="px-1">...</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">2,569</span>
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 select-none">&gt;</button>
        </div>
      </div>

    </div>
  );
}
