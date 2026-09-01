import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS, api } from '../services/api';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  UserCheck, 
  GraduationCap, 
  Sliders, 
  Building2,
  AlertCircle, 
  ArrowRight,
  KeyRound,
  X,
  RotateCcw,
  User,
  Info
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user } = useAuth();

  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(searchParams.get('role') || 'STUDENT');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  useEffect(() => {
    const qRole = searchParams.get('role');
    if (qRole && ['STUDENT', 'STAFF', 'VICE_PRINCIPAL', 'ADMINISTRATOR'].includes(qRole.toUpperCase())) {
      setRole(qRole.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'STAFF' || user.role === 'VICE_PRINCIPAL') navigate('/staff/dashboard');
      else if (user.role === 'ADMINISTRATOR') navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identity.trim() || !password) {
      setErrorMsg('Please manually enter your Email or Register Number and Password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(identity, password, role);
      if (!res || !res.user) {
        throw new Error('Authentication failed.');
      }
      const userRole = res.user.role;

      if (userRole === 'STUDENT') navigate('/student/dashboard');
      else if (userRole === 'STAFF' || userRole === 'VICE_PRINCIPAL') navigate('/staff/dashboard');
      else if (userRole === 'ADMINISTRATOR') navigate('/admin/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials or role mismatch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFields = () => {
    setIdentity('');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('Fields cleared.');
  };

  const handleClearAllData = () => {
    api.clearAllData();
    setIdentity('');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('System local cache & session tokens cleared successfully.');
  };

  const handleFillAccount = (userEmail) => {
    const found = DEMO_USERS.find(u => u.email === userEmail);
    if (found) {
      setIdentity(found.email);
      setPassword(found.password);
      setRole(found.role);
      setErrorMsg('');
      setSuccessMsg(`Autofilled credentials for ${found.name} (${found.role})`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Ambient background blur */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-600 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-3 ring-1 ring-white/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            INTELLIGENT LEAVE PRIORITY SYSTEM
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Manual Portal Login for Student, Staff, VP & Admin
          </p>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Manual Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Identity Field */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email / Register Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="Enter Email (e.g. student@college.edu)"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Portal Access Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer font-medium"
            >
              <option value="STUDENT">🎓 Student Portal</option>
              <option value="STAFF">👨‍🏫 Staff / Class Advisor Portal</option>
              <option value="VICE_PRINCIPAL">🏛️ Vice Principal / HOD Portal</option>
              <option value="ADMINISTRATOR">👑 Administrator Portal</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleClearFields}
              className="px-4 py-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              title="Clear input fields"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Clear</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>MANUAL SIGN IN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Clear Data & Quick Helper Toggle */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleClearAllData}
            className="text-rose-400 hover:text-rose-300 font-bold transition flex items-center gap-1 text-[11px]"
          >
            <RotateCcw className="w-3 h-3 text-rose-400" /> Clear Local Data & Session
          </button>

          <button
            type="button"
            onClick={() => setShowDemoSelector(!showDemoSelector)}
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition text-[11px]"
          >
            {showDemoSelector ? 'Hide Account List' : 'View Sample Credentials'}
          </button>
        </div>

        {/* Optional Drawer for Sample Credentials */}
        {showDemoSelector && (
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
            <p className="font-bold text-white text-[11px] font-sans">Sample Accounts for Manual Testing:</p>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center justify-between">
                <span>Student (Arun): <strong className="text-indigo-400">student@college.edu</strong> / <strong className="text-indigo-400">Student@123</strong></span>
                <button onClick={() => handleFillAccount('student@college.edu')} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300">Fill</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Student (Bhavana): <strong className="text-indigo-400">bhavana@college.edu</strong> / <strong className="text-indigo-400">Student@123</strong></span>
                <button onClick={() => handleFillAccount('bhavana@college.edu')} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300">Fill</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Staff (Venkatesh): <strong className="text-purple-400">staff@college.edu</strong> / <strong className="text-purple-400">Staff@123</strong></span>
                <button onClick={() => handleFillAccount('staff@college.edu')} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-purple-300">Fill</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Vice Principal: <strong className="text-amber-400">vp@college.edu</strong> / <strong className="text-amber-400">Vp@123</strong></span>
                <button onClick={() => handleFillAccount('vp@college.edu')} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-300">Fill</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Administrator: <strong className="text-rose-400">admin@college.edu</strong> / <strong className="text-rose-400">Admin@123</strong></span>
                <button onClick={() => handleFillAccount('admin@college.edu')} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-rose-300">Fill</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-3">
            <button
              onClick={() => setIsForgotOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Password Help</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manual login uses your institution email/register number and password. Sample passwords:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <p>• Student: <span className="text-indigo-400">Student@123</span></p>
              <p>• Staff: <span className="text-purple-400">Staff@123</span></p>
              <p>• VP: <span className="text-amber-400">Vp@123</span></p>
              <p>• Admin: <span className="text-rose-400">Admin@123</span></p>
            </div>
            <button
              onClick={() => setIsForgotOpen(false)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
