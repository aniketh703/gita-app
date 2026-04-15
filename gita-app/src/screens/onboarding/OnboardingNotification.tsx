/**
 * Onboarding Screen - Notification Setup
 * Asks users when they want to be reminded, then triggers permission
 * Based on: User choice → Permission prompt pattern
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface NotificationOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  hour: number; // 24-hour format
}

const notificationTimes: NotificationOption[] = [
  {
    id: "morning",
    label: "Morning",
    description: "Start your day with wisdom",
    icon: "wb-sunny",
    hour: 7,
  },
  {
    id: "afternoon",
    label: "Afternoon",
    description: "Midday reflection",
    icon: "wb-twilight",
    hour: 14,
  },
  {
    id: "evening",
    label: "Evening",
    description: "End your day peacefully",
    icon: "nights-stay",
    hour: 20,
  },
  {
    id: "skip",
    label: "I'll Remember",
    description: "No reminders needed",
    icon: "notifications-off",
    hour: -1,
  },
];

interface OnboardingNotificationProps {
  onComplete: (time: string, enabled: boolean) => void;
  onBack: () => void;
}

export default function OnboardingNotification({
  onComplete,
  onBack,
}: OnboardingNotificationProps) {
  const { colors: themeColors } = useAppTheme();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

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

  const handleTimeSelect = async (option: NotificationOption) => {
    setSelectedTime(option.id);

    // If user chose to skip notifications
    if (option.id === "skip") {
      setTimeout(() => {
        onComplete("skip", false);
      }, 500);
      return;
    }

    // Request notification permission
    setIsRequesting(true);

    try {
      // Avoid importing expo-notifications in Expo Go, where Android remote push support is removed.
      const Notifications = await import("expo-notifications");
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === "granted") {
        // Schedule daily notification at selected time
        await scheduleDailyNotification(option.hour);
        setTimeout(() => {
          onComplete(option.id, true);
        }, 500);
      } else {
        Alert.alert(
          "Notifications Disabled",
          "You can enable them later in Settings",
          [
            {
              text: "OK",
              onPress: () => onComplete(option.id, false),
            },
          ],
        );
      }
    } catch (error) {
      console.error("Notification permission error:", error);
      Alert.alert(
        "Something went wrong",
        "We'll continue without notifications for now",
        [
          {
            text: "OK",
            onPress: () => onComplete(option.id, false),
          },
        ],
      );
    } finally {
      setIsRequesting(false);
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
              name="notifications"
              size={48}
              color={colors.accent}
            />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          entering={FadeInUp.delay(400).duration(600)}
          style={[styles.title, { color: colors.text }]}
        >
          When should we{"\n"}remind you?
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.delay(500).duration(600)}
          style={[styles.subtitle, { color: colors.textSecondary }]}
        >
          Build a consistent practice with daily reminders
        </Animated.Text>

        {/* Time Options */}
        <View style={styles.optionsContainer}>
          {notificationTimes.map((option, index) => {
            const isSelected = selectedTime === option.id;
            const isSkip = option.id === "skip";

            return (
              <Animated.View
                key={option.id}
                entering={FadeInDown.delay(600 + index * 100).duration(600)}
              >
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected
                        ? colors.selectedBg
                        : colors.cardBg,
                      borderColor: isSelected ? colors.accent : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      opacity: isRequesting && !isSelected ? 0.5 : 1,
                    },
                  ]}
                  onPress={() => handleTimeSelect(option)}
                  disabled={isRequesting}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Onboarding: select reminder ${option.label}`}
                  accessibilityState={{
                    selected: isSelected,
                    disabled: isRequesting,
                  }}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      {
                        backgroundColor: isSkip
                          ? colors.border + "40"
                          : colors.accent + "20",
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={option.icon as any}
                      size={28}
                      color={isSkip ? colors.textSecondary : colors.accent}
                    />
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
                  {isSelected && !isRequesting && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color={colors.accent}
                    />
                  )}
                  {isSelected && isRequesting && (
                    <MaterialIcons
                      name="hourglass-empty"
                      size={24}
                      color={colors.accent}
                    />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Note */}
        <Animated.Text
          entering={FadeInDown.delay(1000).duration(600)}
          style={[styles.note, { color: colors.textSecondary }]}
        >
          You can change this later in Settings
        </Animated.Text>

        {/* Bottom Spacing */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

/**
 * Schedule daily notification at specified hour
 */
async function scheduleDailyNotification(hour: number): Promise<void> {
  try {
    const Notifications = await import("expo-notifications");

    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule new notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Wisdom 🕉️",
        body: "Read today's verse from the Bhagavad Gita",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });
  } catch (error) {
    console.error("Failed to schedule notification:", error);
  }
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: spacing.xxl * 2,
    height: spacing.xxl * 2,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  optionIcon: {
    width: spacing.xxl + spacing.sm,
    height: spacing.xxl + spacing.sm,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  optionDescription: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  note: {
    fontSize: fontSize.sm,
    textAlign: "center",
    fontStyle: "italic",
  },
});
