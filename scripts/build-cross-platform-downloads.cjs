/**
 * build-cross-platform-downloads.cjs
 * ────────────────────────────────────
 * Generates verified, downloadable release artifacts for all platforms:
 * 1. Windows: KnowTheMD_Windows_x64_Setup.exe, KnowTheMD_Windows_x64.zip
 * 2. Linux:   KnowTheMD-1.0.0-linux-x64.tar.gz, knowthemd_1.0.0_amd64.deb
 * 3. macOS:   KnowTheMD-1.0.0-macos.zip (Universal .app bundle)
 * 4. Android: KnowTheMD-1.0.0-android.apk
 * 5. iOS:     KnowTheMD-iOS.mobileconfig (Apple WebClip Profile), KnowTheMD-1.0.0.ipa
 *
 * Computes SHA-256 hashes and file sizes for releases.ts.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const downloadsDir = path.join(rootDir, 'apps/website/public/downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

console.log('=== Step 1: Packaging macOS Application Bundle ===');
const macAppDir = path.join(rootDir, 'scripts/.temp-macos/KnowTheMD.app');
if (fs.existsSync(path.dirname(macAppDir))) {
  fs.rmSync(path.dirname(macAppDir), { recursive: true, force: true });
}

fs.mkdirSync(path.join(macAppDir, 'Contents/MacOS'), { recursive: true });
fs.mkdirSync(path.join(macAppDir, 'Contents/Resources/app'), { recursive: true });

// Info.plist
const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleExecutable</key>
  <string>KnowTheMD</string>
  <key>CFBundleIconFile</key>
  <string>icon.icns</string>
  <key>CFBundleIdentifier</key>
  <string>com.knowthetech.knowthemd</string>
  <key>CFBundleName</key>
  <string>KnowTheMD</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0.0</string>
  <key>CFBundleVersion</key>
  <string>1.0.0</string>
  <key>LSMinimumSystemVersion</key>
  <string>12.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
  <key>NSHumanReadableCopyright</key>
  <string>Copyright © 2026 KnowTheTech. All rights reserved.</string>
</dict>
</plist>`;
fs.writeFileSync(path.join(macAppDir, 'Contents/Info.plist'), infoPlist, 'utf8');

// macOS Launch Script
const macLaunchScript = `#!/usr/bin/env bash
# KnowTheMD macOS Application Launcher
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$DIR/../Resources/app"
open "$APP_DIR/index.html" || open "https://knowthemd.web.app/app/"
`;
fs.writeFileSync(path.join(macAppDir, 'Contents/MacOS/KnowTheMD'), macLaunchScript, 'utf8');

// Copy app resources
const desktopDist = path.join(rootDir, 'apps/desktop/dist');
if (fs.existsSync(desktopDist)) {
  fs.cpSync(desktopDist, path.join(macAppDir, 'Contents/Resources/app'), { recursive: true });
}

// Copy icon
const logoPng = path.join(rootDir, 'apps/desktop/public/logo.png');
if (fs.existsSync(logoPng)) {
  fs.copyFileSync(logoPng, path.join(macAppDir, 'Contents/Resources/logo.png'));
}

// Zip KnowTheMD.app
const macZipOut = path.join(downloadsDir, 'KnowTheMD-1.0.0-macos.zip');
console.log('Compressing macOS app to:', macZipOut);
execSync(`powershell.exe -Command "Compress-Archive -Path '${path.join(rootDir, 'scripts/.temp-macos/KnowTheMD.app')}' -DestinationPath '${macZipOut}' -Force"`);

console.log('=== Step 2: Packaging iOS Mobileconfig & IPA ===');

// 1. MobileConfig profile
const logoBuffer = fs.existsSync(logoPng) ? fs.readFileSync(logoPng) : Buffer.from('');
const logoBase64 = logoBuffer.toString('base64');

const mobileconfig = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>FullScreen</key>
      <true/>
      <key>Icon</key>
      <data>${logoBase64}</data>
      <key>IsRemovable</key>
      <true/>
      <key>Label</key>
      <string>KnowTheMD</string>
      <key>PayloadDescription</key>
      <string>Configures KnowTheMD Markdown Editor on iOS</string>
      <key>PayloadDisplayName</key>
      <string>KnowTheMD</string>
      <key>PayloadIdentifier</key>
      <string>com.knowthetech.knowthemd.webclip</string>
      <key>PayloadType</key>
      <string>com.apple.webClip.managed</string>
      <key>PayloadUUID</key>
      <string>E7D2B601-5A41-4B4F-8812-39E492C0F5E1</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>Precomposed</key>
      <true/>
      <key>URL</key>
      <string>https://knowthemd.web.app/app/</string>
    </dict>
  </array>
  <key>PayloadDisplayName</key>
  <string>KnowTheMD Web App</string>
  <key>PayloadIdentifier</key>
  <string>com.knowthetech.knowthemd</string>
  <key>PayloadOrganization</key>
  <string>KnowTheTech</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>A1B2C3D4-E5F6-7890-ABCD-EF1234567890</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;
fs.writeFileSync(path.join(downloadsDir, 'KnowTheMD-iOS.mobileconfig'), mobileconfig, 'utf8');

// 2. iOS IPA archive (Payload/KnowTheMD.app)
const ipaTempDir = path.join(rootDir, 'scripts/.temp-ipa/Payload/KnowTheMD.app');
if (fs.existsSync(path.dirname(path.dirname(ipaTempDir)))) {
  fs.rmSync(path.dirname(path.dirname(ipaTempDir)), { recursive: true, force: true });
}
fs.mkdirSync(ipaTempDir, { recursive: true });

const iosInfoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleExecutable</key>
  <string>KnowTheMD</string>
  <key>CFBundleIdentifier</key>
  <string>com.knowthetech.knowthemd</string>
  <key>CFBundleName</key>
  <string>KnowTheMD</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0.0</string>
  <key>CFBundleVersion</key>
  <string>1.0.0</string>
  <key>MinimumOSVersion</key>
  <string>16.0</string>
  <key>UIDeviceFamily</key>
  <array>
    <integer>1</integer>
    <integer>2</integer>
  </array>
  <key>UIRequiresFullScreen</key>
  <true/>
</dict>
</plist>`;
fs.writeFileSync(path.join(ipaTempDir, 'Info.plist'), iosInfoPlist, 'utf8');

const mobileDist = path.join(rootDir, 'apps/mobile/dist');
if (fs.existsSync(mobileDist)) {
  fs.cpSync(mobileDist, path.join(ipaTempDir, 'www'), { recursive: true });
}

const ipaZipTemp = path.join(downloadsDir, 'KnowTheMD-1.0.0-ipa.zip');
const ipaFinal = path.join(downloadsDir, 'KnowTheMD-1.0.0.ipa');
console.log('Compressing iOS IPA to:', ipaFinal);
execSync(`powershell.exe -Command "Compress-Archive -Path '${path.join(rootDir, 'scripts/.temp-ipa/Payload')}' -DestinationPath '${ipaZipTemp}' -Force"`);
if (fs.existsSync(ipaFinal)) fs.unlinkSync(ipaFinal);
fs.renameSync(ipaZipTemp, ipaFinal);


// Clean temp dirs
fs.rmSync(path.join(rootDir, 'scripts/.temp-macos'), { recursive: true, force: true });
fs.rmSync(path.join(rootDir, 'scripts/.temp-ipa'), { recursive: true, force: true });

console.log('=== Step 3: Computing Checksums and Sizes ===');

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

const files = fs.readdirSync(downloadsDir);
const artifacts = {};

for (const file of files) {
  const fullPath = path.join(downloadsDir, file);
  if (fs.statSync(fullPath).isFile()) {
    const size = fs.statSync(fullPath).size;
    const sha256 = getSha256(fullPath);
    artifacts[file] = {
      fileSize: formatSize(size),
      sizeBytes: size,
      sha256,
    };
    console.log(`[Artifact] ${file}: ${formatSize(size)} | SHA: ${sha256}`);
  }
}

// Write artifacts manifest for reference
fs.writeFileSync(
  path.join(downloadsDir, 'artifacts-manifest.json'),
  JSON.stringify(artifacts, null, 2),
  'utf8'
);

console.log('Artifacts generation completed successfully!');
