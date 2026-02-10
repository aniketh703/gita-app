/**
 * Navigation Documentation
 * 
 * ## Structure
 * 
 * The app uses React Navigation with the following structure:
 * 
 * ```
 * RootNavigator (Stack)
 * ├── Home
 * ├── Tabs (Tab Navigator)
 * │   ├── Index
 * │   └── Explore
 * ├── Chapters
 * ├── Reading (requires: chapterId, verseId)
 * ├── Settings
 * └── Modal (optional: title, content)
 * ```
 * 
 * ## Type-Safe Navigation
 * 
 * All navigation is fully typed. TypeScript will check:
 * - Screen names exist
 * - Required params are provided
 * - Param types are correct
 * 
 * ## Usage Examples
 * 
 * ### Navigate with params:
 * ```typescript
 * import { useRootNavigation } from '@/src/navigation/hooks';
 * 
 * const navigation = useRootNavigation();
 * navigation.navigate('Reading', { 
 *   chapterId: 1, 
 *   verseId: 1 
 * });
 * ```
 * 
 * ### Access params in screen:
 * ```typescript
 * import type { ReadingScreenProps } from '@/src/types/navigation';
 * 
 * export default function ReadingScreen({ route }: ReadingScreenProps) {
 *   const { chapterId, verseId } = route.params;
 *   // TypeScript knows these exist and their types
 * }
 * ```
 * 
 * ### Navigate without params:
 * ```typescript
 * navigation.navigate('Home');
 * navigation.navigate('Settings');
 * ```
 * 
 * ### Navigate with optional params:
 * ```typescript
 * navigation.navigate('Modal', { 
 *   title: 'About', 
 *   content: 'App information' 
 * });
 * // Or without params:
 * navigation.navigate('Modal', {}); 
 * ```
 * 
 * ## Adding New Screens
 * 
 * 1. Add to `RootStackParamList` in `src/types/navigation.ts`
 * 2. Create screen props type
 * 3. Create screen component in `src/screens/`
 * 4. Add to navigator in `src/navigation/RootNavigator.tsx`
 * 
 * ## Screen Placeholders
 * 
 * All screens are currently minimal placeholders without styling.
 * They demonstrate:
 * - Proper TypeScript typing
 * - Parameter access
 * - Navigation prop usage
 * 
 * Add your UI components and styling as needed.
 */
