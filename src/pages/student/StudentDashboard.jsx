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
  ShieldCheck
} from 'lucide-react';
import PriorityBadge from '../../components/PriorityBadge';
import RequestDetailModal from '../../components/RequestDetailModal';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { filteredRequests, priorityStats } = useLeave();
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Student Academic & Leave Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Track your leave application status in real-time, view transparent 5-factor priority scores, and analyze your GitHub and LeetCode activity metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link
            to="/student/apply"
            className="px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-600/30 transition flex items-center gap-2 border border-indigo-400/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply for Leave</span>
          </Link>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* TOTAL LEAVES */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">TOTAL LEAVES</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalLeaves}</p>
          <p className="text-[10px] text-slate-500 font-mono">Applications filed</p>
        </div>

        {/* PENDING REQUESTS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">PENDING</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{pendingLeaves}</p>
          <p className="text-[10px] text-slate-500 font-mono">Awaiting staff review</p>
        </div>

        {/* APPROVED LEAVES */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">APPROVED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{approvedLeaves}</p>
          <p className="text-[10px] text-slate-500 font-mono">Sanctioned leaves</p>
        </div>

        {/* REJECTED LEAVES */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">REJECTED</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400">{rejectedLeaves}</p>
          <p className="text-[10px] text-slate-500 font-mono">Declined requests</p>
        </div>

        {/* ATTENDANCE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">ATTENDANCE</span>
            <Percent className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400">{studentProfile.currentAttendance}%</p>
          <p className="text-[10px] text-slate-500 font-mono">Min 75% threshold</p>
        </div>

        {/* CGPA */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">CGPA</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400">{studentProfile.cgpa}</p>
          <p className="text-[10px] text-slate-500 font-mono">Academic Score</p>
        </div>
      </div>

      {/* Quick Action Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/student/github"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                GitHub Profile Analysis
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Analyze public repositories, contributions, and technical score.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
        </Link>

        <Link
          to="/student/leetcode"
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/50 transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
              <Binary className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                LeetCode Coding Insights
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect solved problem counts (Easy, Medium, Hard) & consistency.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition" />
        </Link>
      </div>

      {/* Recent Leave Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Leave Applications</h2>
            <p className="text-xs text-slate-400">Track application status and view transparent priority breakdowns.</p>
          </div>
          <Link to="/student/applications" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
            View All →
          </Link>
        </div>

        {studentRequests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No leave applications found.</p>
            <Link
              to="/student/apply"
              className="inline-block mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Submit First Application
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Priority Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {studentRequests.slice(0, 5).map(req => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">{req.id}</td>
                    <td className="py-3.5 px-4 text-slate-200">{req.reasonType}</td>
                    <td className="py-3.5 px-4 text-slate-400">{req.startDate} – {req.endDate} ({req.totalDays}d)</td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={req.calculatedPriority} />
                    </td>
                    <td className="py-3.5 px-4">
                      {req.status === 'APPROVED' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">🟢 Approved</span>}
                      {req.status === 'REJECTED' && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">🔴 Rejected</span>}
                      {(req.status === 'PENDING' || req.status.startsWith('PENDING')) && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">🟡 Pending</span>}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
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

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
