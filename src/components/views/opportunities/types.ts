/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EnrichedOpportunityType =
  | 'job'
  | 'internship'
  | 'scholarship'
  | 'hackathon'
  | 'competition'
  | 'research'
  | 'fellowship'
  | 'bootcamp'
  | 'course'
  | 'volunteer'
  | 'freelance'
  | 'open_source';

export interface EnrichedOpportunity {
  id: string;
  title: string;
  organization: string;
  orgLogo?: string; // CSS Color classes or Lucide identifier
  orgRating?: number; // 1-5
  type: EnrichedOpportunityType;
  location: string;
  locationType: 'remote' | 'hybrid' | 'onsite';
  country: string;
  city: string;
  deadline: string; // ISO date string (YYYY-MM-DD)
  duration?: string; // e.g. "3 months", "Permanent"
  salaryOrFunding: string; // e.g. "$120K - $150K" or "$10,000" or "Free"
  isPaid: boolean;
  requiredSkills: string[];
  educationLevel?: string; // e.g. "Bachelor's", "Any"
  description: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationProcess: string[];
  timeline: { event: string; date: string }[];
  eligibility: string[];
  selectionProcess: string[];
  resources: { name: string; url: string }[];
  faqs: { question: string; answer: string }[];
  officialWebsite: string;
  industry?: string;
  experienceLevel?: 'Entry' | 'Mid' | 'Senior' | 'Lead';
}

export interface SearchFilterState {
  searchQuery: string;
  categories: EnrichedOpportunityType[];
  locationTypes: ('remote' | 'hybrid' | 'onsite')[];
  experienceLevels: ('Entry' | 'Mid' | 'Senior' | 'Lead')[];
  country: string;
  city: string;
  isPaidOnly: boolean;
  isFreeOnly: boolean;
  skills: string[];
  duration: string;
}

export interface AIMatchDetail {
  matchPercentage: number;
  requiredSkills: string[];
  missingSkills: string[];
  resumeCompatibilityScore: number;
  priorityLevel: 'High' | 'Medium' | 'Low';
  estimatedSuccessRate: number;
  aiRecommendation: string;
}

export interface SavedSearch {
  id: string;
  query: string;
  timestamp: string;
  filters: Partial<SearchFilterState>;
}
