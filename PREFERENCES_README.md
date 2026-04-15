# Preferences System Documentation

A comprehensive, type-safe preferences management system for the Bhagavad Gita App with automatic AsyncStorage persistence.

## Overview

The preferences system manages user settings across the entire application with automatic persistence and reload functionality. It supports:

- **Language Selection**: English or Hindi UI
- **Font Size**: Adjustable from 12-28px 
- **Theme**: Light, Dark, or Auto modes
- **Feature Toggles**: 6 configurable boolean settings for UI behavior

## Architecture

### Components

```
src/
├── types/
│   └── preferences.ts          # Type definitions and constants
├── utils/
│   └── preferences.ts          # AsyncStorage operations
├── context/
│   ├── PreferencesContext.tsx  # Context provider and hooks
│   └── PREFERENCES_USAGE.md    # Usage examples
```

### Files

1. **`src/types/preferences.ts`**
   - `Preferences`: Main preferences object type
   - `PreferencesToggles`: Feature toggle settings
   - `IPreferencesContext`: Context interface
   - Constants like `FONT_SIZE_RANGE`, `DEFAULT_PREFERENCES`

2. **`src/utils/preferences.ts`**
   - `loadPreferences()`: Load from AsyncStorage
   - `savePreferences()`: Persist to AsyncStorage
   - `updateSinglePreference()`: Update one preference
   - `updateToggle()`: Update one toggle
   - `updatePreferences()`: Batch update
   - `resetToDefaults()`: Reset all settings
   - `clearPreferences()`: Remove from storage

3. **`src/context/PreferencesContext.tsx`**
   - `PreferencesProvider`: Root provider component
   - `usePreferences()`: Full context hook
   - `usePreferencesState()`: Read-only state hook
   - `usePreference()`: Single preference hook
   - `useToggle()`: Single toggle hook

## Setup

### 1. Wrap Your App

```tsx
import { PreferencesProvider } from '@/src/context/PreferencesContext';

export default function RootLayout() {
  return (
    <PreferencesProvider>
      {/* Your app structure */}
    </PreferencesProvider>
  );
}
```

### 2. Use in Components

```tsx
import { usePreferences } from '@/src/context/PreferencesContext';

export default function MyComponent() {
  const { preferences, setFontSize, setTheme } = usePreferences();

  return (
    <View>
      <Text style={{ fontSize: preferences.fontSize }}>
        Current Theme: {preferences.theme}
      </Text>
    </View>
  );
}
```

## API Reference

### Preferences Object

```typescript
interface Preferences {
  language: 'english' | 'hindi';
  fontSize: number;              // 12-28 (default: 16)
  theme: 'light' | 'dark' | 'auto';
  toggles: {
    showTransliteration: boolean;
    showDevanagari: boolean;
    enableHaptics: boolean;
    autoPlayAudio: boolean;
    showCommentary: boolean;
    expandAllVerses: boolean;
  };
}
```

### Hooks

#### `usePreferences()`
Full context access for reading and updating all preferences.

```tsx
const {
  preferences,        // Current preferences object
  isLoading,         // Loading state
  setLanguage,       // (language: LanguagePreference) => Promise<void>
  setFontSize,       // (size: number) => Promise<void>
  setTheme,          // (theme: ThemePreference) => Promise<void>
  setToggle,         // <K extends PreferencesToggles>
  updatePreferences, // (update: PreferencesUpdate) => Promise<Preferences>
  resetPreferences,  // () => Promise<void>
} = usePreferences();
```

#### `usePreferencesState()`
Read-only access to the complete preferences object.

```tsx
const preferences = usePreferencesState();
// Optimized for components that only read preferences
```

#### `usePreference(key)`
Access a single preference value. Re-renders only when that preference changes.

```tsx
const fontSize = usePreference('fontSize');
const theme = usePreference('theme');
```

#### `useToggle(key)`
Access a single toggle value. Re-renders only when that toggle changes.

