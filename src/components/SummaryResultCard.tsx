import { Clipboard, RefreshCw } from 'lucide-react';
import type { SummaryResult } from '../services/ai/types';

interface SummaryResultCardProps {
  copied: boolean;
  isLoading: boolean;
  result: SummaryResult;
  onCopy: () => void;
  onRegenerate: () => void;
}

export function SummaryResultCard({
  copied,
  isLoading,
  result,
  onCopy,
  onRegenerate
}: SummaryResultCardProps) {
  return (
    <section className="mt-5 rounded-3xl border border-blue-100 bg-white p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Page summary
          </p>
          {result.notice && (
            <p className="mt-2 text-xs font-medium text-amber-700">{result.notice}</p>
          )}
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {result.model}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">{result.summary}</p>

      <div className="mt-4">
        <h3 className="text-sm font-bold text-slate-950">5 key points</h3>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          {result.keyPoints.map((point, index) => (
            <li key={point} className="flex gap-2">
              <span className="font-bold text-blue-600">{index + 1}.</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-3">
        <h3 className="text-sm font-bold text-slate-950">Action items</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {result.actionItems.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Clipboard aria-hidden="true" size={16} />
          {copied ? 'Copied' : 'Copy Summary'}
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw aria-hidden="true" size={16} />
          Regenerate
        </button>
      </div>
    </section>
  );
}
