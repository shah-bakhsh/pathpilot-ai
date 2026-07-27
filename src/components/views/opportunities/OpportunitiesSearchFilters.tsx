/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SearchFilterState, EnrichedOpportunityType } from './types';
import { Search, X, SlidersHorizontal, Check, Clock, Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { POPULAR_SEARCH_QUERIES } from './mockData';

interface OpportunitiesSearchFiltersProps {
  filters: SearchFilterState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  recentSearches: string[];
  onAddRecentSearch: (query: string) => void;
  onClearRecentSearches: () => void;
  allUniqueSkills: string[];
}

const CATEGORY_LABELS: Record<EnrichedOpportunityType, string> = {
  job: 'Jobs',
  internship: 'Internships',
  scholarship: 'Scholarships',
  hackathon: 'Hackathons',
  competition: 'Competitions',
  research: 'Research Programs',
  fellowship: 'Fellowships',
  bootcamp: 'Bootcamps',
  course: 'Courses',
  volunteer: 'Volunteer Opportunities',
  freelance: 'Freelance Projects',
  open_source: 'Open Source Programs'
};

const LOCATION_TYPES: { value: 'remote' | 'hybrid' | 'onsite'; label: string }[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid (Part-Time Onsite)' },
  { value: 'onsite', label: 'Onsite / Office' }
];

const EXPERIENCE_LEVELS: ('Entry' | 'Mid' | 'Senior' | 'Lead')[] = ['Entry', 'Mid', 'Senior', 'Lead'];

export const OpportunitiesSearchFilters: React.FC<OpportunitiesSearchFiltersProps> = ({
  filters,
  setFilters,
  recentSearches,
  onAddRecentSearch,
  onClearRecentSearches,
  allUniqueSkills
}) => {
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [skillInput, setSkillInput] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.searchQuery.trim()) {
      onAddRecentSearch(filters.searchQuery.trim());
    }
    setSearchFocused(false);
  };

  const handleSelectPopular = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
    onAddRecentSearch(query);
    setSearchFocused(false);
  };

  const toggleCategory = (cat: EnrichedOpportunityType) => {
    setFilters(prev => {
      const alreadySelected = prev.categories.includes(cat);
      const nextCategories = alreadySelected
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: nextCategories };
    });
  };

  const toggleLocationType = (loc: 'remote' | 'hybrid' | 'onsite') => {
    setFilters(prev => {
      const alreadySelected = prev.locationTypes.includes(loc);
      const nextLocs = alreadySelected
        ? prev.locationTypes.filter(l => l !== loc)
        : [...prev.locationTypes, loc];
      return { ...prev, locationTypes: nextLocs };
    });
  };

  const toggleExperienceLevel = (level: 'Entry' | 'Mid' | 'Senior' | 'Lead') => {
    setFilters(prev => {
      const alreadySelected = prev.experienceLevels.includes(level);
      const nextLevels = alreadySelected
        ? prev.experienceLevels.filter(l => l !== level)
        : [...prev.experienceLevels, level];
      return { ...prev, experienceLevels: nextLevels };
    });
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const cleanSkill = skillInput.trim();
      if (!filters.skills.includes(cleanSkill)) {
        setFilters(prev => ({ ...prev, skills: [...prev.skills, cleanSkill] }));
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFilters(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleResetFilters = () => {
    setFilters({
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
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* SEARCH FIELD BAR ROW */}
      <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search matching job coordinates, scholarships, hackathons..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/10 transition-all shadow-xs"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Button
          type="button"
          variant={showFiltersPanel ? 'primary' : 'outline'}
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          className="h-11 px-4 text-xs font-bold shrink-0 border-slate-800 hover:border-slate-700 hover:bg-slate-800 flex items-center gap-1.5"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
          {(filters.categories.length > 0 ||
            filters.locationTypes.length > 0 ||
            filters.experienceLevels.length > 0 ||
            filters.skills.length > 0 ||
            filters.isPaidOnly ||
            filters.isFreeOnly) && (
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          )}
        </Button>
      </form>

      {/* AUTOCOMPLETE / POPULAR SEARCH SUGGESTION DRAWER */}
      {searchFocused && (
        <div className="relative w-full z-30">
          <div className="absolute top-0 left-0 right-0 p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4 animate-fade-in">
            {recentSearches.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-wider text-slate-500">
                  <span>Recent Searches</span>
                  <button type="button" onClick={onClearRecentSearches} className="hover:text-rose-400 transition-colors">Clear</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={() => handleSelectPopular(term)}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Popular Coordinates
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCH_QUERIES.map((query, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={() => handleSelectPopular(query)}
                    className="text-xs px-2.5 py-1 rounded-md bg-indigo-950/20 border border-indigo-900/30 hover:border-indigo-500/30 text-indigo-300 transition-all"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED FILTERS EXPANSION PANEL */}
      {showFiltersPanel && (
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-850/80 shadow-inner grid grid-cols-1 md:grid-cols-12 gap-5 animate-fade-in text-sm text-slate-300">
          
          {/* CATEGORIES COLUMN */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Opportunity Category</span>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(CATEGORY_LABELS) as EnrichedOpportunityType[]).map((cat) => {
                const selected = filters.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`text-left px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-all ${
                      selected
                        ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750'
                    }`}
                  >
                    <span>{CATEGORY_LABELS[cat]}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LOCATIONS & EXPERIENCE COLUMNS */}
          <div className="md:col-span-4 flex flex-col gap-4">
            {/* Location Type */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Location Settings</span>
              <div className="flex flex-col gap-1.5">
                {LOCATION_TYPES.map((loc) => {
                  const selected = filters.locationTypes.includes(loc.value);
                  return (
                    <button
                      key={loc.value}
                      type="button"
                      onClick={() => toggleLocationType(loc.value)}
                      className={`text-left px-2.5 py-2 rounded-lg border text-xs font-medium flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750'
                      }`}
                    >
                      <span>{loc.label}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Levels */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Experience Tier</span>
              <div className="flex flex-wrap gap-1.5">
                {EXPERIENCE_LEVELS.map((level) => {
                  const selected = filters.experienceLevels.includes(level);
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => toggleExperienceLevel(level)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                        selected
                          ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750'
                      }`}
                    >
                      {level} {selected && <Check className="w-3 h-3 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SKILLS & COMPENSATION COLUMNS */}
          <div className="md:col-span-4 space-y-4">
            
            {/* Skills / Keywords Filter */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Filter By Specific Skills</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type skill (e.g. React) & press Enter"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
              </div>
              <div className="flex flex-wrap gap-1 max-h-[70px] overflow-y-auto">
                {filters.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="primary"
                    className="text-[10px] flex items-center gap-1 bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 pr-1.5 py-0.5"
                  >
                    {skill}
                    <X
                      className="w-3 h-3 text-indigo-400 hover:text-indigo-200 cursor-pointer"
                      onClick={() => handleRemoveSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Compensation Details */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Compensation Model</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, isPaidOnly: !prev.isPaidOnly, isFreeOnly: false }))}
                  className={`flex-1 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    filters.isPaidOnly
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Paid/Funded {filters.isPaidOnly && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, isFreeOnly: !prev.isFreeOnly, isPaidOnly: false }))}
                  className={`flex-1 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                    filters.isFreeOnly
                      ? 'bg-blue-950/40 border-blue-500 text-blue-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Free {filters.isFreeOnly && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Reset Action */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-4 cursor-pointer font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
