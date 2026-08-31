import React from 'react';
import { Zap, AlertOctagon, AlertTriangle, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function PriorityBadge({ priority, showDetails = false, size = 'md' }) {
  if (!priority) return null;

  const { score, levelKey, levelLabel, levelColor, isUrgent } = priority;

  const colorStyles = {
    rose: {
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-rose-950/20',
      badgeBg: 'bg-rose-500 text-white',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
      icon: AlertOctagon,
    },
    amber: {
      bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-950/20',
      badgeBg: 'bg-amber-500 text-white',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
      icon: AlertTriangle,
    },
    blue: {
      bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30 shadow-blue-950/20',
      badgeBg: 'bg-blue-500 text-white',
      glow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]',
      icon: Clock,
    },
    slate: {
      bg: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      badgeBg: 'bg-slate-600 text-white',
      glow: '',
      icon: CheckCircle2,
    },
    emerald: {
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      badgeBg: 'bg-emerald-600 text-white',
      glow: '',
      icon: ShieldCheck,
    },
  };

  const currentStyle = colorStyles[levelColor] || colorStyles.blue;
  const IconComponent = currentStyle.icon;

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-1.5">
        {isUrgent && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-black rounded flex items-center gap-0.5 animate-pulse">
            <Zap className="w-2.5 h-2.5 fill-current" /> URGENT
          </span>
        )}
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${currentStyle.bg} flex items-center gap-1`}>
          <span className="font-bold">{score}/100</span> — {levelLabel.split(' ')[0]}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        {isUrgent && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-md shadow-md animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-slate-950" /> ⚡ URGENT REQUEST
          </div>
        )}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm tracking-wide ${currentStyle.bg} ${currentStyle.glow}`}>
          <IconComponent className="w-4 h-4" />
          <span className="text-lg font-black">{score}</span>
          <span className="text-xs opacity-75">/100</span>
          <span className="mx-1 opacity-40">|</span>
          <span className="text-xs font-sans uppercase font-extrabold tracking-wider">{levelLabel}</span>
        </div>
      </div>
      {showDetails && (
        <span className="text-[11px] text-slate-400 font-medium">
          Priority score determines review queue order (not approval decision).
        </span>
      )}
    </div>
  );
}
