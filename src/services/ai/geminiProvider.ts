import { GoogleGenAI } from '@google/genai';
import type {
  AiProvider,
  SummaryRequest,
  SummaryResult,
  AskPageRequest,
  AskPageResult
} from './types';

export const GEMINI_SUMMARY_MODEL = 'gemini-2.5-flash';

interface GeminiSummaryResponse {
  summary?: string;
  keyPoints?: string[];
  actionItems?: string[];
}

export class GeminiAiProvider implements AiProvider {
  private readonly client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async summarizePage(request: SummaryRequest): Promise<SummaryResult> {
    const response = await this.client.models.generateContent({
      model: GEMINI_SUMMARY_MODEL,
      contents: buildSummaryPrompt(request)
    });

    const parsed = parseGeminiSummary(response.text ?? '');

    return {
      provider: 'gemini',
      model: GEMINI_SUMMARY_MODEL,
      summary:
        parsed.summary || 'Gemini returned an empty summary for this page.',
      keyPoints: normalizeList(
        parsed.keyPoints,
        5,
        'No additional key point was returned.'
      ),
      actionItems: normalizeList(
        parsed.actionItems,
        1,
        'No explicit action items were identified.'
      )
    };
  }

  async askPage(request: AskPageRequest): Promise<AskPageResult> {
    const response = await this.client.models.generateContent({
      model: GEMINI_SUMMARY_MODEL,
      contents: `
You are Project Orbit.

Answer ONLY using the webpage content below.

If the answer cannot be found in the page content, say:
"I couldn't find that information on this page."

Question:
${request.question}

Page Title:
${request.title}

Page URL:
${request.url}

Page Content:
${request.content}
`
    });

    return {
      provider: 'gemini',
      model: GEMINI_SUMMARY_MODEL,
      answer: response.text ?? 'No answer generated.'
    };
  }
}

function buildSummaryPrompt(request: SummaryRequest): string {
  return [
    'You are Project Orbit, a concise browser copilot.',
    'Summarize the visible webpage content for the user.',
    'Return ONLY valid JSON with this exact shape:',
    '{"summary":"string","keyPoints":["point 1","point 2","point 3","point 4","point 5"],"actionItems":["item"]}',
    'Rules:',
    '- The summary must be concise and useful.',
    '- Return exactly 5 keyPoints.',
    '- If there are no action items, return an empty actionItems array.',
    '- Do not include markdown fences or commentary outside JSON.',
    `Title: ${request.title}`,
    `URL: ${request.url}`,
    `Visible content:\n${request.content}`
  ].join('\n\n');
}

function parseGeminiSummary(text: string): GeminiSummaryResponse {
  const jsonText = extractJsonObject(text);

  try {
    const parsed = JSON.parse(jsonText) as GeminiSummaryResponse;
    return {
      summary: typeof parsed.summary === 'string' ? parsed.summary : undefined,
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.filter(isString) : undefined,
      actionItems: Array.isArray(parsed.actionItems)
        ? parsed.actionItems.filter(isString)
        : undefined
    };
  } catch {
    return {
      summary: text.trim(),
      keyPoints: [],
      actionItems: []
    };
  }
}

function extractJsonObject(text: string): string {
  const trimmed = text.trim();
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function normalizeList(
  values: string[] | undefined,
  minimumLength: number,
  fallback: string
): string[] {
  const normalized = (values ?? []).map((value) => value.trim()).filter(Boolean);

  while (normalized.length < minimumLength) {
    normalized.push(fallback);
  }

  return normalized.slice(0, Math.max(minimumLength, normalized.length));
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}
