/**
 * Onboarding Navigator
 * Orchestrates the 7-step onboarding flow with psychological commitment
 * Steps: Value Prop → Outcome → Goal → Signature → Notification → Preferences → Appearance
 */

import { useAppTheme } from "@/hooks/use-app-theme";
import { usePreferences } from "@/src/context/PreferencesContext";
import { useAppStore } from "@/src/store/appStore";
import type { OnboardingGoal, OnboardingState } from "@/src/types/onboarding";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import OnboardingNotification from "./OnboardingNotification";
import OnboardingStep1 from "./OnboardingStep1";
import OnboardingStep2 from "./OnboardingStep2";
import OnboardingStep3 from "./OnboardingStep3";
import OnboardingStep3Signature from "./OnboardingStep3Signature";
import OnboardingStep4 from "./OnboardingStep4";
import OnboardingStep5 from "./OnboardingStep5";

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

export default function OnboardingNavigator({
  onComplete,
}: OnboardingNavigatorProps) {
  const { colors } = useAppTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<OnboardingGoal | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const prefs = usePreferences();
  const {
    setOnboardingGoal,
    setOnboardingPreferences,
    setOnboardingAppearance,
    completeOnboarding,
    updateOnboardingStep,
    setNotificationSettings,
  } = useAppStore();

  const handleStep1Next = () => {
    updateOnboardingStep(2);
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    updateOnboardingStep(3);
    setCurrentStep(3);
  };

  const handleStep3Next = (goal: OnboardingGoal) => {
    setSelectedGoal(goal);
    setOnboardingGoal(goal);
    updateOnboardingStep(4);
    setCurrentStep(4);
  };

  const handleSignatureNext = () => {
    updateOnboardingStep(5);
    setCurrentStep(5);
  };

  const handleNotificationComplete = (time: string, enabled: boolean) => {
    setNotificationSettings({ enabled, time, permissionAsked: true });
    updateOnboardingStep(6);
    setCurrentStep(6);
  };

  const handleStep6Next = (preferences: OnboardingState["preferences"]) => {
    setOnboardingPreferences(preferences);
    updateOnboardingStep(7);
    setCurrentStep(7);
  };

  const handleStep7Complete = async (
    appearance: OnboardingState["appearance"],
  ) => {
    if (isCompleting) {
      return;
    }

    setIsCompleting(true);
    setOnboardingAppearance(appearance);

    // Sync appearance settings to PreferencesContext
    try {
      // Map fontSize from string to number
      const fontSizeMap = { small: 14, medium: 16, large: 18 };
      // Sync theme setting (convert "system" to "auto" if needed)
      const theme = appearance.theme === "system" ? "auto" : appearance.theme;

      await Promise.all([
        prefs.setFontSize(fontSizeMap[appearance.fontSize]),
        prefs.setTheme(theme as any),
      ]);
    } catch (error) {
      console.warn(
        "Failed to sync onboarding preferences to app context:",
        error,
      );
    }

    // Mark onboarding as complete
    completeOnboarding();

    // Navigate to main app
    onComplete();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      updateOnboardingStep(newStep);
      setCurrentStep(newStep);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {currentStep === 1 && <OnboardingStep1 onNext={handleStep1Next} />}
      {currentStep === 2 && (
        <OnboardingStep2 onNext={handleStep2Next} onBack={handleBack} />
      )}
      {currentStep === 3 && (
        <OnboardingStep3 onNext={handleStep3Next} onBack={handleBack} />
      )}
      {currentStep === 4 && selectedGoal && (
        <OnboardingStep3Signature
          selectedGoal={selectedGoal}
          onNext={handleSignatureNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 5 && (
        <OnboardingNotification
          onComplete={handleNotificationComplete}
          onBack={handleBack}
        />
      )}
      {currentStep === 6 && (
        <OnboardingStep4 onNext={handleStep6Next} onBack={handleBack} />
      )}
      {currentStep === 7 && (
        <OnboardingStep5
          onComplete={handleStep7Complete}
          onBack={handleBack}
          isCompleting={isCompleting}
        />
      )}

      {isCompleting && (
        <View
          style={[styles.completingOverlay, { backgroundColor: colors.bg }]}
          pointerEvents="none"
        >
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  completingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
