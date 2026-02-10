/**
 * Navigation Types for Bhagavad Gita App
 * Type-safe navigation with route parameters
 */

import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

/**
 * Root Stack Navigator Param List
 * Defines all screens in the main stack and their required parameters
 */
export type RootStackParamList = {
  Home: undefined;
  Tabs: undefined;
  Chapters: undefined;
  Reading: {
    chapterId: number;
    verseId: number;
  };
  Settings: undefined;
  Modal: {
    title?: string;
    content?: string;
  };
};

/**
 * Bottom Tabs Navigator Param List
 * Defines all tab screens and their parameters
 */
export type TabsParamList = {
  Index: undefined;
  Explore: undefined;
};

/**
 * Type-safe screen props for Root Stack screens
 */
export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
export type TabsScreenProps = StackScreenProps<RootStackParamList, 'Tabs'>;
export type ChaptersScreenProps = StackScreenProps<RootStackParamList, 'Chapters'>;
export type ReadingScreenProps = StackScreenProps<RootStackParamList, 'Reading'>;
export type SettingsScreenProps = StackScreenProps<RootStackParamList, 'Settings'>;
export type ModalScreenProps = StackScreenProps<RootStackParamList, 'Modal'>;

/**
 * Type-safe screen props for Tab screens
 * Combines tab navigation with stack navigation for nested navigators
 */
export type IndexTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Index'>,
  StackScreenProps<RootStackParamList>
>;

export type ExploreTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Explore'>,
  StackScreenProps<RootStackParamList>
>;

/**
 * Navigation prop types for use with hooks
 * Import and use like: const navigation = useNavigation<RootStackNavigationProp>();
 */
import type { NavigationProp } from '@react-navigation/native';

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;
export type TabsNavigationProp = NavigationProp<TabsParamList>;

/**
 * Type-safe navigation helpers
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
