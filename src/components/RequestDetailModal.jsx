import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeave } from '../context/LeaveContext';
import PriorityBadge from './PriorityBadge';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Percent, 
  Code, 
  History, 
  ShieldCheck, 
  Sparkles,
  Info,
  UserCheck,
  Award
} from 'lucide-react';

export default function RequestDetailModal({ request, onClose, onApprove, onReject }) {
  const { user } = useAuth();
  const { updateRequestStatus } = useLeave();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const userRole = user?.role || 'STAFF';

  const {
    id,
    studentId,
    studentName,
    department,
    section,
    year,
    reasonType,
    reasonDetails,
    startDate,
    endDate,
    totalDays,
    calculatedPriority,
    attendance,
    academic,
    proof,
    approvalTimeline = []
  } = request;

  const { score, levelLabel, levelColor, breakdown, metrics, explanations = [] } = calculatedPriority || {};

  // Handle Review Action (Approve / Reject / Forward)
  const handleAction = (newStatus, actionLabel) => {
    setIsSubmitting(true);
    setTimeout(() => {
      let roleTitle = 'Faculty Staff';
      if (userRole === 'VICE_PRINCIPAL') roleTitle = 'Vice Principal';
      if (userRole === 'ADMINISTRATOR') roleTitle = 'Administrator';
      if (userRole === 'STAFF') roleTitle = 'Class Advisor';

      if (onApprove && newStatus === 'APPROVED') {
        onApprove(id);
      } else if (onReject && newStatus === 'REJECTED') {
        onReject(id);
      } else {
        updateRequestStatus(id, newStatus, roleTitle, comment || `${actionLabel} by ${roleTitle}`);
      }

      if (newStatus === 'APPROVED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold font-mono text-sm">
              {id ? id.slice(-3) : '001'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">{studentName}</h2>
                <span className="text-xs font-mono text-blue-200 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  {studentId}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {department} • {section} ({year})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PriorityBadge priority={calculatedPriority} showDetails={false} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Priority Score Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Score Card */}
            <div className="md:col-span-5 bg-blue-50/60 rounded-2xl border border-blue-200 p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-blue-900">
                  PRIORITY SCORE
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                  0–100 Engine
                </span>
              </div>

              <div className="text-center py-2">
                <div className="inline-flex items-baseline gap-1 text-5xl font-black text-slate-900 font-mono">
                  <span>{score}</span>
                  <span className="text-lg text-slate-500 font-sans font-normal">/100</span>
                </div>
                <div className="mt-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    levelColor === 'rose' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    levelColor === 'amber' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {levelLabel}
                  </span>
                </div>
              </div>

              {/* 5-Factor Score Breakdown */}
              <div className="space-y-2 pt-2 text-xs border-t border-blue-200">
                <div className="text-[11px] font-bold text-blue-950 uppercase tracking-wider mb-2">
                  Factor Breakdown:
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Reason Urgency</span>
                  <span className="font-mono font-bold text-blue-800">{breakdown?.reasonScore} / {breakdown?.reasonMax}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Proof Document Strength</span>
                  <span className="font-mono font-bold text-blue-800">{breakdown?.proofScore} / {breakdown?.proofMax}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Attendance Risk Impact</span>
                  <span className="font-mono font-bold text-blue-800">{breakdown?.attendanceScore} / {breakdown?.attendanceMax}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Academic / Dev Context</span>
                  <span className="font-mono font-bold text-blue-800">{breakdown?.academicScore} / {breakdown?.academicMax}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Previous Leave Pattern</span>
                  <span className="font-mono font-bold text-blue-800">{breakdown?.leaveHistoryScore} / {breakdown?.leaveHistoryMax}%</span>
                </div>
              </div>
            </div>

            {/* Explanations & Context */}
            <div className="md:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  PRIORITY ENGINE EXPLANATION
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Automated Decision Support</span>
              </div>

              <ul className="space-y-2 text-xs">
                {explanations.map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>

              <div className="p-3 rounded-xl bg-blue-100 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Review Recommendation:</strong>
                  Priority score orders the queue so high urgency requests are reviewed first. Final sanction rests with human faculty authority.
                </div>
              </div>
            </div>
          </div>

          {/* Leave Reason & Duration */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Applied Leave Reason & Requested Duration
              </span>
              <span className="text-xs font-mono font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                {reasonType}
              </span>
            </div>
            <p className="text-xs text-slate-900 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
              "{reasonDetails}"
            </p>
            <div className="flex items-center justify-between text-xs text-slate-600 font-mono pt-1">
              <span>Dates: <strong className="text-slate-900">{startDate}</strong> to <strong className="text-slate-900">{endDate}</strong></span>
              <span>Total Leave Duration: <strong className="text-blue-700">{totalDays} Days</strong></span>
            </div>
          </div>

          {/* Proof Document Details */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Supporting Proof Document Analysis
              </span>
              {proof ? (
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  Consistency Score: {proof.strengthScore}/100
                </span>
              ) : (
                <span className="text-xs text-slate-500 italic">No Document Attached</span>
              )}
            </div>

            {proof ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Name Match</span>
                    <strong className="text-emerald-700">{proof.nameMatch}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Date Match</span>
                    <strong className="text-emerald-700">{proof.dateMatch}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Reason Match</span>
                    <strong className="text-emerald-700">{proof.reasonMatch}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Completeness</span>
                    <strong className="text-emerald-700">{proof.completeness}</strong>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600" /> File: {proof.fileName} ({proof.fileSize})
                    </span>
                    <span className="font-mono text-[11px] text-blue-700">OCR AI Confidence: {proof.aiConfidence}</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
                    Extracted OCR Text: "{proof.extractedText}"
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic bg-white p-3 rounded-xl border border-slate-200">
                Standard leave category submitted without mandatory document requirement.
              </p>
            )}
          </div>

          {/* Attendance & Academic Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Attendance Impact */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-blue-600" />
                Attendance & Academic Impact
              </span>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Current Attendance:</span>
                  <span className="font-bold text-slate-900">{attendance?.current || 88.2}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Projected Post-Leave:</span>
                  <span className={`font-bold ${attendance?.projected < (attendance?.threshold || 75) ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {attendance?.projected || 85.1}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Minimum Threshold:</span>
                  <span>75.0%</span>
                </div>
              </div>
            </div>

            {/* Academic & Dev */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-indigo-600" />
                Academic & Technical Profile
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">CGPA Score:</span>
                  <span className="font-mono font-bold text-slate-900">{academic?.cgpa || '8.84'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">GitHub Profile Score:</span>
                  <span className="font-mono font-bold text-blue-700">
                    {academic?.github ? `${academic.github}/100` : 'Not Linked'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">LeetCode Profile Score:</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {academic?.leetcode ? `${academic.leetcode}/100` : 'Not Linked'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviewer Remarks Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Authority Review Comments / Remarks:
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter official review remarks, rationale, or recommendation notes..."
              className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>
        </div>

        {/* Modal Footer with Role Action Buttons */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-xs font-bold text-slate-600 font-mono">
            Reviewing Officer Role: <span className="text-blue-700 uppercase">{userRole.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Reject Button */}
            <button
              disabled={isSubmitting}
              onClick={() => handleAction('REJECTED', 'Reject Leave Request')}
              className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-xl border border-rose-300 flex items-center gap-1.5 transition"
            >
              <XCircle className="w-4 h-4" /> Reject Request
            </button>

            {/* Approve Button */}
            <button
              disabled={isSubmitting}
              onClick={() => handleAction('APPROVED', 'Approve Leave Request')}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve Leave Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
