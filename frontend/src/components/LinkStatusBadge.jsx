// Small pill showing where n8n's reachability/preview check stands for this link.
// Text-only for now (unlike CityBadge, no icon) - keeps this addition simple.
const STATUS = {
  pending: { label: 'Checking…', className: 'bg-slate-50 text-slate-500' },
  reachable: { label: 'Reachable', className: 'bg-emerald-50 text-emerald-700' },
  unreachable: { label: 'Unreachable', className: 'bg-red-50 text-red-600' },
};

export default function LinkStatusBadge({ status }) {
  const config = STATUS[status];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
