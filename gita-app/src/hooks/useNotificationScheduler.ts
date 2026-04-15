/**
 * Hook to integrate notifications with app state and lifecycle
 * Handles scheduling notifications based on reading habits and settings
 */

import { useEffect, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import {
  scheduleDailyReminders,
  scheduleStreakRiskNotification,
  rescheduleNotifications,
  scheduleMilestoneNotification,
  scheduleCompletionNotification,
  type NotificationSchedulerContext,
} from "@/src/services/notificationScheduler";
import { useAppStore } from "@/src/store/appStore";
import { getChapters } from "@/src/utils/gitaData";

export function useNotificationScheduler() {
  const {
    streak,
    notificationSettings,
    readingHistory,
    completedChapters,
  } = useAppStore();

  /**
   * Get the last read date from reading history
   */
  const getLastReadDate = useCallback((): string | null => {
    if (readingHistory.length === 0) return null;

    const lastRead = readingHistory[readingHistory.length - 1];
    return lastRead.lastReadAt;
  }, [readingHistory]);

  /**
   * Build notification scheduler context
   */
  const buildContext = useCallback((): NotificationSchedulerContext => {
    return {
      settings: notificationSettings,
      progress: {
        chapters: Array.from(completedChapters),
        totalRead: readingHistory.length,
      },
      currentStreak: streak.currentStreak,
      lastReadDate: getLastReadDate(),
      currentChapter: Math.min(18, (completedChapters.size || 0) + 1),
      chapters: getChapters(),
    };
  }, [notificationSettings, completedChapters, readingHistory, streak, getLastReadDate]);

  /**
   * Handle notification scheduling on app startup and foreground
   */
  const scheduleNotificationsForCurrentState = useCallback(async () => {
    const context = buildContext();

    // Schedule based on notification settings
    if (context.settings.enabled) {
      // Schedule daily reminders (morning, midday, evening)
      await scheduleDailyReminders(context);

      // If streak is active and user hasn't read yet, prepare streak-risk warning
      if (context.currentStreak > 0) {
        await scheduleStreakRiskNotification(context);
      }
    }
  }, [buildContext]);

  /**
   * Handle app state changes (foreground/background)
   */
  const handleAppStateChange = useCallback((state: AppStateStatus) => {
    if (state === "active") {
      // App has come to foreground, reschedule if needed
      scheduleNotificationsForCurrentState();
    }
  }, [scheduleNotificationsForCurrentState]);

  /**
   * Initialize notification scheduler on mount
   */
  useEffect(() => {
    // Schedule notifications when component mounts
    scheduleNotificationsForCurrentState();

    // Listen for app state changes
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [scheduleNotificationsForCurrentState, handleAppStateChange]);

  /**
   * Re-schedule when notification settings change
   */
  useEffect(() => {
    const context = buildContext();
    rescheduleNotifications(context);
  }, [notificationSettings, buildContext]);

  /**
   * Return functions for manual notification triggers
   */
  return {
    /**
     * Call after user completes chapter
     */
    onChapterComplete: async (chapterNum: number) => {
      const context = buildContext();
      await scheduleCompletionNotification(context, chapterNum);
    },

    /**
     * Call when user unlocks a milestone/badge
     */
    onMilestoneUnlocked: async (description: string) => {
      const context = buildContext();
      await scheduleMilestoneNotification(context, description);
    },

    /**
     * Manually reschedule all notifications
     */
    rescheduleAll: async () => {
      const context = buildContext();
      await rescheduleNotifications(context);
    },
  };
}
