# Groq API Setup

ModernTongue now uses Groq's free API with Llama 3.1 for significantly better historical English translation.

## Getting Your Free API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (no credit card required)
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

## Adding the Key to Vercel

### Method 1: Vercel Dashboard
1. Go to your project on [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Add new variable:
   - Name: `GROQ_API_KEY`
   - Value: Your API key from Groq
   - Environment: Production, Preview, Development (select all)
4. Save and redeploy

### Method 2: Vercel CLI
```bash
vercel env add GROQ_API_KEY
# Paste your API key when prompted
# Select all environments
```

### Method 3: Local Development
Create `.env` file in project root:
```
GROQ_API_KEY=your_groq_api_key_here
```

## Testing the Setup

After adding the key and redeploying:

1. Load the extension in Chrome
2. Open the popup
3. Paste this test text:
   ```
   Thou art most welcome! Wherefore dost thou come hither?
   'Tis a fine day, methinks.
   ```
4. Click "Modernise"
5. You should get clear modern English back

## Fallback Behavior

If the Groq API fails or the key is missing, the extension automatically falls back to an enhanced regex-based translator that handles:
- 100+ archaic words and phrases
- Verb conjugations (-eth, -est endings)
- Pronouns (thou/thee/thy/thine)
- Contractions ('tis, 'twas, etc.)
- Common word order inversions

## Why Groq?

- **Free**: No cost, no credit card needed
- **Fast**: ~300 tokens/sec (much faster than OpenAI)
- **Accurate**: Llama 3.1 70B understands historical English context
- **Reliable**: 99.9% uptime

## Model Details

- Model: `llama-3.1-70b-versatile`
- Temperature: 0.3 (consistent translations)
- Max tokens: 1000 (handles long passages)
- System prompt: Specialized for historical → modern English

## Troubleshooting

**"GROQ_API_KEY not configured" error:**
- Make sure you added the env variable in Vercel
- Redeploy after adding the key
- Check the variable name is exactly `GROQ_API_KEY`

**Translations seem off:**
- Groq has a generous free tier but does have rate limits
- If you hit limits, the fallback will kick in automatically
- Consider upgrading to Groq's paid tier if needed (very cheap)

**Still using Helsinki-NLP:**
- Make sure you redeployed Vercel after updating the code
- Check `api/translate-free.js` has the Groq implementation
- Clear browser cache and reload extension
