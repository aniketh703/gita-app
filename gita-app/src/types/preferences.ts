/**
 * Preferences Model for Bhagavad Gita App
 *
 * Supports:
 * - Language selection
 * - Font size adjustments
 * - Theme preference (light/sepia/dark)
 * - Feature toggles
 *
 * All preferences are persisted to AsyncStorage
 */

export type LanguagePreference = "english" | "hindi";
export type ThemePreference = "light" | "sepia" | "dark" | "auto";

/**
 * Font size range: 12-28 px
 * Default: 16 px
 */
export const FONT_SIZE_RANGE = {
  MIN: 12,
  MAX: 28,
  DEFAULT: 16,
  STEP: 2,
} as const;

/**
 * Theme mode options
 */
export const THEME_OPTIONS = {
  LIGHT: "light",
  SEPIA: "sepia",
  DARK: "dark",
  AUTO: "auto",
} as const;

/**
 * Language options
 */
export const LANGUAGE_OPTIONS = {
  ENGLISH: "english",
  HINDI: "hindi",
} as const;

/**
 * Preferences toggles - Configure feature flags and UI options
 */
export interface PreferencesToggles {
  /** Show Sanskrit transliteration alongside English text */
  showTransliteration: boolean;

  /** Show Devanagari script (Hindu/Hindi) text */
  showDevanagari: boolean;

  /** Enable haptic feedback for interactions */
  enableHaptics: boolean;

  /** Auto-play audio pronunciation (if available) */
  autoPlayAudio: boolean;

  /** Show verse commentary by default */
  showCommentary: boolean;

  /** Expand all verses on chapter view */
  expandAllVerses: boolean;
}

/**
 * Complete preferences state model
 */
export interface Preferences {
  /** Selected language for UI and content */
  language: LanguagePreference;

  /** Base font size in pixels */
  fontSize: number;

  /** Theme preference */
  theme: ThemePreference;

  /** Feature toggles and behavior settings */
  toggles: PreferencesToggles;
}

/**
 * Type for partial preference updates
 * Allows updating specific preferences without affecting others
 */
export type PreferencesUpdate = Partial<Omit<Preferences, "toggles">> & {
  toggles?: Partial<PreferencesToggles>;
};

/**
 * Default preferences configuration
 */
export const DEFAULT_PREFERENCES: Preferences = {
  language: "english",
  fontSize: FONT_SIZE_RANGE.DEFAULT,
  theme: "auto",
  toggles: {
    showTransliteration: false,
    showDevanagari: true,
    enableHaptics: true,
    autoPlayAudio: false,
    showCommentary: true,
    expandAllVerses: false,
  },
};

/**
 * Context type for preferences management
 */
export interface IPreferencesContext {
  preferences: Preferences;
  isLoading: boolean;

  // Preference setters
  setLanguage: (language: LanguagePreference) => Promise<void>;
  setFontSize: (size: number) => Promise<void>;
  setTheme: (theme: ThemePreference) => Promise<void>;
  setToggle: <K extends keyof PreferencesToggles>(
    key: K,
    value: PreferencesToggles[K],
  ) => Promise<void>;
  updatePreferences: (update: PreferencesUpdate) => Promise<void>;

  // Utility
  resetPreferences: () => Promise<void>;
}
