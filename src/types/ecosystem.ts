/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  title: string;
  content: string;
  category: 'general' | 'career_advice' | 'interview_prep' | 'project_showcase' | 'ai_insights';
  likesCount: number;
  commentsCount: number;
  tags: string[];
  createdAt: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
  rating: number;
  reviewsCount: number;
  hourlyRateDollars: number;
  expertise: string[];
  bio: string;
  availableDays: string[];
}

export interface MentorBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  date: string;
  timeSlot: string;
  sessionType: 'resume_review' | 'mock_interview' | 'career_roadmap';
  status: 'confirmed' | 'pending' | 'completed';
}

export interface MarketplacePlugin {
  id: string;
  name: string;
  developer: string;
  category: 'resume_template' | 'prompt_pack' | 'automation_workflow' | 'dashboard_widget' | 'ai_skill';
  description: string;
  rating: number;
  downloadsCount: number;
  priceDollars: number;
  installed: boolean;
  iconName: string;
}

export interface AIDigitalTwinState {
  id: string;
  twinName: string;
  synchronizationStatus: 'synced' | 'indexing' | 'offline';
  careerGoalMatch: number;
  writingStyleModel: string;
  indexedDocumentsCount: number;
  indexedInterviewHours: number;
  twinPersonalityTone: 'professional' | 'executive' | 'academic' | 'technical';
  lastSyncTimestamp: string;
}

export interface RecruiterCandidateMatch {
  id: string;
  candidateName: string;
  targetRole: string;
  matchScore: number;
  skills: string[];
  atsScore: number;
  location: string;
  status: 'new' | 'screening' | 'interview_scheduled' | 'offered';
}

export interface UniversityCampus {
  id: string;
  name: string;
  location: string;
  enrolledStudentsCount: number;
  placementRatePercent: number;
  activePartnerships: string[];
}
