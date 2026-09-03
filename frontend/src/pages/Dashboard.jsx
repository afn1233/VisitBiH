import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useLinksStore } from '../store/useLinksStore';
import StatsSummary from '../components/StatsSummary';
import LinkForm from '../components/LinkForm';
import LinkList from '../components/LinkList';
import AskBox from '../components/AskBox';
import { CompassIcon, PlusIcon } from '../components/icons';

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
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-slate-50 to-teal-50/60">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-2.5">
            <span className="rounded-lg bg-teal-50 p-1.5 text-teal-600">
              <CompassIcon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">VisitBiH</h1>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-teal-700">
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {isLoading && <p className="text-sm text-slate-400">Loading…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <StatsSummary stats={stats} />

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {showAddForm ? (
            <LinkForm
              submitLabel="Add link"
              titleRequired={false}
              onCancel={() => setShowAddForm(false)}
              onSubmit={async (data) => {
                await addLink(data);
                setShowAddForm(false);
              }}
            />
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              <PlusIcon className="h-4 w-4" />
              Add a link
            </button>
          )}
        </div>

        <AskBox />

        {!isLoading && <LinkList links={links} />}
      </main>
    </div>
  );
}
