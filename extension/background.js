// On extension install, create context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scanWithDeepShield",
    title: "🛡️ Scan with DeepShield",
    contexts: ["image"]
  });
});

// On context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scanWithDeepShield" && info.srcUrl) {
    // Store the image URL
    chrome.storage.local.set({ pendingImageUrl: info.srcUrl }, () => {
      // Programmatically open the popup OR open a new tab if popup fails
      if (chrome.action && chrome.action.openPopup) {
        chrome.action.openPopup().catch(() => {
          // Fallback for contexts that don't support openPopup
          chrome.tabs.create({ url: 'popup/popup.html' });
        });
      } else {
        // Fallback for older browsers
        chrome.tabs.create({ url: 'popup/popup.html' });
      }
    });
  }
});
