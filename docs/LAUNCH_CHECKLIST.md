# Launch Day Checklist

Quick reference for launching ModernTongue on Chrome Web Store.

---

## ✅ Pre-Launch (Do This First)

### **1. Set Up Monitoring**

- [ ] **Groq Dashboard Alerts**
  - Go to https://console.groq.com/settings
  - Enable email notifications:
    - ✅ 80% quota warning
    - ✅ Rate limit alerts
    - ✅ API errors
  - Save your email

- [ ] **Bookmark These URLs**
  - Groq Usage: https://console.groq.com/usage
  - Vercel Analytics: https://vercel.com/dashboard/analytics
  - Chrome Web Store Stats: https://chrome.google.com/webstore/devconsole

- [ ] **Create Tracking Spreadsheet**
  ```
  Columns: Week | Active Users | API Calls | Cost | Notes
  Update every Monday
  ```

### **2. Final Technical Check**

- [ ] Extension works locally
- [ ] All icons display
- [ ] Privacy policy shows correctly
- [ ] API endpoint responds
- [ ] Quota system works
- [ ] Fallback triggers when offline

### **3. Store Listing Ready**

- [ ] Screenshots (1-5 images, 1280x800)
- [ ] Promotional tile (440x280)
- [ ] Description written
- [ ] Privacy policy URL ready
- [ ] Contact email: uniwaycontactuk@gmail.com

---

## 🚀 Launch Week (Week 1)

### **Day 1: Launch**
- [ ] Submit to Chrome Web Store
- [ ] Share on Twitter/LinkedIn
- [ ] Post in relevant subreddits (r/chrome, r/literature)
- [ ] Email friends to try it

### **Day 2-7: Monitor Daily**
- [ ] Check Groq usage (should be near 0)
- [ ] Check Chrome Web Store installs
- [ ] Respond to any reviews
- [ ] Fix any reported bugs

### **Week 1 Goals:**
- 10-50 installs ✅
- 5-10 active users ✅
- <500 API calls total ✅
- $0 cost ✅

---

## 📊 Monitoring Schedule

### **Daily (First 2 Weeks)**
⏰ **Every morning (5 min):**
1. Check Groq dashboard: https://console.groq.com/usage
2. Check new reviews: Chrome Web Store
3. Check for error emails from Groq

### **Weekly (Ongoing)**
⏰ **Every Monday (15 min):**
1. Record stats in spreadsheet:
   - Weekly active users
   - Total API calls
   - Groq cost (if any)
2. Calculate trend
3. Decide if action needed

### **Monthly (After Week 4)**
⏰ **First Monday of month (30 min):**
1. Review full month stats
2. Calculate cost per user
3. Decide on monetization
4. Plan next month's features

---

## 🚨 Alert Thresholds

### **🟢 All Good (No Action)**
- <200 weekly active users
- <10,000 API calls/week
- $0-5 Groq cost/month
- **Action:** Keep monitoring weekly

### **🟡 Monitor Closely**
- 200-500 weekly active users
- 10,000-25,000 API calls/week
- $5-15 Groq cost/month
- **Action:**
  - Check daily instead of weekly
  - Prepare payment integration
  - Consider upgrading Groq

### **🔴 Take Action**
- >500 weekly active users
- >25,000 API calls/week
- >$20 Groq cost/month
- **Action:**
  1. Upgrade Groq to paid tier
  2. Implement payment system (see MONITORING_AND_PAYMENTS.md)
  3. Or reduce free tier to 10/day

---

## 💰 When to Add Payments

### **Trigger: Hit Any of These**
- Monthly Groq cost >$20
- >500 weekly active users
- >1,000 total installs
- Users requesting more translations

### **Quick Payment Setup (2 hours)**
1. Create Stripe account
2. Add subscription product ($4.99/month)
3. Add "Upgrade" button to popup
4. Implement checkout flow
5. Store premium status

**See full guide:** `docs/MONITORING_AND_PAYMENTS.md`

---

## 📈 Growth Milestones

