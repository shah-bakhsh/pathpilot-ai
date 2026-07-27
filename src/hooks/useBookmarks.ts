/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { BookmarkService } from '../services/bookmarkService';
import { Opportunity } from '../types';

export function useBookmarks() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookmarks = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await BookmarkService.getSavedJobs(user.id);
    setSavedJobs(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const saveJob = async (opp: Opportunity) => {
    if (!user?.id) return false;
    const ok = await BookmarkService.saveJob(user.id, opp);
    if (ok) {
      setSavedJobs((prev) => [opp, ...prev.filter((o) => o.id !== opp.id)]);
    }
    return ok;
  };

  const removeJob = async (id: string) => {
    if (!user?.id) return false;
    const ok = await BookmarkService.removeSavedJob(user.id, id);
    if (ok) {
      setSavedJobs((prev) => prev.filter((o) => o.id !== id));
    }
    return ok;
  };

  return {
    savedJobs,
    loading,
    refetch: fetchBookmarks,
    saveJob,
    removeJob,
  };
}
