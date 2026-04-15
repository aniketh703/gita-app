/**
 * F-11 Notification System Verification Script
 * 
 * Run this in your component to test all notification types
 * Place in a development-only component or add to DevResetOnboardingButton
 */

import { useAppStore } from "@/src/store/appStore";
import { useNotifications } from "@/src/context/NotificationContext";
import { View, Text, Button } from "react-native";
import {
  scheduleNotification,
  NOTIFICATION_TEMPLATES,
  interpolateTemplate,
} from "@/src/services/notificationService";

/**
 * Test component - shows buttons to verify each notification type
 */
export function NotificationTestPanel() {
  const store = useAppStore();
  const { onChapterComplete, onMilestoneUnlocked } = useNotifications();

  const testNotifications = {
    morning: async () => {
      const template = NOTIFICATION_TEMPLATES.morning;
      await scheduleNotification(template, 2000); // Schedule in 2 seconds
      console.log("✅ Morning notification scheduled");
    },

    midday: async () => {
      const template = NOTIFICATION_TEMPLATES.midday;
      await scheduleNotification(template, 2000);
      console.log("✅ Midday notification scheduled");
    },

    evening: async () => {
      const template = NOTIFICATION_TEMPLATES.evening;
      const interpolated = interpolateTemplate(template, {
        streak_count: store.streak.currentStreak,
      });
      await scheduleNotification(interpolated, 2000);
      console.log("✅ Evening notification scheduled");
    },

    streakRisk: async () => {
      const template = NOTIFICATION_TEMPLATES.streak_risk;
      const interpolated = interpolateTemplate(template, {
        streak_count: store.streak.currentStreak,
      });
      await scheduleNotification(interpolated, 2000);
      console.log("✅ Streak-risk notification scheduled");
    },

    chapterComplete: async () => {
      // Test with Chapter 1
      await onChapterComplete(1);
      console.log("✅ Chapter completion notification triggered");
    },

    milestone: async () => {
      await onMilestoneUnlocked("🏆 Test Achievement - Notifications Working!");
      console.log("✅ Milestone notification triggered");
    },

    scheduledTests: async () => {
      // Schedule all 3 reminder types over next 2 minutes
      console.log("📋 Scheduling 3 reminders...");
      
      await scheduleNotification(NOTIFICATION_TEMPLATES.morning, 2000);
      await scheduleNotification(NOTIFICATION_TEMPLATES.midday, 30000);
      await scheduleNotification(NOTIFICATION_TEMPLATES.evening, 60000);
      
      console.log("✅ Scheduled morning (2s), midday (30s), evening (60s)");
    },
  };

  return (
    <View style={{ padding: 12, gap: 8, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
      <Text style={{ fontWeight: "bold" }}>🔔 Notification Tests</Text>

      <Button
        onPress={testNotifications.morning}
        title="Morning Notification"
        color="#FF9500"
      />
      <Button
        onPress={testNotifications.midday}
        title="Midday Notification"
        color="#007AFF"
      />
      <Button
        onPress={testNotifications.evening}
        title="Evening Notification"
        color="#FF3B30"
      />
      <Button
        onPress={testNotifications.streakRisk}
        title="Streak-Risk Warning"
        color="#FF2D55"
      />
      <Button
        onPress={testNotifications.chapterComplete}
        title="Chapter Complete"
        color="#34C759"
      />
      <Button
        onPress={testNotifications.milestone}
        title="Milestone Achievement"
        color="#FFB800"
      />
      <Button
        onPress={testNotifications.scheduledTests}
        title="Run Scheduled Tests"
        color="#5856D6"
      />
    </View>
  );
}

/**
 * Verification Checklist
 * Run through these tests on a real device:
 * 
 * 1. ✅ Permissions
 *    - [ ] App requests notification permission on startup
 *    - [ ] User can accept/deny
 *    - [ ] Saves state when denied
 * 
 * 2. ✅ Scheduling
 *    - [ ] Button "Morning Notification" → notification appears in 2 seconds
 *    - [ ] Button "Midday Notification" → appears
 *    - [ ] Button "Evening Notification" → appears (with streak count)
 *    - [ ] Button "Streak-Risk Warning" → appears (with streak count)
 * 
 * 3. ✅ Chapter Completion
 *    - [ ] Read a chapter and hit "Complete"
 *    - [ ] Celebration notification shows
 *    - [ ] Tapping notification opens Chapters screen
 * 
 * 4. ✅ Milestone Unlocks
 *    - [ ] Button "Milestone Achievement" → notification shows
 *    - [ ] Tapping opens Badges screen
 * 
 * 5. ✅ Scheduled Tests
 *    - [ ] Button "Run Scheduled Tests" schedules 3 notifications
 *    - [ ] Morning appears in 2 seconds
 *    - [ ] Midday appears in 30 seconds
 *    - [ ] Evening appears in 60 seconds
 *    - [ ] Only ONE appears (max 1 per day rule)
 * 
 * 6. ✅ Deep Linking
 *    - [ ] Tap any notification
 *    - [ ] App navigates to correct screen
 *    - [ ] Params passed correctly
 * 
 * 7. ✅ Settings Integration
 *    - [ ] Go to Settings > Notifications
 *    - [ ] Toggle notifications on/off
 *    - [ ] Change time preference
 *    - [ ] New settings take effect immediately
 * 
 * 8. ✅ App Lifecycle
 *    - [ ] Schedule notification
 *    - [ ] Close app (background)
 *    - [ ] Notification still fires
 *    - [ ] Open app
 *    - [ ] Notification still fires (hasn't been delivered yet)
 * 
 * Debug Commands (in console):
 * 
 * // Check all scheduled notifications
 * import * as Notifications from "expo-notifications";
 * const scheduled = await Notifications.getAllScheduledNotificationsAsync();
 * console.log("Scheduled:", scheduled);
 * 
 * // Check if permissions granted
 * const { granted } = await Notifications.getPermissionsAsync();
 * console.log("Permissions granted:", granted);
 * 
 * // Cancel all (for testing)
 * await Notifications.cancelAllScheduledNotificationsAsync();
 */
