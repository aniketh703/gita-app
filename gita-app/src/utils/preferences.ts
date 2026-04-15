/**
 * AsyncStorage utilities for preferences persistence
 *
 * Handles serialization, deserialization, and error handling for
 * storing and retrieving user preferences from device storage.
 */

import {
    DEFAULT_PREFERENCES,
    Preferences,
    PreferencesToggles,
    PreferencesUpdate,
} from "@/src/types/preferences";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage keys for all preference items
 */
const STORAGE_KEYS = {
  PREFERENCES: "gita_preferences_v1",
  LANGUAGE: "gita_preferences_language",
  FONT_SIZE: "gita_preferences_font_size",
  THEME: "gita_preferences_theme",
  TOGGLES: "gita_preferences_toggles",
} as const;

/**
 * Load preferences from AsyncStorage
 * Returns default preferences if storage is empty or on error
 */
export async function loadPreferences(): Promise<Preferences> {
  try {
    // Try to load the complete preferences object first
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure new fields are present
      return mergeWithDefaults(parsed);
    }

    // Fallback: try loading individual preference items
    const [language, fontSize, theme, togglesStr] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
      AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE),
      AsyncStorage.getItem(STORAGE_KEYS.THEME),
      AsyncStorage.getItem(STORAGE_KEYS.TOGGLES),
    ]);

    if (language || fontSize || theme || togglesStr) {
      const parsed: Record<string, any> = {};

      if (language) parsed.language = language;
      if (fontSize) parsed.fontSize = parseInt(fontSize, 10);
      if (theme) parsed.theme = theme;
      if (togglesStr) {
        try {
          parsed.toggles = JSON.parse(togglesStr);
        } catch {
          // Invalid JSON, ignore
        }
      }

      return mergeWithDefaults(parsed);
    }

    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error("Failed to load preferences:", error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save preferences to AsyncStorage
 * Stores both the complete object and individual items for compatibility
 */
export async function savePreferences(preferences: Preferences): Promise<void> {
  try {
    // Save complete preferences object
    await AsyncStorage.setItem(
      STORAGE_KEYS.PREFERENCES,
      JSON.stringify(preferences),
    );

    // Also save individual items for backwards compatibility
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, preferences.language),
      AsyncStorage.setItem(
        STORAGE_KEYS.FONT_SIZE,
        preferences.fontSize.toString(),
      ),
      AsyncStorage.setItem(STORAGE_KEYS.THEME, preferences.theme),
      AsyncStorage.setItem(
        STORAGE_KEYS.TOGGLES,
        JSON.stringify(preferences.toggles),
      ),
    ]);
  } catch (error) {
    console.error("Failed to save preferences:", error);
    throw error;
  }
}

/**
 * Clear all preferences from storage
 */
export async function clearPreferences(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PREFERENCES,
      STORAGE_KEYS.LANGUAGE,
      STORAGE_KEYS.FONT_SIZE,
      STORAGE_KEYS.THEME,
      STORAGE_KEYS.TOGGLES,
    ]);
  } catch (error) {
    console.error("Failed to clear preferences:", error);
    throw error;
  }
}

/**
 * Update a single preference value
 */
export async function updateSinglePreference(
  key: keyof Omit<Preferences, "toggles">,
  value: any,
): Promise<void> {
  try {
    const current = await loadPreferences();
    const updated = { ...current, [key]: value };
    await savePreferences(updated);
  } catch (error) {
    console.error(`Failed to update preference "${key}":`, error);
    throw error;
  }
}

/**
 * Update a single toggle value
 */
export async function updateToggle<K extends keyof PreferencesToggles>(
  key: K,
  value: PreferencesToggles[K],
): Promise<void> {
  try {
    const current = await loadPreferences();
    const updated: Preferences = {
      ...current,
      toggles: {
        ...current.toggles,
        [key]: value,
      },
    };
    await savePreferences(updated);
  } catch (error) {
    console.error(`Failed to update toggle "${key}":`, error);
    throw error;
  }
}

/**
 * Update multiple preferences at once
 */
export async function updatePreferences(
  update: PreferencesUpdate,
): Promise<Preferences> {
  try {
    const current = await loadPreferences();
    const updated: Preferences = {
      ...current,
      ...update,
      toggles: {
        ...current.toggles,
        ...(update.toggles || {}),
      },
    };
    await savePreferences(updated);
    return updated;
  } catch (error) {
    console.error("Failed to update preferences:", error);
    throw error;
  }
}

/**
 * Reset preferences to default values
 */
export async function resetToDefaults(): Promise<Preferences> {
  try {
    await savePreferences(DEFAULT_PREFERENCES);
    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error("Failed to reset preferences:", error);
    throw error;
  }
}

/**
 * Merge partially loaded preferences with defaults
 * Ensures all required fields are present
 */
function mergeWithDefaults(partial: Partial<Preferences>): Preferences {
  const validTheme = partial.theme;
  const isValidThemeValue =
    validTheme === "light" ||
    validTheme === "sepia" ||
    validTheme === "dark" ||
    validTheme === "auto";

  return {
    language: partial.language ?? DEFAULT_PREFERENCES.language,
    fontSize: partial.fontSize ?? DEFAULT_PREFERENCES.fontSize,
    theme: isValidThemeValue ? validTheme : DEFAULT_PREFERENCES.theme,
    toggles: {
      showTransliteration:
        partial.toggles?.showTransliteration ??
        DEFAULT_PREFERENCES.toggles.showTransliteration,
      showDevanagari:
        partial.toggles?.showDevanagari ??
        DEFAULT_PREFERENCES.toggles.showDevanagari,
      enableHaptics:
        partial.toggles?.enableHaptics ??
        DEFAULT_PREFERENCES.toggles.enableHaptics,
      autoPlayAudio:
        partial.toggles?.autoPlayAudio ??
        DEFAULT_PREFERENCES.toggles.autoPlayAudio,
      showCommentary:
        partial.toggles?.showCommentary ??
        DEFAULT_PREFERENCES.toggles.showCommentary,
      expandAllVerses:
        partial.toggles?.expandAllVerses ??
        DEFAULT_PREFERENCES.toggles.expandAllVerses,
    },
  };
}

/**
 * Export all storage keys for testing or debugging
 */
export const PREFERENCES_STORAGE_KEYS = STORAGE_KEYS;
