# Product Requirements Document (PRD)
## Project: PathPilot AI — "Navigate Your Career With AI"
### Document Version: 1.0.0
### Author: Principal AI Product Architect & UX Strategist
### Date: July 19, 2026

---

## 1. Executive Summary
PathPilot AI is an AI-powered Career Operating System designed to replace the fragmented, static, and stressful landscape of career development with a unified, continuous, and dynamic navigation system. Instead of treating career growth as a series of disconnected events (writing a resume, searching on a job board, preparing for an interview in a silo), PathPilot AI functions like **Google Maps for Careers**. It continuously benchmarks where a user is today, maps where they want to go, identifies their skill and experience gaps, plans an optimal incremental route, and provides step-by-step guidance ("turn-by-turn navigation") to help them reach their destination.

By integrating state-of-the-art Large Language Models (LLMs) with career path indexing engines, PathPilot AI provides hyper-personalized, contextualized career advice at scale. The platform addresses students, early-career professionals, career changers, and lifelong learners, helping them navigate complex professional landscapes with clarity, agency, and confidence.

---

## 2. Vision Statement
To index the professional capabilities, requirements, and learning trajectories of the global workforce, creating a world where every individual has a real-time, personalized, and active navigation system that guides them to their full potential, eliminating career stagnation and professional uncertainty.

---

## 3. Mission Statement
To build the world's most intelligent Career Operating System. By providing real-time positioning, interactive skill-gap maps, daily actionable missions, and continuous AI mentorship, PathPilot AI empowers individuals to navigate their career paths with absolute clarity and structured momentum.

---

## 4. Problem Statement
The transition from education to employment—or from one career track to another—is broken. Individuals face several compounding problems:
1. **The Navigation Vacuum:** Users do not know their current positioning in the market or how to reach their dream roles.
2. **Fragmentation of Tools:** Job seekers must juggle separate platforms for resume parsing, interview practice, course completion, job listings, and mentorship. No single thread connects these systems.
3. **Information Overload & Irrelevance:** Standard career advice is static, generic, and quickly outdated. Static curriculums do not adapt to real-time market needs.
4. **The "Cold Start" Career Problem:** Fresh graduates and career switchers lack the network, experience, or specialized knowledge to get recruiters' attention, yet have no structured guidance on how to close that gap.
5. **No Quantifiable Progress:** While fitness, finance, and language learning (e.g., Duolingo) have highly engaging, gamified trackers, career progression remains invisible and abstract.

---

## 5. Market Opportunity
The Global EdTech and Career Development market size was valued at over $340 billion in 2025 and is projected to expand rapidly. However, the current "AI for Careers" wave is flooded with single-feature "AI resume builders" or "interview practice bots." 

There is an open blue-ocean opportunity for a **comprehensive Career Operating System** that aggregates these capabilities under a single unified data model. By capturing the user's ongoing growth, portfolio, and engagement history, PathPilot AI creates high user retention (unlike resume builders, which are abandoned after a job is secured). This transforms career development from a transactional transaction into an ongoing subscription-grade daily routine.

---

## 6. Existing Solutions
Historically, users have relied on:
* **Professional Networks:** LinkedIn (for networking and social signals).
* **Job Aggregators:** Indeed, Glassdoor (for matching and salary benchmarks).
* **Skill Acquisition Platforms:** Coursera, Udemy (for static video learning).
* **Point AI Tools:** Resume.io, Kickresume (for static layouts and template population).
* **General LLM Chatbots:** ChatGPT, Gemini, Perplexity (for unstructured Q&A).

---

## 7. Competitor Analysis

