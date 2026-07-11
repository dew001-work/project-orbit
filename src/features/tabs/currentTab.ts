import type { PageContext } from '../../types/tabs';

const FALLBACK_TITLE = 'No active page detected';
const FALLBACK_URL = 'Open a webpage to begin';

export async function getCurrentTabContext(): Promise<PageContext> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  return {
    tabId: tab?.id,
    title: tab?.title?.trim() || FALLBACK_TITLE,
    url: tab?.url?.trim() || FALLBACK_URL
  };
}
