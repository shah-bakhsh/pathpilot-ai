/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { ProductivityService } from '../services/productivityService';
import { ProductivityMetrics, DailyPlan } from '../types';

export function useProductivity() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ProductivityMetrics | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProductivityData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [m, dp] = await Promise.all([
      ProductivityService.getProductivityMetrics(user.id),
      ProductivityService.getDailyPlan(user.id)
    ]);
    setMetrics(m);
    setDailyPlan(dp);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchProductivityData();
  }, [fetchProductivityData]);

  return {
    metrics,
    dailyPlan,
    loading,
    refetch: fetchProductivityData
  };
}
