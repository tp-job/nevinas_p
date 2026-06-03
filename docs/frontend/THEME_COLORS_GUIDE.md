# Design System v3.2 - Theme-Aware Colors Guide

## Overview

The new color system is designed to automatically adapt to light and dark modes using CSS variables. All colors are defined in a single source of truth and automatically switch based on the theme.

---

## Color Categories

### 1. **Text Colors**
Used for all text content throughout the application.

```css
--color-text-primary        /* Main text (highest contrast) */
--color-text-secondary      /* Secondary text (reduced emphasis) */
--color-text-tertiary       /* Tertiary text (further reduced) */
--color-text-muted          /* Muted text (minimal emphasis) */
--color-text-disabled       /* Disabled text (40% opacity) */
--color-text-inverse        /* Inverse text (opposite of primary) */
```

**Light Mode Values:**
- Primary: `#1e293b` (dark slate)
- Secondary: `#64748b` (medium slate)
- Tertiary: `#94a3b8` (light slate)
- Muted: `#cbd5e1` (lighter slate)
- Disabled: `rgba(30, 41, 59, 0.4)`
- Inverse: `#ffffff` (white)

**Dark Mode Values:**
- Primary: `#f1f3f5` (light gray)
- Secondary: `#9ca3af` (medium gray)
- Tertiary: `#6b7280` (darker gray)
- Muted: `#4b5563` (dark gray)
- Disabled: `rgba(241, 243, 245, 0.4)`
- Inverse: `#1e293b` (dark slate)

**Usage Example:**
```tsx
// In TSX/JSX
<p style={{ color: 'var(--color-text-primary)' }}>Primary text</p>
<p style={{ color: 'var(--color-text-secondary)' }}>Secondary text</p>

// In CSS
.heading {
  color: var(--color-text-primary);
}

.caption {
  color: var(--color-text-secondary);
}
```

---

### 2. **Background Colors**
Used for page backgrounds and large surface areas.

```css
--color-bg-primary          /* Main background */
--color-bg-secondary        /* Secondary background */
--color-bg-tertiary         /* Tertiary background */
```

**Light Mode:** `#f8fafc` → `#f1f5f9` → `#e2e8f0`
**Dark Mode:** `#1e202c` → `#252d3d` → `#2f3848`

---

### 3. **Surface Colors**
Used for cards, containers, and elevated elements.

```css
--color-surface-primary     /* Main surface (cards, panels) */
--color-surface-secondary   /* Secondary surface */
--color-surface-tertiary    /* Tertiary surface */
--color-surface-variant     /* Semi-transparent variant */
```

**Usage Example:**
```tsx
<div style={{ backgroundColor: 'var(--color-surface-primary)' }}>
  Card content
</div>
```

---

### 4. **Border Colors**
Used for borders and dividers.

```css
--color-border-primary      /* Main borders */
--color-border-secondary    /* Secondary borders */
--color-border-tertiary     /* Tertiary borders */
--color-border-subtle       /* Very subtle borders */
--color-border-focus        /* Focus/active borders */
```

**Light Mode:** `#e2e8f0` → `#cbd5e1` → `#94a3b8` → `rgba(15, 23, 42, 0.05)`
**Dark Mode:** `#3d4759` → `#2f3848` → `#1f2937` → `rgba(241, 243, 245, 0.05)`

---

### 5. **Interactive Elements**
Used for buttons and interactive components.

```css
/* Primary Button */
--color-button-primary-bg
--color-button-primary-text
--color-button-primary-hover
--color-button-primary-active
--color-button-primary-disabled

/* Secondary Button */
--color-button-secondary-bg
--color-button-secondary-text
--color-button-secondary-hover
--color-button-secondary-active

/* Links */
--color-link-primary        /* Link text color */
--color-link-hover          /* Hover state */
--color-link-visited        /* Visited state */
--color-link-active         /* Active state */
```

**Usage Example:**
```tsx
<button style={{ 
  backgroundColor: 'var(--color-button-primary-bg)',
  color: 'var(--color-button-primary-text)',
  cursor: 'pointer'
}}>
  Click me
</button>

<button style={{
  backgroundColor: 'var(--color-button-primary-hover)'
}}>
  Hover State
</button>
```

---

### 6. **Status Colors**
Used for success, warning, error, and info messages.

```css
/* Success */
--color-success-bg          /* Success background */
--color-success-text        /* Success text */
--color-success-border      /* Success border */

/* Warning */
--color-warning-bg
--color-warning-text
--color-warning-border

/* Error */
--color-error-bg
--color-error-text
--color-error-border

/* Info */
--color-info-bg
--color-info-text
--color-info-border
```

