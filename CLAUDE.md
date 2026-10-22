# Heartlines International website: context and rules for Claude Code

Read this before every change. It is the only context you have about this organization.

## Who we are
- Heartlines International (HINT): a California nonprofit public benefit corporation, EIN 42-4681667, incorporated Aug 19, 2026. Federal 501(c)(3) application (Form 1023-EZ) is pending with the IRS.
- Founded by two high school students in San Jose, CA: **Jason Ham** and **Allison Kim**, co-founders and co-presidents. Board: Jason Ham, Allison Kim, Joshua Kim. CFO: Hyungjun Ham.
- Mission (use verbatim): "Heartlines International nurtures the health, hope, and future of underserved mothers and children around the world — meeting real community needs through health, education, and mental-health support, so that every mother and child knows they are seen and valued."
- Program: each cycle, kits for about 100 mothers at a partner maternity clinic in the Philippines: iron (ferrous) tablets bought locally by clinic staff with HINT funds, two health guides (ferrous and mental health, in Tagalog and English, checked by the clinic's medical team), and a handwritten card from a student volunteer. Quarterly cycles are planned. The first cycle is in preparation (fall 2026).
- Contact: heartlinesinternational@gmail.com. Website: www.heartlinesinternational.com.

## Hard rules
- Never delete or edit the `CNAME` file. It connects the custom domain.
- Never write "tax-deductible" until the founders say the IRS determination letter has arrived. Use "501(c)(3) application pending."
- Do not name the partner clinic. Use "a partner maternity clinic in the Philippines" until the founders say the clinic agreed to be named.
- Never add bank details, signatures, a home or mailing address, phone numbers, or anyone's personal information.
- Health facts: use only the statistics already cited in the Sources list on about.html (WHO, World Bank/WHO GHO, Cochrane, Bulletin of the WHO). Any new statistic needs a WHO, government, or peer-reviewed source, added to that list with a numbered link. Never give medical advice.
- Don't invent facts, quotes, testimonials, numbers, partners, or results. If something is missing, leave a clearly marked [PLACEHOLDER].
- Donations: links to an outside donation page only. Never build a payment form.
- Never mention the Eagle Scout project on this site.
- Keep `robots.txt`, `sitemap.xml` and the JSON-LD block in each page's head (they help Google show the organization and its founders). Add any new page to `sitemap.xml`.

## Style
- Plain HTML and CSS only (no frameworks or build step). Every page shares the same header, Donate button, and footer.
- Colors: cream #FAF2DC, navy #342D47, pink #F199A4, light pink #F6C3C9, white. Headings Poppins, body Inter. Logo at images/logo.png. Chipotle flyers and guides in images/chipotle/, team photos in images/team/ (4:5 portrait, about 640x800 JPG).
- Warm, simple, human. Avoid generic AI-sounding copy, buzzwords, and "futuristic" effects. Large numbers and short sentences make information stand out.
- Mobile-friendly on every page. Check a 390px-wide phone layout.

## Placeholders still open
- Donation link (`#DONATION-LINK`, waiting on Zeffy). Photos still needed: Allison Kim (founder card) and Joshua Kim (board row); Hyungjun Ham intentionally uses images/team/profile-placeholder.svg.
- Instagram: https://www.instagram.com/heartlinesinternational/ (@heartlinesinternational).
- Chipotle fundraiser confirmed (Nov 8, 2026, 4–8 PM, 1110 Blossom Hill Rd Ste 30; 25% of supporters' sales; online pickup code RCTR9LP). Remove the home-page Chipotle feature section and the get-involved Chipotle section after Nov 8 (keep the files in images/chipotle/ until the check arrives). Don't alter Chipotle's official flyer if it's ever added.
