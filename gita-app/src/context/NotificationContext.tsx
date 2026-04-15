/**
 * Notification Provider
 * Combines notification initialization and scheduling
 * Should be placed in the root layout
 */

import React, { createContext, ReactNode, useContext } from "react";
import { useNotificationInitializer } from "@/src/hooks/useNotificationInitializer";
import { useNotificationScheduler } from "@/src/hooks/useNotificationScheduler";

interface NotificationContextType {
  onChapterComplete: (chapterNum: number) => Promise<void>;
  onMilestoneUnlocked: (description: string) => Promise<void>;
  rescheduleAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * NotificationProvider component
 * Initializes notifications and provides context for scheduling
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  // Initialize notification listeners and permissions
  useNotificationInitializer();

  // Setup notification scheduler and get trigger functions
  const {
    onChapterComplete,
    onMilestoneUnlocked,
    rescheduleAll,
  } = useNotificationScheduler();

  const value: NotificationContextType = {
    onChapterComplete,
    onMilestoneUnlocked,
    rescheduleAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Hook to access notification functions
 */
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
