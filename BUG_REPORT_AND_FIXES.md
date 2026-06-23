# TrackMine – Bug Report & Fix Summary

## Overview

Your website had **18 bugs** across backend and frontend. Here is every single bug identified, what it caused, and what was fixed.

---

## BACKEND BUGS

### BUG 1 — `backend/models/Subject.js`: Wrong field name `userId` vs `user`
- **File**: `backend/models/Subject.js`
- **Problem**: Schema defined field as `userId` but ALL controllers (`subjectController.js`) create and query using `user`. This is the **root cause of subjects not saving** — every subject creation would succeed in Mongoose but with a `userId` field that nothing ever queries.
- **Fix**: Renamed field from `userId` to `user` to match controllers and Topic model.

### BUG 2 — `backend/controllers/authController.js`: `me()` reads wrong property
- **File**: `backend/controllers/authController.js`
- **Problem**: `exports.me` used `req.userId` but the auth middleware only set `req.user = decoded`. `req.userId` was always `undefined`, so `User.findById(undefined)` returned null for every `/auth/me` call, breaking session restoration on page load.
- **Fix**: Changed `req.userId` → `req.user.id`.

### BUG 3 — `backend/middleware/auth.js`: Sets `req.user` but controllers expect `req.userId`
- **File**: `backend/middleware/auth.js`
- **Problem**: Middleware set `req.user = decoded` but every controller (`subjectController`, `topicController`, `dashboardController`) used `req.userId`. This was `undefined` in all protected routes, making every authenticated API call fail with wrong user data.
- **Fix**: Now sets **both** `req.user = decoded` AND `req.userId = decoded.id`.

---

## FRONTEND BUGS

### BUG 4 — `src/main.jsx`: Dangling JSX and double BrowserRouter
- **File**: `frontend/src/main.jsx`
- **Problem**: There was a floating `<BrowserRouter><App /></BrowserRouter>` block sitting between imports and the `ReactDOM.createRoot()` call — **not inside any function**, just loose JSX. This is invalid JavaScript and crashes the module entirely. Additionally, `BrowserRouter` was already in `App.jsx`, making a double-router.
- **Fix**: Removed all stray JSX. Only `ReactDOM.createRoot().render()` remains.

### BUG 5 — `src/App.jsx`: Duplicate `Routes`/`Route` import (build crash)
- **File**: `frontend/src/App.jsx`
- **Problem**: `{ Routes, Route }` were imported twice from `react-router-dom` — once with `BrowserRouter, Navigate` and once standalone. Duplicate named imports cause a build error.
- **Fix**: Combined into single import line.

### BUG 6 — `src/context/AuthContext.jsx`: `login()` never called `setUser()` → infinite redirect loop
- **File**: `frontend/src/context/AuthContext.jsx`
- **Problem**: The `login()` function stored the token in `localStorage` but **never called `setUser()`** or `saveSession()`. So after login, `user` in React state remained `null`. `ProtectedRoute` checks `user` and if null, redirects to `/login` — causing an infinite redirect loop (the "loading appears but app doesn't start" bug).
- **Also**: A `console.log("TOKEN:...")` statement was placed **outside any function** at module top-level, executing every render and polluting the module scope.
- **Fix**: `login()` now calls `saveSession()` to persist both token and user state properly.

### BUG 7 — `src/context/AppContext.jsx`: Missing all action functions + never loaded data
- **File**: `frontend/src/context/AppContext.jsx`
- **Problem (5 sub-bugs)**:
  1. `reload()` was never called on mount — subjects and topics were never fetched.
  2. `addSubject`, `addTopic`, `deleteTopic`, `markReviewed` were not defined or exposed — every modal and action button crashed with "is not a function".
  3. `getDueTopics()` and `getTopicsForSubject()` helper functions were missing.
  4. `updateAvatar` used in Sidebar was not exposed.
  5. `user` was not passed through from `AuthContext` — `AppShell` checked `!user` from this context and always got `undefined`, permanently blocking the app with the loading screen.
- **Fix**: Full rewrite — added `useEffect` to call `reload()` on mount, added all CRUD functions, exposed `user` from `AuthContext`, added all helper functions.

### BUG 8 — `src/components/layout/AppShell.jsx`: Permanent loading screen
- **File**: `frontend/src/components/layout/AppShell.jsx`
- **Problem**: Checked `if (loading || !user)` where `user` came from `useApp()`. Since old `AppContext` never exposed `user`, this was always `undefined` → always showed loading screen → **app never rendered**.
- **Fix**: Removed `!user` check (user is handled by `ProtectedRoute`). Only checks `loading` now.

### BUG 9 — `src/components/topics/AddTopicModal.jsx`: Wrong component entirely
- **File**: `frontend/src/components/topics/AddTopicModal.jsx`
- **Problem**: The file for Add Topic Modal was actually a copy of the `AddSubjectModal` component — same function name (`AddSubjectModal`), called `addSubject()` not `addTopic()`, had subject name/description fields instead of topic title/notes, and completely ignored the `subjectId` prop. Adding a topic did nothing useful.
- **Fix**: Rewritten from scratch as a proper `AddTopicModal` with title/notes inputs, calls `addTopic({ subjectId, title, notes })`.

