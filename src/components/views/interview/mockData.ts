/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, Achievement, InterviewSession, CompanyName, DifficultyLevel, InterviewType, QuestionCategory } from './InterviewTypes';

export const COMPANIES: Array<{ name: CompanyName; logo: string; desc: string }> = [
  { name: 'Google', logo: '🔍', desc: 'Globally replicated dual-regional infrastructures & advanced algorithmic reasoning.' },
  { name: 'Microsoft', logo: '💻', desc: 'Enterprise cloud services, OS security & commercial AI solutions.' },
  { name: 'Amazon', logo: '📦', desc: 'Ultra-scale retail operations, customer obsession & AWS cloud distribution.' },
  { name: 'Meta', logo: '♾️', desc: 'High-throughput social grids, instant-messaging synchronization & open-source ML.' },
  { name: 'Apple', logo: '🍎', desc: 'Premium hardware-software coordination, privacy frameworks & clean user interactions.' },
  { name: 'Netflix', logo: '🍿', desc: 'Chaos-monkey testing pipelines, stream transcoders & high-availability microservices.' },
  { name: 'Tesla', logo: '⚡', desc: 'Autopilot inference systems, real-time sensory grids & energy distribution networks.' },
  { name: 'OpenAI', logo: '🧠', desc: 'Generative transformer model training, safety guardrails & high-density inference.' },
  { name: 'Anthropic', logo: '🌾', desc: 'Constitutional AI, steering-mechanism verification & model transparency.' },
  { name: 'NVIDIA', logo: '💚', desc: 'GPU accelerator design, parallel memory bandwidths & hardware orchestration.' },
  { name: 'Startups', logo: '🚀', desc: 'High-velocity feature building, product market search & lightweight stack configurations.' },
  { name: 'Custom Company', logo: '🏢', desc: 'Define your custom company coordinates and evaluation constraints.' },
];

export const DIFFICULTY_LEVELS: Array<{ level: DifficultyLevel; desc: string; color: string }> = [
  { level: 'Beginner', desc: 'Basic fundamentals, standard syntaxes & straightforward definitions.', color: 'text-emerald-400 bg-emerald-500/10' },
  { level: 'Intermediate', desc: 'Standard database optimization, standard structural patterns & trade-offs.', color: 'text-primary bg-primary/10' },
  { level: 'Advanced', desc: 'High-availability trade-offs, system constraints & security coordinates.', color: 'text-indigo-400 bg-indigo-500/10' },
  { level: 'Expert', desc: 'Cost architectures, squad orchestration & multi-decade scaling grids.', color: 'text-rose-400 bg-rose-500/10' },
];

export const INTERVIEW_TYPES: Array<{ type: InterviewType; category: string; desc: string }> = [
  { type: 'Technical Interview', category: 'General', desc: 'Algorithmic reasoning, system trade-offs & database configurations.' },
  { type: 'Behavioral Interview', category: 'General', desc: 'Evaluating core soft skills, teamwork & leadership capabilities via STAR.' },
  { type: 'System Design', category: 'System', desc: 'Designing massive globally distributed services with high availability.' },
  { type: 'Coding Interview', category: 'System', desc: 'Solving standard optimization and data-structure problems under constraints.' },
  { type: 'HR Interview', category: 'General', desc: 'Culture fit alignment, career trajectories, compensation & work-life parameters.' },
  { type: 'AI Interview', category: 'Domain', desc: 'State trees, prompt structures, model architectures & streaming runtimes.' },
  { type: 'Frontend', category: 'Domain', desc: 'State hydration, rendering optimization, styling grids & responsive DOM operations.' },
  { type: 'Backend', category: 'Domain', desc: 'Rest/gRPC APIs, transactional integrity, database design & indexing.' },
  { type: 'Machine Learning', category: 'Domain', desc: 'Feature scaling, transformer dimensions, inference speeds & training pipelines.' },
  { type: 'Data Science', category: 'Domain', desc: 'Statistical validation, predictive analytics, ETL pipeline aggregates.' },
  { type: 'Cybersecurity', category: 'Domain', desc: 'Penetration audit coordinates, cryptographic algorithms & authentication policies.' },
  { type: 'Product Management', category: 'Business', desc: 'User experience flows, prioritizations, product analytics & market validation.' },
  { type: 'UI/UX', category: 'Business', desc: 'Typography hierarchy, visual rhythms, human interfaces & negative spaces.' },
  { type: 'Research', category: 'Academic', desc: 'Symmetric validation pipelines, academic rigor, citation indices & paper review.' },
  { type: 'Internship', category: 'Academic', desc: 'Growth readiness indicators, basic learning curves & collaborative potential.' },
  { type: 'Scholarship', category: 'Academic', desc: 'Academic excellence, scientific breakthroughs & civic engagements.' },
  { type: 'University Admission', category: 'Academic', desc: 'Personal statements, core values, passion maps & academic histories.' },
  { type: 'Custom Interview', category: 'General', desc: 'Design your own custom interview context & focus coordinates.' },
];

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  'Self Introduction',
  'Behavioral',
  'Leadership',
  'Communication',
  'Problem Solving',
  'Projects',
  'Resume',
  'Portfolio',
  'Coding',
  'Algorithms',
  'System Design',
  'AI',
  'Machine Learning',
  'Cloud',
  'Databases',
  'Career Goals',
  'Custom Questions'
];

