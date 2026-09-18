import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const desktopDist = path.resolve(__dirname, '../apps/desktop/dist');
const websiteDistApp = path.resolve(__dirname, '../apps/website/dist/app');

if (fs.existsSync(desktopDist)) {
  fs.mkdirSync(websiteDistApp, { recursive: true });
  fs.cpSync(desktopDist, websiteDistApp, { recursive: true });
  console.log('✅ Successfully copied apps/desktop/dist to apps/website/dist/app');
} else {
  console.log('ℹ️ apps/desktop/dist not found, skipping copy.');
}
