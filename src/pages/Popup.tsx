import { MessageSquareText, PenLine, Settings, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ActionButton } from '../components/ActionButton';
import { PageCard } from '../components/PageCard';
import { StatusMessage } from '../components/StatusMessage';
import { SummaryResultCard } from '../components/SummaryResultCard';
import { useCurrentTab } from '../hooks/useCurrentTab';
import { usePageSummary } from '../hooks/usePageSummary';
import { useAskPage } from '../hooks/useAskPage';

const actions = [
  {
    label: 'Summarize',
    icon: Sparkles,
    message: 'Summarize is ready for a future AI integration.'
  },
  {
    label: 'Ask Page',
    icon: MessageSquareText,
    message: 'Ask Page will let you chat with this page soon.'
  },
  {
    label: 'Rewrite Selection',
    icon: PenLine,
    message: 'Rewrite Selection will improve highlighted text in a future release.'
  },
  {
    label: 'Settings',
    icon: Settings,
    message: 'Settings will be available in the next milestone.'
  }
] as const;

export function Popup() {
  const { data, error, isLoading } = useCurrentTab();
  const {
  error: summaryError,
  generateSummary,
  result,
  status
} = usePageSummary(data);
const {
  error: askError,
  ask,
  result: askResult,
  status: askStatus
} = useAskPage(data);
  const [message, setMessage] = useState('Choose an action to continue.');
  const [copied, setCopied] = useState(false);
  const [question, setQuestion] = useState('');
const [showAskPanel, setShowAskPanel] = useState(false);

  return (
    <main className="min-h-[540px] bg-gradient-to-br from-slate-50 via-white to-blue-50 p-5">
      <header className="mb-5">
        <div className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
          Project Orbit
        </div>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950">AI page copilot</h1>
        <p className="mt-1 text-sm text-slate-600">V0.3 summarizes visible page content.</p>
      </header>

      {isLoading && <StatusMessage message="Reading the active tab..." />}
      {error && <StatusMessage message={error} />}
      {data && <PageCard page={data} />}

      <section className="mt-5 grid grid-cols-1 gap-3" aria-label="Project Orbit actions">
        {actions.map((action) => (
          <ActionButton
            key={action.label}
            icon={action.icon}
            label={action.label}
            onClick={() => {
              if (action.label === 'Summarize') {
  setShowAskPanel(false);
  setMessage('Generating a page summary...');
  generateSummary();
  return;
}

if (action.label === 'Ask Page') {
  setShowAskPanel(true);
  setMessage('Ask anything about this page.');
  return;
}

setShowAskPanel(false);
setMessage(action.message);
            }}
          />
        ))}
      </section>

      <div className="mt-5">
        <StatusMessage
          message={
            status === 'loading'
              ? 'Reading visible page content and preparing a summary...'
              : summaryError || message
          }
        />
      </div>
{showAskPanel && (
  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="text-base font-semibold text-slate-900">
      Ask anything about this page
    </h2>

    <textarea
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      placeholder="Example: What are the key points of this article?"
      className="mt-3 w-full rounded-lg border border-slate-300 p-3 text-sm"
      rows={4}
    />

    <button
      className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2 text-white"
      onClick={() => ask(question)}
      disabled={askStatus === 'loading'}
    >
      {askStatus === 'loading' ? 'Thinking...' : 'Ask Gemini'}
    </button>

    {askError && (
      <p className="mt-3 text-sm text-red-600">
        {askError}
      </p>
    )}

    {askResult && (
      <div className="mt-4 rounded-lg bg-slate-100 p-3">
        <h3 className="font-semibold">Answer</h3>
        <p className="mt-2 whitespace-pre-wrap">
          {askResult.answer}
        </p>
      </div>
    )}
  </div>
)}
      {result && (
        <SummaryResultCard
          copied={copied}
          isLoading={status === 'loading'}
          result={result}
          onCopy={() => {
            navigator.clipboard.writeText(formatSummaryForClipboard(result));
            setCopied(true);
          }}
          onRegenerate={() => {
            setCopied(false);
            setMessage('Regenerating the page summary...');
            generateSummary();
          }}
        />
      )}
    </main>
  );
}

function formatSummaryForClipboard(
  result: NonNullable<ReturnType<typeof usePageSummary>['result']>
): string {
  return [
    `Summary:\n${result.summary}`,
    `Key points:\n${result.keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}`,
    `Action items:\n${result.actionItems.map((item) => `- ${item}`).join('\n')}`
  ].join('\n\n');
}
