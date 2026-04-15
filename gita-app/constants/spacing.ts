/**
 * Centralized spacing constants for consistent design system
 * Following the minimal aesthetic with 8-point grid
 */

export const spacing = {
  /** 8px - Extra small spacing for tight elements */
  xs: 8,
  /** 12px - Small spacing for internal padding */
  sm: 12,
  /** 16px - Medium spacing for gaps and radius */
  md: 16,
  /** 24px - Large spacing for card padding and section spacing */
  lg: 24,
  /** 32px - Extra large spacing for major sections */
  xl: 32,
  /** 48px - Extra extra large spacing for hero sections */
  xxl: 48,
} as const;

export const radius = {
  /** 8px - Small radius for chips and pills */
  sm: 8,
  /** 12px - Medium radius for buttons */
  md: 12,
  /** 16px - Standard card radius */
  lg: 16,
  /** 20px - Large radius for modals */
  xl: 20,
  /** Full circle */
  full: 9999,
} as const;

export const layout = {
  /** Standard card padding */
  cardPadding: spacing.lg,
  /** Standard card radius */
  cardRadius: radius.lg,
  /** Gap between cards */
  cardGap: spacing.md,
  /** Section spacing */
  sectionSpacing: spacing.lg,
  /** Screen horizontal padding */
  screenPadding: spacing.lg,
} as const;
