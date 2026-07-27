/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCareer } from '../../contexts/CareerContext';
import { motion, AnimatePresence } from 'motion/react';

// Import Types
import {
  EnrichedOpportunity,
  SearchFilterState
} from './opportunities/types';

// Import Services & Mock Fallbacks
import { OpportunityService } from '../../services/opportunityService';
import {
  MOCK_ENRICHED_OPPORTUNITIES,
  BOOKMARKED_OPPS_KEY
} from './opportunities/mockData';

// Import Subcomponents
import { OpportunitiesHero } from './opportunities/OpportunitiesHero';
import { OpportunitiesSearchFilters } from './opportunities/OpportunitiesSearchFilters';
import { OpportunityCard } from './opportunities/OpportunityCard';
import { OpportunityDetails } from './opportunities/OpportunityDetails';
import { OpportunityAIAssistant } from './opportunities/OpportunityAIAssistant';
import { ApplicationTracker } from './opportunities/ApplicationTracker';
import { BookmarkManager } from './opportunities/BookmarkManager';
import { DeadlineTrackerView } from './opportunities/DeadlineTrackerView';
import { TrendingAnalytics } from './opportunities/TrendingAnalytics';
import { CompanyProfilesView } from './opportunities/CompanyProfilesView';

// UI and Icons
import {
  Search,
  Sparkles,
  Heart,
  Calendar,
  Layers,
  TrendingUp,
  Loader2
} from 'lucide-react';

type HubTab = 'discover' | 'pipeline' | 'vault' | 'deadlines' | 'companies' | 'trends';

