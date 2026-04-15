/**
 * Centralized typography scale for consistent design system
 */

import type { TextStyle } from "react-native";

/**
 * Font families used across the app
 */
export const fontFamily = {
  /** Sanskrit and Hindi text */
  devanagari: "NotoSerifDevanagari-Regular",
  /** English body text */
  serif: "Merriweather-Regular",
  /** System font fallback */
  system: "System",
} as const;

/**
 * Font sizes following a type scale
 */
export const fontSize = {
  /** 12px - Caption text */
  xs: 12,
  /** 14px - Small text */
  sm: 14,
  /** 16px - Body text */
  md: 16,
  /** 18px - Large text */
  lg: 18,
  /** 20px - Subheading */
  xl: 20,
  /** 24px - Section heading */
  xxl: 24,
  /** 26px - Sanskrit detail */
  xxxl: 26,
  /** 28px - Page title */
  huge: 28,
} as const;

/**
 * Font weights
 */
export const fontWeight = {
  regular: "400" as TextStyle["fontWeight"],
  medium: "500" as TextStyle["fontWeight"],
  semibold: "600" as TextStyle["fontWeight"],
  bold: "700" as TextStyle["fontWeight"],
} as const;

/**
 * Line heights
 */
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
  loose: 2.0,
} as const;

/**
 * Predefined text styles for common use cases
 */
export const textStyles = {
  /** Page title - 28px bold */
  title: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.huge * lineHeight.tight,
  },
  /** Section heading - 24px bold */
  heading: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.tight,
  },
  /** Subheading - 20px semibold */
  subheading: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: fontSize.xl * lineHeight.normal,
  },
  /** Body text - 16px regular */
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.md * lineHeight.normal,
  },
  /** Small text - 14px regular */
  small: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  /** Caption - 12px medium */
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.xs * lineHeight.normal,
  },
  /** Sanskrit verse detail - 26px devanagari */
  sanskritDetail: {
    fontFamily: fontFamily.devanagari,
    fontSize: fontSize.xxxl,
    lineHeight: fontSize.xxxl * lineHeight.relaxed,
  },
  /** Sanskrit verse preview - 16px devanagari */
  sanskritPreview: {
    fontFamily: fontFamily.devanagari,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * lineHeight.normal,
  },
} as const;
