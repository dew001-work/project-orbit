import { useRef } from 'react';
import { extractVisiblePageContent, type ExtractedPageContent } from '../features/page/extractPageContent';
import type { PageContext } from '../types/tabs';

export function usePageContent() {
  const cacheRef = useRef<{ key: string; content: ExtractedPageContent } | null>(null);

  async function getContent(page: PageContext): Promise<ExtractedPageContent> {
    const key = `${page.tabId}:${page.url}`;

    if (cacheRef.current?.key === key) {
      return cacheRef.current.content;
    }

    const extracted = await extractVisiblePageContent(page);
    cacheRef.current = { key, content: extracted };
    return extracted;
  }

  return { getContent };
}
