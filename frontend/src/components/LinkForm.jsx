import { useState } from 'react';

const EMPTY_VALUES = { city: '', title: '', url: '', description: '' };

// Shared by "add a link" and "edit a link" - same fields, same validation,
// just different initial values and an onSubmit that either creates or updates.
export default function LinkForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        city: values.city.trim(),
        title: values.title.trim(),
        url: values.url.trim(),
        description: values.description.trim() ? values.description.trim() : null,
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="City" value={values.city} onChange={handleChange('city')} required />
        <Field label="Title" value={values.title} onChange={handleChange('title')} required />
      </div>
      <Field label="URL" type="url" value={values.url} onChange={handleChange('url')} required />
      <div>
        <label className="block text-sm font-medium text-slate-700">Description (optional)</label>
        <textarea
          value={values.description}
          onChange={handleChange('description')}
          rows={2}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, type = 'text', ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        {...props}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
    </div>
  );
}
