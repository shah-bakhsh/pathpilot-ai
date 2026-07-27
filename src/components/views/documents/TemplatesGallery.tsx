/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Sparkles, Plus, Copy, Check, Star, Filter, Search, BookOpen,
  GraduationCap, Briefcase, Award, Code, Globe, Terminal, ShieldCheck
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { cn } from '../../../lib/utils';
import { DocumentService } from '../../../services/documentService';
import { DocumentTemplate, SupportedDocType } from '../../../types/documentTypes';

interface TemplatesGalleryProps {
  onUseTemplate: (template: DocumentTemplate) => Promise<void>;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onUseTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const templates = DocumentService.getBuiltInTemplates();

  const CATEGORIES = [
    'All',
    'Software Engineer',
    'AI Engineer',
    'Data Scientist',
    'Cybersecurity',
    'Research',
    'Scholarships',
    'Graduate School',
    'Startup'
  ];

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Header callout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Document Templates // Industry Proven
          </span>
          <h2 className="text-xl font-black text-text-main tracking-tight mt-1">
            Executive Document Templates Gallery
          </h2>
          <p className="text-xs text-text-sub mt-1 max-w-2xl leading-relaxed">
            Choose from high-performance templates designed for software engineering, AI research, graduate school admissions, and scholarship grants.
          </p>
        </div>

        <Badge variant="primary" className="text-xs font-black py-1 px-3 shrink-0">
          {templates.length} Templates Available
        </Badge>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[var(--surface)] p-3 rounded-card border border-[var(--border)]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-mute absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates by role, category, or keywords..."
            className="w-full bg-[var(--background)] text-xs text-text-main pl-9 pr-3 py-2 rounded-lg border border-[var(--border)] outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 shrink-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0',
                selectedCategory === cat
                  ? 'border-primary bg-primary text-black'
                  : 'border-[var(--border)] text-text-sub hover:bg-[var(--surface-secondary)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(tmpl => (
          <Card key={tmpl.id} className="border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between p-5 hover:border-primary/50 transition-all group">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-black text-primary">
                  {tmpl.category}
                </Badge>
                {tmpl.is_popular && (
                  <span className="text-[9px] font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" /> Popular
                  </span>
                )}
              </div>

              <h3 className="text-sm font-black text-text-main tracking-tight mt-1 group-hover:text-primary transition-colors">
                {tmpl.title}
              </h3>

              <p className="text-xs text-text-sub leading-relaxed">
                {tmpl.description}
              </p>

              <div className="flex flex-wrap gap-1 mt-2">
                {tmpl.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-semibold text-text-mute bg-[var(--background)] px-1.5 py-0.5 rounded border border-[var(--border)]/50">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--border)]/60">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onUseTemplate(tmpl)}
                className="w-full text-xs font-black gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Use This Template
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
