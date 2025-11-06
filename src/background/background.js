import { QuotaStore, MAX_TRANSLATIONS_PER_WINDOW } from '../../shared/quota.js';
import { modernizeOffline } from '../../shared/fallback.js';

const CONTEXT_MENU_ID = 'modern-tongue-modernize';
const API_ENDPOINT = 'https://moderntongue-pi77xsyu2-sel1nabds-projects.vercel.app/api/translate-free';
const quotaStore = new QuotaStore('translation-usage');
const memoryTranslationViews = new Map();
const VIEW_TTL_MS = 5 * 60 * 1000;

function getSessionStorage() {
  return chrome.storage && chrome.storage.session ? chrome.storage.session : null;
}

function msToHours(ms) {
  if (!ms || ms <= 0) {
    return 0;
  }
  return Math.ceil(ms / (60 * 60 * 1000));
}

function normaliseUrl(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  return input.toLowerCase();
}

function isPdfUrl(url) {
  const lower = normaliseUrl(url);
  if (!lower) {
    return false;
  }
  return lower.includes('.pdf') || (lower.startsWith('chrome-extension://') && lower.includes('/pdf'));
}

function isPdfContext(info, tab) {
  return isPdfUrl(info?.frameUrl) || isPdfUrl(info?.pageUrl) || isPdfUrl(tab?.url);
}

function expireMemoryView(id, ttl = VIEW_TTL_MS) {
  setTimeout(() => {
    memoryTranslationViews.delete(id);
  }, ttl);
}

async function storeTranslationView(payload) {
  const id = crypto.randomUUID();
  const viewPayload = { ...payload, createdAt: Date.now() };
  const sessionStorage = getSessionStorage();
  if (sessionStorage) {
    await sessionStorage.set({ [`moderntongue:view:${id}`]: viewPayload });
  } else {
    memoryTranslationViews.set(id, viewPayload);
    expireMemoryView(id);
  }
  return id;
}

function openTranslationViewer(viewId) {
  const url = `${chrome.runtime.getURL('src/viewer/viewer.html')}?id=${encodeURIComponent(viewId)}`;
  chrome.tabs.create({ url });
}

async function loadTranslationView(viewId, { consume = false } = {}) {
  const key = `moderntongue:view:${viewId}`;
  const sessionStorage = getSessionStorage();
  if (sessionStorage) {
    const result = await sessionStorage.get([key]);
    const view = result[key];
    if (view && consume) {
      await sessionStorage.remove([key]);
    }
    return view || null;
  }
  const view = memoryTranslationViews.get(viewId) ?? null;
  if (consume) {
    memoryTranslationViews.delete(viewId);
  }
  return view;
}

async function performTranslation(text) {
  const original = (text ?? '').trim();
  if (!original) {
    const quota = await quotaStore.getStatus();
    return {
      ok: false,
      reason: 'empty',
      errorMessage: 'Please provide some text to modernise.',
      quota
    };
  }

  const quota = await quotaStore.consume();
  if (!quota.allowed) {
    const resetHours = msToHours(quota.resetMs);
    const waitMessage = resetHours
      ? `Try again in about ${resetHours} hour${resetHours === 1 ? '' : 's'}.`
      : 'Try again soon.';
    return {
      ok: false,
      reason: 'quota',
      errorMessage: `Free plan limit reached (max ${MAX_TRANSLATIONS_PER_WINDOW} per 24 hours). ${waitMessage}`,
      quota
    };
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: original })
    });

    if (!response.ok) {
      throw new Error(`Upstream service responded with status ${response.status}`);
    }

    const payload = await response.json();
    const translated = (payload?.translation ?? '').trim();
    if (!translated) {
      throw new Error('Translation response was empty.');
    }

    return {
      ok: true,
      translation: translated,
      offline: false,
      quota
    };
  } catch (error) {
    const fallback = modernizeOffline(original);
    return {
      ok: true,
      translation: fallback,
      offline: true,
      errorMessage: error.message,
      quota
    };
  }
}

function sendTabMessage(tabId, payload) {
  if (typeof tabId !== 'number') {
    return;
  }

  chrome.tabs.sendMessage(tabId, payload, () => chrome.runtime.lastError);
}

function ensureContextMenu() {
  chrome.contextMenus.removeAll(() => {
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      // Swallow errors (happens if no menus existed yet).
    }
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: '✨ Modernise This Text',
      contexts: ['selection']
    });
  });
}

chrome.runtime.onInstalled.addListener(ensureContextMenu);
if (chrome.runtime.onStartup) {
  chrome.runtime.onStartup.addListener(ensureContextMenu);
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }

  const tabId = tab?.id;
  const selection = info.selectionText ?? '';
  const requestId = crypto.randomUUID();
  const pdfContext = isPdfContext(info, tab);

  if (!selection.trim()) {
    if (pdfContext) {
      const viewId = await storeTranslationView({
        originalText: selection,
        result: {
          ok: false,
          reason: 'empty',
          errorMessage: 'Highlight some text before choosing ModernTongue.'
        }
      });
      openTranslationViewer(viewId);
    } else {
      sendTabMessage(tabId, {
        type: 'MT_RESULT',
        requestId,
        ok: false,
        reason: 'empty',
        originalText: selection,
        errorMessage: 'Highlight some text before choosing ModernTongue.'
      });
    }
    return;
  }

  if (!pdfContext) {
    sendTabMessage(tabId, {
      type: 'MT_STATUS',
      requestId,
      status: 'loading',
      originalText: selection
    });
  }

  const result = await performTranslation(selection);

  if (pdfContext) {
    const viewId = await storeTranslationView({
      originalText: selection,
      result
    });
    openTranslationViewer(viewId);
  } else {
    sendTabMessage(tabId, {
      type: 'MT_RESULT',
      requestId,
      ...result,
      originalText: selection
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== 'object') {
    return;
  }

  if (message.type === 'TRANSLATE_TEXT') {
    performTranslation(message.text).then((result) => {
      sendResponse(result);
    });
    return true;
  }

  if (message.type === 'GET_QUOTA_STATUS') {
    quotaStore.getStatus().then((quota) => {
      sendResponse(quota);
    });
    return true;
  }

  if (message.type === 'GET_TRANSLATION_VIEW') {
    loadTranslationView(message.viewId, { consume: Boolean(message.consume) })
      .then((view) => {
        if (!view) {
          sendResponse({ ok: false, error: 'Translation view expired or missing.' });
          return;
        }
        sendResponse({ ok: true, ...view });
      })
      .catch((error) => {
        sendResponse({ ok: false, error: error.message || 'Failed to read translation view.' });
      });
    return true;
  }
});
