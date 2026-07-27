/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { EnrichedOpportunity, SearchFilterState, AIMatchDetail, SavedSearch } from '../components/views/opportunities/types';
import { MOCK_ENRICHED_OPPORTUNITIES } from '../components/views/opportunities/mockData';

export interface ApplicationRecord {
  id: string;
  opportunityId?: string;
  company: string;
  role: string;
  type: string;
  location?: string;
  status: 'interested' | 'saved' | 'preparing' | 'applied' | 'assessment' | 'interview' | 'final_interview' | 'offer_received' | 'accepted' | 'rejected' | 'withdrawn';
  dateApplied: string;
  deadline?: string;
  interviewDate?: string;
  notes?: string;
  coverLetter?: string;
  resumeUsed?: string;
  salaryOffered?: string;
  priority?: 'high' | 'medium' | 'low';
  contacts?: { name: string; role: string; email?: string }[];
  updatedAt: string;
}

export interface FolderBookmark {
  opportunityId: string;
  folderName: string;
  notes: string;
  tags: string[];
  savedAt: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  rating: number;
  industry: string;
  headquarters: string;
  website: string;
  employeeCount: string;
  overview: string;
  culture: string[];
  hiringProcess: string[];
  requiredSkills: string[];
  openPositionsCount: number;
  isFollowed?: boolean;
}

export class OpportunityService {
  private static LOCAL_BOOKMARKS_KEY = 'pathpilot_saved_bookmarks_v2';
  private static LOCAL_APPLICATIONS_KEY = 'pathpilot_applications_v2';
  private static LOCAL_SAVED_SEARCHES_KEY = 'pathpilot_saved_searches_v2';
  private static LOCAL_FOLLOWED_COMPANIES_KEY = 'pathpilot_followed_companies_v2';

  /**
   * Fetch all opportunities with optional client/Supabase search filters
   */
  static async getOpportunities(filters?: Partial<SearchFilterState>): Promise<EnrichedOpportunity[]> {
    let opportunities: EnrichedOpportunity[] = [...MOCK_ENRICHED_OPPORTUNITIES];

    // Attempt Supabase fetch if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('opportunities').select('*');
        if (!error && data && data.length > 0) {
          const dbOpps: EnrichedOpportunity[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            organization: item.organization,
            orgLogo: item.org_logo || 'bg-blue-600 text-white',
            orgRating: item.org_rating || 4.5,
            type: item.type || 'job',
            location: item.location || '',
            locationType: item.location_type || 'hybrid',
            country: item.country || 'United States',
            city: item.city || '',
            deadline: item.deadline || '2026-08-30',
            duration: item.duration || 'Permanent',
            salaryOrFunding: item.salary_or_funding || '$120,000 - $160,000',
            isPaid: item.is_paid ?? true,
            requiredSkills: item.required_skills || [],
            educationLevel: item.education_level || "Bachelor's",
            experienceLevel: item.experience_level || 'Mid',
            industry: item.industry || 'Technology',
            officialWebsite: item.official_website || 'https://google.com',
            description: item.description || '',
            overview: item.overview || '',
            responsibilities: item.responsibilities || [],
            requirements: item.requirements || [],
            benefits: item.benefits || [],
            applicationProcess: item.application_process || [],
            timeline: item.timeline || [],
            eligibility: item.eligibility || [],
            selectionProcess: item.selection_process || [],
            resources: item.resources || [],
            faqs: item.faqs || [],
          }));

