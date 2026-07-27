/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EnrichedOpportunity } from './types';
import { useCareer as useCareerGlobal } from '../../../contexts/CareerContext';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import {
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Star,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: EnrichedOpportunity;
  onViewDetails: (opp: EnrichedOpportunity) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onApplyPipeline: (opp: EnrichedOpportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onViewDetails,
  isBookmarked,
  onToggleBookmark,
  onApplyPipeline
}) => {
  const { resumeAnalysis } = useCareerGlobal();
  const [copied, setCopied] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Calculate high-fidelity AI Match Score Details
  const calculateMatchDetails = () => {
    const totalReqs = opportunity.requiredSkills.length;
    if (totalReqs === 0) {
      return {
        percentage: 75,
        found: [],
        missing: [],
        priority: 'Medium' as const,
        successRate: 70,
        recommendation: 'Good opportunity. Enhance your profile to raise compatibility.'
      };
    }

    const keywordsFoundInResume = resumeAnalysis?.keywordsFound || [];
    
    // Check intersection
    const found = opportunity.requiredSkills.filter(skill =>
      keywordsFoundInResume.some(kf => kf.toLowerCase() === skill.toLowerCase())
    );
    const missing = opportunity.requiredSkills.filter(skill =>
      !keywordsFoundInResume.some(kf => kf.toLowerCase() === skill.toLowerCase())
    );

    const matchRatio = found.length / totalReqs;
    let baseScore = Math.round(50 + matchRatio * 50);

    // If no resume uploaded, default back to realistic score based on skills length
    if (!resumeAnalysis) {
      baseScore = 70;
    }

    let priority: 'High' | 'Medium' | 'Low' = 'Medium';
    let successRate = Math.round(baseScore * 0.95);
    
    if (baseScore >= 85) {
      priority = 'High';
    } else if (baseScore < 65) {
      priority = 'Low';
    }

    let recommendation = '';
    if (priority === 'High') {
      recommendation = `Excellent match! You possess ${found.length} of ${totalReqs} requested skills. We suggest completing your cover letter and submitting today.`;
    } else if (priority === 'Medium') {
      recommendation = `Moderate match. Incorporate missing keywords: ${missing.slice(0, 2).join(', ')} into your resume before applying to raise success rates.`;
    } else {
      recommendation = `Targeted gaps identified. Master the missing stacks first or explore related training bootcamps.`;
    }

    return {
      percentage: baseScore,
      found,
      missing,
      priority,
      successRate,
      recommendation
    };
  };

  const match = calculateMatchDetails();

  // Handle Share copy link
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/opportunities/${opportunity.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic countdown calculations
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const deadlineDate = new Date(opportunity.deadline);
      const diffMs = deadlineDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeRemaining('Overdue');
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (days > 30) {
        setTimeRemaining(`in ${Math.floor(days / 30)} months`);
      } else if (days > 1) {
        setTimeRemaining(`${days} days left`);
      } else {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        setTimeRemaining(`${hours}h left`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);
    return () => clearInterval(interval);
  }, [opportunity.deadline]);

  // Color classes mapping for types
  const getTypeBadgeStyles = () => {
    switch (opportunity.type) {
      case 'job': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'internship': return 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
      case 'scholarship': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'hackathon': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'competition': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'research': return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      case 'fellowship': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const capitalize = (s: string) => s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <Card className="group relative overflow-hidden bg-slate-900/40 border-slate-800/80 hover:border-slate-700/60 transition-all duration-300 hover:shadow-lg flex flex-col h-full hover:bg-slate-900/60">
      
      {/* Dynamic glow effect on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl pointer-events-none" />

      <CardContent className="p-5 flex flex-col flex-1 gap-4">
        {/* TOP ROW: ORG INFO + BOOKMARK / SHARE */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center font-display font-extrabold text-xs select-none shadow-md ${opportunity.orgLogo || 'bg-slate-800 text-slate-300'}`}>
              {opportunity.organization.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-300 tracking-tight">{opportunity.organization}</span>
                {opportunity.orgRating && (
                  <span className="inline-flex items-center text-[10px] text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded-sm font-bold gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" /> {opportunity.orgRating}
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mt-0.5 select-all">
                {opportunity.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors relative"
              title="Share Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 bg-slate-950 text-emerald-400 font-bold rounded shadow-md border border-slate-800 uppercase tracking-wider">Copied</span>
              )}
            </button>
            <button
              onClick={() => onToggleBookmark(opportunity.id)}
              className={`p-1.5 rounded-lg hover:bg-slate-800 transition-all ${
                isBookmarked ? 'text-pink-500 bg-pink-500/5' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* METADATA INFO ROW */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-400 bg-slate-950/30 p-2.5 rounded-lg border border-slate-850/50">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate" title={opportunity.location}>{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate font-semibold text-emerald-300" title={opportunity.salaryOrFunding}>
              {opportunity.salaryOrFunding}
            </span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className={`truncate font-medium ${timeRemaining === 'Overdue' ? 'text-rose-400 font-bold' : ''}`}>
              {timeRemaining}
            </span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{opportunity.duration || 'Flexible'}</span>
          </div>
        </div>

        {/* AI MATCH COMPATIBILITY BLOCK */}
        <div className="p-3.5 rounded-lg bg-linear-to-r from-slate-950/60 to-slate-950/40 border border-slate-850/60 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> AI Matching Index
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                match.priority === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' :
                match.priority === 'Medium' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/15' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/15'
              }`}>
                {match.priority} Priority
              </span>
              <span className="text-sm font-display font-black text-indigo-400">
                {match.percentage}%
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">
            {match.recommendation}
          </p>

          {/* Key missing requirements warning */}
          {match.missing.length > 0 && (
            <div className="flex items-center gap-1.5 text-[9px] text-amber-500 font-bold uppercase tracking-wider bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10 mt-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span className="truncate">Missing Key: {match.missing.slice(0, 2).join(', ')}</span>
            </div>
          )}
        </div>

        {/* REQUIRED SKILLS BADGES */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-1">
            <Badge className={getTypeBadgeStyles()}>
              {capitalize(opportunity.type)}
            </Badge>
            <Badge variant="neutral" className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 border border-slate-700">
              {opportunity.locationType}
            </Badge>
            {opportunity.experienceLevel && (
              <Badge variant="neutral" className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 border border-slate-700">
                {opportunity.experienceLevel} Tier
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1 max-h-[50px] overflow-hidden">
            {opportunity.requiredSkills.map((skill, index) => {
              const matched = match.found.some(s => s.toLowerCase() === skill.toLowerCase());
              return (
                <span
                  key={index}
                  className={`text-[9px] px-2 py-0.5 rounded-sm font-medium tracking-tight border ${
                    matched
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS ROW */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-slate-800/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(opportunity)}
            className="w-full h-8.5 text-[11px] font-bold border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white flex items-center justify-center gap-1 cursor-pointer"
          >
            Details <ChevronRight className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onApplyPipeline(opportunity)}
            className="w-full h-8.5 text-[11px] font-black tracking-wide uppercase bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-indigo-600/15"
          >
            Apply Pipeline <FileCheck className="w-3.5 h-3.5" />
          </Button>
        </div>

      </CardContent>
    </Card>
  );
};
