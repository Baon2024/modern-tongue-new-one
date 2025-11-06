# Chrome Web Store Deployment Guide

Complete guide to publishing ModernTongue on the Chrome Web Store.

---

## Pre-Deployment Checklist

### ✅ **1. Technical Requirements**

- [x] Extension works locally without errors
- [ ] All icons generated (16, 32, 48, 96, 128px)
- [x] Groq API key configured in Vercel
- [x] API endpoint tested and working
- [ ] Extension tested in multiple scenarios:
  - [ ] Popup translation
  - [ ] Context menu on regular pages
  - [ ] Context menu on PDFs
  - [ ] Quota system working
  - [ ] Fallback working when offline
- [x] Manifest.json filled out completely
- [ ] No console errors
- [ ] Privacy policy prepared (required if collecting data)

### ✅ **2. Store Assets Required**

**Icons:**
- [ ] 128x128 icon for Web Store listing
- [ ] (Recommended) 512x512 high-res version

**Promotional Images:**
- [ ] Small promotional tile: 440x280px (REQUIRED)
- [ ] Large promotional tile: 920x680px (optional)
- [ ] Marquee promotional tile: 1400x560px (optional)
- [ ] Screenshots: 1280x800px or 640x400px (at least 1, max 5)

**Descriptions:**
- [ ] Short description (132 characters max)
- [ ] Detailed description
- [ ] Category selected
- [ ] Language selected

### ✅ **3. Legal Requirements**

- [ ] Privacy policy (if using external services - YOU NEED THIS)
- [ ] Terms of service (optional but recommended)
- [ ] Developer account ($5 one-time fee)

---

## Step 1: Create Chrome Web Store Developer Account

### **Cost:** $5 USD one-time registration fee

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Accept Developer Agreement
4. Pay $5 registration fee
5. Wait for account verification (usually instant)

---

## Step 2: Prepare Your Extension Package

### **Create Distribution ZIP:**

```bash
# From project root
zip -r moderntongue-v1.0.0.zip \
  manifest.json \
  src/ \
  shared/ \
  api/ \
  icons/ \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*.DS_Store" \
  -x "*docs/*" \
  -x "*scripts/*"
```

**Or use this cleaner method:**

```bash
# Create a clean build directory
mkdir -p build
cp -r src shared icons manifest.json build/

# Zip only the build folder
cd build
zip -r ../moderntongue-v1.0.0.zip .
cd ..
```

**What to include:**
- ✅ manifest.json
- ✅ src/ folder (all extension code)
- ✅ shared/ folder (fallback & quota logic)
- ✅ icons/ folder (all PNG icons)
- ❌ api/ folder (NOT needed - stays on Vercel)
- ❌ docs/ folder
- ❌ node_modules/
- ❌ .git/
- ❌ scripts/

---

## Step 3: Prepare Store Assets

### **Screenshots (REQUIRED - at least 1, max 5)**

Capture screenshots showing:
1. **Popup interface** with example translation
2. **Context menu** in action on a webpage
3. **Before/After comparison** of historical → modern text
4. **PDF translation** viewer
5. **Settings/quota display**

**Size:** 1280x800px or 640x400px
**Format:** PNG or JPEG
**Tips:**
- Use Chrome DevTools to capture clean screenshots
- Add subtle borders/shadows for polish
- Show actual use cases (Shakespeare, historical docs, etc.)

### **Promotional Tile (REQUIRED)**

**Small Tile: 440x280px**

Create in Figma/Canva/Photoshop:
```
Background: Purple gradient (#667eea → #764ba2)
Left: 128x128 icon
Right:
  - "ModernTongue" (large, white, bold)
  - "Translate Historical English" (smaller, white)
  - "Shakespeare • Documents • Literature" (tiny, white, 70% opacity)
```

**Quick Canva Template:**
1. Go to Canva.com
2. Custom size: 440x280px
3. Add gradient background
4. Upload and place your icon
5. Add text layers
6. Download as PNG

---

## Step 4: Write Store Listing Content

### **Short Description (132 characters max)**

```
Instantly translate historical English to modern language. Works on Shakespeare, old documents, and literature with AI precision.
```

### **Detailed Description**

