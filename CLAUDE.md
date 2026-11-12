# Heartlines International website: context and rules for Claude Code

Read this before every change. It is the only context you have about this organization.

## Who we are
- Heartlines International (HINT): a California nonprofit public benefit corporation, EIN 42-4681667, incorporated Aug 19, 2026. Recognized by the IRS as a 501(c)(3) public charity under section 170(b)(1)(A)(vi) (determination letter dated Oct 15, 2026, effective Aug 19, 2026).
- Founded by two high school students in San Jose, CA: **Jason Ham** and **Allison Kim**, co-founders and co-presidents. Board: Jason Ham, Allison Kim, Joshua Kim. CFO: Hyungjun Ham.
- Mission (use verbatim): "Heartlines International nurtures the health, hope, and future of underserved mothers and children around the world — meeting real community needs through health, education, and mental-health support, so that every mother and child knows they are seen and valued."
- Program: each cycle, kits for about 100 mothers at a partner maternity clinic in the Philippines: iron (ferrous) tablets bought locally by clinic staff with HINT funds, two health guides (ferrous and mental health, in Tagalog and English, checked by the clinic's medical team), and a handwritten card from a student volunteer. Quarterly cycles are planned. The first cycle is in preparation (fall 2026).
- Contact: heartlinesinternational@gmail.com. Website: www.heartlinesinternational.com.

## Hard rules
- Never delete or edit the `CNAME` file. It connects the custom domain. It stays in the repo root and is copied into the build by `eleventy.config.js`; keep that passthrough.
- Tax wording: "501(c)(3) public charity" and "tax-deductible to the extent allowed by law." Never promise a donor a specific tax result, and never give tax advice.
- Do not name the partner clinic. Use "a partner maternity clinic in the Philippines" until the founders say the clinic agreed to be named.
- Never add bank details, signatures, a home or mailing address, phone numbers, or anyone's personal information.
- Health facts: use only the statistics already cited in the Sources list on about.html (WHO, World Bank/WHO GHO, Cochrane, Bulletin of the WHO). Any new statistic needs a WHO, government, or peer-reviewed source, added to that list with a numbered link. Never give medical advice.
- Don't invent facts, quotes, testimonials, numbers, partners, or results. If something is missing, leave a clearly marked [PLACEHOLDER].
- Dates and history: never estimate a date. Every date on the About timeline is evidence-backed (Feb 2026 trip · Apr 2026 first outreach emails · May 2026 first call with the clinic · May–Aug 2026 drafting · Aug 19, 2026 incorporated · Aug–Sep 2026 clinic review · Oct 2026 IRS, bank, website · Nov 8, 2026 first fundraiser, the Chipotle give-back: $92.71 for HINT per Chipotle's results email, shown with founder approval Nov 10). The timeline shows dates without the year under one "Every date below is in 2026" line; keep entries to one short line each. Ask the founders rather than guessing.
- Donations: links to an outside donation page only. Never build a payment form, cart or checkout, and never collect card details, addresses or phone numbers on our site.
- Strip EXIF/GPS data from every photo before committing it (location data could reveal the clinic).
- Never mention the Eagle Scout project on this site.
- Keep `robots.txt`, `sitemap.xml` and the JSON-LD block in each page's head (it lives in `src/_includes/jsonld.njk`; they help Google show the organization and its founders). Add any new page to `sitemap.xml`.

## Style
- Static HTML and CSS built with Eleventy, the only build tool. Pages are Nunjucks templates in `src/` (`src/about.njk` builds `about.html`); every page shares one header, Donate button and footer from `src/_includes/`, and shared facts (Donate link, email, Instagram, nav) live in `src/_data/site.js`. Static files (`styles.css`, `images/`, `robots.txt`, `sitemap.xml`, `CNAME`) stay in the repo root.
- No client-side JavaScript without the founders' approval. One npm dependency (`@11ty/eleventy`, exact version); adding another needs a stated reason and Josh's approval. Nunjucks autoescaping stays on.
- Preview locally with `npm ci && npm start`. GitHub Actions builds and deploys every push to `main` (`.github/workflows/deploy.yml`).
- Colors: cream #FAF2DC, navy #342D47, pink #F199A4, light pink #F6C3C9, white. The cream page background is a deliberate brand choice by the founders; the impeccable `cream-palette` finding is waived in `.impeccable/config.json`. Don't remove that waiver or change the background without asking.
- Type: headings **Alegreya** (700; 800 for big numbers; 400 and italic 400 for the mission and the handwritten-card line), body **Alegreya Sans** (400, 500, 700, italic 400), both from Google Fonts and set through `--font-display` / `--font-body` in styles.css. Alegreya Sans has no 600 weight; use 500 or 700. Never use Inter, Poppins, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk, Montserrat, Open Sans, Lato or Arial: they are overused AI defaults.
- Avoid the generic "AI template" look: no decorative stripe gradients, colored accent stripes on cards, pill badges above every heading, or tilt/lift hover effects. After `npm run build`, check with `DO_NOT_TRACK=1 npx impeccable@4.5.2 detect _site/` (no findings should be left unexplained).
- Logo at images/logo.png. Chipotle flyers and guides in images/chipotle/, team photos in images/team/ (4:5 portrait, about 640x800 JPG).
- Warm, simple, human. Avoid generic AI-sounding copy, buzzwords, and "futuristic" effects. Large numbers and short sentences make information stand out.
- Mobile-friendly on every page. Check a 390px-wide phone layout.

## Placeholders still open
- Donation link is live: https://www.zeffy.com/en-US/donation-form/support-heartlines-international (every Donate button points there, opening in a new tab). Founder photos are live again (Nov 11, 2026): matching "Official" headshots of Jason and Allison on the same gray background, cropped 4:5 at 640x800, EXIF stripped, Allison's face lighting evened to match Jason's; shown as rounded 4:5 `.headshot` images, and listed as `image` in the JSON-LD. Board row: Joshua Kim (photo still needed) and Hyungjun Ham (intentionally the placeholder) show images/team/profile-placeholder.svg as a 72px circle, smaller because those are supporting roles (Nov 6, 2026).
- Instagram: https://www.instagram.com/heartlinesinternational/ (@heartlinesinternational).
- Chipotle fundraiser held Nov 8, 2026 (Chipotle reports $92.71 for HINT from $370.84 in sales; check expected about Dec 10). Its site mentions and `src/_data/fundraiser.js` were removed in the Nov 10 cleanup. Keep the files in images/chipotle/ until the check arrives. Don't alter Chipotle's official flyer if it's ever added.
