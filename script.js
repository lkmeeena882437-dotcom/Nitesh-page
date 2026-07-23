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

const waSheet = document.getElementById("waSheet");
const closeWaSheet = document.getElementById("closeWaSheet");
const waChooseApp = document.getElementById("waChooseApp");
const waNormal = document.getElementById("waNormal");
const waBusiness = document.getElementById("waBusiness");
const waBrowser = document.getElementById("waBrowser");
const copyWhatsAppNumber = document.getElementById("copyWhatsAppNumber");

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

function buildMessage() {
  return [
    "Hello, I want to sell USDT.",
    `Displayed rate: ₹${CONFIG.rate} per USDT`,
    "Please confirm the current rate and payment details.",
    campaignText() ? `Campaign: ${campaignText()}` : ""
  ].filter(Boolean).join("\n");
}

function buildWhatsAppWebLink() {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(buildMessage())}`;
}

function buildWhatsAppSchemeLink() {
  return `whatsapp://send?phone=${CONFIG.whatsappNumber}&text=${encodeURIComponent(buildMessage())}`;
}

function buildAndroidIntent(packageName = "") {
  const fallback = encodeURIComponent(buildWhatsAppWebLink());
  const packagePart = packageName ? `package=${packageName};` : "";

  return `intent://send?phone=${CONFIG.whatsappNumber}&text=${encodeURIComponent(buildMessage())}` +
    `#Intent;scheme=whatsapp;${packagePart}S.browser_fallback_url=${fallback};end`;
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function openWaSheet() {
  waSheet.classList.add("show");
  document.body.setAttribute("data-wa-open", "true");
}

function closeWaSheetNow() {
  waSheet.classList.remove("show");
  document.body.removeAttribute("data-wa-open");
}

/*
  Android Chrome supports package-specific intent links:
  - com.whatsapp = normal WhatsApp
  - com.whatsapp.w4b = WhatsApp Business
  Generic WhatsApp links allow Android to offer any available handler,
  including cloned WhatsApp apps when the phone exposes them.
*/
const webLink = buildWhatsAppWebLink();
waBrowser.href = webLink;

if (isAndroid()) {
  waChooseApp.href = buildAndroidIntent();
  waNormal.href = buildAndroidIntent("com.whatsapp");
  waBusiness.href = buildAndroidIntent("com.whatsapp.w4b");
} else {
  waChooseApp.href = buildWhatsAppSchemeLink();
  waNormal.href = webLink;
  waBusiness.href = webLink;
}

whatsappBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (!CONFIG.whatsappNumber.trim()) {
    showToast("WhatsApp contact is currently unavailable.");
    return;
  }

  openWaSheet();
  trackMeta("WhatsAppOptionsView", {
    content_name: "WhatsApp Contact Options"
  }, true);
});

[waChooseApp, waNormal, waBusiness, waBrowser].forEach((option) => {
  option.addEventListener("click", () => {
    trackMeta("Lead", {
      content_name: option.querySelector("strong")?.textContent || "WhatsApp Enquiry",
      content_category: "USDT Buyer Contact"
    });

    setTimeout(closeWaSheetNow, 250);
  });
});

async function copyNumber() {
  const displayNumber = "+91 86905 96158";

  try {
    await navigator.clipboard.writeText(displayNumber);
  } catch (error) {
    const helper = document.createElement("textarea");
    helper.value = displayNumber;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }

  showToast("WhatsApp number copied: +91 86905 96158");
  trackMeta("WhatsAppNumberCopied", {
    content_name: "USDT Buyer WhatsApp Number"
  }, true);
}

copyWhatsAppNumber.addEventListener("click", copyNumber);
closeWaSheet.addEventListener("click", closeWaSheetNow);

waSheet.addEventListener("click", (event) => {
  if (event.target === waSheet) closeWaSheetNow();
});

telegramBtn.href = CONFIG.telegramUrl;
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
  if (event.key === "Escape") {
    privacyModal.classList.remove("show");
    closeWaSheetNow();
  }
});
