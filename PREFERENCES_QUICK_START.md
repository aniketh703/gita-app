# Preferences System - Quick Reference

## Quick Setup (30 seconds)

```tsx
// 1. Wrap app with provider
import { PreferencesProvider } from '@/src/context/PreferencesContext';

<PreferencesProvider>
  <YourApp />
</PreferencesProvider>

// 2. Use in any component
import { usePreferences } from '@/src/context/PreferencesContext';

const MyComponent = () => {
  const { preferences, setFontSize, setTheme } = usePreferences();
  
  return <Text style={{fontSize: preferences.fontSize}}>Hello</Text>;
};
```

## Common Patterns

### Read Current Settings
```tsx
const { preferences } = usePreferences();

preferences.fontSize           // 16
preferences.language          // 'english' | 'hindi'
preferences.theme             // 'light' | 'dark' | 'auto'
preferences.toggles.showTransliteration  // boolean
```

### Change Theme
```tsx
const { setTheme } = usePreferences();

await setTheme('dark');      // Switch to dark mode
await setTheme('light');     // Switch to light mode
await setTheme('auto');      // Follow system preference
```

### Change Language
```tsx
const { setLanguage } = usePreferences();

await setLanguage('english');
await setLanguage('hindi');
```

### Adjust Font Size
```tsx
const { setFontSize } = usePreferences();

await setFontSize(14);   // Small text
await setFontSize(16);   // Default
await setFontSize(22);   // Large text (accessibility)
```

### Toggle Features
```tsx
const { setToggle, preferences } = usePreferences();

// Check current state
const isEnabled = preferences.toggles.showTransliteration;

// Toggle it
await setToggle('showTransliteration', !isEnabled);

// Or directly set
await setToggle('showTransliteration', true);
await setToggle('enableHaptics', false);
```

### Batch Update
```tsx
const { updatePreferences } = usePreferences();

// Update multiple settings at once
await updatePreferences({
  fontSize: 20,
  theme: 'dark',
  toggles: {
    enableHaptics: true,
    showTransliteration: true,
  },
});
```

### Reset to Defaults
```tsx
const { resetPreferences } = usePreferences();

await resetPreferences();
```

## Optimized Hooks

### Single Preference
```tsx
// Only re-render when fontSize changes
const fontSize = usePreference('fontSize');
const theme = usePreference('theme');
const language = usePreference('language');
```

### Single Toggle
```tsx
// Only re-render when this toggle changes
const showTranslit = useToggle('showTransliteration');
const haptics = useToggle('enableHaptics');
```

### All Preferences (read-only)
```tsx
// Use when you need multiple preferences
const preferences = usePreferencesState();
```

## Available Settings

```
Language
├─ english (default)
└─ hindi

Font Size
├─ Min: 12px
├─ Default: 16px
└─ Max: 28px

Theme
├─ light
├─ dark
└─ auto (follows system)

Toggles
├─ showTransliteration (default: false)
├─ showDevanagari (default: true)
├─ enableHaptics (default: true)
├─ autoPlayAudio (default: false)
├─ showCommentary (default: true)
└─ expandAllVerses (default: false)
```

## Applying Theme to Components

```tsx
import { usePreferencesState } from '@/src/context/PreferencesContext';
import { useColorScheme } from 'react-native';

export const MyStyledComponent = () => {
  const prefs = usePreferencesState();
  const systemTheme = useColorScheme(); // 'light' | 'dark' | null

  // Determine actual theme
  const isDark = 
    prefs.theme === 'auto' 
      ? systemTheme === 'dark' 
      : prefs.theme === 'dark';

  const colors = isDark 
    ? { bg: '#1a1a1a', text: '#fff' }
    : { bg: '#fff', text: '#000' };

  return (
    <View style={{
      backgroundColor: colors.bg,
      fontSize: prefs.fontSize,
    }}>
      <Text style={{ color: colors.text }}>
        {prefs.language === 'english' ? 'Hello' : 'नमस्ते'}
      </Text>
    </View>
  );
};
```

## Testing

```tsx
import { usePreferences } from '@/src/context/PreferencesContext';

// Mock the hook
jest.mock('@/src/context/PreferencesContext', () => ({
  usePreferences: () => ({
    preferences: {
      fontSize: 16,
      language: 'english',
      theme: 'light',
      toggles: { /* ... */ }
    },
    setFontSize: jest.fn(),
    setTheme: jest.fn(),
    // ... etc
  }),
}));
```

