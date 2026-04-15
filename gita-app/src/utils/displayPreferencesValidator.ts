/**
 * Display Preferences Validator
 * Ensures at least one display option is enabled
 * Prevents invalid states where user disables all text options
 */

export interface DisplayPreferences {
  showSanskrit: boolean;
  showTransliteration: boolean;
  showEnglish: boolean;
  showHindi: boolean;
}

/**
 * Validates that at least one display option is enabled
 */
export const validateDisplayPreferences = (
  preferences: DisplayPreferences,
): boolean => {
  const enabledCount = Object.values(preferences).filter(
    (value) => value === true,
  ).length;
  return enabledCount > 0;
};

/**
 * Gets the first enabled option as a default fallback
 */
export const getDefaultEnabledOption = (
  preferences: DisplayPreferences,
): keyof DisplayPreferences | null => {
  if (preferences.showSanskrit) return "showSanskrit";
  if (preferences.showTransliteration) return "showTransliteration";
  if (preferences.showEnglish) return "showEnglish";
  if (preferences.showHindi) return "showHindi";
  return null;
};

/**
 * Prevents disabling all options - keeps at least one enabled
 */
export const enforceMinimumDisplayOptions = (
  preferences: DisplayPreferences,
  attemptedChange: keyof DisplayPreferences,
  newValue: boolean,
): DisplayPreferences => {
  // If trying to disable and this is the only enabled option, return original
  if (newValue === false) {
    const otherOptions = Object.keys(preferences)
      .filter((key) => key !== attemptedChange)
      .some((key) => preferences[key as keyof DisplayPreferences] === true);

    if (!otherOptions) {
      // This is the last enabled option, don't disable it
      return preferences;
    }
  }

  return {
    ...preferences,
    [attemptedChange]: newValue,
  };
};
