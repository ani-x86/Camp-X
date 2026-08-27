# Memory.md
## CampX — Build Log

This file is the running memory of everything built in this project. **Every time code is written, edited, or a decision is made, append an entry here before ending the task.** Never overwrite or delete previous entries — this is an append-only log so future sessions (and other developers) have full context without re-reading the whole codebase.

Reference docs in this folder: `PRD.md`, `Architecture.md`, `Rules.md`, `Phases.md`, `Design.md`.

---

## Log Format

Each entry follows this template:

```
### [Date] — [Phase] — [Short Task Title]

**What was built:**
- File(s) created/modified, with path
- Short description of what each file does

**Key decisions:**
- Any choice made that isn't obvious from the code (library picked, pattern used, why)

**Libraries/dependencies touched:**
- Name + version, and why (per Rules.md approved list)

**Status:** ✅ Complete / 🚧 In Progress / ⚠️ Blocked

**Notes for next session:**
- Anything the next task should know before continuing
```

---

## Entries

### 2026-08-26 — Phase 1 — Web Auth Pages (Login & Registration)

**What was built:**
- `web/src/index.css` - Created CSS variables from Design.md, reset, typography, and base elements.
- `web/src/services/api.js` - Axios instance stubbed out for `/api/v1/auth/signup` and `login`. Added JWT interceptor.
- `web/src/pages/Login.jsx` - Created Login page, form elements, inline validation, network handling.
- `web/src/pages/Signup.jsx` - Created Registration page (collecting all required PRD fields), form validations.
- `web/src/pages/Auth.css` - Auth layout styling for Login and Signup pages.
- `web/src/App.jsx` - Router configuration with react-router-dom, set up protected placeholder `/` route and `/login`, `/signup`.

**Key decisions:**
- Stubbed the backend auth responses so the UI works without the backend being implemented yet.
- Put auth styles into `Auth.css` specifically to isolate layout logic from global index tokens.
- Renamed React directory to `web` from `my-app` to strictly follow `Architecture.md`.

**Libraries/dependencies touched:**
- `react-router-dom` (v6) - Routing for Web.
- `axios` - API integration.

**Status:** ✅ Complete

**Notes for next session:**
- The backend API (`POST /api/v1/auth/signup`, `POST /api/v1/auth/login`) is not yet implemented. The services/api.js calls these and gracefully handles network errors as if it were stubbed.
- Next phase should focus on the Android frontend for Auth or the backend implementation of Authentication to close out Phase 1.