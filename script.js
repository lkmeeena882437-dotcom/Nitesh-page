/* ==========================================================
   QUICK CONFIG — CONTACT DETAILS
========================================================== */
const CONFIG = {
  rate: 135,
  whatsappNumber: "918690596158",
  telegramUrl: "https://t.me/cryptobuyerp2p",
  metaPixelId: "YOUR_META_PIXEL_ID",
  requireCookieConsent: true
};

const rateText = document.getElementById("rateText");
const whatsappBtn = document.getElementById("whatsappBtn");
const telegramBtn = document.getElementById("telegramBtn");
const toast = document.getElementById("toast");

rateText.textContent = `₹${CONFIG.rate}`;

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

/* Use real anchor links so mobile browsers do not block the buttons. */
if (CONFIG.whatsappNumber.trim()) {
  whatsappBtn.href = buildWhatsAppLink();
  whatsappBtn.target = "_blank";
  whatsappBtn.rel = "noopener noreferrer";
} else {
  whatsappBtn.href = "#";
}

if (CONFIG.telegramUrl.trim()) {
  telegramBtn.href = CONFIG.telegramUrl;
  telegramBtn.target = "_blank";
  telegramBtn.rel = "noopener noreferrer";
} else {
  telegramBtn.href = "#";
}

whatsappBtn.addEventListener("click", (event) => {
  if (!CONFIG.whatsappNumber.trim()) {
    event.preventDefault();
    showToast("WhatsApp contact is currently unavailable.");
    return;
  }

  trackMeta("Lead", {
    content_name: "USDT Buyer WhatsApp Enquiry",
    content_category: "USDT Buyer Contact"
  });
});

telegramBtn.addEventListener("click", (event) => {
  if (!CONFIG.telegramUrl.trim()) {
    event.preventDefault();
    showToast("Telegram contact is currently unavailable.");
    return;
  }

  trackMeta("TelegramClick", {
    content_name: "USDT Buyer Telegram Contact"
  }, true);
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
    content_name: 'Sell Your USDT Landing Page',
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
