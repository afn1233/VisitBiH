import { useState } from 'react';
import LinkForm from './LinkForm';
import LinkStatusBadge from './LinkStatusBadge';
import { useLinksStore } from '../store/useLinksStore';
import { PencilIcon, TrashIcon } from './icons';

export default function LinkCard({ link }) {
  const [isEditing, setIsEditing] = useState(false);
  const editLink = useLinksStore((s) => s.editLink);
  const removeLink = useLinksStore((s) => s.removeLink);

  if (isEditing) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <LinkForm
          initialValues={link}
          submitLabel="Save changes"
          onCancel={() => setIsEditing(false)}
          onSubmit={async (data) => {
            await editLink(link.id, data);
            setIsEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
      <div className="flex min-w-0 items-start gap-3">
        {link.preview_image_url && (
          <img
            src={link.preview_image_url}
            alt=""
            className="h-12 w-12 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="break-words font-medium text-slate-900 hover:text-teal-700 hover:underline"
            >
              {link.title || link.url}
            </a>
            <LinkStatusBadge status={link.enrichment_status} />
          </div>
          <p className="truncate text-sm text-slate-500">{link.url}</p>
          {link.description && <p className="mt-1 text-sm text-slate-600">{link.description}</p>}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-teal-700 hover:bg-teal-50"
        >
          <PencilIcon className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${link.title || link.url}"?`)) removeLink(link.id);
          }}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700"
        >
          <TrashIcon className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
