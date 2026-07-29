import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/api';
import {
  IoPeopleOutline, IoPersonOutline, IoShieldCheckmarkOutline, IoTimeOutline,
  IoSearchOutline, IoFunnelOutline, IoAddCircleOutline, IoEllipsisVerticalOutline,
  IoRefreshOutline, IoCheckmarkCircleOutline
} from 'react-icons/io5';

export default function AdminUserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, admins: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 15;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        skip: (page - 1) * pageSize,
        limit: pageSize,
      };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.is_active = statusFilter === 'active';

      const res = await userService.getAll(params);
      const data = res.data;

      // Backend may return { users: [...], total: N } or just an array
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalCount(data.length);
      } else {
        setUsers(data.users || data.items || []);
        setTotalCount(data.total || data.count || (data.users || []).length);
      }
    } catch (err) {
      console.error('User fetch error:', err);
      setError('Could not load users. Ensure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Derive stats from current user list (approximate — backend may have more pages)
  useEffect(() => {
    if (users.length > 0) {
      setStats({
        total: totalCount || users.length,
        active: users.filter(u => u.is_active !== false).length,
        admins: users.filter(u => u.role === 'admin').length,
        pending: users.filter(u => u.is_active === false).length,
      });
    }
  }, [users, totalCount]);

  // Update user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.update(userId, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Role update failed:', err);
    }
  };

  // Helper: format role label
  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-50 text-purple-600 border-purple-100';
      default:      return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getStatusStyle = (isActive) => {
    if (isActive === false) return 'bg-slate-100 text-slate-500 border-slate-200';
    return 'bg-green-50 text-green-700 border-green-100';
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Top statistic cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><IoPeopleOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Users</span>
            <span className="block text-2xl font-extrabold text-slate-800">{stats.total.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-green-600">Registered accounts</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center shrink-0"><IoPersonOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Active Drivers</span>
            <span className="block text-2xl font-extrabold text-slate-800">{stats.active.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-green-600">Currently active</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><IoShieldCheckmarkOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Municipal Admins</span>
            <span className="block text-2xl font-extrabold text-slate-800">{stats.admins}</span>
            <span className="text-[9px] font-bold text-purple-600">Admin role</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><IoTimeOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Inactive Users</span>
            <span className="block text-2xl font-extrabold text-slate-800">{stats.pending}</span>
            <span className="text-[9px] font-bold text-red-500">Require attention</span>
          </div>
        </div>

      </div>

      {/* Filters row actions */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-56">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IoSearchOutline className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="">All User Roles</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={fetchUsers}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-400 focus:outline-none"
          >
            <IoRefreshOutline className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <button className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer">
          <IoAddCircleOutline className="w-4 h-4" />
          <span>Add New User</span>
        </button>

      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Loading users…</span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="p-4 pl-6 w-12"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4" /></th>
                <th className="p-4">User Details</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 pr-6 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400 font-semibold">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4" />
                    </td>
                    
                    {/* Details */}
                    <td className="p-4">
                      <div className="flex gap-3.5 items-center">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-extrabold text-sm shrink-0">
                          {(usr.display_name || usr.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-0.5 text-left leading-tight">
                          <span className="font-extrabold text-slate-800 text-xs block group-hover:text-blue-600 transition-colors">
                            {usr.display_name || '(no name)'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold block">{usr.email}</span>
                          <span className="text-[9px] text-slate-400 block font-bold">
                            {usr.firebase_uid?.substring(0, 12)}…
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${getRoleStyle(usr.role)}`}>
                        {usr.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getStatusStyle(usr.is_active)}`}>
                        {usr.is_active === false ? 'Inactive' : 'Active'}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="p-4 text-[10px] text-slate-500 font-semibold whitespace-nowrap">
                      {usr.created_at
                        ? new Date(usr.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'
                      }
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2.5">
                        <select
                          value={usr.role}
                          onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                          className="text-xs font-bold text-blue-600 border-0 bg-transparent focus:outline-none cursor-pointer hover:underline"
                        >
                          <option value="driver">Driver</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button className="text-slate-300 hover:text-slate-500 focus:outline-none">
                          <IoEllipsisVerticalOutline className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-4">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount.toLocaleString()} users
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-40 select-none"
            >&lt;</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                  p === page ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >{p}</button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 select-none"
            >&gt;</button>
          </div>
        </div>
      )}

    </div>
  );
}
