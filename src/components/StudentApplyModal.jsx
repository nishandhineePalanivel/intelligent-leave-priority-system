import React, { useState, useMemo } from 'react';
import { useLeave } from '../context/LeaveContext';
import { calculatePriorityScore } from '../utils/priorityEngine';
import PriorityBadge from './PriorityBadge';
import { 
  X, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  Percent, 
  Code, 
  Calendar,
  Send,
  HelpCircle
} from 'lucide-react';

export default function StudentApplyModal({ onClose }) {
  const { addLeaveRequest, weights, urgentTypes } = useLeave();

  const [studentName, setStudentName] = useState('Anand V');
  const [studentId, setStudentId] = useState('21CS188');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [section, setSection] = useState('CSE-A');
  const [reasonType, setReasonType] = useState('Medical Emergency');
  const [reasonDetails, setReasonDetails] = useState('High fever and severe influenza prescribed 3 days medical rest by doctor.');
  const [startDate, setStartDate] = useState('2026-09-04');
  const [endDate, setEndDate] = useState('2026-09-06');
  const [totalDays, setTotalDays] = useState(3);
  
  // Attendance
  const [currentAtt, setCurrentAtt] = useState(86.5);
  const [classesAffected, setClassesAffected] = useState(18);

  // Academic
  const [cgpa, setCgpa] = useState(8.5);
  const [github, setGithub] = useState(82);
  const [leetcode, setLeetcode] = useState(78);

  // Proof Simulation
  const [fileName, setFileName] = useState('Medical_Rest_Certificate.pdf');
  const [proofStrengthScore, setProofStrengthScore] = useState(90);
  const [hasUploadedProof, setHasUploadedProof] = useState(true);

  // Calculate projected attendance
  const projectedAtt = useMemo(() => {
    const totalClassesInSemester = 300;
    const currentAttended = (currentAtt / 100) * totalClassesInSemester;
    const newAttended = currentAttended; // missed classes
    const proj = ((newAttended) / totalClassesInSemester) * 100;
    return Math.max(50, Math.min(100, Number(proj.toFixed(1))));
  }, [currentAtt, classesAffected]);

  // Real-time Priority Score Estimator
  const simulatedRequest = useMemo(() => {
    return {
      reasonType,
      reasonDetails,
      proofRequired: hasUploadedProof,
      proof: hasUploadedProof ? {
        fileName,
        fileSize: '1.2 MB',
        strengthScore: proofStrengthScore,
        nameMatch: 'Strong',
        dateMatch: 'Strong',
        reasonMatch: 'Strong',
        completeness: 'High'
      } : null,
      attendance: {
        current: Number(currentAtt),
        projected: projectedAtt,
        threshold: 75.0,
        classesAffected: Number(classesAffected)
      },
      academic: {
        cgpa: Number(cgpa),
        github: github !== '' ? Number(github) : null,
        leetcode: leetcode !== '' ? Number(leetcode) : null
      },
      leaveHistory: {
        totalDaysThisMonth: 1,
        unusualPattern: false,
        score: 90
      }
    };
  }, [reasonType, reasonDetails, hasUploadedProof, fileName, proofStrengthScore, currentAtt, projectedAtt, classesAffected, cgpa, github, leetcode]);

  const livePriority = useMemo(() => {
    return calculatePriorityScore(simulatedRequest, weights, urgentTypes);
  }, [simulatedRequest, weights, urgentTypes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addLeaveRequest({
      studentId,
      studentName,
      department,
      section,
      year: 'III Year',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
      reasonType,
      reasonDetails,
      startDate,
      endDate,
      totalDays: Number(totalDays),
      proofRequired: hasUploadedProof,
      proof: hasUploadedProof ? {
        fileName,
        fileSize: '1.2 MB',
        strengthScore: proofStrengthScore,
        nameMatch: 'Strong',
        dateMatch: 'Strong',
        reasonMatch: 'Strong',
        completeness: 'High',
        extractedText: `Document: ${fileName} | Student: ${studentName} | Reason: ${reasonType}`,
        aiConfidence: '97.4%'
      } : null,
      attendance: {
        current: Number(currentAtt),
        projected: projectedAtt,
        threshold: 75.0,
        classesAffected: Number(classesAffected)
      },
      academic: {
        cgpa: Number(cgpa),
        github: github !== '' ? Number(github) : null,
        leetcode: leetcode !== '' ? Number(leetcode) : null
      },
      leaveHistory: {
        totalDaysThisMonth: 1,
        unusualPattern: false,
        score: 90
      }
    });

    onClose();
  };

  const handleSimulatedFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setHasUploadedProof(true);
      setProofStrengthScore(94);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Apply for Leave</h2>
              <p className="text-xs text-slate-400">
                Submit request with real-time AI Priority Queue preview
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Grid */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
            
            {/* Left 7 Cols: Inputs */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Student Personal Info Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Student Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Roll No / Student ID</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Leave Reason Type */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Leave Reason Category:
                </label>
                <select
                  value={reasonType}
                  onChange={(e) => setReasonType(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-indigo-300 font-semibold p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Medical Emergency">Medical Emergency ⚡ (Urgent)</option>
                  <option value="Placement / Interview">Placement / Interview ⚡ (Urgent)</option>
                  <option value="Family Emergency">Family Emergency ⚡ (Urgent)</option>
                  <option value="Official Academic Event">Official Academic Event ⚡ (Urgent)</option>
                  <option value="Government Examination">Government Examination ⚡ (Urgent)</option>
                  <option value="Competition">Competition / Hackathon</option>
                  <option value="Internship">Internship / Field Work</option>
                  <option value="Sports Event">Sports Event</option>
                  <option value="Personal Leave">Personal Leave</option>
                </select>
              </div>

              {/* Reason Details */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Reason Explanation Details:
                </label>
                <textarea
                  rows={3}
                  required
                  value={reasonDetails}
                  onChange={(e) => setReasonDetails(e.target.value)}
                  placeholder="Provide clear, authentic details supporting your leave request..."
                  className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Dates & Duration */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Total Days</label>
                  <input
                    type="number"
                    min={1}
                    value={totalDays}
                    onChange={(e) => setTotalDays(e.target.value)}
                    className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Attendance Inputs */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-indigo-400" /> Attendance Metrics
                  </span>
                  <span className="text-[11px] text-slate-400">Projected: {projectedAtt}%</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Current Attendance (%)</span>
                    <input
                      type="number"
                      step="0.1"
                      min="40"
                      max="100"
                      value={currentAtt}
                      onChange={(e) => setCurrentAtt(e.target.value)}
                      className="w-full bg-slate-900 text-xs text-white p-2 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Classes Affected</span>
                    <input
                      type="number"
                      min="1"
                      value={classesAffected}
                      onChange={(e) => setClassesAffected(e.target.value)}
                      className="w-full bg-slate-900 text-xs text-white p-2 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Proof Document Simulator */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> Supporting Proof Document
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Simulated OCR Scanner</span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="px-3 py-2 text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/30 cursor-pointer flex items-center gap-1.5 transition">
                    <Upload className="w-4 h-4" /> Upload Document PDF/Image
                    <input type="file" onChange={handleSimulatedFileUpload} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-300 font-mono line-clamp-1">
                    {fileName}
                  </span>
                </div>
              </div>

              {/* Academic & Dev Profile (Optional Context) */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-indigo-400" /> Academic & Dev Profile
                  </span>
                  <span className="text-[10px] text-slate-400">(Non-Punitive)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">CGPA (0-10)</span>
                    <input
                      type="number"
                      step="0.01"
                      min="5"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      className="w-full bg-slate-900 text-xs text-white p-2 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">GitHub Score (Opt)</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="Optional"
                      className="w-full bg-slate-900 text-xs text-purple-300 p-2 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">LeetCode Score (Opt)</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={leetcode}
                      onChange={(e) => setLeetcode(e.target.value)}
                      placeholder="Optional"
                      className="w-full bg-slate-900 text-xs text-amber-300 p-2 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Real-Time Live Priority Score Predictor */}
            <div className="md:col-span-5 bg-slate-950 rounded-xl border border-indigo-500/30 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    LIVE PRIORITY ESTIMATOR
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Real-time
                  </span>
                </div>

                {/* Score Big Display */}
                <div className="text-center py-4 space-y-2">
                  <div className="inline-flex items-baseline gap-1 text-5xl font-black text-white font-mono">
                    <span>{livePriority.score}</span>
                    <span className="text-lg text-slate-500 font-sans font-normal">/100</span>
                  </div>
                  <div>
                    <PriorityBadge priority={livePriority} showDetails={false} />
                  </div>
                </div>

                {/* Simulated Breakdown */}
                <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Calculated Factor Weights:
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Urgency & Reason</span>
                    <span className="font-mono text-indigo-300">{livePriority.breakdown.reasonScore}/{livePriority.breakdown.reasonMax}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Proof Consistency</span>
                    <span className="font-mono text-indigo-300">{livePriority.breakdown.proofScore}/{livePriority.breakdown.proofMax}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Attendance Impact</span>
                    <span className="font-mono text-indigo-300">{livePriority.breakdown.attendanceScore}/{livePriority.breakdown.attendanceMax}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Academic Context</span>
                    <span className="font-mono text-indigo-300">{livePriority.breakdown.academicScore}/{livePriority.breakdown.academicMax}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Leave History</span>
                    <span className="font-mono text-indigo-300">{livePriority.breakdown.leaveHistoryScore}/{livePriority.breakdown.leaveHistoryMax}</span>
                  </div>
                </div>
              </div>

              {/* Informational Warning */}
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-200 space-y-1">
                <strong className="block text-white font-semibold">Queue Position Notice:</strong>
                Higher priority score places your request earlier in the Class Advisor's queue for fast review. Approval requires advisor inspection.
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center gap-2 transition hover:scale-105"
            >
              <Send className="w-4 h-4" /> Submit Application to Priority Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
