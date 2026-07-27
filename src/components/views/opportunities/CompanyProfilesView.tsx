/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TRENDING_COMPANIES } from './mockData';
import { Card, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Star, MapPin, Layers, Heart, Users, Globe, ChevronRight } from 'lucide-react';

interface CompanyProfile {
  name: string;
  rating: number;
  openRolesCount: number;
  logo: string;
  techStack: string[];
  employees: string;
  headquarters: string;
  culture: string[];
  benefits: string[];
  website: string;
}

const EXTENDED_COMPANIES: CompanyProfile[] = [
  {
    name: 'Google Cloud',
    rating: 4.7,
    openRolesCount: 14,
    logo: 'bg-blue-600 text-white',
    techStack: ['GCP', 'Kubernetes', 'TypeScript', 'Docker', 'Go'],
    employees: '10,000+',
    headquarters: 'Sunnyvale, CA',
    culture: ['Googliness', 'Diverse Innovation', 'Scalable Engineering', 'Open Source support'],
    benefits: ['Onsite gourmet meals', 'Health insurance with no deductible', 'M3 MacBook Pro choice', '401(k) matching'],
    website: 'https://cloud.google.com'
  },
  {
    name: 'Stripe',
    rating: 4.8,
    openRolesCount: 8,
    logo: 'bg-indigo-600 text-white',
    techStack: ['Ruby', 'Go', 'PostgreSQL', 'Redis', 'OAuth2'],
    employees: '5,000 - 10,000',
    headquarters: 'San Francisco, CA',
    culture: ['Developer first', 'Rigorous API Standards', 'Long-term thinking', 'Async collaboration'],
    benefits: ['Uncapped PTO', 'Home office stipend ($2,000)', 'Annual learning budget', 'Comprehensive fertility coverage'],
    website: 'https://stripe.com'
  },
  {
    name: 'OpenAI',
    rating: 4.9,
    openRolesCount: 5,
    logo: 'bg-emerald-600 text-white',
    techStack: ['Python', 'PyTorch', 'Next.js', 'Vector Databases', 'Rust'],
    employees: '1,000 - 5,000',
    headquarters: 'San Francisco, CA',
    culture: ['AGI Alignment', 'High agency', 'Rapid release cycles', 'Safety first'],
    benefits: ['Exceptional equity packages', 'Free gourmet catering daily', 'Unlimited learning resources', 'Family leave support'],
    website: 'https://openai.com'
  },
  {
    name: 'Notion',
    rating: 4.6,
    openRolesCount: 9,
    logo: 'bg-black text-white border border-gray-750',
    techStack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'PostgreSQL'],
    employees: '500 - 1,000',
    headquarters: 'San Francisco, CA',
    culture: ['Craftsmanship', 'Design obsessed', 'Consolidation of workflows', 'Playful details'],
    benefits: ['Beautiful SF office setting', 'Full wellness stipend', 'Interactive team offsites', 'Top-tier tech setup'],
    website: 'https://notion.so'
  }
];

export const CompanyProfilesView: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);

  return (
    <div className="space-y-6 w-full animate-fade-in text-slate-300">
      
      {/* HEADER COORDS */}
      <div className="border-b border-slate-800 pb-3 select-none">
        <h2 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
          🏢 Company Profiles Explorer
        </h2>
        <p className="text-xs text-slate-400">Discover corporate cultures, internal tech stacks, benefits, and ratings from the world's leading brands.</p>
      </div>

      {selectedCompany ? (
        /* DETAIL SCREEN */
        <div className="space-y-6 animate-fade-in">
          
          {/* Back button */}
          <button
            onClick={() => setSelectedCompany(null)}
            className="text-xs text-slate-400 hover:text-slate-200 font-bold flex items-center gap-1 select-none cursor-pointer"
          >
            ← Back to Company Directory
          </button>

          {/* Core metadata box */}
          <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-display font-black text-lg select-none shadow-xl ${selectedCompany.logo}`}>
                {selectedCompany.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1.5">
                <h3 className="font-display font-black text-lg md:text-xl text-white tracking-tight leading-none">{selectedCompany.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span className="text-xs font-extrabold text-amber-400">{selectedCompany.rating} Rating</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-semibold">{selectedCompany.employees} Employees</span>
                </div>
                <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 pt-0.5 select-all">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" /> {selectedCompany.headquarters}
                </p>
              </div>
            </div>

            <button
              onClick={() => window.open(selectedCompany.website, '_blank', 'referrer')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-wider rounded-lg shadow-md transition-all cursor-pointer"
            >
              Visit Website
            </button>
          </div>

          {/* Main profile contents columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 select-none">
            
            {/* Left: tech stack and culture */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Tech Stack */}
              <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-850/80 space-y-2.5">
                <span className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" /> Standard Engineering Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCompany.techStack.map((tech) => (
                    <Badge key={tech} variant="neutral" className="bg-slate-950 text-slate-200 border border-slate-850 text-xs px-2.5 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Culture */}
              <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-850/80 space-y-2.5">
                <span className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" /> Cultural Pillars
                </span>
                <ul className="space-y-2">
                  {selectedCompany.culture.map((c, i) => (
                    <li key={i} className="flex gap-2.5 text-xs text-slate-300 leading-normal">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right: benefits */}
            <div className="md:col-span-5">
              <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-850/80 space-y-2.5 h-full">
                <span className="text-[10px] uppercase font-black text-slate-400 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400" /> Perks & Compensation Benefits
                </span>
                <ul className="space-y-3">
                  {selectedCompany.benefits.map((benefit, i) => (
                    <li key={i} className="flex gap-2.5 text-xs text-slate-300 leading-normal items-start">
                      <span className="text-emerald-400 font-bold mt-0.5 shrink-0">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* LIST SCREEN DIRECTORY */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXTENDED_COMPANIES.map((company, i) => (
            <Card
              key={i}
              className="bg-slate-900/40 border-slate-850 hover:border-slate-750 hover:bg-slate-900/60 transition-all cursor-pointer flex flex-col h-full overflow-hidden"
              onClick={() => setSelectedCompany(company)}
            >
              <CardContent className="p-4 flex flex-col justify-between flex-1 gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-[10px] select-none shadow-md ${company.logo}`}>
                      {company.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 block truncate max-w-[150px]">{company.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 select-all mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" /> {company.headquarters.split(',')[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-black">{company.rating}</span>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-bold mt-0.5">{company.openRolesCount} open roles</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 border-t border-slate-800/50 pt-3 select-none">
                  {company.techStack.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-[8px] bg-slate-950 border border-slate-850 text-slate-400 px-2 py-0.5 rounded-sm font-semibold">
                      {tech}
                    </span>
                  ))}
                  {company.techStack.length > 3 && (
                    <span className="text-[8px] text-slate-500 font-bold px-1 py-0.5">+{company.techStack.length - 3} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-indigo-400 font-bold pt-1 select-none">
                  <span>Explore culture & perks</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
};
