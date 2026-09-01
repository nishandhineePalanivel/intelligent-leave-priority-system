import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  UserCheck, 
  GraduationCap, 
  Sliders, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  X
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user } = useAuth();

  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(searchParams.get('role') || 'STUDENT');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  useEffect(() => {
    // If query string role is updated
    const qRole = searchParams.get('role');
    if (qRole && ['STUDENT', 'STAFF', 'ADMINISTRATOR'].includes(qRole.toUpperCase())) {
      setRole(qRole.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'STAFF') navigate('/staff/dashboard');
      else if (user.role === 'ADMINISTRATOR') navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identity.trim() || !password) {
      setErrorMsg('Please enter your Email/Register Number and Password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(identity, password, role);
      const userRole = res.user.role;

      if (userRole === 'STUDENT') navigate('/student/dashboard');
      else if (userRole === 'STAFF') navigate('/staff/dashboard');
      else if (userRole === 'ADMINISTRATOR') navigate('/admin/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials or role mismatch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (demoRole) => {
    if (demoRole === 'STUDENT') {
      setIdentity('student@college.edu');
      setPassword('Student@123');
      setRole('STUDENT');
    } else if (demoRole === 'STAFF') {
      setIdentity('staff@college.edu');
      setPassword('Staff@123');
      setRole('STAFF');
    } else if (demoRole === 'ADMINISTRATOR') {
      setIdentity('admin@college.edu');
      setPassword('Admin@123');
      setRole('ADMINISTRATOR');
    }
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4 ring-1 ring-white/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            INTELLIGENT LEAVE PRIORITY SYSTEM
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Welcome Back — Institutional Portal Authentication
          </p>
        </div>

        {/* Error Notification Pill */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
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
                placeholder="e.g. student@college.edu or 21CS094"
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
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Portal Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer font-medium"
            >
              <option value="STUDENT">🎓 Student Portal</option>
              <option value="STAFF">👨‍🏫 Staff Portal (Advisor / HOD)</option>
              <option value="ADMINISTRATOR">👑 Administrator Portal</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Backend verifies that credentials strictly match the selected role.
            </p>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>SIGN IN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Switcher */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
            Demo Credentials Quick Fill
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('STUDENT')}
              className={`p-2 rounded-xl text-[11px] font-bold border transition text-center ${
                role === 'STUDENT'
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 mx-auto mb-1 text-indigo-400" />
              Student
            </button>

            <button
              type="button"
              onClick={() => fillDemo('STAFF')}
              className={`p-2 rounded-xl text-[11px] font-bold border transition text-center ${
                role === 'STAFF'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 mx-auto mb-1 text-purple-400" />
              Staff
            </button>

            <button
              type="button"
              onClick={() => fillDemo('ADMINISTRATOR')}
              className={`p-2 rounded-xl text-[11px] font-bold border transition text-center ${
                role === 'ADMINISTRATOR'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 mx-auto mb-1 text-rose-400" />
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => setIsForgotOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Password Recovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Password resets are managed by the institution Administrator.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 mb-4 font-mono">
              <p>Demo Password list:</p>
              <p>• Student: <span className="text-indigo-400 font-bold">Student@123</span></p>
              <p>• Staff: <span className="text-purple-400 font-bold">Staff@123</span></p>
              <p>• Admin: <span className="text-rose-400 font-bold">Admin@123</span></p>
            </div>
            <button
              onClick={() => setIsForgotOpen(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
