# ModernTongue

Chrome extension that translates historical English into modern language using Groq's free Llama 3.1 API.


## Why I made it

I do CS and Phil - in case it's not obvious I suck at reading old texts - so I made this to "translate" works alike to Shakespeare, Locke, Hobbes, etc. Pls use it.


## What it does

Paste or highlight old English text (think Shakespeare, historical documents) and get a contemporary translation. Works from the popup or right-click context menu. When you're offline or hit the rate limit, a basic regex fallback kicks in.

See [docs/GROQ_SETUP.md](docs/GROQ_SETUP.md) for detailed setup .


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
e```

## How it works

You get 50 translations per day (rolling 24-hour window). Translations go through your Vercel endpoint to Groq's Llama 3.1 70B model, which is way better at historical English than traditional translation models. If that fails, an enhanced fallback handles 100+ archaic terms, verb conjugations, and common patterns.

All quota data stays in your browser's local storage. No tracking, just your Groq API key.
