/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedDocType =
  | 'resume'
  | 'cv'
  | 'cover_letter'
  | 'statement_of_purpose'
  | 'motivation_letter'
  | 'personal_statement'
  | 'research_proposal'
  | 'scholarship_essay'
  | 'internship_letter'
  | 'job_letter'
  | 'recommendation_letter'
  | 'professional_bio'
  | 'linkedin_about'
  | 'linkedin_headline'
  | 'portfolio_desc'
  | 'project_desc'
  | 'cold_email'
  | 'networking_message'
  | 'thank_you_email'
  | 'followup_email'
  | 'internship_request'
  | 'research_email'
  | 'freelance_proposal'
  | 'business_proposal'
  | 'custom';

export type WritingStyle = 'Executive' | 'Technical' | 'Academic' | 'Creative' | 'Direct' | 'Passionate';
export type ToneOption = 'Formal' | 'Professional' | 'Friendly' | 'Academic' | 'Persuasive' | 'Confident';
export type ExportFormat = 'pdf' | 'docx' | 'markdown' | 'html' | 'txt';

export interface DocumentAnalytics {
  wordCount: number;
  readingTimeMinutes: number;
  grammarScore: number;
  readabilityScore: number;
  atsScore: number;
  toneScore: number;
  actionabilityScore: number;
  improvementSuggestions: string[];
  keyHighlights: string[];
}

export interface AppDocument {
  id: string;
  user_id: string;
  title: string;
  doc_type: SupportedDocType;
  content: string;
  folder_id?: string;
  tags: string[];
  is_pinned: boolean;
  is_favorite: boolean;
  is_archived: boolean;
  status: 'draft' | 'final' | 'review';
  version_count: number;
  created_at: string;
  updated_at: string;
  metadata?: {
    targetCompany?: string;
    targetRole?: string;
    targetUniversity?: string;
    targetScholarship?: string;
    targetProgram?: string;
    targetCountry?: string;
    writingStyle?: WritingStyle;
    tone?: ToneOption;
    keyAchievements?: string[];
    jobDescription?: string;
  };
  analytics?: DocumentAnalytics;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  title: string;
  content: string;
  changes_summary: string;
  created_at: string;
}

export interface DocumentFolder {
  id: string;
  user_id: string;
  name: string;
  category: 'Applications' | 'Scholarships' | 'Research' | 'Internships' | 'Jobs' | 'University' | 'Custom';
  icon?: string;
  color?: string;
  created_at: string;
}

export interface DocumentTag {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: 'Software Engineer' | 'AI Engineer' | 'Data Scientist' | 'Cybersecurity' | 'Research' | 'Scholarships' | 'Internships' | 'Graduate School' | 'MBA' | 'PhD' | 'Startup' | 'Business' | 'Creative' | 'Academic';
  doc_type: SupportedDocType;
  description: string;
  icon?: string;
  content: string;
  tags: string[];
  is_popular?: boolean;
}

export interface DocumentExport {
  id: string;
  document_id: string;
  export_format: ExportFormat;
  file_url?: string;
  created_at: string;
}

export interface DocumentSettings {
  defaultTypography: 'Sans-Serif' | 'Serif' | 'Monospace';
  autoSaveIntervalSeconds: number;
  preferredTone: ToneOption;
  exportPageSize: 'A4' | 'Letter';
}

export interface GenerateDocParams {
  docType: SupportedDocType;
  title?: string;
  targetCompany?: string;
  targetRole?: string;
  targetUniversity?: string;
  targetScholarship?: string;
  targetProgram?: string;
  targetCountry?: string;
  jobDescription?: string;
  writingStyle?: WritingStyle;
  tone?: ToneOption;
  keyAchievements?: string;
  userProfile?: {
    name?: string;
    targetRole?: string;
    skills?: string[];
    experienceSummary?: string;
    education?: string;
    projects?: string[];
    bio?: string;
  };
}

export interface WritingAssistantParams {
  content: string;
  action: 'rewrite' | 'expand' | 'shorten' | 'tone_shift' | 'grammar_fix' | 'paraphrase' | 'summarize' | 'ats_optimize' | 'improve_structure' | 'improve_clarity';
  tone?: ToneOption;
  targetRole?: string;
  keywordsToInclude?: string[];
}
