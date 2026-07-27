/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/useAuth';
import { ProfileService } from '../services/profileService';
import { UserProfile } from '../types';

export function useProfile() {
  const { user, updateProfile: authUpdateProfile, addXp } = useAuth();
  const [profile, setProfile] = useState<Partial<UserProfile> | null>(user);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await ProfileService.getProfile(user.id);
    if (data) {
      setProfile(data);
    } else {
      setProfile(user);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) return false;
    const success = await ProfileService.updateProfile(user.id, updates);
    if (success) {
      await authUpdateProfile(updates);
      setProfile((prev) => ({ ...prev, ...updates }));
    }
    return success;
  };

  return {
    profile,
    loading,
    refetch: fetchProfile,
    updateProfile,
    addXp,
  };
}
