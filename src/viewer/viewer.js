const params = new URLSearchParams(window.location.search);
const viewId = params.get('id');

const statusPanel = document.getElementById('status-panel');
const resultPanel = document.getElementById('result-panel');
const translationEl = document.getElementById('translation-text');
const originalEl = document.getElementById('original-text');
const quotaHintEl = document.getElementById('quota-hint');
const offlineBanner = document.getElementById('offline-banner');
const copyButton = document.getElementById('copy-translation');

let activeTranslation = '';

function setStatus(message, variant = 'loading') {
  statusPanel.textContent = message;
  statusPanel.classList.toggle('viewer__status--loading', variant === 'loading');
  statusPanel.classList.toggle('viewer__status--error', variant === 'error');
  statusPanel.hidden = false;
}

function formatQuota(quota) {
  if (!quota || typeof quota !== 'object') {
    return '';
  }
  const { remaining, used, resetMs } = quota;
  const parts = [];
  if (typeof remaining === 'number') {
    parts.push(`${remaining} free translations remaining today`);
  }
  if (typeof used === 'number') {
    parts.push(`${used} used`);
  }
  if (typeof resetMs === 'number' && resetMs > 0) {
    const resetHours = Math.ceil(resetMs / (60 * 60 * 1000));
    parts.push(`resets in about ${resetHours} hour${resetHours === 1 ? '' : 's'}`);
  }
  return parts.join(' • ');
}

function showResult(payload) {
  statusPanel.hidden = true;
  resultPanel.hidden = false;

  const { originalText = '', result } = payload;
  const { translation = '', offline = false, quota = null, ok, errorMessage } = result ?? {};

  originalEl.textContent = originalText || 'No text captured.';
  offlineBanner.hidden = !offline;

  if (!ok) {
    translationEl.textContent = errorMessage ? `⚠️ ${errorMessage}` : 'Translation could not be completed.';
    copyButton.hidden = true;
    setStatus(errorMessage || 'Translation could not be completed.', 'error');
    return;
  }

  activeTranslation = translation;
  translationEl.textContent = translation || '(No changes suggested.)';
  copyButton.hidden = !translation;

  const quotaMessage = formatQuota(quota);
  quotaHintEl.textContent = quotaMessage;
}

function handleError(message) {
  resultPanel.hidden = true;
  setStatus(message, 'error');
}

function fetchTranslation() {
  if (!viewId) {
    handleError('No translation reference provided.');
    return;
  }

  chrome.runtime.sendMessage(
    {
      type: 'GET_TRANSLATION_VIEW',
      viewId,
      consume: true
    },
    (response) => {
      if (chrome.runtime.lastError) {
        handleError('Unable to reach the ModernTongue background script.');
        return;
      }
      if (!response || !response.ok) {
        handleError(response?.error || 'Translation result is no longer available.');
        return;
      }

      showResult(response);
    }
  );
}

copyButton.addEventListener('click', async () => {
  if (!activeTranslation) {
    return;
  }
  try {
    await navigator.clipboard.writeText(activeTranslation);
    setStatus('Copied modernised text to clipboard.', 'loading');
    setTimeout(() => {
      if (!resultPanel.hidden) {
        statusPanel.hidden = true;
      }
    }, 1500);
  } catch (error) {
    handleError('Unable to copy automatically — press ⌘/Ctrl+C instead.');
  }
});

fetchTranslation();
