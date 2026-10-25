# Merch shop, site platform and security: spec

Status: draft from the founder interview, 2026-10-24
Owner: Joshua Kim (board member; Fourthwall account owner, 18+)
Repo: heartlinesinternational-creator/heartlinesinternational.com (GitHub Pages, custom domain www.heartlinesinternational.com)

---

## 1. Summary

HINT will sell print-on-demand merch through **Fourthwall**. Products are pulled into our own site **at build time** by **Eleventy (11ty)**, which replaces the copy-pasted plain-HTML pages. Buyers browse a `shop.html` page in our own style, then go to Fourthwall's hosted product page and checkout. Card data never touches our site, and the Fourthwall token never reaches the browser. The same move to Eleventy also supports a Markdown blog for cycle updates and a Buttondown newsletter form in the shared footer.

### Correction to the starting assumption
The site does **not** use TypeScript. Today it is 4 hand-written HTML files plus `styles.css`, with no JavaScript, no `package.json` and no build step. Adding features does not require TypeScript. It requires a small **build step** (Eleventy, configured in plain JavaScript) that runs in GitHub Actions. TypeScript or a framework like Astro is only worth it if the site later grows into an app with logins or dashboards. That is out of scope here.

### Decisions made in the interview

| Topic | Decision |
|---|---|
| Fulfillment | Print-on-demand (no inventory, no upfront cost) |
| Vendor | Fourthwall |
| Checkout | Fourthwall hosted product page and checkout, reached from cards on our `shop.html` |
| Product data | Fetched by Eleventy at build time; token kept in a GitHub Actions secret |
| Freshness | Scheduled rebuild every few hours (cron every 4 h) plus push-triggered builds |
| API failure | Keep the last good catalog snapshot; warn Josh; never blank the shop by accident |
| Account owner | Joshua Kim (18+); payouts to HINT's bank account |
| Store access | Shared login, with mitigations (§8.3) |
| Product admin | Founders post products in Fourthwall's dashboard (no code); Josh maintains the site via Claude and git |
| Launch catalog | 4–8 items; designs by the founders |
| Shipping | US only |
| Add-on gift | Yes: Fourthwall's donation option at checkout |
| Impact copy | General statement only (no numbers) |
| Order support | HINT inbox (heartlinesinternational@gmail.com) |
| Navigation | "Shop" in the header nav on every page |
| Site tooling | Eleventy; first step is a migration with identical output |
| Hosting | Stay on GitHub Pages (CSP via `<meta>`) |
| Repo workflow | PRs plus branch protection on `main`; Josh and founders have access |
| Supply chain | Minimal dependencies (Eleventy only) |
| Blog | Markdown files submitted as PRs in GitHub's web editor; Josh reviews |
| Blog photos | Founders decide per post (EXIF/GPS still stripped, §9) |
| Newsletter | Buttondown, plain HTML form in the shared footer |
| Minors | No special age handling (accepted risk, §12) |
| Seller's permit | Flagged in README.md for the CFO (§11) |
| CLAUDE.md | Amend the rules precisely (§10); Josh approves as board member |

### Out of scope
- Building our own cart, payment form or checkout. Card data is never collected on our domain.
- Inventory, shipping labels or packing.
- Logins or accounts on heartlinesinternational.com.
- Moving hosting off GitHub Pages.
- Product structured data (JSON-LD `Product`). This can come later.
- A home-page product teaser (not chosen).

---

## 2. Target architecture

```
 Founders ──(shared login)──▶ Fourthwall dashboard ──▶ products, donations-at-checkout, orders, payouts → HINT bank
                                     │
                                     │  Storefront API (token = GitHub Actions secret)
                                     ▼
 GitHub Actions (push to main · cron every 4 h · manual run)
   npm ci → Eleventy build → validate catalog → upload _site → deploy to GitHub Pages
                                     │
                                     ▼
 www.heartlinesinternational.com  (static HTML/CSS, zero JavaScript)
   index · about · get-involved · shop · updates/* · 404
        │  "Choose size & buy" (new tab)            │ footer signup form (POST)
        ▼                                           ▼
 Fourthwall product page + checkout           Buttondown (double opt-in)
 Zeffy donation form (unchanged)
```

