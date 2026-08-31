import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import PriorityBadge from './PriorityBadge';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Percent, 
  Code, 
  History, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  UserCheck,
  Award,
  Sparkles,
  Info,
  Download,
  AlertOctagon
} from 'lucide-react';

export default function RequestDetailModal({ request, onClose }) {
  const { activeRole, updateRequestStatus } = useLeave();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const {
    id,
    studentId,
    studentName,
    department,
    section,
    year,
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
    leaveHistory,
    status,
    approvalTimeline
  } = request;

  const { score, levelLabel, levelColor, breakdown, metrics, explanations } = calculatedPriority;

  // Handle Workflow Actions
  const handleAction = (newStatus, actionLabel) => {
    setIsSubmitting(true);
    setTimeout(() => {
      let roleTitle = 'Class Advisor';
      if (activeRole === 'HOD') roleTitle = 'HOD';
      if (activeRole === 'VP') roleTitle = 'Vice Principal';

      updateRequestStatus(id, newStatus, roleTitle, comment || `${actionLabel} by ${roleTitle}`);
      
      if (newStatus === 'APPROVED' || newStatus.startsWith('PENDING')) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold font-mono">
              {id.slice(-3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{studentName}</h2>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {studentId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {department} • {section} ({year})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PriorityBadge priority={calculatedPriority} showDetails={false} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Priority Score & Explainability Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left 5 Cols: Score Card */}
            <div className="md:col-span-5 bg-slate-950/80 rounded-xl border border-indigo-500/30 p-5 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  LEAVE PRIORITY SCORE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Transparent 0–100
                </span>
              </div>

              <div className="text-center py-2">
                <div className="inline-flex items-baseline gap-1 text-5xl font-black tracking-tight text-white font-mono">
                  <span>{score}</span>
                  <span className="text-lg text-slate-500 font-sans font-normal">/100</span>
                </div>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    levelColor === 'rose' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                    levelColor === 'amber' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}>
                    {levelLabel}
                  </span>
                </div>
              </div>

              {/* 5-Factor Score Breakdown List */}
              <div className="space-y-2 pt-2 text-xs border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Factor Breakdown:
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Reason & Urgency</span>
                  <span className="font-mono font-bold text-indigo-300">{breakdown.reasonScore} / {breakdown.reasonMax}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Proof Strength & Consistency</span>
                  <span className="font-mono font-bold text-indigo-300">{breakdown.proofScore} / {breakdown.proofMax}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Attendance Impact</span>
                  <span className="font-mono font-bold text-indigo-300">{breakdown.attendanceScore} / {breakdown.attendanceMax}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Academic / Dev Context</span>
                  <span className="font-mono font-bold text-indigo-300">{breakdown.academicScore} / {breakdown.academicMax}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Previous Leave Pattern</span>
                  <span className="font-mono font-bold text-indigo-300">{breakdown.leaveHistoryScore} / {breakdown.leaveHistoryMax}</span>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Explainability & Action Recommendation */}
            <div className="md:col-span-7 bg-slate-950/40 rounded-xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  WHY IS THIS REQUEST {levelLabel}?
                </h3>
                <span className="text-[10px] text-slate-400">AI Priority Explanation</span>
              </div>

              <ul className="space-y-2 text-xs">
                {explanations.map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>

              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Recommended Action:</strong>
                  Review this request earlier in your queue. Verify supporting proof details below before granting final approval.
                </div>
              </div>
            </div>
          </div>

          {/* Leave Reason & Applied Dates */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Applied Leave Reason & Duration
              </span>
              <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {reasonType}
              </span>
            </div>
            <p className="text-xs text-slate-200 bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed font-sans">
              "{reasonDetails}"
            </p>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
              <span>Duration: <strong className="text-white">{startDate}</strong> to <strong className="text-white">{endDate}</strong></span>
              <span>Total Leave Days: <strong className="text-indigo-300">{totalDays} Days</strong></span>
            </div>
          </div>

          {/* Proof Strength & Document Inspection Simulator */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                Proof Document Strength & Consistency (25%)
              </span>
              {proof ? (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Proof Consistency: {proof.strengthScore}/100
                </span>
              ) : (
                <span className="text-xs text-slate-400 italic">No Document Required</span>
              )}
            </div>

            {proof ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Name Match</span>
                    <strong className="text-emerald-400">{proof.nameMatch}</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Date Match</span>
                    <strong className="text-emerald-400">{proof.dateMatch}</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Reason Match</span>
                    <strong className="text-emerald-400">{proof.reasonMatch}</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Completeness</span>
                    <strong className="text-emerald-400">{proof.completeness}</strong>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" /> Attached: {proof.fileName} ({proof.fileSize})
                    </span>
                    <span className="font-mono text-[11px] text-indigo-300">OCR AI Confidence: {proof.aiConfidence}</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800/80">
                    Extracted Text: "{proof.extractedText}"
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  * Note: AI evaluates document text consistency. Human authority must still perform final document verification.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-900 p-3 rounded-lg border border-slate-800">
                Standard leave type does not require formal document upload.
              </p>
            )}
          </div>

          {/* Attendance & Academic Context Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Attendance Risk */}
            <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-indigo-400" />
                Attendance & Academic Impact (20%)
              </span>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Current Attendance:</span>
                  <span className="font-bold text-white">{attendance?.current}%</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Projected Post-Leave:</span>
                  <span className={`font-bold ${attendance?.projected < (attendance?.threshold || 75) ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {attendance?.projected}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Required Threshold:</span>
                  <span>{attendance?.threshold || 75}%</span>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Attendance Risk Level:</span>
                    <span className={`font-bold ${
                      metrics.attendanceRisk === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {metrics.attendanceRisk}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${metrics.attendanceRisk === 'HIGH' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, attendance?.projected || 80)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Student Academic & Dev Consistency */}
            <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-indigo-400" />
                Academic & Dev Consistency (15%)
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">CGPA:</span>
                  <span className="font-mono font-bold text-white">{academic?.cgpa || '8.0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">GitHub Consistency:</span>
                  <span className="font-mono font-bold text-purple-300">
                    {academic?.github !== null ? `${academic.github}/100` : 'Not Provided'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">LeetCode Consistency:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {academic?.leetcode !== null ? `${academic.leetcode}/100` : 'Not Provided'}
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 mt-2">
                  <strong className="text-indigo-300">Fairness Rule:</strong> Supporting context only. Students without dev profiles are evaluated fairly without penalty.
                </div>
              </div>
            </div>
          </div>

          {/* Approval History Timeline */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-400" />
              Approval Workflow Progression
            </span>

            <div className="space-y-2 text-xs">
              {approvalTimeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{step.step} ({step.role})</strong>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        step.status === 'APPROVED' || step.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{step.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments & Remarks Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Authority Review Comments / Remarks:
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add review notes, instructions or recommendation comments..."
              className="w-full bg-slate-950 text-xs text-white placeholder-slate-500 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Modal Footer with Role Action Buttons */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-xs text-slate-400">
            Active Officer Role: <strong className="text-indigo-300">{activeRole}</strong>
          </div>

          <div className="flex items-center gap-3">
            {/* Reject Button */}
            <button
              disabled={isSubmitting}
              onClick={() => handleAction('REJECTED', 'Reject Leave Request')}
              className="px-4 py-2 text-xs font-bold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition"
            >
              <XCircle className="w-4 h-4" /> Reject Request
            </button>

            {/* Workflow Progress Actions */}
            {activeRole === 'ADVISOR' && (
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('PENDING_HOD', 'Recommend & Forward to HOD')}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center gap-2 transition hover:scale-105"
              >
                <UserCheck className="w-4 h-4" /> Forward Recommendation to HOD
              </button>
            )}

            {activeRole === 'HOD' && (
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('PENDING_VP', 'Recommend & Forward to Vice Principal')}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center gap-2 transition hover:scale-105"
              >
                <Award className="w-4 h-4" /> Forward Recommendation to VP
              </button>
            )}

            {(activeRole === 'VP' || activeRole === 'ADMIN') && (
              <button
                disabled={isSubmitting}
                onClick={() => handleAction('APPROVED', 'Final Approve Leave')}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-600/30 border border-emerald-400/30 flex items-center gap-2 transition hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" /> Final Approve Leave
              </button>
            )}

            {activeRole === 'STUDENT' && (
              <div className="text-xs text-slate-400 italic">
                Viewing as Student. Read-only queue inspection mode.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
