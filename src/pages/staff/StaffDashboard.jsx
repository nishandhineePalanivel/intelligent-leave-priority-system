import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';
import { 
  UserCheck, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  ListFilter, 
  Eye,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import RequestDetailModal from '../../components/RequestDetailModal';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { filteredRequests, updateRequestStatus, clearAllLeaves } = useLeave();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionComment, setActionComment] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);

  const pendingRequests = filteredRequests.filter(r => r.status === 'PENDING' || r.status.startsWith('PENDING'));
  const criticalCount = pendingRequests.filter(r => r.calculatedPriority.levelKey === 'CRITICAL').length;
  const highCount = pendingRequests.filter(r => r.calculatedPriority.levelKey === 'HIGH').length;

  const handleApprove = (id) => {
    updateRequestStatus(id, 'APPROVED', user?.name || 'Staff Reviewer', actionComment || 'Approved after review.');
    setSelectedRequest(null);
    setActionComment('');
  };

  const handleReject = (id) => {
    updateRequestStatus(id, 'REJECTED', user?.name || 'Staff Reviewer', actionComment || 'Declined after review.');
    setSelectedRequest(null);
    setActionComment('');
  };

  const handleConfirmClear = () => {
    clearAllLeaves();
    setShowClearModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Staff Hero Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg text-white">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty & Department Review Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {user?.name || 'Faculty Member'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            Role: <strong className="text-white">{user?.role === 'VICE_PRINCIPAL' ? 'Vice Principal & HOD' : 'Class Advisor'}</strong> ({user?.department || 'CSE'})
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-5 py-3 bg-white text-blue-950 rounded-2xl text-center shadow-md">
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">PENDING QUEUE</span>
            <p className="text-2xl font-black text-blue-700">{pendingRequests.length}</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-rose-600 font-mono uppercase font-bold">CRITICAL PRIORITY</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{criticalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-amber-600 font-mono uppercase font-bold">HIGH PRIORITY</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{highCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-emerald-600 font-mono uppercase font-bold">DECISION RATE</span>
            <p className="text-2xl font-black text-slate-900 mt-1">96%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Prioritized Review Queue Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-blue-600" />
              <span>Prioritized Leave Review Queue</span>
            </h2>
            <p className="text-xs text-slate-500">Applications automatically ranked by 5-factor priority scoring engine.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear Leave Queue</span>
          </button>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs">
            No pending leave requests requiring review in the queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Priority Score</th>
                  <th className="py-3 px-4">Student Name & ID</th>
                  <th className="py-3 px-4">Leave Category</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Attendance Impact</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {pendingRequests.map(req => (
                  <tr key={req.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={req.calculatedPriority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={req.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                          alt={req.studentName}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{req.studentName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{req.studentId} • {req.section}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{req.reasonType}</td>
                    <td className="py-3.5 px-4 text-slate-600">{req.startDate} – {req.endDate} ({req.totalDays}d)</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={req.attendance?.projected < 75 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                        {req.attendance?.current}% → {req.attendance?.projected}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition inline-flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clear Queue Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-slate-900">Clear Review Queue List?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to clear all leave requests from the review queue?
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
                Clear Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
