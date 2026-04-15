/**
 * Premium Themes System
 * Monetization through beautiful, customizable themes
 * Based on: Theme monetization + gamification
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppStore } from "@/src/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export type PremiumThemeId =
  | "classic-temple"
  | "minimal-dark"
  | "golden-sanskrit"
  | "lotus-meditation"
  | "himalayan-calm";

export interface PremiumTheme {
  id: PremiumThemeId;
  name: string;
  description: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  premium: boolean;
}

export const PREMIUM_THEMES: PremiumTheme[] = [
  {
    id: "classic-temple",
    name: "Classic Temple",
    description: "Traditional temple aesthetics with warm gold tones",
    icon: "temple-buddhist",
    colors: {
      primary: "#c9a961",
      secondary: "#8b7355",
      accent: "#d4af37",
      background: "#f5f1e8",
      surface: "#e8e1d5",
    },
    premium: false, // Free theme
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    description: "Clean, distraction-free dark theme for night reading",
    icon: "nights-stay",
    colors: {
      primary: "#1a1a1a",
      secondary: "#333333",
      accent: "#60a5fa",
      background: "#0f0f0f",
      surface: "#1f1f1f",
    },
    premium: false,
  },
  {
    id: "golden-sanskrit",
    name: "Golden Sanskrit",
    description: "Luxurious gold theme with Sanskrit script aesthetics",
    icon: "auto-awesome",
    colors: {
      primary: "#2d2416",
      secondary: "#8b7355",
      accent: "#ffd700",
      background: "#f4e4c1",
      surface: "#f9f5ef",
    },
    premium: true,
  },
  {
    id: "lotus-meditation",
    name: "Lotus Meditation",
    description: "Serene pink and purple meditation-inspired theme",
    icon: "favorite",
    colors: {
      primary: "#3e2b4d",
      secondary: "#5a3d6b",
      accent: "#e879a4",
      background: "#f5e8f0",
      surface: "#f0e4ea",
    },
    premium: true,
  },
  {
    id: "himalayan-calm",
    name: "Himalayan Calm",
    description: "Mountain-inspired blues for peaceful reading",
    icon: "landscape",
    colors: {
      primary: "#1a3a4d",
      secondary: "#3a5c7d",
      accent: "#5b9fc6",
      background: "#e8f1f7",
      surface: "#dce8f0",
    },
    premium: true,
  },
];

interface PremiumThemesScreenProps {
  onThemeSelect?: (themeId: PremiumThemeId) => void;
  currentTheme?: PremiumThemeId;
}

export function PremiumThemesScreen({
  onThemeSelect,
  currentTheme,
}: PremiumThemesScreenProps) {
  const { colors } = useAppTheme();
  const { isPremium } = useAppStore();
  const purchasedThemes: PremiumThemeId[] = [];
  const [selectedTheme, setSelectedTheme] = useState<PremiumThemeId | null>(
    currentTheme || null,
  );
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [pendingTheme, setPendingTheme] = useState<PremiumTheme | null>(null);

  const handleThemeSelect = (theme: PremiumTheme) => {
    // If it's a premium theme and user doesn't have premium or hasn't purchased it
    if (theme.premium && !isPremium && !purchasedThemes?.includes(theme.id)) {
      setPendingTheme(theme);
      setShowPurchaseModal(true);
      return;
    }

    setSelectedTheme(theme.id);
    if (onThemeSelect) {
      onThemeSelect(theme.id);
    }
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(600)}>
          <Text style={[styles.title, { color: colors.text }]}>
            Choose Your Theme
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Customize your reading experience
          </Text>
        </Animated.View>

        {/* Themes Grid */}
        <View style={styles.themesGrid}>
          {PREMIUM_THEMES.map((theme, index) => {
            const isSelected = selectedTheme === theme.id;
            const isLocked =
              theme.premium &&
              !isPremium &&
              !purchasedThemes?.includes(theme.id);

            return (
              <Animated.View
                key={theme.id}
                entering={FadeInDown.delay(200 + index * 100).duration(600)}
                style={{ width: "48%" }}
              >
                <TouchableOpacity
                  style={[
                    styles.themeCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: isSelected
                        ? theme.colors.accent
                        : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      opacity: isLocked ? 0.6 : 1,
                    },
                  ]}
                  onPress={() => handleThemeSelect(theme)}
                  disabled={isLocked}
                  activeOpacity={0.7}
                >
                  {/* Theme Preview */}
                  <View
                    style={[
                      styles.themePreview,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.accent,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.previewIcon,
                        { backgroundColor: theme.colors.primary + "30" },
                      ]}
                    >
                      <MaterialIcons
                        name={theme.icon as any}
                        size={28}
                        color={theme.colors.accent}
                      />
                    </View>
                  </View>

                  {/* Theme Name */}
                  <Text
                    style={[styles.themeName, { color: theme.colors.primary }]}
                  >
                    {theme.name}
                  </Text>

                  {/* Theme Description */}
                  <Text
                    style={[
                      styles.themeDescription,
                      { color: theme.colors.secondary },
                    ]}
                    numberOfLines={2}
                  >
                    {theme.description}
                  </Text>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <View
                      style={[
                        styles.selectedBadge,
                        { backgroundColor: theme.colors.accent },
                      ]}
                    >
                      <MaterialIcons name="check" size={16} color="#ffffff" />
                    </View>
                  )}

                  {/* Premium Badge */}
                  {theme.premium && (
                    <View
                      style={[
                        styles.premiumBadge,
                        {
                          backgroundColor: theme.colors.accent,
                        },
                      ]}
                    >
                      <Text style={styles.premiumBadgeText}>PRO</Text>
                    </View>
                  )}

                  {/* Lock Icon for Locked Premium Themes */}
                  {isLocked && (
                    <View style={styles.lockOverlay}>
                      <MaterialIcons name="lock" size={32} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Info Text */}
        <Animated.Text
          entering={FadeInDown.delay(800).duration(600)}
          style={[styles.infoText, { color: colors.textSecondary }]}
        >
          Premium themes are included with Premium subscription
        </Animated.Text>
      </ScrollView>

      {/* Purchase Modal */}
      {showPurchaseModal && pendingTheme && (
        <ThemePurchaseModal
          theme={pendingTheme}
          visible={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setPendingTheme(null);
          }}
        />
      )}
    </>
  );
}

