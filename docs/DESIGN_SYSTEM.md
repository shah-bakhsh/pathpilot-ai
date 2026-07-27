# UI/UX Design System & Specification
## Project: PathPilot AI — "Navigate Your Career With AI"
### System Version: 1.0.0
### Creator: Principal UX Designer & Design System Architect
### Date: July 19, 2026

---

## SECTION 1: Brand Identity

### Mission
To turn the complex, unstructured chaos of career growth into an empowering, predictable, and engaging navigation experience.

### Brand Personality
*   **Empathetic yet Objective:** Celebrates small wins and progress, but provides developer-honest feedback about skills and readiness.
*   **Intelligent & Calm:** Uses soft off-whites, warm slates, and clean typography to reduce the intense anxiety associated with career hunting.
*   **Structured & Precise:** Visual elements represent progress, direction, coordinates, and stages—reminiscent of architectural plans, high-fidelity dashboards, and navigation maps.

### Tone & Voice
*   **Tone:** Clear, encouraging, objective, calm, and professional.
*   **Voice:** Speak directly to the user as a trusted, veteran career advisor or co-pilot. Avoid corporate buzzwords and patronizing hyper-enthusiasm.

### Brand Keywords
*   *Co-pilot, Coordinates, Trajectory, Positioning, Compass, Ascent, Horizon, Alignment.*

### Logo Direction
A minimalist, abstract geometric representation of two primary vectors converging towards an upward-pointing compass arrow. One line represents the user's current trajectory; the other represents industry demand. The convergence forms a subtle "P".

### Icon Style
*   **Library:** `lucide-react`
*   **Style:** Clean, medium-weight outlines (1.5px stroke weight), with subtle rounded caps. No heavy, solid fills unless indicating active navigation status.

### Illustration & Graphic Assets
Minimalist, high-contrast SVG vector patterns, utilizing isometric lines, architectural schematics, and soft glowing radial backdrops. Strictly avoid generic cartoon "flat art" style illustrations.

---

## SECTION 2: Color System (WCAG AA Compliant)

This system establishes a premium, high-contrast Light Theme as the core visual canvas, paired with an elegant, immersive Slate Dark Theme for intense workspace and mentor interactions.

### Color Palette (Hex Tokens)

#### 1. Core Palette (Light Theme Default)
*   **Primary (Navigator Blue):** `#0F52BA` — Deep, commanding sapphire. Evokes trust, security, and career momentum.
*   **Secondary (Horizon Teal):** `#008080` — Warm, stable teal for milestones and completed trajectories.
*   **Accent (Ascent Coral):** `#F26A36` — High-visibility coral representing active goals, daily missions, and momentum vectors.
*   **Background (Clean Horizon):** `#F8FAFC` — Crisp, ultra-light slate grey reducing eye strain.
*   **Surface (Card/Pane):** `#FFFFFF` — Pure white with clean, micro-borders.
*   **Border (Gridline):** `#E2E8F0` — Subtle slate grey to form the underlying "map grids".
*   **Hover State:** `#F1F5F9` — 5% tint layer for interactive card and list feedbacks.

#### 2. Dark Theme Palette (Cosmic Workspace)
*   **Primary (Neon Navigator):** `#3B82F6` — Electric, highly luminous blue.
*   **Accent (Pulse Orange):** `#FF6B4A` — Radiant, high-contrast orange.
*   **Background (Deep Slate):** `#0F172A` — Deep Midnight Slate.
*   **Surface (Deep Card):** `#1E293B` — Medium Dark Slate.
*   **Border (Deep Grid):** `#334155` — Steel-grey bounding borders.
*   **Hover (Deep Hover):** `#475569` — Highlight layer.

#### 3. System States (Identical across themes, WCAG AA Verified)
*   **Success (Milestone Unlocked):** `#10B981` — Emerald Green.
*   **Warning (Skill Gap Flag):** `#F59E0B` — Amber Yellow.
*   **Error (Rejection/Gap Alert):** `#EF4444` — Crimson Red.
*   **Info (System Update):** `#0EA5E9` — Cyan Blue.

