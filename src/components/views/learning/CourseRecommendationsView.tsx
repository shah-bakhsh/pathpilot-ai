/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap, Search, Filter, Star, Clock, DollarSign,
  ExternalLink, Sparkles, BookOpen, Video, Code2, Plus, CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface CourseRecommendationsViewProps {
  recommendations: any[];
  loadingRecommendations: boolean;
  onFetchRecommendations: (skillGap?: string) => void;
  onAddCourse: (course: any) => void;
  addXp: (amount: number) => void;
}

export const CourseRecommendationsView: React.FC<CourseRecommendationsViewProps> = ({
  recommendations,
  loadingRecommendations,
  onFetchRecommendations,
  onAddCourse,
  addXp
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const defaultRecs = recommendations.length > 0 ? recommendations : [
    {
      id: 'rec_1',
      title: 'Mastering High-Performance System Design & Microservices',
      provider: 'Coursera & Duke University',
      type: 'course',
      url: 'https://www.coursera.org',
      rating: 4.9,
      studentsEnrolled: '42,000+',
      duration: '18 Hours',
      difficulty: 'Intermediate',
      isFree: false,
      cost: '$49/mo',
      skillsTaught: ['System Design', 'Redis Caching', 'Load Balancing', 'Microservices'],
      matchScore: 96,
      reason: 'Directly addresses your primary system design skill gap with real-world architecture case studies.'
    },
    {
      id: 'rec_2',
      title: 'Google Cloud Run & Serverless Container Microservices',
      provider: 'YouTube - Google Cloud Tech',
      type: 'youtube',
      url: 'https://www.youtube.com',
      rating: 4.8,
      studentsEnrolled: '120,000+',
      duration: '4.5 Hours',
      difficulty: 'Beginner',
      isFree: true,
      cost: 'Free',
      skillsTaught: ['Google Cloud Run', 'Docker', 'IAM Security', 'Container Registry'],
      matchScore: 94,
      reason: 'Free, high-yield tutorial series covering production deployments on Google Cloud Run.'
    },
    {
      id: 'rec_3',
      title: 'Designing Data-Intensive Applications (Official Handbook)',
      provider: 'O\'Reilly Media (Book)',
      type: 'book',
      url: 'https://www.oreilly.com',
      rating: 4.95,
      studentsEnrolled: '250,000+',
      duration: '30 Hours',
      difficulty: 'Advanced',
      isFree: false,
      cost: '$45',
      skillsTaught: ['Distributed Systems', 'Consensus Algorithms', 'Replication', 'Partitioning'],
      matchScore: 98,
      reason: 'The industry-standard bible for senior backend engineers mastering data reliability and scale.'
    },
    {
      id: 'rec_4',
      title: 'LeetCode System Design & Distributed Rate Limiter Drill',
      provider: 'LeetCode & ByteByteGo',
      type: 'practice_platform',
      url: 'https://leetcode.com',
      rating: 4.85,
      studentsEnrolled: '85,000+',
      duration: '10 Hours',
      difficulty: 'Intermediate',
      isFree: true,
      cost: 'Free',
      skillsTaught: ['Token Bucket Algorithm', 'Distributed Mutex', 'API Throttling'],
      matchScore: 92,
      reason: 'Interactive coding lab to implement a real-world distributed rate limiter in Node.js.'
    },
    {
      id: 'rec_5',
      title: 'Full-Stack Testing Masterclass (Jest, React Testing Library, Playwright)',
      provider: 'Frontend Masters',
      type: 'course',
      url: 'https://frontendmasters.com',
      rating: 4.9,
      studentsEnrolled: '18,000+',
      duration: '12 Hours',
      difficulty: 'Intermediate',
      isFree: false,
      cost: '$39/mo',
      skillsTaught: ['Unit Testing', 'E2E Testing', 'Mocking', 'Code Coverage'],
      matchScore: 90,
      reason: 'Closes automated testing gap with hands-on test suite implementations.'
    }
  ];

  const filtered = defaultRecs.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skillsTaught.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCatalogItem = (item: any) => {
    onAddCourse({
      title: item.title,
      source: item.provider,
      hoursTotal: parseInt(item.duration) || 15,
      hoursCompleted: 0,
      status: 'in_progress',
      scheduleDay: 'Monday',
      priority: 'high',
      url: item.url
    });
    setAddedIds(prev => ({ ...prev, [item.id]: true }));
    addXp(30);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube': return Video;
      case 'book': return BookOpen;
      case 'practice_platform': return Code2;
      default: return GraduationCap;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
              AI Course Recommendation Engine
            </Badge>
            <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">
              Verified Providers
            </Badge>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Curated Learning Resources
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Top-tier courses, books, tutorials, and practice platforms tailored specifically to your active skill gaps.
          </p>
        </div>

        <Button
          onClick={() => onFetchRecommendations()}
          disabled={loadingRecommendations}
          className="flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Sparkles className="w-4 h-4 text-indigo-300" />
          Refresh AI Recommendations
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search skills, providers, courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-950 border-slate-800 text-xs text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'course', 'youtube', 'book', 'practice_platform'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition shrink-0 ${
                typeFilter === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const IconComponent = getTypeIcon(item.type);
          const isAdded = !!addedIds[item.id];

          return (
            <Card key={item.id} className="bg-slate-900/30 border-slate-800 flex flex-col justify-between hover:border-slate-700 transition">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {item.provider}
                      </span>
                      <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                        {item.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-white leading-snug">{item.title}</CardTitle>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-xs font-black shrink-0">
                    {item.matchScore}% Match
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.reason}</p>
              </CardHeader>

              <CardContent className="pt-0 flex flex-col gap-4">
                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {item.skillsTaught?.map((s: string, idx: number) => (
                    <Badge key={idx} className="bg-slate-950 text-slate-300 border-slate-800 text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>

                {/* Details Footer */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {item.duration}
                    </span>
                    <span className="font-semibold text-slate-300">
                      {item.cost}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Button
                      size="sm"
                      onClick={() => handleCatalogItem(item)}
                      disabled={isAdded}
                      className={isAdded ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500'}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Cataloged
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add to Hub
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
