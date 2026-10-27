# heartlinesinternational.com

Website for Heartlines International, a California nonprofit public benefit corporation (EIN 42-4681667).
Static HTML and CSS built with [Eleventy](https://www.11ty.dev/), deployed to GitHub Pages by GitHub Actions.

- Pages: `src/index.njk` (Home) · `src/about.njk` · `src/get-involved.njk` · `src/404.njk`. Shared header, footer and JSON-LD: `src/_includes/`. Shared links and facts: `src/_data/site.js`.
- Static files in the repo root, copied as is: `styles.css` · `images/` (logo, `chipotle/`, `team/`) · `robots.txt` · `sitemap.xml` · `CNAME`.
- Preview: `npm ci`, then `npm start` (opens http://localhost:8080). Build only: `npm run build` (writes `_site/`).
- Deploy: every push to `main` runs `.github/workflows/deploy.yml`. Pull requests run a build check (`pr.yml`).
- `CLAUDE.md` holds the editing rules.
- `CNAME` (created by GitHub for the custom domain). Do not delete it.
- Never put private information in this repository (bank details, signatures, home address).
- Tax wording: "501(c)(3) public charity"; gifts are "tax-deductible to the extent allowed by law" (IRS letter dated Oct 15, 2026). Never promise a specific tax result.

## Before the merch shop launches (open, for the CFO)
- **California seller's permit (CDTFA):** selling merch to California buyers generally requires one, even for nonprofits. Confirm whether Fourthwall is the seller of record and collects California sales tax on our orders; decide whether HINT still needs a permit (for example, for in-person sales at events). Plan: `.plans/merch-shop-and-platform-spec.md`.
