# How to Edit Privacy Policy & Terms

Your legal page is at: `src/legal/legal.html`

## Quick Guide

### **To Edit Privacy Policy:**

1. Open `src/legal/legal.html`
2. Find this section (around line 32):
   ```html
   <!-- ADD YOUR PRIVACY POLICY TEXT BELOW -->
   <div class="legal-text">
     ...your text here...
   </div>
   <!-- END PRIVACY POLICY -->
   ```
3. Replace the sample text with your own

### **To Edit Terms & Conditions:**

1. Same file: `src/legal/legal.html`
2. Find this section (around line 73):
   ```html
   <!-- ADD YOUR TERMS & CONDITIONS TEXT BELOW -->
   <div class="legal-text">
     ...your text here...
   </div>
   <!-- END TERMS & CONDITIONS -->
   ```
3. Replace the sample text with your own

---

## Formatting Your Text

### **Headings**
Use `<h3>` for section headings:
```html
<h3>Your Section Title</h3>
```

### **Paragraphs**
Use `<p>` for paragraphs:
```html
<p>Your paragraph text here.</p>
```

### **Bold Text**
Use `<strong>` for emphasis:
```html
<p>This is <strong>important text</strong> in a sentence.</p>
```

### **Links**
Use `<a>` for links:
```html
<p>Contact us: <a href="mailto:your@email.com">your@email.com</a></p>
```

### **Lists**
Use `<ul>` and `<li>` for bullet points:
```html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>
```

---

## Example Structure

```html
<div class="legal-text">
  <h3>Section 1: Introduction</h3>
  <p>
    This is a paragraph explaining something important.
    You can include <strong>bold text</strong> for emphasis.
  </p>

  <h3>Section 2: Details</h3>
  <p>
    Another paragraph with more information. You can add
    <a href="https://example.com">links</a> if needed.
  </p>

  <h3>Section 3: List Example</h3>
  <p>Here are some points:</p>
  <ul>
    <li>Point one</li>
    <li>Point two</li>
    <li>Point three</li>
  </ul>

  <h3>Contact</h3>
  <p>
    Questions? Email: <a href="mailto:support@moderntongue.com">support@moderntongue.com</a>
  </p>
</div>
```

---

## Tips

1. **Keep it simple** - The styling is already done for you
2. **Use consistent headings** - All main sections should be `<h3>`
3. **Wrap text in paragraphs** - Always use `<p>` tags
4. **Update the date** - Change "Last Updated" at the top of each section
5. **Test it** - Reload extension and click "Privacy & Terms" to see changes

---

## After Editing

1. Save the file
2. Go to `chrome://extensions`
3. Click reload on ModernTongue
4. Open the extension popup
5. Click "Privacy & Terms" link
6. Verify your text displays correctly

---

## Features Already Built-In

✅ **Tabbed interface** - Switches between Privacy and Terms
✅ **Beautiful styling** - Purple gradient header, clean layout
✅ **Responsive design** - Works on all screen sizes
✅ **Scrollable content** - Handles long documents
✅ **Professional look** - Matches your extension branding
✅ **Easy navigation** - Close button and keyboard shortcuts (ESC, Cmd+W)

Just add your text - everything else is handled automatically!
