import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { JWT_SECRET, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { identity, password, role } = req.body;

  if (!identity || !password || !role) {
    return res.status(400).json({ message: 'Please provide Email/Register Number, Password, and Role.' });
  }

  // Normalize role input (e.g., 'Student' -> 'STUDENT', 'Administrator' -> 'ADMINISTRATOR')
  const targetRole = role.toUpperCase();

  // Find user by email or register number
  const allUsers = db.data.users;
  const user = allUsers.find(u => 
    u.email.toLowerCase() === identity.trim().toLowerCase() ||
    (u.registerNo && u.registerNo.toLowerCase() === identity.trim().toLowerCase())
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials. User account not found.' });
  }

  // Verify password using bcrypt
  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
  }

  // Check account status
  if (user.status === 'DISABLED') {
    return res.status(403).json({ message: 'Your account has been disabled by the administrator. Please contact IT support.' });
  }

  // Verify role matching
  if (user.role !== targetRole) {
    return res.status(403).json({ 
      message: `Your account (${user.role}) does not have permission to access the ${targetRole} portal. Please select the correct role.` 
    });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Log audit login event
  db.addAuditLog({
    userId: user.id,
    userName: user.name,
    role: user.role,
    action: 'USER_LOGIN',
    target: user.role,
    details: `Successful login to ${user.role} portal`
  });

  const { passwordHash, ...safeUser } = user;
  const studentProfile = user.role === 'STUDENT' ? db.getStudentProfile(user.id) : null;

  return res.json({
    message: 'Authentication successful.',
    token,
    user: {
      ...safeUser,
      profile: studentProfile
    }
  });
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  const studentProfile = req.user.role === 'STUDENT' ? db.getStudentProfile(req.user.id) : null;
  res.json({
    user: {
      ...req.user,
      profile: studentProfile
    }
  });
});

export default router;
