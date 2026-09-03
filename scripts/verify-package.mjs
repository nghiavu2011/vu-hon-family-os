import fs from 'node:fs';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const all = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const invalid = Object.entries(all).filter(([, version]) => String(version).includes('latest'));
if (invalid.length) {
  console.error('Invalid latest dependencies:', invalid);
  process.exit(1);
}
console.log('package.json versions pinned enough for npm install.');
