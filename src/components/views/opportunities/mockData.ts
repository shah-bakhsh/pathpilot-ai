/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnrichedOpportunity } from './types';

export const MOCK_ENRICHED_OPPORTUNITIES: EnrichedOpportunity[] = [
  {
    id: 'opp-job-1',
    title: 'Senior Full Stack Engineer - AI Systems',
    organization: 'Google Cloud Platform',
    orgLogo: 'bg-blue-600 text-white',
    orgRating: 4.6,
    type: 'job',
    location: 'Sunnyvale, CA',
    locationType: 'hybrid',
    country: 'United States',
    city: 'Sunnyvale',
    deadline: '2026-08-15',
    duration: 'Permanent',
    salaryOrFunding: '$160,000 - $210,000',
    isPaid: true,
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'Google Cloud Run', 'Firestore', 'Docker'],
    educationLevel: "Bachelor's or Master's in CS",
    experienceLevel: 'Senior',
    industry: 'Cloud Computing',
    officialWebsite: 'https://cloud.google.com',
    description: 'Design, implement, and scale the next generation of generative AI application dashboards and API gateways on GCP.',
    overview: 'As a Senior Full Stack Engineer in GCP, you will lead the architecture of high-throughput generative AI pipeline portals. You will balance rapid prototyping of UI layouts in React with secure, transactional microservice construction in Node.js and Docker.',
    responsibilities: [
      'Architect and deploy serverless full-stack portals on Google Cloud Run.',
      'Optimize WebSockets and state synchronization for collaborative canvases.',
      'Integrate, proxy, and secure internal LLM APIs keeping keys isolated server-side.',
      'Mentor junior engineers and champion clean code standards in TypeScript.'
    ],
    requirements: [
      '5+ years of software development experience using React, Node.js, and TypeScript.',
      'Strong knowledge of containerization with Docker and container hosting on GCP or AWS.',
      'Experience with NoSQL document stores (such as Firestore or MongoDB) and database replication.',
      'Excellent system architecture, API gateway design, and rate-limiting implementation skills.'
    ],
    benefits: [
      'Top-tier base salary with Google Equity (GSUs).',
      'Comprehensive medical, dental, and vision health coverage.',
      'Onsite gourmet meals, fully stocked micro-kitchens, and wellness centers.',
      'Flexible work-from-home schedule (3 days hybrid, 2 days remote).'
    ],
    applicationProcess: [
      'Step 1: Resume screening & ATS evaluation.',
      'Step 2: Technical phone screen focused on JavaScript/TypeScript deep details and UI design.',
      'Step 3: Onsite loop (Coding, Full-Stack Architecture, and Googliness/Leadership rounds).',
      'Step 4: Offer letter and onboarding preparation.'
    ],
    timeline: [
      { event: 'Applications Close', date: '2026-08-15' },
      { event: 'Initial Screener', date: '2026-08-20' },
      { event: 'Technical Rounds', date: '2026-08-28' },
      { event: 'Final Decisions', date: '2026-09-05' }
    ],
    eligibility: [
      'Open to candidates authorized to work in the US.',
      'Requires a strong portfolio demonstrating full-stack deployments.'
    ],
    selectionProcess: [
      'Candidates are selected based on code clarity, system optimization performance, and architectural design scalability.'
    ],
    resources: [
      { name: 'GCP Cloud Run Architecture Guide', url: 'https://cloud.google.com/run/docs' },
      { name: 'Google Engineering Practices', url: 'https://github.com/google/eng-practices' }
    ],
    faqs: [
      { question: 'What is the hybrid schedule structure?', answer: 'We spend Tuesdays, Wednesdays, and Thursdays in our Sunnyvale campus, and work remotely on Mondays and Fridays.' },
      { question: 'Will Google sponsor visa transfers?', answer: 'Yes, visa transfers are supported for qualified candidates currently residing in the US.' }
    ]
  },
  {
    id: 'opp-job-2',
    title: 'Staff Backend Engineer - Scaled Payments',
    organization: 'Stripe',
    orgLogo: 'bg-indigo-600 text-white',
    orgRating: 4.7,
    type: 'job',
    location: 'San Francisco, CA',
    locationType: 'remote',
    country: 'United States',
    city: 'San Francisco',
    deadline: '2026-07-30',
    duration: 'Permanent',
    salaryOrFunding: '$190,000 - $250,000',
    isPaid: true,
    requiredSkills: ['Node.js', 'Express', 'SQL', 'PostgreSQL', 'Redis', 'OAuth2', 'CI/CD Pipelines'],
    educationLevel: 'Any',
    experienceLevel: 'Lead',
    industry: 'Fintech',
    officialWebsite: 'https://stripe.com',
    description: 'Formulate core transactional architectures, API security models, and payment processing pipelines handling billions of dollars.',
    overview: 'Formulate Stripe core transactional boundaries. You will secure payment gateways, optimize low-latency PostgreSQL queries, and design robust OAuth integrations with third-party banking platforms.',
    responsibilities: [
      'Design reliable, zero-downtime ledger ingestion pipelines.',
      'Implement multi-layered API authentication protocols, JWT policies, and rate limiters.',
      'Coordinate failover systems and optimize active-active Redis caching cluster designs.',
      'Establish robust continuous integration and automated deployment protocols.'
    ],
    requirements: [
      '8+ years of experience engineering high-performance backend systems in production.',
      'Expertise in PostgreSQL or similar relational databases (indexing, lock contention, migrations).',
      'Advanced knowledge of network security, OAuth2, OpenID Connect, and TLS protocols.',
      'Proven track record writing high-availability distributed systems.'
    ],
    benefits: [
      'Competitive Stripe stock options.',
      'Uncapped paid time off (PTO) and family leave.',
      'Home office stipend ($2,000) and high-speed internet reimbursement.',
      'Annual learning & development allowance ($3,000).'
    ],
    applicationProcess: [
      'Step 1: Code design portfolio submission.',
      'Step 2: Technical deep-dive call focusing on transactional integrity and API security.',
      'Step 3: Comprehensive virtual onsite loop (system design, concurrency, security, and culture).',
      'Step 4: Compensation alignment & onboarding.'
    ],
    timeline: [
      { event: 'Closing Date', date: '2026-07-30' },
      { event: 'System Design Interview', date: '2026-08-05' },
      { event: 'Final Loop', date: '2026-08-12' }
    ],
    eligibility: [
      'Open to applicants based in North America or Europe with overlapping working hours.'
    ],
    selectionProcess: [
      'Selection is strictly based on standard engineering rigor, security consciousness, and performance-oriented system designs.'
    ],
    resources: [
      { name: 'Stripe API Design Guidelines', url: 'https://github.com/stripe/api-standards' },
      { name: 'Database Transaction Isolation levels', url: 'https://postgresql.org/docs' }
    ],
    faqs: [
      { question: 'Is this position 100% remote?', answer: 'Yes! Stripe supports remote work anywhere within eligible regions in North America and Western Europe.' }
    ]
  },
  {
    id: 'opp-intern-1',
    title: 'Frontend Experience Engineering Intern',
    organization: 'Notion AI Labs',
    orgLogo: 'bg-black text-white border border-gray-700',
    orgRating: 4.5,
    type: 'internship',
    location: 'New York, NY',
    locationType: 'hybrid',
    country: 'United States',
    city: 'New York',
    deadline: '2026-07-25',
    duration: '3 Months (Fall 2026)',
    salaryOrFunding: '$45 - $60 / hour',
    isPaid: true,
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'motion', 'WebSockets'],
    educationLevel: 'Enrolled in BS/MS CS',
    experienceLevel: 'Entry',
    industry: 'Productivity Software',
    officialWebsite: 'https://notion.so',
    description: 'Build elegant interactive workspace interfaces, rich canvas animations, and real-time collaborative text editors.',
    overview: 'Join the Notion AI Labs team as a Frontend Engineering Intern. You will build user experiences centering rich text blocks, beautiful micro-interactions, responsive sidebars, and fluid real-time multi-user editors.',
    responsibilities: [
      'Develop modular React components utilizing Tailwind CSS utility classes.',
      'Create performant user interface animations using motion.',
      'Integrate and parse real-time collaborative canvas sessions using WebSockets.'
    ],
    requirements: [
      'Active student enrolled in Computer Science or related degree program.',
      'Excellent fundamentals in React state management, React Hooks, and CSS layouts.',
      'Familiarity with TypeScript and modern bundle environments like Vite.'
    ],
    benefits: [
      'Highly competitive internship hourly compensation.',
      'New York housing allowance support.',
      'Notion Premium workspace setup (M3 MacBook Pro provided).',
      'High conversion rate to full-time engineering offers.'
    ],
    applicationProcess: [
      'Step 1: Portfolio evaluation.',
      'Step 2: 45-minute live React coding and UI engineering challenge.',
      'Step 3: Fit interview with Notion engineering leads.'
    ],
    timeline: [
      { event: 'Interviews Start', date: '2026-07-28' },
      { event: 'Offers Dispatched', date: '2026-08-08' }
    ],
    eligibility: [
      'Students returning to university for at least one semester post-internship.'
    ],
    selectionProcess: [
      'Focused on UI craftsmanship, styling precision, and TypeScript proficiency.'
    ],
    resources: [
      { name: 'Notion Design System', url: 'https://notion.design' }
    ],
    faqs: [
      { question: 'Will this convert to a full-time role?', answer: 'Yes! More than 80% of our summer/fall interns receive return offers.' }
    ]
  },
  {
    id: 'opp-scholar-1',
    title: 'Women in Tech Cloud Growth Scholarship',
    organization: 'Google Cloud Platform',
    orgLogo: 'bg-red-500 text-white',
    orgRating: 4.8,
    type: 'scholarship',
    location: 'Global',
    locationType: 'remote',
    country: 'Global',
    city: 'Remote',
    deadline: '2026-08-30',
    duration: '1 Year Support',
    salaryOrFunding: '$10,000 Funding + Google Mentorship',
    isPaid: true,
    requiredSkills: ['TypeScript', 'Node.js', 'React', 'Community Leadership'],
    educationLevel: 'Undergraduate Student',
    experienceLevel: 'Entry',
    industry: 'Education & Tech Advocacy',
    officialWebsite: 'https://buildyourfuture.withgoogle.com',
    description: 'Financial sponsorship and elite engineering mentorship designed to support aspiring female full-stack developers globally.',
    overview: 'Accelerate your engineering trajectory. Google Cloud provides this funding paired with 1-on-1 monthly mentorship with GCP Directors, cloud training credits, and exclusive networking circles.',
    responsibilities: [
      'Participate in monthly mentoring and community building sessions.',
      'Complete at least one cloud-based full-stack project using GCP services.'
    ],
    requirements: [
      'Identify as female/non-binary pursuing a CS or related degree.',
      'Possess basic coding knowledge in JavaScript, Python, or TypeScript.',
      'Strong history of volunteerism or tech community contributions.'
    ],
    benefits: [
      '$10,000 cash grant distributed across semesters.',
      'Direct monthly mentoring sessions with senior Google engineers.',
      'Fully paid travel and ticket to Google I/O 2027.',
      'GCP Certification exam vouchers and unlimited learning access.'
    ],
    applicationProcess: [
      'Step 1: Online form submission with transcript and essays.',
      'Step 2: Coding project review and portfolio check.',
      'Step 3: Interactive dialogue panel interview.'
    ],
    timeline: [
      { event: 'Essay Deadline', date: '2026-08-30' },
      { event: 'Interviews', date: '2026-09-15' },
      { event: 'Awards Announced', date: '2026-10-01' }
    ],
    eligibility: [
      'Must be enrolled as a full-time undergraduate student at an accredited university.'
    ],
    selectionProcess: [
      'Based on academic potential, leadership promise, and passion for cloud engineering.'
    ],
    resources: [
      { name: 'Google Student Scholarships', url: 'https://buildyourfuture.withgoogle.com' }
    ],
    faqs: [
      { question: 'How is the funding disbursed?', answer: 'The $10,000 award is disbursed directly to your university registrar to cover tuition and fees.' }
    ]
  },
  {
    id: 'opp-hack-1',
    title: 'Global AI Agent Hackathon 2026',
    organization: 'OpenAI',
    orgLogo: 'bg-emerald-600 text-white',
    orgRating: 4.9,
    type: 'hackathon',
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    country: 'United States',
    city: 'San Francisco',
    deadline: '2026-07-22',
    duration: '48 Hours',
    salaryOrFunding: '$50,000 Prize Pool',
    isPaid: true,
    requiredSkills: ['TypeScript', 'Gemini API', 'Next.js', 'Vector Databases', 'Python'],
    educationLevel: 'Any',
    experienceLevel: 'Mid',
    industry: 'Artificial Intelligence',
    officialWebsite: 'https://openai.com/hackathon',
    description: 'Assemble real-world autonomous agents, interactive AI applications, and cognitive systems using modern API frameworks.',
    overview: 'A 48-hour global challenge to build the future of AI agency. Form a team of 1-4 and compete to design high-impact autonomous workers, cooperative multi-agent canvases, or system tools.',
    responsibilities: [
      'Ideate, build, and pitch a fully functional AI-enabled application inside 48 hours.',
      'Integrate OpenAI or Gemini API SDK endpoints server-side.'
    ],
    requirements: [
      'Capable of rapid prototyping in React, Node.js, Next.js, or Python.',
      'Understanding of API orchestrators, vector embeddings, or prompt chains.'
    ],
    benefits: [
      'Grand Prize: $25,000 cash + OpenAI developer credits.',
      'Runner Up: $15,000 cash, Third place: $10,000 cash.',
      'Direct recruiting interviews with OpenAI engineering hiring managers.',
      'Exclusive hackathon swag and developer hardware access.'
    ],
    applicationProcess: [
      'Step 1: Team registration & proposal submission.',
      'Step 2: Acceptance confirmation (limited to 500 participants onsite, unlimited virtual).'
    ],
    timeline: [
      { event: 'Registration Closes', date: '2026-07-22' },
      { event: 'Hackathon Starts', date: '2026-07-24' },
      { event: 'Demo Submission', date: '2026-07-26' }
    ],
    eligibility: [
      'Open to developers, designers, and innovators aged 18 or older.'
    ],
    selectionProcess: [
      'Evaluated on: Innovation, technical execution depth, usability, and presentation value.'
    ],
    resources: [
      { name: 'OpenAI API Docs', url: 'https://platform.openai.com/docs' },
      { name: 'Gemini TypeScript SDK Guide', url: 'https://ai.google.dev' }
    ],
    faqs: [
      { question: 'Is travel reimbursement provided?', answer: 'Yes, up to $500 travel stipends are available for selected onsite hackers.' }
    ]
  },
  {
    id: 'opp-comp-1',
    title: 'Kaggle Predictive Diagnostics Challenge',
    organization: 'Kaggle',
    orgLogo: 'bg-teal-600 text-white',
    orgRating: 4.4,
    type: 'competition',
    location: 'Global',
    locationType: 'remote',
    country: 'Global',
    city: 'Remote',
    deadline: '2026-09-10',
    duration: '2 Months',
    salaryOrFunding: '$30,000 Grand Prize',
    isPaid: true,
    requiredSkills: ['Python', 'Pandas', 'Scikit-Learn', 'Deep Learning', 'SQL'],
    educationLevel: 'Any',
    experienceLevel: 'Senior',
    industry: 'Data Science',
    officialWebsite: 'https://kaggle.com/competitions',
    description: 'Design machine learning regression models to evaluate clinical diagnostics records and forecast career burnout indices.',
    overview: 'Develop state-of-the-art predictive algorithms. You are tasked with training models on high-dimensional clinical and mental health indices datasets to identify early burnout signals among developers.',
    responsibilities: [
      'Train, optimize, and submit machine learning models.',
      'Ensure code compliance with standard reproducible notebook guidelines.'
    ],
    requirements: [
      'Strong understanding of supervised classification, ensemble methods, and deep learning.',
      'Proficiency in Python data frameworks: NumPy, Pandas, Scikit-Learn, PyTorch/TensorFlow.'
    ],
    benefits: [
      'Top 3 placements divide $30,000 cash pool.',
      'Receive gold, silver, or bronze Kaggle profile tiers.',
      'Published publication opportunities in collaborative journals.'
    ],
    applicationProcess: [
      'Step 1: Join the competition dashboard on Kaggle.',
      'Step 2: Access dataset coordinates, run model fits, and submit predictions.'
    ],
    timeline: [
      { event: 'Submissions Close', date: '2026-09-10' },
      { event: 'Leaderboard Finalized', date: '2026-09-15' }
    ],
    eligibility: [
      'Open globally to data researchers, developers, and ML students.'
    ],
    selectionProcess: [
      'Ranked by objective evaluation metric (F1 Score / Area Under ROC) on private test datasets.'
    ],
    resources: [
      { name: 'Kaggle Learning Paths', url: 'https://kaggle.com/learn' }
    ],
    faqs: [
      { question: 'Can I form a team?', answer: 'Yes! Teams of up to 5 members can participate together.' }
    ]
  },
  {
    id: 'opp-fellow-1',
    title: 'Generative Tech Founders Fellowship',
    organization: 'Y Combinator',
    orgLogo: 'bg-orange-500 text-white',
    orgRating: 4.9,
    type: 'fellowship',
    location: 'Silicon Valley, CA',
    locationType: 'hybrid',
    country: 'United States',
    city: 'Mountain View',
    deadline: '2026-11-01',
    duration: '10 Weeks',
    salaryOrFunding: '$100,000 Safe Investment',
    isPaid: true,
    requiredSkills: ['React', 'Node.js', 'System Architecture', 'Entrepreneurship'],
    educationLevel: 'Any',
    experienceLevel: 'Lead',
    industry: 'Venture Capital & SaaS',
    officialWebsite: 'https://ycombinator.com',
    description: 'An elite pre-seed sandbox, mentoring network, and safety net providing funding and structure for technical founders.',
    overview: 'YC Founders Fellowship provides $100,000 pre-seed funding, weekly builder roundtables, and direct mentorship from YC partners to support early-stage technical founders creating SaaS products.',
    responsibilities: [
      'Actively build and iterate your SaaS MVP.',
      'Engage in peer-reviews, prototype demonstrations, and customer feedback iterations.'
    ],
    requirements: [
      'Full-time dedication to your product during the 10-week cycle.',
      'At least one technical founder capable of constructing and deploying the MVP.'
    ],
    benefits: [
      '$100,000 SAFE funding to support early-stage server and operational bills.',
      'Weekly dinners with leading tech founders and industry visionaries.',
      'Direct, lifetime access to the YC Founder community and directory.'
    ],
    applicationProcess: [
      'Step 1: Submission of structured application form + 1-minute video.',
      'Step 2: 10-minute technical and product partner interview.'
    ],
    timeline: [
      { event: 'Applications Close', date: '2026-11-01' },
      { event: 'Interviews Complete', date: '2026-11-15' },
      { event: 'Fellowship Starts', date: '2027-01-10' }
    ],
    eligibility: [
      'Open to teams or solo builders globally willing to spend 10 weeks in SF.'
    ],
    selectionProcess: [
      'Evaluated on: Founder chemistry, technical execution capabilities, and early market validation.'
    ],
    resources: [
      { name: 'YC Library: How to Start a Startup', url: 'https://ycombinator.com/library' }
    ],
    faqs: [
      { question: 'Does YC take equity for the Fellowship?', answer: 'Yes, the $100,000 SAFE is invested on standard terms detailed upon acceptance.' }
    ]
  },
  {
    id: 'opp-research-1',
    title: 'Research Fellowship: Distributed Consensus Systems',
    organization: 'MIT Decentralized Systems Group',
    orgLogo: 'bg-gray-800 text-white',
    orgRating: 4.7,
    type: 'research',
    location: 'Boston, MA',
    locationType: 'hybrid',
    country: 'United States',
    city: 'Boston',
    deadline: '2026-08-01',
    duration: '6 Months',
    salaryOrFunding: '$8,000 / month stipend',
    isPaid: true,
    requiredSkills: ['SQL', 'Raft', 'Protobuf', 'Go', 'Distributed Systems'],
    educationLevel: 'MS or PhD student',
    experienceLevel: 'Senior',
    industry: 'Academic Research',
    officialWebsite: 'https://mit.edu',
    description: 'Investigate low-latency write-ahead logging (WAL) optimizations, Raft consensus scalability, and Byzantine fault tolerances.',
    overview: 'Collaborate with leading researchers at MIT on optimizing performance bottlenecks inside active distributed ledger and consensus clusters.',
    responsibilities: [
      'Develop benchmarking tools, write profiling frameworks, and publish academic reviews.',
      'Conduct code simulations of multi-region database state replication.'
    ],
    requirements: [
      'Strong research background in distributed databases, consensus protocols (Raft/Paxos), or network systems.',
      'Experience compiling robust code systems in Go, Rust, or C++.'
    ],
    benefits: [
      'Generous monthly research stipend.',
      'Full laboratory resources and computing cluster access.',
      'Co-author research papers for SIGMOD or VLDB.'
    ],
    applicationProcess: [
      'Step 1: Send research proposal and curriculum vitae.',
      'Step 2: Interview with group principal investigator.'
    ],
    timeline: [
      { event: 'Apply By', date: '2026-08-01' },
      { event: 'Decisions', date: '2026-08-15' }
    ],
    eligibility: [
      'Current graduate students or postdoctoral scholars.'
    ],
    selectionProcess: [
      'Selected based on relevant research achievements and alignment with core consensus group targets.'
    ],
    resources: [
      { name: 'MIT Decentralized Group Publications', url: 'https://mit.edu' }
    ],
    faqs: [
      { question: 'Can this be completed remotely?', answer: 'This is a hybrid position requiring at least 2 days a week onsite in Boston labs.' }
    ]
  },
  {
    id: 'opp-opensource-1',
    title: 'Drizzle ORM Open Source Core Contributor',
    organization: 'Drizzle Team',
    orgLogo: 'bg-yellow-500 text-black',
    orgRating: 4.8,
    type: 'open_source',
    location: 'Global',
    locationType: 'remote',
    country: 'Global',
    city: 'Remote',
    deadline: '2026-07-20', // Today's deadline!
    duration: 'Ongoing',
    salaryOrFunding: 'Sponsorship Grant $3,000/mo',
    isPaid: true,
    requiredSkills: ['TypeScript', 'SQL', 'PostgreSQL', 'CI/CD Pipelines'],
    educationLevel: 'Any',
    experienceLevel: 'Senior',
    industry: 'Infrastructure & Tooling',
    officialWebsite: 'https://orm.drizzle.team',
    description: 'Accelerate type-safe query compilation pipelines, write PostgreSQL dialect optimizations, and expand structural migrations.',
    overview: 'The Drizzle Team is sponsoring dedicated open-source developers to optimize TypeScript compilation overhead, expand multi-dialect migration configurations, and fix edge-case PostgreSQL driver integrations.',
    responsibilities: [
      'Review and merge community pull requests.',
      'Optimize the TypeScript compiler footprint and types testing frameworks.',
      'Publish developer guides and document schema changes.'
    ],
    requirements: [
      'Expert level knowledge of TypeScript type-level programming (generics, template literals, conditional types).',
      'Advanced experience writing SQL queries, schemas, and relational indexes.'
    ],
    benefits: [
      '$3,000 monthly GitHub Sponsors grant.',
      'Full core maintainer permissions and advisory board access.',
      'High visibility across the TypeScript software engineering ecosystem.'
    ],
    applicationProcess: [
      'Step 1: Provide links to open PRs or issues resolved on TypeScript database repos.',
      'Step 2: 1-hour code review pair-programming challenge with Drizzle founders.'
    ],
    timeline: [
      { event: 'Applications Close Today', date: '2026-07-20' },
      { event: 'Onboarding Starts', date: '2026-07-25' }
    ],
    eligibility: [
      'Open globally to contributors demonstrating deep database and type engineering skills.'
    ],
    selectionProcess: [
      'Strictly based on quality of historical open-source contributions and type engineering precision.'
    ],
    resources: [
      { name: 'Drizzle Contribution Guidelines', url: 'https://orm.drizzle.team/docs' }
    ],
    faqs: [
      { question: 'Is this a full-time contract?', answer: 'This is a sponsored open-source engagement with flexible commitment (recommended 20 hours/week).' }
    ]
  }
];

