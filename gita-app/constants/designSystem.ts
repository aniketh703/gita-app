/**
 * Unified Design System
 * Single source of truth for all design tokens
 * Re-exports from individual constant files for easier consumption
 */

// ============================================================================
// COLORS
// ============================================================================

export {
    COLORS_DARK, COLORS_LIGHT,
    COLORS_SEPIA, THEME_COLORS, getColors, getColorsByTheme, type ResolvedTheme,
    type ThemePalette
} from "./colors";

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    textStyles
} from "./typography";

// ============================================================================
// SPACING & LAYOUT
// ============================================================================

export { layout, radius, spacing } from "./spacing";

