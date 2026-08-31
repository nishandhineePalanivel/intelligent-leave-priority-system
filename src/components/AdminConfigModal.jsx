import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import { Sliders, CheckCircle2, RotateCcw, X, Zap, ShieldCheck, Info } from 'lucide-react';

export default function AdminConfigModal({ onClose }) {
  const { weights, updateWeights, urgentTypes, toggleUrgentType, resetToDefault } = useLeave();

  const [localWeights, setLocalWeights] = useState({ ...weights });

  const totalSum = Object.values(localWeights).reduce((a, b) => Number(a) + Number(b), 0);

  const handleSliderChange = (key, val) => {
    setLocalWeights(prev => ({
      ...prev,
      [key]: Number(val)
    }));
  };

  const handleSave = () => {
    updateWeights(localWeights);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Admin Algorithm Controls</h2>
              <p className="text-xs text-slate-400">
                Configure factor weightages, urgent categories & priority thresholds
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Factor Weightings Sliders */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  1. Priority Score Factor Weights
                </h3>
                <p className="text-[11px] text-slate-400">Weights must equal 100% total</p>
              </div>
              <div className={`font-mono text-xs px-3 py-1 rounded-lg border font-bold ${
                totalSum === 100 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}>
                Total: {totalSum}% {totalSum === 100 ? '✓ Valid' : '⚠️ Must sum to 100%'}
              </div>
            </div>

            {/* Slider 1: Reason Urgency */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Reason Validity & Urgency</span>
                <span className="font-mono font-bold text-indigo-400">{localWeights.reasonUrgency}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={localWeights.reasonUrgency}
                onChange={(e) => handleSliderChange('reasonUrgency', e.target.value)}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 2: Proof Strength */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Proof Strength & Consistency</span>
                <span className="font-mono font-bold text-indigo-400">{localWeights.proofStrength}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={localWeights.proofStrength}
                onChange={(e) => handleSliderChange('proofStrength', e.target.value)}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Attendance Impact */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Attendance & Academic Impact</span>
                <span className="font-mono font-bold text-indigo-400">{localWeights.attendanceImpact}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                value={localWeights.attendanceImpact}
                onChange={(e) => handleSliderChange('attendanceImpact', e.target.value)}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 4: Academic Consistency */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Academic & Dev Consistency (Non-Punitive)</span>
                <span className="font-mono font-bold text-indigo-400">{localWeights.academicConsistency}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={localWeights.academicConsistency}
                onChange={(e) => handleSliderChange('academicConsistency', e.target.value)}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 5: Previous Leave Pattern */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-200">Previous Leave Pattern</span>
                <span className="font-mono font-bold text-indigo-400">{localWeights.leaveHistory}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                value={localWeights.leaveHistory}
                onChange={(e) => handleSliderChange('leaveHistory', e.target.value)}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Urgent Categories Overrides */}
          <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 fill-current" />
              2. Urgent Leave Overrides (⚡ Instant High Attention)
            </h3>
            <p className="text-xs text-slate-400">
              Selected categories trigger the ⚡ URGENT REQUEST flag for immediate review recommendation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              {[
                'Medical Emergency',
                'Placement / Interview',
                'Family Emergency',
                'Official Academic Event',
                'Government Examination',
                'Competition',
                'Internship',
                'Sports Event'
              ].map(typeName => {
                const isChecked = urgentTypes.includes(typeName);
                return (
                  <label
                    key={typeName}
                    onClick={() => toggleUrgentType(typeName)}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition ${
                      isChecked
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{typeName}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="accent-amber-500"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={resetToDefault}
            className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset Defaults
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              disabled={totalSum !== 100}
              onClick={handleSave}
              className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-lg flex items-center gap-2 transition ${
                totalSum === 100
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30 border border-indigo-400/30 hover:scale-105'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> Save & Recalculate Active Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
