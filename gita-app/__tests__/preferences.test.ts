/**
 * Preferences System Tests
 *
 * Unit tests for the preferences model, utilities, and context.
 * These tests verify AsyncStorage persistence, type safety, and error handling.
 */

import {
    DEFAULT_PREFERENCES,
    FONT_SIZE_RANGE,
    Preferences,
    PreferencesToggles,
    PreferencesUpdate,
} from "@/src/types/preferences";
import {
    clearPreferences,
    loadPreferences,
    resetToDefaults,
    savePreferences,
    updatePreferences,
    updateSinglePreference,
    updateToggle,
} from "@/src/utils/preferences";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage");

describe("Preferences Utilities", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await clearPreferences();
  });

  describe("loadPreferences", () => {
    it("should return default preferences when storage is empty", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const prefs = await loadPreferences();

      expect(prefs).toEqual(DEFAULT_PREFERENCES);
    });

    it("should load complete preferences from storage", async () => {
      const stored: Preferences = {
        language: "hindi",
        fontSize: 20,
        theme: "sepia",
        toggles: {
          showTransliteration: true,
          showDevanagari: true,
          enableHaptics: false,
          autoPlayAudio: true,
          showCommentary: false,
          expandAllVerses: true,
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(stored),
      );

      const prefs = await loadPreferences();

      expect(prefs).toEqual(stored);
    });

    it("should fallback to individual keys if main key missing", async () => {
      const mockCalls = [
        null,
        "hindi",
        "20",
        "sepia",
        '{"showTransliteration":true}',
      ];
      (AsyncStorage.getItem as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockCalls.shift()),
      );

      const prefs = await loadPreferences();

      expect(prefs.language).toBe("hindi");
      expect(prefs.fontSize).toBe(20);
      expect(prefs.theme).toBe("sepia");
      expect(prefs.toggles.showTransliteration).toBe(true);
    });

    it("should merge with defaults for missing fields", async () => {
      const partial = {
        language: "hindi",
        // Missing other fields
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(partial),
      );

      const prefs = await loadPreferences();

      expect(prefs.language).toBe("hindi");
      expect(prefs.fontSize).toBe(DEFAULT_PREFERENCES.fontSize);
      expect(prefs.theme).toBe(DEFAULT_PREFERENCES.theme);
    });

    it("should return defaults on storage error", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error("Storage error"),
      );

      const prefs = await loadPreferences();

      expect(prefs).toEqual(DEFAULT_PREFERENCES);
    });
  });

  describe("savePreferences", () => {
    it("should save preferences to AsyncStorage", async () => {
      const prefs: Preferences = {
        language: "hindi",
        fontSize: 18,
        theme: "dark",
        toggles: DEFAULT_PREFERENCES.toggles,
      };

      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await savePreferences(prefs);

      expect(AsyncStorage.setItem).toHaveBeenCalled();
      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;

      // Verify main key is saved
      expect(
        calls.some((call: any[]) => call[0] === "gita_preferences_v1"),
      ).toBe(true);
    });

    it("should throw on save error", async () => {
      const prefs = DEFAULT_PREFERENCES;
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error("Save failed"),
      );

      await expect(savePreferences(prefs)).rejects.toThrow("Save failed");
    });
  });

  describe("updateSinglePreference", () => {
    it("should update language preference", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await updateSinglePreference("language", "hindi");

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const savedData = calls.find(
        (call: any[]) => call[0] === "gita_preferences_v1",
      );

      expect(savedData).toBeDefined();
      const saved = JSON.parse(savedData[1]);
      expect(saved.language).toBe("hindi");
    });

    it("should update font size preference", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await updateSinglePreference("fontSize", 22);

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const savedData = calls.find(
        (call: any[]) => call[0] === "gita_preferences_v1",
      );

      const saved = JSON.parse(savedData[1]);
      expect(saved.fontSize).toBe(22);
    });

    it("should update theme preference", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await updateSinglePreference("theme", "sepia");

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const savedData = calls.find(
        (call: any[]) => call[0] === "gita_preferences_v1",
      );

      const saved = JSON.parse(savedData[1]);
      expect(saved.theme).toBe("sepia");
    });
  });

  describe("updateToggle", () => {
    it("should update a toggle value", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await updateToggle("showTransliteration", true);

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const savedData = calls.find(
        (call: any[]) => call[0] === "gita_preferences_v1",
      );

      const saved = JSON.parse(savedData[1]);
      expect(saved.toggles.showTransliteration).toBe(true);
    });

    it("should preserve other toggle values", async () => {
      const stored: Preferences = {
        ...DEFAULT_PREFERENCES,
        toggles: {
          ...DEFAULT_PREFERENCES.toggles,
          enableHaptics: false,
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(stored),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await updateToggle("showTransliteration", true);

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const savedData = calls.find(
        (call: any[]) => call[0] === "gita_preferences_v1",
      );

      const saved = JSON.parse(savedData[1]);
      expect(saved.toggles.showTransliteration).toBe(true);
      expect(saved.toggles.enableHaptics).toBe(false);
    });
  });

  describe("updatePreferences (batch)", () => {
    it("should update multiple preferences", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const update: PreferencesUpdate = {
        language: "hindi",
        fontSize: 20,
        toggles: {
          showTransliteration: true,
        },
      };

      const result = await updatePreferences(update);

      expect(result.language).toBe("hindi");
      expect(result.fontSize).toBe(20);
      expect(result.toggles.showTransliteration).toBe(true);
      // Other toggles should retain defaults
      expect(result.toggles.enableHaptics).toBe(
        DEFAULT_PREFERENCES.toggles.enableHaptics,
      );
    });

    it("should preserve non-updated fields", async () => {
      const stored: Preferences = {
        language: "english",
        fontSize: 18,
        theme: "sepia",
        toggles: DEFAULT_PREFERENCES.toggles,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(stored),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const update: PreferencesUpdate = {
        fontSize: 22,
      };

      const result = await updatePreferences(update);

      expect(result.language).toBe("english");
      expect(result.fontSize).toBe(22);
      expect(result.theme).toBe("sepia");
    });
  });

  describe("resetToDefaults", () => {
    it("should reset all preferences to defaults", async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await resetToDefaults();

      expect(result).toEqual(DEFAULT_PREFERENCES);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it("should clear custom values", async () => {
      const stored: Preferences = {
        language: "hindi",
        fontSize: 28,
        theme: "sepia",
        toggles: {
          ...DEFAULT_PREFERENCES.toggles,
          showTransliteration: true,
          enableHaptics: false,
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(stored),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await resetToDefaults();

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const savedData = calls.find(
        (call: any[]) => call[0] === "gita_preferences_v1",
      );

      const saved = JSON.parse(savedData[1]);
      expect(saved).toEqual(DEFAULT_PREFERENCES);
    });
  });

  describe("clearPreferences", () => {
    it("should remove all preferences from storage", async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

      await clearPreferences();

      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
    });

    it("should throw on clear error", async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockRejectedValue(
        new Error("Clear failed"),
      );

      await expect(clearPreferences()).rejects.toThrow("Clear failed");
    });
  });
});

