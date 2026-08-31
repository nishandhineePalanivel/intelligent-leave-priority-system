import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_LEAVE_REQUESTS } from '../utils/mockData';
import { calculatePriorityScore, DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS, URGENT_LEAVE_TYPES } from '../utils/priorityEngine';

const LeaveContext = createContext();

export function LeaveProvider({ children }) {
  const [activeRole, setActiveRole] = useState('ADVISOR'); // 'ADVISOR', 'HOD', 'VP', 'STUDENT', 'ADMIN'
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [urgentTypes, setUrgentTypes] = useState(URGENT_LEAVE_TYPES);
  const [rawRequests, setRawRequests] = useState(INITIAL_LEAVE_REQUESTS);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL'); // 'ALL', 'CRITICAL', 'HIGH', 'NORMAL', 'LOW', 'REVIEW_WHEN_AVAILABLE'
  const [selectedLeaveType, setSelectedLeaveType] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedAttendanceRisk, setSelectedAttendanceRisk] = useState('ALL'); // 'ALL', 'HIGH', 'MODERATE', 'LOW'
  const [sortBy, setSortBy] = useState('SCORE_DESC'); // 'SCORE_DESC', 'TIME_ASC', 'URGENCY_FIRST'

  // Recalculate priority scores dynamically whenever weights, urgentTypes, or rawRequests change
  const processedRequests = useMemo(() => {
    return rawRequests.map(req => {
      const priorityInfo = calculatePriorityScore(req, weights, urgentTypes);
      return {
        ...req,
        calculatedPriority: priorityInfo
      };
    });
  }, [rawRequests, weights, urgentTypes]);

  // Filtered & Sorted Requests
  const filteredRequests = useMemo(() => {
    return processedRequests.filter(req => {
      // Role scoping: Advisor sees CSE-A/B, HOD sees dept, VP sees all
      if (activeRole === 'ADVISOR' && req.department !== 'Computer Science & Engineering') {
        // keep demo flexible, show all or department filter
      }

      // Search match
      const matchSearch = searchTerm === '' ||
        req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reasonType.toLowerCase().includes(searchTerm.toLowerCase());

      // Priority match
      const matchPriority = selectedPriority === 'ALL' || req.calculatedPriority.levelKey === selectedPriority;

      // Leave Type match
      const matchType = selectedLeaveType === 'ALL' || req.reasonType === selectedLeaveType;

      // Department match
      const matchDept = selectedDept === 'ALL' || req.department === selectedDept;

      // Attendance Risk match
      const matchRisk = selectedAttendanceRisk === 'ALL' || req.calculatedPriority.metrics.attendanceRisk === selectedAttendanceRisk;

      return matchSearch && matchPriority && matchType && matchDept && matchRisk;
    }).sort((a, b) => {
      if (sortBy === 'SCORE_DESC') {
        // Secondary sort by submission time
        if (b.calculatedPriority.score !== a.calculatedPriority.score) {
          return b.calculatedPriority.score - a.calculatedPriority.score;
        }
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      } else if (sortBy === 'URGENCY_FIRST') {
        if (a.calculatedPriority.isUrgent !== b.calculatedPriority.isUrgent) {
          return a.calculatedPriority.isUrgent ? -1 : 1;
        }
        return b.calculatedPriority.score - a.calculatedPriority.score;
      } else if (sortBy === 'TIME_ASC') {
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      }
      return 0;
    });
  }, [processedRequests, activeRole, searchTerm, selectedPriority, selectedLeaveType, selectedDept, selectedAttendanceRisk, sortBy]);

  // Quick stats counters
  const priorityStats = useMemo(() => {
    const counts = {
      CRITICAL: 0,
      HIGH: 0,
      NORMAL: 0,
      LOW: 0,
      REVIEW_WHEN_AVAILABLE: 0,
      TOTAL_PENDING: 0,
      URGENT_COUNT: 0
    };

    processedRequests.forEach(r => {
      if (r.status.startsWith('PENDING')) {
        counts.TOTAL_PENDING++;
        const key = r.calculatedPriority.levelKey;
        if (counts[key] !== undefined) counts[key]++;
        if (r.calculatedPriority.isUrgent) counts.URGENT_COUNT++;
      }
    });

    return counts;
  }, [processedRequests]);

  // Handlers
  const addLeaveRequest = (newReq) => {
    const formatted = {
      ...newReq,
      id: `LR-2026-${String(rawRequests.length + 1).padStart(3, '0')}`,
      submittedAt: new Date().toISOString(),
      status: 'PENDING_ADVISOR',
      approvalTimeline: [
        { step: 'Submission', role: newReq.studentName, status: 'COMPLETED', timestamp: new Date().toISOString(), comment: 'Request submitted.' }
      ]
    };
    setRawRequests(prev => [formatted, ...prev]);
  };

  const updateRequestStatus = (id, newStatus, roleName, comment) => {
    setRawRequests(prev => prev.map(req => {
      if (req.id !== id) return req;
      return {
        ...req,
        status: newStatus,
        approvalTimeline: [
          ...req.approvalTimeline,
          {
            step: roleName,
            role: roleName,
            status: newStatus.includes('REJECTED') ? 'REJECTED' : 'APPROVED',
            timestamp: new Date().toISOString(),
            comment: comment || `Action taken by ${roleName}`
          }
        ]
      };
    }));
  };

  const updateWeights = (newWeights) => {
    setWeights(newWeights);
  };

  const toggleUrgentType = (typeName) => {
    setUrgentTypes(prev => 
      prev.includes(typeName) ? prev.filter(t => t !== typeName) : [...prev, typeName]
    );
  };

  const resetToDefault = () => {
    setWeights(DEFAULT_WEIGHTS);
    setThresholds(DEFAULT_THRESHOLDS);
    setUrgentTypes(URGENT_LEAVE_TYPES);
    setRawRequests(INITIAL_LEAVE_REQUESTS);
  };

  return (
    <LeaveContext.Provider value={{
      activeRole,
      setActiveRole,
      weights,
      updateWeights,
      thresholds,
      setThresholds,
      urgentTypes,
      toggleUrgentType,
      requests: processedRequests,
      filteredRequests,
      priorityStats,
      searchTerm,
      setSearchTerm,
      selectedPriority,
      setSelectedPriority,
      selectedLeaveType,
      setSelectedLeaveType,
      selectedDept,
      setSelectedDept,
      selectedAttendanceRisk,
      setSelectedAttendanceRisk,
      sortBy,
      setSortBy,
      addLeaveRequest,
      updateRequestStatus,
      resetToDefault
    }}>
      {children}
    </LeaveContext.Provider>
  );
}

export function useLeave() {
  return useContext(LeaveContext);
}
