# USDT Buyer Landing Page

Single-screen landing page for connecting USDT sellers with buyers.

## Setup

Open `script.js` and edit the `CONFIG` block:

```js
const CONFIG = {
  rate: 135,
  whatsappNumber: "",
  telegramUrl: "",
  metaPixelId: "YOUR_META_PIXEL_ID",
  requireCookieConsent: true
};
```

### Value formats

- WhatsApp: `919999999999`
- Telegram: `https://t.me/yourusername`
- Meta Pixel: numeric Pixel ID

## Included

- Responsive single-screen design
- WhatsApp and Telegram contact buttons
- USDT amount and network selection
- Meta Pixel PageView, ViewContent, Lead and Telegram click tracking
- UTM and `fbclid` capture
- Privacy consent prompt
- Animated trading-chart background

The ecosystem brand names shown on the landing page are references only. No partnership or endorsement is implied.
