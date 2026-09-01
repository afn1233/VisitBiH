import { useState } from 'react';
import LinkForm from './LinkForm';
import { useLinksStore } from '../store/useLinksStore';

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
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="min-w-0">
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="break-words font-medium text-slate-900 hover:underline"
        >
          {link.title}
        </a>
        <p className="truncate text-sm text-slate-500">{link.url}</p>
        {link.description && <p className="mt-1 text-sm text-slate-600">{link.description}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <button onClick={() => setIsEditing(true)} className="text-sm text-slate-500 hover:text-slate-900">
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${link.title}"?`)) removeLink(link.id);
          }}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