Properties this preserves:
- The live site is still pure static HTML/CSS. It has no client JavaScript, so there is very little for an attacker to exploit.
- No secret ever ships to the browser or appears in the repo.
- If Fourthwall is down, the site still builds and serves the last known catalog.

---

## 3. Phase 0: accounts and prerequisites (before any code)

- [ ] Create the Fourthwall account (owner: Josh) under Heartlines International's name and EIN; payout destination = HINT bank account. Bank details never go into the repo or onto the site.
- [ ] Turn on 2FA for Fourthwall, GitHub (all accounts with repo access), the HINT Gmail, Zeffy, Instagram, Buttondown and the domain registrar.
- [ ] Set up a shared password-manager vault (e.g. Bitwarden free organization) for the shared Fourthwall login (§8.3).
- [ ] Fourthwall settings: shipping = United States only; donations **enabled at checkout only**; donation wording per §7.4; support email = heartlinesinternational@gmail.com.
- [ ] Decide the shop domain: Fourthwall's default subdomain, or a subdomain such as `shop.heartlinesinternational.com`. A subdomain is a DNS record at the registrar; it never involves the repo's `CNAME` file. **[PLACEHOLDER: shop domain]**
- [ ] Create a Storefront token (Fourthwall → Settings → For Developers) and save it as the GitHub Actions secret `FOURTHWALL_STOREFRONT_TOKEN`. Never paste it into a file, issue, PR or chat.
- [ ] Create the Buttondown account (owner: HINT Gmail); turn on double opt-in.
- [ ] CFO: resolve the seller's-permit question (§11).
- [ ] Founders design the 4–8 launch items and publish them in Fourthwall. **[PLACEHOLDER: launch lineup and prices]**

---

## 4. Phase 1: Eleventy migration with identical output

Goal: the built site is **byte-for-byte the same** as today's pages (whitespace-only differences allowed). No visual or copy changes in this PR. The 8 open code-review findings are fixed in separate PRs afterward.

### 4.1 Layout
```
eleventy.config.js        # ESM; input "src", output "_site"
package.json              # one dependency: @11ty/eleventy (exact version pinned)
package-lock.json         # committed
.nvmrc                    # Node LTS (22)
src/
  _includes/
    base.njk              # <head> (meta, fonts, icons, og, JSON-LD), header, footer
    header.njk
    footer.njk
  _data/
    site.js               # name, url, email, Zeffy URL, Instagram URL, EIN, legal line
  index.njk               # permalink: index.html
  about.njk               # permalink: about.html
  get-involved.njk        # permalink: get-involved.html
  404.njk                 # permalink: 404.html
styles.css, images/, robots.txt, sitemap.xml, CNAME   # passthrough copy, unchanged
```
- Keep all existing URLs (`/about.html`, etc.). No redirects needed.
- `aria-current="page"` comes from `page.url`, matching today's markup exactly.
- Per-page `title`, `description`, `og:*` come from front matter.
- The JSON-LD block stays in every page's head, through the shared layout (CLAUDE.md rule).
- `CNAME` stays in the repo root, untouched, and is passthrough-copied into `_site`. Note: once Pages deploys through GitHub Actions, the custom domain lives in repo Settings → Pages. Confirm it still shows `www.heartlinesinternational.com` after the switch.
- Nunjucks autoescape stays **on** (the Eleventy default). Never turn it off.

