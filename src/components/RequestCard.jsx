import React from 'react';
import PriorityBadge from './PriorityBadge';
import { 
  FileText, 
  Calendar, 
  Percent, 
  Code, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Zap, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function RequestCard({ request, onInspect, activeRole }) {
  const {
    studentId,
    studentName,
    department,
    section,
    avatar,
    reasonType,
    reasonDetails,
    startDate,
    endDate,
    totalDays,
    submittedAt,
    calculatedPriority,
    attendance,
    academic,
    proof,
    status
  } = request;

  const formattedDate = new Date(submittedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getStatusBadge = (st) => {
    switch (st) {
      case 'PENDING_ADVISOR':
        return { label: 'PENDING CLASS ADVISOR', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'PENDING_HOD':
        return { label: 'PENDING HOD', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'PENDING_VP':
        return { label: 'PENDING VICE PRINCIPAL', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'APPROVED':
        return { label: 'APPROVED', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'REJECTED':
        return { label: 'REJECTED', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      default:
        return { label: st, color: 'bg-slate-700 text-slate-300' };
    }
  };

  const statusInfo = getStatusBadge(status);

  return (
    <div className={`group relative rounded-xl border bg-slate-900/80 backdrop-blur-md p-5 transition-all duration-200 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/40 ${
      calculatedPriority.isUrgent 
        ? 'border-amber-500/40 ring-1 ring-amber-500/20' 
        : 'border-slate-800'
    }`}>
      {/* Header section with Student info & Priority Badge */}
      <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <img 
            src={avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student'} 
            alt={studentName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(studentName)}`;
            }}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-400 transition bg-slate-800"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition">
                {studentName}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {studentId}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-0.5">
              <span>{department} ({section})</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3 text-slate-500" /> {formattedDate}
              </span>
            </p>
          </div>
        </div>

        {/* Priority Badge Component */}
        <div className="flex flex-col items-end gap-1">
          <PriorityBadge priority={calculatedPriority} />
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-extrabold ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Leave Details & Key Factors Grid */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Col 1: Reason & Dates */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Leave Reason:</span>
            <span className="font-semibold px-2 py-0.5 rounded text-[11px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {reasonType}
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
            "{reasonDetails}"
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{startDate} to {endDate}</span>
            <span className="font-bold text-indigo-300">({totalDays} {totalDays === 1 ? 'day' : 'days'})</span>
          </div>
        </div>

        {/* Col 2: Attendance & Proof Analysis */}
        <div className="space-y-2 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-indigo-400" /> Attendance:
            </span>
            <span className={`font-mono font-bold ${
              attendance?.projected < (attendance?.threshold || 75) 
                ? 'text-rose-400' 
                : 'text-emerald-400'
            }`}>
              {attendance?.current}% → <span className="underline">{attendance?.projected}%</span>
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                attendance?.projected < (attendance?.threshold || 75) ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, attendance?.projected || 80)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-400" /> Proof Strength:
            </span>
            {proof ? (
              <span className="font-bold text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> {proof.strengthScore}/100 Match
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">Not Required</span>
            )}
          </div>
        </div>

        {/* Col 3: Academic / Dev Context & Factor Scores */}
        <div className="space-y-2 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/50">
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Academic Context</span>
            <span className="text-[10px] text-slate-400 font-sans font-normal">(Non-Punitive)</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px] border border-slate-700">
              CGPA: <strong className="text-white">{academic?.cgpa || '8.0'}</strong>
            </span>
            {academic?.github !== null && academic?.github !== undefined && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono text-[11px] border border-purple-500/30 flex items-center gap-1">
                <Code className="w-3 h-3" /> GH: {academic.github}
              </span>
            )}
            {academic?.leetcode !== null && academic?.leetcode !== undefined && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[11px] border border-amber-500/30">
                LC: {academic.leetcode}
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 line-clamp-1">
            <strong>Key Driver:</strong> {calculatedPriority.explanations[0] || 'Standard request evaluation'}
          </div>
        </div>
      </div>

      {/* Footer & Action Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Factor Scores:</span>
          <span className="font-mono text-[11px] text-slate-400">
            Reason: <strong className="text-indigo-300">{calculatedPriority.breakdown.reasonScore}</strong>/{calculatedPriority.breakdown.reasonMax} • 
            Proof: <strong className="text-indigo-300">{calculatedPriority.breakdown.proofScore}</strong>/{calculatedPriority.breakdown.proofMax} • 
            Att: <strong className="text-indigo-300">{calculatedPriority.breakdown.attendanceScore}</strong>/{calculatedPriority.breakdown.attendanceMax}
          </span>
        </div>

        <button
          onClick={() => onInspect(request)}
          className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 border border-indigo-400/30 flex items-center gap-1.5 transition hover:translate-x-0.5"
        >
          <span>Inspect & Action</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
