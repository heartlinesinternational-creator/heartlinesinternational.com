// Chipotle fundraiser: Sunday, Nov 8, 2026, 4–8 PM Pacific.
// Every mention of it on the site is wrapped in {% if fundraiser.active %}, so the first
// scheduled build after midnight Pacific on Nov 9 removes all of it (deploy.yml runs daily).
// Preview either state locally: FUNDRAISER=off npm start  ·  FUNDRAISER=on npm start
const endsAt = Date.parse("2026-11-09T08:00:00Z"); // 12:00 AM PST, Nov 9

const override = process.env.FUNDRAISER;

export default {
  active: override === "off" ? false : override === "on" ? true : Date.now() < endsAt,
};
