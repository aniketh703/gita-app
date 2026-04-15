/**
 * Notification Service
 * Manages daily notification scheduling and delivery for engagement and habit-building.
 *
 * Notification Types:
 * - Morning (6-9am): Motivational wisdom quote
 * - Midday (12-2pm): Mindfulness moment
 * - Evening (6-8pm): Streak encouragement
 * - Streak at Risk (8pm): Warning if no reading that day
 * - Milestone Achieved: Badge/reward notifications
 * - Chapter Complete: Progression celebration
 */

import type { DeepLinkPayload } from "@/src/navigation/routes";
import Constants from "expo-constants";
import type * as ExpoNotifications from "expo-notifications";

type NotificationsModule = typeof import("expo-notifications");

let notificationsModule: NotificationsModule | null | undefined;
let notificationsModulePromise: Promise<NotificationsModule | null> | null = null;
let hasWarnedExpoGo = false;

function isExpoGo(): boolean {
  return Constants.appOwnership === "expo";
}

async function getNotificationsModule(): Promise<NotificationsModule | null> {
  if (isExpoGo()) {
    if (!hasWarnedExpoGo) {
      hasWarnedExpoGo = true;
      console.warn(
        "Notifications are disabled in Expo Go. Use a development build to test full expo-notifications functionality.",
      );
    }
    return null;
  }

  if (notificationsModule !== undefined) {
    return notificationsModule;
  }

  if (!notificationsModulePromise) {
    notificationsModulePromise = import("expo-notifications")
      .then((mod) => {
        notificationsModule = mod;
        return mod;
      })
      .catch((error) => {
        console.error("Failed to load expo-notifications module:", error);
        notificationsModule = null;
        return null;
      });
  }

  return notificationsModulePromise;
}

export type NotificationType =
  | "morning"
  | "midday"
  | "evening"
  | "streak_risk"
  | "milestone"
  | "chapter_complete";

export interface NotificationTemplate {
  title: string;
  body: string;
  deepLink?: DeepLinkPayload;
  scheduleTime?: { hour: number; minute: number };
}

/**
 * Notification template definitions with dynamic field interpolation
 */
export const NOTIFICATION_TEMPLATES: Record<NotificationType, NotificationTemplate> = {
  morning: {
    title: "🌅 Begin with Clarity",
    body: "Let right deeds be thy motive, not the fruit which comes from them. — BG 2.47",
    deepLink: { screen: "home" },
    scheduleTime: { hour: 6, minute: 30 },
  },
  midday: {
    title: "🕉 A Moment of Stillness",
    body: "Amid the chaos of the day, Arjuna found his answer. So can you. Read today's verse.",
    deepLink: { screen: "reading", chapter: 1 },
    scheduleTime: { hour: 12, minute: 30 },
  },
  evening: {
    title: "🔥 Your Streak Awaits",
    body: "Day {streak_count} — You've come so far. One verse to keep the flame alive.",
    deepLink: { screen: "reading", chapter: 1 },
    scheduleTime: { hour: 18, minute: 0 },
  },
  streak_risk: {
    title: "⚠️ Your Streak is in Danger!",
    body: "{streak_count}-day streak. Miss today and it resets. 2 minutes is all it takes.",
    deepLink: { screen: "reading", chapter: 1 },
    scheduleTime: { hour: 20, minute: 0 },
  },
  milestone: {
    title: "🏆 You Did It!",
    body: "{milestone_description}",
    deepLink: { screen: "badges" },
  },
  chapter_complete: {
    title: "📖 Chapter {chapter_num} Done!",
    body: "You've completed {chapter_name}. Earned 25 Coins. What does Chapter {next_chapter} hold?",
    deepLink: { screen: "chapters" },
  },
};

/**
 * Interpolate dynamic fields in notification template
 */