### 4.2 Deploy pipeline
- `.github/workflows/deploy.yml`: triggers `push` to `main`, `schedule` (`0 */4 * * *`), `workflow_dispatch`.
- Permissions: `contents: read`, `pages: write`, `id-token: write`, and nothing else. `concurrency: pages` (no overlapping deploys).
- Steps: checkout → setup-node (from `.nvmrc`) → `npm ci --ignore-scripts` → `npx @11ty/eleventy` → upload-pages-artifact (`_site`) → deploy-pages.
- `.github/workflows/pr.yml`: on `pull_request`, build only, **without the Fourthwall secret**. It uses the snapshot or seed (§5.3). PR code (including founders' blog PRs) never has access to the token.
- Repo Settings → Pages → Source: switch from "Deploy from a branch" to "GitHub Actions" **in the same session** as merging, then check the live site right away.

### 4.3 Branch protection (ruleset on `main`)
- Require a pull request before merging; 1 approval (Josh). Josh may bypass for emergencies.
- Require the `pr.yml` build check to pass.
- Block force pushes and branch deletion.

### 4.4 Acceptance
- `npm run verify:parity`, a small script, compares each `_site/*.html` with the version at the pre-migration commit and fails on any non-whitespace difference.
- Live check after deploy: all pages load, custom domain and HTTPS work, the 404 page works, PDFs open, Donate goes to Zeffy in a new tab.
- 390px phone check on every page.

---

## 5. Phase 2: shop

### 5.1 Catalog data (`src/_data/catalog.js`)
- Uses Node's built-in `fetch` (no extra dependency) against `https://storefront-api.fourthwall.com/v1/...` with `storefront_token` from `process.env.FOURTHWALL_STOREFRONT_TOKEN`.
- **Verify against the Storefront API reference before coding:** the exact product and collection endpoints, pagination, the product-page URL format, the image CDN hostname, and how sold-out or availability is represented. The public overview only documents `GET /v1/collections`. **[PLACEHOLDER: confirmed endpoints]**
- Normalize every product to this shape and **drop** any product that fails validation (logging why):
  ```
  { id, name, slug, priceCents, currency: "USD", priceLabel, imageUrl, imageAlt, productUrl, available, summary }
  ```
- Validation rules (API data is untrusted input):
  - `productUrl` must be `https://` on the confirmed Fourthwall shop host (or our shop subdomain). Anything else is rejected.
  - `imageUrl` must be `https://` on the confirmed Fourthwall image CDN host.
  - `summary`: strip all HTML tags, collapse whitespace, trim to ~160 characters. Product descriptions are never rendered as HTML (this avoids a sanitizer dependency).
  - `name` ≤ 80 characters; price must be a positive integer number of cents in USD.
- All output goes through Nunjucks autoescaping. No `| safe` on catalog fields, ever.

### 5.2 Never blank the shop by accident
Resolution order inside `catalog.js`:
1. **Fresh**: the API call succeeds with ≥ 1 valid product → use it and write `.cache/catalog.json`.
2. **Snapshot**: the API fails, times out (10 s), or returns 0 valid products → use `.cache/catalog.json`, which `actions/cache` restores from the last successful run.
3. **Seed**: no snapshot → use the committed `src/_data/catalog.seed.json` (empty array) → the shop renders the "coming soon" state (§5.4).

The module records which source it used in `catalog-status.txt`, outside `_site`. After deploy, a final step runs **if the status is not `fresh`** and exits non-zero. GitHub then emails a failure notice while the site stays up. (Scheduled-run failure emails go to the user who last edited the cron line, which should be Josh.)

If a founder deliberately removes every product, the build keeps showing the snapshot. In that case Josh empties the snapshot by running the workflow manually with an input `allow_empty_catalog: true`.

### 5.3 PR builds
`pr.yml` has no token, so it always uses the seed or a snapshot. Shop markup is checked with fixture data at `src/_data/catalog.fixture.json` when `CATALOG_FIXTURE=1`, with 6 realistic fake products **that never deploy**.

### 5.4 `shop.html` UX
- Page title "Shop"; one short intro sentence plus the general impact statement:
  "Every purchase helps fund health kits for mothers at a partner maternity clinic in the Philippines."
  No numbers, no "100% of", no "tax-deductible".
- **Grid** sized for 4–8 items: 2 columns at 390px, 3 at tablet, 4 at desktop; also works from 1 to ~12 items. No filters at this size.
- **Card**: product image (square, `loading="lazy"`, `width`/`height` set to avoid layout shift, alt text = product name), name (Poppins), price large and plain (e.g. `$25`), and a button "Choose size & buy" → `productUrl`, `target="_blank" rel="noopener"`. This matches the Donate button.
- **Sold out**: card stays visible, button replaced by a muted "Sold out" label.
- Below the grid, short plain lines:
  - "Checkout is handled by Fourthwall. Ships within the US."
  - "You can add an optional gift to HINT at checkout."
  - "Questions about an order? Email heartlinesinternational@gmail.com with your order number."
- **Coming-soon state** (0 products): "Our first merch is on the way." plus links to Instagram and the Donate button.
- Brand colors and fonts only; no new visual effects. Text on white must meet WCAG AA (pink `#F199A4` for borders and accents only, not small text).

### 5.5 Site-wide changes in this phase
- Header nav on every page: Home · About · Get Involved · **Shop**, then the Donate button. Check at 390px; if it wraps badly, tighten `.nav a.link` padding rather than hiding links.
- Footer "Explore" column gets a Shop link.
- `sitemap.xml` becomes generated from the pages collection so new pages are never missed. `shop.html` must appear in it (CLAUDE.md rule).
- Move the 5 inline `style="…"` attributes (about 1, get-involved 2, index 1, 404 1) into classes in `styles.css`, so the CSP (§8.1) needs no `'unsafe-inline'`.
- Add the `<meta>` CSP to the base layout (§8.1).

### 5.6 Acceptance
- With the real token, the deployed shop lists the published Fourthwall products, and every link opens the correct Fourthwall product page.
- Disconnecting the token (e.g. a bad value in a test run) still deploys the snapshot catalog, and Josh receives the failure email.
- A product with a script tag or HTML in its description renders as plain text.
- A product whose URL points to an unexpected host does not appear.
- The 390px layout passes; Lighthouse accessibility ≥ 95 on `shop.html`.

---

## 6. Phase 3: newsletter (Buttondown)

- A one-field form in the shared footer on every page: label "Get updates by email", email input (`type="email"`, `required`, `autocomplete="email"`), and a Subscribe button.
- A plain HTML `POST` to Buttondown's embed-subscribe endpoint; copy the exact `action` URL from the Buttondown dashboard. **[PLACEHOLDER: Buttondown form action URL]** No Buttondown JavaScript.
- Double opt-in on, so Buttondown sends the confirmation email. One line under the field: "We'll only email about HINT. Unsubscribe anytime."
- Buttondown's own spam protection; no CAPTCHA script on our site.
- CSP `form-action` allows only Buttondown's host (§8.1).
- Check the current Buttondown free-tier limits before launch. **[PLACEHOLDER: plan/limits]**

---

## 7. Phase 4: updates blog, plus content rules for the shop and blog

### 7.1 Blog structure
- Posts live in `src/updates/YYYY-MM-DD-slug.md`. URLs are `/updates/slug/`, and the index is `/updates/`.
- Front matter: `title`, `date` (the actual publication date; never estimated), `summary`, optional `cover` and `coverAlt`.
- The index lists posts newest first. Each post ends with the footer signup form (already in the footer).
- New posts are added to the generated sitemap automatically.
- Header placement: the nav already has 4 links plus Donate at 390px, so Updates goes in the footer "Explore" column and gets a link from the About page. Revisit the header once there are several posts. **[PLACEHOLDER: header decision]**
- Name "Updates" is a working title. **[PLACEHOLDER: final name]**

### 7.2 Authoring workflow
1. A founder opens GitHub → `src/updates/` → "Add file", writes Markdown, and uploads photos to `images/updates/`.
2. Commits to a new branch and opens a PR. The PR template checklist (below) appears.
3. The `pr.yml` build must pass. Josh reviews and merges, and the site deploys.

Markdown allows raw HTML (Eleventy default). That is acceptable because every post goes through PR review, but reviewers reject any `<script>`, `<iframe>`, or `on…=` attribute.

### 7.3 PR template checklist (`.github/pull_request_template.md`)
- [ ] The partner clinic is not named, and no photo shows signage, uniforms, documents or anything else that identifies it.
- [ ] Photo EXIF/GPS data is stripped (§9); founders approved any faces shown.
- [ ] No "tax-deductible" (501(c)(3) application still pending).
- [ ] No new statistic unless it comes from a WHO, government or peer-reviewed source and is added to the Sources list on about.html.
- [ ] No invented quotes, numbers, results or dates; anything missing is marked [PLACEHOLDER].
- [ ] No phone numbers, addresses, bank details or personal information.
- [ ] No mention of the Eagle Scout project.
- [ ] Checked at 390px.

### 7.4 Wording rules for the shop and donations
- Allowed: "Every purchase helps fund health kits for mothers at a partner maternity clinic in the Philippines."
- Allowed for the gift at checkout: "Add an optional gift to Heartlines International." Fourthwall's donation prompt text must not say "tax-deductible" or "tax receipt".
- Not allowed until confirmed by the founders and CFO: "100% of profits", per-item equivalences ("one shirt = …"), or any dollar or kit totals.
- CFO note: gifts made through Fourthwall checkout are a second donation channel, separate from Zeffy, and must be recorded separately.

---

## 8. Security

### 8.1 Content-Security-Policy (in the base layout `<meta>`)
GitHub Pages cannot send custom HTTP headers, so the policy goes in a `<meta http-equiv="Content-Security-Policy">` tag:
```
default-src 'self';
script-src 'none';
style-src 'self' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com;
img-src 'self' https://[PLACEHOLDER: Fourthwall image CDN host];
form-action https://buttondown.com;
base-uri 'self';
object-src 'none';
upgrade-insecure-requests
```
- `script-src 'none'` is possible because the site has no JavaScript. JSON-LD blocks are data, not executed scripts, so they are unaffected.
- Known gaps from staying on GitHub Pages (accepted): no `frame-ancestors` (a `<meta>` CSP can't set it, so no clickjacking protection), no HSTS preload, and no `Referrer-Policy` header. Add `<meta name="referrer" content="strict-origin-when-cross-origin">` as a partial substitute. With no logins or forms that act on the user's behalf, clickjacking risk is low.
- Repo Settings → Pages → **Enforce HTTPS** must stay on.

### 8.2 Secrets and CI
- One secret, `FOURTHWALL_STOREFRONT_TOKEN`, used only by `deploy.yml` on `main`. It is never exposed to PR builds.
- Turn on GitHub secret scanning and push protection (free for public repos); this costs nothing and stops an accidental token commit.
- Token rotation: rotate in Fourthwall and update the secret whenever someone with repo admin or Fourthwall access steps away, or if it ever appears anywhere public.
- Workflow permissions are least privilege (§4.2). Only first-party GitHub actions (`actions/*`) are used.

### 8.3 Shared Fourthwall login (chosen, with mitigations)
- Long random password stored only in the shared password-manager vault; nobody keeps it in notes or texts.
- 2FA is on, with the authenticator held by Josh (the account owner), so every login needs Josh's code.
- Rotate the password whenever anyone's role ends.
- Payout and bank settings are changed only by Josh.
- Accepted risk: no per-person audit trail. Revisit if more than 3 people need access. Check whether Fourthwall's plan supports separate team logins.
- Customer data (names, shipping addresses, emails) is visible to anyone with the login. It is handled only inside Fourthwall and the HINT inbox, and is never copied into the repo, the site, spreadsheets in shared drives, or chats.

### 8.4 Supply chain
- One runtime/build dependency: `@11ty/eleventy`, with its exact version pinned and `package-lock.json` committed.
- `npm ci --ignore-scripts` in CI.
- Any new dependency needs a reason in the PR description and Josh's approval.
- Optional, not chosen now: Dependabot, pinning actions to commit SHAs, and a CI scanner that blocks banned words or domains. Revisit if more contributors join.

### 8.5 Threat model (short)

| Threat | Mitigation |
|---|---|
| Card skimming or fake checkout on our site | No checkout on our domain; `script-src 'none'`; links go only to validated Fourthwall hosts |
| Malicious content in product data (XSS) | HTML stripped from descriptions, autoescape on, URL host allowlist |
| Token leak | Build-time only, Actions secret, never given to PRs, push protection, rotation |
| Someone pushes a defaced page | Branch protection; PR review; 2FA on every GitHub account |
| Store account takeover | Strong vaulted password, 2FA held by the owner, rotation, owner-only payout settings |
| Domain hijack | `CNAME` untouched; registrar 2FA; Pages custom domain verified in GitHub settings |
| Fourthwall outage blanks the shop | Snapshot fallback plus failure email |
| Photos reveal the clinic or patients | EXIF/GPS stripping plus the PR checklist |

---

## 9. Images
- Strip EXIF and GPS from every uploaded photo before committing (macOS: export from Preview or Photos with location removed, or `exiftool -all= file.jpg`). This is required because GPS data could reveal the clinic, which CLAUDE.md says must stay unnamed.
- Team photos keep their existing format (4:5 portrait, about 640×800 JPG). Update photos are ≤ 1600 px wide JPG.
- Product images are served by Fourthwall's CDN, not stored in the repo.

---

## 10. Proposed CLAUDE.md amendments (Josh approves; apply in the Phase 1 PR)

Replace under **Style**:
> Plain HTML and CSS only (no frameworks or build step).

with:
> Static HTML and CSS built with Eleventy (the only build tool). Pages are Nunjucks templates in `src/` sharing one header, footer and Donate button through `src/_includes/`. No client-side JavaScript without the founders' approval; the CSP uses `script-src 'none'`. Only one npm dependency (`@11ty/eleventy`); adding another needs a stated reason and Josh's approval.

Replace under **Hard rules**:
> Donations: links to an outside donation page only. Never build a payment form.

with:
> Donations and purchases: link to outside hosted pages only (Zeffy for donations, Fourthwall for merch checkout). Never build a payment form, cart or checkout, and never collect card details, addresses or phone numbers on our site. The only form on the site is the Buttondown email signup.

Add under **Hard rules**:
> - The Fourthwall token lives only in the GitHub Actions secret `FOURTHWALL_STOREFRONT_TOKEN`. Never write it to a file, log, commit, PR or chat.
> - Product data from Fourthwall is untrusted: keep HTML stripped, URLs host-checked and autoescaping on. Never use `| safe` on catalog fields.
> - Shop copy may only say "Every purchase helps fund health kits for mothers at a partner maternity clinic in the Philippines." No profit percentages or per-item equivalences until the founders and CFO confirm them.
> - Strip EXIF/GPS from every photo before committing it.
> - Keep the `CNAME` file in the repo root and passthrough-copied into the build.

Update **Placeholders still open** with: shop domain, Buttondown form action, Fourthwall image CDN host, launch lineup.

Update README.md's description ("Plain HTML and CSS, hosted on GitHub Pages") to describe Eleventy, `npm ci && npx @11ty/eleventy --serve` for local preview, and the GitHub Actions deploy.

---

## 11. Legal and finance items for the CFO (flagged in README.md)
- **California seller's permit (CDTFA).** Selling tangible goods to California buyers generally requires one, even for nonprofits. First confirm whether Fourthwall acts as the seller or merchant of record and collects and remits California sales tax on our orders. If it does, a permit may not be needed for online sales, but it may still be needed for any in-person merch sales at events. Decide before the shop launches.
- Record Fourthwall payouts (merch profit) and Fourthwall checkout gifts as separate lines from Zeffy donations.
- Merch revenue is related to the mission, but the CFO should confirm how it is reported on the organization's annual filings.

---

## 12. Accepted risks (recorded so they are revisited, not forgotten)
- **No age handling on forms.** Many signups may be high schoolers. We rely on Buttondown's and Fourthwall's terms. If the audience skews under 13 (for example, a middle-school card-writing drive), add a 13+ notice and a privacy page.
- **Blog photo policy is decided per post** by the founders. Faces of mothers or patients are a consent question for the clinic. EXIF stripping and the no-identifying-signage rule still apply.
- **Shared store login** (§8.3).
- **GitHub Pages header limits** (§8.1).

---

## 13. Rollout order (no dates set; each step is one PR)
1. Phase 0 checklist complete (accounts, 2FA, vault, token secret, CFO answer on the seller's permit).
2. Phase 1: Eleventy migration with identical output, deploy workflow, branch protection, CLAUDE.md and README updates.
3. Fixes for the open code-review findings on the timeline and favicon (separate PR on the new structure).
4. Phase 2: shop page, nav link, generated sitemap, inline styles moved to classes, CSP.
5. Founders publish the launch items in Fourthwall → the next scheduled build shows them → founders review the live shop on phones.
6. Phase 3: Buttondown footer form.
7. Phase 4: updates blog, PR template, first post.

## 14. Open placeholders
- [PLACEHOLDER: shop domain] (Fourthwall default subdomain or `shop.heartlinesinternational.com`)
- [PLACEHOLDER: confirmed Storefront API endpoints, product URL format, image CDN host]
- [PLACEHOLDER: launch lineup and prices] (4–8 items, founder designs)
- [PLACEHOLDER: Buttondown form action URL and plan limits]
- [PLACEHOLDER: blog section name and header placement]
- CFO answer on the seller's permit and sales tax (§11)
