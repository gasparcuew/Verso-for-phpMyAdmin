importScripts('lib/pdm.js');

const { DEFAULTS, matchSite, toPattern } = PDM;

const SCRIPT_ID = 'pdm-content';
const JS = ['lib/pdm.js', 'content/boot.js', 'content/sql-guard.js', 'content/tables-pro.js'];
const CSS = [
  'css/themes.css',
  'css/base.css',
  'css/modern.css',
  'css/icons.css',
  'css/env.css',
  'css/tables-pro.css',
  'css/compat.css',
];

const getSites = async () => (await chrome.storage.local.get('sites')).sites ?? {};

/** Mantiene UN content script registrado cuyos `matches` son los sitios autorizados. */
async function syncContentScripts() {
  const matches = Object.keys(await getSites()).map(toPattern);
  const registered = await chrome.scripting.getRegisteredContentScripts({ ids: [SCRIPT_ID] });

  if (!matches.length) {
    if (registered.length) await chrome.scripting.unregisterContentScripts({ ids: [SCRIPT_ID] });
    return;
  }

  const definition = { id: SCRIPT_ID, matches, js: JS, css: CSS, runAt: 'document_start' };
  if (registered.length) await chrome.scripting.updateContentScripts([definition]);
  else await chrome.scripting.registerContentScripts([{ ...definition, persistAcrossSessions: true }]);
}

/** Aplica el modo oscuro a las pestañas ya abiertas (el registro solo afecta a cargas nuevas). */
async function injectOpenTabs() {
  for (const key of Object.keys(await getSites())) {
    const tabs = await chrome.tabs.query({ url: toPattern(key) }).catch(() => []);
    for (const { id: tabId } of tabs) {
      try {
        await chrome.scripting.insertCSS({ target: { tabId }, files: CSS });
        await chrome.scripting.executeScript({ target: { tabId }, files: JS });
      } catch {
        /* pestaña sin permiso todavía o página restringida */
      }
    }
  }
}

/** Sincronización en la nube (chrome.storage.sync) si está activada. */
const SYNC_KEYS = ['theme', 'colorMode', 'density', 'fontSize', 'fontMono', 'contrastAA', 'sites', 'savedServers'];
let isSyncing = false;

async function syncFromCloud() {
  try {
    const { syncEnabled } = await chrome.storage.local.get('syncEnabled');
    if (!syncEnabled) return;
    const cloud = await chrome.storage.sync.get(SYNC_KEYS);
    if (Object.keys(cloud).length) {
      isSyncing = true;
      await chrome.storage.local.set(cloud);
      isSyncing = false;
    }
  } catch (err) {
    console.warn('[PMA Dark] Cloud sync failed:', err);
  }
}

async function syncToCloud(changes) {
  try {
    const { syncEnabled } = await chrome.storage.local.get('syncEnabled');
    if (!syncEnabled || isSyncing) return;
    const payload = {};
    for (const key of SYNC_KEYS) {
      if (key in changes) payload[key] = changes[key].newValue;
    }
    if (Object.keys(payload).length) {
      await chrome.storage.sync.set(payload);
    }
  } catch (err) {
    console.warn('[PMA Dark] Cloud upload failed:', err);
  }
}

const safely = (fn) => () => fn().catch((e) => console.warn('[PMA Dark]', e));

chrome.runtime.onInstalled.addListener(
  safely(async () => {
    const { theme } = await chrome.storage.local.get('theme');
    if (!theme) await chrome.storage.local.set({ theme: DEFAULTS.theme });
    await syncFromCloud();
    await syncContentScripts();
  }),
);

chrome.runtime.onStartup.addListener(
  safely(async () => {
    await syncFromCloud();
    await syncContentScripts();
  }),
);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    if (changes.sites) safely(syncContentScripts)();
    safely(() => syncToCloud(changes))();
  } else if (area === 'sync') {
    safely(syncFromCloud)();
  }
});

// El popup puede cerrarse cuando aparece el diálogo de permisos: cerramos el flujo aquí.
chrome.permissions.onAdded.addListener(
  safely(async () => {
    await syncContentScripts();
    await injectOpenTabs();
  }),
);

// Alt+Shift+D: alterna el modo oscuro del sitio de la pestaña activa.
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-dark') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  const sites = await getSites();
  const site = matchSite(sites, tab.url);
  if (!site) return;

  sites[site.key].enabled = !sites[site.key].enabled;
  await chrome.storage.local.set({ sites });
});
