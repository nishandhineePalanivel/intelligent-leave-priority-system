import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Binary, 
  Search, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  BrainCircuit,
  Info,
  Trophy
} from 'lucide-react';

export default function LeetCodeAnalysis() {
  const { user } = useAuth();
  const [lcInput, setLcInput] = useState(user?.profile?.leetcodeUrl || 'neal_wu');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAnalysis = async (handleToFetch) => {
    if (!handleToFetch) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.getLeetCodeAnalysis(handleToFetch);
      setData(res);
      if (!res.available) {
        setErrorMsg(res.message || 'LeetCode analysis unavailable');
      }
    } catch (err) {
      setData({ available: false, message: 'LeetCode analysis unavailable' });
      setErrorMsg('LeetCode analysis unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(lcInput);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAnalysis(lcInput);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20 mb-2">
            <Binary className="w-3.5 h-3.5 text-purple-400" />
            <span>LeetCode Competitive Programming Insights</span>
          </div>
          <h1 className="text-xl font-black text-white">LeetCode Profile Analyzer</h1>
          <p className="text-xs text-slate-400 mt-0.5">Inspect problem-solving consistency across Easy, Medium, and Hard challenges.</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Binary className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={lcInput}
            onChange={(e) => setLcInput(e.target.value)}
            placeholder="Enter LeetCode Profile URL or Username (e.g. https://leetcode.com/u/username/)"
            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
        >
          {loading ? <span>Analyzing...</span> : <><Search className="w-4 h-4" /> <span>Analyze</span></>}
        </button>
      </form>

      {/* Non-Punitive Notice */}
      <div className="bg-purple-950/30 border border-purple-500/20 rounded-2xl p-4 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-white font-semibold">Non-Punitive Priority Guarantee:</strong> LeetCode ratings are strictly optional decision-support metrics. Students without active LeetCode profiles are evaluated neutrally without score deduction.
        </p>
      </div>

      {/* Results */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 font-mono text-xs">
          Fetching LeetCode metrics for '{lcInput}'...
        </div>
      ) : data && !data.available ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">LeetCode analysis unavailable</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {data.error || 'The profile username could not be reached.'}
          </p>
        </div>
      ) : data && data.available ? (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[10px] text-slate-400 font-mono uppercase">TOTAL SOLVED</span>
              <p className="text-3xl font-black text-white mt-1">{data.totalSolved}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[10px] text-emerald-400 font-mono uppercase">EASY PROBLEMS</span>
              <p className="text-3xl font-black text-emerald-400 mt-1">{data.easySolved}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[10px] text-amber-400 font-mono uppercase">MEDIUM PROBLEMS</span>
              <p className="text-3xl font-black text-amber-400 mt-1">{data.mediumSolved}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[10px] text-rose-400 font-mono uppercase">HARD PROBLEMS</span>
              <p className="text-3xl font-black text-rose-400 mt-1">{data.hardSolved}</p>
            </div>
          </div>

          {/* Breakdown Visualizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Problem Difficulty Distribution</span>
              </h3>
              <span className="text-xs font-mono text-purple-400">Ranking: {data.ranking}</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Easy ({data.easySolved})</span>
                  <span>{data.totalSolved > 0 ? Math.round((data.easySolved / data.totalSolved) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${data.totalSolved > 0 ? (data.easySolved / data.totalSolved) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Medium ({data.mediumSolved})</span>
                  <span>{data.totalSolved > 0 ? Math.round((data.mediumSolved / data.totalSolved) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${data.totalSolved > 0 ? (data.mediumSolved / data.totalSolved) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Hard ({data.hardSolved})</span>
                  <span>{data.totalSolved > 0 ? Math.round((data.hardSolved / data.totalSolved) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${data.totalSolved > 0 ? (data.hardSolved / data.totalSolved) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
