/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/**
 * Custom fonts loaded via expo-google-fonts
 * - Noto Serif Devanagari: For Sanskrit/Devanagari text
 * - Merriweather: For English text
 */
export const Fonts = {
  devanagari: {
    regular: 'NotoSerifDevanagari-Regular',
    semiBold: 'NotoSerifDevanagari-SemiBold',
    bold: 'NotoSerifDevanagari-Bold',
  },
  sans: {
    regular: 'Merriweather-Regular',
    bold: 'Merriweather-Bold',
    italic: 'Merriweather-Italic',
  },
  // Fallback for system fonts (web/other platforms)
  system: Platform.select({
    ios: {
      sans: 'system-ui',
      serif: 'ui-serif',
      mono: 'ui-monospace',
    },
    default: {
      sans: 'normal',
      serif: 'serif',
      mono: 'monospace',
    },
    web: {
      sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  }),
};
