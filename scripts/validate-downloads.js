#!/usr/bin/env node
/**
 * KnowTheMD — Post-Deploy Download Validation Script
 * ────────────────────────────────────────────────────
 * Verifies that every download URL on the live website:
 *   1. Returns HTTP 200
 *   2. Returns the correct Content-Type (not text/html)
 *   3. Returns the correct Content-Length
 *   4. Downloads a file with the correct SHA-256 checksum
 *
 * Usage:
 *   node scripts/validate-downloads.js [base-url]
 *
 * Example:
 *   node scripts/validate-downloads.js https://knowthemd.com
 *   node scripts/validate-downloads.js http://localhost:5000
 */

import https from 'https';
import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.argv[2] || 'https://knowthemd.com';

// ─── Expected artifacts (must match releases.ts) ──────────────────────────────

const ARTIFACTS = [
  {
    platform: 'Android',
    url: '/downloads/KnowTheMD-1.0.0-android.apk',
    expectedContentType: 'application/vnd.android.package-archive',
    expectedSha256: 'bbf538807a90d58bf17a881f68cdef2de7a21fe94a207355c0a2c803c7b8c339',
    expectedMinSizeBytes: 4_000_000,
    available: true,
  },
  {
    platform: 'Windows x64 Setup Installer (.exe)',
    url: '/downloads/KnowTheMD_Windows_x64_Setup.exe',
    expectedContentType: 'application/vnd.microsoft.portable-executable',
    expectedSha256: '51ff0213afa196b5b92f356c8f99e95c86803027adb09a502a6492e9d0f96c93',
    expectedMinSizeBytes: 80_000_000,
    available: true,
  },
  {
    platform: 'Windows x64 Portable Application (.zip)',
    url: '/downloads/KnowTheMD_Windows_x64.zip',
    expectedContentType: 'application/zip',
    expectedSha256: '1a431a26349a59386d5c42e5c75241f005a94009bd91d2f1e56d2fb2a8f9d2ea',
    expectedMinSizeBytes: 100_000_000,
    available: true,
  },
  // macOS / Linux / iOS: not yet available — test that they do NOT serve index.html
  {
    platform: 'macOS Universal DMG',
    url: '/downloads/KnowTheMD_1.0.0_universal.dmg',
    expectedContentType: null, // should be error page, NOT text/html with SPA content
    expectedSha256: null,
    expectedMinSizeBytes: null,
    available: false,
  },
  {
    platform: 'Linux AppImage',
    url: '/downloads/KnowTheMD_1.0.0_amd64.AppImage',
    expectedContentType: null,
    expectedSha256: null,
    expectedMinSizeBytes: null,
    available: false,
  },
];

// ─── HTTP fetch helper ────────────────────────────────────────────────────────

