/**
 * Onboarding Screen 5 - Appearance Setup (Final Step)
 * User selects font size and theme
 */

import { getColors } from "@/constants/colors";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import type { OnboardingState } from "@/src/types/onboarding";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme as useSystemColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface OnboardingStep5Props {
  onComplete: (appearance: OnboardingState["appearance"]) => void;
  onBack: () => void;
  isCompleting?: boolean;
}

export default function OnboardingStep5({
  onComplete,
  onBack,
  isCompleting = false,
}: OnboardingStep5Props) {
  const systemColorScheme = useSystemColorScheme();

  const [appearance, setAppearance] = useState<OnboardingState["appearance"]>({
    fontSize: "medium",
    theme: "system",
  });

  // Determine actual theme for preview
  const effectiveTheme =
    appearance.theme === "system" ? systemColorScheme : appearance.theme;
  const isDark = effectiveTheme === "dark";
  const themeColors = getColors(isDark);

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

  const fontSizes: OnboardingState["appearance"]["fontSize"][] = [
    "small",
    "medium",
    "large",
  ];
  const themes: OnboardingState["appearance"]["theme"][] = [
    "light",
    "dark",
    "system",
  ];

  const fontSizeLabels = {
    small: { label: "Small", size: 14 },
    medium: { label: "Medium", size: 16 },
    large: { label: "Large", size: 18 },
  };

  const themeLabels = {
    light: { label: "Light", icon: "light-mode" },
    dark: { label: "Dark", icon: "dark-mode" },
    system: { label: "System", icon: "phone-iphone" },
  };

  const handleComplete = () => {
    if (isCompleting) {
      return;
    }
    onComplete(appearance);
  };

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
          style={[styles.progressDot, { backgroundColor: colors.accent }]}
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
          Customize Your{"\n"}Reading Experience
        </Animated.Text>

        {/* Font Size Selection */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Font Size
          </Text>
          <View style={styles.optionsRow}>
            {fontSizes.map((size) => {
              const isSelected = appearance.fontSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: isSelected
                        ? colors.activeBg
                        : colors.cardBg,
                      borderColor: isSelected ? colors.accent : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      flex: 1,
                    },
                  ]}
                  onPress={() =>
                    setAppearance((prev) => ({ ...prev, fontSize: size }))
                  }
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Onboarding: select font size ${fontSizeLabels[size].label}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: colors.text,
                        fontSize: fontSizeLabels[size].size,
                      },
                    ]}
                  >
                    {fontSizeLabels[size].label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Theme Selection */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(600)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Theme
          </Text>
          <View style={styles.optionsRow}>
            {themes.map((theme) => {
              const isSelected = appearance.theme === theme;
              return (
                <TouchableOpacity
                  key={theme}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: isSelected
                        ? colors.activeBg
                        : colors.cardBg,
                      borderColor: isSelected ? colors.accent : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      flex: 1,
                    },
                  ]}
                  onPress={() => setAppearance((prev) => ({ ...prev, theme }))}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Onboarding: select theme ${themeLabels[theme].label}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <MaterialIcons
                    name={themeLabels[theme].icon as any}
                    size={24}
                    color={isSelected ? colors.accent : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: colors.text },
                    ]}
                  >
                    {themeLabels[theme].label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Preview */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(600)}
          style={[
            styles.previewCard,
            { backgroundColor: colors.cardBg, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
            Preview
          </Text>
          <Text
            style={[
              styles.previewText,
              {
                color: colors.text,
                fontSize: fontSizeLabels[appearance.fontSize].size + 2,
              },
            ]}
          >
            योगस्थः कुरु कर्माणि{"\n"}
            yogasthaḥ kuru karmāṇi
          </Text>
          <Text
            style={[
              styles.previewTranslation,
              {
                color: colors.textSecondary,
                fontSize: fontSizeLabels[appearance.fontSize].size,
              },
            ]}
          >
            Established in yoga, perform action
          </Text>
        </Animated.View>

        {/* Info Note */}
        <Animated.View
          entering={FadeInDown.delay(1000).duration(600)}
          style={styles.infoBox}
        >
          <MaterialIcons
            name="info-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            You can adjust these settings anytime in Settings
          </Text>
        </Animated.View>

        {/* Complete Button */}
        <Animated.View entering={FadeInDown.delay(1200).duration(600)}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={handleComplete}
            activeOpacity={0.8}
            disabled={isCompleting}
            accessibilityRole="button"
            accessibilityLabel={isCompleting ? "Onboarding: finishing setup" : "Onboarding: finish setup"}
            accessibilityState={{ disabled: isCompleting }}
          >
            <Text style={[styles.buttonText, { color: "#1a1a1a" }]}> 
              {isCompleting ? "Starting..." : "Start Reading"}
            </Text>
            <MaterialIcons
              name="auto-stories"
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
    marginBottom: spacing.xl + spacing.xs,
    textAlign: "center",
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  optionButton: {
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    gap: spacing.xs,
  },
  optionLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  previewCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  previewLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  previewText: {
    fontWeight: fontWeight.semibold,
    lineHeight: 28,
    marginBottom: spacing.xs,
  },
  previewTranslation: {
    lineHeight: 24,
    fontStyle: "italic",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  infoText: {
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
