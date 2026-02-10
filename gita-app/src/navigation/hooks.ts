/**
 * Navigation Utilities
 * Helper functions and hooks for type-safe navigation
 */

import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp, TabsNavigationProp } from '@/src/types/navigation';

/**
 * Type-safe hook for root stack navigation
 * Use this in any screen that needs to navigate within the root stack
 * 
 * @example
 * const navigation = useRootNavigation();
 * navigation.navigate('Reading', { chapterId: 1, verseId: 1 });
 */
export function useRootNavigation() {
  return useNavigation<RootStackNavigationProp>();
}

/**
 * Type-safe hook for tab navigation
 * Use this in tab screens that need to navigate between tabs
 * 
 * @example
 * const navigation = useTabNavigation();
 * navigation.navigate('Explore');
 */
export function useTabNavigation() {
  return useNavigation<TabsNavigationProp>();
}
