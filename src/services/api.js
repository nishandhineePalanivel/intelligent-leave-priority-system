/**
 * Centralized API Service with Student Registration, Manual Authentication, 
 * Local persistence, and Clear Leave Applications List feature.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const DEMO_USERS = [
  // STUDENTS
  {
    id: 'STU001',
    registerNo: '21CS094',
    name: 'Arun Kumar',
    email: 'student@college.edu',
    password: 'Student@123',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    section: 'CSE-A',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    profile: {
      cgpa: 8.84,
      currentAttendance: 88.2,
      projectedAttendance: 85.1,
      thresholdAttendance: 75.0,
      githubUrl: 'https://github.com/torvalds',
      leetcodeUrl: 'https://leetcode.com/u/neal_wu/'
    }
  },
  {
    id: 'STU002',
    registerNo: '21CS112',
    name: 'Bhavana S',
    email: 'bhavana@college.edu',
    password: 'Student@123',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    section: 'CSE-A',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    profile: {
      cgpa: 9.12,
      currentAttendance: 92.4,
      projectedAttendance: 90.8,
      thresholdAttendance: 75.0,
      githubUrl: 'https://github.com/gaearon',
      leetcodeUrl: 'https://leetcode.com/u/tourist/'
    }
  },
  {
    id: 'STU003',
    registerNo: '21CS045',
    name: 'Chandran M',
    email: 'chandran@college.edu',
    password: 'Student@123',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    section: 'CSE-B',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    profile: {
      cgpa: 8.20,
      currentAttendance: 84.5,
      projectedAttendance: 81.2,
      thresholdAttendance: 75.0,
      githubUrl: 'https://github.com/suckow',
      leetcodeUrl: ''
    }
  },

  // STAFF / FACULTY
  {
    id: 'STF001',
    registerNo: 'EMP-CS01',
    name: 'Prof. K. Venkatesh',
    email: 'staff@college.edu',
    password: 'Staff@123',
    role: 'STAFF',
    department: 'Computer Science & Engineering',
    section: 'Class Advisor',
    year: 'Faculty',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  },

  // VICE PRINCIPAL
  {
    id: 'VP001',
    registerNo: 'EMP-VP01',
    name: 'Dr. A. Parthiban (Vice Principal)',
    email: 'vp@college.edu',
    password: 'Vp@123',
    role: 'VICE_PRINCIPAL',
    department: 'Computer Science & Engineering',
    section: 'Vice Principal & HOD',
    year: 'Executive',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  },

  // ADMINISTRATOR
  {
    id: 'ADM001',
    registerNo: 'ADM-001',
    name: 'Dr. S. R. Ramanathan (Admin)',
    email: 'admin@college.edu',
    password: 'Admin@123',
    role: 'ADMINISTRATOR',
    department: 'Administration',
    section: 'Dean Academic',
    year: 'Executive',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  }
];

function getAuthHeaders() {
  const token = localStorage.getItem('ilps_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const api = {
  // Student Registration
  async registerStudent(studentData) {
    const { name, email, registerNo, password, department, section, year } = studentData;
    
    if (!name || !email || !password || !department) {
      throw new Error('Name, Email, Password, and Department are required.');
    }

    // Check existing
    const customUsers = JSON.parse(localStorage.getItem('ilps_custom_users') || '[]');
    const allUsers = [...DEMO_USERS, ...customUsers];
    const exists = allUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      throw new Error(`An account with email ${email} already exists.`);
    }

    const newStudent = {
      id: `STU-${Date.now().toString().slice(-4)}`,
      registerNo: registerNo || `REG-${Date.now().toString().slice(-5)}`,
      name,
      email,
      password,
      role: 'STUDENT',
      department,
      section: section || 'Section A',
      year: year || 'III Year',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      status: 'ACTIVE',
      profile: {
        cgpa: 8.50,
        currentAttendance: 88.0,
        projectedAttendance: 85.0,
        thresholdAttendance: 75.0,
        githubUrl: '',
        leetcodeUrl: ''
      }
    };

    customUsers.push(newStudent);
    localStorage.setItem('ilps_custom_users', JSON.stringify(customUsers));

    // Try backend API registration if available
    try {
      await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      });
    } catch (e) {}

    return newStudent;
  },

  // Auth Login
  async login(identity, password, role) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity, password, role })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.token && data.user) {
          localStorage.setItem('ilps_jwt_token', data.token);
          localStorage.setItem('ilps_user', JSON.stringify(data.user));
          return data;
        }
      }
    } catch (err) {}

    const targetRole = (role || 'STUDENT').toUpperCase();
    const cleanId = (identity || '').trim().toLowerCase();

    const customUsers = JSON.parse(localStorage.getItem('ilps_custom_users') || '[]');
    const allUsers = [...DEMO_USERS, ...customUsers];

    const user = allUsers.find(u => 
      u.email.toLowerCase() === cleanId ||
      (u.registerNo && u.registerNo.toLowerCase() === cleanId)
    );

    if (!user) {
      throw new Error('Invalid credentials. User account not found.');
    }

    if (user.password !== password) {
      throw new Error('Invalid credentials. Password incorrect.');
    }

    if (user.role !== targetRole) {
      if (user.role === 'VICE_PRINCIPAL' && targetRole === 'STAFF') {
        // Allowed
      } else {
        throw new Error(`Your account (${user.role}) does not have permission to access the ${targetRole} portal. Please select the correct role.`);
      }
    }

    const { password: _, ...safeUser } = user;
    const dummyToken = `demo-jwt-token-${Date.now()}`;
    
    localStorage.setItem('ilps_jwt_token', dummyToken);
    localStorage.setItem('ilps_user', JSON.stringify(safeUser));

    return {
      message: 'Authentication successful.',
      token: dummyToken,
      user: safeUser
    };
  },

  async getCurrentUser() {
    const token = localStorage.getItem('ilps_jwt_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) return data.user;
      }
    } catch (e) {}

    const saved = localStorage.getItem('ilps_user');
    return saved ? JSON.parse(saved) : null;
  },

  logout() {
    localStorage.removeItem('ilps_jwt_token');
    localStorage.removeItem('ilps_user');
  },

  // Clear Leaves List (Used in Leave Form / Applications List)
  clearLeaveApplications() {
    localStorage.setItem('ilps_custom_leaves', JSON.stringify([]));
    localStorage.setItem('ilps_cleared_leaves_flag', 'true');
  },

  // Leaves
  async getLeaves() {
    try {
      const res = await fetch(`${API_BASE_URL}/leaves`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}

    const isCleared = localStorage.getItem('ilps_cleared_leaves_flag') === 'true';
    const customLeaves = JSON.parse(localStorage.getItem('ilps_custom_leaves') || '[]');
    if (isCleared) {
      return customLeaves;
    }
    return null;
  },

  async submitLeave(leaveData) {
    try {
      const res = await fetch(`${API_BASE_URL}/leaves`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(leaveData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const customLeaves = JSON.parse(localStorage.getItem('ilps_custom_leaves') || '[]');
    const newApp = {
      id: `LVR-2026-${String(customLeaves.length + 101).padStart(5, '0')}`,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      ...leaveData
    };
    customLeaves.unshift(newApp);
    localStorage.setItem('ilps_custom_leaves', JSON.stringify(customLeaves));
    return { message: 'Submitted', application: newApp };
  },

  async updateLeaveStatus(id, status, remarks) {
    try {
      const res = await fetch(`${API_BASE_URL}/leaves/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, remarks })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  // Users (Admin)
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}
    const customUsers = JSON.parse(localStorage.getItem('ilps_custom_users') || '[]');
    return [...DEMO_USERS, ...customUsers].map(({ password, ...u }) => u);
  },

  async createUser(userData) {
    return this.registerStudent(userData);
  },

  async toggleUserStatus(userId) {
    return { message: 'Status updated.' };
  },

  async resetPassword(userId, newPassword) {
    return { message: 'Password reset.' };
  },

  // GitHub & LeetCode Integrations
  async getGitHubAnalysis(handle) {
    const clean = (handle || '').split('/').pop();
    if (!clean) return { available: false, message: 'GitHub analysis unavailable' };

    try {
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(clean)}`);
      if (userRes.ok) {
        const uData = await userRes.json();
        const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(clean)}/repos?sort=updated&per_page=4`);
        const reposData = reposRes.ok ? await reposRes.json() : [];

        const repoCount = uData.public_repos || 0;
        const followers = uData.followers || 0;
        const techScore = Math.min(100, Math.round(repoCount * 2 + followers * 1.5 + 45));

        return {
          available: true,
          username: uData.login,
          name: uData.name || uData.login,
          avatarUrl: uData.avatar_url,
          profileUrl: uData.html_url,
          publicRepos: uData.public_repos,
          followers: uData.followers,
          following: uData.following,
          technicalScore: techScore,
          recentRepos: reposData.map(r => ({
            name: r.name,
            language: r.language || 'Code',
            stars: r.stargazers_count,
            forks: r.forks_count,
            url: r.html_url
          }))
        };
      }
    } catch (e) {}

    return { available: false, username: clean, message: 'GitHub analysis unavailable' };
  },

  async getLeetCodeAnalysis(handle) {
    const clean = (handle || '').split('/').pop();
    if (!clean) return { available: false, message: 'LeetCode analysis unavailable' };

    try {
      const lcRes = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${encodeURIComponent(clean)}`);
      if (lcRes.ok) {
        const data = await lcRes.json();
        return {
          available: true,
          username: clean,
          totalSolved: data.totalSolved || 0,
          easySolved: data.easySolved || 0,
          mediumSolved: data.mediumSolved || 0,
          hardSolved: data.hardSolved || 0,
          ranking: data.ranking || 'N/A'
        };
      }
    } catch (e) {}

    return { available: false, username: clean, message: 'LeetCode analysis unavailable' };
  },

  async getAuditLogs() {
    return [
      {
        id: 'AUD-1001',
        timestamp: new Date().toISOString(),
        userId: 'STU001',
        userName: 'Arun Kumar',
        role: 'STUDENT',
        action: 'LEAVE_SUBMITTED',
        target: 'LVR-2026-00124',
        details: 'Submitted Medical Emergency leave application (4 days)'
      }
    ];
  },

  async getNotifications() { return []; },
  async markNotificationsRead() { return true; },
  async getSettings() { return null; },
  async updateSettings(weights, urgentTypes) { return { weights, urgentTypes }; },
  async getAnalytics() { return null; }
};
