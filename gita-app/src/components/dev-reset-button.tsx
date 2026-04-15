/**
 * Dev-Mode Reset Button Component
 * Allows developers/testers to reset onboarding state and restart the flow
 * Only visible when __DEV__ is true
 */

import { useAppStore } from "@/src/store/appStore";
import { ROUTES } from "@/src/navigation/routes";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function DevResetOnboardingButton() {
  const [isLoading, setIsLoading] = useState(false);
  const resetOnboarding = useAppStore((state) => state.resetOnboarding);

  const handleReset = async () => {
    try {
      setIsLoading(true);
      // Reset all onboarding state
      resetOnboarding();
      // Navigate to onboarding flow
      router.replace(ROUTES.ONBOARDING);
    } catch (error) {
      console.error("Onboarding reset failed:", error);
      setIsLoading(false);
    }
  };

  // Only show in development mode
  if (!__DEV__) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleReset}
        disabled={isLoading}
      >
        <Text style={styles.text}>
          {isLoading ? "Resetting..." : "🔄 Reset Onboarding (Dev)"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff3f0",
    borderTopWidth: 1,
    borderTopColor: "#ffede5",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ff6b35",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
});
