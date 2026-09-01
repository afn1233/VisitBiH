import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">VisitBiH</h1>
        <p className="mt-1 text-sm text-slate-500">
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
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
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
