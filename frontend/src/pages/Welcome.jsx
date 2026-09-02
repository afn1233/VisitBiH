import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { CompassIcon } from '../components/icons';

export default function Welcome() {
  const [email, setEmail] = useState('');
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    await login(email.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50/50 via-slate-50 to-teal-50/60 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="rounded-lg bg-teal-50 p-1.5 text-teal-600">
            <CompassIcon className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">VisitBiH</h1>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Save and organize places to visit in Bosnia and Herzegovina.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-teal-600 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in…' : 'Continue'}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          No account yet? Just enter your email — we'll create one for you.
        </p>
      </div>
    </div>
  );
}
