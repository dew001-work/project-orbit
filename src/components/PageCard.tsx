import { ExternalLink } from 'lucide-react';
import type { PageContext } from '../types/tabs';

interface PageCardProps {
  page: PageContext;
}

export function PageCard({ page }: PageCardProps) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-panel ring-1 ring-slate-200/80">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Current tab</p>
      <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-slate-950">
        {page.title}
      </h2>
      <div className="mt-3 flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
        <ExternalLink aria-hidden="true" className="mt-0.5 shrink-0" size={14} />
        <span className="break-all">{page.url}</span>
      </div>
    </section>
  );
}
