/**
 * Example: Using the Preferences System in Components
 * 
 * This file demonstrates how to use the preferences model throughout the app.
 */

// ============================================================================
// SETUP: Wrap your app root with PreferencesProvider
// ============================================================================
// In your root layout or app component:
//
// import { PreferencesProvider } from '@/src/context/PreferencesContext';
//
// export default function RootLayout() {
//   return (
//     <PreferencesProvider>
//       {/* Your other providers and app structure */}
//     </PreferencesProvider>
//   );
// }

// ============================================================================
// EXAMPLE 1: Read and update preferences
// ============================================================================
//
// import { usePreferences } from '@/src/context/PreferencesContext';
//
// export default function SettingsScreen() {
//   const { preferences, setFontSize, setTheme, setLanguage } = usePreferences();
//
//   const handleFontSizeChange = async (newSize: number) => {
//     // Font size is automatically validated and clamped
//     await setFontSize(newSize);
//   };
//
//   return (
//     <View>
//       <Text>Current Theme: {preferences.theme}</Text>
//       <Text>Current Language: {preferences.language}</Text>
//       <Text>Font Size: {preferences.fontSize}px</Text>
//
//       <Button title="Dark Mode" onPress={() => setTheme('dark')} />
//       <Button title="Light Mode" onPress={() => setTheme('light')} />
//       <Button title="Auto Mode" onPress={() => setTheme('auto')} />
//
//       <Button title="English" onPress={() => setLanguage('english')} />
//       <Button title="Hindi" onPress={() => setLanguage('hindi')} />
//
//       <Slider 
//         value={preferences.fontSize}
//         onValueChange={handleFontSizeChange}
//       />
//     </View>
//   );
// }

// ============================================================================
// EXAMPLE 2: Update toggles
// ============================================================================
//
// import { usePreferences } from '@/src/context/PreferencesContext';
//
// export default function FeatureToggleScreen() {
//   const { preferences, setToggle } = usePreferences();
//
//   const toggleTransliteration = async () => {
//     await setToggle('showTransliteration', !preferences.toggles.showTransliteration);
//   };
//
//   const toggleHaptics = async () => {
//     await setToggle('enableHaptics', !preferences.toggles.enableHaptics);
//   };
//
//   return (
//     <View>
//       <Switch
//         value={preferences.toggles.showTransliteration}
//         onValueChange={toggleTransliteration}
//       />
//       <Switch
//         value={preferences.toggles.enableHaptics}
//         onValueChange={toggleHaptics}
//       />
//     </View>
//   );
// }

// ============================================================================
// EXAMPLE 3: Use specialized hooks for specific preferences
// ============================================================================
//
// import {
//   usePreference,
//   useToggle,
//   usePreferencesState,
// } from '@/src/context/PreferencesContext';
//
// // Read a single preference (optimized for re-renders)
// const fontSize = usePreference('fontSize');
// const theme = usePreference('theme');
// const language = usePreference('language');
//
// // Read a single toggle
// const showTranslit = useToggle('showTransliteration');
// const enableHaptics = useToggle('enableHaptics');
//
// // Read all preferences at once
// const prefs = usePreferencesState();
// console.log(prefs.fontSize);

// ============================================================================
// EXAMPLE 4: Apply preferences to UI styling
// ============================================================================
//
// import { usePreferencesState } from '@/src/context/PreferencesContext';
// import { useColorScheme } from 'react-native';
//
// export default function StyledComponent() {
//   const prefs = usePreferencesState();
//   const systemTheme = useColorScheme(); // 'light' | 'dark' | null
//
//   // Determine actual theme based on preference and system settings
//   const isDark =
//     prefs.theme === 'auto'
//       ? systemTheme === 'dark'
//       : prefs.theme === 'dark';
//
//   const textColor = isDark ? '#ffffff' : '#000000';
//   const backgroundColor = isDark ? '#1a1a1a' : '#ffffff';
//
//   return (
//     <View style={{ backgroundColor, fontSize: prefs.fontSize }}>
//       <Text style={{ color: textColor }}>
//         {prefs.language === 'english' 
//           ? 'Hello' 
//           : 'नमस्ते'}
//       </Text>
//     </View>
//   );
// }

// ============================================================================
// EXAMPLE 5: Batch update multiple preferences
// ============================================================================
//
// import { usePreferences } from '@/src/context/PreferencesContext';
//
// export default function AppSettings() {
//   const { updatePreferences, resetPreferences } = usePreferences();
//
//   const handleResetApp = async () => {
//     // Reset everything to defaults
//     await resetPreferences();
//   };
//
//   const handleApplyPreset = async (preset: 'dark' | 'light' | 'accessible') => {
//     if (preset === 'accessible') {
//       // Large text, high contrast
//       await updatePreferences({
//         fontSize: 22,
//         theme: 'dark',
//         toggles: {
//           enableHaptics: true,
//         },
//       });
//     }
//   };
//
//   return (
//     <View>
//       <Button title="Reset to Defaults" onPress={handleResetApp} />
//       <Button title="Apply Accessible Preset" 
//         onPress={() => handleApplyPreset('accessible')} 
//       />
//     </View>
//   );
// }

// ============================================================================
// EXAMPLE 6: Using preferences in custom hooks
// ============================================================================
//
// import { useCallback, useMemo } from 'react';
// import { usePreferencesState, useToggle } from '@/src/context/PreferencesContext';
//
// export function useFormattedText(text: string) {
//   const prefs = usePreferencesState();
//   const showTranslit = useToggle('showTransliteration');
//
//   return useMemo(() => {
//     return {
//       text,
//       fontSize: prefs.fontSize,
//       language: prefs.language,
//       includeTransliteration: showTranslit && prefs.language === 'hindi',
//     };
//   }, [text, prefs.fontSize, prefs.language, showTranslit]);
// }

// ============================================================================
// AVAILABLE PREFERENCES
// ============================================================================
//
// Preferences Object Structure:
// {
//   language: 'english' | 'hindi'              // UI language
//   fontSize: number (12-28)                   // Text rendering size
//   theme: 'light' | 'dark' | 'auto'           // Color scheme
//   toggles: {
//     showTransliteration: boolean             // Show romanized Sanskrit
//     showDevanagari: boolean                  // Show Devanagari script
//     enableHaptics: boolean                   // Vibration feedback
//     autoPlayAudio: boolean                   // Auto-play verse audio
//     showCommentary: boolean                  // Show verse commentary
//     expandAllVerses: boolean                 // Expand verses in chapter view
//   }
// }

// ============================================================================
// ASYNCSTORAGE PERSISTENCE
// ============================================================================
//
// All preferences are automatically saved to AsyncStorage:
// - Key: 'gita_preferences_v1' (complete object)
// - Individual keys: 'gita_preferences_language', 'gita_preferences_font_size', etc.
// - Automatic loading on app startup
// - Error handling with fallback to defaults
// - Compatible with version migrations

// ============================================================================
// TESTING
// ============================================================================
//
// Clear preferences in tests:
// import { clearPreferences } from '@/src/utils/preferences';
// await clearPreferences();
//
// Load fresh defaults:
// import { resetToDefaults } from '@/src/utils/preferences';
// const defaults = await resetToDefaults();

export {};
