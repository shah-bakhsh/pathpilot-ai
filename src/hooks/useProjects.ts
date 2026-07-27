/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { ProjectService } from '../services/projectService';
import { PersonalProject } from '../types';

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<PersonalProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProjects = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await ProjectService.getProjects(user.id);
    setProjects(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (project: Omit<PersonalProject, 'id'>) => {
    if (!user?.id) return null;
    const created = await ProjectService.createProject(user.id, project);
    if (created) {
      setProjects((prev) => [created, ...prev]);
    }
    return created;
  };

  const updateProject = async (id: string, updates: Partial<PersonalProject>) => {
    if (!user?.id) return false;
    const ok = await ProjectService.updateProject(user.id, id, updates);
    if (ok) {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    }
    return ok;
  };

  const deleteProject = async (id: string) => {
    if (!user?.id) return false;
    const ok = await ProjectService.deleteProject(user.id, id);
    if (ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    return ok;
  };

  return {
    projects,
    loading,
    refetch: fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  };
}
