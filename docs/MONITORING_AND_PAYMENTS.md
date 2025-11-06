# Monitoring Usage & Adding Payments

Guide for tracking ModernTongue usage and adding monetization later.

---

## Phase 1: Launch Monitoring (FREE)

### **1. Monitor Groq API Usage**

**Dashboard:** https://console.groq.com/usage

**What to track:**
- Daily requests
- Tokens used
- Rate limit hits
- Error rates

**Check daily:**
```bash
# Quick check from terminal
curl -H "Authorization: Bearer $GROQ_API_KEY" \
  https://api.groq.com/openai/v1/usage
```

**Set up alerts:**
1. Go to https://console.groq.com/settings
2. Enable email notifications for:
   - 80% of quota reached
   - Rate limit warnings
   - API errors

**Free tier limits:**
- 30 requests/minute
- 14,400 requests/day
- ~$10-20 credit/month

**When to worry:**
- >10,000 requests/day = Consider upgrading
- >13,000 requests/day = Will hit limit soon

---

### **2. Monitor Vercel Usage**

**Dashboard:** https://vercel.com/dashboard/usage

**What to track:**
- Function invocations
- Bandwidth
- Build minutes

**Free tier limits:**
- 100GB bandwidth/month
- 100 hours function execution
- 6,000 build minutes

**Your API is tiny (<10KB), so limits are:**
- ~10M requests/month bandwidth
- ~360,000 function calls (1 second each)

**You'll hit Groq limits LONG before Vercel limits.**

---

### **3. Track Extension Installs**

**Chrome Web Store Dashboard:**
https://chrome.google.com/webstore/devconsole

**Metrics available:**
- Daily installs
- Total users
- Weekly active users
- Uninstalls
- Ratings/reviews

**Key metric to watch:**
```
Weekly Active Users × 50 translations = API calls/week
```

**Example:**
- 100 active users × 50 = 5,000 calls/week ✅ FREE
- 500 active users × 50 = 25,000 calls/week ⚠️ $2-5/month
- 1,000 active users × 50 = 50,000 calls/week 💰 $10-20/month

---

### **4. Simple API Call Counter (Optional)**

Add basic logging to track usage patterns:

**Update `api/translate-free.js`:**

```javascript
// At the top of the handler function
export default async function handler(req, res) {
  allowCors(res);

  // Log timestamp (Vercel keeps logs for 1 day on free tier)
  console.log(`[${new Date().toISOString()}] Translation request received`);

  // ... rest of your code
}
```

**View logs:**
```bash
vercel logs moderntongue --follow
```

Or in Vercel Dashboard → Functions → Logs

---

## Phase 2: When to Upgrade Groq

### **Trigger Points:**

**Switch to Groq Paid when:**
- Consistently >12,000 requests/day
- Getting rate limit errors
- >300 weekly active users

**Groq Pricing (as of 2025):**
- Llama 3.3 70B: ~$0.59 per 1M tokens
- Average translation: ~100 tokens
- 10,000 translations = ~$0.59
- **Very affordable!**

**Monthly cost estimates:**
- 300 users: ~$5/month
- 1,000 users: ~$15-20/month
- 5,000 users: ~$75-100/month

---

## Phase 3: Adding Payments (When Ready)

### **Option A: Stripe Integration (Recommended)**

**Best for:** Subscriptions, one-time payments, global support

**Implementation time:** 2-3 hours

**How it works:**
1. User clicks "Upgrade to Premium"
2. Redirects to Stripe checkout
3. On success, store premium status
4. Extension checks status before translation

**Cost:**
- Stripe fee: 2.9% + $0.30 per transaction
- $5/month subscription = You get ~$4.50

**Steps:**

1. **Create Stripe account:** https://dashboard.stripe.com/register

2. **Add Stripe product:**
   - Product: "ModernTongue Premium"
   - Price: $4.99/month or $49/year
   - Recurring subscription

3. **Create backend endpoint:**
   ```javascript
   // api/create-checkout.js
   import Stripe from 'stripe';
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

   export default async function handler(req, res) {
     const session = await stripe.checkout.sessions.create({
       mode: 'subscription',
       line_items: [{
         price: 'price_xxx', // Your Stripe price ID
         quantity: 1,
       }],
       success_url: 'chrome-extension://[id]/success.html',
       cancel_url: 'chrome-extension://[id]/popup.html',
     });
     res.json({ url: session.url });
   }
   ```

4. **Store user status:**
   - Simple: Store in chrome.storage.sync with license key
   - Better: Backend database with user ID validation

5. **Check premium status before API call:**
   ```javascript
   const isPremium = await checkPremiumStatus();
   if (!isPremium && quotaExceeded) {
     showUpgradePrompt();
   }
   ```

---

### **Option B: Chrome Web Store Payments**

**Best for:** Simple one-time purchases

**Pros:**
- Built into Chrome Web Store
- No separate payment processor
- Google handles everything

**Cons:**
- 5% Google fee
- Less flexible than Stripe
- Harder to implement subscriptions

**Only use if you want one-time purchases ($2-10).**

---

### **Option C: License Key System**

**Best for:** Simple, no recurring billing

**How it works:**
1. User buys license key from Gumroad/Lemon Squeezy/Paddle
2. Enters key in extension settings
3. Extension validates key with your backend
4. Unlocks premium features

