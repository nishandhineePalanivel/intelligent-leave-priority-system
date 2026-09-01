import express from 'express';
import { db } from '../db.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { calculatePriorityScore } from '../../src/utils/priorityEngine.js';

const router = express.Router();

// GET /api/leaves - Fetch leave applications according to role
router.get('/', verifyToken, (req, res) => {
  const allLeaves = db.getLeaveApplications();
  const settings = db.getSettings();

  // Recalculate priority scores dynamically with current settings
  const processedLeaves = allLeaves.map(leave => {
    const priorityInfo = calculatePriorityScore(leave, settings.weights, settings.urgentTypes);
    return {
      ...leave,
      priorityScore: priorityInfo.score,
      priorityLevel: priorityInfo.levelKey,
      calculatedPriority: priorityInfo
    };
  });

  if (req.user.role === 'STUDENT') {
    // Students only see their own applications
    const studentLeaves = processedLeaves.filter(l => l.studentId === req.user.id);
    return res.json(studentLeaves);
  }

  if (req.user.role === 'STAFF') {
    // Staff sees leaves from their department
    const staffLeaves = processedLeaves.filter(l => 
      !req.user.department || req.user.department === 'Administration' || l.department === req.user.department
    );
    return res.json(staffLeaves);
  }

  // Admin sees all leaves
  return res.json(processedLeaves);
});

// POST /api/leaves - Create new leave application (Student only)
router.post('/', verifyToken, requireRole(['STUDENT']), (req, res) => {
  const { reasonType, reasonDetails, startDate, endDate, totalDays, proofRequired, proof } = req.body;

  if (!reasonType || !reasonDetails || !startDate || !endDate) {
    return res.status(400).json({ message: 'Missing required leave fields (Reason Type, Details, Start Date, End Date).' });
  }

  const settings = db.getSettings();

  // Temp draft object to compute score
  const draftReq = {
    reasonType,
    reasonDetails,
    totalDays: Number(totalDays) || 1,
    proofRequired,
    proof,
    attendance: { current: 85.0, projected: 82.0, threshold: 75.0 },
    academic: { cgpa: 8.0, github: 80, leetcode: 75 },
    leaveHistory: { totalDaysThisMonth: 1, unusualPattern: false, score: 90 }
  };

  const priorityInfo = calculatePriorityScore(draftReq, settings.weights, settings.urgentTypes);

  const newLeave = db.createLeaveApplication(
    {
      reasonType,
      reasonDetails,
      startDate,
      endDate,
      totalDays,
      proofRequired,
      proof,
      calculatedPriorityScore: priorityInfo.score,
      calculatedPriorityLevel: priorityInfo.levelKey
    },
    req.user
  );

  res.status(201).json({
    message: 'Leave application submitted successfully.',
    application: {
      ...newLeave,
      calculatedPriority: priorityInfo
    }
  });
});

// PUT /api/leaves/:id/status - Approve / Reject leave application (Staff & Administrator)
router.put('/:id/status', verifyToken, requireRole(['STAFF', 'ADMINISTRATOR']), (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value. Must be APPROVED or REJECTED.' });
  }

  const updatedLeave = db.updateLeaveStatus(id, status, remarks, req.user);
  if (!updatedLeave) {
    return res.status(404).json({ message: `Leave application ${id} not found.` });
  }

  res.json({
    message: `Leave application ${id} has been ${status.toLowerCase()}.`,
    leave: updatedLeave
  });
});

export default router;
