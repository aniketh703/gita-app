/**
 * Review Trigger System
 * Shows review prompt after user reads N verses
 * Based on: Rule #12 (Review Trigger)
 */

import { useAppStore } from "@/src/store/appStore";
import * as StoreReview from "expo-store-review";
import { useCallback, useEffect, useState } from "react";

interface ReviewTriggerConfig {
  versesThreshold: number; // Show prompt after reading N verses
  daysThreshold: number; // Show prompt after N days of usage
  showFrequency: "once" | "always" | "multiple"; // Configuration for when to show
  maxPromptsPerSession: number;
}

const DEFAULT_CONFIG: ReviewTriggerConfig = {
  versesThreshold: 5, // After 5 verses
  daysThreshold: 1, // After 1 day
  showFrequency: "once",
  maxPromptsPerSession: 1,
};

/**
 * Hook to manage review trigger
 */
export function useReviewTrigger(config: Partial<ReviewTriggerConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { ratingState, updateRatingState } = useAppStore();

  const [shouldShowReview, setShouldShowReview] = useState(false);

  const checkReviewEligibility = useCallback(() => {
    // Don't show if already rated
    if (ratingState?.hasRated) {
      return;
    }

    // Don't show if too many prompts already shown
    if ((ratingState?.promptsShown || 0) >= finalConfig.maxPromptsPerSession) {
      return;
    }

    // Check verses threshold
    const versesRead = ratingState?.slokasReadSinceLastPrompt || 0;
    if (versesRead >= finalConfig.versesThreshold) {
      setShouldShowReview(true);
      return;
    }

    // Check days threshold
    if (ratingState?.lastPromptDate) {
      const lastPrompt = new Date(ratingState.lastPromptDate);
      const daysSincePrompt = Math.floor(
        (Date.now() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSincePrompt >= finalConfig.daysThreshold) {
        setShouldShowReview(true);
      }
    }
  }, [
    finalConfig.daysThreshold,
    finalConfig.maxPromptsPerSession,
    finalConfig.versesThreshold,
    ratingState?.hasRated,
    ratingState?.lastPromptDate,
    ratingState?.promptsShown,
    ratingState?.slokasReadSinceLastPrompt,
  ]);

  useEffect(() => {
    checkReviewEligibility();
  }, [checkReviewEligibility]);

  const handleShowReview = async () => {
    updateRatingState({
      promptsShown: (ratingState?.promptsShown || 0) + 1,
      lastPromptDate: new Date().toISOString(),
      slokasReadSinceLastPrompt: 0,
    });

    // Show native app review dialog if available
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
    }

    setShouldShowReview(false);
  };

  const handleDismiss = () => {
    setShouldShowReview(false);
  };

  return {
    shouldShowReview,
    handleShowReview,
    handleDismiss,
  };
}

/**
 * Review Trigger Content - Different messages based on context
 */
export const REVIEW_MESSAGES = {
  encourage: {
    title: "You're Building a Beautiful Habit!",
    message:
      "You've read several verses of the Gita. Would you like to rate this app to help others discover it?",
    primaryAction: "⭐ Rate Us",
    secondaryAction: "Maybe Later",
  },
  wisdom: {
    title: "Sharing Wisdom",
    message:
      "Thank you for exploring the Bhagavad Gita with us. Your support helps us improve this app.",
    primaryAction: "⭐ Rate Us",
    secondaryAction: "Not Now",
  },
  habit: {
    title: "Daily Practice Recognized",
    message:
      "You're showing consistent dedication to your spiritual practice. Help others join this journey.",
    primaryAction: "⭐ Rate Us",
    secondaryAction: "Later",
  },
};

export type ReviewMessageType = keyof typeof REVIEW_MESSAGES;

/**
 * Utility function to get appropriate review message based on context
 */
export function getReviewMessage(
  versesRead: number,
  daysActive: number,
): ReviewMessageType {
  if (daysActive > 7) return "habit";
  if (versesRead > 20) return "wisdom";
  return "encourage";
}
