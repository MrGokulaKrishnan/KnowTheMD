"""
scripts/update-apk-icon.py
──────────────────────────
Generates pixel-perfect square icons with 10% corner radius from logo.png,
updates Android resources, replaces APK internal icons, and signs the APK.
"""

import os
import sys
import shutil
import zipfile
import subprocess
import hashlib
from PIL import Image, ImageDraw

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
LOGO_SRC = os.path.join(ROOT_DIR, 'apps', 'mobile', 'public', 'logo.png')
RES_DIR = os.path.join(ROOT_DIR, 'apps', 'mobile', 'android', 'app', 'src', 'main', 'res')
DOWNLOADS_DIR = os.path.join(ROOT_DIR, 'apps', 'website', 'public', 'downloads')
DIST_DOWNLOADS = os.path.join(ROOT_DIR, 'apps', 'website', 'dist', 'downloads')

print("=== Generating Square Logo with 15% Corner Radius ===")

def create_square_15pct_icon(source_img, size):
    """
    Creates an icon resized to `size x size` with a 15% corner radius
    using 4x supersampled anti-aliasing. Outer corners are transparent.
    """
    w, h = size, size
    radius = int(round(w * 0.15))
    scale = 4

    # 4x supersampled mask
    mask_scale = Image.new('L', (w * scale, h * scale), 0)
    draw = ImageDraw.Draw(mask_scale)
    draw.rounded_rectangle([0, 0, w * scale - 1, h * scale - 1], radius=radius * scale, fill=255)
    mask = mask_scale.resize((w, h), Image.Resampling.LANCZOS)

    # Resize source image
    img_resized = source_img.resize((w, h), Image.Resampling.LANCZOS).convert('RGBA')

    # Apply rounded mask
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    out.paste(img_resized, (0, 0), mask=mask)
    return out

def create_adaptive_foreground(source_img, canvas_size, icon_size):
    """
    Creates a 108dp canvas with transparent padding, placing the
    15% corner radius square icon centered in the safe area.
    """
    icon = create_square_15pct_icon(source_img, icon_size)
    fg = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    offset = (canvas_size - icon_size) // 2
    fg.paste(icon, (offset, offset), mask=icon)
    return fg

source_image = Image.open(LOGO_SRC).convert('RGBA')

DENSITIES = {
    'mdpi': {'launcher': 48, 'fg_canvas': 108, 'fg_icon': 72},
    'hdpi': {'launcher': 72, 'fg_canvas': 162, 'fg_icon': 108},
    'xhdpi': {'launcher': 96, 'fg_canvas': 216, 'fg_icon': 144},
    'xxhdpi': {'launcher': 144, 'fg_canvas': 324, 'fg_icon': 216},
    'xxxhdpi': {'launcher': 192, 'fg_canvas': 432, 'fg_icon': 288},
}

generated_icons = {}

for density, cfg in DENSITIES.items():
    density_dir = os.path.join(RES_DIR, f'mipmap-{density}')
    os.makedirs(density_dir, exist_ok=True)

    # 1. Launcher icon (square with 15% radius)
    launcher_img = create_square_15pct_icon(source_image, cfg['launcher'])
    launcher_path = os.path.join(density_dir, 'ic_launcher.png')
    launcher_img.save(launcher_path, 'PNG')

    # 2. Round icon (also square with 15% radius as requested by user)
    round_path = os.path.join(density_dir, 'ic_launcher_round.png')
    launcher_img.save(round_path, 'PNG')

    # 3. Adaptive Foreground icon
    fg_img = create_adaptive_foreground(source_image, cfg['fg_canvas'], cfg['fg_icon'])
    fg_path = os.path.join(density_dir, 'ic_launcher_foreground.png')
    fg_img.save(fg_path, 'PNG')

    generated_icons[density] = {
        'launcher': launcher_img,
        'round': launcher_img,
        'fg': fg_img,
    }
    print(f"  • mipmap-{density}: launcher={cfg['launcher']}px, fg={cfg['fg_canvas']}px (r={cfg['launcher']*0.15:.1f}px)")

print("Android res/ mipmap folders updated successfully.")

# ── Update the APK binary ───────────────────────────────────────────────────
print("=== Updating Android APK Package with Square 15% Radius Logo ===")

