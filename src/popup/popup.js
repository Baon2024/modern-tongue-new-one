import { modernizeOffline } from '../../shared/fallback.js';

const form = document.getElementById('modernize-form');
const textarea = document.getElementById('source-text');
const submitButton = document.getElementById('modernize-button');
const statusMessage = document.getElementById('status-message');
const quotaUsage = document.getElementById('quota-usage');
const translationPanel = document.getElementById('translation-panel');
const translationOutput = document.getElementById('translation-output');

function setStatus(text, variant = 'neutral') {
  statusMessage.textContent = text;
  statusMessage.classList.toggle('popup__status--loading', variant === 'loading');
  statusMessage.classList.toggle('popup__status--error', variant === 'error');
}

function toggleSubmitting(isSubmitting) {
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? 'Modernising…' : '✨ Modernise';
}

async function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
        return;
      }
      resolve(response);
    });
  });
}

function updateQuotaUI(quota) {
  if (!quota) {
    quotaUsage.textContent = '';
    return;
  }

  const { remaining, used, resetMs } = quota;
  const resetHours = resetMs ? Math.ceil(resetMs / (60 * 60 * 1000)) : 0;
  const resetText = resetHours
    ? `Resets in about ${resetHours} hour${resetHours === 1 ? '' : 's'}.`
    : 'Fresh window available now.';
  quotaUsage.textContent = `${remaining} remaining today (${used} used). ${resetText}`;

  try {
    localStorage.setItem(
      'moderntongue:quota-status',
      JSON.stringify({ remaining, used, resetMs, updatedAt: Date.now() })
    );
  } catch (error) {
    // Ignore storage failures (quota full, etc.).
  }
}

function showTranslation(text) {
  if (!text) {
    hideTranslation();
    return;
  }
  translationOutput.textContent = text;
  translationPanel.hidden = false;
}

function hideTranslation() {
  translationOutput.textContent = '';
  translationPanel.hidden = true;
}

async function runModernization(inputText) {
  const trimmed = inputText.trim();
  if (!trimmed) {
    setStatus('Enter some historical text to modernise.', 'error');
    hideTranslation();
    return;
  }

  toggleSubmitting(true);
  setStatus('Modernising…', 'loading');

  const response = await sendMessage({ type: 'TRANSLATE_TEXT', text: trimmed });

  toggleSubmitting(false);

  if (!response) {
    const fallback = modernizeOffline(trimmed);
    showTranslation(fallback);
    setStatus('Offline fallback used — better results when you reconnect.', 'error');
    return;
  }

  updateQuotaUI(response.quota ?? null);

  if (!response.ok) {
    hideTranslation();
    setStatus(response.errorMessage || 'Something went wrong.', 'error');
    return;
  }

  showTranslation(response.translation || '(No changes suggested.)');

  if (response.offline) {
    setStatus('Network issue detected — showing best-effort modernisation.', 'error');
  } else {
    setStatus('Translation complete.', 'neutral');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  runModernization(textarea.value);
});

function hydrateQuotaFromCache() {
  try {
    const cached = localStorage.getItem('moderntongue:quota-status');
    if (!cached) {
      return;
    }
    const parsed = JSON.parse(cached);
    if (!parsed || typeof parsed !== 'object') {
      return;
    }
    updateQuotaUI(parsed);
  } catch (error) {
    // Ignore invalid cache.
  }
}

async function syncQuotaFromBackground() {
  const quota = await sendMessage({ type: 'GET_QUOTA_STATUS' });
  if (quota) {
    updateQuotaUI(quota);
  }
}

hydrateQuotaFromCache();
syncQuotaFromBackground();

// Legal page link
document.getElementById('legal-link').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: chrome.runtime.getURL('src/legal/legal.html') });
});