| Competitor | Strengths | Weaknesses | PathPilot AI's Disruption |
| :--- | :--- | :--- | :--- |
| **LinkedIn** | Massive database of profiles, strong networking effects, direct access to recruiters. | Noise-heavy feed, high social anxiety, generic job recommendations, passive navigation. | Active, private, focused workspace. No social noise or toxic flexes; pure focus on personal skill maps and daily executions. |
| **Coursera** | High-quality certified content from top universities. | Extremely high drop-out rates, static syllabus, lack of personalized application paths, expensive. | We do not sell courses; we index external resources. We map EXACTLY which resource is needed for your specific gap, with micro-tasks. |
| **Indeed / Glassdoor** | Broad job volume, historical salary reviews. | Transactional, unstructured, depressing application loops; lacks preparation and development guides. | Connects job listings directly to your readiness score. If you lack a skill for a job, we show you how to acquire it. |
| **Resume.io / Kickresume** | Elegant templates, easy standard builders. | Transactional utility; once a resume is exported, the user has zero reason to return. No real skill gap closure. | Resume is just one layer of your Career Profile. PathPilot continuously improves it as you execute daily tasks. |
| **ChatGPT / Gemini / Perplexity** | Flexible reasoning, general resume feedback. | Lacks context persistence, lacks visual hierarchy, no structured roadmapping, prone to generic outputs. | Career-specialized structured outputs, persistent personal database, native visualization systems (Skill Radars, Roadmaps). |
| **Notion AI** | Excellent note-taking and structured databases. | Requires significant setup, lacks built-in industry knowledge or automated live mapping. | Out-of-the-box, zero-configuration interactive dashboards and real-time integration. |

---

## 8. Why PathPilot AI is Different
PathPilot AI is fundamentally different due to its **Persistent Data Loop (The Career Engine)**.
1. **Dynamic Mapping:** Just like Google Maps recalculates when you take a wrong turn, PathPilot AI adapts your career roadmap if you fail an interview, acquire a new skill, or change your target role.
2. **Context Persistence:** Rather than repeating your background to a generic AI on every session, PathPilot AI maintains a deep, structured representation of your portfolio, aspirations, and active skill-gaps.
3. **Unified Interface:** We bridge the chasm between *analyzing* (Resume Score), *learning* (Roadmaps), *doing* (Daily Missions), and *winning* (Interview Prep & Opportunity matching) in a single integrated hub.

---

## 9. User Personas

### 1. University Students
*   **Goals:** Land a high-paying internship, build a competitive early portfolio, choose the right major specialization.
*   **Pain Points:** Zero professional experience, high impostor syndrome, overwhelmed by conflicting advice.
*   **Frustrations:** "Entry-level" jobs requiring 3 years of experience.
*   **Daily Behavior:** Heavy mobile usage, high context switching, values gamified feedback (Duolingo, gaming mechanics).
*   **Current Workflow:** Browsing campus career portals, copy-pasting resumes based on generic templates, asking Reddit.
*   **AI Opportunities:** Skill gap analysis comparing their coursework to actual market demands; micro-projects to build real experience.

### 2. Fresh Graduates
*   **Goals:** Secure their first full-time job within 6 months of graduation, transition academic knowledge to corporate environments.
*   **Pain Points:** Mass job applications leading to cold rejections, lack of direct feedback on why their resume fails.
*   **Frustrations:** Ghosted by automated applicant tracking systems (ATS).
*   **Daily Behavior:** High anxiety, spending hours scrolling job boards, updating portfolio websites.
*   **Current Workflow:** Sending 20+ applications daily, generic cold outreach on LinkedIn.
*   **AI Opportunities:** Automated ATS-compatibility simulations; real-time confidence scores and custom mock interview practice tailored to exact job listings.

### 3. Self-Taught Learners
*   **Goals:** Transition into technical or creative roles (e.g., Software Engineering, UX Design) without a traditional degree.
*   **Pain Points:** Lack of structured curriculum, credentials not valued by recruiters, no proof of work.
*   **Frustrations:** Not knowing "what they don't know," feeling lost in tutorial hell.
*   **Daily Behavior:** Watching YouTube tutorials, committing to GitHub, browsing StackOverflow or design forums.
*   **Current Workflow:** Building random projects, reading scattered blog posts, self-directed study schedules.
*   **AI Opportunities:** Dynamic, logical curriculum mapping; code/design portfolio grading; identifying credential/certification shortlists that carry weight.

