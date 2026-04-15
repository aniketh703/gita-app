/**
 * Onboarding Route
 * Entry point for the onboarding flow
 */

import { useAppTheme } from "@/hooks/use-app-theme";
import { ROUTES } from "@/src/navigation/routes";
import { OnboardingNavigator } from "@/src/screens/onboarding";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function OnboardingRoute() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const handleComplete = () => {
    // Navigate to welcome screen (first impression)
    router.replace(ROUTES.WELCOME);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <OnboardingNavigator onComplete={handleComplete} />
    </View>
  );
}
