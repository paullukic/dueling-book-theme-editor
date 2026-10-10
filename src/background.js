// Service worker. Content scripts are declared in the manifest; this routes the
// toolbar icon and keyboard command to the page, records install/update for
// "What's new", and after an update re-attaches the extension to DuelingBook
// tabs that were already open (Chrome does not do that by itself).

const DUELINGBOOK_URL = 'https://www.duelingbook.com/';
const META_KEY = 'dbte:meta';
const DB_PATTERNS = [
  'https://duelingbook.com/*',
  'http://duelingbook.com/*',
  'https://www.duelingbook.com/*',
  'http://www.duelingbook.com/*',
];
const isDuelingBook = (url) => /^https?:\/\/(www\.)?duelingbook\.com\//.test(url || '');

const inject = async (tabId) => {
  await chrome.scripting.executeScript({ target: { tabId }, files: ['bridge.js'], world: 'MAIN' });
  await chrome.scripting.executeScript({ target: { tabId }, files: ['contentScript.js'] });
};

const togglePanel = async (tab) => {
  if (!tab || tab.id == null) return;
  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'toggleThemeEditor' });
    return;
  } catch (e) {
    // No content script answered.
  }
  if (!isDuelingBook(tab.url)) {
    await chrome.tabs.create({ url: DUELINGBOOK_URL });
    return;
  }
  // A DuelingBook tab opened before the extension was installed or updated.
  try {
    await inject(tab.id);
    await new Promise((r) => setTimeout(r, 400));
    await chrome.tabs.sendMessage(tab.id, { action: 'toggleThemeEditor' });
  } catch (e) {
    console.error('[DB Theme Editor] could not open the panel in this tab:', e);
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

  if (reason !== 'install' && reason !== 'update') return;
  try {
    const tabs = await chrome.tabs.query({ url: DB_PATTERNS });
    await Promise.all(tabs.map((t) => inject(t.id).catch(() => {})));
  } catch (e) {
    console.error('[DB Theme Editor] could not attach to open tabs:', e);
  }
});
