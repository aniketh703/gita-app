# Development API Reference

## AppContext Hook

```typescript
import { useApp } from '@/src/context/AppContext';

const { language, setLanguage, theme, setTheme, fontSize, setFontSize, showTransliteration, setShowTransliteration } = useApp();
```

All state is automatically persisted to AsyncStorage.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `language` | `LangKey` | Current language ('english'\|'hindi'\|'sanskrit') |
| `setLanguage` | function | Update language and persist |
| `theme` | `AppTheme` | `{ isDark: boolean }` |
| `setTheme` | function | Update theme and persist |
| `fontSize` | number | 12-24, in pixels |
| `setFontSize` | function | Update font size and persist |
| `showTransliteration` | boolean | Transliteration visibility |
| `setShowTransliteration` | function | Toggle transliteration |

## Gita Data Utilities

```typescript
import { 
  getGitaData, 
  getChapters, 
  getChapter, 
  getVerse, 
  getTotalVerses,
  getNextVerse,
  getPreviousVerse 
} from '@/src/utils/gitaData';
```

### Functions

#### `getGitaData(): Chapter[]`
Returns all 18 chapters with all verses.

```typescript
const allChapters = getGitaData();
```

#### `getChapters(): ChapterSummary[]`
Returns lightweight chapter summaries (good for lists).

```typescript
const chapters = getChapters();
// [
//   { chapter: 1, name: {...}, verse_count: 47 },
//   { chapter: 2, name: {...}, verse_count: 72 },
//   ...
// ]
```

#### `getChapter(num: number): Chapter | undefined`
Get a complete chapter with all verses.

```typescript
const ch1 = getChapter(1);
console.log(ch1.verses[0]); // First verse
```

#### `getVerse(chapterNum: number, verseNum: number): Verse | undefined`
Get a single verse.

```typescript
const verse = getVerse(1, 1);
console.log(verse.sanskrit, verse.transliteration, verse.translations.english);
```

#### `getTotalVerses(): number`
Total verse count across all chapters (597).

#### `getNextVerse(ch: number, v: number): { chapter: number, verse: number } | null`
Get next verse reference, or null if at end.

```typescript
const next = getNextVerse(1, 47);
// { chapter: 2, verse: 1 }
```

#### `getPreviousVerse(ch: number, v: number): { chapter: number, verse: number } | null`
Get previous verse reference, or null if at start.

```typescript
const prev = getPreviousVerse(2, 1);
// { chapter: 1, verse: 47 }
```

## Type Definitions

```typescript
// Language key
type LangKey = 'english' | 'hindi' | 'sanskrit';

// Localizable text with 3 languages
interface LocalizableText {
  english: string;
  hindi: string;
  sanskrit: string;
}

// A single verse
interface Verse {
  verse: number;
  sanskrit: string;
  transliteration: string;
  translations: LocalizableText;
  commentary: Partial<LocalizableText>;
}

// A chapter with all its verses
interface Chapter {
  chapter: number;
  verse_count: number;
  name: LocalizableText;
  verses: Verse[];
}

// Chapter summary for lists
interface ChapterSummary {
  chapter: number;
  name: LocalizableText;
  verse_count: number;
}

// App theme
interface AppTheme {
  isDark: boolean;
}

// Full app context
interface AppContextType {
  language: LangKey;
  setLanguage: (lang: LangKey) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  showTransliteration: boolean;
  setShowTransliteration: (show: boolean) => void;
}
```

## AsyncStorage Keys

All user preferences are stored with these keys:

```typescript
const STORAGE_KEYS = {
  LANGUAGE: 'gita_language',           // string
  THEME: 'gita_theme',                 // JSON: { isDark: boolean }
  FONT_SIZE: 'gita_font_size',         // string (number as string)
  TRANSLITERATION: 'gita_transliteration', // string ('true' or 'false')
};
```

Manual access:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const lang = await AsyncStorage.getItem('gita_language');
const theme = JSON.parse(await AsyncStorage.getItem('gita_theme') || '{}');
```

## Navigation Routes

### Stack Navigation Structure

```
Root Layout (Expo Router)
├── (tabs) - Tabs Layout
│   ├── index
│   │   └── GET / or /home
│   └── _layout (Bottom Tabs)
│
└── reading - Stack Screen
    └── GET /reading?ch={chapter}&verse={verse}

