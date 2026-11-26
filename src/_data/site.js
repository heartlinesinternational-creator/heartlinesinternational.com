// Shared facts used by every page. Change them here once, not in each page.
export default {
  name: "Heartlines International",
  url: "https://www.heartlinesinternational.com",
  email: "heartlinesinternational@gmail.com",
  donateUrl: "https://www.zeffy.com/en-US/donation-form/support-heartlines-international",
  instagramUrl: "https://www.instagram.com/heartlinesinternational/",
  // Volunteer interest form (Google Form, Nov 26, 2026, Jason). Every "Sign up to volunteer" button points here.
  volunteerFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSexo5ZuAL-1RqYCNk976ghxsE7Qs1S9nini45392GaBMNUWIw/viewform",
  // Contact form: FormSubmit emails each message to the address below (no account, no JavaScript).
  // After the first test message, FormSubmit sends an activation email to this inbox; click it once.
  formAction: "https://formsubmit.co/heartlinesinternational@gmail.com",
  // Home page search description (each other page sets its own "description" at the top of its file). Keep under about 155 characters.
  description: "Student-led 501(c)(3) public charity in San Jose. Our first program sends iron tablets, health guides and handwritten cards to mothers in the Philippines.",
  // Link previews (texts, Instagram, Facebook): images/share-card.png, 1200x630: the logo, the name, and the home page's "Student-led nonprofit · 501(c)(3) public charity · San Jose, California" line.
  shareImageAlt: "Heartlines International: student-led nonprofit, 501(c)(3) public charity, San Jose, California.",
  nav: [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "get-involved.html", label: "Get Involved" },
  ],
};