### **Milestone 1: First 100 Users**
- **Timeline:** Week 1-2
- **Cost:** $0
- **Action:** Celebrate! Respond to feedback

### **Milestone 2: 500 Weekly Active Users**
- **Timeline:** Month 2-3
- **Cost:** ~$10-15/month
- **Action:** Decide on monetization strategy

### **Milestone 3: 1,000 Total Installs**
- **Timeline:** Month 3-6
- **Cost:** ~$20-30/month
- **Action:** Implement payments or upgrade Groq

### **Milestone 4: Break Even with Payments**
- **Timeline:** Month 4-8
- **Need:** 5-10 paying users ($4.99/month)
- **Action:** Expand marketing

---

## 🛠️ Emergency Responses

### **Problem: Suddenly 1,000+ API calls in one day**

**Immediate (5 min):**
```javascript
// Edit shared/quota.js
const MAX_TRANSLATIONS_PER_WINDOW = 10; // Reduce from 50
```
Deploy and reload extension

**Next (1 hour):**
- Add "bring your own API key" option
- Email users explaining situation
- Consider paid tier

---

### **Problem: Groq rate limit errors**

**Immediate:**
- Fallback will handle it automatically
- Users see "Network unavailable" message

**Next:**
- Upgrade Groq to paid tier ($10-20/month)
- Or implement payment system
- Or reduce free quota

---

### **Problem: Negative reviews**

**Response template:**
```
Thank you for the feedback! We're actively improving ModernTongue.
[Address specific issue]
Please email uniwaycontactuk@gmail.com for direct support.
We'd love to make this right!
```

**Always:**
- Respond within 24 hours
- Be professional and helpful
- Fix genuine bugs quickly
- Update if issue resolved

---

## 📝 Weekly Check Template

**Copy this every Monday:**

```
Week #: [Date]

STATS:
- Weekly Active Users: _____
- Total Installs: _____
- New Reviews: _____
- Rating: ⭐⭐⭐⭐⭐ (__/5)

API USAGE:
- Daily Avg Calls: _____
- Week Total Calls: _____
- Groq Cost: $_____

STATUS: 🟢 / 🟡 / 🔴

ACTION NEEDED:
- [ ] None / Monitor / Upgrade / Add Payments

NOTES:
_____________________________________
```

---

## 🎯 Success Metrics (First 3 Months)

### **Week 1-4:**
- ✅ 50-100 installs
- ✅ 20-50 weekly active
- ✅ 4+ star rating
- ✅ <$5 cost

### **Month 2:**
- ✅ 200-500 installs
- ✅ 100-200 weekly active
- ✅ 4+ star rating
- ✅ <$15 cost

### **Month 3:**
- ✅ 500-1000 installs
- ✅ 300-500 weekly active
- ✅ 4.5+ star rating
- ✅ Sustainable cost or payments implemented

---

## 🔗 Quick Links

**Monitoring:**
- Groq: https://console.groq.com/usage
- Vercel: https://vercel.com/dashboard
- Chrome Store: https://chrome.google.com/webstore/devconsole

**Documentation:**
- Full monitoring guide: `docs/MONITORING_AND_PAYMENTS.md`
- Deployment guide: `docs/CHROME_WEB_STORE_DEPLOYMENT.md`
- Troubleshooting: `docs/TROUBLESHOOTING.md`

**Support:**
- Groq Discord: https://groq.com/discord
- Your Email: uniwaycontactuk@gmail.com

---

## ✅ Launch Day Final Checklist

**Morning of launch:**
- [ ] ☕ Coffee ready
- [ ] 📊 Monitoring spreadsheet created
- [ ] 🔔 Groq alerts enabled
- [ ] 📧 Email ready for support
- [ ] 🎉 Ready to celebrate!

**After submission:**
- [ ] Share on social media
- [ ] Ask friends to review
- [ ] Monitor first 24 hours closely
- [ ] Sleep well - you built something cool! 🚀

---

**Remember:** Start small, monitor closely, scale when ready. You've got this! 💪
