/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { CertificationPlan } from '../../../types';
import {
  Award,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface CertificationPlannerViewProps {
  certifications: CertificationPlan[];
  onSaveCertifications: (certs: CertificationPlan[]) => void;
}

export function CertificationPlannerView({ certifications, onSaveCertifications }: CertificationPlannerViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = certifications.filter(c => filterStatus === 'all' || c.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-surface-raised rounded-2xl border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
            <Award className="w-3.5 h-3.5 mr-1" /> Industry Certifications
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Certification Planner</h2>
          <p className="text-sm text-muted-foreground">Track completed, in progress, planned, expired, and upcoming professional certifications.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'in_progress', 'planned', 'completed', 'expired', 'upcoming'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
              filterStatus === st ? "bg-primary text-primary-foreground shadow-xs" : "bg-surface-raised text-muted-foreground hover:text-foreground"
            )}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cert) => (
          <Card key={cert.id} className="border border-border/60 bg-surface-raised shadow-sm hover:border-primary/40 transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-bold">{cert.title}</CardTitle>
                  <CardDescription className="text-xs">{cert.issuer}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] capitalize",
                    cert.status === 'completed' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                    cert.status === 'in_progress' ? "bg-primary/10 text-primary border-primary/20" :
                    cert.status === 'expired' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                    "bg-muted text-muted-foreground"
                  )}
                >
                  {cert.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              {cert.skillsValidated && (
                <div className="flex flex-wrap gap-1">
                  {cert.skillsValidated.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                <span>Exam Target: {cert.targetDate || 'TBD'}</span>
                {cert.examUrl && (
                  <a href={cert.examUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold flex items-center gap-1">
                    Exam Link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
