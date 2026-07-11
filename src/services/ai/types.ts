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

export interface AskPageRequest {
  title: string;
  url: string;
  content: string;
  question: string;
}

export interface AskPageResult {
  provider: 'gemini';
  model: string;
  answer: string;
}

export interface AiProvider {
  summarizePage(request: SummaryRequest): Promise<SummaryResult>;
  askPage(request: AskPageRequest): Promise<AskPageResult>;
}
