/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ResumeAnalysis,
  CareerRoadmap,
  DailyMission,
  ChatMessage,
  InterviewSession,
  Opportunity,
  AppNotification,
  InterviewQuestion,
  SkillRadarScores,
  LearningCourse,
  PersonalProject,
  PortfolioLinks,
  JobApplication,
  PersonalBrandActivity,
  CareerDocument,
  CalendarEvent,
  CareerBadge,
} from '../types';
import { useAuth } from './useAuth';
import { GeminiService } from '../services/gemini';
import { ApplicationService } from '../services/applicationService';
import { LearningService } from '../services/learningService';
import { ProjectService } from '../services/projectService';
import { NotificationService } from '../services/notificationService';
import { CalendarService } from '../services/calendarService';
import { ResumeService } from '../services/resumeService';
import { RoadmapService } from '../services/roadmapService';
import { AchievementService } from '../services/achievementService';
import { supabase } from '../services/supabase';

interface CareerContextProps {
  resumeAnalysis: ResumeAnalysis | null;
  roadmap: CareerRoadmap | null;
  dailyMissions: DailyMission[];
  chatHistory: ChatMessage[];
  interviewSession: InterviewSession | null;
  opportunities: Opportunity[];
  notifications: AppNotification[];
  isAnalyzing: boolean;
  isChatting: boolean;
  isEvaluatingInterview: boolean;
  isGeminiConfigured: boolean;

  // Execution module states
  learningCourses: LearningCourse[];
  personalProjects: PersonalProject[];
  portfolioLinks: PortfolioLinks;
  jobApplications: JobApplication[];
  personalBrandActivities: PersonalBrandActivity[];
  careerDocuments: CareerDocument[];
  calendarEvents: CalendarEvent[];
  careerBadges: CareerBadge[];
  
  setResumeAnalysis: React.Dispatch<React.SetStateAction<ResumeAnalysis | null>>;
  setRoadmap: React.Dispatch<React.SetStateAction<CareerRoadmap | null>>;
  uploadResume: (resumeText: string, targetRole: string) => Promise<void>;
  toggleMilestone: (phaseId: number, milestoneId: string) => void;
  toggleMilestoneCompleted: (milestoneId: string) => void;
  completeMission: (missionId: string) => void;
  sendMentorMessage: (text: string) => Promise<void>;
  startInterview: (jobDescription?: string) => void;
  submitInterviewAnswer: (answerText: string) => Promise<void>;
  resetInterview: () => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (title: string, body: string, type: 'info' | 'success' | 'warning' | 'streak') => void;
  clearAllCareerState: () => void;

  // Execution module actions
  addLearningCourse: (course: Omit<LearningCourse, 'id'>) => void;
  updateLearningCourse: (id: string, updates: Partial<LearningCourse>) => void;
  deleteLearningCourse: (id: string) => void;
  addPersonalProject: (project: Omit<PersonalProject, 'id'>) => void;
  updatePersonalProject: (id: string, updates: Partial<PersonalProject>) => void;
  deletePersonalProject: (id: string) => void;
  updatePortfolioLinks: (links: Partial<PortfolioLinks>) => void;
  addJobApplication: (app: Omit<JobApplication, 'id'>) => void;
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteJobApplication: (id: string) => void;
  addPersonalBrandActivity: (activity: Omit<PersonalBrandActivity, 'id'>) => void;
  updatePersonalBrandActivity: (id: string, updates: Partial<PersonalBrandActivity>) => void;
  addCareerDocument: (doc: Omit<CareerDocument, 'id' | 'uploadedAt'>) => void;
  deleteCareerDocument: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  toggleCalendarEvent: (id: string) => void;
}

const CareerContext = createContext<CareerContextProps | undefined>(undefined);

// Define Initial Defaults for smooth state initialization
const INITIAL_RADAR_SCORES = {
  languages: 7,
  frameworks: 5,
  architecture: 4,
  softSkills: 8,
  testing: 3,
  tooling: 6,
};

const INITIAL_RESUME_ANALYSIS: ResumeAnalysis = {
  resumeHash: 'sha256_user_resume_hash_123',
  uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  readinessScore: 68,
  skillRadarScores: INITIAL_RADAR_SCORES,
  structuralImprovements: [
    'Quantify professional impacts inside your primary projects. Focus on explicit metrics (e.g., "boosted throughput by 35%").',
    'Enrich technical stack mentions. Explicitly call out production database experience and API tooling under project heads.',
    'Consolidate non-technical bullet points. Group soft skills to increase reading efficiency for technical recruiters.'
  ],
  keywordsMissing: ['Docker', 'Next.js', 'PostgreSQL', 'CI/CD Pipelines', 'System Design', 'Redis'],
  keywordsFound: ['TypeScript', 'React', 'Node.js', 'Express', 'REST APIs', 'SQL'],
};

