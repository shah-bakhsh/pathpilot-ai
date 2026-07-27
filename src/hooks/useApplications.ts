/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { ApplicationService } from '../services/applicationService';
import { JobApplication } from '../types';

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchApps = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await ApplicationService.getApplications(user.id);
    setApplications(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const addApplication = async (app: Omit<JobApplication, 'id'>) => {
    if (!user?.id) return null;
    const created = await ApplicationService.createApplication(user.id, app);
    if (created) {
      setApplications((prev) => [created, ...prev]);
    }
    return created;
  };

  const updateApplication = async (id: string, updates: Partial<JobApplication>) => {
    if (!user?.id) return false;
    const ok = await ApplicationService.updateApplication(user.id, id, updates);
    if (ok) {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    }
    return ok;
  };

  const deleteApplication = async (id: string) => {
    if (!user?.id) return false;
    const ok = await ApplicationService.deleteApplication(user.id, id);
    if (ok) {
      setApplications((prev) => prev.filter((a) => a.id !== id));
    }
    return ok;
  };

  return {
    applications,
    loading,
    refetch: fetchApps,
    addApplication,
    updateApplication,
    deleteApplication,
  };
}
