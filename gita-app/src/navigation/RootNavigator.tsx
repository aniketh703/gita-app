/**
 * Root Stack Navigator with Reanimated Transitions
 * Implements Forward (Expand), Backward (Graceful), and Lateral (Crossfade) flows
 * All transitions bound to Reanimated 3 for 60fps fluid animations
 */

import type { RootStackParamList } from "@/src/types/navigation";
import {
    BackwardGracefulTransition,
    ForwardExpandTransition,
    ModalSlideUpTransition,
    SwipeBackTransition,
} from "@/src/utils/animations";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Screen imports
import ChaptersScreen from "@/src/screens/ChaptersScreen";
import HomeScreen from "@/src/screens/HomeScreen";
import ModalScreen from "@/src/screens/ModalScreen";
import ReadingScreen from "@/src/screens/ReadingScreen";
import SettingsScreen from "@/src/screens/SettingsScreen";
import SlokaListScreen from "@/src/screens/SlokaListScreen";
import TabNavigator from "./TabNavigator";

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          ...SwipeBackTransition,
        }}
      >
        {/* Home Screen - Entry Point */}
        <Stack.Screen name="Home" component={HomeScreen} options={{}} />

        {/* Tabs Navigator */}
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{
            ...ForwardExpandTransition,
          }}
        />

        {/* Chapters List - Forward Flow (Deepening) */}
        <Stack.Screen
          name="Chapters"
          component={ChaptersScreen}
          options={{
            ...ForwardExpandTransition,
            gestureEnabled: true,
          }}
        />

        {/* Sloka List - Forward Flow with Shared Element Expansion */}
        <Stack.Screen
          name="SlokaList"
          component={SlokaListScreen}
          options={{
            ...ForwardExpandTransition,
            gestureEnabled: true,
          }}
        />

        {/* Reading Screen - Immersive, Forward Flow */}
        <Stack.Screen
          name="Reading"
          component={ReadingScreen}
          options={{
            ...ForwardExpandTransition,
            gestureEnabled: true,
          }}
        />

        {/* Settings - Backward Flow with Live Preview */}
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            ...BackwardGracefulTransition,
            gestureEnabled: true,
          }}
        />

        {/* Modal */}
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={{
            ...ModalSlideUpTransition,
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
}