#### 4. Typography Hierarchy Colors
*   **Text Primary:** `#0F172A` — Ink-deep slate-black.
*   **Text Secondary:** `#475569` — Sophisticated dark slate grey.
*   **Muted Text:** `#64748B` — Soft medium slate grey.

#### 5. Gradient System
*   **The Coordinates Flow:** `linear-gradient(135deg, #0F52BA 0%, #008080 100%)` — Deep sapphire blending into stable teal, utilized for landing hero headers and main navigation cards.
*   **The Active Ascent:** `linear-gradient(135deg, #EF4444 0%, #F26A36 100%)` — Crimson to Coral, used for high-momentum streak displays.

---

## SECTION 3: Typography System

### Typography Strategy
*   **Primary Font (UI Interface):** **Inter** — Incredibly clean, legible, open-aperture sans-serif, maximizing scannability in data-dense grids.
*   **Display Font (Headings/Data):** **Space Grotesk** or **Outfit** — Tech-forward, high-character geometric display font that sets a premium, highly crafted modern vibe.
*   **Data & Code Font (Indicators):** **JetBrains Mono** — Imparts absolute precision, ideal for stats, percentages, readiness metrics, and timestamp coordinates.

### Typographic Scale

| Token Name | Font Family | Size (px) | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-xl` | Display Font | 48px | Bold (700) | 1.1 | Landing Hero Headings, Score Callouts |
| `display-lg` | Display Font | 36px | Bold (700) | 1.2 | Section Headers, Key Screen Titles |
| `heading-md` | Display Font | 24px | SemiBold (600) | 1.3 | Card Titles, Primary Panels |
| `heading-sm` | Display Font | 18px | Medium (500) | 1.4 | Mini Widget Headers, Row Titles |
| `body-lg` | Primary Font | 16px | Regular (400) | 1.6 | Narrative paragraphs, AI Advisor responses |
| `body-md` | Primary Font | 14px | Regular (400) | 1.5 | General UI Labels, Input field text, buttons |
| `caption-mono` | Mono Font | 12px | Medium (500) | 1.4 | Metrics, Progress labels, timestamps |

---

## SECTION 4: Spacing System (The 8pt Grid)

To achieve strict visual alignment, PathPilot AI utilizes a rigid **8-point spacing grid**. All margins, paddings, gap dimensions, and container widths are strict multiples of 8.

### Spacing Tokens
*   `space-xxs:` 4px (micro-adjustments, icon-to-text gap)
*   `space-xs:` 8px (element spacing, button inner padding)
*   `space-sm:` 16px (card inner padding, input field padding, layout column gaps)
*   `space-md:` 24px (standard widget gaps, sidebar-to-main-panel spacing)
*   `space-lg:` 32px (section breaks, modal inner padding)
*   `space-xl:` 48px (large landing page breaks, vertical hero gutters)
*   `space-xxl:` 64px (extreme landing margins)

---

## SECTION 5: Corner Radius System

Corner radii control the tactile aesthetic of the system. We avoid aggressive, overly rounded bubbles, adopting a sophisticated, technical design with clean radii.

*   **Buttons (Mini):** `4px` — Precise, sharp, high-intent.
*   **Buttons (Standard/Default):** `8px` — Standard balanced interaction target.
*   **Inputs:** `8px` — Aligns with standard interaction grids.
*   **Cards:** `12px` — Standard viewport enclosure; feels solid and modern.
*   **Modals & Large Dialogs:** `16px` — Soft architectural overlays.
*   **Tooltips & Badges:** `6px` — Compact, readable tags.

---

## SECTION 6: Shadow System

Shadows represent Z-index elevation, used selectively to convey depth and focus.

*   `shadow-sm:` `0 1px 2px 0 rgba(15, 23, 42, 0.05)` — Subtle anchor for lists and data rows.
*   `shadow-md:` `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)` — Standard elevation for interactive cards.
*   `shadow-lg:` `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.05)` — Dropdowns and popovers.
*   `shadow-floating:` `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)` — Active modals and chat windows.
*   `glass-effect:` Surface colored with a transparency of `rgba(255, 255, 255, 0.75)` with a backdrop blur filter of `blur(12px)` and a subtle `rgba(255, 255, 255, 0.3)` border overlay.

---

## SECTION 7: Interactive Button Specifications

```
Primary:    [  Navigate Path →  ]  <- Navy Fill, Accent Hover Accent
Secondary:  [  Upload Resume    ]  <- Border Only/Soft Grey, High-Intent Highlight
Ghost:      [  Skip             ]  <- Transparent, High-contrast Muted Text
Danger:     [  Delete Profile   ]  <- Crimson Red Fill
```

### 1. Primary Button
*   **State Default:** Primary Navigator Blue background (`#0F52BA`), white text. Height: 44px. Radius: 8px.
*   **State Hover:** Background changes to `#0A3F91` with a brief transition speed of 150ms.
*   **State Active/Pressed:** Background drops to `#083275`.
*   **State Focus:** 2px high-contrast outline (`#0F52BA`) with 2px offset padding.
*   **State Disabled:** Grey backdrop (`#E2E8F0`), text muted (`#94A3B8`).

