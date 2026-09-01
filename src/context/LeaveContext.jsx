import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { INITIAL_LEAVE_REQUESTS } from '../utils/mockData';
import { calculatePriorityScore, DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS, URGENT_LEAVE_TYPES } from '../utils/priorityEngine';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const LeaveContext = createContext();

export function LeaveProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [urgentTypes, setUrgentTypes] = useState(URGENT_LEAVE_TYPES);
  const [rawRequests, setRawRequests] = useState(INITIAL_LEAVE_REQUESTS);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedLeaveType, setSelectedLeaveType] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedAttendanceRisk, setSelectedAttendanceRisk] = useState('ALL');
  const [sortBy, setSortBy] = useState('SCORE_DESC');

  // Fetch live backend data when authenticated
  const refreshData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const leavesData = await api.getLeaves().catch(() => null);
      if (Array.isArray(leavesData) && leavesData.length > 0) {
        setRawRequests(leavesData);
      }

      const notifsData = await api.getNotifications().catch(() => null);
      if (Array.isArray(notifsData)) {
        setNotifications(notifsData);
      }

      if (user?.role === 'ADMINISTRATOR') {
        const auditData = await api.getAuditLogs().catch(() => null);
        if (Array.isArray(auditData)) {
          setAuditLogs(auditData);
        }
      }

      const settingsData = await api.getSettings().catch(() => null);
      if (settingsData?.weights) {
        setWeights(settingsData.weights);
        if (settingsData.urgentTypes) setUrgentTypes(settingsData.urgentTypes);
      }
    } catch (e) {
      console.warn('API sync fallback to local memory:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [isAuthenticated, user?.id]);

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
      // Role Scoping:
      if (user?.role === 'STUDENT' && req.studentId && req.studentId !== user.id) {
        return false;
      }
      if (user?.role === 'STAFF' && user.department && user.department !== 'Administration' && req.department !== user.department) {
        // filter by dept if needed
      }

      // Search match
      const matchSearch = searchTerm === '' ||
        (req.studentName && req.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.studentId && req.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.id && req.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.reasonType && req.reasonType.toLowerCase().includes(searchTerm.toLowerCase()));

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
  }, [processedRequests, user, searchTerm, selectedPriority, selectedLeaveType, selectedDept, selectedAttendanceRisk, sortBy]);

  // Quick stats counters
  const priorityStats = useMemo(() => {
    const counts = {
      CRITICAL: 0,
      HIGH: 0,
      NORMAL: 0,
      LOW: 0,
      REVIEW_WHEN_AVAILABLE: 0,
      TOTAL_PENDING: 0,
      URGENT_COUNT: 0,
      APPROVED_COUNT: 0,
      REJECTED_COUNT: 0
    };

    processedRequests.forEach(r => {
      if (r.status === 'PENDING' || r.status.startsWith('PENDING')) {
        counts.TOTAL_PENDING++;
        const key = r.calculatedPriority.levelKey;
        if (counts[key] !== undefined) counts[key]++;
        if (r.calculatedPriority.isUrgent) counts.URGENT_COUNT++;
      } else if (r.status === 'APPROVED') {
        counts.APPROVED_COUNT++;
      } else if (r.status === 'REJECTED') {
        counts.REJECTED_COUNT++;
      }
    });

    return counts;
  }, [processedRequests]);

  // Handlers
  const addLeaveRequest = async (newReq) => {
    if (isAuthenticated) {
      try {
        const res = await api.submitLeave(newReq);
        if (res?.application) {
          setRawRequests(prev => [res.application, ...prev]);
          refreshData();
          return res.application;
        }
      } catch (err) {
        console.warn('API error, falling back to local addition:', err.message);
      }
    }

    // Local state fallback
    const priorityInfo = calculatePriorityScore(newReq, weights, urgentTypes);
    const formatted = {
      ...newReq,
      id: `LVR-2026-${String(rawRequests.length + 124).padStart(5, '0')}`,
      submittedAt: new Date().toISOString(),
      studentId: user?.id || 'STU001',
      studentName: user?.name || newReq.studentName || 'Student',
      department: user?.department || newReq.department || 'Computer Science & Engineering',
      status: 'PENDING',
      calculatedPriority: priorityInfo,
      approvalTimeline: [
        { step: 'Submission', role: user?.name || 'Student', status: 'COMPLETED', timestamp: new Date().toISOString(), comment: 'Request submitted.' }
      ]
    };
    setRawRequests(prev => [formatted, ...prev]);
    return formatted;
  };

  const updateRequestStatus = async (id, newStatus, roleName, comment) => {
    if (isAuthenticated) {
      try {
        const res = await api.updateLeaveStatus(id, newStatus, comment);
        if (res?.leave) {
          setRawRequests(prev => prev.map(r => r.id === id ? res.leave : r));
          refreshData();
          return;
        }
      } catch (err) {
        console.warn('API error, using local state update:', err.message);
      }
    }

    setRawRequests(prev => prev.map(req => {
      if (req.id !== id) return req;
      return {
        ...req,
        status: newStatus,
        approvalTimeline: [
          ...(req.approvalTimeline || []),
          {
            step: roleName || user?.name || 'Reviewer',
            role: roleName || user?.role || 'Staff',
            status: newStatus,
            timestamp: new Date().toISOString(),
            comment: comment || `Status updated to ${newStatus}`
          }
        ]
      };
    }));
  };

  const updateWeights = async (newWeights) => {
    setWeights(newWeights);
    if (isAuthenticated && user?.role === 'ADMINISTRATOR') {
      try {
        await api.updateSettings(newWeights, urgentTypes);
      } catch (e) {}
    }
  };

  const toggleUrgentType = async (typeName) => {
    const updated = urgentTypes.includes(typeName) 
      ? urgentTypes.filter(t => t !== typeName) 
      : [...urgentTypes, typeName];
    setUrgentTypes(updated);
    if (isAuthenticated && user?.role === 'ADMINISTRATOR') {
      try {
        await api.updateSettings(weights, updated);
      } catch (e) {}
    }
  };

  const resetToDefault = () => {
    setWeights(DEFAULT_WEIGHTS);
    setThresholds(DEFAULT_THRESHOLDS);
    setUrgentTypes(URGENT_LEAVE_TYPES);
    setRawRequests(INITIAL_LEAVE_REQUESTS);
  };

  return (
    <LeaveContext.Provider value={{
      weights,
      updateWeights,
      thresholds,
      setThresholds,
      urgentTypes,
      toggleUrgentType,
      requests: processedRequests,
      filteredRequests,
      priorityStats,
      notifications,
      auditLogs,
      loading,
      refreshData,
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
