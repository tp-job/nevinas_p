/**
 * Design System v3.2 - Theme-Aware Colors
 * Central reference for all color tokens used throughout the application
 * 
 * These colors automatically respond to light/dark mode changes
 * via CSS variables defined in client/src/styles/tokens/colors.css
 */

export const colors = {
  /* ─── TEXT COLORS ─── */
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    tertiary: 'var(--color-text-tertiary)',
    muted: 'var(--color-text-muted)',
    disabled: 'var(--color-text-disabled)',
    inverse: 'var(--color-text-inverse)',
  },

  /* ─── BACKGROUND COLORS ─── */
  bg: {
    primary: 'var(--color-bg-primary)',
    secondary: 'var(--color-bg-secondary)',
    tertiary: 'var(--color-bg-tertiary)',
  },

  /* ─── SURFACE COLORS ─── */
  surface: {
    primary: 'var(--color-surface-primary)',
    secondary: 'var(--color-surface-secondary)',
    tertiary: 'var(--color-surface-tertiary)',
    variant: 'var(--color-surface-variant)',
  },

  /* ─── BORDER COLORS ─── */
  border: {
    primary: 'var(--color-border-primary)',
    secondary: 'var(--color-border-secondary)',
    tertiary: 'var(--color-border-tertiary)',
    subtle: 'var(--color-border-subtle)',
    focus: 'var(--color-border-focus)',
  },

  /* ─── BUTTON COLORS ─── */
  button: {
    primary: {
      bg: 'var(--color-button-primary-bg)',
      text: 'var(--color-button-primary-text)',
      hover: 'var(--color-button-primary-hover)',
      active: 'var(--color-button-primary-active)',
      disabled: 'var(--color-button-primary-disabled)',
    },
    secondary: {
      bg: 'var(--color-button-secondary-bg)',
      text: 'var(--color-button-secondary-text)',
      hover: 'var(--color-button-secondary-hover)',
      active: 'var(--color-button-secondary-active)',
    },
  },

  /* ─── LINK COLORS ─── */
  link: {
    primary: 'var(--color-link-primary)',
    hover: 'var(--color-link-hover)',
    visited: 'var(--color-link-visited)',
    active: 'var(--color-link-active)',
  },

  /* ─── STATUS COLORS ─── */
  status: {
    success: {
      bg: 'var(--color-success-bg)',
      text: 'var(--color-success-text)',
      border: 'var(--color-success-border)',
    },
    warning: {
      bg: 'var(--color-warning-bg)',
      text: 'var(--color-warning-text)',
      border: 'var(--color-warning-border)',
    },
    error: {
      bg: 'var(--color-error-bg)',
      text: 'var(--color-error-text)',
      border: 'var(--color-error-border)',
    },
    info: {
      bg: 'var(--color-info-bg)',
      text: 'var(--color-info-text)',
      border: 'var(--color-info-border)',
    },
  },

  /* ─── GLASS & OVERLAY ─── */
  glass: {
    bg: 'var(--color-glass-bg)',
    border: 'var(--color-glass-border)',
  },
  overlay: {
    dark: 'var(--color-overlay-dark)',
    light: 'var(--color-overlay-light)',
  },

  /* ─── SHADOW COLORS ─── */
  shadow: {
    sm: 'var(--color-shadow-sm)',
    md: 'var(--color-shadow-md)',
    lg: 'var(--color-shadow-lg)',
    xl: 'var(--color-shadow-xl)',
  },

  /* ─── BRAND PALETTE ─── */
  brand: {
    matteMidnight: 'var(--color-matte-midnight)',
    matteNavy: 'var(--color-matte-navy)',
    matteRoyal: 'var(--color-matte-royal)',
    matteAzure: 'var(--color-matte-azure)',
    velvetNight: 'var(--color-velvet-night)',
    velvetIndigo: 'var(--color-velvet-indigo)',
    velvetOrchid: 'var(--color-velvet-orchid)',
    velvetFlamingo: 'var(--color-velvet-flamingo)',
  },

  /* ─── ACCENT PALETTE ─── */
  accent: {
    green: 'var(--color-pastel-green)',
    blue: 'var(--color-pastel-blue)',
    purple: 'var(--color-pastel-purple)',
    yellow: 'var(--color-pastel-yellow)',
  },

  /* ─── PRIMARY PALETTE ─── */
  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    200: 'var(--color-primary-200)',
    300: 'var(--color-primary-300)',
    400: 'var(--color-primary-400)',
    500: 'var(--color-primary-500)',
    600: 'var(--color-primary-600)',
    700: 'var(--color-primary-700)',
    800: 'var(--color-primary-800)',
    900: 'var(--color-primary-900)',
  },
} as const;

/**
 * Get inline style object for a component
 * @example
 * <div style={getColorStyles('bg-surface-text')}>Content</div>
 */
export function getColorStyles(
  ...colorRefs: Array<keyof typeof colors | string>
): React.CSSProperties {
  const styles: React.CSSProperties = {};

  for (const ref of colorRefs) {
    if (ref === 'bg-surface-text') {
      return {
        backgroundColor: colors.surface.primary,
        color: colors.text.primary,
      };
    }
    if (ref === 'button-primary') {
      return {
        backgroundColor: colors.button.primary.bg,
        color: colors.button.primary.text,
      };
    }
  }

  return styles;
}

/**
 * Example component styles using theme colors
 */
export const componentStyles = {
  card: {
    backgroundColor: colors.surface.primary,
    color: colors.text.primary,
    borderColor: colors.border.primary,
    padding: 'var(--space-4)',
    borderRadius: 'var(--radius-lg)',
    border: `1px solid ${colors.border.primary}`,
    transition: `all var(--duration-base) var(--ease-smooth)`,
  } as React.CSSProperties,

  button: {
    backgroundColor: colors.button.primary.bg,
    color: colors.button.primary.text,
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    transition: `background-color var(--duration-fast) var(--ease-smooth)`,
  } as React.CSSProperties,

  buttonHover: {
    backgroundColor: colors.button.primary.hover,
  } as React.CSSProperties,

  heading: {
    color: colors.text.primary,
    fontWeight: '700',
  } as React.CSSProperties,

  paragraph: {
    color: colors.text.secondary,
    fontWeight: '400',
  } as React.CSSProperties,

  link: {
    color: colors.link.primary,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `color var(--duration-fast) var(--ease-smooth)`,
  } as React.CSSProperties,

  linkHover: {
    color: colors.link.hover,
  } as React.CSSProperties,

  successAlert: {
    backgroundColor: colors.status.success.bg,
    color: colors.status.success.text,
    borderColor: colors.status.success.border,
    borderLeftWidth: '4px',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
  } as React.CSSProperties,

  errorAlert: {
    backgroundColor: colors.status.error.bg,
    color: colors.status.error.text,
    borderColor: colors.status.error.border,
    borderLeftWidth: '4px',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
  } as React.CSSProperties,

  warningAlert: {
    backgroundColor: colors.status.warning.bg,
    color: colors.status.warning.text,
    borderColor: colors.status.warning.border,
    borderLeftWidth: '4px',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
  } as React.CSSProperties,

  infoAlert: {
    backgroundColor: colors.status.info.bg,
    color: colors.status.info.text,
    borderColor: colors.status.info.border,
    borderLeftWidth: '4px',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
  } as React.CSSProperties,

  glass: {
    backgroundColor: colors.glass.bg,
    borderColor: colors.glass.border,
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.glass.border}`,
  } as React.CSSProperties,
} as const;

export default colors;
