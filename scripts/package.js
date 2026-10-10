// Zips exactly the files the extension needs into dueling-book-theme-editor-<version>.zip.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const { version } = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const files = [
  'manifest.json',
  'background.js',
  'contentScript.js',
  'bridge.js',
  'icon16.png',
  'icon32.png',
  'icon48.png',
  'icon128.png',
];
const out = `dueling-book-theme-editor-${version}.zip`;

for (const f of files) {
  if (!fs.existsSync(path.join(root, f))) {
    console.error(`Missing ${f} - run npm run build first.`);
    process.exit(1);
  }
}
fs.rmSync(path.join(root, out), { force: true });

if (process.platform === 'win32') {
  execFileSync('powershell.exe', [
    '-NoProfile',
    '-Command',
    `Compress-Archive -Path ${files.join(',')} -DestinationPath ${out} -Force`,
  ], { cwd: root, stdio: 'inherit' });
} else {
  execFileSync('zip', ['-q', out, ...files], { cwd: root, stdio: 'inherit' });
}
console.log(`Wrote ${out}`);
