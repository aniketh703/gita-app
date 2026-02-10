/**
 * App Root with Navigation
 * Example integration of React Navigation in your app
 * 
 * To use: Import this in your main App.tsx or similar entry point
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './navigation';

export default function AppWithNavigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
