import type { PageContext } from '../../types/tabs';

export async function extractSelectedText(page: PageContext): Promise<string> {
  if (!page.tabId) {
    throw new Error('No active tab is available for rewriting.');
  }

  const [result] = await chrome.scripting.executeScript({
    target: { tabId: page.tabId },
    func: collectSelectedText,
    args: []
  });

  const selection = typeof result?.result === 'string' ? result.result.trim() : '';

  if (!selection) {
    throw new Error('Highlight some text on the page before using Rewrite Selection.');
  }

  return selection;
}

function collectSelectedText(): string {
  return window.getSelection()?.toString() ?? '';
}
