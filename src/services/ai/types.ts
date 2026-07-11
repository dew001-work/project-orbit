export interface SummaryRequest {
  title: string;
  url: string;
  content: string;
}

export interface SummaryResult {
  provider: 'gemini';
  model: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  notice?: string;
}

export interface AiProvider {
  summarizePage(request: SummaryRequest): Promise<SummaryResult>;
}
