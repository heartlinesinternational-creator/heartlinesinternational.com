// Shared facts used by every page. Change them here once, not in each page.
export default {
  name: "Heartlines International",
  url: "https://www.heartlinesinternational.com",
  email: "heartlinesinternational@gmail.com",
  donateUrl: "https://www.zeffy.com/en-US/donation-form/support-heartlines-international",
  instagramUrl: "https://www.instagram.com/heartlinesinternational/",
  // Contact form: FormSubmit emails each message to the address below (no account, no JavaScript).
  // After the first test message, FormSubmit sends an activation email to this inbox; click it once.
  formAction: "https://formsubmit.co/heartlinesinternational@gmail.com",
  // Home page search description (each other page sets its own "description" at the top of its file). Keep under about 155 characters.
  description: "Student-led San Jose nonprofit sending iron tablets, health guides in Tagalog and English, and handwritten cards to mothers at a clinic in the Philippines.",
  // Link previews (texts, Instagram, Facebook): images/share-card.png, 1200x630, made from the home page's own words.
  shareImageAlt: "Heartlines International: Every mother deserves to feel seen and valued. About $5 covers one mother’s kit.",
  nav: [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "get-involved.html", label: "Get Involved" },
  ],
};
