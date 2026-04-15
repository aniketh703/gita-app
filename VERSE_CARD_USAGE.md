# VerseCard Component Usage

The new VerseCard component displays a single verse per page with all requested features.

## Features Included

1. ✅ **Verse at the top** - Sanskrit text displayed prominently
2. ✅ **Language switch** - Toggle between English and Hindi
3. ✅ **Meaning/Explanation** - Shows transliteration, translation, and commentary
4. ✅ **Navigation controls** - Previous/Next verse buttons
5. ✅ **Bottom navigation bar** - Quick access to Home, Chapters, and Explore
6. ✅ **Back button** - Return to chapters list

## How to Use

Replace your current `verse.tsx` screen with this implementation:

```tsx
import React, { useMemo } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useApp } from '@/src/context/AppContext';
import { usePreferencesState } from '@/src/context/PreferencesContext';
import { getChapter, getNextVerse, getPreviousVerse } from '@/src/utils/gitaData';
import { VerseCard } from '@/components/verse-card';

export default function VerseScreen() {
  const { ch: chapterStr, verse: verseStr } = useLocalSearchParams<{
    ch: string;
    verse: string;
  }>();
  const router = useRouter();
  const { theme, language, setLanguage } = useApp();
  const prefs = usePreferencesState();
  const systemTheme = useColorScheme();

  const isDark =
    prefs.theme === 'auto'
      ? systemTheme === 'dark'
      : prefs.theme === 'dark';

  const chapter = parseInt(chapterStr || '1', 10);
  const verseNum = parseInt(verseStr || '1', 10);

  const chapterData = useMemo(() => getChapter(chapter), [chapter]);
  const currentVerse = useMemo(
    () => chapterData?.verses.find((v) => v.verse === verseNum),
    [chapterData, verseNum]
  );
  
  const nextVerse = useMemo(() => getNextVerse(chapter, verseNum), [chapter, verseNum]);
  const prevVerse = useMemo(() => getPreviousVerse(chapter, verseNum), [chapter, verseNum]);

  const handleNavigatePrevious = () => {
    if (prevVerse) {
      router.push(`/verse?ch=${prevVerse.chapter}&verse=${prevVerse.verse}` as Href);
    }
  };

  const handleNavigateNext = () => {
    if (nextVerse) {
      router.push(`/verse?ch=${nextVerse.chapter}&verse=${nextVerse.verse}` as Href);
    }
  };

  const handleLanguageChange = (lang: 'english' | 'hindi') => {
    setLanguage(lang);
  };

  if (!currentVerse || !chapterData) {
    return <View style={styles.container}><Text>Verse not found</Text></View>;
  }

  return (
    <VerseCard
      verse={currentVerse}
      chapter={chapter}
      language={language}
      fontSize={prefs.fontSize}
      isDark={isDark}
      onLanguageChange={handleLanguageChange}
      onNavigatePrevious={handleNavigatePrevious}
      onNavigateNext={handleNavigateNext}
      hasPrevious={!!prevVerse}
      hasNext={!!nextVerse}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `verse` | `Verse` | The verse object to display |
| `chapter` | `number` | Current chapter number |
| `language` | `LangKey` | Current language ('english' or 'hindi') |
| `fontSize` | `number` | Base font size (scaled automatically) |
| `isDark` | `boolean` | Dark mode flag |
| `onLanguageChange` | `(lang: LangKey) => void` | Language switch handler |
| `onNavigatePrevious` | `() => void` | Navigate to previous verse |
| `onNavigateNext` | `() => void` | Navigate to next verse |
| `hasPrevious` | `boolean` | Enable/disable previous button |
| `hasNext` | `boolean` | Enable/disable next button |

## Layout Structure

```
┌─────────────────────────────────────┐
│  Back Button │ Chapter X - Verse Y  │ ← Header
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │     Sanskrit Verse          │   │ ← Verse Display
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ English 🔄 हिंदी             │   │ ← Language Switch
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Meaning & Explanation       │   │
│  │ • Transliteration           │   │
│  │ • Translation               │   │ ← Meaning Section
│  │ • Commentary                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────┐    ┌──────────┐      │
│  │ ← Previous│    │  Next →  │      │ ← Navigation Buttons
│  └──────────┘    └──────────┘      │
│                                     │
├─────────────────────────────────────┤
│  🏠 Home │ 📖 Chapters │ 🔍 Explore │ ← Bottom Nav Bar
└─────────────────────────────────────┘
```

## Notes

- The component is fully self-contained with its own styling
- Automatically handles light/dark themes
- Responsive font scaling based on user preferences
- Only shows transliteration/commentary if meaningful content exists
- Navigation buttons are disabled when at first/last verse
