/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, Search, Filter, Calendar, Award, ChevronRight, FileText, Download, Bookmark, Trash2, CheckCircle2, Clock
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { InterviewSession, CompanyName } from './InterviewTypes';
import { InterviewService } from '../../../services/interviewService';

interface InterviewHistoryViewProps {
  sessions: InterviewSession[];
  onViewSession: (session: InterviewSession) => void;
  onRefreshSessions?: () => void;
}

export const InterviewHistoryView: React.FC<InterviewHistoryViewProps> = ({
  sessions,
  onViewSession,
  onRefreshSessions
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('ALL');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState<string>('ALL');

  // Filtered Sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCompany = selectedCompanyFilter === 'ALL' || session.company === selectedCompanyFilter;

    let matchesScore = true;
    if (selectedScoreFilter === 'HIGH') matchesScore = session.overallScore >= 85;
    if (selectedScoreFilter === 'MEDIUM') matchesScore = session.overallScore >= 70 && session.overallScore < 85;
    if (selectedScoreFilter === 'LOW') matchesScore = session.overallScore < 70;

    return matchesSearch && matchesCompany && matchesScore;
  });

  const handleExportHistoryJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pathpilot_interview_history_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      
      {/* Banner Header */}
      <div className="p-6 rounded-card border border-[var(--border)] bg-[var(--surface)] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col max-w-2xl">
          <Badge variant="primary" className="text-[9px] uppercase tracking-widest font-black px-2.5 py-0.5 self-start mb-3 bg-primary/10 text-primary">
            <History className="w-3.5 h-3.5 mr-1" /> Persistent Interview Logs
          </Badge>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight">
            Complete Interview Practice History & Transcripts
          </h1>
          <p className="text-xs text-text-mute mt-2 leading-relaxed">
            Review past mock interview transcripts, track evaluation scores, read recruiter notes, and export comprehensive practice records.
          </p>
        </div>
        <Button
          onClick={handleExportHistoryJSON}
          variant="outline"
          className="text-xs font-black h-10 px-4 border-[var(--border)] hover:bg-[var(--surface-secondary)]/20 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export Transcripts (JSON)
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-mute absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by company, session type, or category..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Company Filter */}
          <select
            value={selectedCompanyFilter}
            onChange={e => setSelectedCompanyFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--surface-secondary)]/20 border border-[var(--border)] text-text-main"
          >
            <option value="ALL">All Companies</option>
            <option value="Google">Google</option>
            <option value="Meta">Meta</option>
            <option value="Amazon">Amazon</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Apple">Apple</option>
            <option value="Netflix">Netflix</option>
          </select>

          {/* Score Filter */}
          <select
            value={selectedScoreFilter}
            onChange={e => setSelectedScoreFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--surface-secondary)]/20 border border-[var(--border)] text-text-main"
          >
            <option value="ALL">All Scores</option>
            <option value="HIGH">High Score (85%+)</option>
            <option value="MEDIUM">Medium Score (70-84%)</option>
            <option value="LOW">Needs Work (&lt;70%)</option>
          </select>
        </div>
      </div>

      {/* History Log List */}
      <div className="flex flex-col gap-3">
        {filteredSessions.length === 0 ? (
          <Card className="bg-[var(--surface)] border-[var(--border)] p-8 text-center text-text-mute text-xs">
            No interview sessions match the selected filters.
          </Card>
        ) : (
          filteredSessions.map((session) => (
            <Card
              key={session.id}
              className="bg-[var(--surface)] border-[var(--border)] hover:border-primary/40 transition-all cursor-pointer"
              onClick={() => onViewSession(session)}
            >
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                    {session.company.slice(0, 2)}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-text-main">{session.company}</span>
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {session.type}
                      </Badge>
                      <Badge variant="primary" className="text-[10px] font-bold">
                        {session.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-text-mute">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {new Date(session.timestamp).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.round(session.durationSeconds / 60)} Mins</span>
                      <span>Category: {session.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-black text-text-main leading-none">{session.overallScore}%</span>
                    <span className="text-[10px] text-emerald-400 font-bold mt-1">
                      {session.hiringRecommendation || (session.overallScore >= 80 ? 'Approved Round' : 'Practice Target')}
                    </span>
                  </div>

                  <Button variant="outline" className="text-xs font-black h-9 px-3 border-[var(--border)]">
                    View Report <ChevronRight className="w-3.5 h-3.5 ml-1 text-primary" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  );
};
