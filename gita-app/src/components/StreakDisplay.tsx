/**
 * Streak Display Component
 * Shows reading streak and encourages daily habit
 * Based on Rule #25: Gamification & Habit Loops
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppStore } from "@/src/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

export default function StreakDisplay() {
  const { colors } = useAppTheme();
  const { streak } = useAppStore();

  const streakDays = [
    streak.currentStreak >= 1,
    streak.currentStreak >= 2,
    streak.currentStreak >= 3,
    streak.currentStreak >= 4,
    streak.currentStreak >= 5,
    streak.currentStreak >= 6,
    streak.currentStreak >= 7,
  ];

  return (
    <View style={styles.container}>
      {/* Streak Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons
            name="local-fire-department"
            size={24}
            color={colors.accent}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            Reading Streak
          </Text>
        </View>
        <View style={styles.streakCount}>
          <Text style={[styles.streakNumber, { color: colors.accent }]}>
            {streak.currentStreak}
          </Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
            days
          </Text>
        </View>
      </View>

      {/* Week View - 7 Day Indicator */}
      <View style={styles.weekContainer}>
        {streakDays.map((isCompleted, index) => (
          <Animated.View
            key={index}
            entering={FadeInRight.delay(index * 50)}
            style={[
              styles.dayCircle,
              {
                backgroundColor: isCompleted ? colors.accent : colors.border,
              },
            ]}
          >
            {isCompleted ? (
              <MaterialIcons
                name="check"
                size={fontSize.md}
                color={colors.background}
              />
            ) : (
              <Text style={[styles.dayNumber, { color: colors.textSecondary }]}>
                {index + 1}
              </Text>
            )}
          </Animated.View>
        ))}
      </View>

      {/* Streak Info */}
      <View style={styles.infoContainer}>
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Longest Streak
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {streak.longestStreak} days
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            Total Days Read
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {streak.totalDaysRead} days
          </Text>
        </View>
      </View>

      {/* Motivational Message */}
      {streak.currentStreak === 0 && (
        <View
          style={[styles.motivationBox, { backgroundColor: colors.accentSoft }]}
        >
          <MaterialIcons name="lightbulb" size={18} color={colors.accent} />
          <Text style={[styles.motivationText, { color: colors.accent }]}>
            Start your streak by reading today!
          </Text>
        </View>
      )}

      {streak.currentStreak > 0 && streak.currentStreak < 7 && (
        <View
          style={[styles.motivationBox, { backgroundColor: colors.accentSoft }]}
        >
          <MaterialIcons name="trending-up" size={18} color={colors.accent} />
          <Text style={[styles.motivationText, { color: colors.accent }]}>
            Keep it up! {7 - streak.currentStreak} more days to a week streak
          </Text>
        </View>
      )}

      {streak.currentStreak >= 7 && (
        <View
          style={[styles.motivationBox, { backgroundColor: colors.accentSoft }]}
        >
          <MaterialIcons name="celebration" size={18} color={colors.accent} />
          <Text style={[styles.motivationText, { color: colors.accent }]}>
            Amazing! You&apos;ve maintained a {streak.currentStreak}-day streak!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  streakCount: {
    alignItems: "center",
  },
  streakNumber: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
  },
  streakLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  weekContainer: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.md,
    justifyContent: "center",
  },
  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumber: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  infoContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoCard: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  motivationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  motivationText: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
});
