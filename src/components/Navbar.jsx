import React from 'react';
import { useLeave } from '../context/LeaveContext';
import { 
  Sparkles, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  Sliders, 
  PlusCircle, 
  Award,
  AlertOctagon,
  FileCheck2,
  Info
} from 'lucide-react';

export default function Navbar({ onOpenApply, onOpenAdmin, onOpenFairness }) {
  const { activeRole, setActiveRole, priorityStats } = useLeave();

  const roles = [
    { id: 'STUDENT', label: 'Student Portal', icon: GraduationCap, badge: 'Submit & Track' },
    { id: 'ADVISOR', label: 'Class Advisor', icon: UserCheck, badge: 'Step 1 Review' },
    { id: 'HOD', label: 'Head of Dept (HOD)', icon: Award, badge: 'Step 2 Review' },
    { id: 'VP', label: 'Vice Principal', icon: ShieldCheck, badge: 'Final Decision' },
    { id: 'ADMIN', label: 'Admin Hub', icon: Sliders, badge: 'Configure Rules' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
      {/* Top Disclaimer Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 px-4 py-1.5 border-b border-indigo-500/20 text-xs text-indigo-200/90 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          <span><strong className="text-white font-semibold">Queue Prioritization Engine:</strong> Priority score determines review order — it NEVER automatically approves requests.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <button 
            onClick={onOpenFairness}
            className="hover:text-indigo-300 transition flex items-center gap-1 underline underline-offset-2"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Non-Discrimination Fairness Rules
          </button>
        </div>
      </div>

      {/* Main Brand & Actions Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                INTELLIGENT LEAVE PRIORITY
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                AI Queue v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Transparent 0–100 Priority Scoring for Advisor, HOD & VP Queues
            </p>
          </div>
        </div>

        {/* Global Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenApply}
            className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg shadow-lg shadow-indigo-600/30 border border-indigo-400/30 flex items-center gap-2 transition hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Apply for Leave
          </button>

          <button
            onClick={onOpenAdmin}
            className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
            title="Configure Algorithm Weights & Priority Thresholds"
          >
            <Sliders className="w-4 h-4 text-indigo-400" /> Admin Config
          </button>
        </div>
      </div>

      {/* Role Navigation Bar */}
      <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto py-0.5 no-scrollbar">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-2 flex items-center gap-1">
              Switch Role:
            </span>
            {roles.map(role => {
              const Icon = role.icon;
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-200 border border-indigo-500/40 shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{role.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {role.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Counter Summary Pills */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-1.5" title="Critical Priority Requests">
              <AlertOctagon className="w-3 h-3 text-rose-400" />
              <span className="font-extrabold">{priorityStats.CRITICAL}</span>
              <span className="text-[10px] uppercase font-sans text-rose-300/80">Critical</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-1.5" title="High Priority Requests">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="font-extrabold">{priorityStats.HIGH}</span>
              <span className="text-[10px] uppercase font-sans text-amber-300/80">High</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5" title="Total Pending Requests">
              <FileCheck2 className="w-3 h-3 text-indigo-400" />
              <span className="font-bold">{priorityStats.TOTAL_PENDING}</span>
              <span className="text-[10px] uppercase font-sans text-slate-400">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
