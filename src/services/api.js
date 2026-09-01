/**
 * Centralized API Service with JWT authentication header handling and local fallback
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('ilps_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // Auth
  async login(identity, password, role) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity, password, role })
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('ilps_jwt_token', data.token);
      localStorage.setItem('ilps_user', JSON.stringify(data.user));
    }
    return data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('ilps_jwt_token');
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
      const data = await handleResponse(res);
      return data.user;
    } catch (e) {
      localStorage.removeItem('ilps_jwt_token');
      localStorage.removeItem('ilps_user');
      return null;
    }
  },

  logout() {
    localStorage.removeItem('ilps_jwt_token');
    localStorage.removeItem('ilps_user');
  },

  // Leaves
  async getLeaves() {
    const res = await fetch(`${API_BASE_URL}/leaves`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async submitLeave(leaveData) {
    const res = await fetch(`${API_BASE_URL}/leaves`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leaveData)
    });
    return handleResponse(res);
  },

  async updateLeaveStatus(id, status, remarks) {
    const res = await fetch(`${API_BASE_URL}/leaves/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, remarks })
    });
    return handleResponse(res);
  },

  // Users (Admin)
  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/users`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  async toggleUserStatus(userId) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/toggle-status`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async resetPassword(userId, newPassword) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newPassword })
    });
    return handleResponse(res);
  },

  // GitHub & LeetCode Integrations
  async getGitHubAnalysis(handle) {
    const res = await fetch(`${API_BASE_URL}/integrations/github/${encodeURIComponent(handle)}`);
    return handleResponse(res);
  },

  async getLeetCodeAnalysis(handle) {
    const res = await fetch(`${API_BASE_URL}/integrations/leetcode/${encodeURIComponent(handle)}`);
    return handleResponse(res);
  },

  // Audit Logs & System Settings & Analytics
  async getAuditLogs() {
    const res = await fetch(`${API_BASE_URL}/audit`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async getNotifications() {
    const res = await fetch(`${API_BASE_URL}/notifications`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async markNotificationsRead() {
    const res = await fetch(`${API_BASE_URL}/notifications/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getSettings() {
    const res = await fetch(`${API_BASE_URL}/settings`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async updateSettings(weights, urgentTypes) {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ weights, urgentTypes })
    });
    return handleResponse(res);
  },

  async getAnalytics() {
    const res = await fetch(`${API_BASE_URL}/analytics`, { headers: getAuthHeaders() });
    return handleResponse(res);
  }
};
