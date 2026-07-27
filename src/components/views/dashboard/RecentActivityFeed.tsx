/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCareer } from '../../../contexts/CareerContext';
import {
  Activity,
  FileText,
  Video,
  Bot,
  Target,
  BookOpen,
  HardDrive,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

export const RecentActivityFeed: React.FC = () => {
  const {
    resumeAnalysis,
    chatHistory,
    jobApplications,
    learningCourses,
    careerDocuments,
    calendarEvents,
  } = useCareer();

  const handleNavigate = (tabId: string) => {
    window.dispatchEvent(new CustomEvent('change-tab', { detail: tabId }));
  };

  const activities = [
    {
      id: 'act_resume',
      title: 'Resume Calibrated & Analyzed',
      detail: resumeAnalysis
        ? `Readiness Score: ${resumeAnalysis.readinessScore}% • ${resumeAnalysis.keywordsFound.length} keywords verified`
        : 'Resume v1.4 uploaded and audited against recruiter filter benchmarks',
      time: '2 hours ago',
      icon: <FileText className="w-4 h-4 text-primary" />,
      tab: 'resume',
      badge: 'Resume Studio',
    },
    {
      id: 'act_interview',
      title: 'AI Mock Interview Session Completed',
      detail: 'Scored 85/100 on System Design & Technical Communications round',
      time: 'Yesterday',
      icon: <Video className="w-4 h-4 text-warning" />,
      tab: 'interview',
      badge: 'Interview Simulator',
    },
    {
      id: 'act_mentor',
      title: 'AI Coach Consultation Logged',
      detail: chatHistory.length > 0
        ? `"${chatHistory[chatHistory.length - 1]?.text.slice(0, 60)}..."`
        : 'Discussed strategies for PostgreSQL indexing and Docker containerization',
      time: '1 day ago',
      icon: <Bot className="w-4 h-4 text-success" />,
      tab: 'mentor',
      badge: 'PathPilot AI',
    },
    {
      id: 'act_application',
      title: 'Job Application Pipeline Updated',
      detail: jobApplications[0]
        ? `${jobApplications[0].company} - ${jobApplications[0].role} (${jobApplications[0].status.toUpperCase()})`
        : 'Stripe - Senior Full-Stack Engineer (In Review)',
      time: '2 days ago',
      icon: <Target className="w-4 h-4 text-info" />,
      tab: 'applications',
      badge: 'Applications',
    },
    {
      id: 'act_learning',
      title: 'Learning Course Milestone Progressed',
      detail: learningCourses[0]
        ? `Logged study hours on "${learningCourses[0].title}"`
        : 'Completed 3 modules in TypeScript Advanced Types',
      time: '3 days ago',
      icon: <BookOpen className="w-4 h-4 text-accent" />,
      tab: 'learning',
      badge: 'Learning Paths',
    },
    {
      id: 'act_doc',
      title: 'Certified Document Stored in Vault',
      detail: careerDocuments[0]
        ? `Stored "${careerDocuments[0].name}" (${careerDocuments[0].type})`
        : 'Stored Cloud Architecture Certification PDF (2.4 MB)',
      time: '4 days ago',
      icon: <HardDrive className="w-4 h-4 text-primary" />,
      tab: 'documents',
      badge: 'Documents Vault',
    },
  ];

  return (
    <Card className="border-[var(--border)] bg-[var(--surface)] hover:shadow-sm transition-shadow duration-300 select-none">
      <CardHeader className="pb-3 border-b border-[var(--border)]/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-black text-text-main flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Live Career Execution Activity
          </CardTitle>
          <span className="text-xs text-text-mute font-semibold">Real-Time Event Audit</span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => handleNavigate(act.tab)}
              className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)]/15 hover:border-primary/25 hover:bg-[var(--surface)] hover:shadow-2xs transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 group"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] group-hover:bg-primary/10 transition-colors">
                    {act.icon}
                  </div>
                  <Badge variant="primary" className="text-[9px] font-black py-0.5 px-2">
                    {act.badge}
                  </Badge>
                </div>
                <span className="text-[10px] text-text-mute font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {act.time}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-black text-text-main group-hover:text-primary transition-colors leading-snug">
                  {act.title}
                </h4>
                <p className="text-[11px] text-text-sub font-medium leading-normal line-clamp-2">
                  {act.detail}
                </p>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-[var(--border)]/40 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
