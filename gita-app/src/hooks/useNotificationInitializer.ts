/**
 * Hook to initialize and manage notifications in the app
 * Handles permission requests, listener setup, and deep-link navigation
 */

import { useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import type * as Notifications from "expo-notifications";
import {
  requestNotificationPermissions,
  setupNotificationListeners,
} from "@/src/services/notificationService";

export function useNotificationInitializer() {
  const router = useRouter();

  /**
   * Handle notification tap/response
   */
  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const deepLink = response.notification.request.content.data.deepLink;

      if (deepLink) {
        try {
          const payload = JSON.parse(String(deepLink));
          navigateToDeepLink(router, payload);
        } catch (error) {
          console.error("Failed to parse deepLink from notification:", error);
        }
      }
    },
    [router],
  );

  /**
   * Handle notification received while app is in foreground
   */
  const handleNotificationReceived = useCallback((notification: Notifications.Notification) => {
    // In foreground, we might show a custom banner or just let it show
    // For now, we'll just log it
    console.log("Notification received:", notification.request.content.title);
  }, []);

  useEffect(() => {
    let active = true;
    let subscriptions: Notifications.EventSubscription[] = [];

    // Request permissions on first load
    requestNotificationPermissions().catch(console.error);

    // Setup notification listeners
    setupNotificationListeners(
      handleNotificationReceived,
      handleNotificationResponse,
    )
      .then((subs) => {
        if (active) {
          subscriptions = subs;
        } else {
          subs.forEach((subscription) => subscription.remove());
        }
      })
      .catch(console.error);

    // Cleanup
    return () => {
      active = false;
      subscriptions.forEach((subscription) => {
        subscription.remove();
      });
    };
  }, [handleNotificationReceived, handleNotificationResponse]);
}

/**
 * Navigate to deep link from notification
 */
function navigateToDeepLink(
  router: ReturnType<typeof useRouter>,
  payload: Record<string, any>,
): void {
  const { screen, ...params } = payload;

  if (!screen) {
    router.push("/");
    return;
  }

  // Map screen names to routes
  const screenToRoute: Record<string, Href> = {
    home: "/",
    reading: "/home",
    chapters: "/home",
    badges: "/badges",
    settings: "/settings",
  };

  const route = screenToRoute[screen];
  if (!route) {
    console.warn(`Unknown screen in deepLink: ${screen}`);
    router.push("/");
    return;
  }

  // Route-only navigation keeps notification taps type-safe in Expo Router.
  void params;
  router.push(route);
}