// ==================== Purchase Modal ====================

interface ThemePurchaseModalProps {
  theme: PremiumTheme;
  visible: boolean;
  onClose: () => void;
}

function ThemePurchaseModal({
  theme,
  visible,
  onClose,
}: ThemePurchaseModalProps) {
  const { colors } = useAppTheme();
  const { setPremium } = useAppStore();

  return visible ? (
    <View
      style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
    >
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={[styles.modalContent, { backgroundColor: colors.surface }]}
      >
        {/* Close Button */}
        <TouchableOpacity style={styles.modalClose} onPress={onClose}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>

        {/* Theme Preview */}
        <View
          style={[
            styles.modalPreview,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <MaterialIcons
            name={theme.icon as any}
            size={64}
            color={theme.colors.accent}
          />
        </View>

        {/* Content */}
        <Text style={[styles.modalTitle, { color: colors.text }]}>
          {theme.name}
        </Text>
        <Text
          style={[styles.modalDescription, { color: colors.textSecondary }]}
        >
          {theme.description}
        </Text>

        {/* Price */}
        <View
          style={[
            styles.priceBox,
            {
              backgroundColor: theme.colors.primary + "10",
              borderColor: theme.colors.accent,
            },
          ]}
        >
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
            Premium Subscribers Get
          </Text>
          <Text style={[styles.priceValue, { color: theme.colors.accent }]}>
            This Theme
          </Text>
          <Text
            style={[styles.priceDescription, { color: colors.textSecondary }]}
          >
            ₹999/year or ₹199/month
          </Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: theme.colors.accent }]}
          onPress={() => {
            setPremium(true);
            onClose();
          }}
        >
          <Text style={styles.modalButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modalSecondaryButton} onPress={onClose}>
          <Text
            style={[styles.modalSecondaryButtonText, { color: colors.text }]}
          >
            Close
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  themesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
    justifyContent: "space-between",
  },
  themeCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    position: "relative",
  },
  themePreview: {
    height: 100,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  previewIcon: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  themeName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs / 2,
  },
  themeDescription: {
    fontSize: fontSize.xs + 1,
    lineHeight: 16,
  },
  selectedBadge: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  premiumBadge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },
  premiumBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: fontSize.sm,
    textAlign: "center",
    fontStyle: "italic",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    width: "85%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    padding: spacing.xs,
  },
  modalPreview: {
    width: 120,
    height: 120,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  modalDescription: {
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  priceBox: {
    width: "100%",
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: fontSize.xs + 1,
    marginBottom: spacing.xs / 2,
  },
  priceValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  priceDescription: {
    fontSize: fontSize.sm,
  },
  modalButton: {
    width: "100%",
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  modalButtonText: {
    color: "#ffffff",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  modalSecondaryButton: {
    width: "100%",
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  modalSecondaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});
