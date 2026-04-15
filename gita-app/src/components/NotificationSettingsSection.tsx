/**
 * Notification Settings Section
 * Allows users to enable/disable daily reading reminders
 * Based on Rule #22: Ask for permission naturally
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppStore } from "@/src/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificationSettingsSectionProps {
  onRequestPermission?: () => void;
}

const TIME_OPTIONS = [
  { id: "morning", label: "Morning (8:00 AM)" },
  { id: "afternoon", label: "Afternoon (12:00 PM)" },
  { id: "evening", label: "Evening (6:00 PM)" },
  { id: "night", label: "Night (9:00 PM)" },
];

export default function NotificationSettingsSection({
  onRequestPermission,
}: NotificationSettingsSectionProps) {
  const { colors } = useAppTheme();

  const {
    notificationSettings,
    setNotificationEnabled,
    setNotificationTime,
    setNotificationPermissionAsked,
  } = useAppStore();

  const [expandedTime, setExpandedTime] = useState(false);

  const handleEnableNotifications = async () => {
    try {
      if (notificationSettings.enabled) {
        setNotificationEnabled(false);
        return;
      }

      if (Constants.appOwnership === "expo") {
        Alert.alert(
          "Development Build Required",
          "Push notifications are not fully supported in Expo Go. Please use a development build to enable reminders.",
        );
        setNotificationPermissionAsked(true);
        setNotificationEnabled(true);
        return;
      }

      Alert.alert(
        "Development Build Required",
        "Use a development build to request system notification permissions.",
      );
      setNotificationPermissionAsked(true);
      setNotificationEnabled(true);

      if (onRequestPermission) {
        onRequestPermission();
      }
    } catch (error) {
      console.log("Notification permission error:", error);
    }
  };

  const handleTimeChange = (timeId: string) => {
    setNotificationTime(timeId);
    setExpandedTime(false);

    if (!notificationSettings.enabled) {
      handleEnableNotifications();
    }
  };

  const selectedTime =
    TIME_OPTIONS.find((t) => t.id === notificationSettings.time)?.label ||
    "Select Time";

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Daily Reminder
      </Text>

      {/* Enable Toggle */}
      <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
        <View style={styles.settingContent}>
          <View style={styles.labelContainer}>
            <MaterialIcons
              name="notifications-active"
              size={24}
              color={colors.accent}
              style={styles.icon}
            />
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Reading Reminder
              </Text>
              <Text
                style={[styles.settingDesc, { color: colors.textSecondary }]}
              >
                Get daily reminders to read
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleSwitch,
              {
                backgroundColor: notificationSettings.enabled
                  ? colors.accent
                  : colors.border,
              },
            ]}
            onPress={handleEnableNotifications}
          >
            <View
              style={[
                styles.toggleThumb,
                {
                  transform: [
                    {
                      translateX: notificationSettings.enabled ? 20 : 2,
                    },
                  ],
                  backgroundColor: colors.background,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Time Selection */}
      {notificationSettings.enabled && (
        <>
          <TouchableOpacity
            style={[
              styles.settingRow,
              { borderBottomColor: colors.border },
              expandedTime && {
                borderBottomWidth: 0,
              },
            ]}
            onPress={() => setExpandedTime(!expandedTime)}
          >
            <View style={styles.settingContent}>
              <View style={styles.labelContainer}>
                <MaterialIcons
                  name="schedule"
                  size={24}
                  color={colors.accent}
                  style={styles.icon}
                />
                <View>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Reminder Time
                  </Text>
                  <Text
                    style={[
                      styles.settingDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {selectedTime}
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name={expandedTime ? "expand-less" : "expand-more"}
                size={24}
                color={colors.textSecondary}
              />
            </View>
          </TouchableOpacity>

          {/* Time Options */}
          {expandedTime && (
            <View
              style={[
                styles.timeOptionsContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              {TIME_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.timeOption,
                    {
                      borderBottomColor: colors.border,
                      backgroundColor:
                        notificationSettings.time === option.id
                          ? colors.accentSoft
                          : "transparent",
                    },
                  ]}
                  onPress={() => handleTimeChange(option.id)}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      {
                        color: colors.text,
                        fontWeight:
                          notificationSettings.time === option.id
                            ? fontWeight.bold
                            : fontWeight.medium,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {notificationSettings.time === option.id && (
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={colors.accent}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginLeft: spacing.md,
  },
  settingRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  settingContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: spacing.sm,
  },
  settingLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs / 2,
  },
  settingDesc: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.regular,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: radius.full,
    justifyContent: "center",
    paddingHorizontal: spacing.xs / 4,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
  },
  timeOptionsContainer: {
    borderBottomWidth: 1,
  },
  timeOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  timeOptionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