### 2. Secondary Button
*   **State Default:** Border 1.5px thick of `#E2E8F0`, transparent fill, text primary grey (`#0F172A`).
*   **State Hover:** Border changes to `#0F52BA`, background gets `#F1F5F9`.
*   **State Active:** Background `#E2E8F0`.

### 3. Ghost Button
*   **State Default:** Transparent background, text secondary slate grey (`#475569`).
*   **State Hover:** Soft tint background (`#F1F5F9`), text advances to `#0F172A`.

---

## SECTION 8: Interactive Input Specifications

Every input must render a explicit focus state for absolute visual clarity.

### 1. Text Fields
*   **Height:** 40px, default border `#E2E8F0`, background `#FFFFFF`. Placeholder `#94A3B8` in Regular 14px.
*   **Focus State:** Border transitions to Primary Navigator Blue (`#0F52BA`) and initiates a subtle outer glow shadow ring `0 0 0 3px rgba(15, 82, 186, 0.15)`.

### 2. Drag-and-Drop Resume Upload Container
*   A dotted border 2px thick of `#CBD5E1`. On file hover, border transitions to Solid `#0F52BA`, background transitions to a 5% tint of primary navigator blue with an interactive document upload icon bouncing upwards.

### 3. Checkboxes & Radio Elements
*   Outer bounds 16px. Checked state fills with `#0F52BA` rendering a crisp white check mark or solid inner circle.

---

## SECTION 9: Navigation Architecture

### Sidebar Framework (The Command Center)
The persistent left-sidebar holds a structured grid layout:
*   **Header:** Minimalist logo mark paired with "PathPilot AI" text.
*   **Primary Trajectory List:** Navigation items grouped with Lucide icon markers:
    *   **Dashboard** (`LayoutDashboard`)
    *   **Career GPS Roadmap** (`Compass`)
    *   **AI Coach Chat** (`MessageSquareCode`)
    *   **Interview Lab** (`Award`)
    *   **Opportunity Radar** (`Briefcase`)
*   **Footer Status Zone:** Current user profile card overlay containing active Streak counter (e.g. `🔥 14 Days`) and progress score.

---

## SECTION 10: Card Specifications

Cards are the structural containers of the career dashboard.

```
+-------------------------------------------------------------+
|  [Icon] Phase 1: Establish Tech Stack Foundations          |
|  =========================================================  |
|  - [x] Complete TypeScript Advanced Typing Course           |
|  - [ ] Deploy a full-stack Next.js Application              |
|                                                             |
|  [------------ Progress: 50% ------------]                 |
+-------------------------------------------------------------+
```

### 1. Dashboard Widget Cards
*   White background, Slate Border 1px, shadow-md, 12px border-radius, interior padding 24px.

