import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, Search, Filter, Clock, Activity } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const data = await api.getAuditLogs();
        setLogs(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    const matchSearch = search === '' ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      (l.target && l.target.toLowerCase().includes(search.toLowerCase()));

    const matchAction = actionFilter === 'ALL' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Security & Institutional Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Immutable audit trail of user logins, leave submissions, approvals, and system settings updates.</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit logs by user, action, or target ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
        >
          <option value="ALL">All Actions</option>
          <option value="USER_LOGIN">User Login</option>
          <option value="LEAVE_SUBMITTED">Leave Submitted</option>
          <option value="LEAVE_APPROVED">Leave Approved</option>
          <option value="LEAVE_REJECTED">Leave Rejected</option>
          <option value="USER_CREATED">User Created</option>
          <option value="SETTINGS_UPDATED">Settings Updated</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs font-mono">Loading security audit logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Target ID</th>
                  <th className="py-3 px-4">Activity Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">{log.userName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-800 text-slate-300">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{log.action}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{log.target || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-md">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
