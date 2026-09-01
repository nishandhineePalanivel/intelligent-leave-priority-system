import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLeave } from '../../context/LeaveContext';
import { 
  Upload, 
  CheckCircle2, 
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
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6 text-slate-900">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            APPLICATION SUBMITTED
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-3">Leave Application Submitted Successfully</h2>
          <p className="text-xs text-slate-600 mt-1">
            Your application has been logged with an automated 5-factor priority score.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs text-slate-500">APPLICATION ID:</span>
            <span className="text-sm font-bold text-blue-700">{submittedApp.id}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500">Leave Category:</span>
              <p className="font-bold text-slate-900 font-sans">{submittedApp.reasonType}</p>
            </div>
            <div>
              <span className="text-slate-500">Duration:</span>
              <p className="font-bold text-slate-900 font-sans">{submittedApp.totalDays} Days ({submittedApp.startDate} to {submittedApp.endDate})</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">Priority Score:</span>
            <span className="text-sm font-bold text-blue-700">{submittedApp.calculatedPriority?.score || previewScore.score} / 100 ({submittedApp.calculatedPriority?.levelLabel || previewScore.levelLabel})</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            Track My Applications
          </button>
          <button
            onClick={() => setSubmittedApp(null)}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
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
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900">Apply for Student Leave</h1>
          <p className="text-xs text-slate-500 mt-0.5">Submit official institutional leave application with supporting document proof.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-blue-700 font-bold">
          <BrainCircuit className="w-4 h-4" /> Priority Calculator Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm text-slate-900">
          
          {/* Leave Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Leave Category / Type
            </label>
            <select
              value={reasonType}
              onChange={(e) => setReasonType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-bold cursor-pointer"
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                From Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                To Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono font-medium"
              />
            </div>
          </div>

          {/* Number of Days Display */}
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">Total Requested Leave Duration:</span>
            <span className="font-bold text-blue-800">{totalDays} Day{totalDays > 1 ? 's' : ''}</span>
          </div>

          {/* Reason Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Reason & Supporting Information
            </label>
            <textarea
              required
              rows={4}
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              placeholder="Provide a detailed explanation of the leave requirement..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          {/* Proof Document Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Supporting Document (Optional PDF / Medical Certificate)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-blue-500 transition bg-slate-50">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-800">
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
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? <span>Submitting...</span> : <span>SUBMIT LEAVE APPLICATION</span>}
          </button>
        </form>

        {/* Live Priority Preview Sidebar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 h-fit shadow-sm text-slate-900">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-3">
            <BrainCircuit className="w-4 h-4 text-blue-600" />
            <span>Priority Score Preview</span>
          </div>

          <div className="text-center bg-blue-50 p-6 rounded-2xl border border-blue-200 space-y-2">
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-600 font-bold">ESTIMATED PRIORITY SCORE</p>
            <p className="text-4xl font-black text-slate-900">{previewScore.score}<span className="text-sm text-slate-500">/100</span></p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${previewScore.levelColor === 'rose' ? 'bg-rose-100 text-rose-800 border border-rose-200' : previewScore.levelColor === 'amber' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
              {previewScore.levelLabel}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Factor Breakdown Preview</p>
            
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Reason Urgency</span>
                <span className="font-bold">{previewScore.breakdown.reasonScore} / {weights.reasonUrgency}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(previewScore.breakdown.reasonScore / weights.reasonUrgency) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Attendance Impact</span>
                <span className="font-bold">{previewScore.breakdown.attendanceScore} / {weights.attendanceImpact}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(previewScore.breakdown.attendanceScore / weights.attendanceImpact) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Academic Track</span>
                <span className="font-bold">{previewScore.breakdown.academicScore} / {weights.academicConsistency}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(previewScore.breakdown.academicScore / weights.academicConsistency) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>Priority score orders the review queue. Final approval rests with human staff.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
