/**
 * Notification Scheduler
 * Manages notification scheduling logic based on user preferences and engagement state.
 *
 * Rules:
 * - Only one non-milestone notification per day (except streak-risk at 8pm)
 * - Morning, midday, evening, and chapter-complete are mutually exclusive
 * - Streak-risk only fires if user hasn't read by 8pm and has active streak
 * - Milestone notifications can fire anytime
 */

import {
  NOTIFICATION_TEMPLATES,
  interpolateTemplate,
  scheduleNotificationAtTime,
  cancelNotificationsByType,
  scheduleNotification,
  getScheduledNotificationCountToday,
  hasUserReadToday,
  type NotificationType,
} from "@/src/services/notificationService";
import type { NotificationSettings } from "@/src/store/appStore";

type UserProgress = {
  chapters: number[];
  totalRead: number;
};

export interface NotificationSchedulerContext {
  settings: NotificationSettings;
  progress: UserProgress;
  currentStreak: number;
  lastReadDate: string | null;
  currentChapter?: number;
  chapters?: any[];
}

/**
 * Determine which single daily notification should be sent
 */
async function selectDailyNotification(
  context: NotificationSchedulerContext,
): Promise<NotificationType | null> {
  // If user has already read today, don't send any reminder notifications
  if (hasUserReadToday(context.lastReadDate)) {
    return null;
  }

  // Check how many non-milestone notifications are already scheduled
  const scheduledCount = await getScheduledNotificationCountToday();
  if (scheduledCount > 0) {
    return null; // Already have a daily notification scheduled
  }

  // Determine which notification to send based on time of day and user preference
  const now = new Date();
  const hour = now.getHours();

  // Morning: 6am-9am
  if (hour >= 6 && hour < 9 && context.settings.enabled && context.settings.time === "morning") {
    return "morning";
  }

  // Midday: 12pm-2pm
  if (hour >= 12 && hour < 14 && context.settings.enabled && context.settings.time === "midday") {
    return "midday";
  }

  // Evening: 6pm-8pm (before streak-risk window)
  if (hour >= 18 && hour < 20 && context.settings.enabled && context.settings.time === "evening") {
    return "evening";
  }

  // Streak-risk: 8pm or later (if streak is active and at risk)
  if (hour >= 20 && context.currentStreak > 0 && context.settings.enabled) {
    return "streak_risk";
  }

  return null;
}

/**
 * Schedule daily reminder notifications based on user settings and state
 */
export async function scheduleDailyReminders(
  context: NotificationSchedulerContext,
): Promise<void> {
  // Only schedule if notifications are enabled
  if (!context.settings.enabled) {
    return;
  }

  const templateType = await selectDailyNotification(context);
  if (!templateType) {
    return;
  }

  const template = NOTIFICATION_TEMPLATES[templateType];
  const interpolated = interpolateTemplate(template, {
    streak_count: context.currentStreak,
  });

  if (template.scheduleTime) {
    scheduleNotificationAtTime(
      interpolated,
      template.scheduleTime.hour,
      template.scheduleTime.minute,
    );
  }
}

/**
 * Schedule notifications for reading activity
 * Called when user completes reading a verse/chapter
 */
export async function scheduleCompletionNotification(
  context: NotificationSchedulerContext,
  chapterNum: number,
): Promise<void> {
  if (!context.settings.enabled) {
    return;
  }

  // Cancel any pending streak-risk notification (user read, streak is safe)
  await cancelNotificationsByType("streak_risk");

  // For chapter completions, send a chapter_complete notification
  const template = NOTIFICATION_TEMPLATES.chapter_complete;
  const chapter = context.chapters?.[chapterNum - 1];
  const nextChapter = chapterNum < 18 ? chapterNum + 1 : 1;

  const interpolated = interpolateTemplate(template, {
    chapter_num: chapterNum,
    chapter_name: chapter?.name || `Chapter ${chapterNum}`,
    next_chapter: nextChapter,
  });

  // Schedule for 2 seconds delay (show after completion animation)
  scheduleNotification(interpolated, 2000);
}

/**
 * Schedule milestone/badge notification
 */
export async function scheduleMilestoneNotification(
  context: NotificationSchedulerContext,
  milestoneDescription: string,
): Promise<void> {
  if (!context.settings.enabled) {
    return;
  }

  const template = NOTIFICATION_TEMPLATES.milestone;
  const interpolated = interpolateTemplate(template, {
    milestone_description: milestoneDescription,
  });

  // Milestones should show immediately
  scheduleNotification(interpolated, 0);
}

/**
 * Handle streak-risk notification
 * Called at 8pm if user hasn't read yet that day and has an active streak
 */
export async function scheduleStreakRiskNotification(
  context: NotificationSchedulerContext,
): Promise<void> {
  if (!context.settings.enabled || context.currentStreak === 0) {
    return;
  }

  // Don't send if user already read today
  if (hasUserReadToday(context.lastReadDate)) {
    return;
  }

  const template = NOTIFICATION_TEMPLATES.streak_risk;
  const interpolated = interpolateTemplate(template, {
    streak_count: context.currentStreak,
  });

  // Schedule for 8pm
  scheduleNotificationAtTime(interpolated, 20, 0);
}

/**
 * Clear all scheduled notifications (for settings change or logout)
 */
export async function clearAllScheduledNotifications(): Promise<void> {
  const types: NotificationType[] = [
    "morning",
    "midday",
    "evening",
    "streak_risk",
    "milestone",
    "chapter_complete",
  ];

  for (const type of types) {
    await cancelNotificationsByType(type);
  }
}

/**
 * Reschedule notifications (called when settings change)
 */
export async function rescheduleNotifications(
  context: NotificationSchedulerContext,
): Promise<void> {
  // Clear existing notifications
  await clearAllScheduledNotifications();

  // Reschedule based on new settings
  if (context.settings.enabled) {
    scheduleDailyReminders(context);

    // If we're in the streak-risk window and user hasn't read, schedule that too
    if (context.currentStreak > 0 && !hasUserReadToday(context.lastReadDate)) {
      scheduleStreakRiskNotification(context);
    }
  }
}
