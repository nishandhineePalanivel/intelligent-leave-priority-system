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
  CheckCircle2,
  User,
  UserPlus,
  BookOpen,
  Info
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, registerStudent, user } = useAuth();

  const [mode, setMode] = useState('LOGIN'); // 'LOGIN' or 'REGISTER'
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(searchParams.get('role') || 'STUDENT');

  // Registration Form state
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    registerNo: '',
    password: '',
    department: 'Computer Science & Engineering',
    section: 'CSE-A',
    year: 'III Year'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identity.trim() || !password) {
      setErrorMsg('Please enter your Email/Register Number and Password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(identity, password, role);
      if (!res || !res.user) throw new Error('Authentication failed.');
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regForm.name || !regForm.email || !regForm.password || !regForm.department) {
      setErrorMsg('Please fill in all required fields (Name, Email, Password, Department).');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await registerStudent(regForm);
      setSuccessMsg(`Registration successful for ${created.name} (${created.department})! You can now log in.`);
      setIdentity(created.email);
      setPassword(regForm.password);
      setRole('STUDENT');
      setMode('LOGIN');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Soft Blue background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-blue-900/10 relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3 ring-4 ring-blue-50">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">
            INTELLIGENT LEAVE PRIORITY SYSTEM
          </h2>
          <p className="text-xs text-blue-600 font-bold mt-1 uppercase tracking-wider">
            Institutional College ERP Portal
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'LOGIN' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('REGISTER'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'REGISTER' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register as Student</span>
          </button>
        </div>

        {/* Feedback Pills */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* MODE 1: MANUAL SIGN IN FORM */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Identity Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Register Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="e.g. student@college.edu or 21CS094"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition font-medium"
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Access Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition cursor-pointer font-bold"
              >
                <option value="STUDENT">🎓 Student Portal</option>
                <option value="STAFF">👨‍🏫 Staff / Class Advisor Portal</option>
                <option value="VICE_PRINCIPAL">🏛️ Vice Principal / HOD Portal</option>
                <option value="ADMINISTRATOR">👑 Administrator Portal</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>MANUAL PORTAL LOGIN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 2: STUDENT REGISTRATION FORM */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            {/* Student Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={regForm.name}
                onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                placeholder="e.g. Nishandhinee Palanivel"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
              />
            </div>

            {/* Email & Register No */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                  placeholder="student@college.edu"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Register Number
                </label>
                <input
                  type="text"
                  value={regForm.registerNo}
                  onChange={(e) => setRegForm({...regForm, registerNo: e.target.value})}
                  placeholder="e.g. 21CS094"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            {/* Department Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Academic Department *
              </label>
              <select
                value={regForm.department}
                onChange={(e) => setRegForm({...regForm, department: e.target.value})}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-bold cursor-pointer"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Set Password *
              </label>
              <input
                type="password"
                required
                value={regForm.password}
                onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
              />
            </div>

            {/* Register Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? <span>Registering...</span> : <span>REGISTER STUDENT ACCOUNT</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
