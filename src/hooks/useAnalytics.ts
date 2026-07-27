/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AnalyticsService } from '../services/analyticsService';
import {
  CareerIntelligenceInsight,
  SystemHealthMetrics,
  SystemAuditLog,
  ExecutiveReportConfig
} from '../types';

export function useAnalytics() {
  const { user } = useAuth();
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; action: string; details?: string; createdAt: string }>>([]);
  const [careerIntelligence, setCareerIntelligence] = useState<CareerIntelligenceInsight | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generatingReport, setGeneratingReport] = useState<boolean>(false);
  const [reportResult, setReportResult] = useState<any | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!user?.id && !user?.uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const userId = user.uid || user.id;
    const logs = await AnalyticsService.getActivityLogs(userId, 20);
    setActivityLogs(logs);
    setLoading(false);
  }, [user]);

  const loadIntelligence = useCallback(async (readinessScore = 78, applicationsCount = 6, studyHours = 18.4) => {
    const targetRole = user?.currentTargetGoal || 'Full Stack Software Engineer';
    const data = await AnalyticsService.fetchCareerIntelligence({
      targetRole,
      readinessScore,
      applicationsCount,
      studyHours,
      interviewDrillsCount: 5,
      skillsCount: user?.skills?.length || 12,
    });
    setCareerIntelligence(data);
  }, [user]);

  const loadSystemHealth = useCallback(async () => {
    const health = await AnalyticsService.getSystemHealth();
    setSystemHealth(health);
  }, []);

  const loadAuditLogs = useCallback(async () => {
    const logs = await AnalyticsService.getAuditLogs();
    setAuditLogs(logs);
  }, []);

  useEffect(() => {
    fetchLogs();
    loadIntelligence();
    loadSystemHealth();
    loadAuditLogs();
  }, [fetchLogs, loadIntelligence, loadSystemHealth, loadAuditLogs]);

  const logActivity = async (action: string, details?: string) => {
    const userId = user?.uid || user?.id;
    if (!userId) return;
    await AnalyticsService.logActivity(userId, action, details);
    setActivityLogs((prev) => [
      { id: 'act_' + Date.now(), action, details, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const generateReport = async (config: ExecutiveReportConfig) => {
    setGeneratingReport(true);
    try {
      const res = await AnalyticsService.generateExecutiveReport({
        reportTitle: config.reportTitle,
        dateRange: config.dateRange,
        targetRole: user?.currentTargetGoal || 'Full Stack Software Engineer',
        userProfile: user,
        config
      });
      setReportResult(res);
      return res;
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  return {
    activityLogs,
    careerIntelligence,
    systemHealth,
    auditLogs,
    loading,
    generatingReport,
    reportResult,
    refetchLogs: fetchLogs,
    logActivity,
    loadIntelligence,
    loadSystemHealth,
    loadAuditLogs,
    generateReport
  };
}

