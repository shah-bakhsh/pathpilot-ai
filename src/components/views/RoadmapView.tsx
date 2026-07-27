/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCareer } from '../../contexts/CareerContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Map,
  Milestone,
  Flame,
  Calendar,
  Target,
  GraduationCap,
  Award,
  Code2,
  Briefcase,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Import Subviews
import { CareerRoadmapView } from './roadmap/CareerRoadmapView';
import { CareerTimelineView } from './roadmap/CareerTimelineView';
import { DailyMissionsView } from './roadmap/DailyMissionsView';
import { WeeklyPlannerView } from './roadmap/WeeklyPlannerView';
import { MonthlyGoalsView } from './roadmap/MonthlyGoalsView';
import { LearningPlanView } from './roadmap/LearningPlanView';
import { CertificationPlannerView } from './roadmap/CertificationPlannerView';
import { ProjectPlannerView } from './roadmap/ProjectPlannerView';
import { JobPrepView } from './roadmap/JobPrepView';
import { RoadmapAnalyticsView } from './roadmap/RoadmapAnalyticsView';
import { RoadmapSettingsView } from './roadmap/RoadmapSettingsView';

export function RoadmapView() {
  const { user } = useAuth();
  const {
    roadmap,
    dailyMissions,
    toggleMilestone,
    completeMission,
    uploadResume,
    isAnalyzing
  } = useCareer();

  const [activeSubTab, setActiveSubTab] = useState<string>('roadmap');
  const [isGenerating, setIsGenerating] = useState(false);

  // Local state for execution entities
  const [weeklyGoals, setWeeklyGoals] = useState<any[]>([
    { id: 'wg_1', title: 'Master Advanced TypeScript Types & Generics', description: 'Complete mapped types, conditional types, and utility types exercises.', category: 'Learning', weekStartDate: '2026-07-20', weekEndDate: '2026-07-27', status: 'in_progress', priority: 'High', tasksCount: 4, completedTasksCount: 2, xpValue: 200 },
    { id: 'wg_2', title: 'Deploy Containerized Express Microservice on Cloud Run', description: 'Setup Dockerfile, build container image, and deploy to GCP Cloud Run.', category: 'Projects', weekStartDate: '2026-07-20', weekEndDate: '2026-07-27', status: 'in_progress', priority: 'High', tasksCount: 3, completedTasksCount: 1, xpValue: 250 }
  ]);

  const [monthlyGoals, setMonthlyGoals] = useState<any[]>([
    { id: 'mg_1', title: 'Complete Full-Stack Technical Capstone Project', description: 'Build and deploy a production-ready application with CI/CD and DB persistence.', monthYear: 'August 2026', targetMetric: '1 Live Project', currentMetric: 1, targetMetricValue: 1, status: 'in_progress', progressPercent: 65, xpValue: 500 },
    { id: 'mg_2', title: 'Land 5 Recruiter Screening Calls', description: 'Submit 25 tailored applications and engage tech recruiters on LinkedIn.', monthYear: 'August 2026', targetMetric: '5 Screenings', currentMetric: 2, targetMetricValue: 5, status: 'in_progress', progressPercent: 40, xpValue: 600 }
  ]);

  const [certifications, setCertifications] = useState<any[]>([
    { id: 'cp_1', title: 'Google Cloud Certified Professional Cloud Architect', issuer: 'Google Cloud', difficulty: 'Advanced', status: 'in_progress', cost: '$200', targetDate: '2026-09-30', skillsValidated: ['Cloud Architecture', 'Kubernetes', 'Security'] },
    { id: 'cp_2', title: 'AWS Certified Solutions Architect – Associate', issuer: 'AWS', difficulty: 'Intermediate', status: 'planned', cost: '$150', targetDate: '2026-10-31', skillsValidated: ['S3', 'EC2', 'Lambda', 'DynamoDB'] }
  ]);

  const [projects, setProjects] = useState<any[]>([
    { id: 'pp_1', title: 'Distributed Event Analytics Engine', objective: 'High-throughput event processing platform built with Node.js, Kafka, PostgreSQL.', difficulty: 'Industry-Level', estimatedDuration: '3 Weeks', portfolioValue: 'Essential', requiredSkills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'], status: 'building', completionPercent: 50 },
    { id: 'pp_2', title: 'PathPilot AI Career Operating System', objective: 'Full-stack AI platform built with React, Vite, Express, and Gemini API.', difficulty: 'Advanced', estimatedDuration: '2 Weeks', portfolioValue: 'Essential', requiredSkills: ['React', 'TypeScript', 'Tailwind', 'Gemini API'], status: 'completed', completionPercent: 100 }
  ]);

  const handleRegenerateFullRoadmap = async () => {
    setIsGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const navItems = [
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'timeline', label: 'Timeline', icon: Milestone },
    { id: 'daily', label: 'Daily Missions', icon: Flame, badge: dailyMissions.filter(m => !m.completed).length },
    { id: 'weekly', label: 'Weekly Planner', icon: Calendar },
    { id: 'monthly', label: 'Monthly Goals', icon: Target },
    { id: 'learning', label: 'Learning Plan', icon: GraduationCap },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'projects', label: 'Project Planner', icon: Code2 },
    { id: 'jobprep', label: 'Job Prep', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-4">
      {/* Top Operating System Sub-Navigation Bar */}
      <div className="bg-surface-raised dark:bg-zinc-900 p-1.5 rounded-2xl border border-border/60 shadow-xs flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 select-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={cn(
                  "px-1.5 py-0.2 text-[10px] rounded-full font-extrabold",
                  isActive ? "bg-white/20 text-white" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main View Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeSubTab === 'roadmap' && (
            <CareerRoadmapView
              roadmap={roadmap}
              onToggleTask={toggleMilestone}
              onRegenerateRoadmap={handleRegenerateFullRoadmap}
              isGenerating={isGenerating}
            />
          )}

          {activeSubTab === 'timeline' && (
            <CareerTimelineView
              timeline={[]}
              targetRole={roadmap?.targetRole || 'Software Professional'}
            />
          )}

          {activeSubTab === 'daily' && (
            <DailyMissionsView
              missions={dailyMissions}
              onCompleteMission={completeMission}
              onGenerateNewMissions={handleRegenerateFullRoadmap}
              isGenerating={isGenerating}
            />
          )}

          {activeSubTab === 'weekly' && (
            <WeeklyPlannerView
              goals={weeklyGoals}
              onSaveGoals={setWeeklyGoals}
            />
          )}

          {activeSubTab === 'monthly' && (
            <MonthlyGoalsView
              goals={monthlyGoals}
              onSaveGoals={setMonthlyGoals}
            />
          )}

          {activeSubTab === 'learning' && (
            <LearningPlanView
              learningPlans={[]}
            />
          )}

          {activeSubTab === 'certifications' && (
            <CertificationPlannerView
              certifications={certifications}
              onSaveCertifications={setCertifications}
            />
          )}

          {activeSubTab === 'projects' && (
            <ProjectPlannerView
              projects={projects}
              onSaveProjects={setProjects}
            />
          )}

          {activeSubTab === 'jobprep' && (
            <JobPrepView />
          )}

          {activeSubTab === 'analytics' && (
            <RoadmapAnalyticsView />
          )}

          {activeSubTab === 'settings' && (
            <RoadmapSettingsView />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
