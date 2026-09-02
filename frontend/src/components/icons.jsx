// Small inline SVG icons used for visual polish across the app.
// Kept dependency-free — plain SVG, styled and sized entirely via the
// className passed in (expects a Tailwind size utility like h-4 w-4).

export function CompassIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 6-4-2 2-6 4 2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MapPinIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21c-4.2-4.3-7-8.1-7-11.2a7 7 0 1114 0C19 12.9 16.2 16.7 12 21z" />
      <circle cx="12" cy="9.8" r="2.4" />
    </svg>
  );
}

export function LinkIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8.5" cy="12" r="4.5" />
      <circle cx="15.5" cy="12" r="4.5" />
    </svg>
  );
}

export function CityIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <rect x="9" y="6.5" width="1.6" height="1.6" fill="currentColor" stroke="none" />
      <rect x="13.4" y="6.5" width="1.6" height="1.6" fill="currentColor" stroke="none" />
      <rect x="9" y="10.5" width="1.6" height="1.6" fill="currentColor" stroke="none" />
      <rect x="13.4" y="10.5" width="1.6" height="1.6" fill="currentColor" stroke="none" />
      <rect x="9" y="14.5" width="1.6" height="1.6" fill="currentColor" stroke="none" />
      <rect x="13.4" y="14.5" width="1.6" height="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PencilIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function TrashIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V4h6v3m-8 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13" />
    </svg>
  );
}

export function PlusIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