export function interpolateTemplate(
  template: NotificationTemplate,
  context: Record<string, string | number>,
): NotificationTemplate {
  let { title, body } = template;

  Object.entries(context).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    title = title.replace(new RegExp(placeholder, "g"), String(value));
    body = body.replace(new RegExp(placeholder, "g"), String(value));
  });

  return { ...template, title, body };
}

/**
 * Schedule a notification for a given time
 */
export async function scheduleNotification(
  template: NotificationTemplate,
  delayMs: number = 0,
): Promise<string | null> {
  try {
    const Notifications = await getNotificationsModule();
    if (!Notifications) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: template.title,
        body: template.body,
        data: {
          deepLink: JSON.stringify(template.deepLink || { screen: "home" }),
        },
      },
      trigger: {
        seconds: Math.max(1, Math.floor(delayMs / 1000)),
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        repeats: false,
      },
    });

    return notificationId;
  } catch (error) {
    console.error("Failed to schedule notification:", error);
    return null;
  }
}

/**
 * Schedule a notification at a specific time of day
 */
export async function scheduleNotificationAtTime(
  template: NotificationTemplate,
  hour: number,
  minute: number,
): Promise<string | null> {
  try {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delayMs = scheduledTime.getTime() - now.getTime();

    return scheduleNotification(template, delayMs);
  } catch (error) {
    console.error("Failed to schedule time-based notification:", error);
    return null;
  }
}

/**
 * Cancel a scheduled notification by ID
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    const Notifications = await getNotificationsModule();
    if (!Notifications) {
      return;
    }

    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Failed to cancel notification:", error);
  }
}

/**
 * Cancel all scheduled notifications of a given type
 */
export async function cancelNotificationsByType(type: NotificationType): Promise<void> {
  try {
    const Notifications = await getNotificationsModule();
    if (!Notifications) {
      return;
    }

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter(
      (n) => (n.content.data as Record<string, unknown> | undefined)?.type === type,
    );

    for (const notification of toCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  } catch (error) {
    console.error("Failed to cancel notifications by type:", error);
  }
}

/**
 * Get count of scheduled non-milestone notifications today
 */
export async function getScheduledNotificationCountToday(): Promise<number> {
  try {
    const Notifications = await getNotificationsModule();
    if (!Notifications) {
      return 0;
    }

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.filter(
      (n) => (n.content.data as Record<string, unknown> | undefined)?.type !== "milestone",
    ).length;
  } catch (error) {
    console.error("Failed to get scheduled notifications:", error);
    return 0;
  }
}

/**
 * Check if user has read today for streak-risk condition
 */
export function hasUserReadToday(lastReadDate: string | null): boolean {
  if (!lastReadDate) return false;

  const lastRead = new Date(lastReadDate);
  const today = new Date();

  return (
    lastRead.getFullYear() === today.getFullYear() &&
    lastRead.getMonth() === today.getMonth() &&
    lastRead.getDate() === today.getDate()
  );
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const Notifications = await getNotificationsModule();
    if (!Notifications) {
      return false;
    }

    const permission = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowCriticalAlerts: false,
      },
    });

    return permission.granted;
  } catch (error) {
    console.error("Failed to request notification permissions:", error);
    return false;
  }
}

/**
 * Default notification handler setup
 */
export async function setupNotificationListeners(
  onNotificationReceived?: (notification: ExpoNotifications.Notification) => void,
  onNotificationResponse?: (response: ExpoNotifications.NotificationResponse) => void,
): Promise<ExpoNotifications.EventSubscription[]> {
  const subscriptions: ExpoNotifications.EventSubscription[] = [];
  const Notifications = await getNotificationsModule();

  if (!Notifications) {
    return subscriptions;
  }

  // Handle notification received while app is in foreground
  if (onNotificationReceived) {
    subscriptions.push(
      Notifications.addNotificationReceivedListener(onNotificationReceived),
    );
  }

  // Handle user interaction with notification (tap)
  if (onNotificationResponse) {
    subscriptions.push(
      Notifications.addNotificationResponseReceivedListener(onNotificationResponse),
    );
  }

  return subscriptions;
}
