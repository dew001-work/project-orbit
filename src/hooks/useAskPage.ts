import { useState } from 'react';
import { askPage } from '../services/ai/aiService';
import type { AskPageResult } from '../services/ai/types';
import type { ExtractedPageContent } from '../features/page/extractPageContent';
import type { PageContext } from '../types/tabs';

type AskPageStatus = 'idle' | 'loading' | 'success' | 'error';

interface AskPageState {
  error: string | null;
  result: AskPageResult | null;
  status: AskPageStatus;
}

export function useAskPage(
  page: PageContext | null,
  getContent: (page: PageContext) => Promise<ExtractedPageContent>
) {
  const [state, setState] = useState<AskPageState>({
    error: null,
    result: null,
    status: 'idle'
  });

  async function ask(question: string) {
    if (!page) {
      setState({
        error: 'Open a webpage before asking a question.',
        result: null,
        status: 'error'
      });
      return;
    }

    if (!question.trim()) {
      setState({
        error: 'Please enter a question.',
        result: null,
        status: 'error'
      });
      return;
    }

    setState({
      error: null,
      result: state.result,
      status: 'loading'
    });

    try {
      const extractedPage = await getContent(page);

      const result = await askPage({
        title: extractedPage.title,
        url: extractedPage.url,
        content: extractedPage.content,
        question
      });

      setState({
        error: null,
        result,
        status: 'success'
      });
    } catch (error) {
      setState({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to answer the question.',
        result: null,
        status: 'error'
      });
    }
  }

  return {
    ...state,
    ask
  };
}
