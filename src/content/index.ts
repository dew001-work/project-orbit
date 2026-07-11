function reportPageMetadata() {
  chrome.runtime.sendMessage({
    type: 'PROJECT_ORBIT_PAGE_METADATA',
    payload: {
      title: document.title,
      url: window.location.href
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', reportPageMetadata, { once: true });
} else {
  reportPageMetadata();
}
