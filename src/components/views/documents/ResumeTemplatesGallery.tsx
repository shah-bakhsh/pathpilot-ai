/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Layout, Check, Sparkles, ExternalLink, Star } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useResume } from '../../../hooks/useResume';
import { useCareer } from '../../../contexts/CareerContext';
import { cn } from '../../../lib/utils';

interface TemplateOption {
  id: 'modern' | 'minimal' | 'professional' | 'corporate' | 'creative' | 'tech' | 'startup' | 'executive';
  name: string;
  category: string;
  description: string;
  colorBg: string;
  accentColor: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern Clean',
    category: 'Full Stack & Product',
    description: 'High-impact layout with bold section headings, metadata pills, and balanced negative space.',
    colorBg: 'bg-emerald-500/10',
    accentColor: 'text-emerald-500'
  },
  {
    id: 'minimal',
    name: 'Minimalist Monospace',
    category: 'Engineering & Systems',
    description: 'Clean typographic layout optimized for ATS parsers and technical interviewers.',
    colorBg: 'bg-blue-500/10',
    accentColor: 'text-blue-500'
  },
  {
    id: 'professional',
    name: 'Corporate Executive',
    category: 'Management & Finance',
    description: 'Classic serif headers, clear chronological work history, and structured credentials.',
    colorBg: 'bg-amber-500/10',
    accentColor: 'text-amber-500'
  },
  {
    id: 'corporate',
    name: 'Enterprise Legal',
    category: 'Corporate & Legal',
    description: 'Conservative dual-column design with dense information layout and formal typography.',
    colorBg: 'bg-purple-500/10',
    accentColor: 'text-purple-500'
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    category: 'Design & UX',
    description: 'Vibrant sidebar header with project showcases, skill tags, and social presence links.',
    colorBg: 'bg-rose-500/10',
    accentColor: 'text-rose-500'
  },
  {
    id: 'tech',
    name: 'Silicon Valley Tech',
    category: 'Cloud & AI',
    description: 'Tech-first structure with repository links, STAR bullets, and cloud certifications block.',
    colorBg: 'bg-cyan-500/10',
    accentColor: 'text-cyan-500'
  },
  {
    id: 'startup',
    name: 'Y Combinator Startup',
    category: 'Founders & Growth',
    description: 'Outcome-driven layout highlighting quantifiable metrics, key projects, and rapid velocity.',
    colorBg: 'bg-orange-500/10',
    accentColor: 'text-orange-500'
  },
  {
    id: 'executive',
    name: 'C-Suite Leadership',
    category: 'Director & VP',
    description: 'High-level executive summary, directorship achievements, and strategic leadership wins.',
    colorBg: 'bg-indigo-500/10',
    accentColor: 'text-indigo-500'
  }
];

interface ResumeTemplatesGalleryProps {
  onSelectTemplate?: (templateId: string) => void;
}

export const ResumeTemplatesGallery: React.FC<ResumeTemplatesGalleryProps> = ({ onSelectTemplate }) => {
  const { activeResume, changeTemplate } = useResume();
  const { addNotification } = useCareer();

  const handleApply = async (templateId: TemplateOption['id']) => {
    await changeTemplate(templateId);
    if (onSelectTemplate) onSelectTemplate(templateId);
    addNotification('Template Applied', `Switched active resume layout to "${templateId}".`, 'success');
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Header */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-base font-black text-text-main flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" /> Professional Resume Templates
          </h2>
          <p className="text-xs text-text-sub mt-1">
            Switch between 8 ATS-compliant templates instantly. Formatting is applied seamlessly without re-typing content.
          </p>
        </div>
        <Badge variant="primary" className="text-xs font-black py-1 px-3">
          Active Template: {activeResume?.templateId || 'modern'}
        </Badge>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TEMPLATES.map(tpl => {
          const isActive = activeResume?.templateId === tpl.id;

          return (
            <motion.div
              key={tpl.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'bg-[var(--surface)] border rounded-card p-5 flex flex-col justify-between transition-all shadow-xs relative overflow-hidden',
                isActive ? 'border-primary ring-2 ring-primary/40 bg-primary/5' : 'border-[var(--border)] hover:border-[var(--border-hover)]'
              )}
            >
              {/* Top Accent Band */}
              <div className={cn('h-1.5 w-full absolute top-0 left-0', tpl.colorBg.replace('/10', ''))} />

              <div>
                <div className="flex items-center justify-between gap-2 mt-1 mb-2">
                  <span className={cn('text-[10px] font-bold uppercase tracking-wider', tpl.accentColor)}>
                    {tpl.category}
                  </span>
                  {isActive && (
                    <Badge variant="primary" className="text-[9px] font-black py-0.5 px-1.5">
                      ACTIVE
                    </Badge>
                  )}
                </div>

                <h3 className="text-sm font-black text-text-main mt-1">{tpl.name}</h3>
                <p className="text-xs text-text-sub leading-relaxed mt-2">{tpl.description}</p>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-[var(--border)]/60">
                <Button
                  variant={isActive ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleApply(tpl.id)}
                  className="w-full text-xs font-bold h-8 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isActive ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-primary" /> Currently Selected
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Apply Template
                    </>
                  )}
                </Button>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
