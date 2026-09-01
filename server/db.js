import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

// Initial seed users with plain text passwords to be hashed at initialization
const SEED_USERS_RAW = [
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
    status: 'ACTIVE'
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
    status: 'ACTIVE'
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
    status: 'ACTIVE'
  },
  {
    id: 'STF001',
    registerNo: 'EMP-CS01',
    name: 'Prof. K. Venkatesh',
    email: 'staff@college.edu',
    password: 'Staff@123',
    role: 'STAFF',
    department: 'Computer Science & Engineering',
    section: 'Staff/Advisor',
    year: 'Faculty',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  },
  {
    id: 'STF002',
    registerNo: 'EMP-IT01',
    name: 'Dr. M. Lakshmi',
    email: 'lakshmi@college.edu',
    password: 'Staff@123',
    role: 'STAFF',
    department: 'Information Technology',
    section: 'Staff/HOD',
    year: 'Faculty',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  },
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

const SEED_STUDENT_PROFILES = {
  'STU001': {
    cgpa: 8.84,
    currentAttendance: 88.2,
    projectedAttendance: 85.1,
    thresholdAttendance: 75.0,
    githubUrl: 'https://github.com/torvalds',
    leetcodeUrl: 'https://leetcode.com/u/neal_wu/',
    githubScore: 86,
    leetcodeScore: 81
  },
  'STU002': {
    cgpa: 9.12,
    currentAttendance: 92.4,
    projectedAttendance: 90.8,
    thresholdAttendance: 75.0,
    githubUrl: 'https://github.com/gaearon',
    leetcodeUrl: 'https://leetcode.com/u/tourist/',
    githubScore: 94,
    leetcodeScore: 90
  },
  'STU003': {
    cgpa: 8.20,
    currentAttendance: 84.5,
    projectedAttendance: 81.2,
    thresholdAttendance: 75.0,
    githubUrl: 'https://github.com/suckow',
    leetcodeUrl: '',
    githubScore: 45,
    leetcodeScore: null
  }
};

