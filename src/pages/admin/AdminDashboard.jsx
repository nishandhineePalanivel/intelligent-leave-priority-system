import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';
import { 
  Sliders, 
  Users, 
  ShieldCheck, 
  BarChart2, 
  UserPlus,
  Settings,
  ChevronRight,
  Eye,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import RequestDetailModal from '../../components/RequestDetailModal';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { filteredRequests, priorityStats, clearAllLeaves } = useLeave();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleConfirmClear = () => {
    clearAllLeaves();
    setShowClearModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Executive Admin Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl text-white">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Sliders className="w-3.5 h-3.5" />
            <span>Administrator Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            System Executive Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            Manage institutional users, configure priority algorithm weights, monitor audit logs, and oversee leave requests.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Manage Users</span>
          </Link>
          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Leave Queue</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">TOTAL APPLICATIONS</span>
          <p className="text-2xl font-black text-slate-900">{filteredRequests.length}</p>
          <p className="text-[10px] text-slate-500 font-mono">Cross-department</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span className="text-[10px] text-amber-600 font-mono uppercase font-bold">PENDING APPROVAL</span>
          <p className="text-2xl font-black text-amber-600">{priorityStats.TOTAL_PENDING}</p>
          <p className="text-[10px] text-slate-500 font-mono">Queue depth</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span className="text-[10px] text-emerald-600 font-mono uppercase font-bold">SANCTIONED LEAVES</span>
          <p className="text-2xl font-black text-emerald-600">{priorityStats.APPROVED_COUNT}</p>
          <p className="text-[10px] text-slate-500 font-mono">Approved requests</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span className="text-[10px] text-rose-600 font-mono uppercase font-bold">CRITICAL PRIORITY</span>
          <p className="text-2xl font-black text-rose-600">{priorityStats.CRITICAL}</p>
          <p className="text-[10px] text-slate-500 font-mono">Medical/Urgent</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <span className="text-[10px] text-blue-600 font-mono uppercase font-bold">SYSTEM USERS</span>
          <p className="text-2xl font-black text-blue-600">8</p>
          <p className="text-[10px] text-slate-500 font-mono">Students, Staff, VP, Admin</p>
        </div>
      </div>

      {/* Admin Action Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 shadow-sm transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">User Management</h3>
              <p className="text-xs text-slate-500 mt-0.5">Register students, manage staff, reset passwords.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" />
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 shadow-sm transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">Analytics & Reports</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time database charts & distributions.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition" />
        </Link>

        <Link
          to="/admin/audit-logs"
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 shadow-sm transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition">Security Audit Logs</h3>
              <p className="text-xs text-slate-500 mt-0.5">Inspect system activity logs & timestamps.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition" />
        </Link>
      </div>

      {/* Master Applications Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Master Leave Queue</h2>
            <p className="text-xs text-slate-500">Institutional overview of all student leave requests.</p>
          </div>
          <Link to="/admin/requests" className="text-xs font-bold text-blue-600 hover:text-blue-700">
            View All Requests →
          </Link>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs">
            No leave requests in the master queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Priority Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredRequests.slice(0, 6).map(req => (
                  <tr key={req.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{req.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{req.studentName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{req.department}</td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={req.calculatedPriority} />
                    </td>
                    <td className="py-3.5 px-4">
                      {req.status === 'APPROVED' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">APPROVED</span>}
                      {req.status === 'REJECTED' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">REJECTED</span>}
                      {(req.status === 'PENDING' || req.status.startsWith('PENDING')) && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">PENDING</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-700 text-xs font-bold transition border border-slate-200"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clear Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-slate-900">Clear Master Leave Queue?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to clear all submitted leave applications from the system?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Clear Master Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