### 2. AI Insight Card (High-Emphasis Container)
*   Soft, glowing radial gradient backdrop: `linear-gradient(135deg, rgba(15, 82, 186, 0.04) 0%, rgba(0, 128, 128, 0.04) 100%)`.
*   Border: 1px deep sapphire with left border edge thickened to 4px to direct physical reading emphasis.

---

## SECTION 11: Charts & Data Visualization

All charts are optimized for structural readability, avoiding complex multi-color clutter.

### 1. The Skill Radar Chart (The Core Career DNA)
*   **Axes:** 6 key industry skill dimensions.
*   **Polygons:** Double overlapping translucent paths.
    *   **Required Path:** Translucent Slate Grey (`rgba(148, 163, 184, 0.2)`) with dotted bounds.
    *   **Current Path:** Translucent Primary Navigator Blue (`rgba(15, 82, 186, 0.35)`) with solid 2px blue boundary vector lines.
*   **Labels:** Space Grotesk 12px with dynamic tooltips on hover.

### 2. Growth Trajectory Chart (Area Chart)
*   Linear progression axis displaying Readiness Score percentage over a 12-week runway. Primary Navigator Blue area fill with a gradient opacity fading to transparent at the baseline.

---

## SECTION 12: Icon System & Rules

*   **Philosophical Constraint:** Icons must only serve as visual anchors to label content. Never use icons decoratively without context labels.
*   **Scale System:**
    *   *System UI Sidebar/Buttons:* 18px size, 1.5px stroke weight.
    *   *Inline Metric Badges:* 14px size, 1.5px stroke weight.
    *   *Full Feature Landing Cards:* 24px size, 2px stroke weight.

---

## SECTION 13: Motion & Animation System

All motion must use physics-based transitions to feel natural and premium.

### Motion Curvature (CSS Transitions)
*   **Default Timing Curve:** `cubic-bezier(0.16, 1, 0.3, 1)` (Ultra-premium ease-out, fast response with deceleration).
*   **Standard Speed:** `200ms` for hover states and button presses.
*   **Layout Speed:** `350ms` for panel sliding and page transitions.

### Key Micro-Interactions
*   **Dashboard Milestone Completed:** When checked, the task undergoes a subtle scale compression (0.95x), green check-fill transition, and a micro-confetti particle burst.
*   **AI Message Streaming:** Message blocks slide in 12px upwards from bottom bounds as they stream, utilizing a staggered opacity fade.

---

## SECTION 14: Accessibility Specifications

*   **Keyboard Navigation Flow:** Interactive elements are logically indexed (`tabindex`). Focus state is visually explicit using an outer blue halo ring.
*   **Screen Reader Semantics:** Every chart container must possess an `aria-label` describing the active visual coordinates (e.g. `aria-label="Skill Radar Chart, showing highest strength in Frontend Development at 80% and lowest gap in System Architecture at 40%"`).
*   **Reduced Motion:** If a system flag for reduced motion is detected, disable all sliding transitions, converting them to immediate, clean opacity transitions.

---

## SECTION 15: Responsive Design (Breakpoints)

*   `sm` (Mobile): `320px` to `639px` — Grid collapses to single-column; left-sidebar transforms into a slide-out drawer triggered via top hamburger button.
*   `md` (Tablet): `640px` to `1023px` — Sidebar remains compact icon-only rail; main dashboard transitions to structured vertical lists.
*   `lg` (Laptop): `1024px` to `1439px` — Standard expanded multi-panel layouts.
*   `xl` (Ultra-wide): `1440px` and above — Main layout content centers with a maximum width boundary of `1440px` to maintain optimal grid alignment and visual scanning comfort.

---

## SECTION 16: Screen Designs (Structural Outlines)

We design the structural composition of the complete application footprint across 22 specific screens.

---

## SECTION 17: Screen-by-Screen Specifications