```tsx
const showTranslit = useToggle('showTransliteration');
const enableHaptics = useToggle('enableHaptics');
```

### Utilities

All utilities from `src/utils/preferences.ts` are also available directly:

```typescript
import {
  loadPreferences,
  savePreferences,
  updateSinglePreference,
  updateToggle,
  updatePreferences,
  resetToDefaults,
  clearPreferences,
} from '@/src/utils/preferences';

// Example: Manual operations
const prefs = await loadPreferences();
await updateSinglePreference('fontSize', 18);
await resetToDefaults();
```

## Usage Examples

### Example 1: Theme Switcher
```tsx
import { usePreferences } from '@/src/context/PreferencesContext';

export function ThemeSwitcher() {
  const { preferences, setTheme } = usePreferences();

  return (
    <View>
      <Button 
        title="Light"
        onPress={() => setTheme('light')}
        type={preferences.theme === 'light' ? 'solid' : 'outline'}
      />
      <Button 
        title="Dark"
        onPress={() => setTheme('dark')}
        type={preferences.theme === 'dark' ? 'solid' : 'outline'}
      />
      <Button 
        title="Auto"
        onPress={() => setTheme('auto')}
        type={preferences.theme === 'auto' ? 'solid' : 'outline'}
      />
    </View>
  );
}
```

### Example 2: Font Size Slider
```tsx
import { usePreferences } from '@/src/context/PreferencesContext';
import { Slider } from '@react-native-community/slider';

export function FontSizeControl() {
  const { preferences, setFontSize } = usePreferences();

  return (
    <View>
      <Text>Font Size: {preferences.fontSize}px</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimum={12}
        maximum={28}
        step={2}
        value={preferences.fontSize}
        onValueChange={setFontSize}
      />
    </View>
  );
}
```

### Example 3: Feature Toggles
```tsx
import { useToggle, usePreferences } from '@/src/context/PreferencesContext';
import { Switch } from 'react-native';

export function FeatureToggles() {
  const { setToggle } = usePreferences();
  const showTranslit = useToggle('showTransliteration');
  const enableHaptics = useToggle('enableHaptics');

  return (
    <View>
      <View style={styles.toggle}>
        <Text>Show Transliteration</Text>
        <Switch
          value={showTranslit}
          onValueChange={(val) => setToggle('showTransliteration', val)}
        />
      </View>

      <View style={styles.toggle}>
        <Text>Enable Haptics</Text>
        <Switch
          value={enableHaptics}
          onValueChange={(val) => setToggle('enableHaptics', val)}
        />
      </View>
    </View>
  );
}
```

### Example 4: Batch Update
```tsx
import { usePreferences } from '@/src/context/PreferencesContext';

export function AccessibilitySettings() {
  const { updatePreferences } = usePreferences();

  const applyAccessibleMode = async () => {
    await updatePreferences({
      fontSize: 22,
      theme: 'dark',
      toggles: {
        enableHaptics: true,
        showTransliteration: true,
      },
    });
  };

  return (
    <Button 
      title="Apply Accessible Settings"
      onPress={applyAccessibleMode}
    />
  );
}
```

## AsyncStorage Persistence

Preferences are automatically persisted with these keys:

- `gita_preferences_v1`: Complete preferences object (primary)
- `gita_preferences_language`: Backup key for language
- `gita_preferences_font_size`: Backup key for font size
- `gita_preferences_theme`: Backup key for theme
- `gita_preferences_toggles`: Backup key for toggles

### Backup Keys
The system maintains backup keys for backwards compatibility and fallback loading. If the primary key is corrupted, the system automatically attempts to load from individual keys.

### Loading Strategy
1. Try to load complete preferences from `gita_preferences_v1`
2. If not found, load individual settings from backup keys
3. Merge with defaults to ensure all required fields
4. Return defaults if all loading fails

## Default Preferences

```typescript
{
  language: 'english',
  fontSize: 16,
  theme: 'auto',
  toggles: {
    showTransliteration: false,
    showDevanagari: true,
    enableHaptics: true,
    autoPlayAudio: false,
    showCommentary: true,
    expandAllVerses: false,
  }
}
```

