import { useState } from 'react';
import { extractSelectedText } from '../features/page/extractSelectedText';
import { rewriteSelection } from '../services/ai/aiService';
import type { RewriteResult, RewriteTone } from '../services/ai/types';
import type { PageContext } from '../types/tabs';

type RewriteStatus = 'idle' | 'loading' | 'success' | 'error';

interface RewriteState {
  error: string | null;
  result: RewriteResult | null;
  status: RewriteStatus;
}

export function useRewriteSelection(page: PageContext | null) {
  const [state, setState] = useState<RewriteState>({
    error: null,
    result: null,
    status: 'idle'
  });

  async function rewrite(tone: RewriteTone) {
    if (!page) {
      setState({
        error: 'Open a webpage before rewriting a selection.',
        result: null,
        status: 'error'
      });
      return;
    }

    setState({ error: null, result: state.result, status: 'loading' });

    try {
      const text = await extractSelectedText(page);
      const result = await rewriteSelection({ text, tone });

      setState({ error: null, result, status: 'success' });
    } catch (error) {
      setState({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to rewrite the selection.',
        result: null,
        status: 'error'
      });
    }
  }

  return {
    ...state,
    rewrite
  };
}
