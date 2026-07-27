/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EnrichedOpportunity } from './types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardContent, CardTitle } from '../../ui/Card';
import {
  ArrowLeft,
  Globe,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  BookOpen,
  Award,
  Clock,
  HelpCircle,
  FileCheck,
  ChevronRight,
  ListTodo
} from 'lucide-react';

interface OpportunityDetailsProps {
  opportunity: EnrichedOpportunity;
  onBack: () => void;
  onApplyPipeline: (opp: EnrichedOpportunity) => void;
}

type DetailsTab = 'overview' | 'process' | 'eligibility' | 'faqs';

export const OpportunityDetails: React.FC<OpportunityDetailsProps> = ({
  opportunity,
  onBack,
  onApplyPipeline
}) => {
  const [activeTab, setActiveTab] = useState<DetailsTab>('overview');

  const capitalize = (s: string) => s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-300">
      
      {/* HEADER ACTION ROW */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4 select-none">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 font-bold transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Discover Marketplace
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(opportunity.officialWebsite, '_blank', 'referrer')}
            className="h-9 px-3.5 text-xs font-bold border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-4 h-4" /> Official Website <ChevronRight className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onApplyPipeline(opportunity)}
            className="h-9 px-4 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/15"
          >
            Apply Pipeline <FileCheck className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* CORE INFO STRIP */}
      <div className="p-5 md:p-6 rounded-xl bg-slate-950/60 border border-slate-850/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-display font-extrabold text-sm select-none shadow-lg ${opportunity.orgLogo || 'bg-slate-800 text-slate-300'}`}>
            {opportunity.organization.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <Badge variant="primary" className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-2 py-0.5">
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
            <h2 className="font-display font-black text-lg md:text-xl text-white tracking-tight">{opportunity.title}</h2>
            <p className="text-xs text-slate-400 font-semibold">{opportunity.organization} • <span className="text-slate-500">{opportunity.location}</span></p>
          </div>
        </div>

        {/* METRICS PANEL */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850">
            <span className="text-[9px] uppercase font-black tracking-wider text-slate-500 block">Salary / Grant</span>
            <span className="text-sm font-bold text-emerald-400 truncate max-w-[120px] block mt-0.5">{opportunity.salaryOrFunding}</span>
          </div>
          <div className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-850">
            <span className="text-[9px] uppercase font-black tracking-wider text-slate-500 block">Deadline Date</span>
            <span className="text-sm font-bold text-rose-400 truncate max-w-[120px] block mt-0.5">{opportunity.deadline}</span>
          </div>
        </div>
      </div>

      {/* VIEW CONTROLLER TAB NAVIGATION */}
      <div className="flex border-b border-slate-800/80 gap-1 select-none">
        {(['overview', 'process', 'eligibility', 'faqs'] as DetailsTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-indigo-500 text-indigo-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ACTIVE SCREEN CONTENT */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* OVERVIEW DESCRIPTION */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Executive Overview
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-4 rounded-xl border border-slate-850/40">
                {opportunity.overview || opportunity.description}
              </p>
            </div>

            {/* REQUIREMENTS & RESPONSIBILITIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card className="bg-slate-900/20 border-slate-850/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <ListTodo className="w-4 h-4 text-indigo-400" /> Core Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {opportunity.responsibilities.map((resp, i) => (
                      <li key={i} className="flex gap-2.5 text-xs text-slate-300 leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/20 border-slate-850/80">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" /> Key Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {opportunity.requirements.map((req, i) => (
                      <li key={i} className="flex gap-2.5 text-xs text-slate-300 leading-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* BENEFITS */}
            {opportunity.benefits && opportunity.benefits.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Benefits & Compensation Package
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {opportunity.benefits.map((benefit, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-950/40 border border-slate-850/60 text-xs flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'process' && (
          <div className="space-y-6 animate-fade-in">
            {/* APPLICATION PIPELINE TIMELINE */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-400" /> Recruitment Pipeline Timeline
              </h3>
              
              <div className="relative pl-5 border-l-2 border-slate-800 space-y-6 ml-2.5 pt-1.5">
                {opportunity.timeline.map((step, i) => (
                  <div key={i} className="relative">
                    {/* Ring indicator */}
                    <div className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-slate-950 border-2 border-rose-400 shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">{step.date}</span>
                      <span className="text-xs font-bold text-slate-200 block">{step.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* APPLICATION PROCESS STEPS */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <ListTodo className="w-4 h-4 text-indigo-400" /> Detailed Application Procedure
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {opportunity.applicationProcess.map((step, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850/60 text-xs flex gap-3.5 items-start leading-normal">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="space-y-6 animate-fade-in">
            {/* ELIGIBILITY LIST */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-400" /> Candidate Eligibility Coordinates
              </h3>
              <ul className="space-y-2.5 bg-slate-950/20 p-4 rounded-xl border border-slate-850/40">
                {opportunity.eligibility.map((eligible, i) => (
                  <li key={i} className="flex gap-2.5 text-xs leading-normal">
                    <span className="text-indigo-400 font-bold mt-0.5">•</span>
                    <span>{eligible}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SELECTION PROCESS DETAILS */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <ListTodo className="w-4 h-4 text-emerald-400" /> Evaluation & Selection Metrics
              </h3>
              <ul className="space-y-2.5 bg-slate-950/20 p-4 rounded-xl border border-slate-850/40">
                {opportunity.selectionProcess.map((metric, i) => (
                  <li key={i} className="flex gap-2.5 text-xs leading-normal">
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RESOURCE LINKS */}
            {opportunity.resources && opportunity.resources.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-400" /> Primary Reference Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {opportunity.resources.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => window.open(res.url, '_blank', 'referrer')}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-850 hover:border-sky-500/30 text-xs text-slate-300 hover:text-white font-medium flex items-center justify-between text-left transition-all cursor-pointer"
                    >
                      <span className="truncate">{res.name}</span>
                      <Globe className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" /> Frequently Asked Questions
            </h3>

            {opportunity.faqs && opportunity.faqs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {opportunity.faqs.map((faq, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950/40 border border-slate-850/60 space-y-2">
                    <span className="text-xs font-black text-slate-200 block flex items-start gap-2 leading-tight">
                      <span className="text-indigo-400 uppercase font-black tracking-wider shrink-0 select-none">Q:</span>
                      {faq.question}
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed pl-5">
                      <span className="text-emerald-400 uppercase font-black tracking-wider select-none pr-1">A:</span>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-slate-850 bg-slate-950/10 text-center text-xs text-slate-500">
                No FAQs compiled for this opportunity coordinates yet.
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
