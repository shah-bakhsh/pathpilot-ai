/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Search, Filter, Play, Star, BookMarked, Bookmark, ChevronRight, 
  HelpCircle, Sparkles, Building2, Shield, Compass, ArrowLeft
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Question, QuestionCategory, DifficultyLevel, CompanyName } from './InterviewTypes';
import { QUESTION_BANK, QUESTION_CATEGORIES, COMPANIES } from './mockData';
import { cn } from '../../../lib/utils';

interface QuestionBankViewProps {
  onBack: () => void;
  onLaunchQuickPracticeWithQuestion: (question: Question) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onBack,
  onLaunchQuickPracticeWithQuestion
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'All'>('All');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<CompanyName | 'All'>('All');
  
  // Bookmarked local mock state
  const [bookmarks, setBookmarks] = useState<string[]>(['q1', 'q4']);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  // Filter questions
  const filteredQuestions = QUESTION_BANK.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesCompany = selectedCompanyFilter === 'All' || q.companies?.includes(selectedCompanyFilter);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesCompany;
  });

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in py-2 max-w-5xl mx-auto">
      
      {/* 1. Header toolbar */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-xs text-text-mute hover:text-text-main flex items-center gap-1.5 cursor-pointer px-0.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
        <span className="text-[10px] text-text-mute font-mono uppercase tracking-widest">Global Question Library</span>
      </div>

      {/* 2. Visual Hub Banner */}
      <div className="relative overflow-hidden p-6 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="flex flex-col max-w-2xl relative z-10">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <BookOpen className="w-3.5 h-3.5 mr-1" /> Curated Question Repository
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight">
            Advanced Recruiter Question Archives
          </h1>
          <p className="text-xs text-text-mute mt-1 leading-relaxed font-semibold">
            Practice isolated, targeted questions tailored for specialized system components, machine learning transformers, or leadership conflicts. Click "Quick Practice" to launch a direct dynamic evaluation on any card.
          </p>
        </div>
      </div>

      {/* 3. Search and Filters Pane */}
      <Card className="border-[var(--border)] bg-[var(--surface)]">
        <CardContent className="p-4 flex flex-col gap-4">
          
          {/* Main search and difficulty filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-mute/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search queries, concepts, algorithms or frameworks..."
                className="w-full text-xs pl-10 pr-4 py-2.5 border border-[var(--border)] rounded-xl bg-[var(--surface-secondary)]/30 focus:border-primary focus:outline-none transition-colors font-semibold"
              />
            </div>

            {/* Category filter */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-[var(--border)] rounded-xl bg-[var(--surface-secondary)]/30 focus:border-primary focus:outline-none transition-colors font-semibold"
              >
                <option value="All">All Categories</option>
                {QUESTION_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Difficulty filter */}
            <div className="md:col-span-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-[var(--border)] rounded-xl bg-[var(--surface-secondary)]/30 focus:border-primary focus:outline-none transition-colors font-semibold"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Company filter */}
            <div className="md:col-span-2">
              <select
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-[var(--border)] rounded-xl bg-[var(--surface-secondary)]/30 focus:border-primary focus:outline-none transition-colors font-semibold"
              >
                <option value="All">All Companies</option>
                {COMPANIES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* 4. Question Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => {
            const isBookmarked = bookmarks.includes(q.id);
            return (
              <div 
                key={q.id}
                className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-primary/20 transition-all duration-150 flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="primary" className="text-[7.5px] uppercase font-black px-1.5 py-0">
                        {q.category}
                      </Badge>
                      <Badge variant="neutral" className="text-[7.5px] uppercase font-bold px-1.5 py-0 bg-[var(--surface-secondary)] border-[var(--border)]">
                        {q.difficulty}
                      </Badge>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(q.id, e)}
                      className="p-1 rounded-md hover:bg-[var(--surface-secondary)]/10 text-text-mute hover:text-primary transition-colors cursor-pointer"
                    >
                      {isBookmarked ? (
                        <Star className="w-4 h-4 fill-primary text-primary" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs font-extrabold text-text-main leading-relaxed mb-4">
                    {q.text}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border)]/35 pt-4 mt-2">
                  <div className="flex flex-wrap gap-1 items-center max-w-[70%]">
                    <span className="text-[8.5px] text-text-mute font-black uppercase mr-1">Trained for:</span>
                    {q.companies?.slice(0, 3).map((comp) => (
                      <span key={comp} className="text-[8.5px] text-text-sub font-extrabold bg-[var(--surface-secondary)] border border-[var(--border)]/60 px-1 py-0.5 rounded">
                        {comp}
                      </span>
                    ))}
                    {q.companies && q.companies.length > 3 && (
                      <span className="text-[8px] text-text-mute font-bold">+{q.companies.length - 3}</span>
                    )}
                  </div>

                  <Button
                    onClick={() => onLaunchQuickPracticeWithQuestion(q)}
                    className="text-[9.5px] font-black h-8 px-3 flex items-center gap-1 bg-primary text-black cursor-pointer group-hover:scale-[1.01] transition-transform"
                  >
                    Quick Practice <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 py-12 text-center text-text-mute bg-[var(--surface)] rounded-2xl border border-[var(--border)]/70 flex flex-col items-center justify-center">
            <BookOpen className="w-10 h-10 text-text-mute/30 mb-2 stroke-[1.5]" />
            <h4 className="text-xs font-black text-text-main uppercase tracking-wider">No questions matched filters</h4>
            <p className="text-[10px] text-text-mute mt-1 max-w-xs leading-normal">
              Adjust your search keywords or lower your alignment matrices filters.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
