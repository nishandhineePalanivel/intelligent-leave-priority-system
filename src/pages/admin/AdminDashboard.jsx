import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';
import { 
  Sliders, 
  Users, 
  FileText, 
  ShieldCheck, 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  AlertOctagon,
  UserPlus,
  Settings,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import RequestDetailModal from '../../components/RequestDetailModal';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { filteredRequests, priorityStats, auditLogs } = useLeave();
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div className="space-y-6">
      {/* Executive Admin Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
            <Sliders className="w-3.5 h-3.5 text-rose-400" />
            <span>Administrator Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            System Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Manage institutional users, configure priority algorithm weights, monitor audit logs, and oversee cross-departmental leave requests.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/settings"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Config Weights</span>
          </Link>
        </div>
      </div>

      {/* Institutional Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase">TOTAL APPLICATIONS</span>
          <p className="text-2xl font-black text-white">{filteredRequests.length}</p>
          <p className="text-[10px] text-slate-500 font-mono">Cross-department</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-amber-400 font-mono uppercase">PENDING APPROVAL</span>
          <p className="text-2xl font-black text-amber-400">{priorityStats.TOTAL_PENDING}</p>
          <p className="text-[10px] text-slate-500 font-mono">Queue depth</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-emerald-400 font-mono uppercase">SANCTIONED LEAVES</span>
          <p className="text-2xl font-black text-emerald-400">{priorityStats.APPROVED_COUNT}</p>
          <p className="text-[10px] text-slate-500 font-mono">Approved requests</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-rose-400 font-mono uppercase">CRITICAL PRIORITY</span>
          <p className="text-2xl font-black text-rose-400">{priorityStats.CRITICAL}</p>
          <p className="text-[10px] text-slate-500 font-mono">Medical/Urgent</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] text-purple-400 font-mono uppercase">SYSTEM USERS</span>
          <p className="text-2xl font-black text-purple-400">6</p>
          <p className="text-[10px] text-slate-500 font-mono">Students, Staff, Admin</p>
        </div>
      </div>

      {/* Admin Quick Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-rose-500/50 transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-105 transition">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition">User Management</h3>
              <p className="text-xs text-slate-400 mt-0.5">Create accounts, disable users, reset passwords.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">Analytics & Reports</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time database charts & category distributions.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
        </Link>

        <Link
          to="/admin/audit-logs"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">Security Audit Logs</h3>
              <p className="text-xs text-slate-400 mt-0.5">Inspect system activity logs & timestamps.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
        </Link>
      </div>

      {/* Master Leave Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Master Leave Queue</h2>
            <p className="text-xs text-slate-400">Institutional overview of all student leave requests.</p>
          </div>
          <Link to="/admin/requests" className="text-xs font-bold text-rose-400 hover:text-rose-300">
            View All Requests →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Priority Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredRequests.slice(0, 6).map(req => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">{req.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{req.studentName}</td>
                  <td className="py-3.5 px-4 text-slate-300">{req.department}</td>
                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={req.calculatedPriority} />
                  </td>
                  <td className="py-3.5 px-4">
                    {req.status === 'APPROVED' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">APPROVED</span>}
                    {req.status === 'REJECTED' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">REJECTED</span>}
                    {(req.status === 'PENDING' || req.status.startsWith('PENDING')) && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">PENDING</span>}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
