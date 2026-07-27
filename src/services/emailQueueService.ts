/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmailQueueItem } from '../types/saas';

const EMAIL_QUEUE_KEY = 'pathpilot_email_queue';

const DEFAULT_EMAILS: EmailQueueItem[] = [
  {
    id: 'em-1',
    toEmail: 'alex.chen@acme.com',
    toName: 'Alex Chen',
    subject: 'Welcome to Acme Enterprise PathPilot Workspace',
    type: 'welcome',
    status: 'sent',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    sentAt: new Date(Date.now() - 1000 * 60 * 179).toISOString(),
  },
  {
    id: 'em-2',
    toEmail: 'sarah.j@acme.com',
    toName: 'Sarah Jenkins',
    subject: 'Reminder: AI Technical Interview Simulation at 2:00 PM',
    type: 'interview_reminder',
    status: 'sent',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    sentAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
  },
  {
    id: 'em-3',
    toEmail: 'alex.chen@acme.com',
    toName: 'Alex Chen',
    subject: 'Weekly Career Velocity Report - 94% Milestone Reached',
    type: 'weekly_digest',
    status: 'queued',
    createdAt: new Date().toISOString(),
  },
];

export class EmailQueueService {
  public static getEmailQueue(): EmailQueueItem[] {
    try {
      const stored = localStorage.getItem(EMAIL_QUEUE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error fetching email queue', e);
    }
    localStorage.setItem(EMAIL_QUEUE_KEY, JSON.stringify(DEFAULT_EMAILS));
    return DEFAULT_EMAILS;
  }

  public static enqueueEmail(
    toEmail: string,
    subject: string,
    type: EmailQueueItem['type'],
    toName?: string
  ): EmailQueueItem {
    const queue = this.getEmailQueue();
    const newItem: EmailQueueItem = {
      id: `em-${Date.now().toString(36)}`,
      toEmail,
      toName,
      subject,
      type,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };

    queue.unshift(newItem);
    localStorage.setItem(EMAIL_QUEUE_KEY, JSON.stringify(queue.slice(0, 100)));

    // Simulate sending queue worker
    setTimeout(() => {
      this.processQueue();
    }, 2000);

    return newItem;
  }

  public static processQueue(): void {
    const queue = this.getEmailQueue();
    let updated = false;
    queue.forEach((item) => {
      if (item.status === 'queued') {
        item.status = 'sent';
        item.sentAt = new Date().toISOString();
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem(EMAIL_QUEUE_KEY, JSON.stringify(queue));
    }
  }
}
