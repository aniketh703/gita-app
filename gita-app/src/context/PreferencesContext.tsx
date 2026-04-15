/**
 * Preferences Context Provider
 *
 * Manages global preferences state with automatic persistence to AsyncStorage.
 * Provides hooks for consuming preferences throughout the app.
 *
 * Usage:
 *   1. Wrap your app root with <PreferencesProvider>
 *   2. Use usePreferences() hook in any component
 *   3. Update preferences via context methods
 */

import {
    FONT_SIZE_RANGE,
    IPreferencesContext,
    LanguagePreference,
    Preferences,
    PreferencesToggles,
    PreferencesUpdate,
    ThemePreference,
} from "@/src/types/preferences";
import {
    loadPreferences,
    resetToDefaults,
    updatePreferences as updatePreferencesStorage,
    updateSinglePreference,
    updateToggle,
} from "@/src/utils/preferences";
import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

/**
 * Context instance
 */
const PreferencesContext = createContext<IPreferencesContext | undefined>(
  undefined,
);

/**
 * Provider component props
 */
interface PreferencesProviderProps {
  children: ReactNode;
}

/**
 * Preferences Provider Component
 *
 * Handles loading preferences on app startup, managing state,
 * and persisting changes to AsyncStorage.
 */
export function PreferencesProvider({
  children,
}: PreferencesProviderProps): React.ReactElement | null {
  const [preferences, setPreferences] = useState<Preferences>({
    language: "english",
    fontSize: 16,
    theme: "auto",
    toggles: {
      showTransliteration: false,
      showDevanagari: true,
      enableHaptics: true,
      autoPlayAudio: false,
      showCommentary: true,
      expandAllVerses: false,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load preferences from storage on mount
   */
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        const loaded = await loadPreferences();
        if (isMounted) {
          setPreferences(loaded);
        }
      } catch (error) {
        console.error("Failed to initialize preferences:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Update language preference
   */
  const setLanguage = useCallback(async (language: LanguagePreference) => {
    try {
      setPreferences((prev) => ({ ...prev, language }));
      await updateSinglePreference("language", language);
    } catch (error) {
      console.error("Failed to set language:", error);
      // Note: State was already updated optimistically
    }
  }, []);

  /**
   * Update font size preference
   * Validates size is within acceptable range
   */
  const setFontSize = useCallback(async (size: number) => {
    try {
      // Validate and clamp size
      const clampedSize = Math.max(
        FONT_SIZE_RANGE.MIN,
        Math.min(FONT_SIZE_RANGE.MAX, size),
      );

      setPreferences((prev) => ({
        ...prev,
        fontSize: clampedSize,
      }));
      await updateSinglePreference("fontSize", clampedSize);
    } catch (error) {
      console.error("Failed to set font size:", error);
    }
  }, []);

  /**
   * Update theme preference
   */
  const setTheme = useCallback(async (theme: ThemePreference) => {
    try {
      setPreferences((prev) => ({ ...prev, theme }));
      await updateSinglePreference("theme", theme);
    } catch (error) {
      console.error("Failed to set theme:", error);
    }
  }, []);

  /**
   * Update a single toggle setting
   */
  const setToggle = useCallback(
    async <K extends keyof PreferencesToggles>(
      key: K,
      value: PreferencesToggles[K],
    ) => {
      try {
        setPreferences((prev) => ({
          ...prev,
          toggles: {
            ...prev.toggles,
            [key]: value,
          },
        }));
        await updateToggle(key, value);
      } catch (error) {
        console.error(`Failed to set toggle "${key}":`, error);
      }
    },
    [],
  );

  /**
   * Update multiple preferences at once
   */
  const updatePreferences = useCallback(async (update: PreferencesUpdate) => {
    try {
      const updated = await updatePreferencesStorage(update);
      setPreferences(updated);
    } catch (error) {
      console.error("Failed to update preferences:", error);
      throw error;
    }
  }, []);

  /**
   * Reset all preferences to defaults
   */
  const resetPreferences = useCallback(async () => {
    try {
      const defaults = await resetToDefaults();
      setPreferences(defaults);
    } catch (error) {
      console.error("Failed to reset preferences:", error);
      throw error;
    }
  }, []);

  const value: IPreferencesContext = {
    preferences,
    isLoading,
    setLanguage,
    setFontSize,
    setTheme,
    setToggle,
    updatePreferences,
    resetPreferences,
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

/**
 * Hook to access preferences context
 *
 * Usage:
 *   const prefs = usePreferences();
 *   console.log(prefs.preferences.fontSize);
 *   await prefs.setFontSize(18);
 *
 * @throws Error if used outside PreferencesProvider
 */
export function usePreferences(): IPreferencesContext {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}

/**
 * Hook to access only the preferences state (read-only)
 * Useful when you only need to read preferences without updating
 *
 * Usage:
 *   const { fontSize, theme } = usePreferencesState();
 */
export function usePreferencesState(): Preferences {
  const { preferences } = usePreferences();
  return preferences;
}

/**
 * Hook to access specific preference value
 * Re-renders only when that preference changes
 *
 * Usage:
 *   const fontSize = usePreference('fontSize');
 *   const language = usePreference(['language']);
 */
export function usePreference<K extends keyof Preferences>(
  key: K,
): Preferences[K] {
  const { preferences } = usePreferences();
  return preferences[key];
}

/**
 * Hook to access a specific toggle setting
 * Re-renders only when that toggle changes
 *
 * Usage:
 *   const showTranslit = useToggle('showTransliteration');
 */
export function useToggle<K extends keyof PreferencesToggles>(
  key: K,
): PreferencesToggles[K] {
  const { preferences } = usePreferences();
  return preferences.toggles[key];
}
