/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CheckSquare,
  Square,
  Sparkles,
  ExternalLink,
  Plus,
  Filter,
  Check,
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  FileText,
  BookOpen,
  Target,
  Users
} from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';
import { AiCoachService } from '../../../services/aiCoachService';
import { AiRecommendation } from '../../../types';
import { Badge } from '../../ui/Badge';

export const AiRecommendationsView: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const loadRecommendations = async () => {
    if (!user) return;
    const data = await AiCoachService.getRecommendations(user.uid);
    setRecommendations(data);
  };

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const handleToggle = async (recId: string) => {
    if (!user) return;
    await AiCoachService.toggleRecommendation(user.uid, recId);
    loadRecommendations();
  };

  const filtered = recommendations.filter(r => {
    if (selectedFilter !== 'all' && r.category !== selectedFilter) return false;
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'job_search', label: 'Job Search', icon: Briefcase },
    { id: 'skill_building', label: 'Skills', icon: BookOpen },
    { id: 'interview', label: 'Interview', icon: Target },
    { id: 'networking', label: 'Networking', icon: Users }
  ];

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'high':
        return <Badge variant="error">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      default:
        return <Badge variant="info">Low Priority</Badge>;
    }
  };

  return (
    <div id="ai-recommendations-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold">Personalized AI Recommendations</h1>
          </div>
          <p className="text-xs text-emerald-200/80">
            High-yield, tailored action items generated from your primary resume diagnostic and active career goals.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedFilter(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              selectedFilter === cat.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-3">
        {filtered.map(rec => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleToggle(rec.id)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              rec.isCompleted
                ? 'bg-[var(--color-bg-secondary)]/50 border-[var(--color-border)] opacity-60'
                : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] hover:border-emerald-500/50 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3 flex-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(rec.id);
                }}
                className={`mt-1 p-1 rounded-lg transition-colors ${
                  rec.isCompleted ? 'text-emerald-500' : 'text-[var(--color-text-secondary)] hover:text-emerald-500'
                }`}
              >
                {rec.isCompleted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
              </button>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-sm font-bold ${rec.isCompleted ? 'line-through text-[var(--color-text-secondary)]' : 'text-[var(--color-text-primary)]'}`}>
                    {rec.title}
                  </h3>
                  {getPriorityBadge(rec.priority)}
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>

            {rec.actionLabel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (rec.actionUrl) window.location.hash = rec.actionUrl.replace('#', '');
                }}
                className="px-3.5 py-2 rounded-xl bg-[var(--color-bg-tertiary)] hover:bg-emerald-600 hover:text-white border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5 transition-all shrink-0"
              >
                <span>{rec.actionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AiRecommendationsView;