### 1. Landing Page
*   **Purpose:** Introduce PathPilot AI, convert visitors to registered users by showing the career GPS concept.
*   **Layout:** Responsive bento-grid structure. Hero section on top, centered display typography, CTA button.
*   **Components:** Feature showcase grids, live interactive interactive mock skill radar, customer testimonial block.
*   **User Actions:** Click "Launch Career Journey", select target career from interactive dropdown to preview roadmap.
*   **AI Feature:** A mini interactive prompt selector on the landing page showing instantly simulated career gap roadmaps.
*   **Empty State:** N/A
*   **Loading State:** Clean page transitions with soft CSS fade-in.
*   **Success State:** Seamless transition to onboarding flow.
*   **Error State:** Direct toast notification on failing auth.

### 2. Features Page
*   **Purpose:** Deep-dive into specific components (Resume diagnostic, Interview simulator, AI Coach).
*   **Layout:** Staggered left-to-right alternating layout blocks with rich typography.
*   **Components:** Visual capability cards with interactive animations.
*   **User Actions:** Click to expand visual mockups, read breakdown of metrics.

### 3. Login Screen
*   **Purpose:** Secure authenticate existing users.
*   **Layout:** Centered structural form or single-side split screen (left: premium branding artwork; right: credentials form).
*   **Components:** Google SSO button, GitHub SSO, email inputs, validation fields.
*   **User Actions:** Input credentials, trigger OAuth redirect.

### 4. Signup Screen
*   **Purpose:** Register and capture initial high-level user status.
*   **Layout:** Step-by-step wizard.
*   **Components:** Progression bar, email validation, single-tap OAuth triggers.

### 5. Main Dashboard
*   **Purpose:** The central command interface, delivering a unified snapshot of the user's career progress.
*   **Layout:** 3-column asymmetric layout (Left: Navigation; Center: Readiness Index & Skill Radar & Milestones; Right: AI Mentor & Daily Missions).
*   **Components:** Metric grids, interactive SVG radar, milestone progress sliders, daily mission checklist, dynamic prompt buttons.
*   **User Actions:** Select active daily missions, toggle dashboard views, expand AI insights.
*   **AI Feature:** Proactive career advisor widget that surfaces context-sensitive tips based on their actual resume upload.
*   **Empty State:** Initial state prompts the user to "Upload Resume to Begin Journey".
*   **Loading State:** SVG skeleton skeletons replacing radar charts and metrics.
*   **Success State:** Up-to-date metrics displaying a checkmark celebration on daily goal completion.

### 6. Resume Upload Screen
*   **Purpose:** Capture user resume for AI-powered career alignment diagnostics.
*   **Layout:** Centered workspace with generous padding.
*   **Components:** Drag-and-drop file upload target zone, file type guidelines, file size indicators.
*   **User Actions:** Drag or upload file, proceed to parsing analysis.

### 7. Career Analysis Interface
*   **Purpose:** Show structural feedback on the uploaded resume.
*   **Layout:** Two-column split-view (Left: Original resume text highlighted; Right: AI line-by-line feedback).
*   **Components:** Highlighted text cards, progress score gauges.

### 8. Career Readiness Dashboard
*   **Purpose:** Deep-dive display of resume score, alignment metrics, and recruiters' checklist simulations.
*   **Layout:** Interactive tabs with charts and grids.
*   **Components:** Score dial, industry demand tracker, formatting scoring widgets.

### 9. Skill Gap Panel
*   **Purpose:** Detailed visualization of the technical and soft skill deficits.
*   **Layout:** Centered active radar chart, with an adjacent horizontal list of identified missing keywords.
*   **Components:** Interactive Skill Radar, skill tier badge tags.

### 10. Interactive Career Roadmap
*   **Purpose:** The step-by-step blueprint guiding the user's career growth journey.
*   **Layout:** Hierarchical vertical timeline grid with progressive disclosures.
*   **Components:** Phase indicator badges, expandable task rows, certified link anchors.
*   **User Actions:** Mark task complete, expand course detail card.

### 11. Daily Mission Board
*   **Purpose:** List today's 3 micro-actions for continuous engagement.
*   **Layout:** Stacked card list, displaying clear time-to-complete labels.
*   **Components:** Streak counter badge, completion check targets.

