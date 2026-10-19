# XNode LifeFlow AI

**HyperBloom October 2026 UI/UX & Web Design Hackathon** — Standalone frontend prototype.

**Live demo:** http://localhost:5173

---

## Design Case Study

### Problem
People juggle tasks, notes, projects and focus time across disconnected tools, creating unnecessary cognitive load. Everyday productivity apps are often cluttered, intimidating and fragmented.

### Target Audience
Students, solo creators, hackathon participants and independent professionals who need a calm, responsive planning space.

### Design Hypothesis
A unified, visually calm interface with clear actions and progressive disclosure can help users plan and complete everyday work.

### Solution
A calm, accessible, responsive personal command center with a clear task workflow, gentle planning suggestions and an intentional focus timer.

### Design Approach
Visual hierarchy, soft lavender/blue palette, spacious cards, clear task states, keyboard focus indicators, reduced-motion support and mobile-first adjustments. Deep indigo sidebar, lavender and cyan gradients, nature-inspired imagery, rounded cards, typography hierarchy and soft surfaces. The XNode mark anchors brand recognition.

### Core User Flows
1. Open the dashboard and review progress at a glance.
2. Add a task, mark it complete and see the updated completion rate with confetti celebration.
3. Create a project or goal and update its progress incrementally.
4. Add an event to the calendar with date validation.
5. Choose a Pomodoro or break preset, toggle ambient sound, and start the focus timer.
6. Capture an idea in Notes with instant persistence.
7. Earn achievement badges as milestones are reached.

### Accessibility Decisions
- Semantic buttons and input labels throughout
- Visible keyboard focus indicators
- Skip-to-content link for screen readers
- Responsive layout down to mobile
- Reduced-motion media query respected
- High-contrast toggle for low-vision users
- Full keyboard navigation (Alt+1-8 for pages, Ctrl+K for search, ? for shortcuts)

### Recommended Judging Demonstration
Show a task being created and completed (with confetti), progress changing, project creation, calendar event creation, focus timer with ambient sound toggle, achievement badges unlocking, and mobile layout. Explain the user problem and why the interface reduces friction.

---

## Standout Features

### UI/UX
- Clean photographic backgrounds (hero, focus studio) without text overlays
- Time-based greeting (Good morning/afternoon/evening)
- Smooth page transitions and micro-interactions
- Card hover effects with lift animation
- Dark mode and high contrast accessibility modes

### Interactive
- Welcome onboarding modal for first-time users
- Keyboard shortcuts (Ctrl+K search, Alt+1-8 navigation, ? for help)
- Task completion confetti celebration
- Streak counter for daily task completion
- Ambient sound modes (Rain, Forest, Cafe) using Web Audio API
- Achievement badges system (6 badges with unlock conditions)
- Focus session counter

### Pages
Overview, My Tasks, Calendar, Goals, Projects, Focus Studio, Insights, Notes

---

## Requirements
Node.js 20.19+ or 22.12+ and npm.

## Quick Start
1. Clone or extract the project.
2. Open a terminal in the `XNode_LifeFlow_AI` folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the localhost URL shown in the terminal (normally http://localhost:5173).

## Build for Hosting
Run `npm run build`. Upload the generated `dist/` directory to Netlify, Vercel, GitHub Pages, or any static host.

---

## Version History

### V3 — Competition Polish
- Distinct responsive layouts for task board, projects, goals, calendar, immersive focus timer, notes and live insights
- View transitions respecting reduced-motion preferences
- Clean image backgrounds replacing gradient-only sections
- Achievement badges and ambient sound system

### V2 — Dedicated Interactive Sections
Left navigation opens distinct screens for Tasks, Calendar, Projects, Goals, Focus Studio, Insights and Notes:
- Tasks: add, filter, complete and delete
- Projects: create, increment progress and remove
- Goals: create, adjust progress and remove
- Calendar: add and remove dated events; navigate months
- Focus Studio: start/pause/reset, Pomodoro and breaks
- Insights: live completion counts based on saved tasks
- Notes: add and remove notes

### V1 — Initial Prototype
Custom vector XNode logo, responsive dashboard, task CRUD with localStorage, 25-minute focus timer, calendar navigation, light/dark mode, high-contrast toggle, rule-based planning suggestions.

---

## Honest Scope
- The planner is rule-based and clearly labelled DEMO — no live AI API or backend.
- Storage is local to the browser via localStorage — not synchronized across devices.
- Charts and some overview examples are illustrative demo data.
- Ambient sounds are generated via Web Audio API — no external audio files.
- These limitations should not be represented as a connected AI or real usage data.

## Tech Stack
- React 19 (functional components, hooks)
- Vite 6 (build tool, HMR)
- Lucide React (icon library)
- CSS custom properties (theming)
- Web Audio API (ambient sound generation)
- localStorage (client-side persistence)
