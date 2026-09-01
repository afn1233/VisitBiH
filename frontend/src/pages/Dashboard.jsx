import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useLinksStore } from '../store/useLinksStore';
import StatsSummary from '../components/StatsSummary';
import LinkForm from '../components/LinkForm';
import LinkList from '../components/LinkList';

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const { links, stats, isLoading, error, fetchAll, addLink, reset } = useLinksStore();
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    reset();
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">VisitBiH</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-900">
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        {isLoading && <p className="text-sm text-slate-400">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <StatsSummary stats={stats} />

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          {showAddForm ? (
            <LinkForm
              submitLabel="Add link"
              onCancel={() => setShowAddForm(false)}
              onSubmit={async (data) => {
                await addLink(data);
                setShowAddForm(false);
              }}
            />
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full rounded-lg border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700"
            >
              + Add a link
            </button>
          )}
        </div>

        {!isLoading && <LinkList links={links} />}
      </main>
    </div>
  );
}
