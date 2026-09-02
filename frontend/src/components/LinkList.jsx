import LinkCard from './LinkCard';
import { MapPinIcon } from './icons';

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
    <div className="space-y-8">
      {cities.map((city) => (
        <div key={city}>
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
              <MapPinIcon className="h-3.5 w-3.5" />
              {city}
            </span>
            <span className="text-sm text-slate-400">({byCity[city].length})</span>
          </div>
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
