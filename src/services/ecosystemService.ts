/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CommunityPost,
  MentorProfile,
  MentorBooking,
  MarketplacePlugin,
  AIDigitalTwinState,
  RecruiterCandidateMatch,
  UniversityCampus,
} from '../types/ecosystem';

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    authorName: 'Dr. Sarah Lin',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    authorRole: 'AI Research Director @ DeepMind',
    title: 'How to transition from Full-Stack Engineering to AI Systems Architecture in 2026',
    content: 'Focus on hands-on vector database optimization, RAG evaluation frameworks, and local fine-tuning of open weights models rather than generic prompt engineering.',
    category: 'ai_insights',
    likesCount: 342,
    commentsCount: 48,
    tags: ['AI', 'CareerTransition', 'DeepMind'],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'post_2',
    authorName: 'Alexander Wright',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    authorRole: 'Staff Frontend Architect @ Stripe',
    title: 'Landed Staff Engineer Role! Here is my exactSTAR response template',
    content: 'Practiced 15 mock sessions on PathPilot AI interview simulator. Key takeaway: Quantify architectural impact in terms of engineering efficiency and latency saved.',
    category: 'project_showcase',
    likesCount: 512,
    commentsCount: 89,
    tags: ['InterviewPrep', 'StaffEngineer', 'Stripe'],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

const INITIAL_MENTORS: MentorProfile[] = [
  {
    id: 'm1',
    name: 'Marcus Vance',
    title: 'Principal AI Engineer',
    company: 'Google AI',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 4.98,
    reviewsCount: 124,
    hourlyRateDollars: 150,
    expertise: ['AI/ML Architecture', 'System Design', 'FAANG Hiring'],
    bio: '12+ years in Machine Learning and Cloud Distributed Systems. Guided 200+ engineers into L6/L7 roles.',
    availableDays: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: 'm2',
    name: 'Elena Rostova',
    title: 'VP of Product',
    company: 'OpenAI',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    rating: 4.95,
    reviewsCount: 98,
    hourlyRateDollars: 180,
    expertise: ['AI Product Strategy', 'Executive Coaching', 'Resume Polish'],
    bio: 'Ex-Meta, Ex-Google. Specializing in AI Product Management and Executive Career Positioning.',
    availableDays: ['Tue', 'Thu', 'Sat'],
  },
];

const INITIAL_PLUGINS: MarketplacePlugin[] = [
  {
    id: 'plug_1',
    name: 'FAANG Resume Executive Polish Pack',
    developer: 'CareerPro AI',
    category: 'resume_template',
    description: 'High-impact ATS optimized resume templates designed specifically for Staff and Principal level roles.',
    rating: 4.9,
    downloadsCount: 14200,
    priceDollars: 0,
    installed: true,
    iconName: 'FileText',
  },
  {
    id: 'plug_2',
    name: 'System Design Mock Interview Coach',
    developer: 'ScaleArchitects',
    category: 'ai_skill',
    description: 'Autonomous AI evaluator for distributed caching, sharding, and real-time streaming system design questions.',
    rating: 4.85,
    downloadsCount: 8900,
    priceDollars: 15,
    installed: false,
    iconName: 'Cpu',
  },
];

const INITIAL_CANDIDATES: RecruiterCandidateMatch[] = [
  {
    id: 'cand_1',
    candidateName: 'Zainab Ahmed',
    targetRole: 'Senior AI Engineer',
    matchScore: 96,
    skills: ['PyTorch', 'Vector DBs', 'Gemini API', 'TypeScript'],
    atsScore: 94,
    location: 'Remote (US/EU)',
    status: 'interview_scheduled',
  },
  {
    id: 'cand_2',
    candidateName: 'Tariq Baloch',
    targetRole: 'Full-Stack Tech Lead',
    matchScore: 92,
    skills: ['React 18', 'Node.js', 'PostgreSQL', 'Cloud Infrastructure'],
    atsScore: 91,
    location: 'San Francisco, CA',
    status: 'screening',
  },
];

const INITIAL_DIGITAL_TWIN: AIDigitalTwinState = {
  id: 'twin_default',
  twinName: 'Candidate Career Digital Twin v2.5',
  synchronizationStatus: 'synced',
  careerGoalMatch: 95,
  writingStyleModel: 'Executive & Concise Technical Leadership',
  indexedDocumentsCount: 28,
  indexedInterviewHours: 14.5,
  twinPersonalityTone: 'professional',
  lastSyncTimestamp: new Date().toISOString(),
};

const INITIAL_UNIVERSITIES: UniversityCampus[] = [
  {
    id: 'uni_1',
    name: 'Stanford AI & Computer Science Dept',
    location: 'Stanford, CA',
    enrolledStudentsCount: 1420,
    placementRatePercent: 98.4,
    activePartnerships: ['Google', 'OpenAI', 'Anthropic', 'Apple'],
  },
  {
    id: 'uni_2',
    name: 'University of Balochistan AI Excellence Hub',
    location: 'Quetta, PK',
    enrolledStudentsCount: 680,
    placementRatePercent: 92.1,
    activePartnerships: ['Global Tech Remote', 'AWS Cloud', 'PathPilot AI'],
  },
];

export class EcosystemService {
  static getCommunityPosts(): CommunityPost[] {
    return INITIAL_COMMUNITY_POSTS;
  }

  static addCommunityPost(post: Omit<CommunityPost, 'id' | 'likesCount' | 'commentsCount' | 'createdAt'>): CommunityPost {
    const newPost: CommunityPost = {
      ...post,
      id: `post_${Date.now()}`,
      likesCount: 1,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };
    INITIAL_COMMUNITY_POSTS.unshift(newPost);
    return newPost;
  }

  static getMentors(): MentorProfile[] {
    return INITIAL_MENTORS;
  }

  static getPlugins(): MarketplacePlugin[] {
    return INITIAL_PLUGINS;
  }

  static togglePluginInstall(pluginId: string): void {
    const p = INITIAL_PLUGINS.find((pl) => pl.id === pluginId);
    if (p) {
      p.installed = !p.installed;
    }
  }

  static getCandidates(): RecruiterCandidateMatch[] {
    return INITIAL_CANDIDATES;
  }

  static getDigitalTwinState(): AIDigitalTwinState {
    return INITIAL_DIGITAL_TWIN;
  }

  static getUniversities(): UniversityCampus[] {
    return INITIAL_UNIVERSITIES;
  }
}
