/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Clock,
  ExternalLink,
  CheckCircle2,
  Circle,
  Award,
  Zap,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';
import { AiCoachService } from '../../../services/aiCoachService';
import { LearningRecommendationItem } from '../../../types';
import { Badge } from '../../ui/Badge';

export const LearningRecommendationsView: React.FC = () => {
  const { user } = useAuth();
  const [learningItems, setLearningItems] = useState<LearningRecommendationItem[]>([]);

  const loadLearningItems = async () => {
    if (!user) return;
    const data = await AiCoachService.getLearningRecommendations(user.uid);
    setLearningItems(data);
  };

  useEffect(() => {
    loadLearningItems();
  }, [user]);

  const handleToggle = async (itemId: string) => {
    if (!user) return;
    await AiCoachService.toggleLearningItem(user.uid, itemId);
    loadLearningItems();
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'advanced':
        return <Badge variant="error">Advanced</Badge>;
      case 'intermediate':
        return <Badge variant="warning">Intermediate</Badge>;
      default:
        return <Badge variant="info">Beginner</Badge>;
    }
  };

  return (
    <div id="learning-recommendations-view" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold">Curated AI Learning Recommendations</h1>
          </div>
          <p className="text-xs text-cyan-200/80">
            Targeted courses, documentation, and technical drills calculated to eliminate your skill gap vectors.
          </p>
        </div>
      </div>

      {/* Learning Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {learningItems.map(item => (
          <motion.div
            key={item.id}
            whileHover={{ y: -2 }}
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              item.isCompleted
                ? 'bg-[var(--color-bg-secondary)]/60 border-[var(--color-border)]'
                : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] hover:border-cyan-500/50 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge variant="primary" className="text-[10px]">
                  {item.skillTarget}
                </Badge>
                {getDifficultyBadge(item.difficulty)}
              </div>

              <h3 className={`text-sm font-bold mb-2 ${item.isCompleted ? 'line-through text-[var(--color-text-secondary)]' : 'text-[var(--color-text-primary)]'}`}>
                {item.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mb-4">
                <span>Provider: {item.provider}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.duration}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-[11px] font-semibold text-[var(--color-text-secondary)]">
                  <span>Progress</span>
                  <span>{item.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
              <button
                onClick={() => handleToggle(item.id)}
                className={`text-xs font-semibold flex items-center gap-1.5 ${
                  item.isCompleted ? 'text-emerald-500' : 'text-[var(--color-text-secondary)] hover:text-cyan-500'
                }`}
              >
                {item.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                <span>{item.isCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>

              {item.resourceUrl && (
                <a
                  href={item.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[var(--color-bg-tertiary)] hover:bg-cyan-600 hover:text-white text-[var(--color-text-secondary)] transition-colors"
                  title="Open Resource"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearningRecommendationsView;