export const OpportunitiesView: React.FC = () => {
  const { user } = useAuth();
  const { addJobApplication, addNotification } = useCareer();

  // Active Tab
  const [activeTab, setActiveTab] = useState<HubTab>('discover');

  // Selected Opportunity details
  const [selectedOpp, setSelectedOpp] = useState<EnrichedOpportunity | null>(null);

  // Opportunities state from OpportunityService
  const [opportunities, setOpportunities] = useState<EnrichedOpportunity[]>(MOCK_ENRICHED_OPPORTUNITIES);
  const [loadingOpps, setLoadingOpps] = useState<boolean>(false);

  // Bookmarks persistence via OpportunityService & Supabase
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    return OpportunityService.getLocalBookmarks().map(b => b.opportunityId);
  });

  // Filters State
  const [filters, setFilters] = useState<SearchFilterState>({
    searchQuery: '',
    categories: [],
    locationTypes: [],
    experienceLevels: [],
    country: '',
    city: '',
    isPaidOnly: false,
    isFreeOnly: false,
    skills: [],
    duration: ''
  });

  // Sync bookmarks from service on mount & user change
  useEffect(() => {
    let isMounted = true;
    const fetchBookmarks = async () => {
      if (user?.id) {
        const bookmarks = await OpportunityService.getBookmarks(user.id);
        if (isMounted) {
          setBookmarkedIds(bookmarks.map(b => b.opportunityId));
        }
      }
    };
    fetchBookmarks();
    return () => { isMounted = false; };
  }, [user?.id]);

  // Fetch opportunities whenever filters change
  useEffect(() => {
    let isMounted = true;
    const loadOpps = async () => {
      setLoadingOpps(true);
      try {
        const fetched = await OpportunityService.getOpportunities(filters);
        if (isMounted) {
          setOpportunities(fetched);
        }
      } catch (err) {
        // Fallback to memory array
      } finally {
        if (isMounted) setLoadingOpps(false);
      }
    };
    loadOpps();
    return () => { isMounted = false; };
  }, [filters]);

  const toggleBookmark = async (id: string) => {
    const isBookmarked = bookmarkedIds.includes(id);
    const userId = user?.id || 'anonymous';
    
    // Toggle locally first
    setBookmarkedIds((prev) => {
      if (isBookmarked) {
        addNotification(
          'Removed Bookmark',
          'Opportunity removed from your saved vault.',
          'info'
        );
        return prev.filter((item) => item !== id);
      } else {
        addNotification(
          'Added Bookmark',
          'Opportunity saved! Review them inside your Saved Vault.',
          'success'
        );
        return [...prev, id];
      }
    });

    // Sync to OpportunityService (Supabase/local)
    await OpportunityService.toggleBookmark(userId, id);
  };

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const handleAddRecentSearch = (query: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q !== query);
      return [query, ...filtered].slice(0, 5);
    });
  };

  // Unique skills compiler for autocomplete
  const allUniqueSkills = Array.from(
    new Set(opportunities.flatMap((opp) => opp.requiredSkills || []))
  );

  // Bookmarked Opportunities list
  const bookmarkedOpps = opportunities.filter((opp) =>
    bookmarkedIds.includes(opp.id)
  );

  // Apply to pipeline integration handler
  const handleApplyPipeline = async (opp: EnrichedOpportunity) => {
    const userId = user?.id || 'anonymous';

    // Save to OpportunityService (Supabase/local)
    await OpportunityService.saveApplication(userId, {
      company: opp.organization,
      role: opp.title,
      type: opp.type || 'job',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'applied',
      priority: 'medium',
      deadline: opp.deadline,
      notes: 'Registered coordinates automatically via PathPilot AI Opportunity Hub.'
    });

    // Also sync with global CareerContext for active state
    addJobApplication({
      company: opp.organization,
      role: opp.title,
      type:
        opp.type === 'job'
          ? 'job'
          : opp.type === 'internship'
          ? 'internship'
          : opp.type === 'scholarship'
          ? 'scholarship'
          : opp.type === 'hackathon'
          ? 'hackathon'
          : 'competition',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'applied',
      priority: 'medium',
      notes: 'Registered coordinates automatically via PathPilot AI Opportunity Hub.',
      deadline: opp.deadline
    });

    addNotification(
      'Application Tracked!',
      `"${opp.title}" at ${opp.organization} added to your Pipeline Board under Applied.`,
      'success'
    );
  };

  // Deadlines Count
  const getUpcomingDeadlinesCount = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return opportunities.filter((opp) => {
      const deadDate = new Date(opp.deadline);
      const diffDays = Math.round((deadDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 text-slate-100 select-none">
      
      {/* 1. HERO REGISTRATION SECTION */}
      <OpportunitiesHero
        totalRecommended={opportunities.length}
        totalSaved={bookmarkedIds.length}
        upcomingDeadlinesCount={getUpcomingDeadlinesCount()}
      />

      {/* 2. TAB CONTROLLER SUB-NAVIGATION */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1 flex-wrap gap-y-3">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => {
              setActiveTab('discover');
              setSelectedOpp(null);
            }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'discover'
                ? 'border-indigo-500 text-indigo-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Search className="w-3.5 h-3.5 inline mr-1.5" /> Discover
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'border-indigo-500 text-indigo-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1.5" /> Pipeline Board
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'vault'
                ? 'border-indigo-500 text-indigo-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Heart className="w-3.5 h-3.5 inline mr-1.5" /> Saved Vault
          </button>
          <button
            onClick={() => setActiveTab('deadlines')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'deadlines'
                ? 'border-indigo-500 text-indigo-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 inline mr-1.5" /> Closing Countdown
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'companies'
                ? 'border-indigo-500 text-indigo-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            🏢 Companies
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'trends'
                ? 'border-indigo-500 text-indigo-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 inline mr-1.5" /> Predictive Trends
          </button>
        </div>

        {/* Real-time Notifications Alert Bell (Simulated popovers) */}
        <div className="flex items-center gap-1.5 pr-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase">System Link: Connected</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      {/* 3. ACTIVE SUB-SCREENS SWITCHER */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 w-full"
            >
              {!selectedOpp ? (
                /* DISCOVER MAIN DIRECTORY VIEW */
                <div className="space-y-6 w-full">
                  <OpportunitiesSearchFilters
                    filters={filters}
                    setFilters={setFilters}
                    recentSearches={recentSearches}
                    onAddRecentSearch={handleAddRecentSearch}
                    onClearRecentSearches={() => setRecentSearches([])}
                    allUniqueSkills={allUniqueSkills}
                  />

                  {opportunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {opportunities.map((opp) => (
                        <OpportunityCard
                          key={opp.id}
                          opportunity={opp}
                          onViewDetails={(o) => setSelectedOpp(o)}
                          isBookmarked={bookmarkedIds.includes(opp.id)}
                          onToggleBookmark={toggleBookmark}
                          onApplyPipeline={handleApplyPipeline}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 rounded-xl border border-dashed border-slate-800 bg-slate-900/10 flex flex-col items-center justify-center p-6 text-center text-slate-500 select-none">
                      <Search className="w-10 h-10 opacity-30 mb-2.5 text-indigo-400" />
                      <h4 className="text-sm font-bold text-slate-400">No matching opportunity coordinates</h4>
                      <p className="text-xs text-slate-500 max-w-sm mt-1">
                        We could not identify listings matching your active search filters. Try widening your criteria parameters.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* SPLIT COMPANION CO-PILOT SCREEN */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Details (7 cols) */}
                  <div className="lg:col-span-7 bg-slate-900/15 p-5 border border-slate-850/80 rounded-2xl">
                    <OpportunityDetails
                      opportunity={selectedOpp}
                      onBack={() => setSelectedOpp(null)}
                      onApplyPipeline={handleApplyPipeline}
                    />
                  </div>

                  {/* Right Column: AI Assistant (5 cols) */}
                  <div className="lg:col-span-5 h-[580px] lg:sticky lg:top-4">
                    <OpportunityAIAssistant opportunity={selectedOpp} />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'pipeline' && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <ApplicationTracker />
            </motion.div>
          )}

          {activeTab === 'vault' && (
            <motion.div
              key="vault"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <BookmarkManager
                bookmarkedOpps={bookmarkedOpps}
                onRemoveBookmark={toggleBookmark}
                onViewDetails={(opp) => {
                  setSelectedOpp(opp);
                  setActiveTab('discover');
                }}
                onApplyPipeline={handleApplyPipeline}
              />
            </motion.div>
          )}

          {activeTab === 'deadlines' && (
            <motion.div
              key="deadlines"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <DeadlineTrackerView
                opportunities={opportunities}
                onViewDetails={(opp) => {
                  setSelectedOpp(opp);
                  setActiveTab('discover');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'companies' && (
            <motion.div
              key="companies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <CompanyProfilesView />
            </motion.div>
          )}

          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <TrendingAnalytics />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default OpportunitiesView;