export const QUESTION_BANK: Question[] = [
  {
    id: 'q1',
    text: 'How would you design a rate limiter for APIs that receives millions of request triggers per minute, and how do you handle scale distribution?',
    category: 'System Design',
    difficulty: 'Advanced',
    companies: ['Google', 'Meta', 'Netflix', 'Amazon'],
    points: 15
  },
  {
    id: 'q2',
    text: 'Explain the internal differences between clustered and non-clustered indexing inside relational databases like PostgreSQL. How do they affect read/write tradeoffs?',
    category: 'Databases',
    difficulty: 'Intermediate',
    companies: ['Microsoft', 'Apple', 'NVIDIA'],
    points: 10
  },
  {
    id: 'q3',
    text: 'Tell me about a time you had to resolve a severe technical disagreement within your engineering squad regarding database choice or system architecture. What was your resolution?',
    category: 'Behavioral',
    difficulty: 'Intermediate',
    companies: ['Google', 'Meta', 'Amazon', 'Startups'],
    points: 10
  },
  {
    id: 'q4',
    text: 'How does React Server Components (RSC) optimize client hydration payloads compared to traditional SSR, and what are the visual effects on CLS?',
    category: 'Portfolio',
    difficulty: 'Advanced',
    companies: ['Meta', 'Startups', 'Apple'],
    points: 15
  },
  {
    id: 'q5',
    text: 'Explain how transformers utilize multi-head self-attention mechanisms to map contextual weights across sequence inputs. What are the key parallelization differences compared to LSTM?',
    category: 'Machine Learning',
    difficulty: 'Expert',
    companies: ['OpenAI', 'Anthropic', 'Google', 'NVIDIA'],
    points: 20
  },
  {
    id: 'q6',
    text: 'How would you optimize a containerized web application that starts to experience severe out-of-memory (OOM) crashes under high connection spikes?',
    category: 'Cloud',
    difficulty: 'Intermediate',
    companies: ['Amazon', 'Netflix', 'Tesla'],
    points: 12
  },
  {
    id: 'q7',
    text: 'Can you introduce yourself and walk me through your most complex technical project? Focus on your engineering role, the architecture, and the quantitative impact.',
    category: 'Self Introduction',
    difficulty: 'Beginner',
    companies: ['Google', 'Microsoft', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Tesla', 'OpenAI', 'Anthropic', 'NVIDIA', 'Startups'],
    points: 8
  },
  {
    id: 'q8',
    text: 'How would you write an optimal algorithm to find the maximum sub-array sum in a contiguous sequence of numbers? What is its time complexity and can you achieve it in O(N)?',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    companies: ['Google', 'Microsoft', 'Meta', 'Apple'],
    points: 12
  },
  {
    id: 'q9',
    text: 'How do you handle secrets management and security authentication inside high-velocity CI/CD pipelines deploying to public clouds like GCP or AWS?',
    category: 'Cloud',
    difficulty: 'Advanced',
    companies: ['Amazon', 'Google', 'Microsoft', 'Netflix'],
    points: 15
  },
  {
    id: 'q10',
    text: 'Describe your strategy for shipping a major software release under an extremely tight deadline where critical team members fell sick. How did you balance scope vs quality?',
    category: 'Leadership',
    difficulty: 'Advanced',
    companies: ['Startups', 'Amazon', 'Meta'],
    points: 12
  },
  {
    id: 'q11',
    text: 'What are the main architectural constraints when designing real-time multiplayer collaborative canvas sync networks? Mention trade-offs of Operational Transformation vs CRDT.',
    category: 'System Design',
    difficulty: 'Expert',
    companies: ['Google', 'Microsoft', 'Meta', 'Startups'],
    points: 20
  },
  {
    id: 'q12',
    text: 'Where do you see yourself in five years, and how does securing a role at our company align with your professional development milestones and goals?',
    category: 'Career Goals',
    difficulty: 'Beginner',
    companies: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta'],
    points: 8
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach1',
    title: 'First Contact',
    desc: 'Successfully complete your first AI-simulated practice interview session.',
    icon: '🎯',
    xpReward: 50,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ach2',
    title: 'Precision Architect',
    desc: 'Secure a Technical Score rating of 90% or higher in a System Design session.',
    icon: '📐',
    xpReward: 100,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ach3',
    title: 'Triple Threat',
    desc: 'Practice 3 distinct interview domains (e.g. Behavioral, Technical, Frontend).',
    icon: '⚡',
    xpReward: 150,
    unlocked: false,
    progressMax: 3,
    progressCurrent: 2
  },
  {
    id: 'ach4',
    title: 'Perfect Dialogue',
    desc: 'Earn an Overall Score rating of 95% or higher under Expert difficulty.',
    icon: '🏆',
    xpReward: 250,
    unlocked: false,
    progressMax: 1,
    progressCurrent: 0
  },
  {
    id: 'ach5',
    title: 'Streak Master',
    desc: 'Maintain a 5-day continuous interview practice streak.',
    icon: '🔥',
    xpReward: 200,
    unlocked: false,
    progressMax: 5,
    progressCurrent: 3
  },
];

export const INITIAL_HISTORICAL_SESSIONS: InterviewSession[] = [
  {
    id: 'sess1',
    type: 'System Design',
    company: 'Netflix',
    difficulty: 'Advanced',
    category: 'System Design',
    durationSeconds: 1240,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    overallScore: 84,
    communicationScore: 88,
    technicalScore: 82,
    behavioralScore: 80,
    confidenceScore: 85,
    leadershipScore: 80,
    problemSolvingScore: 86,
    professionalismScore: 90,
    dialogue: [
      {
        role: 'interviewer',
        text: 'How would you design a rate limiter for APIs that receives millions of request triggers per minute, and how do you handle scale distribution?',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 20 * 60 * 1000).toISOString()
      },
      {
        role: 'candidate',
        text: 'To handle millions of requests, I would deploy a Redis cluster mapping to a sliding-window counter algorithm. By keeping memory operations in Redis keys, we secure sub-millisecond latencies. Furthermore, I would use an API Gateway like Envoy with cluster-wide rate limiting rules, utilizing token bucket algorithms for micro-throttling.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 18 * 60 * 1000).toISOString(),
        feedback: {
          confidence: 86,
          communication: 88,
          grammar: 92,
          clarity: 90,
          vocabulary: 85,
          professionalism: 90,
          structure: 85,
          technicalAccuracy: 84,
          behavioralQuality: 80,
          explanation: 'Excellent, well-structured layout. You correctly highlighted sliding-window counter algorithms and Redis caching clusters.'
        }
      }
    ],
    strengths: [
      'Strong explanation of sliding-window counter logic.',
      'Highly professional presentation style and structuring.',
      'Excellent selection of Redis cache for low latency data synchronization.'
    ],
    weaknesses: [
      'Missing deeper discussion on how dual regions sync Redis counter limits.',
      'Could elaborate on cold-start behavior if Redis nodes crash.'
    ],
    remedy: 'Deepen database replication failover rules. Write connection pooling backup configurations.',
    practicePlan: [
      'Read Redis Multi-Region Active-Active synchronization papers.',
      'Practice 1 round of algorithmic problem solving.'
    ],
    resources: [
      { title: 'Redis University: Multi-Region Replication', url: 'https://redis.io/', type: 'course' },
      { title: 'Designing Data-Intensive Applications, Chapter 5', url: 'https://www.oreilly.com/', type: 'article' }
    ],
    notes: 'Remember to emphasize sliding windows over leaky bucket for spike defense.',
    xpEarned: 75
  },
  {
    id: 'sess2',
    type: 'Technical Interview',
    company: 'Google',
    difficulty: 'Advanced',
    category: 'Databases',
    durationSeconds: 980,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    overallScore: 92,
    communicationScore: 94,
    technicalScore: 90,
    behavioralScore: 85,
    confidenceScore: 95,
    leadershipScore: 88,
    problemSolvingScore: 92,
    professionalismScore: 94,
    dialogue: [
      {
        role: 'interviewer',
        text: 'Explain the internal differences between clustered and non-clustered indexing inside relational databases like PostgreSQL. How do they affect read/write tradeoffs?',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 15 * 60 * 1000).toISOString()
      },
      {
        role: 'candidate',
        text: 'A clustered index determines the physical order of data rows inside the disk tables, so there can only be one clustered index per table. In PostgreSQL, although there is no explicit CLUSTERED index like MS SQL, the CLUSTER command achieves a similar physical alignment on B-Trees. Non-clustered indexes, on the other hand, maintain a separate B-Tree structure where leaf nodes are pointers to physical disk addresses (TIDs). Reads are fast on clustered indexes because they avoid pointer jumps, but writes take high overhead to keep rows ordered physically.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 12 * 60 * 1000).toISOString(),
        feedback: {
          confidence: 96,
          communication: 94,
          grammar: 96,
          clarity: 95,
          vocabulary: 92,
          professionalism: 95,
          structure: 90,
          technicalAccuracy: 92,
          behavioralQuality: 85,
          explanation: 'Remarkable understanding of PostgreSQL internal storage mechanisms. Explaining TIDs and physical sorting on disks highlights Staff-level competence.'
        }
      }
    ],
    strengths: [
      'Flawless explanation of physical row sorting differences.',
      'Correct identification of PostgreSQL TID pointer behaviors.',
      'Outstanding technical clarity and professional jargon.'
    ],
    weaknesses: [
      'Could expand on WRITE amplification overheads on highly transactional tables (HOT updates).'
    ],
    remedy: 'Study Postgres HOT (Heap Only Tuple) updates to understand writing optimizations on indexed tables.',
    practicePlan: [
      'Complete a Quick 5-Minute Practice session on Databases.',
      'Review Postgres Heap Storage Engine documentation.'
    ],
    resources: [
      { title: 'PostgreSQL Indexes Internals', url: 'https://www.postgresql.org/docs/', type: 'article' },
      { title: 'Database Internals: Indexing Chapter', url: 'https://www.oreilly.com/', type: 'course' }
    ],
    notes: 'Mentioned TIDs and PostgreSQL CLUSTER command. Interviewer was very impressed!',
    xpEarned: 100
  }
];

