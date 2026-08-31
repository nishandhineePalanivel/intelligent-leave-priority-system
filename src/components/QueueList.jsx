import React from 'react';
import { useLeave } from '../context/LeaveContext';
import RequestCard from './RequestCard';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  SlidersHorizontal, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  Info,
  RotateCcw
} from 'lucide-react';

export default function QueueList({ onInspectRequest }) {
  const {
    filteredRequests,
    activeRole,
    searchTerm,
    setSearchTerm,
    selectedPriority,
    setSelectedPriority,
    selectedLeaveType,
    setSelectedLeaveType,
    selectedAttendanceRisk,
    setSelectedAttendanceRisk,
    sortBy,
    setSortBy,
    resetToDefault
  } = useLeave();

  // Group requests by priority level for structured priority queue view
  const groupedQueue = {
    CRITICAL: filteredRequests.filter(r => r.calculatedPriority.levelKey === 'CRITICAL'),
    HIGH: filteredRequests.filter(r => r.calculatedPriority.levelKey === 'HIGH'),
    NORMAL: filteredRequests.filter(r => r.calculatedPriority.levelKey === 'NORMAL'),
    LOW: filteredRequests.filter(r => r.calculatedPriority.levelKey === 'LOW'),
    REVIEW_WHEN_AVAILABLE: filteredRequests.filter(r => r.calculatedPriority.levelKey === 'REVIEW_WHEN_AVAILABLE'),
  };

  const levelConfigs = [
    { key: 'CRITICAL', title: 'CRITICAL PRIORITY (90–100)', color: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-500/10', icon: AlertOctagon },
    { key: 'HIGH', title: 'HIGH PRIORITY (75–89)', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10', icon: AlertTriangle },
    { key: 'NORMAL', title: 'NORMAL PRIORITY (50–74)', color: 'text-blue-400', border: 'border-blue-500/40', bg: 'bg-blue-500/10', icon: Clock },
    { key: 'LOW', title: 'LOW PRIORITY (25–49)', color: 'text-slate-300', border: 'border-slate-500/40', bg: 'bg-slate-500/10', icon: CheckCircle2 },
    { key: 'REVIEW_WHEN_AVAILABLE', title: 'REVIEW WHEN AVAILABLE (0–24)', color: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Priority vs Approval Core Rule Banner */}
      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-black tracking-wide text-white uppercase flex items-center gap-2">
              <span>PRIORITY QUEUE WORKFLOW ENGINE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                FAIRNESS ENFORCED
              </span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Requests are ordered by <strong>AI Priority Score (0–100)</strong> so authority officers review critical cases first.
              <span className="text-amber-300 font-bold block mt-0.5">
                ⚠️ A high priority score NEVER automatically approves a request. Human authorization is strictly required at each approval step.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by student name, ID, or leave reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 text-xs text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" /> Sort Queue By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 text-xs text-indigo-200 font-semibold px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="SCORE_DESC">Priority Score (Highest First)</option>
              <option value="URGENCY_FIRST">Urgent Override First ⚡</option>
              <option value="TIME_ASC">Submission Time (Oldest First)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs no-scrollbar flex-wrap">
          <div className="flex items-center gap-1 text-slate-400 shrink-0 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-500" /> Filters:
          </div>

          {/* Priority Level Selector */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-950 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Priority Levels</option>
            <option value="CRITICAL">🔴 Critical Priority (90-100)</option>
            <option value="HIGH">🟠 High Priority (75-89)</option>
            <option value="NORMAL">🟡 Normal Priority (50-74)</option>
            <option value="LOW">🟢 Low Priority (25-49)</option>
            <option value="REVIEW_WHEN_AVAILABLE">⚪ Review When Available (0-24)</option>
          </select>

          {/* Leave Type Selector */}
          <select
            value={selectedLeaveType}
            onChange={(e) => setSelectedLeaveType(e.target.value)}
            className="bg-slate-950 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Leave Types</option>
            <option value="Medical Emergency">Medical Emergency</option>
            <option value="Placement / Interview">Placement / Interview</option>
            <option value="Family Emergency">Family Emergency</option>
            <option value="Official Academic Event">Official Academic Event</option>
            <option value="Personal Leave">Personal Leave</option>
          </select>

          {/* Attendance Risk Selector */}
          <select
            value={selectedAttendanceRisk}
            onChange={(e) => setSelectedAttendanceRisk(e.target.value)}
            className="bg-slate-950 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Attendance Risks</option>
            <option value="HIGH">High Risk (&lt;75% projected)</option>
            <option value="MODERATE">Moderate Risk (75-80%)</option>
            <option value="LOW">Low Risk (&gt;80%)</option>
          </select>

          <button
            onClick={resetToDefault}
            className="ml-auto text-slate-400 hover:text-white transition flex items-center gap-1 text-xs"
            title="Reset Filters and Sample Data"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset View
          </button>
        </div>
      </div>

      {/* Prioritized Queue List grouped by level */}
      <div className="space-y-6">
        {filteredRequests.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No requests match active filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query, priority filter, or attendance risk criteria.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedPriority('ALL'); setSelectedLeaveType('ALL'); setSelectedAttendanceRisk('ALL'); }}
              className="px-4 py-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          levelConfigs.map(level => {
            const list = groupedQueue[level.key];
            if (list.length === 0 && selectedPriority !== 'ALL') return null;
            if (list.length === 0) return null;

            const Icon = level.icon;

            return (
              <div key={level.key} className="space-y-3">
                {/* Level Group Header */}
                <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${level.border} ${level.bg}`}>
                  <div className="flex items-center gap-2 font-bold text-xs tracking-wider uppercase">
                    <Icon className={`w-4 h-4 ${level.color}`} />
                    <span className={level.color}>{level.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950/80 text-white">
                    {list.length} {list.length === 1 ? 'request' : 'requests'}
                  </span>
                </div>

                {/* Cards in level */}
                <div className="grid grid-cols-1 gap-4">
                  {list.map(req => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      onInspect={onInspectRequest}
                      activeRole={activeRole}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
