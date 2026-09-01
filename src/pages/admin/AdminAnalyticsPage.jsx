import React from 'react';
import AnalyticsView from '../../components/AnalyticsView';
import { BarChart2, Sparkles } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Institutional Data Analytics</span>
          </div>
          <h1 className="text-xl font-black text-white">Leave System Analytics & Trends</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time metrics connected to backend database storage.</p>
        </div>
      </div>

      <AnalyticsView />
    </div>
  );
}