const SEED_LEAVE_APPLICATIONS = [
  {
    id: 'LVR-2026-00124',
    studentId: 'STU001',
    registerNo: '21CS094',
    studentName: 'Arun Kumar',
    department: 'Computer Science & Engineering',
    section: 'CSE-A',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    reasonType: 'Medical Emergency',
    reasonDetails: 'Severe acute appendicitis requiring emergency hospitalization and surgery. Doctor prescribed 4 days absolute bed rest.',
    startDate: '2026-09-02',
    endDate: '2026-09-05',
    totalDays: 4,
    submittedAt: '2026-09-01T08:15:00Z',
    proofRequired: true,
    proof: {
      fileName: 'Apollo_Hospital_Admission_Notice.pdf',
      fileSize: '1.4 MB',
      strengthScore: 94,
      nameMatch: 'Strong',
      dateMatch: 'Strong',
      reasonMatch: 'Strong',
      completeness: 'High',
      extractedText: 'Patient: Arun Kumar | Hospitalized on: 02-Sep-2026 to 05-Sep-2026 | Diagnosis: Acute Appendicitis',
      aiConfidence: '98.5%'
    },
    attendance: {
      current: 88.2,
      projected: 85.1,
      threshold: 75.0,
      classesAffected: 24
    },
    academic: {
      cgpa: 8.84,
      github: 86,
      leetcode: 81,
      developmentActivity: 'HIGH'
    },
    leaveHistory: {
      totalDaysThisMonth: 1,
      approvedLeavesCount: 2,
      rejectedLeavesCount: 0,
      unusualPattern: false,
      score: 95
    },
    priorityScore: 87,
    priorityLevel: 'HIGH',
    status: 'PENDING',
    approvalTimeline: [
      { step: 'Submission', role: 'Student (Arun Kumar)', status: 'COMPLETED', timestamp: '2026-09-01T08:15:00Z', comment: 'Submitted with official hospital medical certificate.' }
    ]
  },
  {
    id: 'LVR-2026-00125',
    studentId: 'STU002',
    registerNo: '21CS112',
    studentName: 'Bhavana S',
    department: 'Computer Science & Engineering',
    section: 'CSE-A',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    reasonType: 'Placement / Interview',
    reasonDetails: 'Final round technical interview and HR discussion at Google Bangalore office for SDE Internship.',
    startDate: '2026-09-03',
    endDate: '2026-09-04',
    totalDays: 2,
    submittedAt: '2026-09-01T09:30:00Z',
    proofRequired: true,
    proof: {
      fileName: 'Google_Interview_CallLetter.pdf',
      fileSize: '890 KB',
      strengthScore: 92,
      nameMatch: 'Strong',
      dateMatch: 'Strong',
      reasonMatch: 'Strong',
      completeness: 'High',
      extractedText: 'Candidate: Bhavana S | Interview Date: Sep 03-04, 2026 | Location: Google Signature Towers, Bangalore',
      aiConfidence: '96.2%'
    },
    attendance: {
      current: 92.4,
      projected: 90.8,
      threshold: 75.0,
      classesAffected: 12
    },
    academic: {
      cgpa: 9.12,
      github: 94,
      leetcode: 90,
      developmentActivity: 'HIGH'
    },
    leaveHistory: {
      totalDaysThisMonth: 0,
      approvedLeavesCount: 1,
      rejectedLeavesCount: 0,
      unusualPattern: false,
      score: 95
    },
    priorityScore: 91,
    priorityLevel: 'CRITICAL',
    status: 'PENDING',
    approvalTimeline: [
      { step: 'Submission', role: 'Student (Bhavana S)', status: 'COMPLETED', timestamp: '2026-09-01T09:30:00Z', comment: 'Official Google placement invitation attached.' }
    ]
  },
  {
    id: 'LVR-2026-00126',
    studentId: 'STU003',
    registerNo: '21CS045',
    studentName: 'Chandran M',
    department: 'Computer Science & Engineering',
    section: 'CSE-B',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    reasonType: 'Family Emergency',
    reasonDetails: 'Attending elder sister wedding ceremony in hometown and organizing family arrangements.',
    startDate: '2026-09-04',
    endDate: '2026-09-07',
    totalDays: 4,
    submittedAt: '2026-09-01T10:00:00Z',
    proofRequired: true,
    proof: {
      fileName: 'Wedding_Invitation_Card.pdf',
      fileSize: '2.1 MB',
      strengthScore: 82,
      nameMatch: 'Moderate',
      dateMatch: 'Strong',
      reasonMatch: 'Strong',
      completeness: 'Medium',
      extractedText: 'Wedding Ceremony of Archana M & Karthik V | Family Members: Chandran M',
      aiConfidence: '88.0%'
    },
    attendance: {
      current: 84.5,
      projected: 81.2,
      threshold: 75.0,
      classesAffected: 24
    },
    academic: {
      cgpa: 8.20,
      github: 45,
      leetcode: null,
      developmentActivity: 'MODERATE'
    },
    leaveHistory: {
      totalDaysThisMonth: 2,
      approvedLeavesCount: 3,
      rejectedLeavesCount: 0,
      unusualPattern: false,
      score: 88
    },
    priorityScore: 78,
    priorityLevel: 'HIGH',
    status: 'APPROVED',
    approvalTimeline: [
      { step: 'Submission', role: 'Student (Chandran M)', status: 'COMPLETED', timestamp: '2026-09-01T10:00:00Z', comment: 'Family wedding invitation provided.' },
      { step: 'Approval', role: 'Prof. K. Venkatesh (Staff)', status: 'APPROVED', timestamp: '2026-09-01T11:45:00Z', comment: 'Verified family event. Approved.' }
    ]
  }
];

const SEED_AUDIT_LOGS = [
  {
    id: 'AUD-1001',
    timestamp: '2026-09-01T08:15:00Z',
    userId: 'STU001',
    userName: 'Arun Kumar',
    role: 'STUDENT',
    action: 'LEAVE_SUBMITTED',
    target: 'LVR-2026-00124',
    details: 'Submitted Medical Emergency leave application (4 days)'
  },
  {
    id: 'AUD-1002',
    timestamp: '2026-09-01T09:30:00Z',
    userId: 'STU002',
    userName: 'Bhavana S',
    role: 'STUDENT',
    action: 'LEAVE_SUBMITTED',
    target: 'LVR-2026-00125',
    details: 'Submitted Placement / Interview leave application (2 days)'
  },
  {
    id: 'AUD-1003',
    timestamp: '2026-09-01T11:45:00Z',
    userId: 'STF001',
    userName: 'Prof. K. Venkatesh',
    role: 'STAFF',
    action: 'LEAVE_APPROVED',
    target: 'LVR-2026-00126',
    details: 'Approved family emergency leave for Chandran M'
  }
];

