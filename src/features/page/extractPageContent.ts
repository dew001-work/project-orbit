import type { PageContext } from '../../types/tabs';

export interface ExtractedPageContent extends PageContext {
  content: string;
}

const MAX_CONTENT_LENGTH = 12000;

export async function extractVisiblePageContent(page: PageContext): Promise<ExtractedPageContent> {
  if (!page.tabId) {
    throw new Error('No active tab is available for summarization.');
  }

  const [result] = await chrome.scripting.executeScript({
    target: { tabId: page.tabId },
    func: collectVisibleText,
    args: [MAX_CONTENT_LENGTH]
  });

  const content = typeof result?.result === 'string' ? result.result.trim() : '';

  if (!content) {
    throw new Error('No readable visible content was found on this page.');
  }

  return {
    ...page,
    content
  };
}

function collectVisibleText(maxLength: number): string {
  const ignoredTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'CANVAS', 'IFRAME']);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      const text = node.textContent?.replace(/\s+/g, ' ').trim() ?? '';

      if (!parent || !text || ignoredTags.has(parent.tagName) || !isElementVisible(parent)) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const chunks: string[] = [];
  let currentLength = 0;
  let node = walker.nextNode();

  while (node && currentLength < maxLength) {
    const text = node.textContent?.replace(/\s+/g, ' ').trim();

    if (text) {
      chunks.push(text);
      currentLength += text.length + 1;
    }

    node = walker.nextNode();
  }

  return chunks.join(' ').slice(0, maxLength);
}

function isElementVisible(element: Element): boolean {
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    Number(style.opacity) > 0 &&
    rect.width > 0 &&
    rect.height > 0
  );
}
