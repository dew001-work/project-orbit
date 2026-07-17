import { BarChart3, MessageSquareText, PenLine, Settings, Sparkles } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { ActionButton } from '../components/ActionButton';
import { PageCard } from '../components/PageCard';
import { StatusMessage } from '../components/StatusMessage';
import { SummaryResultCard } from '../components/SummaryResultCard';
import { useCurrentTab } from '../hooks/useCurrentTab';
import { usePageContent } from '../hooks/usePageContent';
import { usePageSummary } from '../hooks/usePageSummary';
import { useAskPage } from '../hooks/useAskPage';
import { useRewriteSelection } from '../hooks/useRewriteSelection';
import { usePageAnalysis } from '../hooks/usePageAnalysis';
import type { RewriteTone } from '../services/ai/types';

const actions = [
  {
    label: 'Summarize',
    icon: Sparkles,
    message: 'Summarize is ready for a future AI integration.'
  },
  {
    label: 'Ask Page',
    icon: MessageSquareText,
    message: 'Ask anything about this page.'
  },
  {
    label: 'Rewrite Selection',
    icon: PenLine,
    message: 'Rewrite Selection will improve highlighted text in a future release.'
  },
  {
    label: 'Page Analysis',
    icon: BarChart3,
    message: 'Analyzing content type, tone, and quality signals.'
  },
  {
    label: 'Settings',
    icon: Settings,
    message: 'Settings will be available in the next milestone.'
  }
] as const;

export function Popup() {
  const { data, error, isLoading } = useCurrentTab();
  const { getContent } = usePageContent();
  const {
  error: summaryError,
  generateSummary,
  result,
  status
} = usePageSummary(data, getContent);
const {
  error: askError,
  ask,
  result: askResult,
  status: askStatus
} = useAskPage(data, getContent);
const {
  error: rewriteError,
  rewrite,
  result: rewriteResult,
  status: rewriteStatus
} = useRewriteSelection(data);
const {
  error: analysisError,
  generateAnalysis,
  result: analysisResult,
  status: analysisStatus
} = usePageAnalysis(data, getContent);
  const [message, setMessage] = useState('Choose an action to continue.');
  const [copied, setCopied] = useState(false);
  const [question, setQuestion] = useState('');
const [showAskPanel, setShowAskPanel] = useState(false);
const [showRewritePanel, setShowRewritePanel] = useState(false);
const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
const [tone, setTone] = useState<RewriteTone>('professional');

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
  setShowRewritePanel(false);
  setShowAnalysisPanel(false);
  setMessage('Generating a page summary...');
  generateSummary();
  return;
}

if (action.label === 'Ask Page') {
  setShowAskPanel(true);
  setShowRewritePanel(false);
  setShowAnalysisPanel(false);
  setMessage('Ask anything about this page.');
  return;
}

if (action.label === 'Rewrite Selection') {
  setShowAskPanel(false);
  setShowRewritePanel(true);
  setShowAnalysisPanel(false);
  setMessage('Pick a tone and rewrite your selected text.');
  return;
}

if (action.label === 'Page Analysis') {
  setShowAskPanel(false);
  setShowRewritePanel(false);
  setShowAnalysisPanel(true);
  setMessage('Analyzing content type, tone, and quality signals.');
  generateAnalysis();
  return;
}

setShowAskPanel(false);
setShowRewritePanel(false);
setShowAnalysisPanel(false);
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
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
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
{showRewritePanel && (
  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="text-base font-semibold text-slate-900">
      Rewrite selected text
    </h2>
    <p className="mt-1 text-xs text-slate-500">
      Highlight text on the page first, then choose a tone.
    </p>

    <select
      value={tone}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => setTone(e.target.value as RewriteTone)}
      className="mt-3 w-full rounded-lg border border-slate-300 p-2 text-sm"
    >
      <option value="professional">Professional</option>
      <option value="casual">Casual</option>
      <option value="concise">Concise</option>
      <option value="simple">Simple</option>
    </select>

    <button
      className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2 text-white"
      onClick={() => rewrite(tone)}
      disabled={rewriteStatus === 'loading'}
    >
      {rewriteStatus === 'loading' ? 'Rewriting...' : 'Rewrite Selection'}
    </button>

    {rewriteError && (
      <p className="mt-3 text-sm text-red-600">
        {rewriteError}
      </p>
    )}

    {rewriteResult && (
      <div className="mt-4 rounded-lg bg-slate-100 p-3">
        <h3 className="font-semibold">Rewritten</h3>
        <p className="mt-2 whitespace-pre-wrap">
          {rewriteResult.rewritten}
        </p>
        <button
          className="mt-3 text-xs font-semibold text-slate-600 underline"
          onClick={() => navigator.clipboard.writeText(rewriteResult.rewritten)}
        >
          Copy
        </button>
      </div>
    )}
  </div>
)}
{showAnalysisPanel && (
  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="text-base font-semibold text-slate-900">
      Page analysis
    </h2>

    {analysisStatus === 'loading' && (
      <p className="mt-3 text-sm text-slate-500">Analyzing this page...</p>
    )}

    {analysisError && (
      <p className="mt-3 text-sm text-red-600">
        {analysisError}
      </p>
    )}

    {analysisResult && (
      <div className="mt-4 space-y-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Content type</h3>
          <p className="mt-1 text-sm text-slate-900">{analysisResult.contentType}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tone</h3>
          <p className="mt-1 text-sm text-slate-900">{analysisResult.tone}</p>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Key topics</h3>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-900">
            {analysisResult.keyTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quality notes</h3>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-900">
            {analysisResult.qualityNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
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
