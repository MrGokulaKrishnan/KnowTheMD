# KnowTheMD Android Release Signing Guide

## Overview

Android requires all APKs to be signed before they can be installed on devices.
The debug build (currently in `public/downloads/`) uses Android's built-in debug keystore,
which is acceptable for sideloading but **cannot** be published to the Google Play Store.

This guide documents:
1. Generating a production release keystore
2. Configuring the Android build to use it
3. Setting up CI/CD secrets
4. Signing verification

---

## 1. Generate a Release Keystore (One-Time Setup)

Run this command on a trusted, secure machine. Store the resulting keystore file safely —
**losing it means you can never update the app on the Play Store.**

```bash
keytool -genkey -v \
  -keystore knowthemd-release.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias knowthemd-key \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -dname "CN=KnowTheMD, OU=Mobile, O=KnowTheMD, L=YourCity, S=YourState, C=IN"
```

**Parameters to customize:**
- `YOUR_STORE_PASSWORD` — password for the keystore file itself
- `YOUR_KEY_PASSWORD` — password for the key within the keystore
- `knowthemd-key` — alias name (remember this exactly)
- `CN`, `O`, `L`, `S`, `C` — certificate distinguished name

> **IMPORTANT:** Back up `knowthemd-release.jks` to a secure, offline location (e.g., encrypted USB drive). Never commit it to git.

---

## 2. Configure Local Development Builds

Create `apps/mobile/android/keystore.properties` (already in `.gitignore`):

```properties
storeFile=../app/knowthemd-release.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=knowthemd-key
keyPassword=YOUR_KEY_PASSWORD
```

Copy your keystore to `apps/mobile/android/app/knowthemd-release.jks`.

The `app/build.gradle` release signing config reads from this properties file:

```groovy
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('keystore.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            storeFile file(keystoreProperties['storeFile'] ?: 'debug.keystore')
            storePassword keystoreProperties['storePassword'] ?: ''
            keyAlias keystoreProperties['keyAlias'] ?: 'androiddebugkey'
            keyPassword keystoreProperties['keyPassword'] ?: ''
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

Build the release APK:
```bash
cd apps/mobile/android
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk
```

---

## 3. CI/CD — GitHub Actions Secrets

For the `release.yml` workflow, configure these secrets in your GitHub repository:
(Settings → Secrets and variables → Actions → New repository secret)

| Secret Name | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded keystore file: `base64 -w 0 knowthemd-release.jks` |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password (`storePassword`) |
| `ANDROID_KEY_ALIAS` | Key alias (`knowthemd-key`) |
| `ANDROID_KEY_PASSWORD` | Key password (`keyPassword`) |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (from Firebase Console) |

---

## 4. Verify the Signature

After building a release APK, verify it is properly signed:

```bash
# Using apksigner (bundled with Android SDK build-tools)
apksigner verify --verbose app-release.apk

# Using jarsigner
jarsigner -verify -verbose -certs app-release.apk

# Check certificate details
apksigner verify --print-certs app-release.apk
```

Expected output:
```
Verifies
Verified using v1 scheme (JAR signing): true
Verified using v2 scheme (APK Signature Scheme v2): true
Verified using v3 scheme (APK Signature Scheme v3): true
```

---

## 5. Windows Code Signing (SmartScreen)

### Why SmartScreen Appears

Microsoft SmartScreen shows a "Windows protected your PC" warning for:
- **Unsigned** executables
- **Newly signed** executables from publishers with low reputation
- Executables that haven't been downloaded by enough users

### Code Signing Certificate Options

| Option | Cost | SmartScreen Bypass |
|---|---|---|
| Self-signed | Free | ❌ Still shows warning |
| Organization Validated (OV) certificate | ~$200–500/yr | ⚠️ Warning may persist until reputation builds |
| Extended Validation (EV) certificate | ~$300–800/yr | ✅ Reputation established immediately |

### Recommended: EV Certificate for Production

Purchase an EV code-signing certificate from:
- DigiCert
- Sectigo (Comodo)
- GlobalSign

Configure electron-builder to sign with it:

```json
// In package.json build config
"win": {
  "certificateFile": "path/to/certificate.p12",
  "certificatePassword": "password",
  "signAndEditExecutable": true
}
```

Or via environment variables (preferred for CI):
```yaml
env:
  WIN_CSC_LINK: ${{ secrets.WIN_CSC_LINK }}           # base64 encoded .p12
  WIN_CSC_KEY_PASSWORD: ${{ secrets.WIN_CSC_PASSWORD }}
```

### Important Note on SmartScreen Reputation

Even with a properly signed EV certificate, SmartScreen may show warnings on first launch
until your application has been downloaded by enough users to build reputation with Microsoft.
This is normal behavior. Do **not** instruct users to permanently disable SmartScreen —
instruct them to click "More info" → "Run anyway" if they trust the source.

Over time, with consistent distribution and code signing, the SmartScreen warning will stop appearing.
