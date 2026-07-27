/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { RoadmapService } from '../services/roadmapService';
import { CareerRoadmap } from '../types';

export function useRoadmap() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRoadmap = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await RoadmapService.getRoadmap(user.id);
    setRoadmap(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const saveRoadmap = async (targetRole: string, newRoadmap: CareerRoadmap) => {
    if (!user?.id) return false;
    const ok = await RoadmapService.saveRoadmap(user.id, targetRole, newRoadmap);
    if (ok) {
      setRoadmap(newRoadmap);
    }
    return ok;
  };

  return {
    roadmap,
    loading,
    refetch: fetchRoadmap,
    saveRoadmap,
  };
}