export const CHART_WEEKLY_PROGRESS = [
  { name: 'Week 1', score: 68, confidence: 70, communication: 72 },
  { name: 'Week 2', score: 74, confidence: 78, communication: 76 },
  { name: 'Week 3', score: 81, confidence: 82, communication: 84 },
  { name: 'Week 4', score: 88, confidence: 90, communication: 91 },
];

export const CHART_SKILL_IMPROVEMENT = [
  { subject: 'Technical', A: 90, fullMark: 100 },
  { subject: 'Communication', A: 85, fullMark: 100 },
  { subject: 'Structure', A: 88, fullMark: 100 },
  { subject: 'Vocabulary', A: 78, fullMark: 100 },
  { subject: 'Clarity', A: 92, fullMark: 100 },
  { subject: 'Confidence', A: 89, fullMark: 100 },
];

export const RECOMMENDED_PRACTICES = [
  { title: 'Google Behavioral (STAR)', type: 'Behavioral Interview', company: 'Google', difficulty: 'Advanced', time: '15 Mins' },
  { title: 'OpenAI ML Steerability', type: 'Machine Learning', company: 'OpenAI', difficulty: 'Expert', time: '20 Mins' },
  { title: 'Stripe API Design Round', type: 'System Design', company: 'Startups', difficulty: 'Advanced', time: '25 Mins' },
];

