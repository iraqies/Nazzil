const copy = {
  en: {
    nav_download: "Download",
    nav_versions: "Versions",
    nav_links: "Links",
    eyebrow: "Android · Version 1.0",
    tagline: "Download the video. Keep it.",
    sub: "YouTube, TikTok, Instagram, Facebook. Saved to your gallery. No account. No watermark hunt.",
    supports: "supports:",
    download: "Download APK",
    see_versions: "See versions",
    feat_1_t: "Copy a link",
    feat_1_d: "Nazzil notices YouTube, TikTok, Instagram, and Facebook links and asks if you want them.",
    feat_2_t: "Pick a quality",
    feat_2_d: "HD, SD, or audio only. You pick.",
    feat_3_t: "It lands in Gallery",
    feat_3_d: "It lands in your gallery. Play it, share it everywhere.",
    versions_title: "Versions",
    versions_sub: "New builds show up here. Latest is always on top.",
    links_title: "Links",
    about_title: "What is Nazzil?",
    about_body: "Nazzil is an Android app, not a social profile. It is a video downloader for YouTube, TikTok, Instagram, and Facebook. Install the Nazzil APK, paste a link, and the file lands in your gallery.",
    faq_title: "FAQ",
    faq_1_q: "What is the Nazzil app?",
    faq_1_a: "Nazzil is a free Android video downloader. This website is the official place to get the Nazzil APK.",
    faq_2_q: "How do I install Nazzil?",
    faq_2_a: "Tap Download APK on this page, open the file on your Android phone, and allow install from this source.",
    faq_3_q: "Which apps does Nazzil support?",
    faq_3_a: "YouTube, TikTok, Instagram, and Facebook, including Reels and Shorts.",
    get: "Get",
  },
  ar: {
    nav_download: "تحميل",
    nav_versions: "الإصدارات",
    nav_links: "روابط",
    eyebrow: "أندرويد · الإصدار 1.0",
    tagline: "نزّل الفيديو. خليه عندك.",
    sub: "يوتيوب، تيك توك، إنستغرام، فيسبوك. ينحفظ بالمعرض. بلا حساب.",
    supports: "يدعم:",
    download: "حمّل APK",
    see_versions: "الإصدارات",
    feat_1_t: "انسخ الرابط",
    feat_1_d: "نازل يلتقط روابط يوتيوب وتيك توك وإنستغرام وفيسبوك ويسألك إذا تريده.",
    feat_2_t: "اختار الجودة",
    feat_2_d: "HD أو SD أو صوت فقط. أنت تختار.",
    feat_3_t: "ينزل بالمعرض",
    feat_3_d: "ينزل بالمعرض. شغّله وشاركه وين ما تريد.",
    versions_title: "الإصدارات",
    versions_sub: "كل إصدار جديد يظهر هنا. الأحدث فوق.",
    links_title: "روابط",
    about_title: "شنو نازل؟",
    about_body: "نازل تطبيق أندرويد، مو حساب سوشيال. يحمّل فيديوهات يوتيوب وتيك توك وإنستغرام وفيسبوك. ثبّت الـ APK، الصق الرابط، والفيديو ينزل بالمعرض.",
    faq_title: "أسئلة",
    faq_1_q: "شنو تطبيق نازل؟",
    faq_1_a: "نازل تطبيق مجاني لتحميل الفيديو على أندرويد. هذا الموقع الرسمي لتحميل الـ APK.",
    faq_2_q: "كيف أثبّت نازل؟",
    faq_2_a: "اضغط حمّل APK بهالصفحة، افتح الملف على هاتفك، واسمح بالتثبيت.",
    faq_3_q: "نازل يدعم شنو؟",
    faq_3_a: "يوتيوب، تيك توك، إنستغرام، وفيسبوك، بما فيها الريلز والشورتس.",
    get: "حمّل",
  },
};

const langToggle = document.getElementById("lang-toggle");
const versionList = document.getElementById("version-list");
const downloadBtn = document.getElementById("download-btn");
const downloadVer = document.getElementById("download-ver");
const footerVer = document.getElementById("footer-ver");

let lang = localStorage.getItem("nazzil-lang") || "en";

function applyLang() {
  document.documentElement.lang = lang;
  document.body.dir = lang === "ar" ? "rtl" : "ltr";
  langToggle.textContent = lang === "ar" ? "EN" : "AR";
  const dict = copy[lang];
  document.title =
    lang === "ar"
      ? "نازل — تطبيق أندرويد لتحميل فيديوهات يوتيوب وتيك توك وإنستغرام وفيسبوك"
      : "Nazzil App — Android video downloader for YouTube, TikTok, Instagram & Facebook";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
}

langToggle.addEventListener("click", () => {
  lang = lang === "en" ? "ar" : "en";
  localStorage.setItem("nazzil-lang", lang);
  applyLang();
});

applyLang();

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
          <a class="btn" href="${rel.apk}">${copy[lang].get} ${rel.version}</a>
        </article>
      `,
      )
      .join("");
  })
  .catch(() => {
    versionList.innerHTML = '<p class="sub">Version 1.0</p>';
  });
