/**
 * Onboarding Screen 2 - Outcome
 * Shows what users will get from the app
 * Based on Rule #12: Trust + Outcome + Time + Social proof
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { getTotalVerses } from "@/src/utils/gitaData";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OutcomeItem {
  icon: string;
  title: string;
  description: string;
}

const outcomes: OutcomeItem[] = [
  {
    icon: "menu-book",
    title: `All ${getTotalVerses()} Verses`,
    description:
      "Complete Bhagavad Gita in Sanskrit, transliteration, and translations",
  },
  {
    icon: "lightbulb",
    title: "Deeper Understanding",
    description: "Explore the meaning and context of each teaching",
  },
  {
    icon: "self-improvement",
    title: "Life Wisdom",
    description: "Reflect on timeless teachings and apply them to modern life",
  },
];

interface OnboardingStep2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function OnboardingStep2({
  onNext,
  onBack,
}: OnboardingStep2Props) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useAppTheme();

  const colors = {
    bg: themeColors.bg,
    text: themeColors.text,
    textSecondary: themeColors.textSecondary,
    accent: themeColors.accent,
    buttonText: themeColors.background,
    cardBg: themeColors.surface,
    border: themeColors.border,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + spacing.md }]}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Onboarding: go back"
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Progress Indicator */}
      <View
        style={[
          styles.progressContainer,
          { marginTop: insets.top + spacing.lg },
        ]}
      >
        <View
          style={[styles.progressDot, { backgroundColor: colors.accent }]}
        />
        <View
          style={[styles.progressDot, { backgroundColor: colors.accent }]}
        />
        <View
          style={[styles.progressDot, { backgroundColor: colors.border }]}
        />
        <View
          style={[styles.progressDot, { backgroundColor: colors.border }]}
        />
        <View
          style={[styles.progressDot, { backgroundColor: colors.border }]}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(600)}
          style={[styles.title, { color: colors.text }]}
        >
          What You Will Get
        </Animated.Text>

        {/* Outcome Cards */}
        <View style={styles.outcomesContainer}>
          {outcomes.map((item, index) => (
            <Animated.View
              key={item.title}
              entering={FadeInRight.delay(400 + index * 150).duration(600)}
              style={[
                styles.outcomeCard,
                { backgroundColor: colors.cardBg, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: colors.accent + "20" },
                ]}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={28}
                  color={colors.accent}
                />
              </View>
              <View style={styles.outcomeContent}>
                <Text style={[styles.outcomeTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.outcomeDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Social Proof */}
        <Animated.View
          entering={FadeInDown.delay(1000).duration(600)}
          style={styles.socialProof}
        >
          <MaterialIcons name="groups" size={20} color={colors.textSecondary} />
          <Text
            style={[styles.socialProofText, { color: colors.textSecondary }]}
          >
            Used by thousands of readers worldwide
          </Text>
        </Animated.View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={onNext}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Onboarding: continue to next step"
        >
          <Text style={[styles.buttonText, { color: "#1a1a1a" }]}>
            Continue
          </Text>
          <MaterialIcons name="arrow-forward" size={20} color="#1a1a1a" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    left: spacing.lg,
    zIndex: 10,
    padding: spacing.xs,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  progressDot: {
    width: spacing.xs,
    height: spacing.xs,
    borderRadius: radius.full,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl + spacing.xs,
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  outcomesContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  outcomeCard: {
    flexDirection: "row",
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: "flex-start",
    gap: spacing.md,
  },
  iconCircle: {
    width: spacing.xxl + spacing.xs,
    height: spacing.xxl + spacing.xs,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  outcomeContent: {
    flex: 1,
  },
  outcomeTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  outcomeDescription: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  socialProof: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },
  socialProofText: {
    fontSize: fontSize.sm,
    fontStyle: "italic",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.xs,
    marginTop: "auto",
  },
  buttonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