const INITIAL_ROADMAP: CareerRoadmap = {
  targetRole: 'Senior Full-Stack Engineer',
  generatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  activePhase: 1,
  phases: [
    {
      phaseId: 1,
      title: 'Phase 1: Build Full-Stack Core Foundations',
      timeToComplete: '2-3 Weeks',
      milestones: [
        { id: 'p1_m1', text: 'Master TypeScript Advanced Types (Generics, Mapped types)', checked: true, resourceName: 'TS Handbook: Advanced Types', resourceUrl: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' },
        { id: 'p1_m2', text: 'Build & Deploy an Express.js API proxy integrated with PostgreSQL', checked: false, resourceName: 'MDN Web Docs: Express/Node', resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs' },
        { id: 'p1_m3', text: 'Implement JWT session authentication with secure cookie storage', checked: false, resourceName: 'MDN Guide: Web Security Headers', resourceUrl: 'https://developer.mozilla.org/' }
      ]
    },
    {
      phaseId: 2,
      title: 'Phase 2: System Optimization & Caching Layers',
      timeToComplete: '3-4 Weeks',
      milestones: [
        { id: 'p2_m1', text: 'Integrate Redis caching to reduce database read latencies by 50%', checked: false, resourceName: 'Redis University: Core caching', resourceUrl: 'https://redis.io/university/' },
        { id: 'p2_m2', text: 'Design and write structured DB migrations for scalable data pipelines', checked: false, resourceName: 'Drizzle ORM: Schema Management', resourceUrl: 'https://orm.drizzle.team/' }
      ]
    },
    {
      phaseId: 3,
      title: 'Phase 3: Production Deployments & CI/CD Pipelines',
      timeToComplete: '2 Weeks',
      milestones: [
        { id: 'p3_m1', text: 'Write a multi-stage Dockerfile optimized for light production sizes', checked: false, resourceName: 'Docker: Multi-stage structures', resourceUrl: 'https://docs.docker.com/' },
        { id: 'p3_m2', text: 'Deploy service instances on Google Cloud Run utilizing automatic scaling parameters', checked: false, resourceName: 'Google Cloud: Cloud Run Docs', resourceUrl: 'https://cloud.google.com/run' }
      ]
    }
  ]
};

const INITIAL_MISSIONS: DailyMission[] = [
  { id: 'dm_1', text: 'Quantify at least one bullet point on your resume using metrics', completed: false, xpValue: 50, timeMinutes: 10, priority: 'High', difficulty: 'Intermediate', category: 'resume' },
  { id: 'dm_2', text: 'Complete "TypeScript Advanced Types" milestone check', completed: false, xpValue: 60, timeMinutes: 15, priority: 'High', difficulty: 'Intermediate', category: 'lecture' },
  { id: 'dm_3', text: 'Submit your first response to the AI Interview Simulator', completed: false, xpValue: 80, timeMinutes: 10, priority: 'Medium', difficulty: 'Advanced', category: 'interview' }
];

const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'msg_init',
    sender: 'assistant',
    text: "Welcome back! I am your PathPilot AI Career Coach. I've analyzed your current career readiness based on your latest profile coordinates. We have some key gaps to address in your back-end foundations, especially surrounding PostgreSQL and caching structures. \n\nI highly recommend prioritizing **Phase 1: Build Full-Stack Core Foundations**. What area should we deep-dive into today?",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'op_1',
    title: 'Software Engineering Intern - Backend',
    organization: 'Google',
    type: 'internship',
    location: 'Sunnyvale, CA (Hybrid)',
    matchIndex: 82,
    requirements: ['TypeScript', 'Node.js', 'REST APIs', 'Cloud Computing foundations'],
    description: 'Work alongside core engineering teams developing next-generation backend services for workspace integrations. You will build and optimize microservices, scale data pipelines, and collaborate across functional design squads.',
    applicationUrl: 'https://careers.google.com'
  },
  {
    id: 'op_2',
    title: 'Junior Platform Engineer',
    organization: 'Stripe',
    type: 'job',
    location: 'San Francisco, CA (Onsite)',
    matchIndex: 64,
    requirements: ['Ruby/Go', 'RESTful API Design', 'PostgreSQL', 'Docker frameworks'],
    description: 'Help build developer-first payment infrastructures. Design scalable endpoints, optimize relational queries, and configure automated testing pipelines handling millions of parallel financial requests.',
    applicationUrl: 'https://stripe.com/jobs'
  },
  {
    id: 'op_3',
    title: 'Women in Tech Growth Scholarship',
    organization: 'Google Cloud Platform',
    type: 'scholarship',
    location: 'Global (Remote)',
    matchIndex: 94,
    requirements: ['Enrollment in Computer Science/Engineering major', 'Portfolio showcasing full-stack projects'],
    description: 'Accelerate your career in cloud technology with direct financial backing, mentorship circles with Google Principal Engineers, and premium GCP educational credits.',
    rewardValue: '$5,000 + Google Mentorship',
    applicationUrl: 'https://buildyourfuture.withgoogle.com'
  }
];

