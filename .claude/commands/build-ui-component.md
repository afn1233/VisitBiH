---
description: Scaffold a new React component in frontend/src/components and explain how to use it
argument-hint: <ComponentName> <short description of what it does>
---

## Inputs

Parse `$ARGUMENTS`:
- The **first whitespace-separated token** is the component name.
- **Everything after it** is the short description of what the component does.

If either piece is missing, stop and ask the user for the missing one — don't guess a name or description.

Normalize the name to PascalCase for the component/file (e.g. `city-badge` or `city badge` → `CityBadge`). If a component with that name already exists at `frontend/src/components/<Name>.jsx`, stop and tell the user instead of overwriting it.

## What to do

1. **Look at 2-3 existing files in `frontend/src/components/`** (e.g. `LinkCard.jsx`, `LinkForm.jsx`, `icons.jsx`) before writing anything, so the new component matches this codebase's actual conventions rather than generic React boilerplate:
   - Functional component, `export default function <Name>(...) { ... }`.
   - Props destructured directly in the function signature, no PropTypes, no TypeScript.
   - Styling is Tailwind utility classes only — no CSS files, no new libraries. Reuse the existing palette/spacing patterns already in the codebase (`rounded-xl`, `border-slate-200`, `text-slate-*`, the `teal`/`orange`/`amber` accents, `shadow-sm`, etc.) rather than inventing new ones.
   - If the component needs an icon, check `frontend/src/components/icons.jsx` first for an existing one instead of adding a new SVG or icon library.
   - A one-line comment above the component describing its purpose, using the short description passed in — match the comment density already in the file you're modeling this on (see `LinkForm.jsx`'s comment style).

2. **Create `frontend/src/components/<Name>.jsx`** with a minimal, sensible scaffold given the description:
   - Infer reasonable props from the description (e.g. a "badge" component probably takes a `label`/`children` and maybe a `color`/`variant`), but keep it small — this is a starting scaffold, not a finished feature. Don't invent unrelated props.
   - If the description implies it holds or fetches server data, do **not** call `fetch` directly or invent new state management — leave a clear `// TODO` comment pointing at `src/api/*` (for calls) and/or the relevant Zustand store in `store/` (`useAuthStore` / `useLinksStore`) per this project's architecture, and let the caller pass data in as props for now.
   - If the description implies a form, reuse the existing `<Field>` pattern from `LinkForm.jsx` rather than reinventing input styling.
   - Do not wire the component into any page (`Dashboard.jsx`, `Welcome.jsx`, etc.) or modify other files — this command only scaffolds the new file. Wiring it in is a separate, deliberate step.

3. **After creating the file**, output a short usage guide directly in your reply (not just in code comments) covering:
   - The import line: `import <Name> from '../components/<Name>';` (adjust relative path if shown from elsewhere).
   - A minimal usage example with realistic prop values based on the inferred props.
   - Each prop, its expected type/shape, and whether it's required.
   - One sentence on where in the app it'd plausibly slot in (e.g. "next to `LinkCard` inside `LinkList.jsx`"), without actually placing it there.

Keep the whole thing small: one file, no new dependencies, no test files (this repo has none configured), no barrel/index file changes.
