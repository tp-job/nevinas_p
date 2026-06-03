/**
 * Example Component: ThemeAwareCard
 * Demonstrates how to use Design System v3.2 theme-aware colors
 * 
 * This component automatically responds to light/dark mode changes
 * without requiring any conditional rendering or useTheme hook
 */

import React, { ReactNode } from 'react';
import { colors, componentStyles } from '@/utils/colors';

interface ThemeAwareCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  icon?: ReactNode;
  onClick?: () => void;
}

/**
 * Example 1: Using CSS Variables in Inline Styles
 */
export function ThemeAwareCard({
  title,
  description,
  children,
  variant = 'default',
  icon,
  onClick,
}: ThemeAwareCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return componentStyles.successAlert;
      case 'warning':
        return componentStyles.warningAlert;
      case 'error':
        return componentStyles.errorAlert;
      case 'info':
        return componentStyles.infoAlert;
      default:
        return componentStyles.card;
    }
  };

  return (
    <div
      style={{
        ...getVariantStyles(),
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : -1}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        {icon && <span>{icon}</span>}
        <h3 style={componentStyles.heading}>{title}</h3>
      </div>

      {description && (
        <p style={{ ...componentStyles.paragraph, marginTop: 'var(--space-2)' }}>
          {description}
        </p>
      )}

      {children && (
        <div style={{ marginTop: 'var(--space-3)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Using the colors utility object directly
 */
export function ThemeAwareButton({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled
          ? colors.button.primary.disabled
          : colors.button.primary.bg,
        color: colors.button.primary.text,
        padding: `${getComputedStyle(document.documentElement).getPropertyValue('--space-3')} 
                  ${getComputedStyle(document.documentElement).getPropertyValue('--space-4')}`,
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color var(--duration-fast) var(--ease-smooth)',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors.button.primary.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors.button.primary.bg;
        }
      }}
    >
      {label}
    </button>
  );
}

/**
 * Example 3: Demonstrating different text color hierarchies
 */
export function ThemeAwareTextHierarchy() {
  return (
    <div
      style={{
        backgroundColor: colors.bg.primary,
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <h1 style={{ ...componentStyles.heading, fontSize: '1.5rem' }}>
        Primary Heading
      </h1>

      <h2
        style={{
          ...componentStyles.paragraph,
          fontSize: '1.25rem',
          fontWeight: '600',
          marginTop: 'var(--space-2)',
        }}
      >
        Secondary Heading
      </h2>

      <p
        style={{
          ...componentStyles.paragraph,
          marginTop: 'var(--space-2)',
        }}
      >
        Primary paragraph text with default contrast.
      </p>

      <p
        style={{
          color: colors.text.tertiary,
          fontSize: '0.875rem',
          marginTop: 'var(--space-2)',
        }}
      >
        Tertiary text for reduced emphasis.
      </p>

      <p
        style={{
          color: colors.text.muted,
          fontSize: '0.75rem',
          marginTop: 'var(--space-2)',
        }}
      >
        Muted text for minimal emphasis.
      </p>

      <p
        style={{
          color: colors.text.disabled,
          fontSize: '0.875rem',
          marginTop: 'var(--space-2)',
        }}
      >
        Disabled text representation.
      </p>
    </div>
  );
}

/**
 * Example 4: Using status colors for alerts
 */
export function ThemeAwareAlert({
  type,
  message,
}: {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}) {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return componentStyles.successAlert;
      case 'warning':
        return componentStyles.warningAlert;
      case 'error':
        return componentStyles.errorAlert;
      case 'info':
        return componentStyles.infoAlert;
    }
  };

  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div style={getAlertStyles()}>
      <span style={{ marginRight: 'var(--space-2)' }}>
        {icons[type]}
      </span>
      {message}
    </div>
  );
}

/**
 * Example 5: Using brand colors
 */
export function ThemeAwareBrandShowcase() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
      }}
    >
      {Object.entries(colors.brand).map(([name, color]) => (
        <div
          key={name}
          style={{
            padding: 'var(--space-3)',
            backgroundColor: colors.surface.primary,
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${colors.border.primary}`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              height: '100px',
              backgroundColor: color,
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-2)',
            }}
          />
          <p style={{ ...componentStyles.paragraph, fontSize: '0.875rem' }}>
            {name}
          </p>
          <code
            style={{
              color: colors.text.tertiary,
              fontSize: '0.75rem',
              display: 'block',
              marginTop: 'var(--space-1)',
              wordBreak: 'break-all',
            }}
          >
            {color}
          </code>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 6: Using glass morphism colors
 */
export function ThemeAwareGlassCard() {
  return (
    <div
      style={{
        ...componentStyles.glass,
        padding: 'var(--space-4)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <h3 style={componentStyles.heading}>
        Glass Morphism Card
      </h3>
      <p style={{ ...componentStyles.paragraph, marginTop: 'var(--space-2)' }}>
        This card uses glass morphism with theme-aware colors that work in both light and dark modes.
      </p>
    </div>
  );
}

/**
 * Example 7: Link with theme-aware colors
 */
export function ThemeAwareLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <a
      href={href}
      style={{
        ...componentStyles.link,
        color: isHovered ? colors.link.hover : colors.link.primary,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
}

export default ThemeAwareCard;
