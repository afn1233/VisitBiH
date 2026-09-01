export default function StatsSummary({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <StatCard label="Total links" value={stats.total_links} />
      <StatCard label="Cities" value={stats.distinct_cities} />

      <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 sm:col-span-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Per city</p>
        {stats.per_city.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">No links yet</p>
        ) : (
          <ul className="mt-2 max-h-24 space-y-1 overflow-y-auto">
            {stats.per_city.map((c) => (
              <li key={c.city} className="flex justify-between text-sm text-slate-700">
                <span>{c.city}</span>
                <span className="text-slate-400">{c.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