## Error Handling

The system includes comprehensive error handling:

- **Load Failures**: Falls back to default preferences
- **Font Size Validation**: Automatically clamps to 12-28px range
- **Storage Errors**: Logged to console, operations fail gracefully
- **Missing Required Fields**: Merged with defaults, no crashes

Example error handling:
```tsx
const { setFontSize } = usePreferences();

try {
  await setFontSize(18);
} catch (error) {
  console.error('Failed to update font size:', error);
  // UI remains in previous state
}
```

## Testing

### Reset Preferences
```typescript
import { resetToDefaults } from '@/src/utils/preferences';

// In tests or setup
beforeEach(async () => {
  await resetToDefaults();
});
```

### Clear All Data
```typescript
import { clearPreferences } from '@/src/utils/preferences';

// Completely remove all preferences from storage
await clearPreferences();
```

### Mock in Tests
```typescript
jest.mock('@/src/context/PreferencesContext', () => ({
  usePreferences: () => ({
    preferences: {
      fontSize: 16,
      language: 'english',
      theme: 'light',
      toggles: { /* ... */ }
    },
    setFontSize: jest.fn(),
    // ... other methods
  }),
}));
```

## Type Safety

The system is fully typed using TypeScript:

```typescript
// Type-safe preference access
const fontSize: number = preferences.fontSize;
const language: 'english' | 'hindi' = preferences.language;
const toggleValue: boolean = preferences.toggles.showTransliteration;

// Type-safe updates
await setFontSize(16);      // ✅ Valid
await setFontSize('large'); // ❌ TypeScript error

await setTheme('dark');     // ✅ Valid
await setTheme('custom');   // ❌ TypeScript error
```

## Performance Considerations

- **Lazy Loading**: Preferences load asynchronously on app start
- **Optimized Re-renders**: Use specialized hooks (`usePreference`, `useToggle`) to minimize re-renders
- **Batch Updates**: Use `updatePreferences()` for multiple changes
- **Async Operations**: All writes are non-blocking

## Migration & Versioning

The current version is `v1` (stored in the `gita_preferences_v1` key). To support future migrations:

1. Change the version in storage keys
2. Add a migration function to transform old format to new
3. Run migration on first load
4. Keep backwards compatibility with old keys

Example future migration:
```typescript
const STORAGE_KEYS = {
  PREFERENCES_V1: 'gita_preferences_v1',
  PREFERENCES_V2: 'gita_preferences_v2', // Future version
};
```

## Troubleshooting

### Preferences Not Persisting
1. Check that `PreferencesProvider` wraps your app
2. Verify AsyncStorage is properly installed
3. Check console for error messages
4. Clear AsyncStorage and restart: `await clearPreferences()`

### Theme Not Applying
1. Ensure you're using the loaded preference, not hardcoded values
2. For 'auto' theme, implement system theme detection separately
3. Re-render components when preferences change

### Font Size Not Updating
1. Check that `setFontSize` is being called with a valid number
2. Size is automatically clamped to 12-28, so extreme values are ignored
3. Verify the component is using `preferences.fontSize` in styles

## Integration with Existing Context

If you have an existing `AppContext`, you can:

1. **Keep Separate**: Use both `PreferencesProvider` and `AppProvider` independently
2. **Combine**: Extract preferences utilities and integrate into existing context
3. **Migrate Gradually**: Move existing settings to PreferencesContext over time

Example integration:
```tsx
// In your root layout
<PreferencesProvider>
  <AppProvider>
    {/* Your app */}
  </AppProvider>
</PreferencesProvider>
```

## Future Enhancements

Potential features to add:
- Profile management (save multiple preference sets)
- Cloud sync support
- Preference export/import
- Accessibility profiles (e.g., high contrast mode)
- Font family selection
- Line spacing control
- Reading speed preferences
- Reading history tracking per preferences
