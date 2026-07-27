/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Plus, Briefcase, TrendingUp, ShieldCheck } from 'lucide-react';
import { JobTracker } from './execution/JobTracker';
import { Badge } from '../ui/Badge';
import { useCareer } from '../../contexts/CareerContext';

export const ApplicationsView: React.FC = () => {
  const {
    jobApplications,
    addJobApplication,
    updateJobApplication,
    deleteJobApplication,
  } = useCareer();

  const activeApps = jobApplications.filter(a => a.status !== 'rejected' && a.status !== 'offer');
  const offers = jobApplications.filter(a => a.status === 'offer');

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in select-none">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--surface)] border border-[var(--border)] p-6 rounded-card shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-text-mute">
            <span>Career Operating System</span>
            <span>/</span>
            <span className="text-primary font-black">Applications & Job Pipelines</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-text-main tracking-tight mt-1 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" /> Job Applications Pipeline
          </h1>
          <p className="text-xs text-text-sub max-w-2xl leading-relaxed font-semibold mt-1">
            Track active job applications, interview stages, offer packages, deadlines, and technical notes in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="primary" className="text-xs font-black py-1 px-3">
            {activeApps.length} Active Pipelines
          </Badge>
          {offers.length > 0 && (
            <Badge variant="success" className="text-xs font-black py-1 px-3">
              🎉 {offers.length} Offer Secured
            </Badge>
          )}
        </div>
      </div>

      {/* Main Job Tracker Component */}
      <div className="w-full">
        <JobTracker
          applications={jobApplications}
          onAddApplication={addJobApplication}
          onUpdateApplication={updateJobApplication}
          onDeleteApplication={deleteJobApplication}
        />
      </div>
    </div>
  );
};

export default ApplicationsView;
