import { useAppTheme } from "@/hooks/use-app-theme";
import {
    usePreferences,
    usePreferencesState,
} from "@/src/context/PreferencesContext";
import { AppContextType, AppTheme, LangKey } from "@/src/types";
import React, { createContext, useCallback, useContext, useMemo } from "react";

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider - Adapter/bridge from old AppContext to new PreferencesContext
 *
 * This maintains backward compatibility with existing components while
 * allowing migration to PreferencesContext over time.
 *
 * Translation:
 * - AppContext.theme.isDark → Derived from PreferencesContext.theme + system theme
 * - AppContext.language → PreferencesContext.language
 * - AppContext.fontSize → PreferencesContext.fontSize
 * - AppContext.showTransliteration → PreferencesContext.toggles.showTransliteration
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const prefs = usePreferencesState();
  const { setLanguage, setFontSize, setTheme, setToggle } = usePreferences();
  const { isDark } = useAppTheme();

  // Memoize setters to prevent unnecessary re-renders
  const setAppLanguage = useCallback(
    async (lang: LangKey) => {
      await setLanguage(lang);
    },
    [setLanguage],
  );

  const setAppTheme = useCallback(
    async (newTheme: AppTheme) => {
      // Convert isDark boolean to preference theme string
      const themeMode = newTheme.isDark ? "dark" : "light";
      await setTheme(themeMode);
    },
    [setTheme],
  );

  const setAppFontSize = useCallback(
    async (size: number) => {
      await setFontSize(size);
    },
    [setFontSize],
  );

  const setAppShowTransliteration = useCallback(
    async (show: boolean) => {
      await setToggle("showTransliteration", show);
    },
    [setToggle],
  );

  const value: AppContextType = useMemo(
    () => ({
      language: prefs.language,
      setLanguage: setAppLanguage,
      theme: { isDark },
      setTheme: setAppTheme,
      fontSize: prefs.fontSize,
      setFontSize: setAppFontSize,
      showTransliteration: prefs.toggles.showTransliteration,
      setShowTransliteration: setAppShowTransliteration,
    }),
    [
      prefs.language,
      prefs.fontSize,
      prefs.toggles.showTransliteration,
      isDark,
      setAppLanguage,
      setAppTheme,
      setAppFontSize,
      setAppShowTransliteration,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