### 4. Career Changers
*   **Goals:** Pivot from low-growth or unfulfilling industries (e.g., hospitality, retail) into high-growth sectors (e.g., product management, tech sales).
*   **Pain Points:** Transferable skills are invisible on standard resumes; starting over from a lower salary baseline.
*   **Frustrations:** Handled as "inexperienced" by standard recruiters who fail to value their decade of professional soft skills.
*   **Daily Behavior:** Balancing a full-time job/family with part-time studying in evenings.
*   **Current Workflow:** Searching for bootcamps, attending evening webinars, editing resumes to sound tech-adjacent.
*   **AI Opportunities:** High-fidelity Translation Engine that rewrites past non-technical experiences into industry-resonant terminology; structured 1-hour evening learning roadmaps.

### 5. Professionals Seeking Promotions
*   **Goals:** Secure a Senior/Lead title, increase compensation, step into people management.
*   **Pain Points:** Unsure of how leadership evaluates promotion readiness; office politics; lack of active feedback from direct managers.
*   **Frustrations:** Feeling stagnant or passed over for promotion because of poor self-advocacy.
*   **Daily Behavior:** High workload, checking enterprise metrics dashboards, writing strategy docs.
*   **Current Workflow:** End-of-year self-appraisals, brief chats with managers, checking career ladders.
*   **AI Opportunities:** Career progression trackers, executive presence simulator, real-time feedback on leadership artifacts and communications.

### 6. Internship Seekers
*   **Goals:** Secure a brand-name summer internship to lock in a return offer.
*   **Pain Points:** Hyper-competitive application windows, rigid online assessment standards.
*   **Frustrations:** One rejection early in the season ruins their entire summer runway.
*   **Daily Behavior:** Keeping track of spreadsheet application trackers on Reddit/GitHub.
*   **Current Workflow:** Direct application to corporate portals, networking with alumni.
*   **AI Opportunities:** Timely notification of application openings; rapid customization of resumes and cover letters for highly competitive application cycles.

### 7. Scholarship Applicants
*   **Goals:** Win competitive academic or professional development fellowships and grants.
*   **Pain Points:** Extremely demanding essays, complex eligibility matrixes.
*   **Frustrations:** Spending 40+ hours on an application only to be disqualified on a technicality.
*   **Daily Behavior:** Writing long essays, requesting letters of recommendation.
*   **Current Workflow:** Drafting in Google Docs, manual peer editing.
*   **AI Opportunities:** Alignment analysis assessing how closely an essay resonates with the foundation's core values; structured prompt frameworks for recommendation writers.

---

## 10. User Journey (End-to-End)

```
[1. Landing Page]  -->  [2. Signup / Auth]  -->  [3. Profile Setup]  -->  [4. Target Career Goal]
                                                                                  |
[8. Skill Gap Radar] <-- [7. Career Readiness Score] <-- [6. AI Analysis] <-- [5. Resume Upload]
         |
[9. Personalized Roadmap] --> [10. Daily Missions] --> [11. Interactive AI Mentor] --> [12. Progress Logs]
```

1.  **Landing Page:** User encounters a clean, high-conversion visual gateway highlighting: "Stop applying blindly. Put your career on autopilot." They interact with an immediate, lightweight teaser (e.g., selecting a target career and getting a 3-point sample gap analysis).
2.  **Signup:** Minimal friction OAuth (Google/Github) onboarding.
3.  **Profile Setup:** User provides high-level educational/professional background, preferred working style, and active technical/soft strengths.
4.  **Career Goal:** User enters their North Star target role (e.g., "Associate Product Manager at Google", "Senior React Developer", "AI Research Scientist").
5.  **Resume Upload:** Drag-and-drop or manual text import of their current resume.
6.  **AI Analysis:** System parses the resume, compares it against the industry standard vector representation for the selected Target Career Goal, and identifies alignment parameters.
7.  **Career Readiness Score:** Out of 100%, the user sees their real-time market readiness score, broken down into resume structure, project impact, skill matching, and networking presence.
8.  **Skill Gap Analysis:** An interactive, multi-dimensional **Skill Radar Chart** visualizing technical, soft, and domain-specific knowledge gaps.
9.  **Personalized Roadmap:** A structured, sequential path consisting of milestone phases (e.g., "Phase 1: Build Core Portfolio", "Phase 2: Master System Design"). Each milestone contains curated, highly specific learning resources and target outcomes.
10. **Daily Missions:** Every day, the dashboard renders 3 curated micro-tasks ("Missions") that require less than 30 minutes to complete (e.g., "Refine the bullet point on your latest project to focus on metrics", "Read this 10-minute article on DB sharding", "Draft an outreach message to an industry peer").
11. **AI Mentor:** A continuous chat sidebar. The mentor is fully context-aware; it knows the user's resume, active milestones, and next interview date, offering strategic answers rather than generic advice.
12. **Progress Tracking:** Interactive charts showing their Readiness Score increasing over time as they complete milestones, finish mock interviews, and update their resumes.

