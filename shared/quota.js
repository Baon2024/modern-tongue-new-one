const NAMESPACE = 'moderntongue:';
export const MAX_TRANSLATIONS_PER_WINDOW = 50;
export const WINDOW_MS = 24 * 60 * 60 * 1000;

class WindowStorageAdapter {
  constructor(prefix) {
    this.prefix = prefix;
  }

  async get(key) {
    return window.localStorage.getItem(this.prefix + key);
  }

  async set(key, value) {
    window.localStorage.setItem(this.prefix + key, value);
  }
}

class ChromeStorageAdapter {
  constructor(prefix) {
    this.prefix = prefix;
  }

  get(key) {
    return new Promise((resolve) => {
      const namespacedKey = this.prefix + key;
      chrome.storage.local.get([namespacedKey], (result) => {
        resolve(result[namespacedKey] ?? null);
      });
    });
  }

  set(key, value) {
    return new Promise((resolve) => {
      const namespacedKey = this.prefix + key;
      chrome.storage.local.set({ [namespacedKey]: value }, () => resolve());
    });
  }
}

class MemoryStorageAdapter {
  constructor(prefix) {
    this.prefix = prefix;
    this.map = new Map();
  }

  async get(key) {
    return this.map.get(this.prefix + key) ?? null;
  }

  async set(key, value) {
    this.map.set(this.prefix + key, value);
  }
}

function createStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const probeKey = `${NAMESPACE}__probe__`;
      window.localStorage.setItem(probeKey, '1');
      window.localStorage.removeItem(probeKey);
      return new WindowStorageAdapter(NAMESPACE);
    }
  } catch (error) {
    // Ignore and fall through to next adapter.
  }

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new ChromeStorageAdapter(NAMESPACE);
  }

  return new MemoryStorageAdapter(NAMESPACE);
}

const storage = createStorage();

function pruneTimeline(timestamps, now = Date.now()) {
  return timestamps.filter((timestamp) => now - timestamp < WINDOW_MS);
}

function parseTimeline(rawValue) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

async function persistTimeline(key, timeline) {
  await storage.set(key, JSON.stringify(timeline));
}

export class QuotaStore {
  constructor(storageKey = 'usage') {
    this.storageKey = storageKey;
  }

  async _load(now = Date.now()) {
    const raw = await storage.get(this.storageKey);
    const timeline = pruneTimeline(parseTimeline(raw), now);
    if (timeline.length === 0 && raw) {
      await persistTimeline(this.storageKey, timeline);
    }
    return timeline;
  }

  async _save(timeline) {
    await persistTimeline(this.storageKey, timeline);
  }

  _computeResetMs(timeline, now = Date.now()) {
    if (!timeline.length) {
      return 0;
    }
    const oldest = timeline[0];
    return Math.max(0, WINDOW_MS - (now - oldest));
  }

  async getStatus(now = Date.now()) {
    const timeline = await this._load(now);
    const remaining = Math.max(0, MAX_TRANSLATIONS_PER_WINDOW - timeline.length);
    const resetMs = this._computeResetMs(timeline, now);
    return {
      remaining,
      used: timeline.length,
      resetMs
    };
  }

  async consume(now = Date.now()) {
    const timeline = await this._load(now);
    if (timeline.length >= MAX_TRANSLATIONS_PER_WINDOW) {
      const resetMs = this._computeResetMs(timeline, now);
      return {
        allowed: false,
        remaining: 0,
        used: timeline.length,
        resetMs
      };
    }

    timeline.push(now);
    timeline.sort((a, b) => a - b);
    await this._save(timeline);
    const resetMs = this._computeResetMs(timeline, now);
    return {
      allowed: true,
      remaining: Math.max(0, MAX_TRANSLATIONS_PER_WINDOW - timeline.length),
      used: timeline.length,
      resetMs
    };
  }
}
