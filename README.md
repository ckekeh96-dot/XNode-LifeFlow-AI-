# XNode LifeFlow AI

HyperBloom October UI/UX Hackathon — standalone frontend source.

## Requirements
Node.js 20.19+ or 22.12+ and npm.

## Windows quick start
1. Extract the ZIP.
2. Open PowerShell in the `XNode_LifeFlow_AI` folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the localhost URL shown in the terminal (normally http://localhost:5173).

## Build for hosting
Run `npm run build`. Upload the generated `dist/` directory to Netlify, Vercel, GitHub Pages (with appropriate base configuration), or your own static hosting. No AppDeploy required.

## Included features
- Custom vector XNode logo in `public/logo.svg` used in sidebar, header and favicon.
- Responsive dashboard and mobile navigation.
- Task creation, search, completion, deletion with confirmation and localStorage persistence.
- 25-minute focus timer with start/pause/reset.
- Calendar month navigation, light/dark mode and high-contrast toggle.
- Goal cards, sample project totals and illustrative analytics.
- Rule-based planning suggestions labelled DEMO (no real AI API or backend).

## Notes
Data is stored locally in the current browser only. Goals, project totals and weekly activity are illustrative demo data, not editable or synchronized. The navigation changes the page heading while retaining the dashboard panels. Test the app locally before submission.

## Hackathon concept
**Problem:** Everyday productivity apps are often cluttered, intimidating and fragmented.
**Solution:** A calm, accessible, responsive personal command center with a clear task workflow, gentle planning suggestions and an intentional focus timer.
**Design approach:** Visual hierarchy, soft lavender/blue palette, spacious cards, clear task states, keyboard focus indicators, reduced-motion support and mobile-first adjustments.

## Design upgrade
Includes the user-selected XNode LifeFlow AI logo, scenic photographic design assets derived from the selected concept image, notes with local persistence, an assistant quick-action demo, and Pomodoro/short/long focus presets. The dashboard remains a working frontend prototype; demo features are not live AI.

## Version 2: Dedicated interactive sections
The left navigation now opens distinct screens for Tasks, Calendar, Projects, Goals, Focus Studio, Insights and Notes.
- Tasks: add, filter, complete and delete.
- Projects: create, increment progress and remove.
- Goals: create, adjust progress and remove.
- Calendar: add and remove dated events; navigate months.
- Focus Studio: start/pause/reset, Pomodoro and breaks.
- Insights: live completion counts based on saved tasks.
- Notes: add and remove notes.

These changes use browser localStorage, not a cloud database. They are not synchronized across devices.
Build note: JavaScript/JSX syntax was checked with TypeScript's JSX parser. A full npm build was not completed in this environment because dependency installation timed out.

## V3 design polish
Distinct responsive layouts for the task board, projects, goals, calendar, immersive focus timer, notes and live insights. Added view transitions that respect reduced-motion preferences.

## Testing and limitations
JSX syntax parsing passed. A full `npm install` and `npm run build` could not be completed in the packaging environment due to an npm timeout; please verify locally. No cloud sync, login or live AI backend is included. Some dashboard illustrations and progress examples are demo-only.
