/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";
import { COLORS_DARK, COLORS_LIGHT } from "./colors";

const tintColorLight = COLORS_LIGHT.accent;
const tintColorDark = COLORS_DARK.text;

export const Colors = {
  light: {
    text: COLORS_LIGHT.text,
    background: COLORS_LIGHT.background,
    tint: tintColorLight,
    icon: COLORS_LIGHT.secondary,
    tabIconDefault: COLORS_LIGHT.tabBarInactive,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: COLORS_DARK.text,
    background: COLORS_DARK.background,
    tint: tintColorDark,
    icon: COLORS_DARK.secondary,
    tabIconDefault: COLORS_DARK.tabBarInactive,
    tabIconSelected: tintColorDark,
  },
};

/**
 * App-specific colors with improved contrast ratios
 * Uses centralized color constants from ./colors.ts
 */
export const AppColors = {
  light: COLORS_LIGHT,
  dark: COLORS_DARK,
};

/**
 * Custom fonts loaded via expo-google-fonts
 * - Noto Serif Devanagari: For Sanskrit/Devanagari text
 * - Merriweather: For English text
 */
export const Fonts = {
  devanagari: {
    regular: "NotoSerifDevanagari-Regular",
    semiBold: "NotoSerifDevanagari-SemiBold",
    bold: "NotoSerifDevanagari-Bold",
  },
  sans: {
    regular: "Merriweather-Regular",
    bold: "Merriweather-Bold",
    italic: "Merriweather-Italic",
  },
  // Fallback for system fonts (web/other platforms)
  system: Platform.select({
    ios: {
      sans: "system-ui",
      serif: "ui-serif",
      mono: "ui-monospace",
    },
    default: {
      sans: "normal",
      serif: "serif",
      mono: "monospace",
    },
    web: {
      sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  }),
};
