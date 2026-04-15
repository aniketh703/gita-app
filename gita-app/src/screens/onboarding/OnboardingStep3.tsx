/**
 * Onboarding Screen 3 - Commitment Psychology
 * User selects their goal and makes a psychological commitment
 * Based on Rule #2: Sign a goal
 */

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
import Animated, { FadeInDown } from "react-native-reanimated";

interface OnboardingStep3Props {
  onNext: (goal: OnboardingGoal) => void;
  onBack: () => void;
}

export default function OnboardingStep3({
  onNext,
  onBack,
}: OnboardingStep3Props) {
  const { colors: themeColors } = useAppTheme();
  const [selectedGoal, setSelectedGoal] = useState<OnboardingGoal | null>(null);
  const [showCommitment, setShowCommitment] = useState(false);

  const colors = {
    bg: themeColors.bg,
    text: themeColors.text,
    textSecondary: themeColors.textSecondary,
    accent: themeColors.accent,
    buttonText: themeColors.background,
    cardBg: themeColors.surface,
    border: themeColors.border,
    selectedBg: themeColors.accentSoft,
  };

  const handleGoalSelect = (goalId: OnboardingGoal) => {
    setSelectedGoal(goalId);
    setTimeout(() => {
      setShowCommitment(true);
    }, 300);
  };

  const handleCommit = () => {
    if (selectedGoal) {
      onNext(selectedGoal);
    }
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
          style={[styles.progressDot, { backgroundColor: colors.border }]}
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
          Choose Your Goal
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(300).duration(600)}
          style={[styles.subtitle, { color: colors.textSecondary }]}
        >
          What would you like to focus on?
        </Animated.Text>

        {/* Goal Options */}
        <View style={styles.goalsContainer}>
          {ONBOARDING_GOALS.map((goal, index) => {
            const isSelected = selectedGoal === goal.id;
            return (
              <Animated.View
                key={goal.id}
                entering={FadeInDown.delay(400 + index * 100).duration(600)}
              >
                <TouchableOpacity
                  style={[
                    styles.goalCard,
                    {
                      backgroundColor: isSelected
                        ? colors.selectedBg
                        : colors.cardBg,
                      borderColor: isSelected ? colors.accent : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleGoalSelect(goal.id)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Onboarding: select goal ${goal.title}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: colors.accent + "20" },
                    ]}
                  >
                    <MaterialIcons
                      name={goal.icon as any}
                      size={32}
                      color={isSelected ? colors.accent : colors.textSecondary}
                    />
                  </View>
                  <View style={styles.goalContent}>
                    <Text style={[styles.goalTitle, { color: colors.text }]}>
                      {goal.title}
                    </Text>
                    <Text
                      style={[
                        styles.goalDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {goal.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <View
                      style={[
                        styles.checkmark,
                        { backgroundColor: colors.accent },
                      ]}
                    >
                      <MaterialIcons name="check" size={20} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Commitment Statement */}
        {showCommitment && selectedGoal && (
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={[
              styles.commitmentBox,
              {
                backgroundColor: colors.selectedBg,
                borderColor: colors.accent,
              },
            ]}
          >
            <MaterialIcons name="verified" size={24} color={colors.accent} />
            <Text style={[styles.commitmentText, { color: colors.text }]}>
              I commit to learning from the Gita daily
            </Text>
          </Animated.View>
        )}

        {/* Continue Button */}
        {selectedGoal && (
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.accent }]}
              onPress={handleCommit}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Onboarding: continue to next step"
            >
              <Text style={[styles.buttonText, { color: "#1a1a1a" }]}> 
                Confirm My Goal
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
  goalsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  goalCard: {
    flexDirection: "row",
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.md,
    position: "relative",
  },
  iconCircle: {
    width: spacing.xxl + spacing.md,
    height: spacing.xxl + spacing.md,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  goalDescription: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  checkmark: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  commitmentBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    marginBottom: spacing.lg,
  },
  commitmentText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: 24,
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