describe("Preferences Constants", () => {
  describe("FONT_SIZE_RANGE", () => {
    it("should have valid min and max values", () => {
      expect(FONT_SIZE_RANGE.MIN).toBe(12);
      expect(FONT_SIZE_RANGE.MAX).toBe(28);
      expect(FONT_SIZE_RANGE.DEFAULT).toBe(16);
      expect(FONT_SIZE_RANGE.STEP).toBe(2);
    });

    it("should have min less than max", () => {
      expect(FONT_SIZE_RANGE.MIN).toBeLessThan(FONT_SIZE_RANGE.MAX);
    });

    it("should have default within range", () => {
      expect(FONT_SIZE_RANGE.DEFAULT).toBeGreaterThanOrEqual(
        FONT_SIZE_RANGE.MIN,
      );
      expect(FONT_SIZE_RANGE.DEFAULT).toBeLessThanOrEqual(FONT_SIZE_RANGE.MAX);
    });
  });

  describe("DEFAULT_PREFERENCES", () => {
    it("should have valid language", () => {
      expect(["english", "hindi"]).toContain(DEFAULT_PREFERENCES.language);
    });

    it("should have valid theme", () => {
      expect(["light", "dark", "auto"]).toContain(DEFAULT_PREFERENCES.theme);
    });

    it("should have valid font size", () => {
      expect(DEFAULT_PREFERENCES.fontSize).toBeGreaterThanOrEqual(
        FONT_SIZE_RANGE.MIN,
      );
      expect(DEFAULT_PREFERENCES.fontSize).toBeLessThanOrEqual(
        FONT_SIZE_RANGE.MAX,
      );
    });

    it("should have all toggle keys", () => {
      const requiredToggles: Array<keyof PreferencesToggles> = [
        "showTransliteration",
        "showDevanagari",
        "enableHaptics",
        "autoPlayAudio",
        "showCommentary",
        "expandAllVerses",
      ];

      requiredToggles.forEach((key) => {
        expect(key in DEFAULT_PREFERENCES.toggles).toBe(true);
        expect(typeof DEFAULT_PREFERENCES.toggles[key]).toBe("boolean");
      });
    });
  });
});

describe("Type Validation", () => {
  it("should enforce language type safety", () => {
    const valid: PreferencesUpdate = {
      language: "english",
    };
    expect(valid.language).toBeDefined();

    // This would cause TypeScript error in real code:
    // const invalid: PreferencesUpdate = { language: 'spanish' };
  });

  it("should enforce theme type safety", () => {
    const valid: PreferencesUpdate = {
      theme: "dark",
    };
    expect(valid.theme).toBeDefined();

    // This would cause TypeScript error:
    // const invalid: PreferencesUpdate = { theme: 'blue' };
  });

  it("should enforce font size as number", () => {
    const valid: PreferencesUpdate = {
      fontSize: 18,
    };
    expect(typeof valid.fontSize).toBe("number");

    // This would cause TypeScript error:
    // const invalid: PreferencesUpdate = { fontSize: 'large' };
  });
});
