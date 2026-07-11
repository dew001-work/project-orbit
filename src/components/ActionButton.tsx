import type { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  key?: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export function ActionButton({ icon: Icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
    >
      <span className="rounded-xl bg-blue-100 p-2 text-blue-700">
        <Icon aria-hidden="true" size={18} />
      </span>
      {label}
    </button>
  );
}