```markdown
# ModernTongue - Historical English Translator

Transform archaic English into clear, contemporary language instantly.

## Features

✨ **Instant Translation**
Translate text from the popup or right-click on any webpage to modernize historical English instantly.

📜 **Handles Complex Text**
Works perfectly with Shakespeare, King James Bible, colonial documents, and any pre-20th century English.

🚀 **Powered by AI**
Uses advanced language models (Llama 3.3) for accurate, context-aware translations that preserve meaning and tone.

💡 **Smart Fallback**
When offline, an intelligent fallback system handles 100+ common archaic patterns.

📊 **Fair Usage**
Free tier includes 50 translations per day with automatic reset every 24 hours.

🔒 **Privacy Focused**
No tracking, no analytics, no data collection. All quota tracking stays in your browser.

## How to Use

1. **Popup Method:** Click the extension icon, paste historical text, click "Modernise"
2. **Context Menu:** Highlight any old English text, right-click → "Modernise This Text"
3. **PDF Support:** Works seamlessly with PDFs in Chrome's built-in viewer

## Examples

"Wherefore art thou Romeo?" → "Why are you Romeo?"
"Thou shalt not..." → "You shall not..."
"'Tis a fine day, methinks" → "It's a nice day, I think"

## Perfect For

- Students studying classic literature
- Researchers reading historical documents
- Anyone enjoying Shakespeare or old texts
- Legal professionals reviewing historical contracts

## Setup

ModernTongue works immediately after installation. No sign-up, no API keys, completely free.

---

**Privacy:** This extension makes requests to a secure API for translation. No personal data is stored or tracked. See our privacy policy for details.
```

### **Category**

Choose: **Productivity** or **Fun**

### **Language**

Primary: **English**

---

## Step 5: Create Privacy Policy (REQUIRED)

You need a privacy policy because your extension:
1. Uses an external API (Groq via Vercel)
2. Stores data locally (quota tracking)

Create a simple page (can host on GitHub Pages, Vercel, or Google Sites):

**Quick Privacy Policy Template:**

```markdown
# ModernTongue Privacy Policy

Last Updated: [DATE]

## Data Collection

ModernTongue does NOT collect, store, or transmit any personal information.

## What We Access

- **Text Input:** When you translate text, it is sent to our secure translation API hosted on Vercel. This text is processed in real-time and not stored.
- **Local Storage:** Your translation quota (timestamps only) is stored locally in your browser. This never leaves your device.

## Third-Party Services

- **Groq API:** Translation requests are processed through Groq's LLM API. No user identification is included. See [Groq's Privacy Policy](https://groq.com/privacy-policy/).

## No Tracking

We do not use analytics, cookies, or any tracking mechanisms.

## Data Retention

Zero. We don't store any user data.

## Contact

Questions? Email: your@email.com
```

Host this at: `https://your-username.github.io/moderntongue/privacy.html`

