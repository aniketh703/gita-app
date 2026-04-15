import type { ThemePreference } from "@/src/types/preferences";

export type ResolvedTheme = Exclude<ThemePreference, "auto">;

export interface ThemePalette {
  // Main colors
  bg: string;
  background: string;
  text: string;
  secondary: string;
  textSecondary: string;
  accent: string;
  border: string;

  // Surface variants
  verseBox: string;
  section: string;
  surface: string;
  surfaceSoft: string;

  // Accent variants
  accentSoft: string;

  // Navigation
  tabBarActive: string;
  tabBarInactive: string;

  // Status colors
  success: string;
}

export const COLORS_LIGHT: ThemePalette = {
  bg: "#ffffff",
  background: "#ffffff",
  text: "#0a0a0a",
  secondary: "#666666",
  textSecondary: "#666666",
  accent: "#ff6b35",
  border: "#e0e0e0",
  verseBox: "#f8f9fa",
  section: "#f3f4f6",
  surface: "#f8f9fa",
  surfaceSoft: "#f3f4f6",
  accentSoft: "#ff6b3515",
  tabBarActive: "#ff6b35",
  tabBarInactive: "#8f8f8f",
  success: "#4caf50",
} as const;

export const COLORS_SEPIA: ThemePalette = {
  bg: "#fff8f2",
  background: "#fff8f2",
  text: "#2f241c",
  secondary: "#7a6a5b",
  textSecondary: "#7a6a5b",
  accent: "#ff6b35",
  border: "#eadccd",
  verseBox: "#fdf2e8",
  section: "#f7e9db",
  surface: "#fdf2e8",
  surfaceSoft: "#f7e9db",
  accentSoft: "#ff6b3515",
  tabBarActive: "#ff6b35",
  tabBarInactive: "#a48f7a",
  success: "#4caf50",
} as const;

export const COLORS_DARK: ThemePalette = {
  bg: "#0a0a0a",
  background: "#0a0a0a",
  text: "#ffffff",
  secondary: "#a0a0a0",
  textSecondary: "#a0a0a0",
  accent: "#ff6b35",
  border: "#2a2a2a",
  verseBox: "#1a1a1a",
  section: "#141414",
  surface: "#1a1a1a",
  surfaceSoft: "#141414",
  accentSoft: "#ff6b3525",
  tabBarActive: "#ff6b35",
  tabBarInactive: "#6f6f6f",
  success: "#4caf50",
} as const;

export const THEME_COLORS: Record<ResolvedTheme, ThemePalette> = {
  light: COLORS_LIGHT,
  sepia: COLORS_SEPIA,
  dark: COLORS_DARK,
};

export const getColorsByTheme = (theme: ResolvedTheme): ThemePalette =>
  THEME_COLORS[theme];

export const getColors = (isDark: boolean): ThemePalette =>
  isDark ? COLORS_DARK : COLORS_LIGHT;
