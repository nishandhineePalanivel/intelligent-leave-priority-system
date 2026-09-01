import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Code2, 
  Search, 
  GitFork, 
  Star, 
  BookOpen, 
  ExternalLink,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function GitHubAnalysis() {
  const { user } = useAuth();
  const [githubInput, setGithubInput] = useState(user?.profile?.githubUrl || 'torvalds');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async (handleToFetch) => {
    if (!handleToFetch) return;
    setLoading(true);

    try {
      const res = await api.getGitHubAnalysis(handleToFetch);
      setData(res);
    } catch (err) {
      setData({ available: false, message: 'GitHub analysis unavailable' });
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
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 mb-2">
            <Code2 className="w-3.5 h-3.5 text-blue-600" />
            <span>GitHub Profile & Technical Engagement</span>
          </div>
          <h1 className="text-xl font-black text-slate-900">GitHub Profile Analyzer</h1>
          <p className="text-xs text-slate-500 mt-0.5">Inspect verified public GitHub metrics for academic prioritization context.</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-4 flex items-center gap-3 shadow-xs">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Code2 className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={githubInput}
            onChange={(e) => setGithubInput(e.target.value)}
            placeholder="Enter GitHub Profile URL or Username (e.g. https://github.com/torvalds)"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-mono font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          {loading ? <span>Analyzing...</span> : <><Search className="w-4 h-4" /> <span>Analyze</span></>}
        </button>
      </form>

      {/* Non-Punitive Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong className="text-blue-900 font-bold">Supporting Evidence Disclaimer:</strong> GitHub metrics provide supporting technical evidence for placement and hackathon leave requests. Low or missing GitHub activity is evaluated neutrally and never penalizes medical or personal leaves.
        </p>
      </div>

      {/* Results View */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-mono text-xs shadow-xs">
          Fetching GitHub API metrics for '{githubInput}'...
        </div>
      ) : data && !data.available ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-xs">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-black text-slate-900">GitHub analysis unavailable</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {data.error || 'The profile URL could not be accessed or rate limited.'}
          </p>
        </div>
      ) : data && data.available ? (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-xs">
              <img
                src={data.avatarUrl}
                alt={data.username}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/30"
              />
              <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-slate-900 truncate">{data.name}</h3>
                <a
                  href={data.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-mono font-bold"
                >
                  @{data.username} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">PUBLIC REPOSITORIES</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{data.publicRepos}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">FOLLOWERS / FOLLOWING</span>
              <p className="text-2xl font-black text-blue-700 mt-1">{data.followers} <span className="text-xs text-slate-400">/ {data.following}</span></p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
              <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">TECHNICAL SCORE</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{data.technicalScore}<span className="text-xs text-slate-400">/100</span></p>
            </div>
          </div>

          {/* Recent Repositories */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Recent Public Repositories</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recentRepos.map((repo, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:border-blue-300 transition space-y-2">
                  <div className="flex items-center justify-between">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-700 text-xs hover:underline transition font-mono truncate"
                    >
                      {repo.name}
                    </a>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono border border-blue-200 font-bold">
                      {repo.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-600 font-mono">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> {repo.stars} stars</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-blue-600" /> {repo.forks} forks</span>
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
