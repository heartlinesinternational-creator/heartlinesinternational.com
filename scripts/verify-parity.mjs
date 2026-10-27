// One-time migration check: the Eleventy build must match the hand-written pages
// at the pre-migration commit. Whitespace-only differences are allowed.
// Usage: node scripts/verify-parity.mjs [git-ref]   (default: 06c0d5d)
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ref = process.argv[2] || "06c0d5d";
const pages = ["index.html", "about.html", "get-involved.html", "404.html"];
const squash = (s) => s.replace(/\s+/g, " ").trim();

let failed = false;
for (const page of pages) {
  const before = execFileSync("git", ["show", `${ref}:${page}`], { encoding: "utf8" });
  const after = readFileSync(`_site/${page}`, "utf8");
  if (before === after) {
    console.log(`identical   ${page}`);
  } else if (squash(before) === squash(after)) {
    console.log(`whitespace  ${page}`);
  } else {
    failed = true;
    const a = squash(before), b = squash(after);
    let i = 0;
    while (a[i] === b[i]) i++;
    console.log(`DIFFERENT   ${page}\n  before: …${a.slice(Math.max(0, i - 60), i + 80)}\n  after:  …${b.slice(Math.max(0, i - 60), i + 80)}`);
  }
}
process.exit(failed ? 1 : 0);
