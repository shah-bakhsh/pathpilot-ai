/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { ProductivityService } from '../services/productivityService';
import { ProductivityTask } from '../types';

export function useTasks() {
  const { user, addXp } = useAuth();
  const [tasks, setTasks] = useState<ProductivityTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTasks = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await ProductivityService.getTasks(user.id);
    setTasks(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task: Partial<ProductivityTask>) => {
    if (!user?.id) return null;
    const created = await ProductivityService.createTask(user.id, task);
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  const updateTask = async (id: string, updates: Partial<ProductivityTask>) => {
    if (!user?.id) return;
    const isNowCompleted = updates.status === 'completed';
    await ProductivityService.updateTask(user.id, id, updates);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    if (isNowCompleted && addXp) {
      addXp(20);
      await ProductivityService.logActivity(user.id, {
        userId: user.id,
        userName: user.name || 'User',
        type: 'task_completed',
        title: 'Task Completed',
        description: `Completed task: "${tasks.find((t) => t.id === id)?.title || 'Task'}"`,
        xpEarned: 20
      });
    }
  };

  const deleteTask = async (id: string) => {
    if (!user?.id) return;
    await ProductivityService.deleteTask(user.id, id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    if (!user?.id) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.subtasks) return;

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    await updateTask(taskId, { subtasks: updatedSubtasks });
  };

  return {
    tasks,
    loading,
    refetch: fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask
  };
}