---

## 11. Core Product Philosophy
*   **Actionable over Analytical:** Never tell a user *what* is wrong without immediately offering a structured, 10-minute micro-action to fix it.
*   **Continuous over Event-Driven:** Career growth is not a quarterly event; it is a compounding daily habit. The product design must reward daily engagement and tiny incremental steps.
*   **Anti-Anxiety Design:** Standard job hunts are demoralizing. Our UX must feel encouraging, positive, and structurally empowering.
*   **Zero Noise:** No social feeds, no algorithmic humblebrags, no corporate theater. The platform is a private workspace dedicated strictly to the user's growth.

---

## 12. Product Principles
1.  **Truth in Analytics:** Never inflate user scores just to make them feel good. Provide objective, developer-honest, recruiter-aligned metrics.
2.  **Context-Aware Cohesion:** If a user completes a mock interview, the AI Mentor should congratulate them, update their skill radar, and update the career readiness index automatically.
3.  **Proactive Navigation:** Don't wait for the user to ask what to do. Proactively alert them: *"We noticed a shift in industry hiring standards for your target role. We've updated your Phase 2 milestone with Next.js Server Actions."*
4.  **Effortless Portfolio Logging:** Make it incredibly easy to capture real-world achievements so their profile is constantly up-to-date.
5.  **Agency First:** AI provides recommendations and navigational routes, but the user is always in the driver's seat. Paths can be manually bypassed, re-ordered, or customized.

---

## 13. Product Goals
*   **User Empowerment:** Enable early professionals to apply to competitive roles with verified readiness data.
*   **Drastic Search Reduction:** Shorten the average job search lifecycle from 6 months to 60 days by focusing energy only on viable paths and active skill-gaps.
*   **Bridging the Academic Gap:** Translate theoretical education into industry-ready, portfolio-verified practical expertise.
*   **Retain Talent:** Drive daily active retention (DAU/MAU > 45%) on a platform historically viewed as a utility.

---

## 14. Success Metrics (KPIs)

| Metric | Target | Definition / Measurement |
| :--- | :--- | :--- |
| **Active Engagement Ratio (DAU/MAU)** | > 45% | Percentage of monthly users who log in and complete at least one Daily Mission. |
| **Milestone Completion Rate** | > 65% | Percentage of started career roadmap phases successfully marked complete. |
| **Ready-to-Apply Conversion** | > 40% | Users who achieve a Career Readiness Score of > 85% and proceed to apply. |
| **Interview Conversion Boost** | 2.5x | Ratio of successful interview invites for users utilizing customized ATS-optimized resumes compared to baseline resumes. |
| **AI Mentor Retention** | > 4.5 turns | Average length of contextually relevant conversations with the AI Mentor. |
| **NPS (Net Promoter Score)** | > 75 | Calculated via quarterly in-app satisfaction feedback loops. |

---

## 15. Functional Requirements (FR)

### FR-1: Core Profiling & Onboarding
*   **FR-1.1:** The system must support Google and GitHub single sign-on (SSO) with secure session persistence.
*   **FR-1.2:** The onboarding process must capture Name, Email, current career status (Student, Career Changer, Professional, etc.), and Target Career Goal.
*   **FR-1.3:** The target career goal field must support autocomplete and dynamic taxonomy matching (e.g. mapping "backend dev" to "Software Engineer - Backend").

