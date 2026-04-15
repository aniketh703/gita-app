import { COLORS_LIGHT } from "@/constants/colors";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useMemo } from "react";

export function useThemeColors() {
  const { colors, isDark, resolvedTheme } = useAppTheme();
  return { colors, isDark, resolvedTheme };
}

export function useExtendedThemeColors() {
  const { colors, isDark } = useThemeColors();

  const extendedColors = useMemo(
    () => ({
      ...colors,
      toggleBg: isDark ? "#242424" : "#f2f2f2",
      toggleActive: colors.accent,
      toggleText: isDark ? "#e6e6e6" : "#333333",
      toggleActiveText: isDark ? "#1a1a1a" : "#ffffff",
      buttonBg: isDark ? "#2a2a2a" : "#f5f5f5",
      buttonDisabled: isDark ? "#333333" : "#e0e0e0",
      tertiary: isDark ? "#777777" : "#999999",
    }),
    [colors, isDark],
  );

  return { colors: extendedColors, isDark };
}

export type ColorPalette = typeof COLORS_LIGHT;
