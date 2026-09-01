import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';
import { 
  UserCheck, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  ListFilter, 
  Sparkles,
  Eye,
  Check,
  X
} from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import RequestDetailModal from '../../components/RequestDetailModal';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { filteredRequests, priorityStats, updateRequestStatus } = useLeave();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionComment, setActionComment] = useState('');

  const pendingRequests = filteredRequests.filter(r => r.status === 'PENDING' || r.status.startsWith('PENDING'));
  const criticalCount = pendingRequests.filter(r => r.calculatedPriority.levelKey === 'CRITICAL').length;
  const highCount = pendingRequests.filter(r => r.calculatedPriority.levelKey === 'HIGH').length;

  const handleApprove = (id) => {
    updateRequestStatus(id, 'APPROVED', user?.name || 'Staff Advisor', actionComment || 'Approved after review of urgency & document proof.');
    setSelectedRequest(null);
    setActionComment('');
  };

  const handleReject = (id) => {
    updateRequestStatus(id, 'REJECTED', user?.name || 'Staff Advisor', actionComment || 'Request declined due to attendance risk.');
    setSelectedRequest(null);
    setActionComment('');
  };

  return (
    <div className="space-y-6">
      {/* Staff Hero Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Faculty & Class Advisor Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome, {user?.name || 'Faculty'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Review student leave applications ordered by automated 5-factor priority scores. Urgent and critical requests appear at the top of your queue.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-3 bg-slate-900 border border-purple-500/30 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 font-mono uppercase">PENDING REVIEW</span>
            <p className="text-2xl font-black text-purple-400">{pendingRequests.length}</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-rose-400 font-mono uppercase font-bold">CRITICAL PRIORITY</span>
            <p className="text-2xl font-black text-white mt-1">{criticalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">HIGH PRIORITY</span>
            <p className="text-2xl font-black text-white mt-1">{highCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">DECISION RATE</span>
            <p className="text-2xl font-black text-white mt-1">94%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Prioritized Review Queue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-purple-400" />
              <span>Prioritized Leave Queue</span>
            </h2>
            <p className="text-xs text-slate-400">Applications automatically ranked from 0–100 by urgency and institutional risk metrics.</p>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-400 text-xs">
            No pending leave requests requiring review.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Priority Score</th>
                  <th className="py-3 px-4">Student Name & ID</th>
                  <th className="py-3 px-4">Leave Category</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Attendance Impact</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {pendingRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={req.calculatedPriority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={req.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                          alt={req.studentName}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{req.studentName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{req.studentId} • {req.section}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">{req.reasonType}</td>
                    <td className="py-3.5 px-4 text-slate-400">{req.startDate} – {req.endDate} ({req.totalDays}d)</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={req.attendance?.projected < 75 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {req.attendance?.current}% → {req.attendance?.projected}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition inline-flex items-center gap-1"
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
