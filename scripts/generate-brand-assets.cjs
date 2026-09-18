const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SOURCE_JPG = 'C:/Users/gokul/.gemini/antigravity/brain/3f8f3fa7-7cce-43f4-a527-b2c2904f86b6/.user_uploaded/media_1789565363998.jpg';

if (!fs.existsSync(SOURCE_JPG)) {
  console.error('Source JPG not found at:', SOURCE_JPG);
  process.exit(1);
}

function safeCopy(src, dst) {
  const dir = path.dirname(dst);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  try {
    fs.writeFileSync(dst, fs.readFileSync(src));
  } catch (err) {
    console.warn(`Warning copying ${src} to ${dst}:`, err.message);
  }
}

console.log('--- Step 1: Updating Base Assets & logoBase64 ---');

const jpgTargets = [
  'packages/ui/src/assets/logo.jpg',
  'apps/website/public/logo.jpg',
  'apps/desktop/public/logo.jpg',
  'apps/mobile/public/logo.jpg',
  'apps/website/dist/logo.jpg',
  'apps/desktop/dist/logo.jpg',
  'apps/mobile/android/app/src/main/assets/public/logo.jpg'
];

for (const target of jpgTargets) {
  safeCopy(SOURCE_JPG, target);
  console.log('Copied logo.jpg ->', target);
}

// 2. Update logoBase64.ts
const jpgBuffer = fs.readFileSync(SOURCE_JPG);
const base64Data = jpgBuffer.toString('base64');
const base64Content = `export const BRAND_LOGO_SRC = 'data:image/jpeg;base64,${base64Data}';\n`;
fs.writeFileSync('packages/ui/src/assets/logoBase64.ts', base64Content, 'utf8');
console.log('Updated packages/ui/src/assets/logoBase64.ts');

console.log('--- Step 2: Generating Standard & Adaptive PNG Resolutions ---');

const tempDir = path.join(process.cwd(), 'scripts', '.temp-icons');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const sizes = [16, 32, 48, 64, 72, 96, 108, 128, 144, 162, 192, 216, 256, 324, 432, 512, 1024];

let psScript = `
Add-Type -AssemblyName System.Drawing

function Resize-Image($src, $dst, $w, $h) {
    $srcImg = [System.Drawing.Image]::FromFile($src)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::FromArgb(3, 7, 18))
    $g.DrawImage($srcImg, 0, 0, $w, $h)
    $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
}

function Create-AdaptiveForeground($src, $dst, $canvasSize) {
    $srcImg = [System.Drawing.Image]::FromFile($src)
    $bmp = New-Object System.Drawing.Bitmap($canvasSize, $canvasSize)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    
    # Safe zone is 66.6% (72/108) of canvas size
    $logoSize = [int]($canvasSize * 0.68)
    $offset = [int](($canvasSize - $logoSize) / 2)
    $g.DrawImage($srcImg, $offset, $offset, $logoSize, $logoSize)
    
    $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
}

function Create-CircularIcon($src, $dst, $size) {
    $srcImg = [System.Drawing.Image]::FromFile($src)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(0, 0, $size, $size)
    $g.SetClip($path)
    $g.DrawImage($srcImg, 0, 0, $size, $size)
    
    $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    $path.Dispose()
    $g.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
}
`;

for (const s of sizes) {
  const dst = path.join(tempDir, `icon_${s}.png`).replace(/\\/g, '/');
  const src = SOURCE_JPG.replace(/\\/g, '/');
  psScript += `Resize-Image '${src}' '${dst}' ${s} ${s}\n`;
}

// Generate adaptive foregrounds (108, 162, 216, 324, 432)
const fgSizes = [108, 162, 216, 324, 432];
for (const s of fgSizes) {
  const dst = path.join(tempDir, `fg_${s}.png`).replace(/\\/g, '/');
  const src = SOURCE_JPG.replace(/\\/g, '/');
  psScript += `Create-AdaptiveForeground '${src}' '${dst}' ${s}\n`;
}

// Generate circular icons for round mipmaps (48, 72, 96, 144, 192)
const roundSizes = [48, 72, 96, 144, 192];
for (const s of roundSizes) {
  const dst = path.join(tempDir, `round_${s}.png`).replace(/\\/g, '/');
  const src = SOURCE_JPG.replace(/\\/g, '/');
  psScript += `Create-CircularIcon '${src}' '${dst}' ${s}\n`;
}

const psPath = path.join(tempDir, 'resize.ps1');
fs.writeFileSync(psPath, psScript, 'utf8');

execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', psPath], { stdio: 'inherit' });
console.log('Generated all PNG & Adaptive sizes in temp directory.');

console.log('--- Step 3: Building Multi-Resolution Windows ICO ---');

function createIco(pngPaths, outIcoPath) {
  const images = pngPaths.map(p => ({
    buffer: fs.readFileSync(p),
    size: parseInt(path.basename(p).match(/\d+/)[0], 10)
  }));

  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let currentOffset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  const imageBuffers = [];

  for (const img of images) {
    const entry = Buffer.alloc(dirEntrySize);
    const width = img.size >= 256 ? 0 : img.size;
    const height = img.size >= 256 ? 0 : img.size;

    entry.writeUInt8(width, 0);
    entry.writeUInt8(height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(currentOffset, 12);

    entries.push(entry);
    imageBuffers.push(img.buffer);
    currentOffset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([header, ...entries, ...imageBuffers]);
  safeCopyIco(icoBuffer, outIcoPath);
  console.log(`Saved multi-res ICO -> ${outIcoPath} (${icoBuffer.length} bytes, ${count} resolutions)`);
}

function safeCopyIco(buf, dst) {
  const dir = path.dirname(dst);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dst, buf);
}

const icoSizes = [256, 128, 64, 48, 32, 16];
const icoPngs = icoSizes.map(s => path.join(tempDir, `icon_${s}.png`));

createIco(icoPngs, 'apps/desktop/public/icon.ico');
createIco(icoPngs, 'apps/desktop/public/logo.ico');
createIco(icoPngs, 'apps/desktop/dist/icon.ico');
createIco(icoPngs, 'apps/website/public/favicon.ico');
if (fs.existsSync('apps/website/dist')) {
  createIco(icoPngs, 'apps/website/dist/favicon.ico');
}

console.log('--- Step 4: Deploying PNGs Across Apps ---');

const png512 = path.join(tempDir, 'icon_512.png');
const png192 = path.join(tempDir, 'icon_192.png');

safeCopy(png512, 'apps/website/public/logo.png');
safeCopy(png192, 'apps/website/public/logo-192.png');
safeCopy(png512, 'apps/website/public/logo-512.png');
safeCopy(png512, 'apps/desktop/public/logo.png');
safeCopy(png512, 'apps/desktop/dist/logo.png');
safeCopy(png512, 'apps/mobile/public/logo.png');
safeCopy(png512, 'apps/mobile/android/app/src/main/assets/public/logo.png');

console.log('--- Step 5: Updating Android Res Icons & Splash ---');

const androidRes = 'apps/mobile/android/app/src/main/res';
if (fs.existsSync(androidRes)) {
  const densityMap = {
    'mipmap-mdpi': { icon: 48, fg: 108 },
    'mipmap-hdpi': { icon: 72, fg: 162 },
    'mipmap-xhdpi': { icon: 96, fg: 216 },
    'mipmap-xxhdpi': { icon: 144, fg: 324 },
    'mipmap-xxxhdpi': { icon: 192, fg: 432 },
  };

  for (const [folder, dims] of Object.entries(densityMap)) {
    const folderPath = path.join(androidRes, folder);
    if (fs.existsSync(folderPath)) {
      safeCopy(path.join(tempDir, `icon_${dims.icon}.png`), path.join(folderPath, 'ic_launcher.png'));
      safeCopy(path.join(tempDir, `round_${dims.icon}.png`), path.join(folderPath, 'ic_launcher_round.png'));
      safeCopy(path.join(tempDir, `fg_${dims.fg}.png`), path.join(folderPath, 'ic_launcher_foreground.png'));
      console.log(`Updated Android icons in ${folder} (standard: ${dims.icon}px, round: ${dims.icon}px, foreground safe-zone: ${dims.fg}px)`);
    }
  }

  const splashDirs = [
    'drawable',
    'drawable-land-hdpi', 'drawable-land-mdpi', 'drawable-land-xhdpi', 'drawable-land-xxhdpi', 'drawable-land-xxxhdpi',
    'drawable-port-hdpi', 'drawable-port-mdpi', 'drawable-port-xhdpi', 'drawable-port-xxhdpi', 'drawable-port-xxxhdpi'
  ];

  for (const d of splashDirs) {
    const p = path.join(androidRes, d, 'splash.png');
    if (fs.existsSync(p)) {
      safeCopy(png512, p);
    }
  }
  console.log('Updated Android splash screens.');
}

fs.rmSync(tempDir, { recursive: true, force: true });
console.log('Asset generation complete and temp directory cleaned.');