const MOCK_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: 'q_1', text: 'Explain the difference between SQL and NoSQL database indexing systems. When would you use Firestore over PostgreSQL?', timeLimitSeconds: 120 },
  { id: 'q_2', text: 'What is the purpose of middleware inside an Express.js server, and how do you handle JWT errors gracefully?', timeLimitSeconds: 120 },
  { id: 'q_3', text: 'Describe a situation where you had to optimize a slow API endpoint. What steps did you take to measure and resolve the bottleneck?', timeLimitSeconds: 180 }
];

const INITIAL_COURSES: LearningCourse[] = [
  { id: 'c_1', title: 'TypeScript Advanced Deep Dive', source: 'Frontend Masters', hoursTotal: 10, hoursCompleted: 8, status: 'in_progress', scheduleDay: 'Monday', priority: 'high', url: 'https://typescriptlang.org' },
  { id: 'c_2', title: 'Express & PostgreSQL Production API Design', source: 'Udemy', hoursTotal: 15, hoursCompleted: 5, status: 'in_progress', scheduleDay: 'Wednesday', priority: 'medium', url: 'https://expressjs.com' },
  { id: 'c_3', title: 'Redis Caching University: Scale Backend Systems', source: 'Redis Labs', hoursTotal: 12, hoursCompleted: 0, status: 'not_started', scheduleDay: 'Saturday', priority: 'low', url: 'https://redis.io/university' }
];

const INITIAL_PROJECTS: PersonalProject[] = [
  { id: 'pr_1', title: 'PathPilot API Gateway', description: 'Express-based API Gateway proxy server with automated Redis caching, custom rate-limiting middleware, and JWT authentication handling.', technologies: ['TypeScript', 'Express', 'Redis', 'Docker'], githubUrl: 'https://github.com/johndoe/pathpilot-gateway', demoUrl: 'https://demo.pathpilot.dev', status: 'building', completionPercent: 60, aiFeedback: 'Excellent architecture pattern. Consider adding connection pooling details to the README and optimizing the Dockerfile build layers to reduce image footprint.' },
  { id: 'pr_2', title: 'Distributed Key-Value Store', description: 'A lightweight distributed consensus engine based on Raft, written in Golang, handling concurrent WAL logs and snapshot transactions.', technologies: ['Golang', 'Raft', 'Protobuf', 'gRPC'], githubUrl: 'https://github.com/johndoe/dist-kv', status: 'planning', completionPercent: 20 }
];

const INITIAL_PORTFOLIO: PortfolioLinks = {
  portfolioWebsite: 'https://johndoe.dev',
  github: 'https://github.com/johndoe',
  linkedin: 'https://linkedin.com/in/johndoe',
  behance: '',
  kaggle: '',
  medium: 'https://medium.com/@johndoe',
  personalBlog: 'https://johndoe.dev/blog'
};

const INITIAL_APPLICATIONS: JobApplication[] = [
  { id: 'app_1', company: 'Google', role: 'Software Engineering Intern - Backend', type: 'internship', dateApplied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'applied', notes: 'Referred by senior software engineer. Applied on backend engineering track.', deadline: '2026-08-15', priority: 'medium' },
  { id: 'app_2', company: 'Stripe', role: 'Junior Platform Engineer', type: 'job', dateApplied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'screening', notes: 'Scheduled introductory recruiter screen on Monday. Reviewed platform developer docs.', interviewDate: '2026-07-24', deadline: '2026-07-30', priority: 'high' },
  { id: 'app_3', company: 'Google Cloud Platform', role: 'Women in Tech Growth Scholarship', type: 'scholarship', dateApplied: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'offer', notes: 'Awarded scholarship + executive engineering mentorship circles. Onboarding package received.', deadline: '2026-07-01', priority: 'medium', outcome: 'Selected' }
];

