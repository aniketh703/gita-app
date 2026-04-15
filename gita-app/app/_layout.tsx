import { NotificationProvider } from "@/src/context/NotificationContext";
import {
  Merriweather_400Regular,
  Merriweather_400Regular_Italic,
  Merriweather_700Bold,
} from "@expo-google-fonts/merriweather";
import {
  NotoSerifDevanagari_400Regular,
  NotoSerifDevanagari_600SemiBold,
  NotoSerifDevanagari_700Bold,
} from "@expo-google-fonts/noto-serif-devanagari";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme as useNativewindColorScheme } from "nativewind";
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import "../global.css";

import { AppProvider } from "@/src/context/AppContext";
import {
  AppThemeProvider,
  useAppThemeContext,
} from "@/src/context/AppThemeContext";
import { PreferencesProvider } from "@/src/context/PreferencesContext";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
});

LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
  "SafeAreaView has been deprecated and will be removed in a future release",
  "SafeAreaView has been deprecated",
]);

export const unstable_settings = {
  initialRouteName: "index",
};

function RootLayoutContent() {
  const { setColorScheme } = useNativewindColorScheme();
  const { nativewindColorScheme, statusBarStyle } = useAppThemeContext();

  useEffect(() => {
    setColorScheme(nativewindColorScheme);
  }, [nativewindColorScheme, setColorScheme]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="splash"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="welcome"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="badges"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="paywall"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="privacy-policy"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="terms-of-service"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <PortalHost />
      <StatusBar style={statusBarStyle} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "NotoSerifDevanagari-Regular": NotoSerifDevanagari_400Regular,
    "NotoSerifDevanagari-SemiBold": NotoSerifDevanagari_600SemiBold,
    "NotoSerifDevanagari-Bold": NotoSerifDevanagari_700Bold,
    "Merriweather-Regular": Merriweather_400Regular,
    "Merriweather-Bold": Merriweather_700Bold,
    "Merriweather-Italic": Merriweather_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [fontsLoaded, fontError]);

  // ✅ Continue rendering even if fonts not loaded (non-blocking)
  // This prevents blank screen during font loading
  // Components will use fallback fonts until custom fonts are ready
  return (
    <PreferencesProvider>
      <AppProvider>
        <AppThemeProvider>
          <NotificationProvider>
            <RootLayoutContent />
          </NotificationProvider>
        </AppThemeProvider>
      </AppProvider>
    </PreferencesProvider>
  );
}
