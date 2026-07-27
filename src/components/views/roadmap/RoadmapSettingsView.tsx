/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { RoadmapSettings } from '../../../types';
import {
  Settings,
  Sparkles,
  Sliders,
  Check,
  RotateCcw,
  Bell,
  Target
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface RoadmapSettingsViewProps {
  settings?: RoadmapSettings;
  onSaveSettings?: (settings: RoadmapSettings) => void;
  onResetData?: () => void;
}

export function RoadmapSettingsView({ settings, onSaveSettings, onResetData }: RoadmapSettingsViewProps) {
  const [autoAdapt, setAutoAdapt] = useState(settings?.autoAdaptOnTaskComplete ?? true);
  const [dailyCount, setDailyCount] = useState(settings?.dailyMissionTargetCount ?? 4);
  const [reminders, setReminders] = useState(settings?.reminderNotifications ?? true);
  const [difficulty, setDifficulty] = useState<'Balanced' | 'Aggressive' | 'Gentle'>(settings?.difficultyPreference ?? 'Balanced');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveSettings) {
      onSaveSettings({
        autoAdaptOnTaskComplete: autoAdapt,
        dailyMissionTargetCount: dailyCount,
        reminderNotifications: reminders,
        weeklyReviewDay: 'Sunday',
        difficultyPreference: difficulty
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 bg-surface-raised rounded-2xl border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
            <Settings className="w-3.5 h-3.5 mr-1" /> System Preferences
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Roadmap & Mission Settings</h2>
          <p className="text-sm text-muted-foreground">Configure AI auto-adaptation parameters, mission daily targets, and sync settings.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border border-border/60 bg-surface-raised p-6 space-y-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> AI Auto-Adaptation Engine
          </CardTitle>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAdapt}
                onChange={e => setAutoAdapt(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-bold text-foreground block">Auto-Regenerate Roadmap on Task Completion</span>
                <span className="text-xs text-muted-foreground">Automatically recalculate remaining milestones and suggest next priority missions when you complete tasks.</span>
              </div>
            </label>

            <div className="pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Target Daily Mission Count</label>
                <select
                  value={dailyCount}
                  onChange={e => setDailyCount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-background rounded-lg border border-border/60 text-foreground"
                >
                  <option value={3}>3 Missions / Day (Light)</option>
                  <option value={4}>4 Missions / Day (Recommended)</option>
                  <option value={6}>6 Missions / Day (Intensive)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Pacing & Difficulty Preference</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-background rounded-lg border border-border/60 text-foreground"
                >
                  <option value="Gentle">Gentle Pacing (Steady)</option>
                  <option value="Balanced">Balanced (Optimal Growth)</option>
                  <option value="Aggressive">Aggressive (Fast-Track Transition)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border border-border/60 bg-surface-raised p-6 space-y-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> Notifications & Reminders
          </CardTitle>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={reminders}
              onChange={e => setReminders(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <span className="text-sm font-bold text-foreground block">Enable Daily Mission & Milestone Reminders</span>
              <span className="text-xs text-muted-foreground">Receive subtle in-app notifications for upcoming task deadlines and streak milestones.</span>
            </div>
          </label>
        </Card>

        <div className="flex items-center justify-between pt-2">
          {onResetData ? (
            <Button type="button" variant="outline" onClick={onResetData} className="text-red-600 border-red-500/20 hover:bg-red-500/10 gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Re-Sync Local & Supabase Cache
            </Button>
          ) : <div />}

          <Button type="submit" className="bg-primary text-primary-foreground gap-2">
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            {savedSuccess ? 'Preferences Saved!' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
