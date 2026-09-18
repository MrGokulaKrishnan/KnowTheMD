const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

function formatSize(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const distRelease = path.resolve('apps/desktop/dist-release');
const exePath = path.join(distRelease, 'KnowTheMD Setup 1.0.0.exe');
const zipPath = path.join(distRelease, 'KnowTheMD-1.0.0-win.zip');

if (!fs.existsSync(exePath)) {
  console.error('NSIS exe not found yet at:', exePath);
  process.exit(1);
}

const exeBytes = fs.statSync(exePath).size;
const exeSha256 = getSha256(exePath);
const exeSizeFormatted = formatSize(exeBytes);

console.log('--- Windows EXE Installer ---');
console.log('Path:', exePath);
console.log('Size:', exeBytes, 'bytes (' + exeSizeFormatted + ')');
console.log('SHA-256:', exeSha256);

// Copy to website downloads
const targets = [
  { src: exePath, dst: 'apps/website/public/downloads/KnowTheMD_Windows_x64_Setup.pkg' },
  { src: exePath, dst: 'apps/website/dist/downloads/KnowTheMD_Windows_x64_Setup.pkg' }
];

if (fs.existsSync(zipPath)) {
  const zipBytes = fs.statSync(zipPath).size;
  const zipSha256 = getSha256(zipPath);
  const zipSizeFormatted = formatSize(zipBytes);
  console.log('\n--- Windows ZIP Archive ---');
  console.log('Path:', zipPath);
  console.log('Size:', zipBytes, 'bytes (' + zipSizeFormatted + ')');
  console.log('SHA-256:', zipSha256);

  targets.push({ src: zipPath, dst: 'apps/website/public/downloads/KnowTheMD_Windows_x64.zip' });
  targets.push({ src: zipPath, dst: 'apps/website/dist/downloads/KnowTheMD_Windows_x64.zip' });
}

for (const t of targets) {
  const dir = path.dirname(t.dst);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(t.src, t.dst);
  console.log(`Copied ${t.src} -> ${t.dst}`);
}

console.log('\nRelease artifacts prepared successfully!');
