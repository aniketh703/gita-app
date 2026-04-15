import type { ThemePalette } from "@/constants/colors";
import { fontSize, fontWeight } from "@/constants/typography";

export function getStandardHeaderOptions(colors: ThemePalette) {
  return {
    headerStyle: {
      backgroundColor: colors.bg,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: fontWeight.bold,
      fontSize: fontSize.lg,
    },
  };
}
