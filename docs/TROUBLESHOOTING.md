# Troubleshooting "Network unavailable" Error

If you're seeing **"Network unavailable — provided best-effort modernisation"**, the Groq API call is failing and the fallback is kicking in.

## Quick Diagnostics

### Step 1: Check if Vercel is Deployed
```bash
# Make sure you've pushed the new code
git status
git add .
git commit -m "Add Groq integration"
git push

# If connected to Vercel, it should auto-deploy
# Or manually deploy:
vercel --prod
```

### Step 2: Verify Environment Variable
```bash
# Check if GROQ_API_KEY is set in Vercel
vercel env ls

# You should see GROQ_API_KEY listed
# If not, add it:
vercel env add GROQ_API_KEY
```

**Or via Vercel Dashboard:**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Check if `GROQ_API_KEY` exists
5. If not, add it with your key from [console.groq.com](https://console.groq.com)

### Step 3: Test Your API Endpoint Directly

Open your browser console and run:

```javascript
// Replace with YOUR Vercel URL
const API_URL = 'https://moderntongue-pi77xsyu2-sel1nabds-projects.vercel.app/api/translate-free';

fetch(API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'thou art welcome' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Expected responses:**

✅ **Success:**
```json
{
  "translation": "you are welcome"
}
```

❌ **Missing API Key:**
```json
{
  "error": "GROQ_API_KEY not configured. Get one free at https://console.groq.com"
}
```

❌ **Wrong endpoint:**
```json
{
  "error": "Upstream translation service error.",
  "details": "..."
}
```

### Step 4: Check Browser Console

1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Try a translation
4. Look for errors like:
   - `Failed to fetch`
   - `CORS error`
   - `404 Not Found`
   - `500 Internal Server Error`

### Step 5: Check Network Tab

1. Chrome DevTools → Network tab
2. Try a translation
3. Find the request to your Vercel URL
4. Click it and check:
   - **Status Code** (should be 200)
   - **Response** tab (see what error message came back)
   - **Headers** tab (check CORS headers)

---

## Common Issues & Fixes

### Issue 1: "GROQ_API_KEY not configured"
**Cause:** Environment variable not set in Vercel

**Fix:**
```bash
# Get your key from https://console.groq.com
vercel env add GROQ_API_KEY
# Paste your key when prompted
# Select: Production, Preview, Development (all three)
vercel --prod  # Redeploy
```

---

### Issue 2: Still using old Helsinki-NLP code
**Cause:** Code changes not deployed to Vercel

**Fix:**
```bash
# Check your local api/translate-free.js
cat api/translate-free.js | head -5

# Should show:
# const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
# const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

# If not, you need to commit and push:
git add api/translate-free.js
git commit -m "Update to Groq API"
git push
```

---

### Issue 3: CORS Error
**Cause:** Vercel function not allowing extension domain

**Fix:** The code already includes CORS headers, but verify:
```javascript
// In api/translate-free.js, line 6-9 should be:
function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}
```

---

### Issue 4: Groq Rate Limit
**Cause:** Hit Groq's free tier rate limit

**Symptoms:** Worked before, now always falls back

**Fix:**
1. Check [console.groq.com](https://console.groq.com) for usage
2. Groq free tier limits:
   - 30 requests/minute
   - 14,400 requests/day
3. If you need more, upgrade to Groq's paid tier (very cheap)

---

### Issue 5: Wrong Model Name
**Cause:** Groq changed model names

**Fix:** Check current models at [console.groq.com/docs/models](https://console.groq.com/docs/models)

Update `api/translate-free.js` line 4:
```javascript
// Current working models (as of 2025):
const MODEL = 'llama-3.1-70b-versatile';  // Fast & accurate
// or
const MODEL = 'llama-3.1-8b-instant';      // Even faster, slightly less accurate
```

---

## Testing Locally (Optional)

To test the API function locally before deploying:

```bash
# Install Vercel CLI
npm i -g vercel

# Run dev server
vercel dev

# Test at http://localhost:3000/api/translate-free
curl -X POST http://localhost:3000/api/translate-free \
  -H "Content-Type: application/json" \
  -d '{"text":"thou art welcome"}'
```

---

## Still Not Working?

### Check Extension Logs
1. Go to `chrome://extensions`
2. Find ModernTongue
3. Click "service worker" (blue link)
4. Check console for errors

### Verify manifest.json host permissions
```json
"host_permissions": [
  "https://moderntongue-pi77xsyu2-sel1nabds-projects.vercel.app/*"
]
```

Make sure this matches your actual Vercel URL!

### Check if fallback is working
If you see **translated text** even with the "network unavailable" message, that's the enhanced fallback working correctly. This means:
- ✅ Extension is working
- ✅ Fallback is working
- ❌ API call is failing

Focus on fixing the API connection.

---

## Get Help

If you're still stuck:
1. Check browser console errors
2. Check Network tab response
3. Test API directly with curl/fetch
4. Verify Groq API key is valid at [console.groq.com](https://console.groq.com)
5. Check Vercel deployment logs at [vercel.com/dashboard](https://vercel.com/dashboard)
