import { getColorsByTheme, type ResolvedTheme } from "@/constants/colors";
import { usePreferencesState } from "@/src/context/PreferencesContext";
import type { ThemePreference } from "@/src/types/preferences";
import { useMemo } from "react";
import { useColorScheme } from "react-native";

function resolveTheme(
  preference: ThemePreference,
  systemTheme: "light" | "dark" | null | undefined,
): ResolvedTheme {
  if (preference === "auto") {
    return systemTheme === "dark" ? "dark" : "light";
  }
  return preference;
}

export function useAppTheme() {
  const preferences = usePreferencesState();
  const systemTheme = useColorScheme();

  const resolvedTheme = useMemo(
    () => resolveTheme(preferences.theme, systemTheme),
    [preferences.theme, systemTheme],
  );

  const colors = useMemo(
    () => getColorsByTheme(resolvedTheme),
    [resolvedTheme],
  );
  const isDark = resolvedTheme === "dark";

  const nativewindColorScheme = useMemo(() => {
    if (preferences.theme === "auto") {
      return "system" as const;
    }
    return resolvedTheme === "dark" ? ("dark" as const) : ("light" as const);
  }, [preferences.theme, resolvedTheme]);

  return {
    preferenceTheme: preferences.theme,
    resolvedTheme,
    colors,
    isDark,
    statusBarStyle: isDark ? ("light" as const) : ("dark" as const),
    nativewindColorScheme,
  };
}
