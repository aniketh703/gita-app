import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  NotoSerifDevanagari_400Regular,
  NotoSerifDevanagari_600SemiBold,
  NotoSerifDevanagari_700Bold,
} from '@expo-google-fonts/noto-serif-devanagari';
import {
  Merriweather_400Regular,
  Merriweather_700Bold,
  Merriweather_400Regular_Italic,
} from '@expo-google-fonts/merriweather';
import 'react-native-reanimated';

import { AppProvider } from '@/src/context/AppContext';
import { useApp } from '@/src/context/AppContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function RootLayoutContent() {
  const { theme } = useApp();
  const isDark = theme.isDark;

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reading" options={{ headerShown: false }} />
        <Stack.Screen name="verse" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'NotoSerifDevanagari-Regular': NotoSerifDevanagari_400Regular,
    'NotoSerifDevanagari-SemiBold': NotoSerifDevanagari_600SemiBold,
    'NotoSerifDevanagari-Bold': NotoSerifDevanagari_700Bold,
    'Merriweather-Regular': Merriweather_400Regular,
    'Merriweather-Bold': Merriweather_700Bold,
    'Merriweather-Italic': Merriweather_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render the app until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  );
}

