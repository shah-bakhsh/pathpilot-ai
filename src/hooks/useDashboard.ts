/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { DashboardService, DashboardMetrics } from '../services/dashboardService';

export function useDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    readinessScore: 68,
    totalApplications: 0,
    activeInterviews: 0,
    coursesInProgress: 0,
    totalProjects: 0,
    experiencePoints: 0,
    streakDays: 1,
    unlockedBadgesCount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await DashboardService.getMetrics(user.id);
    setMetrics(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    refetch: fetchMetrics,
  };
}
