import { useState } from 'react';
import { extractVisiblePageContent } from '../features/page/extractPageContent';
import { summarizePage } from '../services/ai/aiService';
import type { SummaryResult } from '../services/ai/types';
import type { PageContext } from '../types/tabs';

type SummaryStatus = 'idle' | 'loading' | 'success' | 'error';

interface PageSummaryState {
  error: string | null;
  result: SummaryResult | null;
  status: SummaryStatus;
}

export function usePageSummary(page: PageContext | null) {
  const [state, setState] = useState<PageSummaryState>({
    error: null,
    result: null,
    status: 'idle'
  });

  async function generateSummary() {
    if (!page) {
      setState({
        error: 'Open a webpage before requesting a summary.',
        result: null,
        status: 'error'
      });
      return;
    }

    setState({ error: null, result: state.result, status: 'loading' });

    try {
      const extractedPage = await extractVisiblePageContent(page);
      const result = await summarizePage({
        title: extractedPage.title,
        url: extractedPage.url,
        content: extractedPage.content
      });

      setState({ error: null, result, status: 'success' });
    } catch (error) {
      setState({
        error: error instanceof Error ? error.message : 'Unable to summarize this page.',
        result: null,
        status: 'error'
      });
    }
  }

  return {
    ...state,
    generateSummary
  };
}
