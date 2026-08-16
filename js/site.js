const copy = {
  en: {
    brand: "Nazzil",
    brand_kind: "App",
    footer_brand: "Nazzil app",
    nav_download: "Download",
    nav_versions: "Versions",
    nav_links: "Links",
    eyebrow: "Android · Version 1.0",
    tagline: "Download the video. Keep it.",
    sub: "YouTube, TikTok, Instagram, Facebook. Saved to your gallery. No account. No watermark hunt.",
    supports: "supports",
    downloads: "downloads",
    download: "Download APK",
    see_versions: "See versions",
    feat_1_t: "Paste a link",
    feat_1_d: "Paste a YouTube, TikTok, Instagram, or Facebook link. Nazzil fetches it.",
    feat_2_t: "Pick a quality",
    feat_2_d: "HD, SD, or audio only. You pick.",
    feat_3_t: "It lands in Gallery",
    feat_3_d: "It lands in your gallery. Play it, share it everywhere.",
    versions_title: "Versions",
    versions_sub: "New builds show up here. Latest is always on top.",
    links_title: "Links",
    about_title: "What is Nazzil?",
    about_body: "Nazzil is an Android app, not a social profile. It is a video downloader for YouTube, TikTok, Instagram, and Facebook. Install the Nazzil APK, paste a link, and the file lands in your gallery.",
    get: "Get",
  },
  ar: {
    brand: "نزل",
    brand_kind: "تطبيق",
    footer_brand: "تطبيق نزل",
    nav_download: "تحميل",
    nav_versions: "الإصدارات",
    nav_links: "روابط",
    eyebrow: "أندرويد · الإصدار 1.0",
    tagline: "نزّل الفيديو. خليه عندك.",
    sub: "يوتيوب، تيك توك، إنستغرام، فيسبوك. ينحفظ بالمعرض. بلا حساب.",
    supports: "يدعم",
    downloads: "تنزيلات",
    download: "حمّل APK",
    see_versions: "الإصدارات",
    feat_1_t: "الصق الرابط",
    feat_1_d: "الصق رابط يوتيوب أو تيك توك أو إنستغرام أو فيسبوك. نزل يجيبه.",
    feat_2_t: "اختار الجودة",
    feat_2_d: "HD أو SD أو صوت فقط. أنت تختار.",
    feat_3_t: "ينزل بالمعرض",
    feat_3_d: "ينزل بالمعرض. شغّله وشاركه وين ما تريد.",
    versions_title: "الإصدارات",
    versions_sub: "كل إصدار جديد يظهر هنا. الأحدث فوق.",
    links_title: "روابط",
    about_title: "شنو نزل؟",
    about_body: "نزل تطبيق أندرويد، مو حساب سوشيال. يحمّل فيديوهات يوتيوب وتيك توك وإنستغرام وفيسبوك. ثبّت الـ APK، الصق الرابط، والفيديو ينزل بالمعرض.",
    get: "حمّل",
  },
};

const langToggle = document.getElementById("lang-toggle");
const versionList = document.getElementById("version-list");
const downloadBtn = document.getElementById("download-btn");
const downloadVer = document.getElementById("download-ver");
const footerVer = document.getElementById("footer-ver");
const downloadCountEl = document.getElementById("dl-count-num");

const COUNTER_GET = "https://api.countapi.xyz/get/nazzil-official/apk-downloads";
const COUNTER_HIT = "https://api.countapi.xyz/hit/nazzil-official/apk-downloads";

let lang = localStorage.getItem("nazzil-lang") || "en";
let downloadCount = Number(localStorage.getItem("nazzil-dl-count") || 0);

function applyLang() {
  document.documentElement.lang = lang;
  document.body.dir = lang === "ar" ? "rtl" : "ltr";
  langToggle.textContent = lang === "ar" ? "EN" : "AR";
  const dict = copy[lang];
  document.title =
    lang === "ar"
      ? "نزل — تطبيق أندرويد لتحميل فيديوهات يوتيوب وتيك توك وإنستغرام وفيسبوك"
      : "Nazzil App — Android video downloader for YouTube, TikTok, Instagram & Facebook";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  renderDownloadCount();
}

function renderDownloadCount() {
  if (!downloadCountEl) {
    return;
  }
  downloadCountEl.textContent = Number(downloadCount || 0).toLocaleString(lang === "ar" ? "ar" : "en");
}

function readCountPayload(data) {
  if (typeof data?.value === "number") {
    return data.value;
  }
  if (typeof data?.count === "number") {
    return data.count;
  }
  return null;
}

function loadDownloadCount() {
  renderDownloadCount();
  fetch(COUNTER_GET)
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => {
      const value = readCountPayload(data);
      if (value == null) {
        return;
      }
      downloadCount = value;
      localStorage.setItem("nazzil-dl-count", String(value));
      renderDownloadCount();
    })
    .catch(() => {});
}

function bumpDownloadCount() {
  downloadCount += 1;
  localStorage.setItem("nazzil-dl-count", String(downloadCount));
  renderDownloadCount();
  fetch(COUNTER_HIT)
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => {
      const value = readCountPayload(data);
      if (value == null) {
        return;
      }
      downloadCount = value;
      localStorage.setItem("nazzil-dl-count", String(value));
      renderDownloadCount();
    })
    .catch(() => {});
}

langToggle.addEventListener("click", () => {
  lang = lang === "en" ? "ar" : "en";
  localStorage.setItem("nazzil-lang", lang);
  applyLang();
});

applyLang();
loadDownloadCount();
document.addEventListener("click", (event) => {
  if (event.target.closest(".js-download")) {
    bumpDownloadCount();
  }
});

fetch("versions.json")
  .then((r) => r.json())
  .then((data) => {
    const latest = data.releases[0];
    if (latest) {
      downloadBtn.href = latest.apk;
      downloadVer.textContent = latest.version;
      footerVer.textContent = latest.version;
      document.querySelector('[data-i18n="eyebrow"]').textContent =
        lang === "ar" ? `أندرويد · الإصدار ${latest.version}` : `Android · Version ${latest.version}`;
    }
    versionList.innerHTML = data.releases
      .map(
        (rel) => `
        <article class="version">
          <strong>${rel.version}</strong>
          <div>
            <h3>${rel.title}</h3>
            <small>${rel.date}</small>
            <ul>${rel.notes.map((n) => `<li>${n}</li>`).join("")}</ul>
          </div>
          <a class="btn js-download" href="${rel.apk}">${copy[lang].get} ${rel.version}</a>
        </article>
      `,
      )
      .join("");
  })
  .catch(() => {
    versionList.innerHTML = '<p class="sub">Version 1.0</p>';
  });
