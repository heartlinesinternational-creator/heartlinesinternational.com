export default function (eleventyConfig) {
  // Static files stay in the repo root, unchanged. CNAME must be copied so the custom domain keeps working.
  for (const path of ["styles.css", "images", "robots.txt", "sitemap.xml", "CNAME"]) {
    eleventyConfig.addPassthroughCopy(path);
  }
  // Nunjucks autoescaping stays on (the Eleventy default). Never turn it off.
}

export const config = {
  dir: { input: "src", output: "_site" },
  templateFormats: ["njk", "md"],
  markdownTemplateEngine: "njk",
};