function fetchWithRedirects(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (maxRedirects === 0) return reject(new Error('Too many redirects'));
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return resolve(fetchWithRedirects(redirectUrl, maxRedirects - 1));
      }

      const hasher = crypto.createHash('sha256');
      let totalBytes = 0;
      const initialChunks = [];
      let initialBytesLen = 0;

      res.on('data', (chunk) => {
        totalBytes += chunk.length;
        hasher.update(chunk);
        if (initialBytesLen < 4096) {
          initialChunks.push(chunk);
          initialBytesLen += chunk.length;
        }
        // Reset timeout on each chunk received so slow downloads don't abort
        req.setTimeout(180000);
      });

      res.on('end', () => {
        const firstBytesBuffer = Buffer.concat(initialChunks);
        resolve({
          status: res.statusCode,
          headers: res.headers,
          firstBytesBuffer,
          totalBytes,
          sha256: hasher.digest('hex'),
          finalUrl: url,
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(180000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

// ─── Validation logic ─────────────────────────────────────────────────────────

async function validateArtifact(artifact) {
  const url = BASE_URL + artifact.url;
  const result = {
    platform: artifact.platform,
    url,
    pass: true,
    checks: [],
  };

  const fail = (msg) => {
    result.pass = false;
    result.checks.push({ status: 'FAIL', message: msg });
  };
  const pass = (msg) => result.checks.push({ status: 'PASS', message: msg });
  const warn = (msg) => result.checks.push({ status: 'WARN', message: msg });

  let response;
  try {
    response = await fetchWithRedirects(url);
  } catch (err) {
    fail(`Network error: ${err.message}`);
    return result;
  }

  // ── Check 1: HTTP status ────────────────────────────────────────────────
  if (artifact.available) {
    if (response.status === 200) {
      pass(`HTTP 200 OK`);
    } else {
      fail(`HTTP ${response.status} (expected 200)`);
      return result;
    }
  } else {
    // Unavailable artifacts should NOT return 200 with HTML content
    if (response.status !== 200) {
      pass(`HTTP ${response.status} — correct for unavailable artifact`);
      return result;
    }
    // If 200, make sure it's not silently serving the SPA
    const ct = (response.headers['content-type'] || '').toLowerCase();
    if (ct.includes('text/html')) {
      // Check if body looks like the KnowTheMD SPA
      const bodyText = response.firstBytesBuffer.toString('utf8', 0, 500);
      if (bodyText.includes('KnowTheMD') && bodyText.includes('<!DOCTYPE')) {
        fail(`CRITICAL: Unavailable artifact URL returned SPA index.html (text/html with KnowTheMD content). Firebase catch-all rewrite is serving the React app instead of a 404/error page.`);
      } else {
        warn(`HTTP 200 with text/html for unavailable artifact — verify this is the error page`);
      }
    }
    return result;
  }

  const contentType = (response.headers['content-type'] || '').toLowerCase();
  const contentLength = parseInt(response.headers['content-length'] || '0', 10);
  const bodySize = response.totalBytes;

  // ── Check 2: Content-Type is NOT text/html ──────────────────────────────
  if (contentType.includes('text/html')) {
    fail(`Content-Type is text/html — server is returning a webpage instead of the binary file. Root cause: Firebase catch-all rewrite or file not deployed.`);
    return result; // No point continuing — we got HTML not a binary
  } else {
    pass(`Content-Type: ${contentType} (not text/html)`);
  }

  // ── Check 3: Content-Type matches expected ──────────────────────────────
  if (artifact.expectedContentType) {
    if (contentType.includes(artifact.expectedContentType.toLowerCase())) {
      pass(`Content-Type matches expected: ${artifact.expectedContentType}`);
    } else {
      warn(`Content-Type "${contentType}" does not match expected "${artifact.expectedContentType}"`);
    }
  }

  // ── Check 4: File size is reasonable ───────────────────────────────────
  const effectiveSize = contentLength > 0 ? contentLength : bodySize;
  if (effectiveSize === 0) {
    fail(`File size is 0 bytes — empty response`);
  } else if (artifact.expectedMinSizeBytes && effectiveSize < artifact.expectedMinSizeBytes) {
    fail(`File size ${effectiveSize} bytes is too small (expected >= ${artifact.expectedMinSizeBytes})`);
  } else {
    pass(`File size: ${(effectiveSize / 1024 / 1024).toFixed(2)} MB`);
  }

  // ── Check 5: First bytes are not HTML ──────────────────────────────────
  const firstBytes = response.firstBytesBuffer.toString('utf8', 0, 15).toLowerCase();
  if (firstBytes.startsWith('<!doctype') || firstBytes.startsWith('<html')) {
    fail(`File content starts with HTML — binary is being replaced by a webpage`);
    return result;
  } else {
    const hexHeader = response.firstBytesBuffer.slice(0, 4).toString('hex').toUpperCase();
    pass(`Binary header: 0x${hexHeader}`);
  }

  // ── Check 6: SHA-256 checksum ───────────────────────────────────────────
  if (artifact.expectedSha256) {
    const actualHash = response.sha256;
    if (actualHash === artifact.expectedSha256) {
      pass(`SHA-256 verified: ${actualHash}`);
    } else {
      fail(`SHA-256 MISMATCH!\n    Expected: ${artifact.expectedSha256}\n    Actual:   ${actualHash}\n    The deployed file differs from the local build artifact!`);
    }
  }

  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║      KnowTheMD Download Validation                      ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = [];
  for (const artifact of ARTIFACTS) {
    process.stdout.write(`Validating [${artifact.platform}]...`);
    const result = await validateArtifact(artifact);
    results.push(result);
    console.log(result.pass ? ' ✅ PASS' : ' ❌ FAIL');
    for (const check of result.checks) {
      const icon = check.status === 'PASS' ? '  ✓' : check.status === 'WARN' ? '  ⚠' : '  ✗';
      console.log(`${icon} ${check.message}`);
    }
    console.log();
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;

  console.log('─'.repeat(60));
  console.log(`Results: ${passed} passed, ${failed} failed out of ${results.length} artifacts`);
  if (failed > 0) {
    console.log('\n⛔ VALIDATION FAILED — do not declare this release ready.\n');
    process.exit(1);
  } else {
    console.log('\n✅ ALL VALIDATIONS PASSED\n');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
