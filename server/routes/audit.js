import express from 'express';
import { db } from '../db.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/audit - Get Audit Logs (Administrator only)
router.get('/audit', verifyToken, requireRole(['ADMINISTRATOR']), (req, res) => {
  const logs = db.getAuditLogs();
  res.json(logs);
});

// GET /api/notifications - Get Notifications for logged in user
router.get('/notifications', verifyToken, (req, res) => {
  const notifications = db.getNotifications(req.user.id);
  res.json(notifications);
});

// PUT /api/notifications/read - Mark notifications read
router.put('/notifications/read', verifyToken, (req, res) => {
  db.markNotificationsRead(req.user.id);
  res.json({ message: 'Notifications marked as read.' });
});

// GET /api/settings - Get Priority Engine Settings
router.get('/settings', verifyToken, (req, res) => {
  const settings = db.getSettings();
  res.json(settings);
});

// PUT /api/settings - Update Priority Engine Settings (Administrator only)
router.put('/settings', verifyToken, requireRole(['ADMINISTRATOR']), (req, res) => {
  const { weights, urgentTypes } = req.body;
  
  if (weights) {
    const total = Object.values(weights).reduce((a, b) => Number(a) + Number(b), 0);
    if (total !== 100) {
      return res.status(400).json({ message: `Total priority weight must equal 100% (currently ${total}%).` });
    }
  }

  const updated = db.updateSettings({ weights, urgentTypes }, req.user);
  res.json({
    message: 'Priority Engine settings updated successfully.',
    settings: updated
  });
});

// GET /api/analytics - System Analytics Dashboard Data
router.get('/analytics', verifyToken, (req, res) => {
  const leaves = db.getLeaveApplications();
  const users = db.getUsers();

  const totalApplications = leaves.length;
  const pendingCount = leaves.filter(l => l.status === 'PENDING').length;
  const approvedCount = leaves.filter(l => l.status === 'APPROVED').length;
  const rejectedCount = leaves.filter(l => l.status === 'REJECTED').length;

  // Leave types distribution
  const typeCounts = {};
  leaves.forEach(l => {
    typeCounts[l.reasonType] = (typeCounts[l.reasonType] || 0) + 1;
  });

  // Department distribution
  const deptCounts = {};
  leaves.forEach(l => {
    deptCounts[l.department] = (deptCounts[l.department] || 0) + 1;
  });

  // Priority breakdown
  const priorityCounts = { CRITICAL: 0, HIGH: 0, NORMAL: 0, LOW: 0, REVIEW_WHEN_AVAILABLE: 0 };
  leaves.forEach(l => {
    const lvl = l.priorityLevel || 'NORMAL';
    if (priorityCounts[lvl] !== undefined) priorityCounts[lvl]++;
  });

  res.json({
    totals: {
      totalApplications,
      pendingCount,
      approvedCount,
      rejectedCount,
      approvalRate: totalApplications > 0 ? Math.round((approvedCount / totalApplications) * 100) : 0,
      totalUsers: users.length,
      studentsCount: users.filter(u => u.role === 'STUDENT').length,
      staffCount: users.filter(u => u.role === 'STAFF').length
    },
    distributions: {
      byReasonType: typeCounts,
      byDepartment: deptCounts,
      byPriority: priorityCounts
    }
  });
});

export default router;
