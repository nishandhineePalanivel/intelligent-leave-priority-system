import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Code2, 
  Search, 
  GitFork, 
  Star, 
  Users, 
  BookOpen, 
  Sparkles, 
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  BrainCircuit,
  Info
} from 'lucide-react';

export default function GitHubAnalysis() {
  const { user } = useAuth();
  const [githubInput, setGithubInput] = useState(user?.profile?.githubUrl || 'torvalds');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAnalysis = async (handleToFetch) => {
    if (!handleToFetch) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.getGitHubAnalysis(handleToFetch);
      setData(res);
      if (!res.available) {
        setErrorMsg(res.message || 'GitHub analysis unavailable');
      }
    } catch (err) {
      setData({ available: false, message: 'GitHub analysis unavailable' });
      setErrorMsg('GitHub analysis unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(githubInput);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAnalysis(githubInput);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>GitHub Profile & Technical Engagement</span>
          </div>
          <h1 className="text-xl font-black text-white">GitHub Profile Analyzer</h1>
          <p className="text-xs text-slate-400 mt-0.5">Inspect verified public GitHub metrics for academic prioritization context.</p>
        </div>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Code2 className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={githubInput}
            onChange={(e) => setGithubInput(e.target.value)}
            placeholder="Enter GitHub Profile URL or Username (e.g. https://github.com/torvalds)"
            className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
        >
          {loading ? <span>Analyzing...</span> : <><Search className="w-4 h-4" /> <span>Analyze</span></>}
        </button>
      </form>

      {/* Non-Punitive Notice */}
      <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-4 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-white font-semibold">Supporting Evidence Disclaimer:</strong> GitHub metrics provide supporting technical evidence for placement and hackathon leave requests. Low or missing GitHub activity is evaluated neutrally and never penalizes medical or personal leaves.
        </p>
      </div>

      {/* Results View */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 font-mono text-xs">
          Fetching GitHub API metrics for '{githubInput}'...
        </div>
      ) : data && !data.available ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">GitHub analysis unavailable</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {data.error || 'The profile URL could not be accessed or rate limited.'}
          </p>
        </div>
      ) : data && data.available ? (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
              <img
                src={data.avatarUrl}
                alt={data.username}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
              />
              <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-white truncate">{data.name}</h3>
                <a
                  href={data.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:underline inline-flex items-center gap-1 font-mono"
                >
                  @{data.username} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[10px] text-slate-400 font-mono uppercase">PUBLIC REPOSITORIES</span>
              <p className="text-2xl font-black text-white mt-1">{data.publicRepos}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[10px] text-slate-400 font-mono uppercase">FOLLOWERS / FOLLOWING</span>
              <p className="text-2xl font-black text-indigo-400 mt-1">{data.followers} <span className="text-xs text-slate-500">/ {data.following}</span></p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
              <span className="text-[10px] text-slate-400 font-mono uppercase">TECHNICAL SCORE</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{data.technicalScore}<span className="text-xs text-slate-500">/100</span></p>
            </div>
          </div>

          {/* Recent Repositories */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Recent Public Repositories</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recentRepos.map((repo, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-white text-xs hover:text-indigo-400 transition font-mono truncate"
                    >
                      {repo.name}
                    </a>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-mono border border-indigo-500/20">
                      {repo.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {repo.stars} stars</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-indigo-400" /> {repo.forks} forks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
