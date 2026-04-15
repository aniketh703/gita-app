/**
 * Splash Screen
 * Shows while app initializes and determines routing
 * - Load sloka dataset
 * - Load saved preferences
 * - Check onboarding status
 * - Restore reading state
 */

import gitaData from "@/assets/data.json";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ROUTES } from "@/src/navigation/routes";
import { useAppStore } from "@/src/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
  Pressable,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export default function SplashScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const systemColorScheme = useColorScheme();

  // Keep JS splash background in lockstep with app.json native splash colors.
  const splashBackgroundColor =
    systemColorScheme === "dark" ? "#0a0a0a" : "#ffffff";

  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [initError, setInitError] = useState<string | null>(null);

  const { hasCompletedOnboarding, isFirstLaunch, setFirstLaunchComplete } =
    useAppStore();

  // Breathing animation for Om symbol
  const breathingScale = useSharedValue(1);
  const breathingOpacity = useSharedValue(0.8);

  useEffect(() => {
    breathingScale.value = withRepeat(
      withSequence(
        withTiming(1.2, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1.0, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
    );

    breathingOpacity.value = withRepeat(
      withSequence(
        withTiming(1.0, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.6, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
    );
  }, [breathingOpacity, breathingScale]);

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathingScale.value }],
    opacity: breathingOpacity.value,
  }));

  const initialize = React.useCallback(async () => {
    try {
      setInitError(null);

      // Step 1: Load and validate dataset
      setLoadingMessage("Loading sacred texts...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!gitaData || gitaData.length === 0) {
        throw new Error("Failed to load Gita data");
      }

      // Step 2: Restore preferences (handled by zustand persist)
      setLoadingMessage("Restoring preferences...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Step 3: Check onboarding status
      setLoadingMessage("Preparing your journey...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      const onboardingComplete = hasCompletedOnboarding();

      // Small delay for smooth transition
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (!onboardingComplete) {
        router.replace(ROUTES.ONBOARDING);
      } else if (isFirstLaunch && onboardingComplete) {
        setFirstLaunchComplete();
        router.replace(ROUTES.WELCOME);
      } else {
        router.replace(ROUTES.TABS_HOME);
      }
    } catch (error) {
      console.error("Initialization error:", error);
      setLoadingMessage("Initialization failed.");
      setInitError("Something went wrong while preparing the app.");
    }
  }, [hasCompletedOnboarding, isFirstLaunch, router, setFirstLaunchComplete]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <View
      style={[styles.container, { backgroundColor: splashBackgroundColor }]}
    >
      <StatusBar style={systemColorScheme === "dark" ? "light" : "dark"} />
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, breathingStyle]}>
          <MaterialIcons name="auto-awesome" size={100} color={colors.accent} />
        </Animated.View>

        <Text style={[styles.appName, { color: colors.text }]}>
          Bhagavad Gita
        </Text>

        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Timeless Wisdom
        </Text>

        <View style={styles.loaderContainer}>
          {!initError ? (
            <>
              <ActivityIndicator size="small" color={colors.accent} />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                {loadingMessage}
              </Text>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <MaterialIcons
                name="error-outline"
                size={24}
                color={colors.accent}
              />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                {initError}
              </Text>
              <View style={styles.actionRow}>
                <Pressable
                  style={[styles.actionButton, { backgroundColor: colors.accent }]}
                  onPress={initialize}
                  accessibilityRole="button"
                  accessibilityLabel="Retry app initialization"
                  accessibilityHint="Attempts setup again"
                >
                  <Text style={[styles.actionButtonText, { color: "#1a1a1a" }]}>Retry</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => router.replace(ROUTES.TABS_HOME)}
                  accessibilityRole="button"
                  accessibilityLabel="Continue without initialization"
                  accessibilityHint="Opens the app tabs even if setup failed"
                >
                  <Text style={[styles.actionButtonText, { color: colors.text }]}>Continue</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  appName: {
    fontSize: fontSize.huge + spacing.xs,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.xs,
    fontFamily: "Merriweather-Bold",
  },
  tagline: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    textAlign: "center",
    marginBottom: spacing.xxl + spacing.sm,
    opacity: 0.8,
  },
  loaderContainer: {
    alignItems: "center",
    gap: spacing.sm,
  },
  errorContainer: {
    alignItems: "center",
    gap: spacing.sm,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  loadingText: {
    fontSize: fontSize.sm,
    opacity: 0.6,
  },
});
