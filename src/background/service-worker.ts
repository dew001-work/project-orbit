chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {
    // Side panel behavior is best-effort and can be unavailable in older Chrome versions.
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (isRuntimeMessage(message, 'PROJECT_ORBIT_PING')) {
    sendResponse({ ok: true, source: 'project-orbit-service-worker' });
  }

  return false;
});

function isRuntimeMessage(message: unknown, type: string): message is { type: string } {
  return (
    typeof message === 'object' && message !== null && 'type' in message && message.type === type
  );
}
