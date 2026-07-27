/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EnrichedOpportunity } from './types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { Heart, Trash2, MapPin, DollarSign, Calendar, ChevronRight } from 'lucide-react';

interface BookmarkManagerProps {
  bookmarkedOpps: EnrichedOpportunity[];
  onRemoveBookmark: (id: string) => void;
  onViewDetails: (opp: EnrichedOpportunity) => void;
  onApplyPipeline: (opp: EnrichedOpportunity) => void;
}

export const BookmarkManager: React.FC<BookmarkManagerProps> = ({
  bookmarkedOpps,
  onRemoveBookmark,
  onViewDetails,
  onApplyPipeline
}) => {
  const capitalize = (s: string) => s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="space-y-5 w-full animate-fade-in text-slate-300">
      
      {/* HEADER ROW */}
      <div className="border-b border-slate-800 pb-3 select-none">
        <h2 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
          💖 Saved Opportunity Vault
        </h2>
        <p className="text-xs text-slate-400">Keep track of interesting job listings, scholarships, and hackathons in your local sandbox.</p>
      </div>

      {/* BOOKMARK CARDS GRID */}
      {bookmarkedOpps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarkedOpps.map((opp) => (
            <Card
              key={opp.id}
              className="bg-slate-900/40 border-slate-850 hover:border-slate-750 hover:bg-slate-900/60 transition-all flex flex-col h-full overflow-hidden"
            >
              <CardContent className="p-4 flex flex-col justify-between flex-1 gap-3.5">
                {/* Header info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center font-display font-black text-xs select-none shadow-md ${opp.orgLogo || 'bg-slate-800 text-slate-300'}`}>
                      {opp.organization.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">{opp.organization}</span>
                      <h4 className="text-xs font-bold text-slate-100 block truncate max-w-[180px]">{opp.title}</h4>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveBookmark(opp.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-all"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info blocks strip */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 bg-slate-950/20 p-2 rounded-lg border border-slate-850/40 select-none">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span className="truncate">{opp.location.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-emerald-300">
                    <DollarSign className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{opp.salaryOrFunding.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">{opp.deadline}</span>
                  </div>
                </div>

                {/* Sub-tags */}
                <div className="flex flex-wrap gap-1.5 select-none">
                  <Badge variant="primary" className="text-[9px] bg-indigo-500/10 border-indigo-500/20 text-indigo-400 px-2 py-0.2">
                    {capitalize(opp.type)}
                  </Badge>
                  <Badge variant="neutral" className="bg-slate-800 text-slate-300 text-[9px] px-2 py-0.2 border border-slate-700">
                    {opp.locationType}
                  </Badge>
                </div>

                {/* Actions row */}
                <div className="grid grid-cols-2 gap-2 border-t border-slate-800/40 pt-2.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(opp)}
                    className="h-8.5 text-[11px] font-bold border-slate-850 hover:border-slate-750 text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onApplyPipeline(opp)}
                    className="h-8.5 text-[11px] font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Apply Pipeline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="h-60 rounded-xl border-2 border-dashed border-slate-850 bg-slate-950/10 flex flex-col items-center justify-center p-6 text-center text-slate-500">
          <Heart className="w-8 h-8 opacity-25 mb-2 text-pink-500 animate-pulse" />
          <h4 className="text-xs font-bold text-slate-400 select-none">Bookmark Vault is Empty</h4>
          <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-normal select-none">
            As you explore jobs, internships, and hackathons, click the bookmark ribbon icon on cards to vault them here for rapid review.
          </p>
        </div>
      )}

    </div>
  );
};
