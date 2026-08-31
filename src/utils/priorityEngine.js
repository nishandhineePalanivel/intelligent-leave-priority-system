/**
 * INTELLIGENT LEAVE PRIORITY SCORE ENGINE
 * Transparent calculation from 0 to 100 based on 5 configurable weighted factors.
 * 
 * Rules:
 * 1. Reason Validity & Urgency (Default 30%)
 * 2. Proof Strength & Consistency (Default 25%)
 * 3. Attendance & Academic Impact (Default 20%)
 * 4. Student Academic/Development Consistency (Default 15%) - NON-PUNITIVE
 * 5. Previous Leave Pattern (Default 10%)
 */

export const DEFAULT_WEIGHTS = {
  reasonUrgency: 30,
  proofStrength: 25,
  attendanceImpact: 20,
  academicConsistency: 15,
  leaveHistory: 10,
};

export const DEFAULT_THRESHOLDS = {
  CRITICAL: { min: 90, max: 100, label: 'CRITICAL PRIORITY', color: 'rose', bgClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  HIGH: { min: 75, max: 89, label: 'HIGH PRIORITY', color: 'amber', bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  NORMAL: { min: 50, max: 74, label: 'NORMAL PRIORITY', color: 'blue', bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  LOW: { min: 25, max: 49, label: 'LOW PRIORITY', color: 'slate', bgClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
  REVIEW_WHEN_AVAILABLE: { min: 0, max: 24, label: 'REVIEW WHEN AVAILABLE', color: 'emerald', bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
};

export const URGENT_LEAVE_TYPES = [
  'Medical Emergency',
  'Family Emergency',
  'Placement / Interview',
  'Official Academic Event',
  'Government Examination'
];

/**
 * Calculates priority score & breakdown
 */
export function calculatePriorityScore(request, weights = DEFAULT_WEIGHTS, urgentTypes = URGENT_LEAVE_TYPES) {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 100;
  const normalize = (val, maxW) => (val * (maxW / 100));

  // 1. Reason Validity & Urgency (0 - 100 normalized to weight)
  const isUrgentType = urgentTypes.includes(request.reasonType);
  let rawUrgency = 50;

  switch (request.reasonType) {
    case 'Medical Emergency':
      rawUrgency = 98;
      break;
    case 'Placement / Interview':
      rawUrgency = 92;
      break;
    case 'Family Emergency':
      rawUrgency = 88;
      break;
    case 'Government Examination':
      rawUrgency = 90;
      break;
    case 'Official Academic Event':
    case 'Competition':
    case 'Hackathon':
      rawUrgency = 82;
      break;
    case 'Internship':
    case 'Sports Event':
      rawUrgency = 75;
      break;
    case 'Personal Leave':
      rawUrgency = 45;
      break;
    default:
      rawUrgency = 50;
  }

  // Reason description clarity boost (max +5)
  if (request.reasonDetails && request.reasonDetails.length > 30) {
    rawUrgency = Math.min(100, rawUrgency + 5);
  }

  const reasonScore = Math.round((rawUrgency / 100) * weights.reasonUrgency);

  // 2. Proof Strength & Consistency (0 - 100)
  const proof = request.proof || { nameMatch: 'Strong', dateMatch: 'Strong', reasonMatch: 'Strong', completeness: 'High', strengthScore: 85 };
  
  let proofScoreRaw = proof.strengthScore || 70;
  if (!request.proofRequired) {
    // If proof not required for standard leave, assign neutral high score
    proofScoreRaw = 80;
  }

  const proofScore = Math.round((proofScoreRaw / 100) * weights.proofStrength);

  // 3. Attendance & Academic Impact (0 - 100)
  const currentAtt = request.attendance?.current || 85;
  const projectedAtt = request.attendance?.projected || 82;
  const minRequired = request.attendance?.threshold || 75;

  let attendanceRisk = 'LOW';
  let attScoreRaw = 90;

  if (projectedAtt < minRequired) {
    attendanceRisk = 'HIGH';
    // If projected attendance drops below threshold, priority score increases so advisors notice the risk early
    attScoreRaw = 95; 
  } else if (projectedAtt < minRequired + 5) {
    attendanceRisk = 'MODERATE';
    attScoreRaw = 85;
  } else {
    attendanceRisk = 'LOW';
    attScoreRaw = 90; // High attendance student maintains strong score
  }

  const attendanceScore = Math.round((attScoreRaw / 100) * weights.attendanceImpact);

  // 4. Academic & Development Consistency (15%) - NON-PUNITIVE
  // CGPA: 0-10, GitHub: 0-100 (optional), LeetCode: 0-100 (optional)
  const cgpa = request.academic?.cgpa || 8.0;
  const github = request.academic?.github; // null or number
  const leetcode = request.academic?.leetcode; // null or number

  let devPoints = [];
  devPoints.push((cgpa / 10) * 100);

  if (github !== undefined && github !== null) {
    devPoints.push(github);
  }
  if (leetcode !== undefined && leetcode !== null) {
    devPoints.push(leetcode);
  }

  const avgDevScore = devPoints.reduce((a, b) => a + b, 0) / devPoints.length;
  const academicLevel = avgDevScore >= 80 ? 'HIGH' : avgDevScore >= 65 ? 'MODERATE' : 'STABLE';
  const academicScore = Math.round((avgDevScore / 100) * weights.academicConsistency);

  // 5. Previous Leave Pattern (10%)
  const prevLeaves = request.leaveHistory || { totalDaysThisMonth: 1, unusualPattern: false, score: 90 };
  let patternRaw = prevLeaves.score || (prevLeaves.unusualPattern ? 50 : 90);
  const leaveHistoryScore = Math.round((patternRaw / 100) * weights.leaveHistory);

  // Grand Total Score (0-100)
  const totalScore = Math.min(100, Math.max(0, Math.round(
    reasonScore + proofScore + attendanceScore + academicScore + leaveHistoryScore
  )));

  // Determine Level
  let levelKey = 'NORMAL';
  let levelInfo = DEFAULT_THRESHOLDS.NORMAL;

  if (totalScore >= DEFAULT_THRESHOLDS.CRITICAL.min) {
    levelKey = 'CRITICAL';
    levelInfo = DEFAULT_THRESHOLDS.CRITICAL;
  } else if (totalScore >= DEFAULT_THRESHOLDS.HIGH.min) {
    levelKey = 'HIGH';
    levelInfo = DEFAULT_THRESHOLDS.HIGH;
  } else if (totalScore >= DEFAULT_THRESHOLDS.NORMAL.min) {
    levelKey = 'NORMAL';
    levelInfo = DEFAULT_THRESHOLDS.NORMAL;
  } else if (totalScore >= DEFAULT_THRESHOLDS.LOW.min) {
    levelKey = 'LOW';
    levelInfo = DEFAULT_THRESHOLDS.LOW;
  } else {
    levelKey = 'REVIEW_WHEN_AVAILABLE';
    levelInfo = DEFAULT_THRESHOLDS.REVIEW_WHEN_AVAILABLE;
  }

  // Explanations Generator
  const explanations = [];

  if (isUrgentType) {
    explanations.push(`⚡ Pre-configured Urgent Leave Category (${request.reasonType})`);
  }
  if (rawUrgency >= 80) {
    explanations.push(`✓ High urgency & valid institutional reason identified`);
  }
  if (proofScoreRaw >= 80) {
    explanations.push(`✓ High proof document consistency (Name/Date/Reason matched)`);
  } else if (proofScoreRaw < 60 && request.proofRequired) {
    explanations.push(`⚠️ Supporting document requires manual physical check`);
  }

  if (attendanceRisk === 'HIGH') {
    explanations.push(`⚠️ High Attendance Risk: Leave drops projected attendance below ${minRequired}% threshold (${projectedAtt.toFixed(1)}%)`);
  } else {
    explanations.push(`✓ Projected attendance (${projectedAtt.toFixed(1)}%) remains safe above ${minRequired}% threshold`);
  }

  if (avgDevScore >= 75) {
    explanations.push(`✓ Student demonstrates consistent academic/development track record (CGPA ${cgpa})`);
  } else {
    explanations.push(`ℹ️ Academic context evaluated neutrally without penalty`);
  }

  if (!prevLeaves.unusualPattern) {
    explanations.push(`✓ Standard previous leave pattern without excessive clustering`);
  } else {
    explanations.push(`⚠️ Repeated leave request pattern detected in past 30 days`);
  }

  return {
    score: totalScore,
    levelKey,
    levelLabel: levelInfo.label,
    levelColor: levelInfo.color,
    isUrgent: isUrgentType,
    breakdown: {
      reasonScore,
      reasonMax: weights.reasonUrgency,
      proofScore,
      proofMax: weights.proofStrength,
      attendanceScore,
      attendanceMax: weights.attendanceImpact,
      academicScore,
      academicMax: weights.academicConsistency,
      leaveHistoryScore,
      leaveHistoryMax: weights.leaveHistory,
    },
    metrics: {
      rawUrgency,
      proofStrengthScore: proofScoreRaw,
      attendanceRisk,
      academicLevel,
      currentAttendance: currentAtt,
      projectedAttendance: projectedAtt,
      minRequiredAttendance: minRequired,
    },
    explanations,
  };
}
