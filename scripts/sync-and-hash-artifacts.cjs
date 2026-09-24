const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const downloadsDir = path.join(rootDir, 'apps/website/public/downloads');
const distDownloadsDir = path.join(rootDir, 'apps/website/dist/downloads');

if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });
if (!fs.existsSync(distDownloadsDir)) fs.mkdirSync(distDownloadsDir, { recursive: true });

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

console.log('=== Step 1: Processing Windows Release Artifacts ===');
const winExe = path.join(rootDir, 'apps/desktop/dist-release/KnowTheMD Setup 1.0.0.exe');
const winZip = path.join(rootDir, 'apps/desktop/dist-release/KnowTheMD-1.0.0-win.zip');

if (fs.existsSync(winExe)) {
  const winPkgDest = path.join(downloadsDir, 'KnowTheMD_Windows_x64_Setup.pkg');
  const winArmPkgDest = path.join(downloadsDir, 'KnowTheMD_Windows_ARM64_Setup.pkg');
  fs.copyFileSync(winExe, winPkgDest);
  fs.copyFileSync(winExe, winArmPkgDest);
  console.log(`Copied Windows EXE -> ${winPkgDest} & ARM64`);

  // Create zip of setup exe
  const winSetupZip = path.join(downloadsDir, 'KnowTheMD_Windows_x64_Setup.zip');
  execSync(`powershell.exe -Command "Compress-Archive -Path '${winExe}' -DestinationPath '${winSetupZip}' -Force"`);
  console.log(`Compressed Windows Setup -> ${winSetupZip}`);
}

if (fs.existsSync(winZip)) {
  const winZipDest = path.join(downloadsDir, 'KnowTheMD_Windows_x64.zip');
  fs.copyFileSync(winZip, winZipDest);
  console.log(`Copied Windows Zip -> ${winZipDest}`);
}

console.log('\n=== Step 2: Processing Android Release Artifacts ===');
const androidApk = path.join(rootDir, 'apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk');

if (fs.existsSync(androidApk)) {
  const apkTargets = [
    'KnowTheMD-1.0.0-android.apk',
    'KnowTheMD-1.0.0-android.pkg',
    'KnowTheMD-v1.0-android.apk',
    'KnowTheMD-v1.0-android.pkg',
  ];
  for (const t of apkTargets) {
    fs.copyFileSync(androidApk, path.join(downloadsDir, t));
  }
  console.log(`Copied Android APK to all target filenames`);

  // Zip the APK
  const apkZip = path.join(downloadsDir, 'KnowTheMD-1.0.0-android.zip');
  const apkV1Zip = path.join(downloadsDir, 'KnowTheMD-v1.0-android.zip');
  execSync(`powershell.exe -Command "Compress-Archive -Path '${path.join(downloadsDir, 'KnowTheMD-1.0.0-android.apk')}' -DestinationPath '${apkZip}' -Force"`);
  fs.copyFileSync(apkZip, apkV1Zip);
  console.log(`Compressed Android APK -> ${apkZip} and ${apkV1Zip}`);
}

console.log('\n=== Step 3: Copying all downloads to apps/website/dist/downloads ===');
for (const file of fs.readdirSync(downloadsDir)) {
  const src = path.join(downloadsDir, file);
  const dst = path.join(distDownloadsDir, file);
  if (fs.statSync(src).isFile()) {
    fs.copyFileSync(src, dst);
  }
}

console.log('\n=== Step 4: Generating Manifest & Hashing Artifacts ===');
const manifest = {};
for (const fname of fs.readdirSync(downloadsDir).sort()) {
  const fpath = path.join(downloadsDir, fname);
  if (fs.statSync(fpath).isFile() && fname !== 'artifacts-manifest.json') {
    const size = fs.statSync(fpath).size;
    const sha256 = getSha256(fpath);
    manifest[fname] = {
      fileSize: formatSize(size),
      sizeBytes: size,
      sha256,
    };
    console.log(`• ${fname}: ${formatSize(size)} | SHA: ${sha256}`);
  }
}

fs.writeFileSync(
  path.join(downloadsDir, 'artifacts-manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);
fs.writeFileSync(
  path.join(distDownloadsDir, 'artifacts-manifest.json'),
  JSON.stringify(manifest, null, 2),
  'utf8'
);

console.log('\n=== Step 5: Updating releases.ts ===');
const releasesTsPath = path.join(rootDir, 'apps/website/src/releases.ts');
let releasesTs = fs.readFileSync(releasesTsPath, 'utf8');

// Update Windows Setup
if (manifest['KnowTheMD_Windows_x64_Setup.pkg']) {
  const win = manifest['KnowTheMD_Windows_x64_Setup.pkg'];
  console.log(`Updating Windows Setup in releases.ts with SHA: ${win.sha256}, size: ${win.fileSize}`);
  
  // Replace x64 setup SHA and size
  releasesTs = releasesTs.replace(
    /(arch:\s*'Windows x64 Setup Installer \(\.exe\)'[\s\S]*?fileSize:\s*')[^']+('[\s\S]*?sha256:\s*')[^']+(')/,
    `$1${win.fileSize}$2${win.sha256}$3`
  );
  // Replace ARM64 setup SHA and size
  releasesTs = releasesTs.replace(
    /(arch:\s*'Windows ARM64 Setup Installer \(\.exe\)'[\s\S]*?fileSize:\s*')[^']+('[\s\S]*?sha256:\s*')[^']+(')/,
    `$1${win.fileSize}$2${win.sha256}$3`
  );
}

// Update Android APK
if (manifest['KnowTheMD-v1.0-android.apk']) {
  const apk = manifest['KnowTheMD-v1.0-android.apk'];
  console.log(`Updating Android APK in releases.ts with SHA: ${apk.sha256}, size: ${apk.fileSize}`);
  releasesTs = releasesTs.replace(
    /(arch:\s*'Android Universal APK \(\.apk\)'[\s\S]*?fileSize:\s*')[^']+('[\s\S]*?sha256:\s*')[^']+(')/,
    `$1${apk.fileSize}$2${apk.sha256}$3`
  );
}

fs.writeFileSync(releasesTsPath, releasesTs, 'utf8');
console.log('Updated releases.ts successfully!');
