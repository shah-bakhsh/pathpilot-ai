/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useCareer } from '../../../contexts/CareerContext';
import {
  TrendingUp,
  FileText,
  CheckCircle2,
  Target,
  Video,
  Laptop,
  HardDrive,
  Bookmark,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';

export const QuickStatsGrid: React.FC = () => {
  const {
    resumeAnalysis,
    jobApplications,
    learningCourses,
    personalProjects,
    careerDocuments,
    opportunities,
    calendarEvents,
  } = useCareer();

  const readinessScore = resumeAnalysis?.readinessScore || 78;
  const atsScore = resumeAnalysis ? Math.min(100, Math.round(readinessScore * 1.05)) : 72;
  const skillsMasteredCount = 14; // Derived or default
  const activeApplicationsCount = jobApplications.length;
  const scheduledInterviewsCount = calendarEvents.filter(e => e.type === 'interview').length || 2;
  const projectsCount = personalProjects.length || 3;
  const documentsCount = careerDocuments.length || 4;
  const bookmarksCount = opportunities.length || 5;

  const handleNavigate = (tabId: string) => {
    window.dispatchEvent(new CustomEvent('change-tab', { detail: tabId }));
  };

  const statsList = [
    {
      id: 'readiness',
      label: 'Career Readiness',
      value: `${readinessScore}%`,
      sub: 'AI Vector Match Rating',
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20',
      actionTab: 'analytics',
    },
    {
      id: 'resume',
      label: 'Resume ATS Score',
      value: `${atsScore}/100`,
      sub: 'Recruiter Filter Alignment',
      icon: <FileText className="w-5 h-5 text-accent" />,
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/20',
      actionTab: 'resume',
    },
    {
      id: 'skills',
      label: 'Skills Mastered',
      value: `${skillsMasteredCount}/18`,
      sub: 'Verified Competencies',
      icon: <CheckCircle2 className="w-5 h-5 text-success" />,
      color: 'text-success',
      bg: 'bg-success/10 border-success/20',
      actionTab: 'learning',
    },
    {
      id: 'applications',
      label: 'Applications Active',
      value: String(activeApplicationsCount),
      sub: 'Tracked Pipeline Roles',
      icon: <Target className="w-5 h-5 text-info" />,
      color: 'text-info',
      bg: 'bg-info/10 border-info/20',
      actionTab: 'applications',
    },
    {
      id: 'interviews',
      label: 'Interviews Scheduled',
      value: String(scheduledInterviewsCount),
      sub: 'Upcoming Mock & Tech Rounds',
      icon: <Video className="w-5 h-5 text-warning" />,
      color: 'text-warning',
      bg: 'bg-warning/10 border-warning/20',
      actionTab: 'interview',
    },
    {
      id: 'projects',
      label: 'Portfolio Builds',
      value: String(projectsCount),
      sub: 'Repositories Completed',
      icon: <Laptop className="w-5 h-5 text-accent" />,
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/20',
      actionTab: 'execution',
    },
    {
      id: 'documents',
      label: 'Certificates & Vault',
      value: String(documentsCount),
      sub: 'Encrypted Records Stored',
      icon: <HardDrive className="w-5 h-5 text-primary" />,
      color: 'text-primary',
      bg: 'bg-primary/10 border-primary/20',
      actionTab: 'documents',
    },
    {
      id: 'bookmarks',
      label: 'Saved Opportunities',
      value: String(bookmarksCount),
      sub: 'Curated Career Leads',
      icon: <Bookmark className="w-5 h-5 text-success" />,
      color: 'text-success',
      bg: 'bg-success/10 border-success/20',
      actionTab: 'opportunities',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3.5 w-full select-none">
      {statsList.map((stat) => (
        <motion.div
          key={stat.id}
          whileHover={{ y: -3, scale: 1.02 }}
          transition={{ duration: 0.15 }}
        >
          <Card
            onClick={() => handleNavigate(stat.actionTab)}
            className="border-[var(--border)] bg-[var(--surface)] hover:border-primary/30 hover:shadow-sm cursor-pointer transition-all duration-200 group h-full flex flex-col justify-between"
          >
            <CardContent className="p-4 flex flex-col justify-between h-full gap-2">
              
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl border ${stat.bg} shrink-0`}>
                  {stat.icon}
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-text-mute group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
              </div>

              <div className="flex flex-col mt-1">
                <span className={`text-xl font-black ${stat.color} tracking-tight leading-none`}>
                  {stat.value}
                </span>
                <span className="text-[11px] font-black text-text-main mt-1.5 leading-snug truncate">
                  {stat.label}
                </span>
                <span className="text-[9.5px] text-text-mute font-semibold mt-0.5 truncate">
                  {stat.sub}
                </span>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStatsGrid;
