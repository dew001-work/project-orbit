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

export type RewriteTone = 'professional' | 'casual' | 'concise' | 'simple';

export interface RewriteRequest {
  text: string;
  tone: RewriteTone;
}

export interface RewriteResult {
  provider: 'gemini';
  model: string;
  rewritten: string;
}

export interface AnalysisRequest {
  title: string;
  url: string;
  content: string;
}

export interface AnalysisResult {
  provider: 'gemini';
  model: string;
  contentType: string;
  tone: string;
  keyTopics: string[];
  qualityNotes: string[];
}

export interface AiProvider {
  summarizePage(request: SummaryRequest): Promise<SummaryResult>;
  askPage(request: AskPageRequest): Promise<AskPageResult>;
  rewriteSelection(request: RewriteRequest): Promise<RewriteResult>;
  analyzePage(request: AnalysisRequest): Promise<AnalysisResult>;
}
