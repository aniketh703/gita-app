import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContextType, LangKey, AppTheme } from '@/src/types';

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANGUAGE: 'gita_language',
  THEME: 'gita_theme',
  FONT_SIZE: 'gita_font_size',
  TRANSLITERATION: 'gita_transliteration',
};

const DEFAULT_VALUES = {
  language: 'english' as LangKey,
  theme: { isDark: false },
  fontSize: 16,
  showTransliteration: false,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LangKey>(DEFAULT_VALUES.language);
  const [theme, setThemeState] = useState<AppTheme>(DEFAULT_VALUES.theme);
  const [fontSize, setFontSizeState] = useState(DEFAULT_VALUES.fontSize);
  const [showTransliteration, setShowTransliterationState] = useState(
    DEFAULT_VALUES.showTransliteration
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const [lang, themeStr, sizeStr, translitStr] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEYS.THEME),
          AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE),
          AsyncStorage.getItem(STORAGE_KEYS.TRANSLITERATION),
        ]);

        if (lang) setLanguageState(lang as LangKey);
        if (themeStr) setThemeState(JSON.parse(themeStr));
        if (sizeStr) setFontSizeState(parseInt(sizeStr, 10));
        if (translitStr) setShowTransliterationState(translitStr === 'true');
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadSettings();
  }, []);

  const setLanguage = async (lang: LangKey) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  const setTheme = async (newTheme: AppTheme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(newTheme));
  };

  const setFontSize = async (size: number) => {
    setFontSizeState(size);
    await AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, size.toString());
  };

  const setShowTransliteration = async (show: boolean) => {
    setShowTransliterationState(show);
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSLITERATION, show.toString());
  };

  if (!isLoaded) {
    return null; // or a splash screen
  }

  const value: AppContextType = {
    language,
    setLanguage,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    showTransliteration,
    setShowTransliteration,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
