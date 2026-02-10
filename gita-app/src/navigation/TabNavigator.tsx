/**
 * Bottom Tabs Navigator
 * Tab navigation for main app sections
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { TabsParamList } from '@/src/types/navigation';

// Screen imports (placeholders)
import IndexScreen from '@/src/screens/tabs/IndexScreen';
import ExploreScreen from '@/src/screens/tabs/ExploreScreen';

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Index" 
        component={IndexScreen}
      />
      
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
      />
    </Tab.Navigator>
  );
}
