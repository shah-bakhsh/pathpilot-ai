/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubscriptionPlan, SubscriptionDetails, SubscriptionPlanTier } from '../types/saas';

export const PLANS_CATALOG: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Explorer',
    priceMonthly: 0,
    priceAnnualMonthly: 0,
    description: 'Essential career toolkit for job seekers starting out.',
    features: [
      '1 Workspace & Profile',
      '5 AI Resume Generations / mo',
      '2 AI Mock Interview Simulations / mo',
      'Basic Career Roadmap',
      'Community Support',
    ],
    limits: {
      aiGenerationsMonthly: 20,
      resumeReviewsMonthly: 5,
      interviewSimulationsMonthly: 2,
      storageMb: 100,
      teamSeats: 1,
      apiRequestsDaily: 50,
    },
  },
  {
    id: 'starter',
    name: 'Starter Pro',
    priceMonthly: 19,
    priceAnnualMonthly: 15,
    description: 'Perfect for proactive career changers and active applicants.',
    badge: 'Popular for Individuals',
    features: [
      'Everything in Free',
      '100 AI Resume & Cover Letter Generations / mo',
      '15 AI Mock Interview Simulations / mo',
      'Full Learning Paths & Certifications',
      'Export Resume to PDF / Docx',
      'Priority Email Support',
    ],
    limits: {
      aiGenerationsMonthly: 100,
      resumeReviewsMonthly: 25,
      interviewSimulationsMonthly: 15,
      storageMb: 1024,
      teamSeats: 3,
      apiRequestsDaily: 1000,
    },
  },
  {
    id: 'pro',
    name: 'Career Acceleration Pro',
    priceMonthly: 49,
    priceAnnualMonthly: 39,
    description: 'Unlimited AI power with real-time coach & interview simulator.',
    badge: 'Best Value',
    features: [
      'Everything in Starter',
      'Unlimited AI Resume Tailoring',
      'Unlimited AI Interview Practice',
      'Live Voice & Audio Interview Studio',
      'Custom Domain Support',
      'Developer API Keys (5,000 req/day)',
      'Webhooks Integration',
    ],
    limits: {
      aiGenerationsMonthly: 1000,
      resumeReviewsMonthly: 100,
      interviewSimulationsMonthly: 100,
      storageMb: 10240,
      teamSeats: 10,
      apiRequestsDaily: 5000,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    priceMonthly: 299,
    priceAnnualMonthly: 249,
    description: 'Dedicated multi-tenancy platform for Universities & Talent Labs.',
    badge: 'Enterprise Grade',
    features: [
      'Unlimited Team Seats & Workspaces',
      'Okta & SAML Single Sign-On (SSO)',
      'Custom LLM Fine-Tuning & OpenRouter',
      'Dedicated Customer Success Manager',
      'Custom Webhooks & Unlimited Public API',
      'SLA 99.9% Guarantee & Audit Logs',
    ],
    limits: {
      aiGenerationsMonthly: 100000,
      resumeReviewsMonthly: 10000,
      interviewSimulationsMonthly: 10000,
      storageMb: 512000,
      teamSeats: 500,
      apiRequestsDaily: 100000,
    },
  },
];

const SUB_STORAGE_PREFIX = 'pathpilot_sub_details_';

export class SubscriptionService {
  public static getSubscriptionForOrg(orgId: string, planTier: SubscriptionPlanTier = 'pro'): SubscriptionDetails {
    try {
      const stored = localStorage.getItem(`${SUB_STORAGE_PREFIX}${orgId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error fetching subscription', e);
    }

    const plan = PLANS_CATALOG.find((p) => p.id === planTier) || PLANS_CATALOG[2];
    const details: SubscriptionDetails = {
      orgId,
      planTier: plan.id,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      billingEmail: 'billing@acme.com',
      paymentMethodMask: '•••• •••• •••• 4242 (Visa)',
      usage: {
        aiGenerationsUsed: 142,
        resumeReviewsUsed: 18,
        interviewSimulationsUsed: 12,
        storageMbUsed: 240,
        apiRequestsToday: 850,
      },
    };

    localStorage.setItem(`${SUB_STORAGE_PREFIX}${orgId}`, JSON.stringify(details));
    return details;
  }

  public static updatePlan(orgId: string, newTier: SubscriptionPlanTier): SubscriptionDetails {
    const sub = this.getSubscriptionForOrg(orgId);
    sub.planTier = newTier;
    sub.status = 'active';
    localStorage.setItem(`${SUB_STORAGE_PREFIX}${orgId}`, JSON.stringify(sub));
    return sub;
  }

  public static checkQuota(
    orgId: string,
    metric: keyof SubscriptionDetails['usage']
  ): { allowed: boolean; used: number; limit: number } {
    const sub = this.getSubscriptionForOrg(orgId);
    const plan = PLANS_CATALOG.find((p) => p.id === sub.planTier) || PLANS_CATALOG[0];

    const map: Record<keyof SubscriptionDetails['usage'], number> = {
      aiGenerationsUsed: plan.limits.aiGenerationsMonthly,
      resumeReviewsUsed: plan.limits.resumeReviewsMonthly,
      interviewSimulationsUsed: plan.limits.interviewSimulationsMonthly,
      storageMbUsed: plan.limits.storageMb,
      apiRequestsToday: plan.limits.apiRequestsDaily,
    };

    const limit = map[metric] || 100;
    const used = sub.usage[metric] || 0;
    return {
      allowed: used < limit,
      used,
      limit,
    };
  }

  public static recordUsage(orgId: string, metric: keyof SubscriptionDetails['usage'], amount = 1): void {
    const sub = this.getSubscriptionForOrg(orgId);
    sub.usage[metric] = (sub.usage[metric] || 0) + amount;
    localStorage.setItem(`${SUB_STORAGE_PREFIX}${orgId}`, JSON.stringify(sub));
  }
}
