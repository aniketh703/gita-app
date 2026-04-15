/**
 * Navigation Types for Bhagavad Gita App
 * Type-safe navigation with route parameters
 */

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
    CompositeScreenProps,
    NavigationProp,
} from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";

/**
 * Root Stack Navigator Param List
 * Defines all screens in the main stack and their required parameters
 */
export type RootStackParamList = {
  Home: undefined;
  Tabs: undefined;
  Chapters: undefined;
  SlokaList: {
    chapterId: number;
    chapterName: string;
    verseCount: number;
  };
  Reading: {
    chapterId: number;
    verseId: number;
    chapterName: string;
  };
  Settings: undefined;
  Modal: {
    title?: string;
    content?: string;
  };
  Paywall: undefined;
  SanskritTooltip: {
    term: string;
    meaning: string;
  };
  FocusMode: {
    chapterId: number;
    verseId: number;
    chapterName: string;
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
export type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;
export type TabsScreenProps = StackScreenProps<RootStackParamList, "Tabs">;
export type ChaptersScreenProps = StackScreenProps<
  RootStackParamList,
  "Chapters"
>;
export type SlokaListScreenProps = StackScreenProps<
  RootStackParamList,
  "SlokaList"
>;
export type ReadingScreenProps = StackScreenProps<
  RootStackParamList,
  "Reading"
>;
export type SettingsScreenProps = StackScreenProps<
  RootStackParamList,
  "Settings"
>;
export type ModalScreenProps = StackScreenProps<RootStackParamList, "Modal">;

export type ExploreTabScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, "Explore">,
  StackScreenProps<RootStackParamList>
>;

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;
export type TabsNavigationProp = NavigationProp<TabsParamList>;

/**
 * Type-safe navigation helpers
 */
declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
