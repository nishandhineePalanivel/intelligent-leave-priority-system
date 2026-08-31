import React from 'react';
import { ShieldCheck, X, Check, AlertTriangle, Scale, Lock, HeartHandshake } from 'lucide-react';

export default function FairnessPolicyModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>INSTITUTIONAL FAIRNESS & NON-DISCRIMINATION POLICY</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ENFORCED
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Systemic safeguards ensuring unbiased, equal-access leave queue prioritization
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

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-300">
          
          {/* Rule 1: Zero Discrimination */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              1. Strict Protection Against Sensitive Characteristics
            </h3>
            <p className="text-slate-300 leading-relaxed">
              The priority algorithm is strictly forbidden from ingesting, evaluating, or weighting any sensitive personal characteristics including:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Religion', 'Caste', 'Gender', 'Disability', 'Financial Status', 'Political Views', 'Family Background', 'Socioeconomic Status'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold text-[11px]">
                  🚫 No {tag} Tracking
                </span>
              ))}
            </div>
          </div>

          {/* Rule 2: Non-Punitive Academic & Dev Context */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-indigo-400" />
              2. Non-Punitive GitHub & LeetCode Policy
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Academic and development consistency (CGPA, GitHub, LeetCode) serves <strong>only as supporting context</strong>.
            </p>
            <ul className="space-y-1 text-slate-300 list-disc list-inside bg-slate-900 p-3 rounded-lg border border-slate-800">
              <li>High GitHub/LeetCode score does <strong>NOT</strong> cause automatic leave approval.</li>
              <li>Low GitHub/LeetCode score does <strong>NOT</strong> result in rejection or low priority.</li>
              <li>A student without GitHub or LeetCode accounts receives neutral scoring based on CGPA, ensuring they reach <strong>CRITICAL or HIGH PRIORITY</strong> whenever medical, academic, or family urgency warrants it.</li>
            </ul>
          </div>

          {/* Rule 3: Priority vs Approval Firewall */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-500/30 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              3. Priority Queue vs Human Approval Firewall
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-indigo-300 uppercase font-mono block">PRIORITY ENGINE</strong>
                <p className="text-slate-400 text-[11px]">
                  Determines <em>"Which pending request should the Class Advisor, HOD, or VP open and inspect first?"</em>
                </p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-emerald-300 uppercase font-mono block">HUMAN AUTHORIZATION</strong>
                <p className="text-slate-400 text-[11px]">
                  Determines <em>"Should this leave be officially granted?"</em> Requires explicit human approval step by step.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Institutional Audit Status: <strong className="text-emerald-400">100% Compliant</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
          >
            Close Policy Window
          </button>
        </div>
      </div>
    </div>
  );
}
