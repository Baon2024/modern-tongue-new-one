# Deploying to Vercel

## Quick Deploy

### 1. Login to Vercel
```bash
vercel login
```

### 2. Link and Deploy
```bash
# From project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No (or Yes if you already have one)
# - Project name? moderntongue (or keep default)
# - Directory? ./  (press enter)
# - Override settings? No
```

### 3. Add Environment Variable
```bash
# Add your Groq API key
vercel env add GROQ_API_KEY

# When prompted:
# - Value: (paste your Groq API key from console.groq.com)
# - Environments: Select all (Production, Preview, Development)
```

### 4. Deploy to Production
```bash
vercel --prod
```

This will give you a URL like: `https://moderntongue-xyz123.vercel.app`

### 5. Update Extension
Update `src/background/background.js` line 5 with your new URL:
```javascript
const API_ENDPOINT = 'https://YOUR-PROJECT.vercel.app/api/translate-free';
```

### 6. Reload Extension
1. Go to `chrome://extensions`
2. Find ModernTongue
3. Click reload icon 🔄

---

## Alternative: Deploy via Dashboard

### 1. Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Framework Preset: **Other**
4. Root Directory: `./`
5. Click **Deploy**

### 2. Add Environment Variable
1. Go to project Settings
2. Environment Variables tab
3. Add new:
   - Key: `GROQ_API_KEY`
   - Value: Your Groq API key
   - Environments: All
4. Redeploy

---

## Verify Deployment

### Test the API endpoint:
```bash
# Replace with your actual Vercel URL
curl -X POST https://YOUR-PROJECT.vercel.app/api/translate-free \
  -H "Content-Type: application/json" \
  -d '{"text":"thou art welcome"}'
```

**Expected response:**
```json
{
  "translation": "you are welcome"
}
```

### If you get 404:
1. Check that `vercel.json` exists in root
2. Check that `api/translate-free.js` exists
3. Redeploy: `vercel --prod`
4. Wait 1-2 minutes for propagation

### If you get "GROQ_API_KEY not configured":
1. Add the environment variable (step 3 above)
2. Redeploy
3. Get your key from [console.groq.com](https://console.groq.com)

---

## Update Workflow

When you make changes:
```bash
git add .
git commit -m "Your changes"
git push

# Vercel will auto-deploy if connected to Git
# Or manually: vercel --prod
```

---

## Checking Deployment Status

```bash
# List all deployments
vercel ls

# Check logs
vercel logs

# Open project in browser
vercel inspect
```

---

## Troubleshooting

### "Project not linked"
```bash
vercel link
```

### "Authentication required"
```bash
vercel logout
vercel login
```

### "Function timeout"
Groq is very fast, but if you're hitting timeouts:
1. Check Groq API status at [status.groq.com](https://status.groq.com)
2. Try the 8B model instead of 70B (faster):
   ```javascript
   const MODEL = 'llama-3.1-8b-instant';
   ```

### Function not found (404)
Make sure your `vercel.json` includes:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ]
}
```
