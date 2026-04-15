/**
 * Onboarding Screen 3.5 - Signature Commitment
 * User signs a commitment after selecting their goal
 * Based on Rule #2: Sign a goal (psychological commitment)
 */

import { SignaturePad } from "@/components/signature-pad";
import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ONBOARDING_GOALS, OnboardingGoal } from "@/src/types/onboarding";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface OnboardingStep3SignatureProps {
  selectedGoal: OnboardingGoal;
  onNext: () => void;
  onBack: () => void;
}

export default function OnboardingStep3Signature({
  selectedGoal,
  onNext,
  onBack,
}: OnboardingStep3SignatureProps) {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useAppTheme();
  const [hasSigned, setHasSigned] = useState(false);

  const colors = {
    bg: themeColors.bg,
    text: themeColors.text,
    textSecondary: themeColors.textSecondary,
    accent: themeColors.accent,
    buttonText: themeColors.background,
    cardBg: themeColors.surface,
    border: themeColors.border,
  };

  const goalDetails = ONBOARDING_GOALS.find((g) => g.id === selectedGoal);
  const commitmentText = getCommitmentText(selectedGoal);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg }]}
      edges={["top"]}
    >
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
          style={[styles.progressDot, { backgroundColor: colors.border }]}
        />
        <View
          style={[styles.progressDot, { backgroundColor: colors.border }]}
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: spacing.xl + insets.bottom },
        ]}
      >
        {/* Title */}
        <Animated.Text
          entering={FadeInUp.delay(200).duration(800)}
          style={[styles.title, { color: colors.text }]}
        >
          Make a Commitment
        </Animated.Text>

        {/* Selected Goal Display */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          style={[
            styles.goalDisplay,
            { backgroundColor: colors.cardBg, borderColor: colors.accent },
          ]}
        >
          <MaterialIcons
            name={goalDetails?.icon as any}
            size={32}
            color={colors.accent}
          />
          <View style={styles.goalInfo}>
            <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>
              Your Goal
            </Text>
            <Text style={[styles.goalTitle, { color: colors.text }]}>
              {goalDetails?.title}
            </Text>
          </View>
          <MaterialIcons name="check-circle" size={28} color={colors.accent} />
        </Animated.View>

        {/* Commitment Statement */}
        <Animated.Text
          entering={FadeInDown.delay(600).duration(600)}
          style={[styles.commitmentStatement, { color: colors.text }]}
        >
          {`"${commitmentText}"`}
        </Animated.Text>

        {/* Instruction */}
        <Animated.Text
          entering={FadeInDown.delay(700).duration(600)}
          style={[styles.instruction, { color: colors.textSecondary }]}
        >
          Sign below to seal your commitment to this spiritual journey
        </Animated.Text>

        {/* Signature Pad */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)}>
          <SignaturePad onSignature={setHasSigned} />
        </Animated.View>

        {/* Motivational Note */}
        {hasSigned && (
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={[
              styles.motivationBox,
              {
                backgroundColor: colors.accent + "15",
                borderColor: colors.accent,
              },
            ]}
          >
            <MaterialIcons name="celebration" size={24} color={colors.accent} />
            <Text style={[styles.motivationText, { color: colors.text }]}>
              {`You\\'ve taken the first step!\\nYour spiritual journey begins today.`}
            </Text>
          </Animated.View>
        )}

        {/* Continue Button */}
        {hasSigned && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
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
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color="#1a1a1a"
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getCommitmentText(goal: OnboardingGoal): string {
  switch (goal) {
    case "daily-sloka":
      return "I commit to reading one verse of the Bhagavad Gita every day";
    case "chapter-study":
      return "I commit to studying the Bhagavad Gita chapter by chapter";
    case "life-wisdom":
      return "I commit to applying the wisdom of the Gita to my daily life";
    default:
      return "I commit to my spiritual journey with the Bhagavad Gita";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: spacing.md,
    left: spacing.lg,
    zIndex: 10,
    padding: spacing.xs,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.lg,
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
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  goalDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    marginBottom: spacing.xl,
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs / 2,
  },
  goalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  commitmentStatement: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: spacing.lg,
    fontStyle: "italic",
  },
  instruction: {
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  motivationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  motivationText: {
    flex: 1,
    fontSize: fontSize.md,
    lineHeight: 22,
    fontWeight: fontWeight.medium,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  buttonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