**Usage Example:**
```tsx
<div style={{ 
  backgroundColor: 'var(--color-success-bg)',
  borderColor: 'var(--color-success-border)',
  color: 'var(--color-success-text)'
}}>
  ✓ Operation successful
</div>
```

---

### 7. **Glass & Overlay Colors**
Used for glass morphism effects and overlays.

```css
--color-glass-bg            /* Glass background */
--color-glass-border        /* Glass border */
--color-overlay-dark        /* Dark overlay */
--color-overlay-light       /* Light overlay */
```

**Light Mode:** 
- Glass BG: `rgba(255, 255, 255, 0.8)`
- Glass Border: `rgba(226, 232, 240, 0.6)`

**Dark Mode:**
- Glass BG: `rgba(30, 32, 44, 0.8)`
- Glass Border: `rgba(61, 71, 89, 0.6)`

---

### 8. **Shadow Colors**
Used for box shadows and depth effects.

```css
--color-shadow-sm           /* Small shadows */
--color-shadow-md           /* Medium shadows */
--color-shadow-lg           /* Large shadows */
--color-shadow-xl           /* Extra large shadows */
```

---

### 9. **Brand Colors**
Pre-defined brand palette from Design System v3.2.

```css
--color-matte-midnight      /* #293556 */
--color-matte-navy          /* #2E4583 */
--color-matte-royal         /* #3E60C1 */
--color-matte-azure         /* #5983FC */
--color-velvet-night        /* #313866 */
--color-velvet-indigo       /* #50409A */
--color-velvet-orchid       /* #964EC2 */
--color-velvet-flamingo     /* #FF7BBF */

/* Accent Colors */
--color-pastel-green        /* #6FD195 */
--color-pastel-blue         /* #6B9FE8 */
--color-pastel-purple       /* #B18FE8 */
--color-pastel-yellow       /* #F4C542 */
```

---

## How to Use

### Option 1: Direct CSS Variables (Recommended)
```css
.card {
  background-color: var(--color-surface-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  transition: all var(--duration-base) var(--ease-smooth);
}

.card:hover {
  background-color: var(--color-surface-secondary);
  box-shadow: 0 4px 12px var(--color-shadow-md);
}
```

### Option 2: Inline Styles in React/JSX
```tsx
export function Card({ title, content }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface-primary)',
        color: 'var(--color-text-primary)',
        borderColor: 'var(--color-border-primary)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-primary)',
      }}
    >
      <h3 style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        {content}
      </p>
    </div>
  );
}
```

### Option 3: Tailwind CSS Classes
If using Tailwind, you can use the `text-` utilities:
```tsx
<p className="text-primary">Primary text</p>
<p className="text-secondary">Secondary text</p>
<p className="text-muted">Muted text</p>
```

---

## Theme Switching

The theme is controlled by the `ThemeContext` from `@/context/ThemeContext`:

```tsx
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### How it works:
1. When `toggleTheme()` is called, it sets `isDark` state
2. The ThemeProvider adds/removes the `.dark` class on `<html>`
3. All CSS variables automatically update via media query fallbacks
4. Colors transition smoothly due to `transition` property on `body`

---

## Migration Guide

### Before (Hardcoded Colors)
```tsx
<p style={{ color: '#1e293b' }}>Text</p>
```

### After (Theme-Aware)
```tsx
<p style={{ color: 'var(--color-text-primary)' }}>Text</p>
```

---

## Best Practices

1. **Always use semantic variables:** Use `--color-text-primary` instead of specific hex values
2. **Consistency:** Use the same color token for similar elements across pages
3. **Hierarchy:** Use primary → secondary → tertiary for content hierarchy
4. **Contrast:** Ensure sufficient contrast between text and background
5. **Transitions:** Use `var(--duration-base)` for smooth theme transitions
6. **Fallbacks:** The system includes `@media (prefers-color-scheme: dark)` fallback

---

## Testing Theme Changes

You can test the theme by:

1. Toggling the theme via the UI
2. Opening DevTools and adding/removing the `.dark` class on `<html>`
3. Using system preferences (macOS/Windows) to change color scheme

---

## Files Modified

- `client/src/styles/tokens/colors.css` - New comprehensive color system
- `client/src/styles/tokens/_root.css` - Updated with backward-compatible variables
- `client/src/styles/globals.css` - Updated to use semantic colors
- `client/src/index.css` - Added colors.css import

---

## Questions?

Refer to the Design System v3.2 documentation in `docDesignSystem.ts` or check the colors.md file for visual references.
