const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const app = path.join(root, 'app');
const required = ['index.html','main.js','manifest.json','sw.js','styles/tokens.css','lib/storage.js','assets/icon-192.png','assets/icon-512.png'];
const errors = [];
for (const rel of required) if (!fs.existsSync(path.join(app, rel))) errors.push(`Missing required file: app/${rel}`);
const html = fs.readFileSync(path.join(app, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
  const ref = match[1].split('?')[0];
  if (/^(https?:|data:|#|\/\/)/i.test(ref)) continue;
  const local = path.join(app, decodeURIComponent(ref.replace(/^\.\//,'')));
  if (!fs.existsSync(local)) errors.push(`Missing local HTML resource: ${ref}`);
}
const manifest = JSON.parse(fs.readFileSync(path.join(app, 'manifest.json'), 'utf8'));
for (const icon of manifest.icons || []) {
  if (!fs.existsSync(path.join(app, icon.src))) errors.push(`Missing manifest icon: ${icon.src}`);
}
const sw = fs.readFileSync(path.join(app, 'sw.js'), 'utf8');
if (!sw.includes('CACHE_VERSION') || !sw.includes("key.startsWith(CACHE_PREFIX)")) errors.push('Service worker cache versioning/cleanup guard missing');
const shellMatch = sw.match(/const APP_SHELL = (\[[\s\S]*?\]);/);
if (!shellMatch) errors.push('Service worker app shell list missing');
else {
  for (const asset of JSON.parse(shellMatch[1])) {
    const rel = asset.replace(/^\.\//, '');
    if (!fs.existsSync(path.join(app, rel))) errors.push(`Missing Service Worker asset: ${asset}`);
  }
}
for (const size of [192,512]) {
  const iconPath = path.join(app, `assets/icon-${size}.png`);
  if (fs.existsSync(iconPath)) {
    const sig = fs.readFileSync(iconPath).subarray(0,8).toString('hex');
    if (sig !== '89504e470d0a1a0a') errors.push(`Icon is not a real PNG: assets/icon-${size}.png`);
  }
}
const publicRoot = path.join(root, 'public');
for (const rel of ['index.html','main.js','manifest.json','sw.js']) {
  if (fs.readFileSync(path.join(app, rel), 'utf8') !== fs.readFileSync(path.join(publicRoot, rel), 'utf8')) errors.push(`app/public mismatch: ${rel}`);
}
// Regression checks for recent data-safety and dashboard improvements.
const storageSource = fs.readFileSync(path.join(app, 'lib/storage.js'), 'utf8');
const settingsSource = fs.readFileSync(path.join(app, 'lib/settings.js'), 'utf8');
const backupSource = fs.readFileSync(path.join(app, 'lib/cloud.js'), 'utf8');
const notificationsSource = fs.readFileSync(path.join(app, 'lib/notifications.js'), 'utf8');
const diarySource = fs.readFileSync(path.join(app, 'screens/memories.js'), 'utf8');
if (!storageSource.includes('export function localDateKey')) errors.push('Local-time date helper missing');
if (!settingsSource.includes("set(key, value) { return Storage.set('set_' + key, value); }")) errors.push('Settings persistence key prefix regression');
if (!backupSource.includes('storage,') || !backupSource.includes('restoredKeys') || !backupSource.includes("key.startsWith(PREFIX)")) errors.push('Complete, scoped backup/restore safeguards missing');
if (notificationsSource.includes('requestPermission();\n    Notifications.show')) errors.push('Notifications must not request permission automatically at startup');
if (!diarySource.includes('ommyStartVoiceDiary') || !diarySource.includes('ommyFilterMemories')) errors.push('Voice dictation/search diary feature missing');
const androidPublic = path.join(root, 'android/app/src/main/assets/public');
for (const rel of ['index.html','main.js','sw.js','lib/cloud.js','lib/storage.js','screens/memories.js','styles/design.css']) {
  if (!fs.existsSync(path.join(androidPublic, rel))) errors.push(`Missing Android embedded asset: ${rel}`);
  else if (fs.readFileSync(path.join(app, rel), 'utf8') !== fs.readFileSync(path.join(androidPublic, rel), 'utf8')) errors.push(`Android embedded asset mismatch: ${rel}`);
}
if (errors.length) { console.error('Ommi regression tests FAILED:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log(`Ommi tests passed: ${required.length} core files, local HTML references, manifest icons, SW safeguards, local dates, settings persistence, scoped backup/restore, voice diary, Android asset sync.`);