### 12. AI Mentor Chat (Full View)
*   **Purpose:** Immersive conversational coaching and portfolio strategies.
*   **Layout:** Fixed-height chat console split-pane (Left: Suggested prompt cards; Center: Active chat window; Right: User's Profile Context Panel).
*   **Components:** Streaming message bubbles, typing indicators, shortcut buttons.

### 13. Interview Lab
*   **Purpose:** Technical and behavioral interview simulator.
*   **Layout:** Prominent vertical prompt card showcasing the active question, with a large rich-text answer text area below.
*   **Components:** Question card, timer clock, microphone input toggle button.

### 14. Opportunity Radar
*   **Purpose:** Aggregated repository of matching job, internship, and scholarship listings.
*   **Layout:** Filterable split-view (Left: Opportunity card list; Right: Detailed job post panel with matching diagnostics).
*   **Components:** Opportunity cards with dynamic Match Index badges.

### 15. Scholarship Hub
*   **Purpose:** Targeted sub-portal focusing on academic grants and development fellowships.
*   **Layout:** Responsive grid system.
*   **Components:** Grant detail cards with deadline alerts.

### 16. Jobs Catalog
*   **Purpose:** Direct job placement search and readiness evaluations.
*   **Layout:** Search interface with multi-faceted filtering controls.

### 17. Internships Board
*   **Purpose:** Early professional internships listings.
*   **Layout:** Timeline-mapped list of application windows.

### 18. User Profile
*   **Purpose:** Display user accomplishments, experience ledger, and career XP stats.
*   **Layout:** Clean, central profile document with side stats.

### 19. System Settings
*   **Purpose:** Account configurations, API key setups, and theme toggling.
*   **Layout:** Left tab list with right content panel.

### 20. Notifications Panel
*   **Purpose:** Historical list of roadmap alerts, system updates, and streak notifications.
*   **Layout:** Chronological vertical feed list.

### 21. Help Center
*   **Purpose:** FAQ database, system instructions, and user assistance.
*   **Layout:** Search-focused bento grid.

### 22. 404 Error Page
*   **Purpose:** Delightful recovery experience on dead-ends.
*   **Layout:** Centered typography card displaying: "Looks like you went off-route. Let's recalculate your destination." with a single clear button back to Dashboard.

---

## SECTION 18: Dashboard Interface Arrangement

```
+-----------------------------------------------------------------------------------+
| [Logo] PathPilot AI              [Search]             [🔥 14 Days]  [Profile Icon] |
+-----------------------------------------------------------------------------------+
| (NAVBAR)                                                                          |
|   Dashboard           +------------------------------+ +------------------------+  |
|   Roadmap             | Career Readiness: 84%        | | Daily Missions (3)     |  |
|   AI Coach            | [====== Progress Bar ======] | | [x] Tune Project Title |  |
|   Interview Lab       +------------------------------+ | [ ] Read DB Indexing   |  |
|   Opportunities       |                              | | [ ] Complete Quiz     |  |
|                       |      [ Skill Radar Chart ]   | +------------------------+  |
|                       |                              | | AI Mentor (Sidebar)    |  |
|                       |                              | | "You are 2 tasks away" |  |
|                       |                              | | [ Ask anything... ]    |  |
|                       +------------------------------+ +------------------------+  |
+-----------------------------------------------------------------------------------+
```

### Layout Grid Rules
*   **Sidebar Width:** Fixed 240px.
*   **Main Workspace:** Fluid, margins left and right set to 32px.
*   **Secondary AI Column (Right):** Fixed 360px on screens above 1280px wide. On narrower viewports, collapses into an overlay drawer.

---

## SECTION 19: Gamification & Engagement Mechanics

We treat career development as a high-retention game. We integrate proven structural game design elements directly into the core user journey:

1.  **Career XP (Experience Points):** Users earn XP for executing steps in their roadmap.
    *   *Task Complete:* +10 XP
    *   *Mock Interview Phase Complete:* +50 XP
    *   *Resume Score Boosted:* +100 XP
2.  **Daily Streaks (Consistency Loops):** Completing a daily mission maintains an active streak. Streaks trigger small visual celebrations and unlock unique app design badges.
3.  **Achievement Badges:**
    *   *The Launchpad:* Uploaded first resume.
    *   *Iron Clad:* Maintained a 7-day daily streak.
    *   *Recruiter Ready:* Achieved a > 85% career readiness score.
    *   *Orator:* Completed a mock interview with a communication rating of > 90%.

---

## SECTION 20: Design Principles Spec

### 25 UI Principles
1.  **High Contrast Rule:** Ensure all text passes WCAG AA contrast ratio thresholds of 4.5:1.
2.  **Visual Rhythm:** Apply the 8pt spacing grid strictly to avoid erratic layout density.
3.  **Single Accent Focus:** Never use more than one distinct high-visibility color callout per screen.
4.  **Semantic Hierarchy:** Use text size, weight, and color opacity to establish distinct visual entry points.
5.  **Empty Canvas Discipline:** Avoid clutter. Negative space is a functional asset that guides reading focus.
6.  **Explicit Interactive Hover:** Every button and card must change states on mouse pointer hover.
7.  **Consistent Radii:** Maintain unified corner radius tokens across all dashboard elements.
8.  **Direct Labeling:** Icons must never be left without contextual label pairings.
9.  **Loading Skeleton Skeletons:** Use structurally matching skeletons to maintain card shapes during API queries.
10. **Font Limitation:** Never load more than three distinct fonts to keep load speeds fast and styling clean.
11. **Responsive Card Collapse:** Multi-column dashboard layouts must stack cleanly on mobile viewports.
12. **Readable Text Width:** Limit text paragraph widths to 65 characters to maximize reading endurance.
13. **Active State Indication:** Highlight navigation list targets with solid left-border colors.
14. **Consistent SVG Vector Art:** Keep illustration styles geometric, minimalist, and on-brand.
15. **Consistent Shadow Directions:** Source virtual light from the top (e.g. `0 2px 4px rgba(...)`) to look natural.
16. **No Auto-Playing Carousels:** Let users control visual information paging.
17. **No Modals on Modals:** Prevent layered popover overlays to avoid cognitive fatigue.
18. **Visible Borders in Dark Mode:** Apply fine steel boundaries to cards in dark mode to prevent visual bleeding.
19. **Consistent Form Labels:** Position labels directly above text inputs rather than inside placeholder states.
20. **Actionable Button Wording:** Label CTAs with active, intent-driven verbs (e.g., "Export Resume" over "Submit").
21. **Visual Match Indicators:** Use consistent color tags (green, orange, red) to display match indices.
22. **Interactive Chart Tooltips:** Let users hover over specific data nodes on charts to view exact value metrics.
23. **Compact Muted Typography:** Use Mono typography for technical logs and metric numbers.
24. **Consistent Close Buttons:** Place the "X" close actions consistently in the top-right corner of all overlays.
25. **Grid Alignment Alignment:** Align all card bounds perfectly to the primary layout grid lines.

### 25 UX Principles
1.  **Navigation Autopilot:** Users must always know where they are, where they came from, and what action to take next.
2.  **Instant Gratification:** Give immediate positive visual feedback when a user completes a task.
3.  **No Text Walls:** Break complex guides into scannable lists and concise progressive disclosure panels.
4.  **Save State Persistence:** Auto-save user inputs, chat logs, and profile edits continuously.
5.  **Context Retention:** The AI Mentor must recall the user's resume data without manual prompt repetition.
6.  **Frictionless Onboarding:** Minimize initial questionnaire friction; capture detailed parameters incrementally.
7.  **Transparent Scoring:** Always explain how readiness ratings are calculated; do not use arbitrary evaluations.
8.  **Actionable Feedback Loops:** If a resume is rejected, provide 3 explicit micro-actions to resolve it immediately.
9.  **Single-Thread Navigation:** Consolidate career assets under a single profile instance to prevent page switching.
10. **Humanized AI Conversations:** AI responses must look like premium formatted markdown with clear bullet points.
11. **Context-Sensitive Prompt Shortcuts:** Provide instant, clickable prompts to help users initiate high-value chats.
12. **Safe Sandbox Interactions:** Let users trial mock interviews without fear of permanent profile scoring.
13. **Dynamic Path Adaptation:** Instantly recalculate roadmaps if a user changes their career destination.
14. **Direct Export Controls:** Give users direct export access to their analyzed resumes and chat logs.
15. **Predictive Assistance:** Proactively warn users about rising industry requirements or expired listings.
16. **Optimized Search Filters:** Enable users to filter opportunities by their actual readiness matching scores.
17. **Minimize Alert Noise:** Group system notifications to prevent constant interruption fatigue.
18. **Curated Resource Discovery:** Link directly to high-quality learning materials rather than forcing search.
19. **Visual Achievement Celebrations:** Celebrate milestone unlocks with subtle visual animations.
20. **Direct Feedback Controls:** Make it easy for users to flag incorrect AI outputs or broken links.
21. **Progress Tracking Continuity:** Let users view historic progress charts to recognize ongoing growth.
22. **Accessible Help Resources:** Maintain a persistent, searchable support database in the dashboard sidebar.
23. **Clear Multi-User Division:** Keep user dashboard metrics completely confidential and isolated.
24. **Zero State Recovery:** Design highly helpful 404 pages and clear data retrieval options.
25. **Consistent Interaction Paradigms:** Ensure cards and list elements respond identically to user taps.

### 25 Accessibility Principles
1.  **Contrast Conformance:** All primary interface text must pass a 4.5:1 contrast check.
2.  **Contrast for Display Headings:** Headings must exceed a 3:1 contrast check.
3.  **Keyboard Accessibility:** Make all interactive buttons and inputs focusable using standard `Tab` controls.
4.  **Focus Indicator Contrast:** Ensure the blue active outline ring stands out visibly against dark and light backdrops.
5.  **Semantic Elements:** Use standard native HTML buttons, inputs, and anchors instead of non-semantic div elements.
6.  **ARIA Labels:** Label all icons and graphics with descriptive metadata strings.
7.  **Dynamic Screen Reader Alerts:** Announce live AI mentor stream text updates using appropriate ARIA live regions.
8.  **Scalable Fonts:** Avoid absolute pixel typography sizing in favor of responsive root em scaling.
9.  **Respect System Motion Flags:** Honor standard system preferences by disabling sliding motion when requested.
10. **Touch Target Dimensions:** Ensure all interactive touch elements exceed 44px on mobile viewports.
11. **Consistent Color Clues:** Never convey key data alerts solely through color changes; pair with explicit text labels.
12. **Explicit Focus Order:** Ensure the keyboard focus loop proceeds logically from top-left to bottom-right.
13. **Accessible Form Errors:** Pair invalid form fields with explicit descriptive error text.
14. **Skip to Content Link:** Include a direct bypass link at the top of the grid to skip persistent navigation bars.
15. **Clear Language Metadata:** Ensure the root index includes correct language attributes (`lang="en"`).
16. **Readable Line Spacing:** Maintain a line-height spacing of at least 1.5 in body copy.
17. **Distinct Link Decoration:** Standard inline text hyperlinks must display an underline decoration.
18. **SVG Image Descriptions:** Supply all vector drawings with embedded description and title elements.
19. **Accessible Audio Options:** All speech interactions must provide simultaneous text alternative options.
20. **Form Field Autocomplete:** Support automated browser input filling to reduce manual keyboard burden.
21. **No Quick Timed Outs:** Avoid placing strict, non-negotiable timers on interactive challenges or quizzes.
22. **Keyboard Escapes:** Ensure all modals and chat windows can be safely exited by pressing the `Escape` key.
23. **Visible Chart Captions:** Accompany all graphical trendlines and charts with comprehensive caption summaries.
24. **No Flashing Patterns:** Avoid graphics or animations that flash more than three times per second.
25. **Inclusive Interface Labels:** Use clean, gender-neutral, accessible terminology throughout the system.

---
---
---
