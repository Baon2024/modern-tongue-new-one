# Pre-Deployment Checklist for ModernTongue

Use this checklist before submitting to Chrome Web Store.

---

## ☑️ Technical Testing

### Extension Functionality
- [ ] **Popup translation works**
  - Test with: `Thou art most welcome hither, wherefore dost thou come?`
  - Should return modern English translation
  - No console errors

- [ ] **Context menu works on webpages**
  - Highlight text on any webpage
  - Right-click → "✨ Modernise This Text"
  - Overlay appears with translation

- [ ] **Context menu works on PDFs**
  - Open a PDF in Chrome
  - Highlight text
  - Right-click → "✨ Modernise This Text"
  - New tab opens with translation

- [ ] **Quota system working**
  - Check "X remaining today" displays correctly
  - Make translations and see quota decrease
  - Test what happens at 0 quota (should show error message)

- [ ] **Fallback works offline**
  - Disconnect internet
  - Try translation
  - Should show "Network unavailable" message
  - Should still provide regex-based translation
  - Reconnect and verify it works again

- [ ] **No console errors**
  - Open DevTools (F12)
  - Check Console tab
  - No red errors during use

### API & Backend
- [ ] **Vercel API responding**
  ```bash
  curl -X POST https://moderntongue.vercel.app/api/translate-free \
    -H "Content-Type: application/json" \
    -d '{"text":"thou art welcome"}'
  ```
  - Should return JSON with translation
  - No errors

- [ ] **GROQ_API_KEY configured**
  ```bash
  vercel env ls
  ```
  - Should show GROQ_API_KEY in all environments

- [ ] **Host permissions correct**
  - manifest.json includes: `"https://moderntongue.vercel.app/*"`

---

## ☑️ Assets & Branding

### Icons
- [ ] **All icon sizes generated**
  - [ ] icons/icon16.png (16x16)
  - [ ] icons/icon32.png (32x32)
  - [ ] icons/icon48.png (48x48)
  - [ ] icons/icon96.png (96x96)
  - [ ] icons/icon128.png (128x128)

  **Generate with:**
  ```bash
  ./scripts/generate-icons.sh
  # Or use: https://svgtopng.com/
  ```

- [ ] **Icons display correctly**
  - Load extension in chrome://extensions
  - Check icon appears in toolbar
  - Check icon in extensions list

### Store Graphics
- [ ] **Small promotional tile** (440x280px)
  - Shows icon + "ModernTongue" branding
  - Clear, professional design
  - PNG or JPEG

- [ ] **Screenshots** (1280x800px, at least 1, max 5)
  - Screenshot 1: Popup with example translation
  - Screenshot 2: Context menu overlay
  - Screenshot 3: Before/after comparison
  - Screenshot 4: PDF viewer (optional)
  - Screenshot 5: Features overview (optional)

- [ ] **High-res icon** (512x512px - optional but recommended)

---

## ☑️ Store Listing Content

### Descriptions
- [ ] **Short description** (max 132 characters)
  ```
  Instantly translate historical English to modern language. Works on Shakespeare, old documents, and literature with AI precision.
  ```
  Character count: ___/132

- [ ] **Detailed description** (see CHROME_WEB_STORE_DEPLOYMENT.md)
  - Explains features clearly
  - Shows examples
  - Lists use cases
  - Professional tone
  - No grammar/spelling errors

### Categorization
- [ ] **Category selected:** Productivity (or Fun)
- [ ] **Language:** English

---

## ☑️ Privacy & Legal

### Privacy Policy (REQUIRED)
- [ ] **Privacy policy created**
  - Explains what data is collected (text for translation)
  - Explains local storage (quota timestamps)
  - Mentions Groq API usage
  - Includes contact email

- [ ] **Privacy policy hosted publicly**
  - URL: _________________________________
  - Examples:
    - GitHub Pages: `https://username.github.io/moderntongue-privacy`
    - Google Sites
    - Notion (public page)
    - Your own domain

- [ ] **Privacy policy linked in manifest** (optional but recommended)
  ```json
  "homepage_url": "https://your-privacy-policy-url"
  ```

