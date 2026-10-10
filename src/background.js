// Service worker. Content scripts are declared in the manifest, so this only
// routes the toolbar icon and keyboard command to the page, and records
// install/update so the panel can show "What's new".

const DUELINGBOOK_URL = 'https://www.duelingbook.com/';
const META_KEY = 'dbte:meta';

const togglePanel = async (tab) => {
  if (!tab || tab.id == null) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'toggleThemeEditor' });
  } catch (e) {
    // No content script answered: not a DuelingBook tab, or the tab was open
    // before the extension was installed/updated. Take the user to the site.
    await chrome.tabs.create({ url: DUELINGBOOK_URL });
  }
};

chrome.action.onClicked.addListener((tab) => {
  togglePanel(tab);
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command !== 'toggle-panel') return;
  if (tab) {
    togglePanel(tab);
    return;
  }
  const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
  togglePanel(active);
});

chrome.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  try {
    const { [META_KEY]: meta = {} } = await chrome.storage.local.get(META_KEY);
    const next = { ...meta };
    if (reason === 'install') {
      next.installedAt = Date.now();
      next.welcome = true;
    } else if (reason === 'update') {
      if (!next.installedAt) next.installedAt = Date.now();
      if (previousVersion && previousVersion !== chrome.runtime.getManifest().version) {
        next.updatedFrom = previousVersion;
      }
    }
    await chrome.storage.local.set({ [META_KEY]: next });
  } catch (e) {
    console.error('[DB Theme Editor] could not record install info:', e);
  }
});
