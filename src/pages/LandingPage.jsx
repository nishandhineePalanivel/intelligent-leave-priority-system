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
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import FairnessPolicyModal from '../components/FairnessPolicyModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isFairnessOpen, setIsFairnessOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Top Banner Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-blue-900 font-sans">
                INTELLIGENT LEAVE PRIORITY SYSTEM
              </h1>
              <p className="text-xs text-blue-600 font-bold">
                Enterprise Educational ERP Solution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFairnessOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-700 font-semibold transition px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Fairness Policy</span>
            </button>

            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition flex items-center gap-2"
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-6 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Smart, Transparent & Efficient Leave Management</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Next-Generation <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">College Leave Management</span> & Intelligent Priority Platform
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Evaluate student leave requests using structured academic metrics, urgency factors, attendance protection thresholds, and verified tech profile insights in a crisp Blue and White ERP interface.
          </p>

          {/* Role Direct Action Buttons */}
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap max-w-xl mx-auto">
            <button
              onClick={() => navigate('/login?role=STUDENT')}
              className="flex-1 min-w-[160px] px-5 py-4 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl shadow-md transition text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <GraduationCap className="w-6 h-6 text-blue-600 group-hover:scale-110 transition" />
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
              </div>
              <p className="text-sm font-bold text-slate-900">Student Portal</p>
              <p className="text-xs text-slate-500">Register, apply & track status</p>
            </button>

            <button
              onClick={() => navigate('/login?role=STAFF')}
              className="flex-1 min-w-[160px] px-5 py-4 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl shadow-md transition text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <UserCheck className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition" />
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
              </div>
              <p className="text-sm font-bold text-slate-900">Staff Portal</p>
              <p className="text-xs text-slate-500">Review prioritized queue</p>
            </button>

            <button
              onClick={() => navigate('/login?role=ADMINISTRATOR')}
              className="flex-1 min-w-[160px] px-5 py-4 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl shadow-md transition text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <Sliders className="w-6 h-6 text-rose-600 group-hover:scale-110 transition" />
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition" />
              </div>
              <p className="text-sm font-bold text-slate-900">Admin Portal</p>
              <p className="text-xs text-slate-500">Users, rules & analytics</p>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-blue-600" /> bcrypt Password Security</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Role-Based Access Control</span>
            <span className="flex items-center gap-1.5"><BrainCircuit className="w-3.5 h-3.5 text-indigo-600" /> Transparent 5-Factor Scoring</span>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Designed for Institutional Excellence</h2>
              <p className="text-sm text-slate-600 mt-2">Comprehensive leave management workflow engineered for students, faculty, and administrators.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-blue-300 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Intelligent Prioritization</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Evaluates reason urgency, document strength, projected attendance impact, academic standing, and leave frequency to score requests from 0–100.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-blue-300 transition">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Student Tech Insights</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect student GitHub and LeetCode activity as supporting non-punitive evidence for placement or hackathon leave requests.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-blue-300 transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Role-Based Access</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Strict authorization enforcing distinct access scopes for Students, Staff Advisors/HODs, and Administrators.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-blue-300 transition">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Analytics & Audit Log</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time database charts, department leave distributions, approval rate trends, and immutable institutional audit logs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Non-Punitive Notice Banner */}
        <section className="py-10 max-w-5xl mx-auto px-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-900 font-bold text-sm mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Decision Support Disclaimer</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl mx-auto">
              The Intelligent Priority Score serves purely as a decision-support and queue sorting tool. Priority score determines review ordering so urgent requests are seen first — final leave approvals rest exclusively with authorized human faculty and administrators.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <p>© 2026 Intelligent Leave Priority System — Modern Blue & White ERP Platform.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsFairnessOpen(true)} className="hover:text-slate-900 font-semibold">Fairness Policy</button>
            <Link to="/login" className="hover:text-blue-700 font-bold text-blue-600">Portal Login</Link>
          </div>
        </div>
      </footer>

      {isFairnessOpen && (
        <FairnessPolicyModal onClose={() => setIsFairnessOpen(false)} />
      )}
    </div>
  );
}