### FR-2: AI Resume Parsing & Diagnostic Engine
*   **FR-2.1:** The system must accept resume uploads in `.pdf`, `.docx`, and `.txt` formats (Max size: 10MB).
*   **FR-2.2:** The backend must extract text layout, structured experience blocks, skills, and projects.
*   **FR-2.3:** The AI engine must analyze the parsed resume against the selected Target Career Goal, returning:
    *   Overall Career Readiness Score (0-100)
    *   Sub-scores for: Impact/Metrics, Tech Stack Alignment, Formatting/Structure, Action Verbs.
    *   A list of identified strengths and high-priority structural improvements.

### FR-3: Skill Gap Analyzer (Interactive Radar)
*   **FR-3.1:** Based on the Target Career Goal, the system must generate a 6-axis skill taxonomy (e.g., Languages, Frameworks, Architecture, Soft Skills, Testing, Tooling).
*   **FR-3.2:** The AI must evaluate the parsed resume and assign a score (1-10) for each axis.
*   **FR-3.3:** The interface must render an interactive, high-contrast SVG Radar Chart mapping "Required Skills" vs. "Current Profile" with hover states.

### FR-4: Personalized Career Roadmap
*   **FR-4.1:** The system must dynamically generate a 3-to-4 phase milestone roadmap to bridge identified gaps.
*   **FR-4.2:** Each phase must contain:
    *   A descriptive title (e.g., "Build a Production-Ready Node.js Server")
    *   3-4 actionable tasks with nested learning resource links (documentation, curated open courses).
    *   An expected time-to-complete value.
*   **FR-4.3:** Users must be able to mark tasks/phases complete, triggering an immediate recalculation of their overall Career Readiness Score.

### FR-5: Daily Mission Generator
*   **FR-5.1:** The system must generate exactly 3 micro-missions per day based on the user's active roadmap phase and weakest radar axes.
*   **FR-5.2:** Micro-missions must be designed to take under 30 minutes.
*   **FR-5.3:** Completing a mission must award "XP" (Experience Points) and increment the user's active Daily Streak counter.

### FR-6: AI Contextual Mentor
*   **FR-6.1:** An interactive chat sidebar must be accessible across all screens.
*   **FR-6.2:** The assistant must utilize the `gemini-2.5` model, pre-primed with the user's structured profile, active roadmap progress, and resume analysis data.
*   **FR-6.3:** The assistant must offer pre-calculated, context-specific prompt shortcuts (e.g., "Analyze my resume structure," "Suggest project ideas for Phase 2").

### FR-7: AI Mock Interview Simulator
*   **FR-7.1:** Users must be able to initiate a mock interview tailored to their Target Career and a custom job description they paste.
*   **FR-7.2:** The system must simulate a 5-question interview. Each question is rendered sequentially, with the user typing their answer.
*   **FR-7.3:** After completion, the system must generate a comprehensive transcript assessment:
    *   Overall Interview Score (0-100)
    *   Model-answers for each question
    *   Specific suggestions to improve communication, structure, and technical depth.

### FR-8: Opportunity Aggregator
*   **FR-8.1:** The platform must display curated listings of Internships, Full-Time Jobs, and Scholarships matching the user's target career.
*   **FR-8.2:** Each opportunity must display a "Match Index" (e.g., "94% Match") calculated by comparing the opportunity's listed requirements with the user's verified Profile and Skill Radar.

---

## 16. Non-Functional Requirements (NFR)

### NFR-1: Performance & Latency
*   **NFR-1.1:** The frontend interface must achieve a Lighthouse performance score of > 90.
*   **NFR-1.2:** Static dashboard elements, charts, and metrics must render within 300ms of page load.
*   **NFR-1.3:** AI resume analysis (parsing + evaluation) must complete within 5 seconds.
*   **NFR-1.4:** AI chat responses must stream in real-time, with a Time-To-First-Token (TTFT) of < 400ms.

### NFR-2: Scalability & Reliability
*   **NFR-2.1:** The system must support up to 50,000 Concurrent Active Users (CCU) without performance degradation.
*   **NFR-2.2:** Service availability must maintain 99.9% uptime (excluding scheduled maintenance windows).

