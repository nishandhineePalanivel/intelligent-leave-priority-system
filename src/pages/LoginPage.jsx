import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../services/api';
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
  ChevronDown,
  User
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
  const [selectedDemoUser, setSelectedDemoUser] = useState('');

  useEffect(() => {
    const qRole = searchParams.get('role');
    if (qRole && ['STUDENT', 'STAFF', 'VICE_PRINCIPAL', 'ADMINISTRATOR'].includes(qRole.toUpperCase())) {
      setRole(qRole.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'STAFF') navigate('/staff/dashboard');
      else if (user.role === 'VICE_PRINCIPAL') navigate('/staff/dashboard');
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

  const handleSelectDemoUser = (userEmail) => {
    setSelectedDemoUser(userEmail);
    const found = DEMO_USERS.find(u => u.email === userEmail);
    if (found) {
      setIdentity(found.email);
      setPassword(found.password);
      setRole(found.role);
      setErrorMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-600 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4 ring-1 ring-white/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            INTELLIGENT LEAVE PRIORITY SYSTEM
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Institutional Role-Based Single Sign-On
          </p>
        </div>

        {/* Quick Demo User Dropdown Selector */}
        <div className="mb-6 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-indigo-400">
            ⚡ Quick Demo Account Selector (Multiple Users)
          </label>
          <select
            value={selectedDemoUser}
            onChange={(e) => handleSelectDemoUser(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            <option value="">-- Choose Account to Quick Fill --</option>
            <optgroup label="🎓 Students">
              <option value="student@college.edu">Arun Kumar (student@college.edu)</option>
              <option value="bhavana@college.edu">Bhavana S (bhavana@college.edu)</option>
              <option value="chandran@college.edu">Chandran M (chandran@college.edu)</option>
              <option value="divya@college.edu">Divya K (divya@college.edu)</option>
              <option value="ezhil@college.edu">Ezhil R (ezhil@college.edu)</option>
            </optgroup>
            <optgroup label="👨‍🏫 Staff / Faculty">
              <option value="staff@college.edu">Prof. K. Venkatesh (staff@college.edu)</option>
              <option value="advisor.it@college.edu">Dr. M. Lakshmi (advisor.it@college.edu)</option>
            </optgroup>
            <optgroup label="🏛️ Vice Principal">
              <option value="vp@college.edu">Dr. A. Parthiban - VP (vp@college.edu)</option>
            </optgroup>
            <optgroup label="👑 Administrator">
              <option value="admin@college.edu">Dr. S. R. Ramanathan - Admin (admin@college.edu)</option>
            </optgroup>
          </select>
        </div>

        {/* Error Notification Pill */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
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
            <p className="text-[10px] text-slate-400 mt-1">
              Backend verifies that your account strictly matches the selected role.
            </p>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>SIGN IN TO PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
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
              Use the demo account selector on the login card to test any of the 8 pre-seeded student, staff, VP, and admin accounts.
            </p>
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
