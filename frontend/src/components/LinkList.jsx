import LinkCard from './LinkCard';

export default function LinkList({ links }) {
  if (links.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
        No links saved yet. Add your first tourist spot below.
      </div>
    );
  }

  const byCity = links.reduce((acc, link) => {
    (acc[link.city] ||= []).push(link);
    return acc;
  }, {});
  const cities = Object.keys(byCity).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      {cities.map((city) => (
        <div key={city}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {city} <span className="normal-case text-slate-400">({byCity[city].length})</span>
          </h3>
          <div className="space-y-2">
            {byCity[city].map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
