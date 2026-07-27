/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Flame, Sparkles, CheckCircle2, Trophy, Star, ShieldCheck, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { useAuth } from '../../contexts/AuthContext';
import { useCareer } from '../../contexts/CareerContext';

export const AchievementsView: React.FC = () => {
  const { user } = useAuth();
  const { careerBadges } = useCareer();

  const xp = user?.experiencePoints || 320;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXp = level * 100;
  const progressInLevel = xp % 100;

  const ACHIEVEMENTS_LIST = [
    { title: 'Resume Calibrated', desc: 'Uploaded and parsed professional resume coordinates', xp: 50, unlocked: true },
    { title: 'Goal Navigator', desc: 'Defined clear career trajectory target role', xp: 30, unlocked: true },
    { title: 'Interview Pioneer', desc: 'Completed first AI mock interview session', xp: 100, unlocked: true },
    { title: 'Application Strategist', desc: 'Added 3+ job opportunities to pipeline tracker', xp: 75, unlocked: true },
    { title: 'Streak Titan', desc: 'Maintained a 5-day active execution streak', xp: 150, unlocked: (user?.activeStreak || 0) >= 5 },
    { title: 'Code Refactor Master', desc: 'Logged 20+ study hours in skill courses', xp: 200, unlocked: false },
    { title: 'Offer Acquired', desc: 'Successfully secured a technical role offer', xp: 500, unlocked: false },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-mute">
            <span>Career Operating System</span>
            <span>/</span>
            <span className="text-primary font-black">Achievements & XP</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight mt-1 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" /> Achievements, Rank & Streaks
          </h1>
          <p className="text-xs text-text-sub max-w-2xl leading-relaxed font-semibold mt-1">
            Track your XP progression, daily training streaks, level milestones, and earned industry badges.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="primary" className="text-xs font-black py-1 px-3 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-accent fill-accent" /> {user?.activeStreak || 5} Day Streak
          </Badge>
          <Badge variant="secondary" className="text-xs font-black py-1 px-3">
            Level {level} Pathfinder
          </Badge>
        </div>
      </div>

      {/* Level & XP Hero Card */}
      <Card className="border-[var(--border)] bg-linear-to-r from-primary/10 via-[var(--surface)] to-accent/5">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-primary uppercase tracking-widest">Rank Level {level}</span>
              <h3 className="text-2xl font-black text-text-main tracking-tight mt-0.5">{user?.name || 'Pathfinder Cadet'}</h3>
              <p className="text-xs text-text-sub font-semibold mt-1">
                {100 - progressInLevel} XP required to unlock Level {level + 1}
              </p>
            </div>
          </div>

          <div className="w-full md:w-72 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-black text-text-sub">
              <span>Level Progress</span>
              <span>{xp} / {nextLevelXp} XP</span>
            </div>
            <Progress value={progressInLevel} className="h-2.5 bg-[var(--border)]" />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardHeader>
          <CardTitle className="text-base font-black text-text-main flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" /> System Milestones
          </CardTitle>
          <CardDescription className="text-xs">
            Complete daily tasks, mock interviews, and course modules to earn experience points.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS_LIST.map((ach, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                ach.unlocked
                  ? 'bg-[var(--surface-secondary)]/20 border-primary/25 shadow-2xs'
                  : 'bg-[var(--surface)]/40 border-[var(--border)]/50 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-black ${
                  ach.unlocked ? 'bg-primary text-black' : 'bg-[var(--border)] text-text-mute'
                }`}
              >
                {ach.unlocked ? <CheckCircle2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-text-main">{ach.title}</h4>
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    +{ach.xp} XP
                  </span>
                </div>
                <p className="text-[11px] text-text-sub mt-1 leading-normal font-semibold">
                  {ach.desc}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementsView;
