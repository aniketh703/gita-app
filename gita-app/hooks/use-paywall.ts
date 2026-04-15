/**
 * usePaywall Hook
 * Convenient way to show paywall from any screen in the app
 * Provides paywall triggering and premium feature handling
 */

import { useAppStore } from "@/src/store/appStore";
import { useRouter } from "expo-router";

export function usePaywall() {
  const router = useRouter();
  const { isPremium, setPremium } = useAppStore();

  /**
   * Show paywall modal
   * @param reason - Optional reason for showing paywall (for analytics)
   */
  const showPaywall = (reason?: string) => {
    if (isPremium) {
      return; // User already has premium
    }
    router.push("/paywall");
  };

  /**
   * Check if user can use a feature, showing paywall if needed
   * @param featureName - Name of feature for logging
   * @returns true if user can use the feature, false if paywall was shown
   */
  const canUseFeature = (featureName: string): boolean => {
    if (isPremium) {
      return true;
    }
    // Show paywall with context
    showPaywall(featureName);
    return false;
  };

  /**
   * Handle premium purchase confirmation
   * Called when user successfully purchases premium
   */
  const handlePremiumPurchase = () => {
    setPremium(true);
    router.back(); // Close paywall modal
  };

  return {
    showPaywall,
    canUseFeature,
    handlePremiumPurchase,
    isPremium,
  };
}

/**
 * Hook to check if a specific theme can be used
 */
export function canUseThemeHook(themeId: string, isPremium: boolean): boolean {
  const freeThemes = ["light-default", "dark-default"];
  return freeThemes.includes(themeId) || isPremium;
}

/**
 * Hook for premium feature gating
 */
export function usePremiumFeatures() {
  const { isPremium } = useAppStore();
  const { showPaywall } = usePaywall();

  const requirePremium = (
    featureName: string,
    onSuccess?: () => void,
  ): boolean => {
    if (!isPremium) {
      showPaywall(featureName);
      return false;
    }
    onSuccess?.();
    return true;
  };

  const features = {
    // Theme features
    themesUnlocked: isPremium,
    premiumThemesCount: isPremium ? 4 : 0,

    // Audio features
    audioChantingEnabled: isPremium,
    audioSyncEnabled: isPremium,

    // Content features
    commentaryEnabled: isPremium,
    insightsEnabled: isPremium,
    advancedSearchEnabled: isPremium,

    // Customization
    customThemesEnabled: isPremium,
    fontCustomizationEnabled: isPremium,

    // Experience
    adFreeExperience: isPremium,
    offlineReadingEnabled: isPremium,
    bookmarkSyncEnabled: isPremium,
  };

  return {
    isPremium,
    features,
    requirePremium,
    showPaywall,
  };
}
