/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'super_admin'
  | 'platform_admin'
  | 'org_owner'
  | 'org_admin'
  | 'career_coach'
  | 'mentor'
  | 'recruiter'
  | 'university_staff'
  | 'student'
  | 'premium_user'
  | 'free_user'
  | 'guest';

export type SubscriptionPlanTier = 'free' | 'starter' | 'pro' | 'premium' | 'enterprise';

export interface QuotaLimits {
  aiGenerationsMonthly: number;
  resumeReviewsMonthly: number;
  interviewSimulationsMonthly: number;
  storageMb: number;
  teamSeats: number;
  apiRequestsDaily: number;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanTier;
  name: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  description: string;
  badge?: string;
  features: string[];
  limits: QuotaLimits;
}

export interface SubscriptionDetails {
  orgId: string;
  planTier: SubscriptionPlanTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  billingEmail: string;
  paymentMethodMask?: string;
  usage: {
    aiGenerationsUsed: number;
    resumeReviewsUsed: number;
    interviewSimulationsUsed: number;
    storageMbUsed: number;
    apiRequestsToday: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  planTier: SubscriptionPlanTier;
  seatsTotal: number;
  seatsUsed: number;
  ownerUid: string;
  createdAt: string;
  ssoEnabled: boolean;
  ssoProvider?: string;
  customDomain?: string;
  industry?: string;
  verified: boolean;
}

export interface OrganizationMember {
  id: string;
  orgId: string;
  uid: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  department?: string;
  joinedAt: string;
  status: 'active' | 'invited' | 'suspended';
}

export interface ApiKey {
  id: string;
  orgId: string;
  uid: string;
  name: string;
  keyPrefix: string;
  keySecret: string; // obfuscated after creation
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked';
}

export interface WebhookSubscription {
  id: string;
  orgId: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  status: 'active' | 'paused' | 'failed';
  createdAt: string;
  lastDeliveryAt?: string;
  failureCount: number;
}

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  event: string;
  statusCode: number;
  payload: Record<string, any>;
  responseBody?: string;
  timestamp: string;
  durationMs: number;
  success: boolean;
}

export type IntegrationProvider =
  | 'google_calendar'
  | 'google_drive'
  | 'github'
  | 'linkedin'
  | 'slack'
  | 'microsoft_teams'
  | 'zoom'
  | 'openrouter';

export interface IntegrationConfig {
  id: string;
  orgId: string;
  provider: IntegrationProvider;
  name: string;
  category: 'calendar' | 'storage' | 'code' | 'social' | 'communication' | 'ai';
  connected: boolean;
  connectedAt?: string;
  connectedBy?: string;
  accountEmail?: string;
  status: 'active' | 'error' | 'disconnected';
  config?: Record<string, any>;
}

export interface BackgroundJob {
  id: string;
  name: string;
  type: 'resume_indexing' | 'ai_batch_analysis' | 'analytics_aggregation' | 'email_digest' | 'backup_cleanup';
  status: 'queued' | 'running' | 'completed' | 'failed';
  progressPercent: number;
  payload?: Record<string, any>;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface EmailQueueItem {
  id: string;
  toEmail: string;
  toName?: string;
  subject: string;
  type: 'welcome' | 'interview_reminder' | 'application_status' | 'weekly_digest' | 'organization_invite';
  status: 'queued' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'security';
  category: 'auth' | 'api' | 'billing' | 'admin' | 'ai' | 'webhook';
  action: string;
  userEmail?: string;
  orgId?: string;
  ipAddress?: string;
  details: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetRoles: UserRole[];
}

export interface PlatformStats {
  totalUsers: number;
  activeOrganizations: number;
  mrrDollars: number;
  dailyApiRequests: number;
  aiTokensUsedToday: number;
  activeSubscriptions: number;
  systemHealthPercent: number;
  uptimePercent: number;
}