### Permissions Justification
- [ ] **Can explain each permission:**
  - `activeTab`: Access selected text for translation
  - `contextMenus`: Add right-click menu option
  - `scripting`: Inject translation overlay
  - `storage`: Store quota data locally
  - `https://moderntongue.vercel.app/*`: API communication

---

## ☑️ Code Quality

### File Structure
- [ ] **Clean package for upload**
  - Include: manifest.json, src/, shared/, icons/
  - Exclude: api/, docs/, node_modules/, .git/, scripts/

- [ ] **No sensitive data**
  - No API keys in code (should be on Vercel only)
  - No personal info
  - No test data

### Version Info
- [ ] **Version number set** in manifest.json
  - Start with: `"version": "1.0.0"`

- [ ] **Changelog prepared** (for future updates)

---

## ☑️ Testing Scenarios

### Positive Test Cases
- [ ] Translate Shakespeare quote successfully
- [ ] Translate King James Bible verse successfully
- [ ] Translate colonial document text successfully
- [ ] Context menu works on Wikipedia page
- [ ] Context menu works on PDF
- [ ] Quota displays correctly

### Edge Cases
- [ ] Empty text input (should show error)
- [ ] Very long text (1000+ words)
- [ ] Special characters (`&`, `<`, `>`, quotes)
- [ ] Non-English text (should pass through or translate)
- [ ] Already modern English (should handle gracefully)

### Error Handling
- [ ] Network error (offline) → fallback works
- [ ] API error → fallback works
- [ ] Quota exhausted → clear error message
- [ ] Invalid input → helpful error message

---

## ☑️ Performance

- [ ] **Translation speed**
  - Popup: < 2 seconds
  - Context menu: < 2 seconds
  - Groq API is very fast, should be instant

- [ ] **Extension size**
  - Zipped package: < 2 MB (should be ~100-500 KB)

- [ ] **No memory leaks**
  - Use extension continuously for 5 minutes
  - Check Chrome Task Manager (Shift+Esc)
  - Memory should be stable (~10-30 MB)

---

## ☑️ User Experience

### First-Time User
- [ ] Extension works immediately after install
- [ ] No setup required
- [ ] UI is intuitive
- [ ] Popup shows helpful placeholder text

### Regular User
- [ ] Quota reminder visible
- [ ] Translation history (if implemented)
- [ ] Fast and responsive

### Error States
- [ ] Clear error messages
- [ ] Suggests solutions
- [ ] Doesn't break extension

---

## ☑️ Documentation

- [ ] **README.md updated**
  - Installation instructions
  - Setup guide
  - Usage examples
  - Link to Chrome Web Store (add after approval)

- [ ] **CHANGELOG.md created** (optional)
  ```markdown
  # Changelog

  ## [1.0.0] - 2025-11-06
  - Initial release
  - Groq API integration with Llama 3.3
  - Enhanced fallback with 100+ patterns
  - 50 translations/day quota
  ```

---

## ☑️ Chrome Web Store Account

- [ ] **Developer account created**
  - Paid $5 registration fee
  - Account verified
  - Logged in to Developer Dashboard

---

## ☑️ Final Pre-Submission

### Create Package
```bash
# Clean build
mkdir -p build
cp -r src shared icons manifest.json build/
cd build
zip -r ../moderntongue-v1.0.0.zip .
cd ..
```

- [ ] **ZIP created:** moderntongue-v1.0.0.zip
- [ ] **ZIP tested:** Unzip and load in Chrome to verify

### Double Check
- [ ] All checklist items completed
- [ ] Tested on clean Chrome profile
- [ ] No errors in console
- [ ] API working
- [ ] Graphics ready
- [ ] Privacy policy live
- [ ] Descriptions written

---

## 🚀 Ready to Submit!

When all items are checked:

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click "New Item"
3. Upload `moderntongue-v1.0.0.zip`
4. Fill out store listing
5. Submit for review
6. Wait 1-3 days for approval

**Good luck! 🎉**

---

## Post-Submission

After submission:
- [ ] Monitor email for Google's review updates
- [ ] Prepare to respond to any issues
- [ ] Plan launch announcement (Twitter, Reddit, etc.)
- [ ] Set up analytics (optional)

After approval:
- [ ] Update README with Chrome Web Store link
- [ ] Share on social media
- [ ] Monitor reviews
- [ ] Respond to user feedback
