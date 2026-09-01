# VisitBiH — Frontend

React (Vite) + Tailwind CSS + Zustand.

## Project structure

```
frontend/
  src/
    api/          # fetch wrapper (client.js) + one module per resource (auth, links, stats)
    store/        # Zustand stores: useAuthStore (token/user), useLinksStore (links/stats)
    pages/        # Welcome (login) and Dashboard
    components/   # LinkForm (shared by add + edit), LinkCard, LinkList, StatsSummary
    App.jsx       # picks Welcome vs Dashboard based on whether a token is stored
    main.jsx
```

## Setup

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Configure environment:**
   ```
   copy .env.example .env
   ```
   `VITE_API_URL` should point at the running backend (defaults to `http://localhost:8000`).

3. **Run the dev server:**
   ```
   npm run dev
   ```

   The app is now at `http://localhost:5173`.

## Notes

- The auth token and user profile are persisted to `localStorage` (see `useAuthStore.js`), so refreshing the page keeps you logged in.
- All backend calls go through `src/api/` — components never call `fetch` directly.
