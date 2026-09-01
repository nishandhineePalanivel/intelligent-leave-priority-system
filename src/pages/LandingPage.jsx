import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  Sliders, 
  ArrowRight, 
  BrainCircuit, 
  BarChart3, 
  Code2, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import FairnessPolicyModal from '../components/FairnessPolicyModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isFairnessOpen, setIsFairnessOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Banner */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white font-sans">
                INTELLIGENT LEAVE PRIORITY SYSTEM
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Enterprise Educational ERP Solution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFairnessOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition px-3 py-1.5 rounded-lg border border-slate-800 hover:border-indigo-500/30"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Fairness Policy</span>
            </button>

            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition flex items-center gap-2"
            >
              <span>Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Smart, Transparent & Efficient Leave Management</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Next-Generation <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">College Leave</span> & Prioritization Platform
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Evaluate student leave requests using structured academic metrics, urgency factors, attendance protection thresholds, and verified tech profile insights.
          </p>

          {/* Role Direct Action Buttons */}
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap max-w-xl mx-auto">
            <button
              onClick={() => navigate('/login?role=STUDENT')}
              className="flex-1 min-w-[160px] px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl shadow-xl transition text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition" />
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </div>
              <p className="text-sm font-bold text-white">Student Portal</p>
              <p className="text-xs text-slate-400">Apply & track status</p>
            </button>

            <button
              onClick={() => navigate('/login?role=STAFF')}
              className="flex-1 min-w-[160px] px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl shadow-xl transition text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <UserCheck className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </div>
              <p className="text-sm font-bold text-white">Staff Portal</p>
              <p className="text-xs text-slate-400">Review prioritized queue</p>
            </button>

            <button
              onClick={() => navigate('/login?role=ADMINISTRATOR')}
              className="flex-1 min-w-[160px] px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-rose-500/30 hover:border-rose-500/60 rounded-2xl shadow-xl transition text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <Sliders className="w-5 h-5 text-rose-400 group-hover:scale-110 transition" />
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </div>
              <p className="text-sm font-bold text-white">Admin Portal</p>
              <p className="text-xs text-slate-400">Users, rules & analytics</p>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-indigo-400" /> bcrypt Password Hashing</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Role-Based JWT Access</span>
            <span className="flex items-center gap-1.5"><BrainCircuit className="w-3.5 h-3.5 text-purple-400" /> Transparent 5-Factor Scoring</span>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-12 bg-slate-900/50 border-y border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Designed for Institutional Excellence</h2>
              <p className="text-sm text-slate-400 mt-2">Comprehensive leave management workflow engineered for students, faculty, and deans.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Intelligent Prioritization</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluates reason urgency, document strength, projected attendance impact, academic standing, and leave frequency to score requests from 0–100.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Student Tech Insights</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect student GitHub and LeetCode activity as supporting non-punitive evidence for placement or hackathon leave requests.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Role-Based Access</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict authorization enforcing distinct access scopes for Students, Staff Advisors/HODs, and Administrators.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Analytics & Audit Log</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time database charts, department leave distributions, approval rate trends, and immutable institutional audit logs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Non-Punitive Notice Banner */}
        <section className="py-10 max-w-5xl mx-auto px-4">
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-indigo-300 font-bold text-sm mb-2">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>Decision Support Disclaimer</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mx-auto">
              The Intelligent Priority Score serves purely as a decision-support and queue sorting tool. Priority score determines review ordering so urgent requests are seen first — final leave approvals rest exclusively with authorized human faculty and administrators.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <p>© 2026 Intelligent Leave Priority System — Modern Enterprise ERP Platform.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsFairnessOpen(true)} className="hover:text-slate-300">Fairness Policy</button>
            <Link to="/login" className="hover:text-slate-300 font-bold text-indigo-400">Portal Login</Link>
          </div>
        </div>
      </footer>

      {isFairnessOpen && (
        <FairnessPolicyModal onClose={() => setIsFairnessOpen(false)} />
      )}
    </div>
  );
}
