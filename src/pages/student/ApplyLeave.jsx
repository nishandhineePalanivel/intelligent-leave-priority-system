import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';
import { 
  PlusCircle, 
  Upload, 
  Sparkles, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  BrainCircuit,
  Info
} from 'lucide-react';
import { calculatePriorityScore } from '../../utils/priorityEngine';

export default function ApplyLeave() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addLeaveRequest, weights, urgentTypes } = useLeave();

  const [reasonType, setReasonType] = useState('Medical Emergency');
  const [reasonDetails, setReasonDetails] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  // Auto-calculate total days from date range
  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (e >= s) {
        const diffTime = Math.abs(e - s);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setTotalDays(diffDays);
      } else {
        setTotalDays(1);
      }
    }
  }, [startDate, endDate]);

  // Live estimated priority calculation preview
  const previewScore = calculatePriorityScore(
    {
      reasonType,
      reasonDetails,
      totalDays,
      proofRequired: Boolean(fileName),
      proof: fileName ? { fileName, strengthScore: 90 } : null,
      attendance: { current: user?.profile?.currentAttendance || 88.2, projected: (user?.profile?.currentAttendance || 88.2) - (totalDays * 0.8), threshold: 75.0 },
      academic: { cgpa: user?.profile?.cgpa || 8.84, github: 85, leetcode: 80 },
      leaveHistory: { totalDaysThisMonth: 1, unusualPattern: false, score: 90 }
    },
    weights,
    urgentTypes
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reasonDetails || !startDate || !endDate) return;

    setIsSubmitting(true);

    const leaveObj = {
      reasonType,
      reasonDetails,
      startDate,
      endDate,
      totalDays,
      proofRequired: Boolean(fileName),
      proof: fileName ? {
        fileName,
        fileSize: fileSize || '1.2 MB',
        strengthScore: 92,
        nameMatch: 'Strong',
        dateMatch: 'Strong',
        reasonMatch: 'Strong',
        completeness: 'High',
        extractedText: `Extracted Document Proof for ${reasonType}`,
        aiConfidence: '96.5%'
      } : null
    };

    try {
      const created = await addLeaveRequest(leaveObj);
      setSubmittedApp(created);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedApp) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center ring-8 ring-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            SUCCESSFULLY SUBMITTED
          </span>
          <h2 className="text-2xl font-black text-white mt-3">Leave Application Submitted Successfully</h2>
          <p className="text-xs text-slate-400 mt-1">
            Your application has been logged with an automated 5-factor priority score.
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-400">APPLICATION ID:</span>
            <span className="text-sm font-bold text-indigo-400">{submittedApp.id}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Leave Type:</span>
              <p className="font-bold text-white font-sans">{submittedApp.reasonType}</p>
            </div>
            <div>
              <span className="text-slate-400">Duration:</span>
              <p className="font-bold text-white font-sans">{submittedApp.totalDays} Days ({submittedApp.startDate} to {submittedApp.endDate})</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">Priority Score:</span>
            <span className="text-sm font-bold text-amber-400">{submittedApp.calculatedPriority?.score || previewScore.score} / 100 ({submittedApp.calculatedPriority?.levelLabel || previewScore.levelLabel})</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/student/applications')}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
          >
            Track My Applications
          </button>
          <button
            onClick={() => setSubmittedApp(null)}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
          >
            Apply Another Leave
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Apply for Student Leave</h1>
          <p className="text-xs text-slate-400 mt-0.5">Submit official institutional leave application with supporting document proof.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-indigo-400">
          <BrainCircuit className="w-4 h-4" /> Live Score Calculator
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          
          {/* Leave Type */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Leave Category / Type
            </label>
            <select
              value={reasonType}
              onChange={(e) => setReasonType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="Medical Emergency">Medical Emergency</option>
              <option value="Placement / Interview">Placement / Interview</option>
              <option value="Family Emergency">Family Emergency</option>
              <option value="Official Academic Event">Official Academic Event</option>
              <option value="Internship">Internship</option>
              <option value="Government Examination">Government Examination</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                From Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                To Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Number of Days Display */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Total Requested Leave Duration:</span>
            <span className="font-bold text-indigo-400">{totalDays} Day{totalDays > 1 ? 's' : ''}</span>
          </div>

          {/* Reason Details */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Reason & Supporting Information
            </label>
            <textarea
              required
              rows={4}
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              placeholder="Provide a detailed explanation of the leave requirement..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          {/* Proof Document Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Supporting Proof Document (Optional PDF / Medical Certificate / Invitation)
            </label>
            <div className="border-2 border-dashed border-slate-800 rounded-2xl p-4 text-center hover:border-indigo-500/50 transition">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                <Upload className="w-6 h-6 text-indigo-400 mb-1" />
                <span className="text-xs font-bold text-slate-300">
                  {fileName ? `Uploaded: ${fileName} (${fileSize})` : 'Click to Upload Document'}
                </span>
                <span className="text-[10px] text-slate-500">PDF, PNG, JPG up to 5MB</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? <span>Submitting...</span> : <span>SUBMIT LEAVE APPLICATION</span>}
          </button>
        </form>

        {/* Live Priority Preview Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 h-fit">
          <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-slate-800 pb-3">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <span>Priority Score Preview</span>
          </div>

          <div className="text-center bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">ESTIMATED PRIORITY SCORE</p>
            <p className="text-4xl font-black text-white">{previewScore.score}<span className="text-sm text-slate-500">/100</span></p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${previewScore.levelColor === 'rose' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : previewScore.levelColor === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`}>
              {previewScore.levelLabel}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Factor Breakdown Preview</p>
            
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Reason Urgency</span>
                <span>{previewScore.breakdown.reasonScore} / {weights.reasonUrgency}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(previewScore.breakdown.reasonScore / weights.reasonUrgency) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Attendance Impact</span>
                <span>{previewScore.breakdown.attendanceScore} / {weights.attendanceImpact}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(previewScore.breakdown.attendanceScore / weights.attendanceImpact) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Academic Track</span>
                <span>{previewScore.breakdown.academicScore} / {weights.academicConsistency}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(previewScore.breakdown.academicScore / weights.academicConsistency) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>Priority score orders the review queue. Final approval rests with human staff.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
