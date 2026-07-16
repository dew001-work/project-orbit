import { GeminiAiProvider } from './geminiProvider';
import type {
  AiProvider,
  SummaryRequest,
  SummaryResult,
  AskPageRequest,
  AskPageResult
} from './types';

const MISSING_API_KEY_MESSAGE =
  'Add VITE_GEMINI_API_KEY to your environment and rebuild Project Orbit to enable Gemini summaries.';

export async function summarizePage(
  request: SummaryRequest
): Promise<SummaryResult> {
  if (!request.content.trim()) {
    throw new Error(
      'Project Orbit could not find readable visible content on this page.'
    );
  }

  return getProvider().summarizePage(request);
}

export async function askPage(
  request: AskPageRequest
): Promise<AskPageResult> {
  if (!request.content.trim()) {
    throw new Error(
      'Project Orbit could not find readable visible content on this page.'
    );
  }

  return getProvider().askPage(request);
}

function getProvider(): AiProvider {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(MISSING_API_KEY_MESSAGE);
  }

  return new GeminiAiProvider(apiKey);
}
