import { getColors } from "@/constants/colors";

/**
 * @deprecated Use useAppTheme() hook instead
 * This function is kept for backward compatibility.
 * It retrieves colors based on isDark flag.
 */
export const getOnboardingAestheticColors = (isDark: boolean) => {
  return getColors(isDark);
};
