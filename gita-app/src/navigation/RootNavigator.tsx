/**
 * Root Stack Navigator
 * Main navigation structure for the Bhagavad Gita app
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { RootStackParamList } from '@/src/types/navigation';

// Screen imports (placeholders)
import HomeScreen from '@/src/screens/HomeScreen';
import ChaptersScreen from '@/src/screens/ChaptersScreen';
import ReadingScreen from '@/src/screens/ReadingScreen';
import SettingsScreen from '@/src/screens/SettingsScreen';
import ModalScreen from '@/src/screens/ModalScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
      />
      
      <Stack.Screen 
        name="Tabs" 
        component={TabNavigator}
      />
      
      <Stack.Screen 
        name="Chapters" 
        component={ChaptersScreen}
      />
      
      <Stack.Screen 
        name="Reading" 
        component={ReadingScreen}
      />
      
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
      
      <Stack.Screen 
        name="Modal" 
        component={ModalScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
