import { GeminiAiProvider } from './geminiProvider';
import type {
  AiProvider,
  SummaryRequest,
  SummaryResult,
  AskPageRequest,
  AskPageResult,
  RewriteRequest,
  RewriteResult,
  AnalysisRequest,
  AnalysisResult
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

export async function rewriteSelection(
  request: RewriteRequest
): Promise<RewriteResult> {
  if (!request.text.trim()) {
    throw new Error('No text was selected to rewrite.');
  }

  return getProvider().rewriteSelection(request);
}

export async function analyzePage(
  request: AnalysisRequest
): Promise<AnalysisResult> {
  if (!request.content.trim()) {
    throw new Error(
      'Project Orbit could not find readable visible content on this page.'
    );
  }

  return getProvider().analyzePage(request);
}

function getProvider(): AiProvider {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(MISSING_API_KEY_MESSAGE);
  }

  return new GeminiAiProvider(apiKey);
}
