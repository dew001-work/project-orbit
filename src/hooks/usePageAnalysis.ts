import { useState } from 'react';
import { analyzePage } from '../services/ai/aiService';
import type { AnalysisResult } from '../services/ai/types';
import type { ExtractedPageContent } from '../features/page/extractPageContent';
import type { PageContext } from '../types/tabs';

type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

interface PageAnalysisState {
  error: string | null;
  result: AnalysisResult | null;
  status: AnalysisStatus;
}

export function usePageAnalysis(
  page: PageContext | null,
  getContent: (page: PageContext) => Promise<ExtractedPageContent>
) {
  const [state, setState] = useState<PageAnalysisState>({
    error: null,
    result: null,
    status: 'idle'
  });

  async function generateAnalysis() {
    if (!page) {
      setState({
        error: 'Open a webpage before requesting an analysis.',
        result: null,
        status: 'error'
      });
      return;
    }

    setState({ error: null, result: state.result, status: 'loading' });

    try {
      const extractedPage = await getContent(page);
      const result = await analyzePage({
        title: extractedPage.title,
        url: extractedPage.url,
        content: extractedPage.content
      });

      setState({ error: null, result, status: 'success' });
    } catch (error) {
      setState({
        error: error instanceof Error ? error.message : 'Unable to analyze this page.',
        result: null,
        status: 'error'
      });
    }
  }

  return {
    ...state,
    generateAnalysis
  };
}
