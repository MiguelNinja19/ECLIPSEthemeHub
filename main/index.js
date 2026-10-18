// Validates every file in themes/ and builds index.json.
// Usage:  node scripts/build-index.js          -> validate + write index.json
//         node scripts/build-index.js --check  -> validate only (used on pull requests)
const fs = require("fs");
const path = require("path");
 
const ROOT = path.join(__dirname, "..");
const THEMES_DIR = path.join(ROOT, "themes");
const OUT = path.join(ROOT, "index.json");
const checkOnly = process.argv.includes("--check");
 
const errors = [];
const themes = [];
 
for (const file of fs.readdirSync(THEMES_DIR).sort()) {
  if (!file.endsWith(".json")) continue;
  const where = `themes/${file}`;
 
  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.json$/.test(file)) {
    errors.push(`${where}: file name must be lowercase-with-dashes, e.g. digital-hands.json`);
  }
 
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, file), "utf8"));
  } catch (e) {
    errors.push(`${where}: invalid JSON (${e.message})`);
    continue;
  }
 
  const { name, artist, theme } = data;
  if (typeof name !== "string" || !name.trim() || name.length > 40)
    errors.push(`${where}: "name" must be a non-empty string (max 40 chars)`);
  if (typeof artist !== "string" || !artist.trim() || artist.length > 40)
    errors.push(`${where}: "artist" must be a non-empty string (max 40 chars)`);
  if (!theme || typeof theme !== "object" || Array.isArray(theme))
    errors.push(`${where}: "theme" must be the theme object (not a string)`);
  else if (theme.Img !== undefined && !/^\d+$/.test(String(theme.Img)))
    errors.push(`${where}: "theme.Img" must be a numeric asset id`);
 
  if (errors.some((e) => e.startsWith(where))) continue;
 
  themes.push({
    id: file.replace(/\.json$/, ""),
    name: name.trim(),
    artist: artist.trim(),
    img: theme.Img !== undefined ? String(theme.Img) : "",
    json: JSON.stringify(theme), // exact string the animator imports
  });
}
 
const ids = new Set();
for (const t of themes) {
  const key = t.name.toLowerCase();
  if (ids.has(key)) errors.push(`Duplicate theme name: "${t.name}"`);
  ids.add(key);
}
 
if (errors.length) {
  console.error("Theme validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}
 
console.log(`OK: ${themes.length} theme(s) valid.`);
if (!checkOnly) {
  fs.writeFileSync(OUT, JSON.stringify({ count: themes.length, themes }, null, 2) + "\n");
  console.log("Wrote index.json");
}
 
