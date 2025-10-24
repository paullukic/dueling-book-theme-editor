// Background script for DuelingBook Theme Editor
// Automatically inject content script when user navigates to duelingbook.com

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only inject when the page has finished loading and is on duelingbook.com
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('duelingbook.com')) {
    try {
      // Check if content script is already injected to avoid duplicates
      const existing = await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => !!document.getElementById('duelingbook-theme-editor')
      });

      if (!existing[0].result) {
        // Inject the content script
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['contentScript.js']
        });
        console.log('DuelingBook Theme Editor injected automatically');
      }
    } catch (error) {
      console.error('Failed to inject content script:', error);
    }
  }
});

// Also handle when user switches to an already loaded duelingbook.com tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.url.includes('duelingbook.com')) {
      // Check if content script is already injected
      const existing = await chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        func: () => !!document.getElementById('duelingbook-theme-editor')
      });

      if (!existing[0].result) {
        // Inject the content script
        await chrome.scripting.executeScript({
          target: { tabId: activeInfo.tabId },
          files: ['contentScript.js']
        });
        console.log('DuelingBook Theme Editor injected on tab activation');
      }
    }
  } catch (error) {
    console.error('Failed to inject content script on tab activation:', error);
  }
});

// Handle extension icon click to toggle theme editor
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url && tab.url.includes('duelingbook.com')) {
    try {
      // Ensure content script is injected
      const existing = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => !!document.getElementById('duelingbook-theme-editor')
      });

      if (!existing[0].result) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['contentScript.js']
        });
      }

      // Send toggle message
      chrome.tabs.sendMessage(tab.id, { action: 'toggleThemeEditor' });
    } catch (error) {
      console.error('Failed to toggle theme editor:', error);
    }
  }
});