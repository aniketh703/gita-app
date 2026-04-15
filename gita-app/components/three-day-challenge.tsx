/**
 * 3-Day Gita Challenge
 * A gamified challenge to drive user engagement and retention
 * Shows after user dismisses paywall
 * Based on: Rule #11 (Retention through challenges)
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppStore } from "@/src/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface ChallengeDay {
  day: number;
  theme: string;
  description: string;
  icon: string;
  completed: boolean;
}

interface ThreeDayChallengeProps {
  visible: boolean;
  onDismiss: () => void;
  onStartChallenge?: () => void;
}

export function ThreeDayChallenge({
  visible,
  onDismiss,
  onStartChallenge,
}: ThreeDayChallengeProps) {
  const { colors } = useAppTheme();
  const {
    challengeStartDate,
    challengeCompleted,
    startChallenge,
    completeChallenge,
  } = useAppStore();

  const threeDayChallenge = {
    started: Boolean(challengeStartDate),
    completedDays: challengeCompleted ? [1, 2, 3] : [],
  };

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const challengeDays: ChallengeDay[] = [
    {
      day: 1,
      theme: "Wisdom of Action",
      description: "Explore the concept of Karma Yoga and right action",
      icon: "trending-up",
      completed: threeDayChallenge?.completedDays?.includes(1) || false,
    },
    {
      day: 2,
      theme: "Wisdom of Mind",
      description: "Understand the path of meditation and mental clarity",
      icon: "self-improvement",
      completed: threeDayChallenge?.completedDays?.includes(2) || false,
    },
    {
      day: 3,
      theme: "Wisdom of Purpose",
      description: "Discover your dharma and life's true purpose",
      icon: "light-mode",
      completed: threeDayChallenge?.completedDays?.includes(3) || false,
    },
  ];

  const handleStartChallenge = () => {
    startChallenge();
    if (onStartChallenge) {
      onStartChallenge();
    }
  };

  const handleMarkComplete = (day: number) => {
    if (day === 3) {
      completeChallenge();
    }
  };

  const completedDaysCount = challengeDays.filter((d) => d.completed).length;
  const progress = (completedDaysCount / 3) * 100;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            3-Day Gita Challenge
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={[styles.container, { backgroundColor: colors.bg }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Icon */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(800)}
            style={styles.iconContainer}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.accent + "20" },
              ]}
            >
              <MaterialIcons
                name="emoji-events"
                size={56}
                color={colors.accent}
              />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.Text
            entering={FadeInUp.delay(400).duration(600)}
            style={[styles.title, { color: colors.text }]}
          >
            Master the Gita{"\n"}in 3 Days
          </Animated.Text>

          {/* Subtitle */}
          <Animated.Text
            entering={FadeInDown.delay(500).duration(600)}
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            A guided journey through three key wisdoms. Each day unlocks deeper
            understanding.
          </Animated.Text>

          {/* Progress Bar */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <View
              style={[styles.progressBar, { backgroundColor: colors.border }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.accent,
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.progressText, { color: colors.textSecondary }]}
            >
              {completedDaysCount} of 3 days completed
            </Text>
          </Animated.View>

          {/* Challenge Days */}
          <View style={styles.daysContainer}>
            {challengeDays.map((day, index) => (
              <Animated.View
                key={day.day}
                entering={FadeInDown.delay(700 + index * 150).duration(600)}
              >
                <TouchableOpacity
                  style={[
                    styles.dayCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: day.completed
                        ? colors.accent
                        : colors.border,
                      borderWidth: day.completed ? 2 : 1,
                    },
                  ]}
                  onPress={() => {
                    setSelectedDay(selectedDay === day.day ? null : day.day);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.dayCardHeader}>
                    <View style={styles.dayNumber}>
                      <View
                        style={[
                          styles.dayIcon,
                          {
                            backgroundColor: day.completed
                              ? colors.accent
                              : colors.accent + "20",
                          },
                        ]}
                      >
                        {day.completed ? (
                          <MaterialIcons
                            name="check"
                            size={20}
                            color="#ffffff"
                          />
                        ) : (
                          <MaterialIcons
                            name={day.icon as any}
                            size={20}
                            color={colors.accent}
                          />
                        )}
                      </View>
                      <View style={styles.dayInfo}>
                        <Text style={[styles.dayTheme, { color: colors.text }]}>
                          Day {day.day}: {day.theme}
                        </Text>
                        <Text
                          style={[
                            styles.dayDescription,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {day.description}
                        </Text>
                      </View>
                    </View>
                    {day.completed && (
                      <MaterialIcons
                        name="check-circle"
                        size={24}
                        color={colors.accent}
                      />
                    )}
                  </View>

                  {/* Expanded Content */}
                  {selectedDay === day.day && (
                    <View
                      style={[
                        styles.dayExpanded,
                        { borderTopColor: colors.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.expandedText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Read 3 verses related to {day.theme.toLowerCase()} to
                        complete this day.
                      </Text>
                      {day.completed && (
                        <View
                          style={[
                            styles.completedBadge,
                            { backgroundColor: colors.accent + "10" },
                          ]}
                        >
                          <MaterialIcons
                            name="celebration"
                            size={20}
                            color={colors.accent}
                          />
                          <Text
                            style={[
                              styles.completedText,
                              { color: colors.accent },
                            ]}
                          >
                            Completed!
                          </Text>
                        </View>
                      )}
                      {!day.completed && (
                        <TouchableOpacity
                          style={[
                            styles.markCompleteButton,
                            { backgroundColor: colors.accent },
                          ]}
                          onPress={() => handleMarkComplete(day.day)}
                        >
                          <Text style={styles.markCompleteText}>
                            Mark as Complete
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Reward Info */}
          {completedDaysCount === 3 && (
            <Animated.View
              entering={FadeInDown.duration(600)}
              style={[
                styles.rewardBox,
                {
                  backgroundColor: colors.accent + "15",
                  borderColor: colors.accent,
                },
              ]}
            >
              <MaterialIcons name="stars" size={24} color={colors.accent} />
              <Text style={[styles.rewardText, { color: colors.accent }]}>
                🎉 Challenge Complete!{"\n"}Unlock Premium for deeper insights
              </Text>
            </Animated.View>
          )}

          {/* CTA Buttons */}
          <Animated.View entering={FadeInDown.delay(1000).duration(600)}>
            {!threeDayChallenge?.started ? (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: colors.accent },
                ]}
                onPress={handleStartChallenge}
              >
                <Text style={styles.primaryButtonText}>
                  Start the Challenge
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: colors.accent },
                ]}
                onPress={onDismiss}
              >
                <Text style={styles.primaryButtonText}>Continue Reading</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onDismiss}
            >
              <Text
                style={[styles.secondaryButtonText, { color: colors.text }]}
              >
                Maybe Later
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  closeButton: {
    padding: spacing.xs,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.md,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: spacing.xs + 2,
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: "100%",
  },
  progressText: {
    fontSize: fontSize.xs + 1,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  daysContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  dayCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  dayCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayNumber: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  dayIcon: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  dayInfo: {
    flex: 1,
  },
  dayTheme: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  dayDescription: {
    fontSize: fontSize.xs + 1,
    lineHeight: 18,
  },
  dayExpanded: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    gap: spacing.md,
  },
  expandedText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  completedText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  markCompleteButton: {
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  markCompleteText: {
    color: "#ffffff",
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  rewardBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  rewardText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: 24,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});