class DatabaseService {
  constructor() {
    this.data = {
      users: [],
      studentProfiles: {},
      leaveApplications: [],
      auditLogs: [],
      notifications: [],
      systemSettings: {
        weights: {
          reasonUrgency: 30,
          proofStrength: 25,
          attendanceImpact: 20,
          academicConsistency: 15,
          leaveHistory: 10,
        },
        urgentTypes: [
          'Medical Emergency',
          'Family Emergency',
          'Placement / Interview',
          'Official Academic Event',
          'Government Examination'
        ]
      }
    };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('✓ Database loaded from persistent store database.json');
        return;
      } catch (err) {
        console.error('Error reading database.json, re-seeding:', err);
      }
    }

    // Seed users with bcrypt hashed passwords synchronously
    this.data.users = SEED_USERS_RAW.map(u => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(u.password, salt);
      const { password, ...userWithoutPlainPassword } = u;
      return {
        ...userWithoutPlainPassword,
        passwordHash: hash,
        createdAt: new Date().toISOString()
      };
    });

    this.data.studentProfiles = { ...SEED_STUDENT_PROFILES };
    this.data.leaveApplications = [...SEED_LEAVE_APPLICATIONS];
    this.data.auditLogs = [...SEED_AUDIT_LOGS];
    this.data.notifications = [
      {
        id: 'NOTIF-001',
        userId: 'STU001',
        title: 'Leave Submitted Successfully',
        message: 'Your leave application LVR-2026-00124 has been submitted and assigned High Priority (87/100).',
        type: 'info',
        read: false,
        timestamp: new Date().toISOString()
      },
      {
        id: 'NOTIF-002',
        userId: 'STF001',
        title: '2 Pending Leave Applications',
        message: 'You have 2 pending leave applications requiring review in Computer Science department.',
        type: 'warning',
        read: false,
        timestamp: new Date().toISOString()
      }
    ];

    this.save();
    console.log('✓ Database initialized & seeded successfully.');
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database.json:', err);
    }
  }

  // Users API
  getUsers() {
    return this.data.users.map(({ passwordHash, ...u }) => u);
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(userData.password || 'College@123', salt);
    
    const newUser = {
      id: userData.id || `${userData.role.substring(0, 3)}${String(this.data.users.length + 1).padStart(3, '0')}`,
      registerNo: userData.registerNo || `REG-${Date.now().toString().slice(-6)}`,
      name: userData.name,
      email: userData.email,
      passwordHash,
      role: userData.role,
      department: userData.department || 'General',
      section: userData.section || 'A',
      year: userData.year || 'I Year',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);

    if (newUser.role === 'STUDENT') {
      this.data.studentProfiles[newUser.id] = {
        cgpa: userData.cgpa || 8.0,
        currentAttendance: userData.attendance || 85.0,
        projectedAttendance: userData.attendance || 85.0,
        thresholdAttendance: 75.0,
        githubUrl: userData.githubUrl || '',
        leetcodeUrl: userData.leetcodeUrl || '',
        githubScore: null,
        leetcodeScore: null
      };
    }

    this.addAuditLog({
      userId: userData.actorId || 'ADM001',
      userName: userData.actorName || 'Administrator',
      role: 'ADMINISTRATOR',
      action: 'USER_CREATED',
      target: newUser.id,
      details: `Created new ${newUser.role} account for ${newUser.name} (${newUser.email})`
    });

    this.save();
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  toggleUserStatus(userId, actorInfo) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return null;
    user.status = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    
    this.addAuditLog({
      userId: actorInfo.id,
      userName: actorInfo.name,
      role: actorInfo.role,
      action: user.status === 'DISABLED' ? 'USER_DISABLED' : 'USER_ACTIVATED',
      target: user.id,
      details: `Updated account status of ${user.name} to ${user.status}`
    });

    this.save();
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  resetPassword(userId, newPassword, actorInfo) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return false;
    
    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPassword, salt);

    this.addAuditLog({
      userId: actorInfo.id,
      userName: actorInfo.name,
      role: actorInfo.role,
      action: 'PASSWORD_RESET',
      target: user.id,
      details: `Password reset performed for ${user.name}`
    });

    this.save();
    return true;
  }

  // Student Profiles
  getStudentProfile(userId) {
    return this.data.studentProfiles[userId] || null;
  }

  updateStudentProfile(userId, profileData) {
    if (!this.data.studentProfiles[userId]) {
      this.data.studentProfiles[userId] = {};
    }
    this.data.studentProfiles[userId] = {
      ...this.data.studentProfiles[userId],
      ...profileData
    };
    this.save();
    return this.data.studentProfiles[userId];
  }

  // Leave Applications API
  getLeaveApplications() {
    return this.data.leaveApplications;
  }

  getLeaveApplicationById(id) {
    return this.data.leaveApplications.find(l => l.id === id);
  }

  createLeaveApplication(leaveData, studentUser) {
    const count = this.data.leaveApplications.length + 124;
    const appId = `LVR-2026-${String(count).padStart(5, '0')}`;
    
    const studentProf = this.getStudentProfile(studentUser.id) || {
      cgpa: 8.0,
      currentAttendance: 85.0,
      projectedAttendance: 82.0,
      thresholdAttendance: 75.0,
      githubScore: null,
      leetcodeScore: null
    };

    const newLeave = {
      id: appId,
      studentId: studentUser.id,
      registerNo: studentUser.registerNo || '21CS001',
      studentName: studentUser.name,
      department: studentUser.department,
      section: studentUser.section || 'A',
      year: studentUser.year || 'III Year',
      avatar: studentUser.avatar,
      reasonType: leaveData.reasonType,
      reasonDetails: leaveData.reasonDetails,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      totalDays: Number(leaveData.totalDays) || 1,
      submittedAt: new Date().toISOString(),
      proofRequired: Boolean(leaveData.proofRequired),
      proof: leaveData.proof || null,
      attendance: {
        current: studentProf.currentAttendance || 85.0,
        projected: Math.max(60, (studentProf.currentAttendance || 85.0) - (leaveData.totalDays * 0.8)),
        threshold: 75.0,
        classesAffected: leaveData.totalDays * 6
      },
      academic: {
        cgpa: studentProf.cgpa || 8.0,
        github: studentProf.githubScore,
        leetcode: studentProf.leetcodeScore,
        developmentActivity: 'MODERATE'
      },
      leaveHistory: {
        totalDaysThisMonth: 1,
        approvedLeavesCount: 1,
        rejectedLeavesCount: 0,
        unusualPattern: false,
        score: 90
      },
      priorityScore: leaveData.calculatedPriorityScore || 75,
      priorityLevel: leaveData.calculatedPriorityLevel || 'NORMAL',
      status: 'PENDING',
      approvalTimeline: [
        {
          step: 'Submission',
          role: `Student (${studentUser.name})`,
          status: 'COMPLETED',
          timestamp: new Date().toISOString(),
          comment: 'Leave application submitted via Student Portal.'
        }
      ]
    };

    this.data.leaveApplications.unshift(newLeave);

    this.addAuditLog({
      userId: studentUser.id,
      userName: studentUser.name,
      role: 'STUDENT',
      action: 'LEAVE_SUBMITTED',
      target: newLeave.id,
      details: `Submitted ${newLeave.reasonType} leave for ${newLeave.totalDays} days`
    });

    this.addNotification({
      userId: studentUser.id,
      title: 'Leave Submitted',
      message: `Your application ${newLeave.id} has been submitted with ${newLeave.priorityLevel} priority (${newLeave.priorityScore}/100).`,
      type: 'info'
    });

    this.save();
    return newLeave;
  }

  updateLeaveStatus(leaveId, status, remarks, actorUser) {
    const leave = this.data.leaveApplications.find(l => l.id === leaveId);
    if (!leave) return null;

    leave.status = status;
    if (!leave.approvalTimeline) leave.approvalTimeline = [];
    
    leave.approvalTimeline.push({
      step: status === 'APPROVED' ? 'Approval' : 'Rejection',
      role: `${actorUser.name} (${actorUser.role})`,
      status: status,
      timestamp: new Date().toISOString(),
      comment: remarks || `Action ${status} by ${actorUser.name}`
    });

    this.addAuditLog({
      userId: actorUser.id,
      userName: actorUser.name,
      role: actorUser.role,
      action: status === 'APPROVED' ? 'LEAVE_APPROVED' : 'LEAVE_REJECTED',
      target: leave.id,
      details: `${status} leave ${leave.id} for ${leave.studentName}. Remarks: ${remarks || 'None'}`
    });

    this.addNotification({
      userId: leave.studentId,
      title: `Leave ${status}`,
      message: `Your leave request ${leave.id} has been ${status.toLowerCase()} by ${actorUser.name}.`,
      type: status === 'APPROVED' ? 'success' : 'danger'
    });

    this.save();
    return leave;
  }

  // Audit Logs
  getAuditLogs() {
    return this.data.auditLogs;
  }

  addAuditLog(logEntry) {
    const newLog = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      ...logEntry
    };
    this.data.auditLogs.unshift(newLog);
    this.save();
    return newLog;
  }

  // Notifications
  getNotifications(userId) {
    return this.data.notifications.filter(n => n.userId === userId || n.userId === 'ALL');
  }

  addNotification(notif) {
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notif
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  markNotificationsRead(userId) {
    this.data.notifications.forEach(n => {
      if (n.userId === userId || n.userId === 'ALL') n.read = true;
    });
    this.save();
    return true;
  }

  // System Settings
  getSettings() {
    return this.data.systemSettings;
  }

  updateSettings(newSettings, actorUser) {
    this.data.systemSettings = {
      ...this.data.systemSettings,
      ...newSettings
    };

    this.addAuditLog({
      userId: actorUser.id,
      userName: actorUser.name,
      role: actorUser.role,
      action: 'SETTINGS_UPDATED',
      target: 'SYSTEM_SETTINGS',
      details: 'Updated priority calculation weights / urgent leave categories'
    });

    this.save();
    return this.data.systemSettings;
  }
}

export const db = new DatabaseService();
