/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { CareerBadge } from '../types';

export class AchievementService {
  /**
   * Fetch unlocked user badges
   */
  static async getBadges(userId: string): Promise<CareerBadge[]> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error || !data) return [];

      return data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        icon: item.icon || 'Award',
        unlockedAt: item.unlocked_at,
        xpReward: item.xp_reward || 0,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Unlock a new badge for user
   */
  static async unlockBadge(userId: string, badge: Omit<CareerBadge, 'id'>): Promise<CareerBadge | null> {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert({
          user_id: userId,
          badge_id: badge.title.toLowerCase().replace(/\s+/g, '_'),
          title: badge.title,
          description: badge.description,
          icon: badge.icon,
          xp_reward: badge.xpReward || 50,
          unlocked_at: badge.unlockedAt || new Date().toISOString(),
        })
        .select()
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        icon: data.icon,
        unlockedAt: data.unlocked_at,
        xpReward: data.xp_reward,
      };
    } catch {
      return null;
    }
  }
}