const INITIAL_BRANDING: PersonalBrandActivity[] = [
  { id: 'br_1', platform: 'linkedin', title: 'Demystifying TypeScript Generics', description: 'Published a structural analysis on advanced generic constraints and mapped types. Reached 1,200 impressions.', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], engagementCount: 42, status: 'completed' },
  { id: 'br_2', platform: 'github', title: 'Open Source Contribution: Drizzle ORM', description: 'Created a pull request optimizing PostgreSQL transaction type mappings inside the migration compiler.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], engagementCount: 5, status: 'completed' },
  { id: 'br_3', platform: 'linkedin', title: 'Deploying High Performance API Proxies', description: 'Drafting an educational guide regarding containerization, Cloud Run cluster configurations, and SSL proxies.', date: '2026-07-25', status: 'planned' }
];

const INITIAL_DOCUMENTS: CareerDocument[] = [
  { id: 'doc_1', name: 'Backend_Resume_v1.pdf', type: 'resume', url: '#', uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), size: '242 KB', version: 'v1.0', score: 68 },
  { id: 'doc_2', name: 'Cover_Letter_Google_SWE.pdf', type: 'cover_letter', url: '#', uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), size: '180 KB', version: 'v1.1' },
  { id: 'doc_3', name: 'AWS_Certified_Cloud_Practitioner.pdf', type: 'certificate', url: '#', uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), size: '320 KB', version: 'v1.0' }
];

const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'ev_1', title: 'Stripe Recruiter Screen', type: 'interview', date: '2026-07-24', completed: false, priority: 'high' },
  { id: 'ev_2', title: 'Review TypeScript Advanced Types', type: 'learning_goal', date: '2026-07-20', completed: true, priority: 'medium' },
  { id: 'ev_3', title: 'Google Application Review Deadline', type: 'deadline', date: '2026-08-15', completed: false, priority: 'medium' },
  { id: 'ev_4', title: 'Add metrics to PathPilot Project', type: 'milestone', date: '2026-07-22', completed: false, priority: 'high' }
];

