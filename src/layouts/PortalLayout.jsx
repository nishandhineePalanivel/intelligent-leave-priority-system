import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLeave } from '../context/LeaveContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  User, 
  PlusCircle, 
  FileText, 
  History, 
  CheckSquare, 
  GraduationCap, 
  Code2, 
  Binary, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Users, 
  ListFilter, 
  ShieldCheck, 
  BarChart2, 
  FileSpreadsheet, 
  Building2, 
  UserCheck, 
  Sliders
} from 'lucide-react';
import FairnessPolicyModal from '../components/FairnessPolicyModal';

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const { notifications } = useLeave();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFairnessOpen, setIsFairnessOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const role = user?.role || 'STUDENT';
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (role === 'STUDENT') {
      return [
        { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { label: 'My Profile', path: '/student/profile', icon: User },
        { label: 'Apply Leave', path: '/student/apply', icon: PlusCircle },
        { label: 'My Applications', path: '/student/applications', icon: FileText },
        { label: 'Leave History', path: '/student/history', icon: History },
        { label: 'Attendance', path: '/student/attendance', icon: CheckSquare },
        { label: 'Academic Performance', path: '/student/academics', icon: GraduationCap },
        { label: 'GitHub Analysis', path: '/student/github', icon: Code2 },
        { label: 'LeetCode Analysis', path: '/student/leetcode', icon: Binary },
        { label: 'Notifications', path: '/student/notifications', icon: Bell, badge: unreadNotifsCount },
        { label: 'Settings', path: '/student/settings', icon: Settings },
      ];
    } else if (role === 'STAFF' || role === 'VICE_PRINCIPAL') {
      return [
        { label: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
        { label: 'Leave Requests', path: '/staff/requests', icon: FileText },
        { label: 'Priority Queue', path: '/staff/queue', icon: ListFilter },
        { label: 'Student Directory', path: '/staff/students', icon: Users },
        { label: 'Student Profiles', path: '/staff/profiles', icon: GraduationCap },
        { label: 'Attendance Protection', path: '/staff/attendance', icon: CheckSquare },
        { label: 'Notifications', path: '/staff/notifications', icon: Bell, badge: unreadNotifsCount },
        { label: 'Settings', path: '/staff/settings', icon: Settings },
      ];
    } else {
      // ADMINISTRATOR
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'All Leave Requests', path: '/admin/requests', icon: FileText },
        { label: 'Priority Queue', path: '/admin/queue', icon: ListFilter },
        { label: 'Students', path: '/admin/students', icon: GraduationCap },
        { label: 'Staff & Faculty', path: '/admin/staff', icon: UserCheck },
        { label: 'Departments', path: '/admin/departments', icon: Building2 },
        { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
        { label: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldCheck },
        { label: 'System Settings', path: '/admin/settings', icon: Sliders },
      ];
    }
  };

  const navItems = getNavItems();

  const getRoleBadgeStyle = () => {
    if (role === 'STUDENT') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (role === 'STAFF') return 'bg-purple-100 text-purple-800 border-purple-200';
    if (role === 'VICE_PRINCIPAL') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col lg:flex-row selection:bg-blue-600 selection:text-white">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-blue-900 border-b border-blue-800 p-4 flex items-center justify-between sticky top-0 z-40 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-tight">LEAVE PRIORITY ERP</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-blue-800 text-white hover:bg-blue-700"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 text-white
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Sidebar Header Branding */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-2 ring-white/20 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xs font-black tracking-tight text-white uppercase">
                LEAVE PRIORITY ERP
              </h1>
              <span className={`inline-block px-2 py-0.5 mt-1 text-[9px] font-extrabold uppercase tracking-widest border rounded-full ${getRoleBadgeStyle()}`}>
                {role.replace('_', ' ')} PORTAL
              </span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/30"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-blue-300 font-mono truncate">{user?.department || user?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge) && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setIsFairnessOpen(true)}
            className="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Fairness Guarantee</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex sticky top-0 z-30 bg-white border-b border-slate-200 px-8 py-3.5 items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold font-mono">
            <span className="text-blue-700 uppercase">{role.replace('_', ' ')} PORTAL</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 capitalize">{location.pathname.split('/')[2] || 'Dashboard'}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFairnessOpen(true)}
              className="text-xs text-slate-600 hover:text-blue-700 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Non-Punitive AI Guarantee</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 relative transition"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 text-slate-900">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                    <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                    <span className="text-[10px] text-blue-600 font-bold">{notifications.length} total</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                    {notifications.length === 0 ? (
                      <p className="text-slate-500 text-center py-4">No recent notifications.</p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <p className="font-bold text-slate-900 text-[11px]">{n.title}</p>
                          <p className="text-slate-600 text-[10px] mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {isFairnessOpen && (
        <FairnessPolicyModal onClose={() => setIsFairnessOpen(false)} />
      )}
    </div>
  );
}