## File Structure

```
PreferencesContext.tsx
├─ PreferencesProvider (wrapper component)
└─ Hooks:
   ├─ usePreferences()      → Full context
   ├─ usePreferencesState() → Read-only
   ├─ usePreference()       → Single value
   └─ useToggle()           → Single toggle

preferences.ts (utilities)
├─ loadPreferences()
├─ savePreferences()
├─ updateSinglePreference()
├─ updateToggle()
├─ updatePreferences()
├─ resetToDefaults()
└─ clearPreferences()

preferences.ts (types)
├─ Preferences
├─ PreferencesToggles
├─ IPreferencesContext
├─ FONT_SIZE_RANGE
├─ DEFAULT_PREFERENCES
└─ Constants
```

## Error Handling

All async operations fail gracefully:
- Invalid font sizes are clamped (12-28)
- Storage errors fall back to current state
- Async operations don't throw by default
- Check console for error logs

```tsx
const { setFontSize } = usePreferences();

try {
  await setFontSize(18);
} catch (error) {
  // Handle error
  console.error('Font size update failed:', error);
}
```

## Type Safety

All settings are fully typed:

```tsx
import { 
  LanguagePreference,    // 'english' | 'hindi'
  ThemePreference,       // 'light' | 'dark' | 'auto'
  Preferences,           // Full type
  PreferencesToggles,    // Toggles type
  PreferencesUpdate,     // Partial update type
} from '@/src/types/preferences';

// Type-safe usage
const setLanguage = async (lang: LanguagePreference) => {
  // lang is guaranteed to be 'english' or 'hindi'
};
```

## AsyncStorage Keys

- `gita_preferences_v1` (main)
- `gita_preferences_language` (backup)
- `gita_preferences_font_size` (backup)
- `gita_preferences_theme` (backup)
- `gita_preferences_toggles` (backup)

## Performance Tips

1. **Use specialized hooks** for better performance:
   ```tsx
   // ✅ Good - only re-renders when fontSize changes
   const fontSize = usePreference('fontSize');
   
   // ⚠️  Less optimal - re-renders on any preference change
   const { preferences } = usePreferences();
   const fontSize = preferences.fontSize;
   ```

2. **Batch updates** when changing multiple settings:
   ```tsx
   // ✅ Good - one storage write
   await updatePreferences({ fontSize: 18, theme: 'dark' });
   
   // ⚠️  Less optimal - multiple storage writes
   await setFontSize(18);
   await setTheme('dark');
   ```

3. **Use read-only hooks** when you don't need to update:
   ```tsx
   // ✅ Good - lighter context
   const prefs = usePreferencesState();
   
   // ⚠️  Overkill - unnecessary methods
   const { preferences } = usePreferences();
   ```

## Integrating with Existing Settings Screen

```tsx
import { usePreferences } from '@/src/context/PreferencesContext';
import { View, Text, Switch, Slider } from 'react-native';

export const SettingsScreen = () => {
  const {
    preferences,
    setLanguage,
    setFontSize,
    setTheme,
    setToggle,
    resetPreferences,
  } = usePreferences();

  return (
    <View>
      {/* Theme */}
      <View>
        <Text>Theme</Text>
        <Switch 
          value={preferences.theme === 'dark'}
          onValueChange={(v) => setTheme(v ? 'dark' : 'light')}
        />
      </View>

      {/* Language */}
      <View>
        <Text>Language</Text>
        <Switch 
          value={preferences.language === 'hindi'}
          onValueChange={(v) => setLanguage(v ? 'hindi' : 'english')}
        />
      </View>

      {/* Font Size */}
      <View>
        <Text>Font Size: {preferences.fontSize}px</Text>
        <Slider
          min={12}
          max={28}
          step={2}
          value={preferences.fontSize}
          onValueChange={setFontSize}
        />
      </View>

      {/* Toggles */}
      <Switch 
        value={preferences.toggles.showTransliteration}
        onValueChange={(v) => setToggle('showTransliteration', v)}
      />

      {/* Reset */}
      <Button onPress={resetPreferences} title="Reset Settings" />
    </View>
  );
};
```

See [PREFERENCES_README.md](./PREFERENCES_README.md) for full documentation.
