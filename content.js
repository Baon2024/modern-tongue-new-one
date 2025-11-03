const PANEL_ID = 'modern-tongue-panel';
const CLOSE_SELECTOR = '[data-action="close"]';

const state = {
  requestId: null,
  originalText: '',
  translation: '',
  quota: null
};

function escapeHtml(input) {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensurePanel() {
  let container = document.getElementById(PANEL_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = PANEL_ID;
    document.body.appendChild(container);
  }
  return container;
}

function renderMarkup(html) {
  const panel = ensurePanel();
  panel.innerHTML = html;
  panel.classList.add('mt-visible');
}

function renderLoading(originalText) {
  const preview = originalText.slice(0, 120);
  renderMarkup(`
    <div class="mt-panel mt-panel--loading">
      <div class="mt-header">
        <span class="mt-title">ModernTongue</span>
        <button class="mt-button mt-button--icon" data-action="close" aria-label="Close panel">×</button>
      </div>
      <div class="mt-body">
        <p class="mt-status">Modernising your selection…</p>
        <p class="mt-subtle">“${escapeHtml(preview)}${originalText.length > 120 ? '…' : ''}”</p>
      </div>
    </div>
  `);
}

function renderSuccess(payload) {
  const { translation, offline, quota } = payload;
  const remaining = quota?.remaining ?? null;
  const limitNotice = typeof remaining === 'number'
    ? `<p class="mt-subtle">Free translations left today: ${remaining}</p>`
    : '';
  const offlineNotice = offline
    ? '<p class="mt-warning">Network unavailable — provided best-effort modernisation.</p>'
    : '';

  renderMarkup(`
    <div class="mt-panel mt-panel--success">
      <div class="mt-header">
        <span class="mt-title">ModernTongue</span>
        <button class="mt-button mt-button--icon" data-action="close" aria-label="Close panel">×</button>
      </div>
      <div class="mt-body">
        ${offlineNotice}
        <p class="mt-output">${escapeHtml(translation)}</p>
        ${limitNotice}
      </div>
    </div>
  `);
}

function renderError(payload) {
  const { errorMessage, quota, reason } = payload;
  const remaining = quota?.remaining ?? null;
  const resetHours = quota?.resetMs ? Math.ceil(quota.resetMs / (60 * 60 * 1000)) : null;
  const quotaNotice = typeof remaining === 'number'
    ? `<p class="mt-subtle">Free translations left today: ${remaining}</p>`
    : '';
  const resetNotice = resetHours
    ? `<p class="mt-subtle">Limit resets in about ${resetHours} hour${resetHours === 1 ? '' : 's'}.</p>`
    : '';

  renderMarkup(`
    <div class="mt-panel mt-panel--error">
      <div class="mt-header">
        <span class="mt-title">ModernTongue</span>
        <button class="mt-button mt-button--icon" data-action="close" aria-label="Close panel">×</button>
      </div>
      <div class="mt-body">
        <p class="mt-error">${escapeHtml(errorMessage || 'Something went wrong.')}</p>
        ${quotaNotice}
        ${resetNotice}
      </div>
    </div>
  `);
}

function hidePanel() {
  const container = document.getElementById(PANEL_ID);
  if (container) {
    container.classList.remove('mt-visible');
    container.innerHTML = '';
  }
}

function attachEventHandlers() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.matches(CLOSE_SELECTOR)) {
      hidePanel();
    }
  });
}

attachEventHandlers();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== 'object') {
    return;
  }

  if (message.type === 'MT_STATUS') {
    state.requestId = message.requestId;
    state.originalText = message.originalText;
    renderLoading(message.originalText || '');
    sendResponse?.({ ok: true });
  }

  if (message.type === 'MT_RESULT') {
    state.requestId = message.requestId;
    state.originalText = message.originalText || state.originalText;
    state.translation = message.translation || '';
    state.quota = message.quota || null;

    if (message.ok) {
      renderSuccess(message);
    } else {
      renderError(message);
    }
    sendResponse?.({ ok: true });
  }
});
