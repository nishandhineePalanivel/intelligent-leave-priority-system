/**
 * Mock Leave Applications Dataset
 * Contains realistic student requests matching prompt specifications.
 */

export const INITIAL_LEAVE_REQUESTS = [
  {
    id: 'LR-2026-001',
    studentId: '21CS094',
    studentName: 'Student A (Arun Kumar)',
    department: 'Computer Science & Engineering',
    section: 'CSE-A',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    reasonType: 'Medical Emergency',
    reasonDetails: 'Severe acute appendicitis requiring emergency hospitalization and minor surgery. Doctor prescribed 4 days absolute bed rest.',
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
      extractedText: 'Patient: Arun Kumar | Hospitalized on: 02-Sep-2026 to 05-Sep-2026 | Diagnosis: Acute Appendicitis | Dr. V. Ramesh (M.S. Surg)',
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
    status: 'PENDING_ADVISOR', // PENDING_ADVISOR -> PENDING_HOD -> PENDING_VP -> APPROVED / REJECTED
    approvalTimeline: [
      { step: 'Submission', role: 'Student A', status: 'COMPLETED', timestamp: '2026-09-01T08:15:00Z', comment: 'Request submitted with hospital medical certificate.' }
    ]
  },
  {
    id: 'LR-2026-002',
    studentId: '21CS112',
    studentName: 'Student B (Bhavana S)',
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
    status: 'PENDING_ADVISOR',
    approvalTimeline: [
      { step: 'Submission', role: 'Student B', status: 'COMPLETED', timestamp: '2026-09-01T09:30:00Z', comment: 'Official placement invitation attached.' }
    ]
  },
  {
    id: 'LR-2026-003',
    studentId: '21CS045',
    studentName: 'Student C (Chandran M)',
    department: 'Computer Science & Engineering',
    section: 'CSE-B',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    reasonType: 'Family Emergency',
    reasonDetails: 'Attending elder sister wedding ceremony in hometown and organizing family logistical arrangements.',
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
      leetcode: null, // Test non-punitive logic
      developmentActivity: 'MODERATE'
    },
    leaveHistory: {
      totalDaysThisMonth: 2,
      approvedLeavesCount: 3,
      rejectedLeavesCount: 0,
      unusualPattern: false,
      score: 88
    },
    status: 'PENDING_ADVISOR',
    approvalTimeline: [
      { step: 'Submission', role: 'Student C', status: 'COMPLETED', timestamp: '2026-09-01T10:00:00Z', comment: 'Family invitation provided.' }
    ]
  },
  {
    id: 'LR-2026-004',
    studentId: '21CS078',
    studentName: 'Student D (Divya K)',
    department: 'Computer Science & Engineering',
    section: 'CSE-B',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    reasonType: 'Personal Leave',
    reasonDetails: 'Personal work in hometown regarding property registration document renewal.',
    startDate: '2026-09-08',
    endDate: '2026-09-09',
    totalDays: 2,
    submittedAt: '2026-09-01T11:20:00Z',
    proofRequired: false,
    proof: null,
    attendance: {
      current: 78.5,
      projected: 76.0,
      threshold: 75.0,
      classesAffected: 12
    },
    academic: {
      cgpa: 8.10,
      github: 88,
      leetcode: 85,
      developmentActivity: 'HIGH'
    },
    leaveHistory: {
      totalDaysThisMonth: 3,
      approvedLeavesCount: 4,
      rejectedLeavesCount: 1,
      unusualPattern: false,
      score: 80
    },
    status: 'PENDING_ADVISOR',
    approvalTimeline: [
      { step: 'Submission', role: 'Student D', status: 'COMPLETED', timestamp: '2026-09-01T11:20:00Z', comment: 'Personal leave application submitted.' }
    ]
  },
  {
    id: 'LR-2026-005',
    studentId: '21CS150',
    studentName: 'Student E (Ezhil R)',
    department: 'Computer Science & Engineering',
    section: 'CSE-A',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    reasonType: 'Personal Leave',
    reasonDetails: 'Visiting home for extended weekend family gathering.',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    totalDays: 3,
    submittedAt: '2026-09-01T14:10:00Z',
    proofRequired: false,
    proof: null,
    attendance: {
      current: 74.8, // Already below 75%
      projected: 71.5, // Drops further below 75%
      threshold: 75.0,
      classesAffected: 18
    },
    academic: {
      cgpa: 7.20,
      github: null,
      leetcode: null,
      developmentActivity: 'STABLE'
    },
    leaveHistory: {
      totalDaysThisMonth: 6,
      approvedLeavesCount: 5,
      rejectedLeavesCount: 2,
      unusualPattern: true, // Repeated leave pattern
      score: 45
    },
    status: 'PENDING_ADVISOR',
    approvalTimeline: [
      { step: 'Submission', role: 'Student E', status: 'COMPLETED', timestamp: '2026-09-01T14:10:00Z', comment: 'Personal leave requested.' }
    ]
  },
  {
    id: 'LR-2026-006',
    studentId: '21CS202',
    studentName: 'Student F (Faris Ahmed)',
    department: 'Information Technology',
    section: 'IT-A',
    year: 'III Year',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    reasonType: 'Official Academic Event',
    reasonDetails: 'Representing college at Smart India Hackathon Grand Finals 2026 in IIT Delhi.',
    startDate: '2026-09-05',
    endDate: '2026-09-09',
    totalDays: 5,
    submittedAt: '2026-09-01T07:45:00Z',
    proofRequired: true,
    proof: {
      fileName: 'SIH_2026_Finalist_Selection_Letter.pdf',
      fileSize: '1.8 MB',
      strengthScore: 96,
      nameMatch: 'Strong',
      dateMatch: 'Strong',
      reasonMatch: 'Strong',
      completeness: 'High',
      extractedText: 'Team Leader: Faris Ahmed | Team ID: SIH-9843 | Event: Grand Finale, IIT Delhi, Sep 5-9',
      aiConfidence: '99.1%'
    },
    attendance: {
      current: 94.0,
      projected: 91.0,
      threshold: 75.0,
      classesAffected: 30
    },
    academic: {
      cgpa: 9.35,
      github: 98,
      leetcode: 95,
      developmentActivity: 'HIGH'
    },
    leaveHistory: {
      totalDaysThisMonth: 1,
      approvedLeavesCount: 3,
      rejectedLeavesCount: 0,
      unusualPattern: false,
      score: 95
    },
    status: 'PENDING_HOD', // Already approved by Advisor, awaiting HOD
    approvalTimeline: [
      { step: 'Submission', role: 'Student F', status: 'COMPLETED', timestamp: '2026-09-01T07:45:00Z', comment: 'SIH invitation attached.' },
      { step: 'Class Advisor', role: 'Prof. K. Venkatesh', status: 'APPROVED', timestamp: '2026-09-01T10:30:00Z', comment: 'Recommended. Outstanding technical representation for college.' }
    ]
  }
];
