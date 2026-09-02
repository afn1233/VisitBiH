import { LinkIcon, CityIcon, MapPinIcon } from './icons';

export default function StatsSummary({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <StatCard label="Total links" value={stats.total_links} icon={LinkIcon} accent="teal" />
      <StatCard label="Cities" value={stats.distinct_cities} icon={CityIcon} accent="orange" />

      <div className="col-span-2 rounded-xl border-t-4 border-t-amber-500 border-x border-b border-slate-200 bg-white p-4 shadow-sm sm:col-span-1">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-amber-50 p-1.5 text-amber-600">
            <MapPinIcon className="h-4 w-4" />
          </span>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Per city</p>
        </div>
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

const ACCENTS = {
  teal: { border: 'border-t-teal-600', bg: 'bg-teal-50', text: 'text-teal-600' },
  orange: { border: 'border-t-orange-500', bg: 'bg-orange-50', text: 'text-orange-600' },
};

function StatCard({ label, value, icon: Icon, accent }) {
  const c = ACCENTS[accent];
  return (
    <div className={`rounded-xl border-t-4 ${c.border} border-x border-b border-slate-200 bg-white p-4 shadow-sm`}>
      <div className="flex items-center gap-2">
        <span className={`rounded-lg ${c.bg} p-1.5 ${c.text}`}>
          <Icon className="h-4 w-4" />
        </span>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
