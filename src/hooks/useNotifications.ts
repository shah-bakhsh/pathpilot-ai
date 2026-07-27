/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { NotificationService } from '../services/notificationService';
import { EnhancedNotification } from '../types';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifs = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await NotificationService.getNotifications(user.id);
    setNotifications(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchNotifs();
  }, [fetchNotifs]);

  const addNotification = async (
    title: string,
    body: string,
    type: 'info' | 'success' | 'warning' | 'streak' = 'info',
    category: EnhancedNotification['category'] = 'system',
    priority: EnhancedNotification['priority'] = 'medium',
    actionUrl?: string
  ) => {
    if (!user?.id) return null;
    const created = await NotificationService.createNotification(
      user.id,
      title,
      body,
      type,
      category,
      priority,
      actionUrl
    );
    if (created) {
      setNotifications((prev) => [created, ...prev]);
    }
    return created;
  };

  const markRead = async (id: string) => {
    if (!user?.id) return;
    await NotificationService.markRead(user.id, id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    await NotificationService.markAllRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const togglePin = async (id: string, currentPinned: boolean) => {
    if (!user?.id) return;
    await NotificationService.togglePin(user.id, id, currentPinned);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !currentPinned } : n))
    );
  };

  const toggleArchive = async (id: string, currentArchived: boolean) => {
    if (!user?.id) return;
    await NotificationService.toggleArchive(user.id, id, currentArchived);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isArchived: !currentArchived } : n))
    );
  };

  const deleteNotif = async (id: string) => {
    if (!user?.id) return;
    await NotificationService.deleteNotification(user.id, id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = async () => {
    if (!user?.id) return;
    await NotificationService.clearAll(user.id);
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read && !n.isArchived).length;

  return {
    notifications,
    loading,
    unreadCount,
    refetch: fetchNotifs,
    addNotification,
    markRead,
    markAllRead,
    togglePin,
    toggleArchive,
    deleteNotification: deleteNotif,
    clearAll
  };
}