### NFR-3: Security & Data Integrity
*   **NFR-3.1:** All user-uploaded resumes and profile details must be stored in encrypted databases (AES-256 at rest).
*   **NFR-3.2:** All network communications must utilize HTTPS TLS 1.3 encryption.
*   **NFR-3.3:** Personal identifiable information (PII) must be scrubbed or securely handled before transmitting context payloads to external LLM APIs.

### NFR-4: Browser Compatibility
*   **NFR-4.1:** The application must remain fully functional across all major browsers, including Chrome (v100+), Safari (v15+), Firefox (v98+), and Edge (v100+).

---

## 17. MVP Scope
The Minimum Viable Product (MVP) focuses purely on establishing the core "GPS" loop:
*   **Onboarding:** target role selection.
*   **Parser:** PDF/text resume parsing and 4-metric score calculation.
*   **Visualizer:** Interactive SVG Skill Radar Chart based on parsed resume.
*   **Guide:** Dynamically generated 3-Phase Milestone Roadmap.
*   **Mentorship:** Sidebar AI Mentor chat with basic profile-context awareness.
*   **Gamification:** Active Streak counts and Daily Missions tracker.

---

## 18. Features for Version 2 (Scale)
*   **Voice-Enabled Mock Interviews:** Real-time audio interaction with the AI interviewer using WebRTC or fast TTS/STT pipelines.
*   **Live Portfolio Grader:** Integrating with GitHub and Figma APIs to pull public user repositories/designs, grading code quality, architectural depth, and design system alignment directly.
*   **Dynamic Resource Matcher:** Connecting roadmap milestones to live API feeds of top learning platforms (Coursera, Udemy, YouTube, freeCodeCamp) and displaying pricing/enrollment status.
*   **Automatic Match Optimization:** A "one-click ATS optimizer" that suggests phrasing and keyword placement to lift match scores before exporting a resume for a specific job listing.

---

## 19. Features for Version 3 (Ecosystem)
*   **PathPilot Recruit (Recruiter Portal):** Allowing top enterprises to search a verified database of candidates filtered by their actual *PathPilot Verification Score* (earned by completing real-world projects, passing rigorous mock evaluations, and logging certified learning progress).
*   **Peer Navigation (Collaborative Learning Groups):** Users pursuing the same career trajectories can form virtual "Crews," sharing progress maps, collaborating on portfolio projects, and conducting peer-to-peer code reviews.
*   **Mentorship Matchmaking:** Matching early-career professionals on PathPilot with senior industry volunteers who can view their progress data, review their roadmap trajectories, and provide human-in-the-loop oversight.

---

## 20. Future Vision (5-Year Outlook)
In five years, PathPilot AI aims to become the **global ledger of human capabilities**. Standard static resumes will become obsolete, replaced by a dynamic, cryptographically verified PathPilot Career Ledger. Universities, bootcamps, and vocational centers will design their curricula directly on top of PathPilot's global market demand indexing engine, ensuring student learning pathways match the shifting needs of industrial and tech ecosystems.

---

## 21. Risks and Challenges

### 1. The Generative Hallucination Problem
*   **Risk:** The AI might recommend outdated libraries, non-existent certification paths, or hallucinated learning resources.
*   **Mitigation:** Establish a strict verified taxonomy of skills and industry-standard courses. Force the LLM to map its recommendations only to this verified database, utilizing retrieval-augmented generation (RAG) with a clean vector index.

### 2. High API Costs
*   **Risk:** Deep, continuous, multi-turn context-aware chat coupled with multiple diagnostic analyses will generate immense token usage, driving up costs.
*   **Mitigation:** Implement aggressive local caching of analysis state. Utilize compact, highly-performant local models for initial parsing, reserving flagship models (e.g., Gemini Flash) for the deep logical synthesis and conversational mentor tasks.

### 3. User Retention Fatigue
*   **Risk:** Career navigation platforms are traditionally used only during acute transition periods. Users may stop logging in once they find a role.
*   **Mitigation:** Position the system as an on-the-job career booster. Integrate promotional roadmap trackers, leadership skills growth courses, and continuous value logging for annual self-appraisals to keep users engaged even during active employment.

