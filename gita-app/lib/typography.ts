import { PixelRatio, TextStyle } from "react-native";

export type TextRole =
  | "caption"
  | "body"
  | "bodyLarge"
  | "title"
  | "heading"
  | "sanskrit";

type RoleConfig = {
  sizeFactor: number;
  lineHeight: number;
  maxScale: number;
  weight?: TextStyle["fontWeight"];
};

const ROLE_CONFIG: Record<TextRole, RoleConfig> = {
  caption: { sizeFactor: 0.8, lineHeight: 1.35, maxScale: 1.2, weight: "500" },
  body: { sizeFactor: 1, lineHeight: 1.55, maxScale: 1.35 },
  bodyLarge: { sizeFactor: 1.1, lineHeight: 1.6, maxScale: 1.3 },
  title: { sizeFactor: 1.4, lineHeight: 1.3, maxScale: 1.25, weight: "600" },
  heading: { sizeFactor: 1.65, lineHeight: 1.2, maxScale: 1.2, weight: "700" },
  sanskrit: { sizeFactor: 1.15, lineHeight: 1.75, maxScale: 1.4 },
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getFontScaleClamped(maxScale = 1.35): number {
  const raw = PixelRatio.getFontScale();
  return clamp(raw, 1, maxScale);
}

export function getScaledTextStyle(
  baseFontSize: number,
  role: TextRole,
): Pick<TextStyle, "fontSize" | "lineHeight" | "fontWeight"> {
  const config = ROLE_CONFIG[role];
  const roleBase = baseFontSize * config.sizeFactor;
  const scale = getFontScaleClamped(config.maxScale);
  const fontSize = Math.round(roleBase * scale);
  const lineHeight = Math.round(fontSize * config.lineHeight);

  return {
    fontSize,
    lineHeight,
    fontWeight: config.weight,
  };
}

export type TypographyScale = ReturnType<typeof createTypography>;

export function createTypography(baseFontSize: number) {
  return {
    caption: getScaledTextStyle(baseFontSize, "caption"),
    body: getScaledTextStyle(baseFontSize, "body"),
    bodyLarge: getScaledTextStyle(baseFontSize, "bodyLarge"),
    title: getScaledTextStyle(baseFontSize, "title"),
    heading: getScaledTextStyle(baseFontSize, "heading"),
    sanskrit: getScaledTextStyle(baseFontSize, "sanskrit"),
  };
}