export const RECENT_SEARCHES_KEY = 'pathpilot_recent_searches';
export const SAVED_SEARCHES_KEY = 'pathpilot_saved_searches';
export const BOOKMARKED_OPPS_KEY = 'pathpilot_bookmarked_opportunities';

export const POPULAR_SEARCH_QUERIES = [
  'Generative AI',
  'Remote React Internships',
  'GCP Cloud Run',
  'PostgreSQL Database scaling',
  'Data Science Competitions',
  'Open Source Grants'
];

export const TRENDING_COMPANIES = [
  { name: 'Google Cloud', rating: 4.7, openRolesCount: 14, logo: 'bg-blue-600 text-white', techStack: ['GCP', 'Kubernetes', 'TypeScript'] },
  { name: 'Stripe', rating: 4.8, openRolesCount: 8, logo: 'bg-indigo-600 text-white', techStack: ['Ruby', 'Go', 'PostgreSQL'] },
  { name: 'OpenAI', rating: 4.9, openRolesCount: 5, logo: 'bg-emerald-600 text-white', techStack: ['Python', 'PyTorch', 'Next.js'] },
  { name: 'Notion', rating: 4.6, openRolesCount: 9, logo: 'bg-black text-white', techStack: ['React', 'TypeScript', 'Node.js'] }
];