Plus:
├── /chapters - Chapters list
└── /settings - Settings screen
```

### Programmatic Navigation

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to verse
router.push(`/reading?ch=1&verse=1`);

// Go back
router.back();

// Top-level  navigation (from reading screen)
router.navigate('/chapters');
```

## Example: Adding a New Screen

1. **Create screen file** `app/new-feature.tsx`:

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useApp } from '@/src/context/AppContext';

export default function NewFeature() {
  const { language, theme, fontSize } = useApp();
  
  const color = theme.isDark ? '#ffffff' : '#000000';
  
  return (
    <View>
      <Text style={{ color, fontSize }}>
        Current language: {language}
      </Text>
    </View>
  );
}
```

2. **Register in tabs** `app/(tabs)/_layout.tsx`:

```typescript
<Tabs.Screen
  name="../new-feature"
  options={{
    title: 'New Feature',
    href: '/new-feature',
    tabBarLabel: 'Feature',
    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✨</Text>,
  }}
/>
```

## Example: Using Verse Data

```typescript
import { getVerse } from '@/src/utils/gitaData';
import { useApp } from '@/src/context/AppContext';

export default function VerseExample() {
  const { language } = useApp();
  const verse = getVerse(1, 1);
  
  if (!verse) return <Text>Verse not found</Text>;
  
  const translation = verse.translations[language];
  const commentary = verse.commentary[language] || 'N/A';
  
  return (
    <View>
      <Text>{verse.sanskrit}</Text>
      <Text>{verse.transliteration}</Text>
      <Text>{translation}</Text>
      <Text>{commentary}</Text>
    </View>
  );
}
```

## Example: Setting App Preferences

```typescript
import { useApp } from '@/src/context/AppContext';

export default function PreferencesExample() {
  const { language, setLanguage, theme, setTheme, fontSize, setFontSize } = useApp();
  
  return (
    <View>
      <Button
        title="Switch to Hindi"
        onPress={() => setLanguage('hindi')}
      />
      
      <Button
        title="Toggle Dark Mode"
        onPress={() => setTheme({ isDark: !theme.isDark })}
      />
      
      <Button
        title="Increase Font"
        onPress={() => setFontSize(Math.min(24, fontSize + 2))}
      />
    </View>
  );
}
```

## Color Scheme

For light/dark dynamic colors:

```typescript
const colors = {
  light: {
    bg: '#ffffff',
    text: '#000000',
    secondary: '#666666',
    accent: '#8B4513',
    border: '#eeeeee',
  },
  dark: {
    bg: '#1a1a1a',
    text: '#ffffff',
    secondary: '#aaaaaa',
    accent: '#d4a574',
    border: '#333333',
  },
};

const { theme } = useApp();
const color = theme.isDark ? colors.dark : colors.light;
```

## Localization Helpers

```typescript
// Get text in current language
function getText(localizable: LocalizableText, language: LangKey): string {
  return localizable[language] || localizable['english'];
}

// Usage
const { language } = useApp();
const chapterName = getText(chapter.name, language);
```

## Future Extension Points

### Bookmarks (v2)

```typescript
interface Bookmark {
  chapter: number;
  verse: number;
  timestamp: number;
  note?: string;
}

// Store in AsyncStorage['gita_bookmarks']
const bookmarks = JSON.parse(
  await AsyncStorage.getItem('gita_bookmarks') || '[]'
);
```

### Daily Reading Plan (v2)

```typescript
interface ReadingPlan {
  type: 'linear' | 'random' | 'custom';
  startDate: number;
  versesPerDay: number;
  currentProgress: number; // verse index
}
```

### Search Index (v2)

Pre-compute searchable text:

```typescript
interface SearchIndex {
  verse: string; // "1.1"
  text: string;  // All searchable content
}
```

### Notes (v2)

```typescript
interface Note {
  verse: string; // "1.1"
  text: string;
  createdAt: number;
  theme?: 'highlight' | 'note' | 'question';
}
```

---

**API Version**: 1.0  
**Last Updated**: 2026-02-07
