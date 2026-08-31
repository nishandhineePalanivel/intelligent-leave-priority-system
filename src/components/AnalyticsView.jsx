import React from 'react';
import { useLeave } from '../context/LeaveContext';
import { BarChart3, PieChart, TrendingUp, AlertOctagon, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AnalyticsView() {
  const { requests, priorityStats } = useLeave();

  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const pendingCount = priorityStats.TOTAL_PENDING;

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Requests</span>
          <span className="text-2xl font-mono font-black text-white">{requests.length}</span>
          <span className="text-[10px] text-slate-500 block">Across all departments</span>
        </div>

        <div className="bg-slate-900/80 border border-rose-500/30 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" /> Critical Priority
          </span>
          <span className="text-2xl font-mono font-black text-rose-300">{priorityStats.CRITICAL}</span>
          <span className="text-[10px] text-slate-400 block">Immediate advisor review</span>
        </div>

        <div className="bg-slate-900/80 border border-amber-500/30 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">High Priority</span>
          <span className="text-2xl font-mono font-black text-amber-300">{priorityStats.HIGH}</span>
          <span className="text-[10px] text-slate-400 block">Review next in queue</span>
        </div>

        <div className="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Approved Leaves</span>
          <span className="text-2xl font-mono font-black text-emerald-300">{approvedCount}</span>
          <span className="text-[10px] text-slate-400 block">Human authorization recorded</span>
        </div>
      </div>

      {/* Visual Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Priority Level Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            Queue Priority Distribution
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-rose-400 font-semibold">Critical Priority (90-100)</span>
                <span className="font-mono text-white">{priorityStats.CRITICAL}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full" style={{ width: `${(priorityStats.CRITICAL / (requests.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-amber-400 font-semibold">High Priority (75-89)</span>
                <span className="font-mono text-white">{priorityStats.HIGH}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: `${(priorityStats.HIGH / (requests.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-blue-400 font-semibold">Normal Priority (50-74)</span>
                <span className="font-mono text-white">{priorityStats.NORMAL}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${(priorityStats.NORMAL / (requests.length || 1)) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400 font-semibold">Low Priority (25-49)</span>
                <span className="font-mono text-white">{priorityStats.LOW}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full" style={{ width: `${(priorityStats.LOW / (requests.length || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* System Efficiency Spotlight */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Queue Efficiency Metrics
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block">Avg. Response Time for Medical Emergencies</strong>
                <span className="text-[11px] text-slate-400">Prioritized at top of queue</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">~ 18 mins</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block">Proof Match Success Rate</strong>
                <span className="text-[11px] text-slate-400">AI OCR text consistency check</span>
              </div>
              <span className="font-mono font-bold text-indigo-400 text-sm">94.8%</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white block">Attendance Threshold Safeguard</strong>
                <span className="text-[11px] text-slate-400">Flags requests dropping below 75%</span>
              </div>
              <span className="font-mono font-bold text-amber-400 text-sm">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
