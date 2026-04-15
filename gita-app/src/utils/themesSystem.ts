/**
 * Premium Themes System
 * Monetization through beautiful, spiritually-themed designs
 * Themes: Classic Temple, Minimal Dark, Golden Sanskrit, Lotus Meditation, Himalayan Calm
 */

import { useAppStore } from "@/src/store/appStore";

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  isPremium: boolean;
  colors: {
    bg: string;
    surface: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    accentSoft: string;
    verseBox: string;
  };
  typography: {
    fontScale: number;
    lineHeight: number;
  };
}

const THEME_DEFINITIONS = {
  "light-default": {
    id: "light-default",
    name: "Light",
    description: "Clean, minimal light mode",
    icon: "light-mode",
    isPremium: false,
    colors: {
      bg: "#ffffff",
      surface: "#f8f8f8",
      accent: "#ff6b35",
      text: "#0a0a0a",
      textSecondary: "#666666",
      border: "#e0e0e0",
      accentSoft: "#ffe8d6",
      verseBox: "#faf8f3",
    },
    typography: {
      fontScale: 1,
      lineHeight: 1.6,
    },
  },

  "dark-default": {
    id: "dark-default",
    name: "Dark",
    description: "Easy on the eyes dark mode",
    icon: "dark-mode",
    isPremium: false,
    colors: {
      bg: "#0a0a0a",
      surface: "#1a1a1a",
      accent: "#ff6b35",
      text: "#ffffff",
      textSecondary: "#a0a0a0",
      border: "#333333",
      accentSoft: "#663322",
      verseBox: "#1a1a1a",
    },
    typography: {
      fontScale: 1,
      lineHeight: 1.6,
    },
  },

  // Premium Themes
  "temple-classic": {
    id: "temple-classic",
    name: "Classic Temple",
    description: "Inspired by sacred temple architecture",
    icon: "temple-buddhist",
    isPremium: true,
    colors: {
      bg: "#f5f1e6",
      surface: "#ede5d6",
      accent: "#8b4513",
      text: "#2a2420",
      textSecondary: "#5d5449",
      border: "#d4c8b8",
      accentSoft: "#f4e8d8",
      verseBox: "#faf6ee",
    },
    typography: {
      fontScale: 1.05,
      lineHeight: 1.7,
    },
  },

  "minimal-dark": {
    id: "minimal-dark",
    name: "Minimal Dark",
    description: "Sophisticated dark minimalism",
    icon: "dark-mode",
    isPremium: true,
    colors: {
      bg: "#0f0f0f",
      surface: "#1a1a1a",
      accent: "#ffd700", // Gold
      text: "#f5f5f5",
      textSecondary: "#b0b0b0",
      border: "#2a2a2a",
      accentSoft: "#332200",
      verseBox: "#151515",
    },
    typography: {
      fontScale: 1,
      lineHeight: 1.8,
    },
  },

  "golden-sanskrit": {
    id: "golden-sanskrit",
    name: "Golden Sanskrit",
    description: "Inspired by Sanskrit manuscripts",
    icon: "translate",
    isPremium: true,
    colors: {
      bg: "#1a1410",
      surface: "#2a2018",
      accent: "#d4af37", // Gold
      text: "#f5e6d3",
      textSecondary: "#c9a876",
      border: "#4a3a28",
      accentSoft: "#3a2a18",
      verseBox: "#241a10",
    },
    typography: {
      fontScale: 1.08,
      lineHeight: 1.8,
    },
  },

  "lotus-meditation": {
    id: "lotus-meditation",
    name: "Lotus Meditation",
    description: "Peaceful lotus-inspired palette",
    icon: "favorite",
    isPremium: true,
    colors: {
      bg: "#f0e6f0",
      surface: "#e8dce8",
      accent: "#9c27b0", // Purple
      text: "#3a2a4a",
      textSecondary: "#6a5a7a",
      border: "#d4c4e8",
      accentSoft: "#f0e0f0",
      verseBox: "#faf6fa",
    },
    typography: {
      fontScale: 1.02,
      lineHeight: 1.7,
    },
  },

  "himalayan-calm": {
    id: "himalayan-calm",
    name: "Himalayan Calm",
    description: "Mountain serenity and peace",
    icon: "landscape",
    isPremium: true,
    colors: {
      bg: "#e6f0f5",
      surface: "#d9e8f0",
      accent: "#00838f", // Teal
      text: "#0d3a42",
      textSecondary: "#4a6a7a",
      border: "#b8d4e0",
      accentSoft: "#c8e6f0",
      verseBox: "#f0f8fa",
    },
    typography: {
      fontScale: 1.04,
      lineHeight: 1.75,
    },
  },
} as const satisfies Record<string, ThemeDefinition>;

export type ThemeId = keyof typeof THEME_DEFINITIONS;

export const THEMES = new Map<ThemeId, ThemeDefinition>(
  Object.entries(THEME_DEFINITIONS) as [ThemeId, ThemeDefinition][],
);

export function canUseTheme(themeId: ThemeId, isPremium: boolean): boolean {
  const theme = THEMES.get(themeId);
  if (!theme) return false;
  return !theme.isPremium || isPremium;
}

export function useTheme() {
  const { selectedTheme, isPremium } = useAppStore();

  const selectedThemeId =
    (selectedTheme as ThemeId | undefined) ?? "light-default";
  const currentTheme =
    THEMES.get(selectedThemeId) ?? THEMES.get("light-default")!;

  const allThemes = Array.from(THEMES.values());
  const availableThemes = allThemes.filter((theme) =>
    canUseTheme(theme.id as ThemeId, isPremium),
  );
  const premiumThemes = allThemes.filter((theme) => theme.isPremium);

  return {
    currentTheme,
    canUseTheme: (themeId: ThemeId) => canUseTheme(themeId, isPremium),
    availableThemes,
    premiumThemes,
    allThemes,
  };
}
