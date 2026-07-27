/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { AchievementService } from '../services/achievementService';
import { CareerBadge } from '../types';

export function useAchievements() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<CareerBadge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBadges = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await AchievementService.getBadges(user.id);
    setBadges(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  const unlockBadge = async (badge: Omit<CareerBadge, 'id'>) => {
    if (!user?.id) return null;
    const created = await AchievementService.unlockBadge(user.id, badge);
    if (created) {
      setBadges((prev) => [created, ...prev]);
    }
    return created;
  };

  return {
    badges,
    loading,
    refetch: fetchBadges,
    unlockBadge,
  };
}
