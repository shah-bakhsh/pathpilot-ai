/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EnrichedOpportunity } from './types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { Calendar, AlertTriangle, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

interface DeadlineTrackerViewProps {
  opportunities: EnrichedOpportunity[];
  onViewDetails: (opp: EnrichedOpportunity) => void;
}

interface DeadlineItem {
  opportunity: EnrichedOpportunity;
  daysLeft: number;
  category: 'today' | 'week' | 'month' | 'future' | 'overdue';
}

export const DeadlineTrackerView: React.FC<DeadlineTrackerViewProps> = ({
  opportunities,
  onViewDetails
}) => {
  const [deadlineList, setDeadlineList] = useState<DeadlineItem[]>([]);

  useEffect(() => {
    const parseDeadlines = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const parsed: DeadlineItem[] = opportunities.map((opp) => {
        const deadlineDate = new Date(opp.deadline);
        deadlineDate.setHours(0, 0, 0, 0);

        const diffMs = deadlineDate.getTime() - now.getTime();
        const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

        let category: DeadlineItem['category'] = 'future';
        if (daysLeft < 0) {
          category = 'overdue';
        } else if (daysLeft === 0) {
          category = 'today';
        } else if (daysLeft <= 7) {
          category = 'week';
        } else if (daysLeft <= 30) {
          category = 'month';
        }

        return {
          opportunity: opp,
          daysLeft,
          category
        };
      });

      // Sort chronological: overdue first, then today, then week, then month
      parsed.sort((a, b) => a.daysLeft - b.daysLeft);
      setDeadlineList(parsed);
    };

    parseDeadlines();
  }, [opportunities]);

  const overdueList = deadlineList.filter((item) => item.category === 'overdue');
  const todayList = deadlineList.filter((item) => item.category === 'today');
  const weekList = deadlineList.filter((item) => item.category === 'week');
  const monthList = deadlineList.filter((item) => item.category === 'month');

  const getDaysLeftText = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return `CLOSING TODAY`;
    if (days === 1) return `1 day left`;
    return `${days} days left`;
  };

  const getDaysBadgeStyles = (category: DeadlineItem['category']) => {
    switch (category) {
      case 'overdue': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'today': return 'bg-rose-600 text-white font-black animate-pulse border border-rose-500';
      case 'week': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'month': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 w-full animate-fade-in text-slate-300">
      
      {/* HEADER COORDS */}
      <div className="border-b border-slate-800 pb-3 select-none">
        <h2 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
          ⏰ Application Closing Countdown
        </h2>
        <p className="text-xs text-slate-400">Chronological analysis of application closing dates across matched opportunities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: DANGER ZONES (TODAY & OVERDUE) */}
        <div className="md:col-span-5 space-y-4">
          
          {/* CLOSING TODAY */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-rose-400 flex items-center gap-1">
              <Clock className="w-4 h-4 animate-spin shrink-0" /> Critical: Closing Today!
            </span>

            {todayList.length > 0 ? (
              <div className="space-y-2 select-none">
                {todayList.map((item) => (
                  <Card key={item.opportunity.id} className="bg-rose-500/5 border-rose-500/20 hover:border-rose-500/45 transition-all">
                    <CardContent className="p-3.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-rose-400 uppercase">{item.opportunity.organization}</span>
                        <h4 className="text-xs font-black text-white block mt-0.5">{item.opportunity.title}</h4>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onViewDetails(item.opportunity)}
                        className="h-8.5 px-3 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-850 bg-slate-950/10 text-center text-xs text-slate-500 font-medium select-none">
                <CheckCircle2 className="w-5 h-5 text-emerald-400/60 mx-auto mb-1" /> No pipelines closing today.
              </div>
            )}
          </div>

          {/* OVERDUE PIPELINES */}
          {overdueList.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 flex items-center gap-1 select-none">
                <AlertTriangle className="w-4 h-4 text-slate-500" /> Overdue Pipelines
              </span>

              <div className="space-y-2">
                {overdueList.map((item) => (
                  <div
                    key={item.opportunity.id}
                    className="p-3 rounded-xl border border-slate-850 bg-slate-950/20 text-xs flex items-center justify-between gap-4 select-none"
                  >
                    <div>
                      <span className="text-[9px] font-semibold text-slate-500 uppercase">{item.opportunity.organization}</span>
                      <h4 className="text-xs font-bold text-slate-400 block">{item.opportunity.title}</h4>
                    </div>
                    <Badge variant="neutral" className="bg-slate-900 border-slate-800 text-[10px] text-slate-500 font-bold">
                      Closed {Math.abs(item.daysLeft)}d ago
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PROGRESSIVE TIMELINES */}
        <div className="md:col-span-7 flex flex-col gap-5">
          
          {/* CLOSING THIS WEEK */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1 select-none">
              <Calendar className="w-4 h-4 text-amber-500" /> Closing This Week
            </span>

            {weekList.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {weekList.map((item) => (
                  <div
                    key={item.opportunity.id}
                    onClick={() => onViewDetails(item.opportunity)}
                    className="p-3.5 rounded-xl border border-slate-850 hover:border-slate-750 bg-slate-900/30 hover:bg-slate-900/50 cursor-pointer transition-all flex items-center justify-between gap-4 select-all"
                  >
                    <div>
                      <span className="text-[9px] text-indigo-400 font-black uppercase tracking-wider block">{item.opportunity.organization}</span>
                      <span className="text-xs font-bold text-slate-200 block">{item.opportunity.title}</span>
                    </div>
                    <span className={`px-2 py-0.8 rounded-sm font-semibold tracking-tight text-[10px] uppercase shrink-0 ${getDaysBadgeStyles(item.category)}`}>
                      {getDaysLeftText(item.daysLeft)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-850 bg-slate-950/10 text-center text-xs text-slate-500 font-medium select-none">
                No opportunities closing this week.
              </div>
            )}
          </div>

          {/* CLOSING THIS MONTH */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1 select-none">
              <Calendar className="w-4 h-4 text-indigo-400" /> Closing This Month (Within 30 Days)
            </span>

            {monthList.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-0.5">
                {monthList.map((item) => (
                  <div
                    key={item.opportunity.id}
                    onClick={() => onViewDetails(item.opportunity)}
                    className="p-3 rounded-xl border border-slate-850 hover:border-slate-750 bg-slate-900/30 hover:bg-slate-900/50 cursor-pointer transition-all flex items-center justify-between gap-4 select-all"
                  >
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{item.opportunity.organization}</span>
                      <span className="text-xs font-bold text-slate-300 block">{item.opportunity.title}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-sm font-medium tracking-tight text-[10px] shrink-0 ${getDaysBadgeStyles(item.category)}`}>
                      {getDaysLeftText(item.daysLeft)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-850 bg-slate-950/10 text-center text-xs text-slate-500 font-medium select-none">
                No opportunities closing this month.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
