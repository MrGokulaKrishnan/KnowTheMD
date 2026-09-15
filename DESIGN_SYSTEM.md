# KnowTheMD Design System: Liquid Glass & Glossy Blue

**Brand Visual Anchor**: The official `.MD` futuristic cyan/sapphire insignia.  
**Aesthetic Core**: *Liquid Glass, Specular Cyan Sheen, Deep Obsidian Navy, Precision Geometry.*  
**Avoid**: Cheap neon, flat templates, noisy multi-color gradients, excessive heavy blurs.

---

## 1. Color Palette Tokens

### 1.1 Dark Theme (Primary Brand Experience)

| Token Name | Hex / RGBA | Role / Usage |
|---|---|---|
| `--color-bg-base` | `#030712` | Deep Obsidian background canvas |
| `--color-bg-subtle` | `#08101E` | Secondary workspace background |
| `--color-surface-glass` | `rgba(15, 23, 42, 0.65)` | Frosted glass panel surface |
| `--color-surface-card` | `rgba(17, 27, 50, 0.75)` | Elevated card / modal backdrop |
| `--color-border-subtle` | `rgba(56, 189, 248, 0.12)` | Subtle glass perimeter border |
| `--color-border-glow` | `rgba(0, 240, 255, 0.35)` | Interactive focused border |
| `--color-primary-cyan` | `#00F0FF` | Electric Cyan accent (Brand Mark) |
| `--color-primary-blue` | `#0284C7` | Deep Technical Blue |
| `--color-gradient-brand` | `linear-gradient(135deg, #00F0FF 0%, #0099FF 50%, #0A4D8C 100%)` | Official Brand Gradient |
| `--color-text-main` | `#F8FAFC` | High-contrast primary reading text |
| `--color-text-muted` | `#94A3B8` | Subtitle, metadata, and placeholder text |
| `--color-accent-highlight`| `rgba(255, 255, 255, 0.18)` | Specular reflection highlight |

### 1.2 Light Theme (Crisp High-Contrast Glass)

| Token Name | Hex / RGBA | Role / Usage |
|---|---|---|
| `--color-bg-base` | `#F8FAFC` | Clean technical cool white canvas |
| `--color-bg-subtle` | `#F1F5F9` | Secondary workspace background |
| `--color-surface-glass` | `rgba(255, 255, 255, 0.85)` | High-opacity frosted light glass |
| `--color-surface-card` | `rgba(255, 255, 255, 0.95)` | Light floating card surface |
| `--color-border-subtle` | `rgba(2, 132, 199, 0.18)` | Crisp subtle blue border |
| `--color-border-glow` | `rgba(2, 132, 199, 0.45)` | Focused ring highlight |
| `--color-primary-cyan` | `#0284C7` | High-contrast Deep Cyan |
| `--color-primary-blue` | `#0369A1` | Sapphire Blue |
| `--color-gradient-brand` | `linear-gradient(135deg, #0284C7 0%, #0369A1 100%)` | Light Brand Gradient |
| `--color-text-main` | `#0F172A` | Deep charcoal primary reading text |
| `--color-text-muted` | `#475569` | Secondary text |

---

## 2. Liquid Glass Optical Formula

Glass surfaces in KnowTheMD utilize physical optical characteristics:

```css
.liquid-glass-surface {
  background: var(--color-surface-glass);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--color-border-subtle);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.liquid-glass-card:hover {
  border-color: var(--color-border-glow);
  box-shadow: 0 12px 40px 0 rgba(0, 240, 255, 0.12),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}
```

---

## 3. Typography System

- **UI Font**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif`
- **Editor / Code Font**: `"JetBrains Mono", "Fira Code", "Cascadia Code", Menlo, Monaco, Consolas, monospace`
- **Reading Mode Font**: `"Charter", "Merriweather", "Georgia", serif` or customizable sans-serif.

---

## 4. Reusable Glass Components

1. **`GlassButton`**: Primary (electric cyan glow), secondary (subtle glass), ghost, danger.
2. **`GlassCard`**: Content container with hover refraction and soft elevation.
3. **`GlassModal` / `GlassDialog`**: Accessible backdrop overlay with central elevated panel.
4. **`GlassTabs`**: Document tabs with dirty-state indicator dot and close button.
5. **`GlassInput` / `GlassDropdown`**: Inset translucent fields with glowing focus ring.
6. **`GlassSidebar` & `GlassToolbar`**: Frosted tool ribbons with tactile icon buttons.
7. **`GlassCommandPalette`**: Centered Spotlight-style search modal with fuzzy matching.
8. **`GlassToast`**: Floating notification badge with slide-up micro-interaction.