Or create a simple page on [Notion](https://notion.so) and publish it publicly.

---

## Step 6: Upload to Chrome Web Store

### **In Developer Dashboard:**

1. Click **"New Item"**
2. Upload your `moderntongue-v1.0.0.zip`
3. Wait for automatic checks to complete

### **Fill Out Store Listing:**

**Product Details:**
- Name: `ModernTongue`
- Summary: Your short description (132 chars)
- Description: Your detailed description
- Category: `Productivity`
- Language: `English`

**Graphics:**
- Upload icon (128x128)
- Upload small promotional tile (440x280)
- Upload screenshots (1-5 images, 1280x800)

**Privacy Practices:**
- Does this extension handle user data? **YES**
- Data usage certification:
  - ✅ Collect or transmit data: **YES** (translation API)
  - ✅ Use of data: "Text translation processing"
  - ✅ Data is transmitted over a secure connection
  - ✅ Link to privacy policy: `https://your-privacy-url.com`

**Permissions Justification:**
- `activeTab`: To access selected text for translation
- `contextMenus`: To add "Modernise This Text" option
- `scripting`: To inject translation UI overlay
- `storage`: To track daily translation quota locally
- `https://moderntongue.vercel.app/*`: To communicate with translation API

**Distribution:**
- Visibility: **Public**
- Regions: **All regions**

---

## Step 7: Submit for Review

1. Click **"Submit for Review"**
2. Review checklist appears - ensure all items are complete
3. Click **"Submit"**
4. Wait for Google review (typically 1-3 days, can be up to 1 week)

### **What Google Reviews:**

- ✅ Extension functionality
- ✅ Privacy policy accuracy
- ✅ No malicious code
- ✅ Proper permission usage
- ✅ Manifest completeness
- ✅ Store listing accuracy

---

## Step 8: After Approval

### **Your extension will be live at:**
```
https://chrome.google.com/webstore/detail/[your-extension-id]
```

### **Post-Launch Tasks:**

1. **Update README** with Chrome Web Store link
2. **Share on social media** (Twitter, LinkedIn, Reddit)
3. **Monitor reviews** and respond promptly
4. **Track installs** in Developer Dashboard
5. **Fix bugs** reported by users
6. **Update regularly** to maintain ranking

---

## Updating Your Extension

### **For any code changes:**

1. Update `version` in `manifest.json`:
   ```json
   "version": "1.0.1"  // Increment version
   ```

2. Create new ZIP package

3. In Developer Dashboard:
   - Click your extension
   - Click "Package" tab
   - Click "Upload new package"
   - Upload new ZIP
   - Submit for review

### **Version Numbering:**
- Bug fixes: `1.0.0` → `1.0.1`
- New features: `1.0.0` → `1.1.0`
- Major changes: `1.0.0` → `2.0.0`

---

## Common Rejection Reasons & Fixes

### **1. "Single Purpose Violation"**
**Issue:** Extension does too many unrelated things
**Fix:** Your extension has a clear single purpose (translate historical English) ✅

### **2. "Missing Privacy Policy"**
**Issue:** No privacy policy linked or policy incomplete
**Fix:** Create and link privacy policy as shown above

### **3. "Excessive Permissions"**
**Issue:** Requesting permissions not justified
**Fix:** All your permissions are necessary and justified ✅

### **4. "Misleading Description"**
**Issue:** Store listing doesn't match functionality
**Fix:** Ensure description accurately describes what extension does

### **5. "Broken Functionality"**
**Issue:** Extension doesn't work during review
**Fix:** Test thoroughly before submission
- Check Groq API is working
- Verify Vercel endpoint is accessible
- Test all features

---

## Costs Summary

| Item | Cost |
|------|------|
| Chrome Web Store Developer Account | $5 (one-time) |
| Groq API (free tier) | $0 |
| Vercel Hosting (free tier) | $0 |
| Icons/Assets Creation | $0 (DIY) or $5-50 (designer) |
| **Total** | **$5-$55** |

---

## Timeline

| Task | Time |
|------|------|
| Generate icons | 30 minutes |
| Create store assets | 1-2 hours |
| Write descriptions | 30 minutes |
| Create privacy policy | 30 minutes |
| Upload & configure | 30 minutes |
| **Initial submission** | **3-4 hours** |
| Google review | **1-3 days** |
| **Total to launch** | **~3-4 days** |

---

## Tips for Success

### **🎯 Increase Installs:**
- Great screenshots showing real use cases
- Clear, benefit-focused description
- Respond to all reviews
- Regular updates
- Share on Reddit (r/chrome, r/literature, r/shakespeare)

### **⭐ Get Good Reviews:**
- Extension works flawlessly
- Fast performance (Groq is very fast ✅)
- Simple UX
- No bugs
- Prompt support

### **📈 Improve Ranking:**
- Weekly active users (encourage daily use)
- High rating (4.5+ stars)
- Recent updates (update monthly)
- Keyword optimization in title/description

---

## Support & Maintenance

**Expected User Questions:**
1. "How do I get more translations?" → Explain 50/day limit resets every 24hrs
2. "It says network unavailable" → Fallback is working, API might be down temporarily
3. "Can I use this offline?" → Yes, with limited fallback (100+ patterns)
4. "Is this free?" → Yes, completely free

**Monthly Maintenance:**
- Check Groq API status
- Monitor Vercel usage (should stay free)
- Review user feedback
- Fix reported bugs
- Consider new features

---

## Next Steps

1. **Generate icons:** Use `scripts/generate-icons.sh` or online tool
2. **Create screenshots:** Capture 5 high-quality screenshots
3. **Make promotional tile:** Use Canva/Figma (440x280px)
4. **Write privacy policy:** Use template above, host on GitHub Pages
5. **Create ZIP package:** Include only necessary files
6. **Register developer account:** Pay $5 fee
7. **Submit extension:** Fill out all fields carefully
8. **Wait for approval:** Usually 1-3 days
9. **Celebrate launch! 🎉**

---

**Questions?** Check [Chrome Web Store Developer Support](https://support.google.com/chrome_webstore/answer/1047776)
