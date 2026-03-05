// Background service worker for Tambut Running Pets
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ petEnabled: true });
});
