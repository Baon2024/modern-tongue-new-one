# ModernTongue

Chrome extension that translates historical English into modern language using Groq's free Llama 3.1 API.

## What it does

Paste or highlight old English text (think Shakespeare, historical documents) and get a contemporary translation. Works from the popup or right-click context menu. When you're offline or hit the rate limit, a basic regex fallback kicks in.

## Setup

1. Get a free API key from [console.groq.com](https://console.groq.com) (no credit card needed)
2. Deploy `api/translate-free.js` to Vercel
3. Add `GROQ_API_KEY` environment variable in Vercel settings
4. Update `API_ENDPOINT` in `src/background/background.js` with your Vercel URL
5. Load the extension in Chrome (`chrome://extensions` → Developer mode → Load unpacked)

See [docs/GROQ_SETUP.md](docs/GROQ_SETUP.md) for detailed setup instructions.

## Structure

```
├── src/
│   ├── popup/          # Main UI
│   ├── content/        # Overlay for context menu translations
│   ├── background/     # Service worker handling requests
│   └── viewer/         # PDF translation viewer
├── shared/
│   ├── fallback.js     # Offline regex replacements
│   └── quota.js        # 50 translations/day tracker
├── api/
│   └── translate-free.js  # Vercel → Groq API proxy
└── manifest.json
```

## How it works

You get 50 translations per day (rolling 24-hour window). Translations go through your Vercel endpoint to Groq's Llama 3.3 70B model, which is way better at historical English than traditional translation models. If that fails, an enhanced fallback handles 100+ archaic terms, verb conjugations, and common patterns.

All quota data stays in your browser's local storage. No tracking, just your Groq API key.

---

## Publishing to Chrome Web Store

Want to publish this extension? See the comprehensive guides:

- 📋 **[Pre-Deployment Checklist](docs/PRE_DEPLOYMENT_CHECKLIST.md)** - Complete checklist before submission
- 🚀 **[Chrome Web Store Deployment](docs/CHROME_WEB_STORE_DEPLOYMENT.md)** - Step-by-step publishing guide
- 🐛 **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and fixes

**Quick summary:**
1. Add icons (16, 32, 48, 96, 128px) to `icons/` folder
2. Create screenshots and promotional tile (440x280px)
3. Write privacy policy and host it
4. Create ZIP package (exclude api/, docs/)
5. Pay $5 Chrome Web Store developer fee
6. Submit and wait 1-3 days for approval

**Cost:** $5 one-time developer fee + $0 hosting (Vercel + Groq free tiers)
