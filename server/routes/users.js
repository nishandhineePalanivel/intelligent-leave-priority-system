import express from 'express';
import { db } from '../db.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require Administrator role
router.use(verifyToken, requireRole(['ADMINISTRATOR']));

// GET /api/users - List all users
router.get('/', (req, res) => {
  const users = db.getUsers();
  res.json(users);
});

// POST /api/users - Create new Student or Staff user
router.post('/', (req, res) => {
  const { name, email, role, department, registerNo, section, year, password, cgpa, attendance, githubUrl, leetcodeUrl } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Name, Email, and Role are required fields.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ message: `A user with email ${email} already exists.` });
  }

  const newUser = db.createUser({
    name,
    email,
    role: role.toUpperCase(),
    department: department || 'Computer Science & Engineering',
    registerNo: registerNo || `REG-${Date.now().toString().slice(-6)}`,
    section: section || 'A',
    year: year || 'I Year',
    password: password || 'College@123',
    cgpa: Number(cgpa) || 8.0,
    attendance: Number(attendance) || 85.0,
    githubUrl: githubUrl || '',
    leetcodeUrl: leetcodeUrl || '',
    actorId: req.user.id,
    actorName: req.user.name
  });

  res.status(201).json({
    message: `Account created successfully for ${newUser.name}.`,
    user: newUser
  });
});

// PUT /api/users/:id/toggle-status - Disable / Enable user account
router.put('/:id/toggle-status', (req, res) => {
  const { id } = req.params;
  const updatedUser = db.toggleUserStatus(id, req.user);
  if (!updatedUser) {
    return res.status(404).json({ message: `User ${id} not found.` });
  }

  res.json({
    message: `User account status updated to ${updatedUser.status}.`,
    user: updatedUser
  });
});

// POST /api/users/:id/reset-password - Admin reset password
router.post('/:id/reset-password', (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
  }

  const success = db.resetPassword(id, newPassword, req.user);
  if (!success) {
    return res.status(404).json({ message: `User ${id} not found.` });
  }

  res.json({ message: `Password for user ${id} reset successfully.` });
});

export default router;
