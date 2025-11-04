# ModernTongue 

A Manifest V3 Chrome extension that rewrites historical (pre‑20th century) English into contemporary language. It ships without any paid tiers or API keys, relying instead on a free Hugging Face translation model proxied through a tiny Vercel function.

## Features

- **Two entry points** – translate text from the popup UI or via the `✨ Modernise This Text` context menu item when highlighting copy on a page.
- **Free Hugging Face model** – relays requests through `api/translate-free.js`, a serverless endpoint that forwards text to `Helsinki-NLP/opus-mt-en-en`. No billing, tokens, or account setup required.
- **Daily limiter** – keeps a rolling window of 50 translations per browser using `localStorage` (with a `chrome.storage.local` fallback inside the service worker). Users see gentle messaging once the window is exhausted.
- **Responsive popup** – `popup.html`/`popup.js`/`popup.css` provide gradient styling, live status messaging, and quota reminders.
- **Offline resilience** – when the network call fails, a regex-driven fallback still modernises common archaisms so users get partial help.
- **Contextual overlays & PDF viewer** – `content.js`/`content.css` render branded floating panels for translated selections, while PDF highlights open `viewer.html` with the full result.
- **Background workflow** – `background.js` coordinates quota checks, context menu events, popup requests, and networking.
- **Documentation & metadata** – `README.md` (this file) explains deployment, privacy, and manual testing; `package.json` identifies the `moderntongue-free` bundle.

## Project Structure

```
ModernTongueNOAPI/
├── manifest.json               # MV3 manifest with permissions and host access
├── background.js               # Service worker for menu, quota, and network work
├── popup.html / popup.js / popup.css
├── content.js / content.css    # Injected UI for context menu flows on standard pages
├── shared/
│   ├── fallback.js             # Regex-based offline modernisation helper
│   └── quota.js                # Rolling 24-hour quota store (localStorage first)
├── api/translate-free.js       # Vercel serverless proxy to Hugging Face
├── viewer.html / viewer.js / viewer.css
├── README.md
└── package.json
```

## Getting Started

1. **Install dependencies (optional)** – the extension itself has no build step or runtime dependencies. The `api/` function uses the native `fetch` available in Vercel’s Node runtime.
2. **Deploy the proxy** – push this repo to Vercel (or copy `api/translate-free.js` into an existing project). The default export handles CORS and forwards JSON POST bodies to Hugging Face.
3. **Adjust `API_ENDPOINT` (optional)** – if you re-deploy under a different domain, update `API_ENDPOINT` in `background.js` to point at your Vercel deployment.
4. **Load the extension locally**:
   - Open `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the project directory
5. **Test the popup** – open the action popup, paste older English text, and click **✨ Modernise**.
6. **Test the context menu** – highlight text on any web page, right-click, and choose **✨ Modernise This Text**.
7. **Test PDF handling** – open a PDF in Chrome, highlight text, right-click, and confirm a new ModernTongue tab shows the translation.

## Translation Flow

1. Popup or context menu requests are routed to `background.js`.
2. `QuotaStore` enforces a rolling 24-hour window (50 items). The first timestamp outside the window triggers an automatic reset.
3. When under quota, `background.js` posts to the Vercel function which in turn calls the Hugging Face model and returns the translated text.
4. Failures (network, upstream errors) trigger the offline fallback in `shared/fallback.js`. Popup and content panels show clear messaging that the best-effort rewrite was used.
5. Success and status updates are dispatched back to the popup or to the content script overlay.

## Daily Limiter Details

- `shared/quota.js` stores timestamps under the `moderntongue:translation-usage` key.
- Popup and background contexts keep the timeline in sync; localStorage is preferred, with a seamless fallback to `chrome.storage.local` inside the service worker where `localStorage` is unavailable.
- Users see remaining quota and reset estimates (rounded to the nearest hour).
- When the limit is hit, ModernTongue politely blocks additional requests until the trailing timestamp expires.

## Offline Fallback

`shared/fallback.js` modernises common archaisms (`thou → you`, `whilst → while`, suffix replacements for `-eth/-est`, etc.). This heuristic runs when:

- The Vercel proxy can’t be reached (e.g., offline browser)
- The Hugging Face endpoint responds with an error

Both the popup and context panel make it clear when the fallback was used so users know the translation may be less precise, with PDFs surfacing the result in a dedicated tab.

## Privacy & Telemetry

- No third-party credentials, tracking, or analytics.
- Requests only touch the Hugging Face endpoint through your Vercel deployment.
- Usage data (quota timestamps) stay in the browser’s local storage area.

## Manual Test Checklist

- [ ] Popup translation succeeds with online connectivity.
- [ ] Popup shows offline fallback messaging when the proxy URL is unreachable.
- [ ] Context menu overlay appears for highlighted text on standard pages and shows the translated copy.
- [ ] Context menu overlay reports clear messaging when the daily quota is exhausted.
- [ ] Quota counter decreases with each translation and resets 24 hours after the earliest request in the window.
- [ ] No requests succeed beyond the 50-per-day limit.
- [ ] Highlighting text inside Chrome’s PDF viewer opens a new tab with the translation and copy helper.

## Packaging

To ship a new version:

1. Update `version` in `manifest.json` (and optionally `package.json`).
2. Run through the manual checklist above.
3. Zip the extension folder contents (excluding deployment artifacts such as `.vercel` if present).
4. Upload to the Chrome Web Store dashboard.