### BUG 10 — `src/pages/Subjects.jsx`: Wrong component exported (SubjectDetail instead of Subjects list)
- **File**: `frontend/src/pages/Subjects.jsx`
- **Problem**: The file named `Subjects.jsx` actually exported `SubjectDetail` function — the detail view for a single subject. There was no subjects list page. Navigating to `/subjects` showed a single subject detail (with bugs) instead of the list of all subjects.
- **Fix**: Replaced with correct `Subjects` page that fetches and renders `SubjectCard` list with an "Add Subject" button.

### BUG 11 — `src/components/layout/Sidebar.jsx`: Logout was `alert()` not real logout
- **File**: `frontend/src/components/layout/Sidebar.jsx`
- **Problem**: The logout button called `alert('Logout')` instead of the actual `logout()` function from `AuthContext`. Users could never log out.
- **Fix**: Imported `useAuth` and wired the logout button to `logout()`.

### BUG 12 — `src/api/axios.js`: Hardcoded baseURL ignores env variable
- **File**: `frontend/src/api/axios.js`
- **Problem**: `baseURL` was hardcoded as a string `"https://trackmine.onrender.com/api"` instead of reading `import.meta.env.VITE_API_URL`. The `.env` file was ignored entirely.
- **Fix**: Changed to `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`.

### BUG 13 — `vite.config.js`: Missing React plugin (JSX won't compile)
- **File**: `frontend/vite.config.js`
- **Problem**: The vite config had no `plugins: [react()]`. Without `@vitejs/plugin-react`, Vite cannot process `.jsx` files — the entire frontend fails to build.
- **Fix**: Added `import react from '@vitejs/plugin-react'` and `plugins: [react()]`.

### BUG 14 — `src/pages/Dashboard.jsx`: "Add Topic" button had no action
- **File**: `frontend/src/pages/Dashboard.jsx`
- **Problem**: The third action button "➕ Add Topic" had no `onClick` — clicking it did nothing.
- **Fix**: Changed to navigate to `/subjects` so users can pick a subject first.

### BUG 15 — `src/pages/SubjectDetail.jsx`: ObjectId comparison fails
- **File**: `frontend/src/pages/SubjectDetail.jsx`
- **Problem**: `subjects.find(s => s._id === id)` — MongoDB `_id` values are objects and `===` object comparison always fails. Subject was always `undefined`, always showing "Subject not found".
- **Fix**: Changed to `String(s._id) === String(id)`.

### BUG 16 — `src/components/layout/AuthBrandPanel.jsx`: Typo in brand name
- **File**: `frontend/src/components/layout/AuthBrandPanel.jsx`
- **Problem**: Brand name displayed as `"Trakemine"` (missing 'c').
- **Fix**: Corrected to `"Trackmine"`. Added fancy italic Playfair Display font for the word **Revision**.

### BUG 17 — `frontend/index.html`: No font loaded for fancy Revision styling
- **File**: `frontend/index.html`
- **Problem**: The "Revision" brand word styling used `font-family: 'Playfair Display'` but the font was never loaded anywhere.
- **Fix**: Added Google Fonts link for `Playfair Display` (italic 700/800) + `Inter`.

### BUG 18 — `src/context/AppContext.jsx`: `getTopicsForSubject` string comparison
- **File**: `frontend/src/context/AppContext.jsx`
- **Problem**: Topics stored subject as `{ _id: ..., name: ... }` where `_id` is an object. Comparing with `===` without `.toString()` would fail.
- **Fix**: Used `String(t.subject?._id) === String(subjectId)` in `getTopicsForSubject`.

---

## FILES CHANGED (Summary)

### Backend (3 files)
| File | Change |
|------|--------|
| `backend/models/Subject.js` | `userId` → `user` field name |
| `backend/controllers/authController.js` | `req.userId` → `req.user.id` in `me()` |
| `backend/middleware/auth.js` | Sets both `req.user` and `req.userId` |

### Frontend (10 files)
| File | Change |
|------|--------|
| `frontend/index.html` | Added Google Fonts for Revision fancy font |
| `frontend/vite.config.js` | Added `react()` plugin (critical!) |
| `frontend/src/main.jsx` | Removed dangling JSX, fixed double router |
| `frontend/src/App.jsx` | Removed duplicate import, fixed router nesting |
| `frontend/src/api/axios.js` | Use `VITE_API_URL` env var |
| `frontend/src/context/AuthContext.jsx` | `login()` now calls `setUser()`, removed stray console.log |
| `frontend/src/context/AppContext.jsx` | Full rewrite – added all actions, user, reload on mount |
| `frontend/src/components/layout/AppShell.jsx` | Removed `!user` gate causing permanent loading |
| `frontend/src/components/layout/Sidebar.jsx` | Real logout, brand name added |
| `frontend/src/components/layout/AuthBrandPanel.jsx` | Fixed typo, added fancy Revision font |
| `frontend/src/components/topics/AddTopicModal.jsx` | Complete rewrite (was a broken copy of AddSubjectModal) |
| `frontend/src/pages/Subjects.jsx` | Complete rewrite (was exporting SubjectDetail, not Subjects list) |
| `frontend/src/pages/SubjectDetail.jsx` | Fixed ObjectId comparison, loading state |
| `frontend/src/pages/Dashboard.jsx` | Fixed user reference, Add Topic button action |

---

## HOW TO RUN (No CMD changes needed)

### Backend
```
cd backend
npm install
node server.js
```

### Frontend  
```
cd frontend
npm install
npm run dev
```

Your `.env` files are already correct. No other setup needed.
