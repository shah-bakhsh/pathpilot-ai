/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { 
  ResumeRecord, 
  ResumeVersionRecord, 
  ResumeFileRecord, 
  ResumeHistoryRecord, 
  ResumeAnalysis,
  ResumeContent
} from '../types';

export class ResumeService {
  /**
   * Default blank resume structure template
   */
  static getDefaultResumeContent(userName?: string, userEmail?: string): ResumeContent {
    return {
      personalInfo: {
        fullName: userName || 'John Doe',
        email: userEmail || 'john.doe@example.com',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        headline: 'Senior Full Stack Software Engineer',
        websiteUrl: 'https://johndoe.dev',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        githubUrl: 'https://github.com/johndoe',
      },
      summary: 'Passionate and metrics-driven Software Engineer with 5+ years of experience engineering high-performance web applications, distributed APIs, and cloud microservices.',
      experience: [
        {
          id: 'exp-1',
          title: 'Senior Frontend Engineer',
          subtitle: 'TechScale Innovations',
          location: 'San Francisco, CA',
          dateRange: '2023 - Present',
          bullets: [
            'Architected micro-frontend architecture using React, Vite, and TypeScript, reducing initial load times by 38%.',
            'Integrated real-time WebSockets and Gemini AI API to power dynamic user suggestions and interactive analytics.',
            'Mentored 6 junior engineers and spearheaded automated CI/CD pipeline deployment to Google Cloud Run.'
          ]
        },
        {
          id: 'exp-2',
          title: 'Software Engineer',
          subtitle: 'CloudData Systems',
          location: 'San Jose, CA',
          dateRange: '2021 - 2023',
          bullets: [
            'Engineered RESTful Node.js/Express endpoints with PostgreSQL and Redis caching, serving 100K+ daily active users.',
            'Maintained 99.95% API uptime while scaling database read performance by optimizing SQL queries.'
          ]
        }
      ],
      education: [
        {
          id: 'edu-1',
          title: 'B.S. in Computer Science',
          subtitle: 'University of California, Berkeley',
          location: 'Berkeley, CA',
          dateRange: '2017 - 2021',
          bullets: ['Graduated with High Honors (GPA: 3.85/4.0). Specialization in Distributed Systems and AI.']
        }
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'PathPilot AI Career Operating System',
          subtitle: 'React, TypeScript, Supabase, Gemini AI',
          dateRange: '2024',
          link: 'https://github.com/example/pathpilot',
          bullets: [
            'Built real-time career roadmap tracking and automated ATS resume diagnostic engine leveraging Gemini AI.',
            'Implemented strict Row Level Security (RLS) and persistent state management with Supabase.'
          ]
        }
      ],
      skills: [
        { category: 'Languages & Core', items: ['TypeScript', 'JavaScript', 'SQL', 'Python', 'HTML5/CSS3'] },
        { category: 'Frameworks & Libraries', items: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS'] },
        { category: 'Cloud & Infrastructure', items: ['Google Cloud Run', 'Docker', 'PostgreSQL', 'Redis', 'Supabase', 'Git'] }
      ],
      certifications: [
        {
          id: 'cert-1',
          title: 'AWS Certified Solutions Architect – Associate',
          subtitle: 'Amazon Web Services',
          dateRange: '2023'
        }
      ],
      languages: [
        { language: 'English', proficiency: 'Native / Bilingual' },
        { language: 'Spanish', proficiency: 'Professional Working' }
      ],
      achievements: [
        'First place in Bay Area Hackathon 2023 out of 120 teams.',
        'Published technical whitepaper on micro-frontend state synchronization.'
      ],
      sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'languages', 'achievements']
    };
  }

  /**
   * Fetch all user resumes
   */
  static async getUserResumes(userId: string): Promise<ResumeRecord[]> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error || !data) return [];

      return data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        title: item.title,
        targetRole: item.target_role,
        templateId: item.template_id || 'modern',
        isPrimary: !!item.is_primary,
        content: item.content || {},
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch {
      return [];
    }
  }

  /**
   * Fetch primary resume for user
   */
  static async getPrimaryResume(userId: string): Promise<ResumeRecord | null> {
    const list = await this.getUserResumes(userId);
    return list.find(r => r.isPrimary) || list[0] || null;
  }

  /**
   * Fetch single resume
   */
  static async getResumeById(resumeId: string, userId: string): Promise<ResumeRecord | null> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        targetRole: data.target_role,
        templateId: data.template_id || 'modern',
        isPrimary: !!data.is_primary,
        content: data.content || {},
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch {
      return null;
    }
  }

  /**
   * Create a new resume record
   */
  static async createResume(userId: string, resumeData: Partial<ResumeRecord>): Promise<ResumeRecord | null> {
    try {
      const content = resumeData.content || this.getDefaultResumeContent();
      const insertPayload = {
        user_id: userId,
        title: resumeData.title || 'My Professional Resume',
        target_role: resumeData.targetRole || 'Software Engineer',
        template_id: resumeData.templateId || 'modern',
        is_primary: resumeData.isPrimary ?? true,
        content: content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('resumes')
        .insert(insertPayload)
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating resume in Supabase:', error);
        return null;
      }

      const createdRecord: ResumeRecord = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        targetRole: data.target_role,
        templateId: data.template_id,
        isPrimary: data.is_primary,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      // Create initial version
      await this.createVersion(data.id, userId, 'Initial Draft', content);
      await this.logHistory(userId, 'created', `Created resume "${createdRecord.title}"`, data.id);

      return createdRecord;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /**
   * Duplicate an existing resume
   */
  static async duplicateResume(resumeId: string, userId: string): Promise<ResumeRecord | null> {
    try {
      const original = await this.getResumeById(resumeId, userId);
      if (!original) return null;

      const duplicated = await this.createResume(userId, {
        title: `Copy of ${original.title}`,
        targetRole: original.targetRole,
        templateId: original.templateId,
        isPrimary: false,
        content: JSON.parse(JSON.stringify(original.content))
      });

      if (duplicated) {
        await this.logHistory(userId, 'duplicated', `Duplicated resume from "${original.title}"`, duplicated.id);
      }

      return duplicated;
    } catch {
      return null;
    }
  }

  /**
   * Set a specific resume as the primary active resume
   */
  static async setPrimaryResume(resumeId: string, userId: string): Promise<boolean> {
    try {
      // Clear current primary
      await supabase
        .from('resumes')
        .update({ is_primary: false })
        .eq('user_id', userId);

      // Set target as primary
      const { error } = await supabase
        .from('resumes')
        .update({ is_primary: true })
        .eq('id', resumeId)
        .eq('user_id', userId);

      if (!error) {
        await this.logHistory(userId, 'primary_set', `Set resume as primary`, resumeId);
      }

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Update resume
   */
  static async updateResume(resumeId: string, userId: string, updateData: Partial<ResumeRecord>): Promise<boolean> {
    try {
      const payload: any = {
        updated_at: new Date().toISOString()
      };
      if (updateData.title !== undefined) payload.title = updateData.title;
      if (updateData.targetRole !== undefined) payload.target_role = updateData.targetRole;
      if (updateData.templateId !== undefined) payload.template_id = updateData.templateId;
      if (updateData.isPrimary !== undefined) payload.is_primary = updateData.isPrimary;
      if (updateData.content !== undefined) payload.content = updateData.content;

      const { error } = await supabase
        .from('resumes')
        .update(payload)
        .eq('id', resumeId)
        .eq('user_id', userId);

      if (!error) {
        await this.logHistory(userId, 'edited', `Updated resume content`, resumeId);
      }

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Delete resume
   */
  static async deleteResume(resumeId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', userId);

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Create version snapshot
   */
  static async createVersion(resumeId: string, userId: string, versionName?: string, content?: ResumeContent): Promise<ResumeVersionRecord | null> {
    try {
      // Get highest version number
      const { data: existingVersions } = await supabase
        .from('resume_versions')
        .select('version_number')
        .eq('resume_id', resumeId)
        .eq('user_id', userId)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextNumber = existingVersions && existingVersions.length > 0 ? existingVersions[0].version_number + 1 : 1;

      // If content not supplied, fetch current resume content
      let snapshotContent = content;
      if (!snapshotContent) {
        const resume = await this.getResumeById(resumeId, userId);
        if (!resume) return null;
        snapshotContent = resume.content;
      }

      const nameToUse = versionName || `Version ${nextNumber} (${new Date().toLocaleDateString()})`;

      const { data, error } = await supabase
        .from('resume_versions')
        .insert({
          resume_id: resumeId,
          user_id: userId,
          version_number: nextNumber,
          version_name: nameToUse,
          content: snapshotContent,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        resumeId: data.resume_id,
        userId: data.user_id,
        versionNumber: data.version_number,
        versionName: data.version_name,
        content: data.content,
        createdAt: data.created_at
      };
    } catch {
      return null;
    }
  }

  /**
   * Fetch versions list for a resume
   */
  static async getVersions(resumeId: string, userId: string): Promise<ResumeVersionRecord[]> {
    try {
      const { data, error } = await supabase
        .from('resume_versions')
        .select('*')
        .eq('resume_id', resumeId)
        .eq('user_id', userId)
        .order('version_number', { ascending: false });

      if (error || !data) return [];

      return data.map((v: any) => ({
        id: v.id,
        resumeId: v.resume_id,
        userId: v.user_id,
        versionNumber: v.version_number,
        versionName: v.version_name,
        content: v.content,
        createdAt: v.created_at
      }));
    } catch {
      return [];
    }
  }

  /**
   * Restore previous version
   */
  static async restoreVersion(resumeId: string, versionId: string, userId: string): Promise<boolean> {
    try {
      const { data: versionData, error: versionError } = await supabase
        .from('resume_versions')
        .select('*')
        .eq('id', versionId)
        .eq('user_id', userId)
        .single();

      if (versionError || !versionData) return false;

      const success = await this.updateResume(resumeId, userId, {
        content: versionData.content
      });

      if (success) {
        await this.logHistory(userId, 'restored', `Restored ${versionData.version_name}`, resumeId);
      }

      return success;
    } catch {
      return false;
    }
  }

  /**
   * Upload Resume File to Supabase Storage and database
   */
  static async uploadResumeFile(userId: string, file: File, resumeId?: string): Promise<ResumeFileRecord | null> {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${userId}/${Date.now()}_${cleanFileName}`;

      // Upload to Supabase Storage 'resumes' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        // Fallback: continue database insert if storage has mock fallback
      }

      // Get public or signed URL
      let publicUrl = '';
      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(storagePath);
      if (urlData) {
        publicUrl = urlData.publicUrl;
      }

      // Insert record into resume_files table
      const { data, error } = await supabase
        .from('resume_files')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_path: storagePath,
          file_size: file.size,
          version: `v${new Date().toISOString().substring(0, 10)}`,
          is_active: true,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error || !data) {
        console.error('DB resume_files Error:', error);
      }

      const fileRecord: ResumeFileRecord = {
        id: data?.id || `file_${Date.now()}`,
        userId: userId,
        resumeId: resumeId,
        fileName: file.name,
        filePath: storagePath,
        fileSize: file.size,
        mimeType: file.type || `application/${fileExt}`,
        version: data?.version || 'v1.0',
        isActive: true,
        uploadedAt: data?.uploaded_at || new Date().toISOString(),
        publicUrl: publicUrl
      };

      await this.logHistory(userId, 'uploaded', `Uploaded resume file "${file.name}"`, resumeId);

      return fileRecord;
    } catch (err) {
      console.error('Error uploading resume file:', err);
      return null;
    }
  }

  /**
   * Fetch all uploaded resume files for user
   */
  static async getResumeFiles(userId: string): Promise<ResumeFileRecord[]> {
    try {
      const { data, error } = await supabase
        .from('resume_files')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error || !data) return [];

      return data.map((f: any) => {
        const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(f.file_path);
        return {
          id: f.id,
          userId: f.user_id,
          fileName: f.file_name,
          filePath: f.file_path,
          fileSize: f.file_size || 0,
          version: f.version || 'v1.0',
          isActive: !!f.is_active,
          uploadedAt: f.uploaded_at,
          publicUrl: urlData?.publicUrl || ''
        };
      });
    } catch {
      return [];
    }
  }

  /**
   * Delete uploaded file
   */
  static async deleteResumeFile(fileId: string, filePath: string, userId: string): Promise<boolean> {
    try {
      // Remove from storage
      await supabase.storage.from('resumes').remove([filePath]);

      // Remove from DB
      const { error } = await supabase
        .from('resume_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', userId);

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch latest ATS analysis for user
   */
  static async getLatestAnalysis(userId: string): Promise<ResumeAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('resume_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;

      return {
        resumeHash: data.resume_hash || '',
        uploadedAt: data.created_at,
        readinessScore: data.readiness_score || 0,
        skillRadarScores: data.skill_radar_scores || {
          languages: 5,
          frameworks: 5,
          architecture: 5,
          softSkills: 5,
          testing: 5,
          tooling: 5,
        },
        structuralImprovements: data.structural_improvements || [],
        keywordsMissing: data.keywords_missing || [],
        keywordsFound: data.keywords_found || [],
      };
    } catch {
      return null;
    }
  }

  /**
   * Fetch all past analysis reports for user
   */
  static async getAllAnalyses(userId: string): Promise<ResumeAnalysis[]> {
    try {
      const { data, error } = await supabase
        .from('resume_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((item: any) => ({
        resumeHash: item.resume_hash || '',
        uploadedAt: item.created_at,
        readinessScore: item.readiness_score || 0,
        skillRadarScores: item.skill_radar_scores || {
          languages: 5,
          frameworks: 5,
          architecture: 5,
          softSkills: 5,
          testing: 5,
          tooling: 5,
        },
        structuralImprovements: item.structural_improvements || [],
        keywordsMissing: item.keywords_missing || [],
        keywordsFound: item.keywords_found || [],
      }));
    } catch {
      return [];
    }
  }

  /**
   * Save a new ATS resume analysis record permanently in Supabase
   */
  static async saveAnalysis(userId: string, analysis: ResumeAnalysis, resumeId?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('resume_analysis')
        .insert({
          user_id: userId,
          resume_hash: analysis.resumeHash,
          readiness_score: analysis.readinessScore,
          skill_radar_scores: analysis.skillRadarScores,
          structural_improvements: analysis.structuralImprovements,
          keywords_missing: analysis.keywordsMissing,
          keywords_found: analysis.keywordsFound,
          created_at: analysis.uploadedAt || new Date().toISOString(),
        });

      if (!error) {
        await this.logHistory(userId, 'analyzed', `Completed ATS analysis with score ${analysis.readinessScore}%`, resumeId);
      }

      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch activity history
   */
  static async getHistory(userId: string, resumeId?: string): Promise<ResumeHistoryRecord[]> {
    try {
      let query = supabase
        .from('resume_history')
        .select('*')
        .eq('user_id', userId);

      if (resumeId) {
        query = query.eq('resume_id', resumeId);
      }

      const { data, error } = await query.order('created_at', { ascending: false }).limit(50);

      if (error || !data) return [];

      return data.map((h: any) => ({
        id: h.id,
        resumeId: h.resume_id,
        userId: h.user_id,
        actionType: h.action_type,
        description: h.description,
        createdAt: h.created_at
      }));
    } catch {
      return [];
    }
  }

  /**
   * Log action to history
   */
  static async logHistory(userId: string, actionType: string, description: string, resumeId?: string): Promise<void> {
    try {
      await supabase.from('resume_history').insert({
        user_id: userId,
        resume_id: resumeId || null,
        action_type: actionType,
        description: description,
        created_at: new Date().toISOString()
      });
    } catch {
      // Ignore non-critical history log failures
    }
  }

  /**
   * Record export event
   */
  static async logExport(userId: string, resumeId: string, exportType: string, templateId: string, fileUrl?: string): Promise<void> {
    try {
      await supabase.from('resume_exports').insert({
        user_id: userId,
        resume_id: resumeId,
        export_type: exportType,
        template_id: templateId,
        file_url: fileUrl || null,
        created_at: new Date().toISOString()
      });
      await this.logHistory(userId, 'exported', `Exported resume as ${exportType.toUpperCase()} (${templateId} template)`, resumeId);
    } catch {
      // Ignore
    }
  }
}
