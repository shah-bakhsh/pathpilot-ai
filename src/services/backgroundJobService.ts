/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BackgroundJob } from '../types/saas';

const JOBS_STORAGE_KEY = 'pathpilot_background_jobs';

const INITIAL_JOBS: BackgroundJob[] = [
  {
    id: 'job-101',
    name: 'AI Resume Vector Indexing',
    type: 'resume_indexing',
    status: 'completed',
    progressPercent: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 118).toISOString(),
  },
  {
    id: 'job-102',
    name: 'Weekly Career Performance Digest',
    type: 'email_digest',
    status: 'completed',
    progressPercent: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 59).toISOString(),
  },
  {
    id: 'job-103',
    name: 'Batch ATS Keyword Optimization Engine',
    type: 'ai_batch_analysis',
    status: 'running',
    progressPercent: 68,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    startedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: 'job-104',
    name: 'Nightly Analytics Aggregation Queue',
    type: 'analytics_aggregation',
    status: 'queued',
    progressPercent: 0,
    createdAt: new Date().toISOString(),
  },
];

export class BackgroundJobService {
  public static getAllJobs(): BackgroundJob[] {
    try {
      const stored = localStorage.getItem(JOBS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error fetching background jobs', e);
    }
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
    return INITIAL_JOBS;
  }

  public static createJob(
    name: string,
    type: BackgroundJob['type'],
    payload?: Record<string, any>
  ): BackgroundJob {
    const jobs = this.getAllJobs();
    const newJob: BackgroundJob = {
      id: `job-${Date.now().toString(36)}`,
      name,
      type,
      status: 'queued',
      progressPercent: 0,
      payload,
      createdAt: new Date().toISOString(),
    };

    jobs.unshift(newJob);
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs.slice(0, 50)));

    // Simulate auto worker progression
    setTimeout(() => {
      this.updateJobStatus(newJob.id, 'running', 45);
    }, 1500);

    setTimeout(() => {
      this.updateJobStatus(newJob.id, 'completed', 100);
    }, 4500);

    return newJob;
  }

  public static updateJobStatus(
    id: string,
    status: BackgroundJob['status'],
    progressPercent: number
  ): void {
    const jobs = this.getAllJobs();
    const job = jobs.find((j) => j.id === id);
    if (!job) return;

    job.status = status;
    job.progressPercent = progressPercent;
    if (status === 'running' && !job.startedAt) job.startedAt = new Date().toISOString();
    if (status === 'completed' || status === 'failed') job.completedAt = new Date().toISOString();

    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  }
}