export const MOCK_CODING_PROBLEMS = [
  {
    id: 'cp1',
    title: 'Two Sum - Subarray Target Matching',
    difficulty: 'Intermediate' as DifficultyLevel,
    category: 'Algorithms',
    companies: ['Google' as CompanyName, 'Amazon' as CompanyName, 'Meta' as CompanyName],
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    starterCode: {
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`
    },
    testCases: [
      { id: 'tc1', input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]', explanation: 'nums[0] + nums[1] == 9, so return [0, 1].' },
      { id: 'tc2', input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]', explanation: '3 + 3 is not allowed, nums[1] + nums[2] = 6.' }
    ],
    hints: ['Use a Hash Map to store complement values for O(N) lookup.'],
    solution: 'Use a hash table to check if target - nums[i] exists in O(1) time.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)'
  },
  {
    id: 'cp2',
    title: 'LRU Cache Design',
    difficulty: 'Advanced' as DifficultyLevel,
    category: 'System Design',
    companies: ['Apple' as CompanyName, 'Netflix' as CompanyName, 'Google' as CompanyName],
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement LRUCache with `get(key)` and `put(key, value)` in O(1) time complexity.',
    starterCode: {
      typescript: `class LRUCache {\n  private capacity: number;\n  private cache: Map<number, number>;\n\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  get(key: number): number {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key)!;\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n\n  put(key: number, value: number): void {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const oldestKey = this.cache.keys().next().value;\n      this.cache.delete(oldestKey);\n    }\n    this.cache.set(key, value);\n  }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = {}`
    },
    testCases: [
      { id: 'tc1', input: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2)', expectedOutput: '-1 (evicted)', explanation: 'Key 2 was evicted because 1 was recently retrieved.' }
    ],
    hints: ['Combine a Doubly Linked List with a Hash Map for O(1) insertion, deletion, and retrieval.'],
    solution: 'Doubly Linked List + Map.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(Capacity)'
  }
];

export const MOCK_SYSTEM_DESIGN_DIAGRAMS = [
  {
    id: 'sd1',
    title: 'Globally Distributed Rate Limiter',
    description: 'Architecture diagram for multi-region API rate limiting with Redis cluster synchronization.',
    nodes: [
      { id: 'n1', type: 'client' as const, label: 'Client App', x: 50, y: 150 },
      { id: 'n2', type: 'load_balancer' as const, label: 'NGINX LB', x: 200, y: 150 },
      { id: 'n3', type: 'api_gateway' as const, label: 'API Gateway', x: 380, y: 150 },
      { id: 'n4', type: 'cache' as const, label: 'Redis Cluster', x: 560, y: 80 },
      { id: 'n5', type: 'service' as const, label: 'Auth Service', x: 560, y: 220 },
      { id: 'n6', type: 'database' as const, label: 'PostgreSQL DB', x: 740, y: 220 }
    ],
    connections: [
      { id: 'c1', from: 'n1', to: 'n2', label: 'HTTPS / TLS 1.3' },
      { id: 'c2', from: 'n2', to: 'n3', label: 'Internal gRPC' },
      { id: 'c3', from: 'n3', to: 'n4', label: 'Sliding Window Check' },
      { id: 'c4', from: 'n3', to: 'n5', label: 'Token Verification' },
      { id: 'c5', from: 'n5', to: 'n6', label: 'Read Replicas' }
    ],
    requirements: [
      'Throughput >= 500k requests/sec',
      'Latency overhead < 2ms',
      'Fault tolerance across dual cloud zones'
    ]
  }
];

export const MOCK_MISSING_CONCEPTS = [
  {
    id: 'mc1',
    concept: 'Circuit Breaker Pattern',
    category: 'System Design' as QuestionCategory,
    importance: 'Critical' as const,
    recommendedResource: { title: 'Designing Resilience: Circuit Breaker Pattern in Microservices', url: 'https://martinfowler.com/bliki/CircuitBreaker.html', type: 'article' as const }
  },
  {
    id: 'mc2',
    concept: 'STAR Methodology Quantification',
    category: 'Behavioral' as QuestionCategory,
    importance: 'High' as const,
    recommendedResource: { title: 'Mastering the STAR Method for Senior Engineering Roles', url: 'https://hbr.org', type: 'article' as const }
  },
  {
    id: 'mc3',
    concept: 'B-Tree vs LSM-Tree Storage Engines',
    category: 'Databases' as QuestionCategory,
    importance: 'Medium' as const,
    recommendedResource: { title: 'Database Storage Engines Deep Dive', url: 'https://oreilly.com', type: 'course' as const }
  }
];

