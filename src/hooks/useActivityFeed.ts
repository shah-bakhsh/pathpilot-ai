/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { ProductivityService } from '../services/productivityService';
import { ActivityFeedItem } from '../types';

export function useActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchActivities = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await ProductivityService.getActivityFeed(user.id);
    setActivities(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const logActivity = async (activity: Omit<ActivityFeedItem, 'id' | 'createdAt'>) => {
    if (!user?.id) return null;
    const created = await ProductivityService.logActivity(user.id, activity);
    setActivities((prev) => [created, ...prev]);
    return created;
  };

  return {
    activities,
    loading,
    refetch: fetchActivities,
    logActivity
  };
}
