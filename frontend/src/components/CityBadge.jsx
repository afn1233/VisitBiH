import { MapPinIcon } from './icons';

// Small rounded "pill" badge for a city name, with a map-pin icon accent.
export default function CityBadge({ city, count }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
      <MapPinIcon className="h-3.5 w-3.5" />
      {city}
      {typeof count === 'number' && <span className="font-normal text-teal-500">({count})</span>}
    </span>
  );
}
