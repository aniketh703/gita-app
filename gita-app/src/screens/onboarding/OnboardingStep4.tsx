/**
 * Onboarding Screen 4 - Reading Preferences
 * User selects which text formats to display
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import type { OnboardingState } from "@/src/types/onboarding";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface PreferenceOption {
  id: keyof OnboardingState["preferences"];
  label: string;
  description: string;
  icon: string;
}

const preferenceOptions: PreferenceOption[] = [
  {
    id: "showSanskrit",
    label: "Sanskrit (Devanagari)",
    description: "Original verses in Sanskrit script",
    icon: "translate",
  },
  {
    id: "showTransliteration",
    label: "Transliteration",
    description: "Sanskrit in Roman script",
    icon: "spellcheck",
  },
  {
    id: "showEnglish",
    label: "English Translation",
    description: "Verse meaning in English",
    icon: "language",
  },
  {
    id: "showHindi",
    label: "Hindi Translation",
    description: "Verse meaning in Hindi",
    icon: "language",
  },
];

interface OnboardingStep4Props {
  onNext: (preferences: OnboardingState["preferences"]) => void;
  onBack: () => void;
}

export default function OnboardingStep4({
  onNext,
  onBack,
}: OnboardingStep4Props) {
  const { colors: themeColors } = useAppTheme();

  const [preferences, setPreferences] = useState<
    OnboardingState["preferences"]
  >({
    showSanskrit: true,
    showTransliteration: true,
    showEnglish: true,
    showHindi: false,
  });

  const colors = {
    bg: themeColors.bg,
    text: themeColors.text,
    textSecondary: themeColors.textSecondary,
    accent: themeColors.accent,
    buttonText: themeColors.background,
    cardBg: themeColors.surface,
    border: themeColors.border,
    activeBg: themeColors.accentSoft,
  };

  const togglePreference = (key: keyof OnboardingState["preferences"]) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleContinue = () => {
    // Validate that at least one option is selected
    const hasSelection = Object.values(preferences).some((val) => val === true);

    if (!hasSelection) {
      Alert.alert(
        "Please Select at Least One",
        "You must select at least one text format to continue.",
        [{ text: "OK" }],
      );
      return;
    }

    onNext(preferences);
  };

  // Count selected options
  const selectedCount = Object.values(preferences).filter(
    (val) => val === true,
  ).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Onboarding: go back"
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View
          style={[styles.progressDot, { backgroundColor: colors.accent }]}
        />
        <View
          style={[styles.progressDot, { backgroundColor: colors.accent }]}
        />
        <View
          style={[styles.progressDot, { backgroundColor: colors.accent }]}
        />
        <View
          style={[styles.progressDot, { backgroundColor: colors.accent }]}
        />
        <View
          style={[styles.progressDot, { backgroundColor: colors.border }]}
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.Text
          entering={FadeInDown.delay(200).duration(600)}
          style={[styles.title, { color: colors.text }]}
        >
          Select What You{"\n"}Want to See
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(300).duration(600)}
          style={[styles.subtitle, { color: colors.textSecondary }]}
        >
          Choose at least one format • {selectedCount} selected
        </Animated.Text>

        {/* Preference Options */}
        <View style={styles.optionsContainer}>
          {preferenceOptions.map((option, index) => {
            const isSelected = preferences[option.id];
            return (
              <Animated.View
                key={option.id}
                entering={FadeInDown.delay(400 + index * 100).duration(600)}
              >
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected
                        ? colors.activeBg
                        : colors.cardBg,
                      borderColor: isSelected ? colors.accent : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => togglePreference(option.id)}
                  activeOpacity={0.7}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`Onboarding: toggle preference ${option.label}`}
                  accessibilityState={{ checked: isSelected }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: isSelected ? colors.accent : colors.border,
                      },
                    ]}
                  >
                    {isSelected && (
                      <MaterialIcons
                        name="check"
                        size={20}
                        color={colors.accent}
                      />
                    )}
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={[styles.optionLabel, { color: colors.text }]}>
                      {option.label}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {option.description}
                    </Text>
                  </View>
                  <MaterialIcons
                    name={option.icon as any}
                    size={24}
                    color={isSelected ? colors.accent : colors.textSecondary}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Sample Preview (optional) */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(600)}
          style={[
            styles.previewBox,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
        >
          <MaterialIcons name="visibility" size={20} color={colors.accent} />
          <Text style={[styles.previewText, { color: colors.textSecondary }]}>
            You can change these settings anytime in the app
          </Text>
        </Animated.View>

        {/* Continue Button */}
        <Animated.View entering={FadeInDown.delay(1000).duration(600)}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  selectedCount > 0 ? colors.accent : colors.border,
                opacity: selectedCount > 0 ? 1 : 0.5,
              },
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={selectedCount === 0}
            accessibilityRole="button"
            accessibilityLabel="Onboarding: continue to next step"
            accessibilityState={{ disabled: selectedCount === 0 }}
          >
            <Text style={[styles.buttonText, { color: "#1a1a1a" }]}> 
              Continue
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color="#1a1a1a"
            />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: spacing.xxl + spacing.sm,
    left: spacing.lg,
    zIndex: 10,
    padding: spacing.xs,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xxl + spacing.sm,
    marginBottom: spacing.lg,
  },
  progressDot: {
    width: spacing.xs,
    height: spacing.xs,
    borderRadius: radius.full,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl + spacing.xs,
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  optionsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  optionCard: {
    flexDirection: "row",
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.md,
  },
  checkbox: {
    width: spacing.lg + spacing.xs / 2,
    height: spacing.lg + spacing.xs / 2,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  optionDescription: {
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  previewBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  previewText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.xs,
  },
  buttonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
