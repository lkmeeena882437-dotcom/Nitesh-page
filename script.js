/* ==========================================================
   QUICK CONFIG — ADD YOUR DETAILS LATER
========================================================== */
const CONFIG = {
  rate: 135,
  whatsappNumber: "",
  telegramUrl: "",
  metaPixelId: "YOUR_META_PIXEL_ID",
  requireCookieConsent: true
};

document.getElementById("rateText").textContent = `₹${CONFIG.rate}`;

const whatsappBtn = document.getElementById("whatsappBtn");
const telegramBtn = document.getElementById("telegramBtn");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

const params = new URLSearchParams(window.location.search);
const campaign = {
  utm_source: params.get("utm_source") || "",
  utm_medium: params.get("utm_medium") || "",
  utm_campaign: params.get("utm_campaign") || "",
  utm_content: params.get("utm_content") || "",
  fbclid: params.get("fbclid") || ""
};

function campaignText() {
  return Object.entries(campaign)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" | ");
}

function buildWhatsAppLink() {
  const message = [
    "Hello, I want to sell USDT.",
    `Displayed rate: ₹${CONFIG.rate} per USDT`,
    "Please confirm the current rate and payment details.",
    campaignText() ? `Campaign: ${campaignText()}` : ""
  ].filter(Boolean).join("\n");

  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

whatsappBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (!CONFIG.whatsappNumber.trim()) {
    showToast("Add your WhatsApp number in the CONFIG section.");
    return;
  }

  trackMeta("Lead", {
    content_name: "USDT Buyer WhatsApp Enquiry",
    content_category: "USDT Buyer Contact"
  });

  window.open(buildWhatsAppLink(), "_blank", "noopener");
});

telegramBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (!CONFIG.telegramUrl.trim()) {
    showToast("Add your Telegram link in the CONFIG section.");
    return;
  }

  trackMeta("TelegramClick", {
    content_name: "USDT Buyer Telegram Contact"
  }, true);

  window.open(CONFIG.telegramUrl, "_blank", "noopener");
});

/* ---------------- META PIXEL ---------------- */
let pixelLoaded = false;

function validPixelId(value) {
  return /^\d{5,}$/.test(String(value || "").trim());
}

function loadMetaPixel() {
  if (pixelLoaded || !validPixelId(CONFIG.metaPixelId)) return;

  !(function(f,b,e,v,n,t,s){
    if(f.fbq)return;
    n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;
    n.push=n;
    n.loaded=true;
    n.version='2.0';
    n.queue=[];
    t=b.createElement(e);
    t.async=true;
    t.src=v;
    s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);
  })(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', CONFIG.metaPixelId);
  fbq('track', 'PageView');
  fbq('track', 'ViewContent', {
    content_name: 'USDT Buyer Landing Page',
    content_category: 'USDT Buyer Contact'
  });

  pixelLoaded = true;
}

function trackMeta(eventName, data = {}, custom = false) {
  if (!pixelLoaded || typeof fbq !== "function") return;
  custom ? fbq('trackCustom', eventName, data) : fbq('track', eventName, data);
}

const consentBox = document.getElementById("consentBox");
const consentKey = "usdt_buyer_meta_consent";
const savedConsent = localStorage.getItem(consentKey);

if (validPixelId(CONFIG.metaPixelId)) {
  if (!CONFIG.requireCookieConsent) {
    loadMetaPixel();
  } else if (savedConsent === "accepted") {
    loadMetaPixel();
  } else if (savedConsent !== "declined") {
    consentBox.classList.add("show");
  }
}

document.getElementById("acceptTracking").addEventListener("click", () => {
  localStorage.setItem(consentKey, "accepted");
  consentBox.classList.remove("show");
  loadMetaPixel();
});

document.getElementById("declineTracking").addEventListener("click", () => {
  localStorage.setItem(consentKey, "declined");
  consentBox.classList.remove("show");
});

/* ---------------- PRIVACY MODAL ---------------- */
const privacyModal = document.getElementById("privacyModal");

document.getElementById("privacyBtn").addEventListener("click", () => {
  privacyModal.classList.add("show");
});

document.getElementById("closePrivacy").addEventListener("click", () => {
  privacyModal.classList.remove("show");
});

privacyModal.addEventListener("click", (event) => {
  if (event.target === privacyModal) privacyModal.classList.remove("show");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") privacyModal.classList.remove("show");
});

/* ---------------- LIVE CHART BACKGROUND ---------------- */
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
let candles = [];
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createCandles();
}

function createCandles() {
  candles = [];
  const gap = Math.max(27, innerWidth / 20);
  let price = innerHeight * .70;

  for (let x = -gap; x < innerWidth + gap; x += gap) {
    const open = price + (Math.random() - .5) * 44;
    const close = open + (Math.random() - .43) * 58;
    const high = Math.min(open, close) - (9 + Math.random() * 23);
    const low = Math.max(open, close) + (9 + Math.random() * 23);

    candles.push({
      x, open, close, high, low,
      phase: Math.random() * Math.PI * 2
    });

    price = close - 3;
  }
}

function draw(time) {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  const shift = Math.sin(time / 4200) * 5;

  ctx.beginPath();
  candles.forEach((candle, index) => {
    const y = candle.close + Math.sin(time / 1600 + candle.phase) * 4 + shift;
    index ? ctx.lineTo(candle.x, y) : ctx.moveTo(candle.x, y);
  });
  ctx.strokeStyle = "rgba(92,242,255,.16)";
  ctx.lineWidth = 1.4;
  ctx.stroke();

  candles.forEach((candle) => {
    const drift = Math.sin(time / 1750 + candle.phase) * 4 + shift;
    const bullish = candle.close < candle.open;
    const color = bullish
      ? "rgba(92,242,255,.42)"
      : "rgba(255,111,216,.30)";

    const width = 11;
    const top = Math.min(candle.open, candle.close) + drift;
    const height = Math.max(4, Math.abs(candle.close - candle.open));

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(candle.x, candle.high + drift);
    ctx.lineTo(candle.x, candle.low + drift);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillRect(candle.x - width / 2, top, width, height);
  });

  requestAnimationFrame(draw);
}

addEventListener("resize", resize, { passive: true });
resize();
requestAnimationFrame(draw);
