/**
 * Theme Selector Component
 * Displays all available themes with previews and premium indicators
 * Allows users to preview and select themes (respecting premium access)
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppStore } from "@/src/store/appStore";
import { THEMES, canUseTheme, type ThemeId } from "@/src/utils/themesSystem";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";

interface ThemeSelectorProps {
  onThemeSelected?: (themeId: ThemeId) => void;
  compact?: boolean; // Show as horizontal scroll instead of grid
}

export function ThemeSelector({
  onThemeSelected,
  compact = false,
}: ThemeSelectorProps) {
  const { colors } = useAppTheme();
  const { selectedTheme, setSelectedTheme, isPremium } = useAppStore();

  const themeArray = Array.from(THEMES.entries()).map(([id, config]) => ({
    id: id as ThemeId,
    config,
    isPremium: !canUseTheme(id as ThemeId, isPremium),
  }));

  const handleThemeSelect = (themeId: ThemeId) => {
    if (!canUseTheme(themeId, isPremium)) {
      // Show paywall or upgrade prompt
      return;
    }
    setSelectedTheme(themeId);
    onThemeSelected?.(themeId);
  };

  const renderThemeCard = (theme: (typeof themeArray)[0], index: number) => {
    const isSelected = selectedTheme === theme.id;
    const isLocked = theme.isPremium && !isPremium;

    return (
      <Animated.View
        key={theme.id}
        entering={ZoomIn.delay(index * 50).duration(300)}
        style={{ flex: 1, marginRight: compact ? spacing.md : 0 }}
      >
        <TouchableOpacity
          style={[
            styles.themeCard,
            {
              backgroundColor: theme.config.colors.surface,
              borderColor: isSelected
                ? theme.config.colors.accent
                : colors.border,
              borderWidth: isSelected ? 3 : 1,
              opacity: isLocked ? 0.6 : 1,
              marginBottom: spacing.md,
            },
          ]}
          onPress={() => handleThemeSelect(theme.id)}
          disabled={isLocked}
        >
          {/* Color Preview Stripes */}
          <View style={styles.previewContainer}>
            <View
              style={[
                styles.colorStripe,
                { backgroundColor: theme.config.colors.accent },
              ]}
            />
            <View
              style={[
                styles.colorStripe,
                { backgroundColor: theme.config.colors.text },
              ]}
            />
            <View
              style={[
                styles.colorStripe,
                { backgroundColor: theme.config.colors.bg },
              ]}
            />
          </View>

          {/* Theme Name */}
          <View style={styles.themeInfo}>
            <Text
              style={[styles.themeName, { color: theme.config.colors.text }]}
              numberOfLines={1}
            >
              {formatThemeName(theme.id)}
            </Text>

            {/* Lock Badge for Premium */}
            {isLocked && (
              <View style={styles.lockContainer}>
                <MaterialIcons name="lock" size={12} color="#ffffff" />
              </View>
            )}

            {/* Premium Badge */}
            {theme.isPremium && (
              <View
                style={[
                  styles.premiumBadge,
                  { backgroundColor: theme.config.colors.accent },
                ]}
              >
                <Text style={styles.premiumText}>PRO</Text>
              </View>
            )}

            {/* Selection Checkmark */}
            {isSelected && (
              <View
                style={[
                  styles.checkmark,
                  { borderColor: theme.config.colors.accent },
                ]}
              >
                <MaterialIcons
                  name="check"
                  size={16}
                  color={theme.config.colors.accent}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={{ paddingHorizontal: compact ? 0 : spacing.lg }}>
      {compact ? (
        // Horizontal Scroll View
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingRight: spacing.xl,
          }}
          style={{ marginBottom: spacing.md }}
        >
          {themeArray.map((theme, index) => (
            <View key={theme.id} style={{ maxWidth: 120 }}>
              {renderThemeCard(theme, index)}
            </View>
          ))}
        </ScrollView>
      ) : (
        // Grid View
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: spacing.md,
            justifyContent: "space-between",
          }}
        >
          {themeArray.map((theme, index) => renderThemeCard(theme, index))}
        </View>
      )}

      {/* Upgrade Prompt */}
      {!isPremium && (
        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          style={{
            marginTop: spacing.lg,
            padding: spacing.md,
            borderRadius: radius.lg,
            backgroundColor: colors.accentSoft,
            borderLeftWidth: 4,
            borderLeftColor: colors.accent,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
            }}
          >
            <MaterialIcons name="diamond" size={16} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.accent,
                  fontSize: fontSize.sm,
                  fontWeight: fontWeight.semibold,
                }}
              >
                Unlock Premium Themes
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: fontSize.xs,
                  marginTop: spacing.xs / 2,
                }}
              >
                Get 4 exclusive themes with premium access
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

/**
 * Theme Preview Card Component (used in PaywallNavigator)
 */
interface ThemePreviewCardProps {
  themeId: ThemeId;
  compact?: boolean;
}

export function ThemePreviewCard({
  themeId,
  compact = false,
}: ThemePreviewCardProps) {
  const theme = THEMES.get(themeId);
  if (!theme) return null;

  return (
    <View
      style={[styles.previewCard, { backgroundColor: theme.colors.surface }]}
    >
      {/* Theme Gradient Preview */}
      <View
        style={[
          styles.gradientPreview,
          { backgroundColor: theme.colors.accent + "20" },
        ]}
      >
        <View style={styles.colorGrid}>
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.accent },
            ]}
          />
          <View
            style={[styles.colorSwatch, { backgroundColor: theme.colors.text }]}
          />
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: theme.colors.textSecondary },
            ]}
          />
        </View>

        {compact ? (
          <Text
            style={{
              color: theme.colors.text,
              fontSize: fontSize.xs,
              fontWeight: fontWeight.semibold,
              marginTop: spacing.xs,
            }}
          >
            {formatThemeName(themeId)}
          </Text>
        ) : (
          <>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: fontSize.sm,
                fontWeight: fontWeight.bold,
                marginTop: spacing.md,
              }}
            >
              {formatThemeName(themeId)}
            </Text>
            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: fontSize.xs,
                marginTop: spacing.xs,
                marginBottom: spacing.sm,
              }}
            >
              Preview of this theme’s colors and styling
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

// ==================== Utility Functions ====================

function formatThemeName(themeId: ThemeId): string {
  const names: Record<ThemeId, string> = {
    "light-default": "Light Default",
    "dark-default": "Dark Default",
    "temple-classic": "Temple Classic",
    "minimal-dark": "Minimal Dark",
    "golden-sanskrit": "Golden Sanskrit",
    "lotus-meditation": "Lotus",
    "himalayan-calm": "Himalayan",
  };
  return names[themeId];
}

const styles = StyleSheet.create({
  themeCard: {
    borderRadius: radius.lg,
    overflow: "hidden",
    paddingBottom: spacing.sm,
    justifyContent: "space-between",
    minHeight: 140,
  },
  previewContainer: {
    flexDirection: "row",
    height: 80,
  },
  colorStripe: {
    flex: 1,
    height: 80,
  },
  themeInfo: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    justifyContent: "center",
    position: "relative",
  },
  themeName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textAlign: "center",
  },
  lockContainer: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: radius.full,
    padding: 4,
  },
  premiumBadge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: fontWeight.bold,
  },
  checkmark: {
    position: "absolute",
    bottom: spacing.xs,
    right: spacing.xs,
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  previewCard: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  gradientPreview: {
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
  },
  colorGrid: {
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
  },
});