export const TRENDING_SKILLS = [
  { name: 'TypeScript', demandGrowth: '+34%', avgSalary: '$145K', jobsCount: 1420 },
  { name: 'Google Cloud Run', demandGrowth: '+48%', avgSalary: '$162K', jobsCount: 820 },
  { name: 'Redis Caching', demandGrowth: '+26%', avgSalary: '$150K', jobsCount: 610 },
  { name: 'Vector Embeddings', demandGrowth: '+120%', avgSalary: '$180K', jobsCount: 340 }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'notif-opp-1', title: 'Opportunity Closing Soon', body: 'The Notion Frontend Engineering Intern application closes in 5 days! Complete your Cover Letter.', type: 'warning', date: '2026-07-20' },
  { id: 'notif-opp-2', title: 'High AI Match Score Identified', body: 'New Senior Full Stack role at GCP has a 94% match score with your target career goals!', type: 'success', date: '2026-07-19' },
  { id: 'notif-opp-3', title: 'Open Source Scholarship Live', body: 'Google Cloud Platform launched a new Women in Tech Scholarship. Check eligibility!', type: 'info', date: '2026-07-18' }
];

export const MOCK_ACHIEVEMENTS = [
  { id: 'ach-opp-1', title: 'Marketplace Explorer', description: 'Search and filter opportunities across 3 distinct categories.', progress: 100, maxProgress: 100, unlocked: true, icon: 'Compass', xp: 50 },
  { id: 'ach-opp-2', title: 'Application Enthusiast', description: 'Submit 3 applications via the pipeline application tracker.', progress: 1, maxProgress: 3, unlocked: false, icon: 'Send', xp: 150 },
  { id: 'ach-opp-3', title: 'ATS Approved', description: 'Analyze an opportunity and score above 80% on resume compatibility.', progress: 100, maxProgress: 100, unlocked: true, icon: 'FileCheck', xp: 100 },
  { id: 'ach-opp-4', title: 'Streak Master', description: 'Maintain a 5-day career preparation streak on the Opportunities Hub.', progress: 3, maxProgress: 5, unlocked: false, icon: 'Flame', xp: 200 }
];