apk_source = os.path.join(ROOT_DIR, 'apps', 'mobile', 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
if not os.path.exists(apk_source):
    apk_source = os.path.join(DOWNLOADS_DIR, 'KnowTheMD-v1.0-android.apk')
if not os.path.exists(apk_source):
    apk_source = os.path.join(DOWNLOADS_DIR, 'KnowTheMD-1.0.0-android.apk')

# Read original APK entries
temp_apk_dir = os.path.join(ROOT_DIR, 'scripts', '.temp-apk-unpack')
if os.path.exists(temp_apk_dir):
    shutil.rmtree(temp_apk_dir, ignore_errors=True)
os.makedirs(temp_apk_dir, exist_ok=True)

with zipfile.ZipFile(apk_source, 'r') as zin:
    zin.extractall(temp_apk_dir)

# Remove old META-INF signatures so we can re-sign cleanly
meta_inf = os.path.join(temp_apk_dir, 'META-INF')
if os.path.exists(meta_inf):
    for f in os.listdir(meta_inf):
        if f.endswith('.RSA') or f.endswith('.SF') or f.endswith('.MF'):
            os.remove(os.path.join(meta_inf, f))

# Overwrite APK icon files with the new square 15% radius icons
for density, cfg in DENSITIES.items():
    v4_dir = os.path.join(temp_apk_dir, 'res', f'mipmap-{density}-v4')
    if os.path.exists(v4_dir):
        launcher_img = generated_icons[density]['launcher']
        fg_img = generated_icons[density]['fg']
        launcher_img.save(os.path.join(v4_dir, 'ic_launcher.png'), 'PNG')
        launcher_img.save(os.path.join(v4_dir, 'ic_launcher_round.png'), 'PNG')
        fg_img.save(os.path.join(v4_dir, 'ic_launcher_foreground.png'), 'PNG')
        print(f"  • Injected new 15% radius icons into APK res/mipmap-{density}-v4/")

# Re-zip the APK (unaligned temporary)
temp_unaligned = os.path.join(ROOT_DIR, 'scripts', '.temp-unaligned.apk')
with zipfile.ZipFile(temp_unaligned, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
    for root, dirs, files in os.walk(temp_apk_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, temp_apk_dir).replace('\\', '/')
            zout.write(full_path, arcname=rel_path)

shutil.rmtree(temp_apk_dir, ignore_errors=True)

# 4-byte zipalign
zipalign_bin = r"C:\Users\gokul\android-sdk\build-tools\34.0.0\zipalign.exe"
temp_aligned = os.path.join(ROOT_DIR, 'scripts', '.temp-aligned.apk')
if os.path.exists(temp_aligned):
    os.remove(temp_aligned)

if os.path.exists(zipalign_bin):
    print("Aligning APK with 4-byte zipalign...")
    res = subprocess.run([zipalign_bin, "-p", "-f", "4", temp_unaligned, temp_aligned], capture_output=True, text=True)
    if res.returncode == 0:
        print("[SUCCESS] 4-byte zipalign complete.")
    else:
        print(f"Warning: zipalign error: {res.stderr}")
        shutil.copyfile(temp_unaligned, temp_aligned)
else:
    shutil.copyfile(temp_unaligned, temp_aligned)

if os.path.exists(temp_unaligned):
    os.remove(temp_unaligned)

# Sign APK using apksigner with Scheme v2 & v3
apksigner_bin = r"C:\Users\gokul\android-sdk\build-tools\34.0.0\apksigner.bat"
keystore = os.path.expanduser(r"~/.android/debug.keystore")
if os.path.exists(apksigner_bin) and os.path.exists(keystore):
    print("Signing APK with apksigner (Scheme v2 & v3)...")
    cmd = [
        apksigner_bin, "sign",
        "--ks", keystore,
        "--ks-pass", "pass:android",
        "--key-pass", "pass:android",
        temp_aligned
    ]
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode == 0:
        print("[SUCCESS] APK successfully signed with apksigner!")
    else:
        print(f"Warning: apksigner output: {res.stderr or res.stdout}")

    # Verify signature
    verify_cmd = [apksigner_bin, "verify", "--verbose", temp_aligned]
    v_res = subprocess.run(verify_cmd, shell=True, capture_output=True, text=True)
    print("Signature verification:\n", v_res.stdout)

# Copy aligned & signed APK to outputs
output_filenames = [
    'KnowTheMD-v1.0-android.apk',
    'KnowTheMD-v1.0-android.pkg',
    'KnowTheMD-1.0.0-android.apk',
    'KnowTheMD-1.0.0-android.pkg',
]

for name in output_filenames:
    shutil.copyfile(temp_aligned, os.path.join(DOWNLOADS_DIR, name))
    shutil.copyfile(temp_aligned, os.path.join(DIST_DOWNLOADS, name))

# Also copy to build outputs
debug_apk_dest = os.path.join(ROOT_DIR, 'apps', 'mobile', 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
os.makedirs(os.path.dirname(debug_apk_dest), exist_ok=True)
shutil.copyfile(temp_aligned, debug_apk_dest)

# Create zip versions
for zip_name, inner_name in [('KnowTheMD-v1.0-android.zip', 'KnowTheMD-v1.0-android.apk'), ('KnowTheMD-1.0.0-android.zip', 'KnowTheMD-1.0.0-android.apk')]:
    z_path = os.path.join(DOWNLOADS_DIR, zip_name)
    with zipfile.ZipFile(z_path, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
        zf.write(temp_aligned, arcname=inner_name)
    shutil.copyfile(z_path, os.path.join(DIST_DOWNLOADS, zip_name))

if os.path.exists(temp_aligned):
    os.remove(temp_aligned)

# Compute SHA256 & size
def get_sha256(file_path):
    sha = hashlib.sha256()
    with open(file_path, 'rb') as f:
        while chunk := f.read(65536):
            sha.update(chunk)
    return sha.hexdigest()

apk_path = os.path.join(DOWNLOADS_DIR, 'KnowTheMD-v1.0-android.apk')
apk_size = os.path.getsize(apk_path)
apk_sha = get_sha256(apk_path)

print(f"\n[Artifact] KnowTheMD-v1.0-android.apk: {(apk_size/(1024*1024)):.2f} MB | SHA-256: {apk_sha}")
print("=== APK Square 15% Radius Logo Update Complete! ===")
