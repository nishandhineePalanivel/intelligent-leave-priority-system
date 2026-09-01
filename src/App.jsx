import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeaveProvider } from './context/LeaveContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PortalLayout from './layouts/PortalLayout';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ApplyLeave from './pages/student/ApplyLeave';
import GitHubAnalysis from './pages/student/GitHubAnalysis';
import LeetCodeAnalysis from './pages/student/LeetCodeAnalysis';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

// Protected Route Guard Component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center font-mono text-xs">
        Authenticating institutional session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center">
            403
          </div>
          <h2 className="text-xl font-bold text-white">403 Unauthorized Access</h2>
          <p className="text-xs text-slate-400">
            Your account ({user.role}) does not have permission to access this portal section.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <LeaveProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Student Portal */}
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="apply" element={<ApplyLeave />} />
              <Route path="applications" element={<StudentDashboard />} />
              <Route path="history" element={<StudentDashboard />} />
              <Route path="attendance" element={<StudentDashboard />} />
              <Route path="academics" element={<StudentDashboard />} />
              <Route path="github" element={<GitHubAnalysis />} />
              <Route path="leetcode" element={<LeetCodeAnalysis />} />
              <Route path="notifications" element={<StudentDashboard />} />
              <Route path="settings" element={<StudentDashboard />} />
              <Route path="profile" element={<StudentDashboard />} />
            </Route>

            {/* Staff Portal */}
            <Route 
              path="/staff" 
              element={
                <ProtectedRoute allowedRoles={['STAFF']}>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="requests" element={<StaffDashboard />} />
              <Route path="queue" element={<StaffDashboard />} />
              <Route path="students" element={<StaffDashboard />} />
              <Route path="profiles" element={<StaffDashboard />} />
              <Route path="attendance" element={<StaffDashboard />} />
              <Route path="notifications" element={<StaffDashboard />} />
              <Route path="settings" element={<StaffDashboard />} />
            </Route>

            {/* Administrator Portal */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                  <PortalLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="requests" element={<AdminDashboard />} />
              <Route path="queue" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="students" element={<UserManagement />} />
              <Route path="staff" element={<UserManagement />} />
              <Route path="departments" element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="reports" element={<AdminAnalyticsPage />} />
              <Route path="audit-logs" element={<AuditLogsPage />} />
              <Route path="settings" element={<AdminDashboard />} />
            </Route>

            {/* Catch-all Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LeaveProvider>
    </AuthProvider>
  );
}
