/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarketTrendItem } from '../types/agents';

const MARKET_TRENDS: MarketTrendItem[] = [
  {
    id: 'mt_1',
    title: 'Generative AI & LLM Systems Engineering',
    category: 'AI / Machine Learning',
    growthPercentage: 42.5,
    demandLevel: 'extreme',
    avgSalaryRange: '$180k - $260k',
    topCompanies: ['Google DeepMind', 'OpenAI', 'Anthropic', 'Meta AI'],
    requiredSkills: ['Gemini 2.5 API', 'PyTorch', 'Vector Databases', 'RAG Evaluation'],
  },
  {
    id: 'mt_2',
    title: 'Full-Stack TypeScript & AI Agent Development',
    category: 'Software Engineering',
    growthPercentage: 31.8,
    demandLevel: 'very_high',
    avgSalaryRange: '$150k - $210k',
    topCompanies: ['Stripe', 'Vercel', 'Linear', 'Supabase'],
    requiredSkills: ['React 18', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    id: 'mt_3',
    title: 'Cloud Infrastructure & Kubernetes MLOps',
    category: 'DevOps / Infrastructure',
    growthPercentage: 24.2,
    demandLevel: 'high',
    avgSalaryRange: '$160k - $220k',
    topCompanies: ['AWS', 'Google Cloud', 'Datadog', 'Snowflake'],
    requiredSkills: ['Docker', 'Kubernetes', 'Terraform', 'Prometheus', 'CI/CD Pipelines'],
  },
  {
    id: 'mt_4',
    title: 'Cybersecurity & AI Threat Analysis',
    category: 'Security',
    growthPercentage: 28.4,
    demandLevel: 'very_high',
    avgSalaryRange: '$155k - $215k',
    topCompanies: ['CrowdStrike', 'Palo Alto Networks', 'Cloudflare'],
    requiredSkills: ['Zero Trust Architecture', 'OAuth 2.0', 'SIEM', 'Penetration Testing'],
  },
];

export class MarketIntelligenceService {
  static getMarketTrends(): MarketTrendItem[] {
    return MARKET_TRENDS;
  }
}