**Pros:**
- No monthly payments
- Simple implementation
- Low fees (5-10%)

**Cons:**
- No recurring revenue
- Users can share keys (add validation)

---

## Recommended Monetization Strategy

### **Phase 1: Launch (Now)**
- Free: 50 translations/day with your API key
- Cost to you: $0-5/month for first 500 users
- Monitor usage weekly

### **Phase 2: Growth (500+ active users)**
- Upgrade Groq to paid tier (~$10-20/month)
- Add "Support ModernTongue" donation link
- Monitor if sustainable

### **Phase 3: Scale (1,000+ active users)**
- Add Premium tier: $4.99/month or $29/year
- Premium benefits:
  - ✅ Unlimited translations
  - ✅ Priority support
  - ✅ Early access to features
  - ✅ No ads (if you add them)

- Free tier:
  - 10 translations/day (reduced from 50)
  - Or: Bring your own Groq API key for unlimited

### **Phase 4: Mature (5,000+ users)**
- Premium: $4.99/month
- Team plan: $19/month (5 users)
- Enterprise: Custom pricing

**Revenue potential:**
- 5,000 users × 5% conversion = 250 paid
- 250 × $4.99 = **$1,247/month**
- Groq costs: ~$100/month
- **Net: ~$1,100/month**

---

## Quick Monitoring Dashboard

**Create simple spreadsheet to track weekly:**

| Week | Active Users | Est. API Calls | Groq Cost | Action Needed |
|------|--------------|----------------|-----------|---------------|
| 1    | 50           | 2,500          | $0        | None          |
| 2    | 150          | 7,500          | $0        | None          |
| 3    | 400          | 20,000         | $5        | Monitor       |
| 4    | 800          | 40,000         | $12       | Consider premium |

**Update every Monday:**
1. Check Chrome Web Store weekly active users
2. Check Groq usage dashboard
3. Calculate cost
4. Decide if action needed

---

## Alert Thresholds

Set up these alerts:

**🟢 Green (No action):**
- <200 weekly active users
- <10,000 API calls/week
- $0 Groq cost

**🟡 Yellow (Monitor closely):**
- 200-500 weekly active users
- 10,000-25,000 API calls/week
- $5-15/month Groq cost
- **Action:** Check daily, prepare upgrade

**🔴 Red (Take action):**
- >500 weekly active users
- >25,000 API calls/week
- >$20/month Groq cost
- **Action:** Upgrade Groq OR add payments

---

## Simple Payment Implementation (When Ready)

**Minimal viable payment flow:**

1. **Create Stripe account** (15 min)
2. **Add subscription product** (5 min)
3. **Create checkout endpoint** (30 min)
4. **Add "Upgrade" button to popup** (15 min)
5. **Store premium status** in chrome.storage (15 min)
6. **Check status before API call** (15 min)

**Total time: ~2 hours**

**Template code available in:** `docs/PAYMENT_INTEGRATION_GUIDE.md` (I'll create this when you're ready)

---

## Cost Tracking Formula

```
Monthly Cost = (Daily Active Users × Avg Translations) × 30 days × $0.59 / 1M tokens

Example:
500 users × 20 translations × 30 days × $0.59 / 10,000 = ~$18/month
```

**Break-even with Premium:**
```
Need: $18 cost / $4.99 price = 4 paid users
Realistic: 500 users × 2% conversion = 10 paid users = $50/month
Profit: $50 - $18 = $32/month
```

---

## Next Steps (Launch Day)

**Week 1:**
- ✅ Submit to Chrome Web Store
- ✅ Set up Groq email alerts
- ✅ Check Vercel dashboard daily

**Week 2-4:**
- ✅ Monitor weekly active users
- ✅ Track reviews for feedback
- ✅ Calculate actual usage vs estimates

**Month 2:**
- ✅ Decide if costs are sustainable
- ✅ Plan payment integration if needed
- ✅ Add donation link if approaching limits

**Month 3:**
- ✅ Implement payments if >500 users
- ✅ Or reduce free tier to 10/day
- ✅ Add "bring your own key" option

---

## Emergency Plan (If Costs Spike)

**If you suddenly hit limits:**

**Immediate (1 hour):**
1. Reduce quota: 50 → 10 translations/day
2. Add "bring your own API key" option
3. Show message: "High demand! Add your free Groq key for unlimited use"

**Short term (1 day):**
1. Upgrade Groq to paid tier
2. Add donation link
3. Email users explaining situation

**Long term (1 week):**
1. Implement Stripe payments
2. Premium tier: $4.99/month unlimited
3. Free tier: 10/day or own key

---

## Tools & Links

**Monitoring:**
- Groq Dashboard: https://console.groq.com/usage
- Vercel Analytics: https://vercel.com/dashboard/analytics
- Chrome Web Store: https://chrome.google.com/webstore/devconsole

**Payments:**
- Stripe: https://stripe.com
- Gumroad: https://gumroad.com
- Lemon Squeezy: https://lemonsqueezy.com

**Support:**
- Groq Discord: https://groq.com/discord
- Vercel Support: https://vercel.com/support

---

**Questions?** Check the full payment integration guide (I'll create when you're ready) or reach out.
