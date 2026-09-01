import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Percent, 
  Award, 
  PlusCircle, 
  Code2, 
  Binary, 
  ChevronRight,
  Sparkles,
  Eye,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import RequestDetailModal from '../../components/RequestDetailModal';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { filteredRequests, clearAllLeaves } = useLeave();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  // Student's own applications
  const studentRequests = filteredRequests.filter(r => r.studentId === user?.id || r.studentName === user?.name);
  
  const studentProfile = user?.profile || {
    cgpa: 8.84,
    currentAttendance: 88.2,
    githubUrl: 'https://github.com/torvalds',
    leetcodeUrl: 'https://leetcode.com/u/neal_wu/'
  };

  const totalLeaves = studentRequests.length;
  const pendingLeaves = studentRequests.filter(r => r.status === 'PENDING' || r.status.startsWith('PENDING')).length;
  const approvedLeaves = studentRequests.filter(r => r.status === 'APPROVED').length;
  const rejectedLeaves = studentRequests.filter(r => r.status === 'REJECTED').length;

  const handleConfirmClear = () => {
    clearAllLeaves();
    setShowClearModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl text-white">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Portal & Academic Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            Department: <strong className="text-white">{user?.department || 'Computer Science & Engineering'}</strong> ({user?.registerNo || '21CS094'})
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/student/apply"
            className="px-5 py-3 text-xs font-bold text-blue-900 bg-white hover:bg-blue-50 rounded-2xl shadow-lg transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Apply for Leave</span>
          </Link>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">TOTAL LEAVES</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalLeaves}</p>
          <p className="text-[10px] text-slate-500 font-mono">Applications filed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">PENDING</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingLeaves}</p>
          <p className="text-[10px] text-slate-500 font-mono">Awaiting staff review</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">APPROVED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{approvedLeaves}</p>
          <p className="text-[10px] text-slate-500 font-mono">Sanctioned leaves</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">REJECTED</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600">{rejectedLeaves}</p>
          <p className="text-[10px] text-slate-500 font-mono">Declined requests</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">ATTENDANCE</span>
            <Percent className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600">{studentProfile.currentAttendance}%</p>
          <p className="text-[10px] text-slate-500 font-mono">Min 75% threshold</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px]">CGPA</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-600">{studentProfile.cgpa}</p>
          <p className="text-[10px] text-slate-500 font-mono">Academic Score</p>
        </div>
      </div>

      {/* Quick Action Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/student/github"
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 shadow-sm transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                GitHub Profile Analysis
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Analyze public repositories, contributions, and technical score.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" />
        </Link>

        <Link
          to="/student/leetcode"
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 shadow-sm transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
              <Binary className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                LeetCode Coding Insights
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect solved problem counts (Easy, Medium, Hard) & consistency.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition" />
        </Link>
      </div>

      {/* Leave Applications Table with Clear Data Button */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900">Leave Form List & Applications</h2>
            <p className="text-xs text-slate-500">Track application status and view transparent priority breakdowns.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowClearModal(true)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear Leave List</span>
            </button>

            <Link to="/student/apply" className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition">
              + New Leave
            </Link>
          </div>
        </div>

        {studentRequests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No leave applications found in the list.</p>
            <Link
              to="/student/apply"
              className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Submit New Application
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Leave Category</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Priority Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {studentRequests.map(req => (
                  <tr key={req.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{req.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{req.reasonType}</td>
                    <td className="py-3.5 px-4 text-slate-600">{req.startDate} – {req.endDate} ({req.totalDays}d)</td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={req.calculatedPriority} />
                    </td>
                    <td className="py-3.5 px-4">
                      {req.status === 'APPROVED' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🟢 Approved</span>}
                      {req.status === 'REJECTED' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">🔴 Rejected</span>}
                      {(req.status === 'PENDING' || req.status.startsWith('PENDING')) && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">🟡 Pending</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-700 text-xs font-bold transition inline-flex items-center gap-1 border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clear Leave Applications Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-slate-900">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-slate-900">Clear Leave Applications List?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to clear all submitted leave requests from the list?
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
                Clear List
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