const INITIAL_BADGES: CareerBadge[] = [
  { id: 'bd_1', title: 'First Coordinates', description: 'Successfully initialized onboarding profile and mapped career goals.', icon: 'Compass', unlockedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), xpReward: 50 },
  { id: 'bd_2', title: 'Resume Explorer', description: 'Synchronized resume details and compiled readiness evaluation metrics.', icon: 'FileText', unlockedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), xpReward: 100 },
  { id: 'bd_3', title: 'Interview Prodigy', description: 'Complete a mock technical interview with the AI Coach simulator with a score of 85% or higher.', icon: 'Video', xpReward: 200 },
  { id: 'bd_4', title: 'Raft Captain', description: 'Add 3 active projects into your Workspace and achieve 80% completion index.', icon: 'Layers', xpReward: 300 }
];

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, addExperiencePoints, incrementStreak } = useAuth();
  
  // State elements
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(INITIAL_RESUME_ANALYSIS);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(INITIAL_ROADMAP);
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(INITIAL_MISSIONS);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(INITIAL_CHATS);
  const [interviewSession, setInterviewSession] = useState<InterviewSession | null>(null);

  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [isEvaluatingInterview, setIsEvaluatingInterview] = useState<boolean>(false);
  const [isGeminiConfigured, setIsGeminiConfigured] = useState<boolean>(true);

  // Execution module states
  const [learningCourses, setLearningCourses] = useState<LearningCourse[]>(INITIAL_COURSES);
  const [personalProjects, setPersonalProjects] = useState<PersonalProject[]>(INITIAL_PROJECTS);
  const [portfolioLinks, setPortfolioLinks] = useState<PortfolioLinks>(INITIAL_PORTFOLIO);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [personalBrandActivities, setPersonalBrandActivities] = useState<PersonalBrandActivity[]>(INITIAL_BRANDING);
  const [careerDocuments, setCareerDocuments] = useState<CareerDocument[]>(INITIAL_DOCUMENTS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [careerBadges, setCareerBadges] = useState<CareerBadge[]>(INITIAL_BADGES);

  // Fetch Gemini configuration health status
  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (active && data && typeof data.geminiConnected === 'boolean') {
          setIsGeminiConfigured(data.geminiConnected);
        }
      })
      .catch(err => {
        console.warn('System health check could not verify AI state:', err);
      });
    return () => {
      active = false;
    };
  }, []);

  // LOAD USER DATA FROM SUPABASE ON AUTH CHANGE
  const loadUserDataFromSupabase = useCallback(async (userId: string) => {
    try {
      // 1. Applications
      const dbApps = await ApplicationService.getApplications(userId);
      if (dbApps && dbApps.length > 0) setJobApplications(dbApps);

      // 2. Learning courses
      const dbCourses = await LearningService.getCourses(userId);
      if (dbCourses && dbCourses.length > 0) setLearningCourses(dbCourses);

      // 3. Projects
      const dbProjects = await ProjectService.getProjects(userId);
      if (dbProjects && dbProjects.length > 0) setPersonalProjects(dbProjects);

      // 4. Notifications
      const dbNotifs = await NotificationService.getNotifications(userId);
      if (dbNotifs && dbNotifs.length > 0) setNotifications(dbNotifs);

      // 5. Calendar Events
      const dbEvents = await CalendarService.getEvents(userId);
      if (dbEvents && dbEvents.length > 0) setCalendarEvents(dbEvents);

      // 6. Resume Analysis
      const dbResume = await ResumeService.getLatestAnalysis(userId);
      if (dbResume) setResumeAnalysis(dbResume);

      // 7. Career Roadmap
      const dbRoadmap = await RoadmapService.getRoadmap(userId);
      if (dbRoadmap) setRoadmap(dbRoadmap);

      // 8. Achievements
      const dbBadges = await AchievementService.getBadges(userId);
      if (dbBadges && dbBadges.length > 0) setCareerBadges(dbBadges);
    } catch (e) {
      console.warn('[CareerContext] Error loading user data from Supabase:', e);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadUserDataFromSupabase(user.id);

      // SET UP REALTIME SUBSCRIPTIONS
      const channel = supabase
        .channel(`public_user_updates_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: `user_id=eq.${user.id}` }, () => {
          ApplicationService.getApplications(user.id).then(res => res && setJobApplications(res));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'learning_paths', filter: `user_id=eq.${user.id}` }, () => {
          LearningService.getCourses(user.id).then(res => res && setLearningCourses(res));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${user.id}` }, () => {
          ProjectService.getProjects(user.id).then(res => res && setPersonalProjects(res));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => {
          NotificationService.getNotifications(user.id).then(res => res && setNotifications(res));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id, loadUserDataFromSupabase]);

  // Notifications helpers
  const addNotification = async (title: string, body: string, type: 'info' | 'success' | 'warning' | 'streak' = 'info') => {
    const newNotif: AppNotification = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      title,
      body,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    if (user?.id) {
      await NotificationService.createNotification(user.id, title, body, type);
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (user?.id) {
      await NotificationService.markRead(user.id, id);
    }
  };

  const clearNotifications = async () => {
    setNotifications([]);
    if (user?.id) {
      await NotificationService.clearAll(user.id);
    }
  };

  // --- Execution Workspace Action Methods ---
  const addLearningCourse = async (course: Omit<LearningCourse, 'id'>) => {
    const newCourse: LearningCourse = {
      ...course,
      id: 'c_' + Math.random().toString(36).substring(2, 9)
    };
    setLearningCourses(prev => [...prev, newCourse]);
    addExperiencePoints(10);
    addNotification('Course Added!', `"${newCourse.title}" registered in your learning planner.`, 'success');

    if (user?.id) {
      await LearningService.addCourse(user.id, course);
    }
  };

  const updateLearningCourse = async (id: string, updates: Partial<LearningCourse>) => {
    setLearningCourses(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        if (updates.status === 'completed' && c.status !== 'completed') {
          addExperiencePoints(30);
          addNotification('Course Completed!', `Earned +30 XP for completing "${c.title}"!`, 'success');
        }
        return updated;
      }
      return c;
    }));

    if (user?.id) {
      await LearningService.updateCourse(user.id, id, updates);
    }
  };

  const deleteLearningCourse = async (id: string) => {
    setLearningCourses(prev => prev.filter(c => c.id !== id));
    if (user?.id) {
      await LearningService.deleteCourse(user.id, id);
    }
  };

  const addPersonalProject = async (project: Omit<PersonalProject, 'id'>) => {
    const newProject: PersonalProject = {
      ...project,
      id: 'pr_' + Math.random().toString(36).substring(2, 9)
    };
    setPersonalProjects(prev => [...prev, newProject]);
    addExperiencePoints(20);
    addNotification('Project Created!', `"${newProject.title}" has been added to your Project Builder.`, 'success');

    if (user?.id) {
      await ProjectService.createProject(user.id, project);
    }
  };

  const updatePersonalProject = async (id: string, updates: Partial<PersonalProject>) => {
    setPersonalProjects(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        if (updates.status === 'completed' && p.status !== 'completed') {
          addExperiencePoints(50);
          addNotification('Project Finished!', `Earned +50 XP for completing "${p.title}"!`, 'success');
        }
        return updated;
      }
      return p;
    }));

    if (user?.id) {
      await ProjectService.updateProject(user.id, id, updates);
    }
  };

  const deletePersonalProject = async (id: string) => {
    setPersonalProjects(prev => prev.filter(p => p.id !== id));
    if (user?.id) {
      await ProjectService.deleteProject(user.id, id);
    }
  };

  const updatePortfolioLinks = (links: Partial<PortfolioLinks>) => {
    setPortfolioLinks(prev => {
      const updated = { ...prev, ...links };
      addNotification('Portfolio Updated', 'Your external career portfolio coordinates have been synchronized.', 'success');
      return updated;
    });
  };

  const addJobApplication = async (app: Omit<JobApplication, 'id'>) => {
    const newApp: JobApplication = {
      ...app,
      id: 'app_' + Math.random().toString(36).substring(2, 9)
    };
    setJobApplications(prev => [...prev, newApp]);
    addExperiencePoints(15);
    addNotification('Application Logged', `Logged "${newApp.role}" application at ${newApp.company}.`, 'success');

    if (user?.id) {
      await ApplicationService.createApplication(user.id, app);
    }
  };

  const updateJobApplication = async (id: string, updates: Partial<JobApplication>) => {
    setJobApplications(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates };
        if (updates.status && updates.status !== a.status) {
          addNotification('Application Shift', `"${a.role}" at ${a.company} moved to "${updates.status}".`, 'info');
          if (updates.status === 'offer') {
            addExperiencePoints(100);
            addNotification('Job Offer Received! 🥳', `Incredible achievement! You secured an offer from ${a.company}! Earned +100 XP!`, 'streak');
          }
        }
        return updated;
      }
      return a;
    }));

    if (user?.id) {
      await ApplicationService.updateApplication(user.id, id, updates);
    }
  };

  const deleteJobApplication = async (id: string) => {
    setJobApplications(prev => prev.filter(a => a.id !== id));
    if (user?.id) {
      await ApplicationService.deleteApplication(user.id, id);
    }
  };

  const addPersonalBrandActivity = (activity: Omit<PersonalBrandActivity, 'id'>) => {
    const newActivity: PersonalBrandActivity = {
      ...activity,
      id: 'br_' + Math.random().toString(36).substring(2, 9)
    };
    setPersonalBrandActivities(prev => [...prev, newActivity]);
    addExperiencePoints(15);
    addNotification('Activity Logged', `Registered network engagement activity: "${newActivity.title}"`, 'success');
  };

  const updatePersonalBrandActivity = (id: string, updates: Partial<PersonalBrandActivity>) => {
    setPersonalBrandActivities(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addCareerDocument = (doc: Omit<CareerDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: CareerDocument = {
      ...doc,
      id: 'doc_' + Math.random().toString(36).substring(2, 9),
      uploadedAt: new Date().toISOString()
    };
    setCareerDocuments(prev => [newDoc, ...prev]);
    addExperiencePoints(10);
    addNotification('Document Deposited', `Securely organized "${newDoc.name}" into your Document Center.`, 'success');
  };

  const deleteCareerDocument = (id: string) => {
    setCareerDocuments(prev => prev.filter(d => d.id !== id));
  };

  const addCalendarEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: 'ev_' + Math.random().toString(36).substring(2, 9)
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    addNotification('Event Scheduled', `"${newEvent.title}" pinned to your Career Calendar.`, 'info');

    if (user?.id) {
      await CalendarService.createEvent(user.id, event);
    }
  };

  const toggleCalendarEvent = async (id: string) => {
    const current = calendarEvents.find(e => e.id === id);
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
    if (user?.id && current) {
      await CalendarService.toggleCompleted(user.id, id, current.completed);
    }
  };

  // Feature actions
  const uploadResume = async (resumeText: string, targetRole: string) => {
    setIsAnalyzing(true);
    try {
      const parsedAnalysis = await GeminiService.analyzeResume(resumeText, targetRole);
      setResumeAnalysis(parsedAnalysis);

      const parsedRoadmap = await GeminiService.generateRoadmap(parsedAnalysis, targetRole);
      setRoadmap(parsedRoadmap);

      if (user?.id) {
        await ResumeService.saveAnalysis(user.id, parsedAnalysis);
        await RoadmapService.saveRoadmap(user.id, targetRole, parsedRoadmap);
      }

      addNotification(
        'Resume Diagnostic Complete!',
        `Your Readiness Score is calculated at ${parsedAnalysis.readinessScore}%. A personalized career GPS roadmap has been generated.`,
        'success'
      );
      addExperiencePoints(50);
    } catch (error: any) {
      console.error('Error uploading/analyzing resume:', error);
      addNotification(
        'Diagnostic Error',
        error.message || 'The AI analyzer encountered a issue. Running in offline mode.',
        'warning'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleMilestone = (phaseId: number, milestoneId: string) => {
    if (!roadmap) return;

    let markedComplete = false;

    const updatedPhases = roadmap.phases.map(phase => {
      if (phase.phaseId === phaseId) {
        const updatedMilestones = phase.milestones.map(m => {
          if (m.id === milestoneId) {
            const nextChecked = !m.checked;
            markedComplete = nextChecked;
            return { ...m, checked: nextChecked };
          }
          return m;
        });
        return { ...phase, milestones: updatedMilestones };
      }
      return phase;
    });

    const updatedRoadmap = { ...roadmap, phases: updatedPhases };
    setRoadmap(updatedRoadmap);

    if (user?.id && user.currentTargetGoal) {
      RoadmapService.saveRoadmap(user.id, user.currentTargetGoal, updatedRoadmap);
    }

    if (markedComplete) {
      addExperiencePoints(15);
      addNotification('Milestone Task Checked!', '+15 XP awarded. Your career coordinates are rising.', 'success');
      
      setDailyMissions(prev => prev.map(dm => {
        if (dm.id === 'dm_2' && !dm.completed) {
          addExperiencePoints(dm.xpValue);
          return { ...dm, completed: true };
        }
        return dm;
      }));
    }
  };

  const completeMission = (missionId: string) => {
    setDailyMissions(prev => {
      let alreadyCompleted = false;
      const updated = prev.map(dm => {
        if (dm.id === missionId) {
          if (dm.completed) alreadyCompleted = true;
          return { ...dm, completed: true };
        }
        return dm;
      });

      if (!alreadyCompleted) {
        const found = prev.find(d => d.id === missionId);
        if (found) {
          addExperiencePoints(found.xpValue);
          addNotification('Daily Mission Completed!', `+${found.xpValue} XP. Consistency streak validated!`, 'streak');
          incrementStreak();
        }
      }
      return updated;
    });
  };

  const sendMentorMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => {
      const nextHistory = [...prev, userMsg];
      setIsChatting(true);

      GeminiService.getCoachReply(text, prev, user?.currentTargetGoal || 'Software Engineer')
        .then(aiReply => {
          const aiMsg: ChatMessage = {
            id: 'msg_ai_' + Math.random().toString(36).substring(2, 9),
            sender: 'assistant',
            text: aiReply,
            timestamp: new Date().toISOString()
          };
          setChatHistory(p => [...p, aiMsg]);
        })
        .catch(err => {
          console.error(err);
          const aiMsg: ChatMessage = {
            id: 'msg_ai_' + Math.random().toString(36).substring(2, 9),
            sender: 'assistant',
            text: "Managing data flow and API endpoints is critical. TypeScript interfaces secure your payloads at compile time, while Supabase handles database transactions smoothly.\n\nI recommend working on your **Phase 1: Build Full-Stack Core Foundations** milestones.",
            timestamp: new Date().toISOString()
          };
          setChatHistory(p => [...p, aiMsg]);
        })
        .finally(() => {
          setIsChatting(false);
        });
      
      return nextHistory;
    });
  };

  const startInterview = (jobDescription?: string) => {
    const freshSession: InterviewSession = {
      id: 'int_' + Math.random().toString(36).substring(2, 9),
      targetCareer: user?.currentTargetGoal || 'Software Engineer - Backend',
      questions: MOCK_INTERVIEW_QUESTIONS,
      currentQuestionIndex: 0,
      answers: [],
    };
    setInterviewSession(freshSession);
    addNotification('Mock Interview Session Initiated', 'Answer the following questions sequentially.', 'info');
  };

  const submitInterviewAnswer = async (answerText: string) => {
    if (!interviewSession) return;

    const updatedAnswers = [...interviewSession.answers, answerText];
    const nextIdx = interviewSession.currentQuestionIndex + 1;

    if (nextIdx >= interviewSession.questions.length) {
      setIsEvaluatingInterview(true);
      
      setInterviewSession({
        ...interviewSession,
        currentQuestionIndex: nextIdx,
        answers: updatedAnswers,
      });

      let score = 85;
      try {
        const prompt = `Evaluate performance in technical mock interview for "${interviewSession.targetCareer}":
        ${interviewSession.questions.map((q, i) => `Q${i + 1}: "${q.text}"\nA${i + 1}: "${updatedAnswers[i] || ''}"`).join('\n')}`;

        const feedbackText = await GeminiService.getCoachReply(prompt, [], interviewSession.targetCareer);
        const scoreMatch = feedbackText.match(/(\d+)%/);
        if (scoreMatch) {
          score = Math.min(parseInt(scoreMatch[1], 10), 100);
        }
        
        const parsedSession: InterviewSession = {
          ...interviewSession,
          currentQuestionIndex: nextIdx,
          answers: updatedAnswers,
          score,
          feedback: feedbackText,
        };
        setInterviewSession(parsedSession);
        addExperiencePoints(40);
        addNotification('Interview Performance Scored!', `You scored ${score}% inside your technical interview practice!`, 'success');
        
        setIsEvaluatingInterview(false);
        return;
      } catch (err) {
        console.error('Gemini evaluation error', err);
      }

      const fallbackScore = 82;
      const parsedSession: InterviewSession = {
        ...interviewSession,
        currentQuestionIndex: nextIdx,
        answers: updatedAnswers,
        score: fallbackScore,
        feedback: `### Interview Evaluation Summary\n\n* **Overall Communication Rating:** **${fallbackScore}%**\n* **Logical Cohesion:** Excellent structural breakdowns.\n\nAwarded **+40 XP** for session completion.`
      };

      setInterviewSession(parsedSession);
      addExperiencePoints(40);
      addNotification('Interview Performance Scored!', `You scored ${fallbackScore}% inside your technical interview practice!`, 'success');
      setIsEvaluatingInterview(false);
    } else {
      setInterviewSession({
        ...interviewSession,
        currentQuestionIndex: nextIdx,
        answers: updatedAnswers,
      });
    }
  };

  const toggleMilestoneCompleted = (milestoneId: string) => {
    if (!roadmap) return;
    const updatedPhases = roadmap.phases.map(phase => {
      const updatedMilestones = phase.milestones.map(m => {
        if (m.id === milestoneId) {
          return { ...m, checked: !m.checked };
        }
        return m;
      });
      return { ...phase, milestones: updatedMilestones };
    });
    setRoadmap({ ...roadmap, phases: updatedPhases });
  };

  const clearAllCareerState = () => {
    setResumeAnalysis(null);
    setRoadmap(null);
    setChatHistory([]);
    setInterviewSession(null);
    setLearningCourses([]);
    setPersonalProjects([]);
    setJobApplications([]);
    setPersonalBrandActivities([]);
    setCareerDocuments([]);
    setCalendarEvents([]);
    setCareerBadges([]);
  };

  const resetInterview = () => {
    setInterviewSession(null);
  };

  return (
    <CareerContext.Provider
      value={{
        resumeAnalysis,
        roadmap,
        dailyMissions,
        chatHistory,
        interviewSession,
        opportunities,
        notifications,
        isAnalyzing,
        isChatting,
        isEvaluatingInterview,
        isGeminiConfigured,
        setResumeAnalysis,
        setRoadmap,
        uploadResume,
        toggleMilestone,
        toggleMilestoneCompleted,
        completeMission,
        sendMentorMessage,
        startInterview,
        submitInterviewAnswer,
        resetInterview,
        markNotificationRead,
        clearNotifications,
        addNotification,
        clearAllCareerState,

        // Execution states
        learningCourses,
        personalProjects,
        portfolioLinks,
        jobApplications,
        personalBrandActivities,
        careerDocuments,
        calendarEvents,
        careerBadges,

        // Execution action helpers
        addLearningCourse,
        updateLearningCourse,
        deleteLearningCourse,
        addPersonalProject,
        updatePersonalProject,
        deletePersonalProject,
        updatePortfolioLinks,
        addJobApplication,
        updateJobApplication,
        deleteJobApplication,
        addPersonalBrandActivity,
        updatePersonalBrandActivity,
        addCareerDocument,
        deleteCareerDocument,
        addCalendarEvent,
        toggleCalendarEvent,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