          // Merge db items with default mocks without duplicates
          const dbIds = new Set(dbOpps.map((o) => o.id));
          opportunities = [...dbOpps, ...MOCK_ENRICHED_OPPORTUNITIES.filter((o) => !dbIds.has(o.id))];
        }
      } catch {
        // Fallback to memory/mock list
      }
    }

    if (!filters) return opportunities;

    // Apply active filter criteria
    return opportunities.filter((opp) => {
      // 1. Keyword search
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesQuery =
          opp.title.toLowerCase().includes(q) ||
          opp.organization.toLowerCase().includes(q) ||
          opp.description.toLowerCase().includes(q) ||
          opp.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
          (opp.industry && opp.industry.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. Categories
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(opp.type)) return false;
      }

      // 3. Location types
      if (filters.locationTypes && filters.locationTypes.length > 0) {
        if (!filters.locationTypes.includes(opp.locationType)) return false;
      }

      // 4. Experience level
      if (filters.experienceLevels && filters.experienceLevels.length > 0 && opp.experienceLevel) {
        if (!filters.experienceLevels.includes(opp.experienceLevel)) return false;
      }

      // 5. Country / City
      if (filters.country && opp.country.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }
      if (filters.city && opp.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // 6. Paid / Free
      if (filters.isPaidOnly && !opp.isPaid) return false;
      if (filters.isFreeOnly && opp.isPaid) return false;

      // 7. Skills
      if (filters.skills && filters.skills.length > 0) {
        const hasSkill = filters.skills.some((sk) =>
          opp.requiredSkills.some((s) => s.toLowerCase() === sk.toLowerCase())
        );
        if (!hasSkill) return false;
      }

      return true;
    });
  }

  /**
   * Calculate or generate AI match score analysis via backend Gemini
   */
  static async getAIMatchAnalysis(
    opportunity: EnrichedOpportunity,
    resumeText: string = '',
    userSkills: string[] = [],
    targetRole: string = ''
  ): Promise<AIMatchDetail> {
    try {
      const response = await fetch('/api/opportunities/match-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunity, resumeText, userSkills, targetRole }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          matchPercentage: data.matchPercentage || 85,
          requiredSkills: data.requiredSkills || opportunity.requiredSkills,
          missingSkills: data.missingSkills || [],
          resumeCompatibilityScore: data.resumeCompatibilityScore || 80,
          priorityLevel: data.priorityLevel || 'High',
          estimatedSuccessRate: data.estimatedSuccessRate || 75,
          aiRecommendation: data.aiRecommendation || `Good match for ${opportunity.title} at ${opportunity.organization}.`,
        };
      }
    } catch {
      // Fallback calculation
    }

    // High-fidelity local fallback
    const req = opportunity.requiredSkills || [];
    const matched = req.filter((s) => userSkills.some((u) => u.toLowerCase() === s.toLowerCase()));
    const missing = req.filter((s) => !matched.includes(s));
    const score = req.length > 0 ? Math.round((matched.length / req.length) * 100) : 82;

    return {
      matchPercentage: Math.min(98, Math.max(60, score + 15)),
      requiredSkills: req,
      missingSkills: missing,
      resumeCompatibilityScore: Math.min(95, Math.max(65, score + 10)),
      priorityLevel: score > 70 ? 'High' : 'Medium',
      estimatedSuccessRate: Math.min(90, Math.max(50, score)),
      aiRecommendation: `Recommended for ${opportunity.title} at ${opportunity.organization}. Highlight your experience in ${req.slice(0, 2).join(', ') || 'software engineering'}.`,
    };
  }

  /**
   * Fetch AI Recommendations
   */
  static async getAIRecommendations(
    targetRole: string = 'Software Engineer',
    skills: string[] = [],
    preferredTypes: string[] = []
  ): Promise<{ recommendations: any[] }> {
    try {
      const response = await fetch('/api/opportunities/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, skills, preferredTypes }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Return empty or fallback
    }

    return {
      recommendations: [
        {
          id: 'rec-fall-1',
          title: `Senior ${targetRole} - Distributed Systems`,
          organization: 'Google Cloud',
          orgLogo: 'bg-blue-600 text-white',
          orgRating: 4.8,
          type: 'job',
          location: 'Sunnyvale, CA',
          locationType: 'hybrid',
          country: 'United States',
          city: 'Sunnyvale',
          deadline: '2026-08-30',
          salaryOrFunding: '$170,000 - $220,000',
          isPaid: true,
          requiredSkills: skills.length > 0 ? skills.slice(0, 4) : ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
          matchIndex: 92,
          description: 'Architect next-generation enterprise API platforms on GCP.',
          aiReason: `Strong match with your experience in ${skills[0] || 'software development'}.`,
        },
      ],
    };
  }

  // --- BOOKMARKS & VAULT PERSISTENCE ---

  static getLocalBookmarks(): FolderBookmark[] {
    try {
      const saved = localStorage.getItem(this.LOCAL_BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveLocalBookmarks(bookmarks: FolderBookmark[]) {
    try {
      localStorage.setItem(this.LOCAL_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch {
      // Ignore storage errors
    }
  }

  static async getBookmarks(userId: string): Promise<FolderBookmark[]> {
    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase.from('bookmarks').select('*').eq('user_id', userId);
        if (!error && data) {
          return data.map((item) => ({
            opportunityId: item.opportunity_id,
            folderName: item.folder_name || 'General',
            notes: item.notes || '',
            tags: item.tags || [],
            savedAt: item.created_at || new Date().toISOString(),
          }));
        }
      } catch {
        // Fallback to localStorage
      }
    }
    return this.getLocalBookmarks();
  }

  static async toggleBookmark(
    userId: string,
    opportunityId: string,
    folderName: string = 'General',
    notes: string = '',
    tags: string[] = []
  ): Promise<boolean> {
    const existing = this.getLocalBookmarks();
    const index = existing.findIndex((b) => b.opportunityId === opportunityId);
    let isSaved = false;

    if (index > -1) {
      existing.splice(index, 1);
      isSaved = false;
    } else {
      existing.push({
        opportunityId,
        folderName,
        notes,
        tags,
        savedAt: new Date().toISOString(),
      });
      isSaved = true;
    }

    this.saveLocalBookmarks(existing);

    if (isSupabaseConfigured() && userId) {
      try {
        if (isSaved) {
          await supabase.from('bookmarks').upsert({
            user_id: userId,
            opportunity_id: opportunityId,
            folder_name: folderName,
            notes,
            tags,
            created_at: new Date().toISOString(),
          });
        } else {
          await supabase
            .from('bookmarks')
            .delete()
            .eq('user_id', userId)
            .eq('opportunity_id', opportunityId);
        }
      } catch {
        // Handled locally
      }
    }

    return isSaved;
  }

  // --- APPLICATION TRACKER & KANBAN PIPELINE ---

  static getLocalApplications(): ApplicationRecord[] {
    try {
      const saved = localStorage.getItem(this.LOCAL_APPLICATIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveLocalApplications(apps: ApplicationRecord[]) {
    try {
      localStorage.setItem(this.LOCAL_APPLICATIONS_KEY, JSON.stringify(apps));
    } catch {
      // Ignore
    }
  }

  static async getApplications(userId: string): Promise<ApplicationRecord[]> {
    if (isSupabaseConfigured() && userId) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!error && data) {
          return data.map((item) => ({
            id: item.id,
            opportunityId: item.opportunity_id || undefined,
            company: item.company,
            role: item.role,
            type: item.type || 'job',
            location: item.location || '',
            status: item.status || 'applied',
            dateApplied: item.date_applied || new Date().toISOString().split('T')[0],
            deadline: item.deadline || undefined,
            interviewDate: item.interview_date || undefined,
            notes: item.notes || '',
            salaryOffered: item.salary_offered ? String(item.salary_offered) : undefined,
            priority: item.priority || 'medium',
            updatedAt: item.updated_at || new Date().toISOString(),
          }));
        }
      } catch {
        // Fallback
      }
    }
    return this.getLocalApplications();
  }

  static async saveApplication(userId: string, app: Partial<ApplicationRecord>): Promise<ApplicationRecord> {
    const existing = this.getLocalApplications();
    let record: ApplicationRecord;

    if (app.id) {
      const idx = existing.findIndex((a) => a.id === app.id);
      if (idx > -1) {
        record = {
          ...existing[idx],
          ...app,
          updatedAt: new Date().toISOString(),
        } as ApplicationRecord;
        existing[idx] = record;
      } else {
        record = {
          id: app.id,
          company: app.company || 'Company',
          role: app.role || 'Role',
          type: app.type || 'job',
          status: app.status || 'applied',
          dateApplied: app.dateApplied || new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString(),
          ...app,
        } as ApplicationRecord;
        existing.unshift(record);
      }
    } else {
      record = {
        id: 'app_' + Math.random().toString(36).substring(2, 9),
        company: app.company || 'Company',
        role: app.role || 'Role',
        type: app.type || 'job',
        status: app.status || 'applied',
        dateApplied: app.dateApplied || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
        ...app,
      } as ApplicationRecord;
      existing.unshift(record);
    }

    this.saveLocalApplications(existing);

    if (isSupabaseConfigured() && userId) {
      try {
        await supabase.from('applications').upsert({
          id: record.id,
          user_id: userId,
          company: record.company,
          role: record.role,
          type: record.type,
          status: record.status,
          date_applied: record.dateApplied,
          deadline: record.deadline || null,
          interview_date: record.interviewDate || null,
          notes: record.notes || '',
          location: record.location || '',
          priority: record.priority || 'medium',
          updated_at: record.updatedAt,
        });
      } catch {
        // Handled
      }
    }

    return record;
  }

  static async deleteApplication(userId: string, appId: string): Promise<boolean> {
    const existing = this.getLocalApplications();
    const updated = existing.filter((a) => a.id !== appId);
    this.saveLocalApplications(updated);

    if (isSupabaseConfigured() && userId) {
      try {
        await supabase.from('applications').delete().eq('id', appId).eq('user_id', userId);
      } catch {
        // Handled
      }
    }

    return true;
  }

  // --- SAVED SEARCHES ---

  static getSavedSearches(): SavedSearch[] {
    try {
      const saved = localStorage.getItem(this.LOCAL_SAVED_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveSearch(query: string, filters: Partial<SearchFilterState>): SavedSearch {
    const searches = this.getSavedSearches();
    const newSearch: SavedSearch = {
      id: 'search_' + Math.random().toString(36).substring(2, 9),
      query: query || 'Custom Filter',
      timestamp: new Date().toISOString(),
      filters,
    };
    searches.unshift(newSearch);
    try {
      localStorage.setItem(this.LOCAL_SAVED_SEARCHES_KEY, JSON.stringify(searches.slice(0, 20)));
    } catch {
      // Ignore
    }
    return newSearch;
  }

  static deleteSavedSearch(id: string) {
    const searches = this.getSavedSearches().filter((s) => s.id !== id);
    try {
      localStorage.setItem(this.LOCAL_SAVED_SEARCHES_KEY, JSON.stringify(searches));
    } catch {
      // Ignore
    }
  }

  // --- COMPANY PROFILES ---

  static getCompanyProfiles(): CompanyProfile[] {
    const followed = this.getFollowedCompanies();

    return [
      {
        id: 'comp-1',
        name: 'Google Cloud Platform',
        logo: 'bg-blue-600 text-white',
        rating: 4.6,
        industry: 'Cloud Computing & AI',
        headquarters: 'Mountain View, CA',
        website: 'https://cloud.google.com',
        employeeCount: '100,000+',
        overview:
          'Google Cloud Platform delivers secure, high-performance cloud services, generative AI APIs, and scalable infrastructure to developers and enterprises worldwide.',
        culture: [
          'High innovation autonomy',
          'Inclusive engineering sprints',
          'Open source advocacy',
          '3-day hybrid campus work environment',
        ],
        hiringProcess: [
          'Resume screening & ATS check',
          '45-min Technical Phone Screen',
          'Virtual Onsite Loop (Coding, Architecture, Googliness)',
          'Team Matching & Executive Approval',
        ],
        requiredSkills: ['TypeScript', 'React', 'Node.js', 'Google Cloud Run', 'Firestore', 'Docker'],
        openPositionsCount: 142,
        isFollowed: followed.includes('comp-1'),
      },
      {
        id: 'comp-2',
        name: 'Stripe',
        logo: 'bg-indigo-600 text-white',
        rating: 4.7,
        industry: 'Fintech & Payment Gateway Systems',
        headquarters: 'San Francisco, CA',
        website: 'https://stripe.com',
        employeeCount: '8,000+',
        overview:
          'Stripe builds economic infrastructure for the internet. From start-ups to Fortune 500 companies, businesses use Stripe to accept payments and manage their online businesses.',
        culture: [
          'Direct asynchronous writing culture',
          'Obsession with developer experience',
          'High craft quality in API design',
          'Remote-first global engineering teams',
        ],
        hiringProcess: [
          'System architecture portfolio review',
          'Technical deep dive on concurrency & locks',
          'Virtual Onsite Loop (Debugging, System Design, Values)',
          'Compensation Offer Alignment',
        ],
        requiredSkills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'OAuth2', 'System Design'],
        openPositionsCount: 88,
        isFollowed: followed.includes('comp-2'),
      },
      {
        id: 'comp-3',
        name: 'Notion AI Labs',
        logo: 'bg-black text-white border border-gray-700',
        rating: 4.5,
        industry: 'Productivity Software & Generative AI',
        headquarters: 'New York, NY',
        website: 'https://notion.so',
        employeeCount: '1,500+',
        overview:
          'Notion is a single connected workspace where teams write, plan, and create using integrated generative AI assistants.',
        culture: [
          'Beautiful product typography & design obsession',
          'Small nimble team units',
          'Fast deployment cadence',
          'Hybrid NYC office culture',
        ],
        hiringProcess: [
          'UI & Frontend portfolio evaluation',
          '45-min Live React & CSS layout challenge',
          'Product fit interview with Design Lead',
        ],
        requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'motion', 'WebSockets'],
        openPositionsCount: 29,
        isFollowed: followed.includes('comp-3'),
      },
      {
        id: 'comp-4',
        name: 'OpenAI Research',
        logo: 'bg-emerald-600 text-white',
        rating: 4.9,
        industry: 'Artificial Intelligence & Neural Networks',
        headquarters: 'San Francisco, CA',
        website: 'https://openai.com',
        employeeCount: '2,000+',
        overview:
          'OpenAI is an AI research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity.',
        culture: [
          'Frontier AI exploration',
          'High density of top-tier AI researchers & engineers',
          'Generous computational budget',
          'Rapid production shipping',
        ],
        hiringProcess: [
          'Coding & Algorithmic screening',
          'Machine learning / System Design interview',
          'Full-day virtual research loop',
        ],
        requiredSkills: ['Python', 'TypeScript', 'PyTorch', 'Distributed Computing', 'LLMs'],
        openPositionsCount: 64,
        isFollowed: followed.includes('comp-4'),
      },
    ];
  }

  static getFollowedCompanies(): string[] {
    try {
      const saved = localStorage.getItem(this.LOCAL_FOLLOWED_COMPANIES_KEY);
      return saved ? JSON.parse(saved) : ['comp-1', 'comp-2'];
    } catch {
      return ['comp-1', 'comp-2'];
    }
  }

  static toggleFollowCompany(companyId: string): boolean {
    const followed = this.getFollowedCompanies();
    const idx = followed.indexOf(companyId);
    let isFollowed = false;

    if (idx > -1) {
      followed.splice(idx, 1);
      isFollowed = false;
    } else {
      followed.push(companyId);
      isFollowed = true;
    }

    try {
      localStorage.setItem(this.LOCAL_FOLLOWED_COMPANIES_KEY, JSON.stringify(followed));
    } catch {
      // Ignore
    }

    return isFollowed;
  }
}

export default OpportunityService;