---

## 22. AI Opportunities
*   **Deep Reasoning Capabilities:** Leveraging advanced reasoning models to perform cross-disciplinary career trajectory mappings (e.g., figuring out how an art major can most efficiently transition to an AI prompt engineer).
*   **Proactive Semantic Analysis:** Scanning thousands of live job listings daily to identify rising tech-stack patterns, automatically updating roadmap steps across the global user cohort before bootcamps or universities can adjust.

---

## 23. Ethical AI Considerations
*   **De-biasing Career Pathways:** AI systems must avoid perpetuating historical demographic biases present in corporate hiring records. PathPilot will actively evaluate recommendations to ensure candidate evaluations are based strictly on merit, portfolio quality, and functional skill capability.
*   **Transparency:** Users must always understand *why* they received a specific score or roadmap course. Black-box evaluations are forbidden; every gap assessment must link back to clear criteria parsed from their background compared against verified market listings.

---

## 24. Accessibility Requirements
*   **WCAG 2.2 AA Compliance:** All screens, buttons, and inputs must maintain a minimum contrast ratio of 4.5:1 (7:1 for headings).
*   **Screen Reader Optimization:** All interactive elements must carry semantic ARIA labels, role attributes, and structured alt-text mappings.
*   **Keyboard Focusable Navigation:** Every link, input, and button must be reachable and fully interactive utilizing the `Tab` and `Enter` keys alone, featuring high-contrast focus rings.

---

## 25. Privacy Requirements
*   **GDPR / CCPA Alignment:** Users must have the right to request a complete export of their portfolio history, resume uploads, and chat transcripts, or permanently delete their account data with a single click.
*   **Opt-out of AI Training:** No user-uploaded resumes, custom projects, or chats may be utilized to train baseline public models without explicit, affirmative opt-in consent.

---

## 26. Security Requirements
*   **Strict CORS Policy:** Restrict cross-origin resource requests strictly to verified domains.
*   **Sanitization Pipelines:** All text inputs and resume uploads must go through security scanners to prevent cross-site scripting (XSS), prompt injection, or malware uploading.
*   **Rate Limiting:** Protect core API endpoints (resume parsing, mock interviews, AI chat) with robust IP-based and user-based rate-limiters.

---

## 27. Performance Requirements
*   **Responsive Scaling:** UI layouts must transition smoothly from 320px mobile screens to 3440px ultra-wide monitors.
*   **Hydration speed:** Ensure next-gen server rendering handles core templates to achieve a Time to Interactive (TTI) of under 1.2 seconds.

---

## 28. Product Constraints
*   **Sandbox Runtime Constraints:** As a sandboxed preview web application, we must maintain all operations inside secure container resources, serving solely on Port 3000.
*   **OAuth Callback Constraints:** Redirect URIs must adapt dynamically to the dynamically generated hosting URL at runtime.

---

## 29. Assumptions
*   **Assumption 1:** Job taxonomies are relatively global. A "Senior React Developer" in San Francisco has 85% overlap with a "Senior React Developer" in Tokyo or London.
*   **Assumption 2:** The majority of target early-professionals own a high-speed internet connection capable of supporting real-time streaming AI chats.

---

## 30. Frequently Asked Questions (FAQ)

#### Q: How does PathPilot AI calculate my Readiness Score?
A: PathPilot maps your resume against our curated Career Taxonomy. The score is calculated based on: (1) Skill Coverage (how many of the core required skills you possess), (2) Experience Depth (evidence of applying those skills in projects or jobs), and (3) Document Execution (formatting, clarity, and metrics-oriented phrasing).

#### Q: Is my resume data shared with recruiters automatically?
A: No. PathPilot AI is a completely private career workspace. No recruiter, classmate, or employer can view your profile, roadmap, or resume data without your explicit permission.

#### Q: Can I change my Target Career Goal at any time?
A: Yes! You can change your destination whenever you want. The Career GPS will instantly recalculate your Skill Radar, regenerate your roadmap, and adapt your daily missions to fit the new trajectory.

---
---
---
