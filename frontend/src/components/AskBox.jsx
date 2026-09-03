import { useState } from 'react';
import { askQuestion } from '../api/ask';

// "Ask about your saved links" - embeds the question, finds the user's own
// semantically relevant saved links, and has Claude answer using only those.
// Local state only, no store - matches LinkForm's single-purpose-form pattern.
export default function AskBox() {
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { answer, sources }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setError(null);
    setIsAsking(true);
    setResult(null);
    try {
      setResult(await askQuestion(question.trim()));
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your saved links…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={isAsking || !question.trim()}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {isAsking ? 'Asking…' : 'Ask'}
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-slate-700">{result.answer}</p>
          {result.sources.length > 0 && (
            <ul className="space-y-1">
              {result.sources.map((link) => (
                <li key={link.id} className="text-xs text-slate-500">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-teal-700 hover:underline"
                  >
                    {link.title || link.url}
                  </a>{' '}
                  — {link.city}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
