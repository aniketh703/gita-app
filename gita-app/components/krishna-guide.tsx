/**
 * Krishna Guide Component
 * Spiritual companion mascot that provides wisdom and guidance
 * Based on: Mascot monetization + gamification tactics
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppStore } from "@/src/store/appStore";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export type KrishnaMascotSkin =
  | "classic"
  | "warrior"
  | "meditative"
  | "minimalist";

interface KrishnaGuideProps {
  message: string;
  context?: "welcome" | "verse" | "reflection" | "encouragement";
  visible: boolean;
  onClose: () => void;
  showSkinSelector?: boolean;
}

export function KrishnaGuide({
  message,
  context = "welcome",
  visible,
  onClose,
  showSkinSelector = false,
}: KrishnaGuideProps) {
  const { colors } = useAppTheme();
  const { isPremium } = useAppStore();
  const [selectedSkin, setSelectedSkin] =
    useState<KrishnaMascotSkin>("classic");

  const mascotIcon = getMascotIcon(selectedSkin);
  const mascotColor = getMascotColor(selectedSkin, colors.accent);

  const skins: {
    id: KrishnaMascotSkin;
    label: string;
    icon: string;
    premium: boolean;
  }[] = [
    {
      id: "classic",
      label: "Classic Krishna",
      icon: "auto-awesome",
      premium: false,
    },
    { id: "warrior", label: "Warrior Krishna", icon: "shield", premium: true },
    {
      id: "meditative",
      label: "Meditative Krishna",
      icon: "self-improvement",
      premium: true,
    },
    { id: "minimalist", label: "Minimalist", icon: "circle", premium: true },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          entering={FadeInUp.duration(400)}
          style={[styles.container, { backgroundColor: colors.surface }]}
        >
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons
              name="close"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Mascot Icon */}
            <View style={styles.mascotContainer}>
              <Animated.View
                entering={FadeInDown.delay(200).duration(600)}
                style={[
                  styles.mascotCircle,
                  { backgroundColor: mascotColor + "20" },
                ]}
              >
                <MaterialIcons
                  name={mascotIcon as any}
                  size={64}
                  color={mascotColor}
                />
              </Animated.View>
            </View>

            {/* Context Title */}
            <Animated.Text
              entering={FadeInDown.delay(400).duration(600)}
              style={[styles.title, { color: colors.text }]}
            >
              {getContextTitle(context)}
            </Animated.Text>

            {/* Message */}
            <Animated.View entering={FadeInDown.delay(500).duration(600)}>
              <View
                style={[
                  styles.messageBox,
                  { backgroundColor: colors.bg, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.message, { color: colors.text }]}>
                  {message}
                </Text>
              </View>
            </Animated.View>

            {/* Skin Selector (Premium Feature) */}
            {showSkinSelector && (
              <Animated.View entering={FadeInDown.delay(600).duration(600)}>
                <Text
                  style={[styles.sectionTitle, { color: colors.textSecondary }]}
                >
                  Choose Your Guide&apos;s Appearance
                </Text>
                <View style={styles.skinsGrid}>
                  {skins.map((skin, index) => {
                    const isSelected = selectedSkin === skin.id;
                    const isLocked = skin.premium && !isPremium;

                    return (
                      <Animated.View
                        key={skin.id}
                        entering={FadeInDown.delay(700 + index * 100).duration(
                          600,
                        )}
                      >
                        <TouchableOpacity
                          style={[
                            styles.skinCard,
                            {
                              backgroundColor: isSelected
                                ? colors.accentSoft
                                : colors.bg,
                              borderColor: isSelected
                                ? colors.accent
                                : colors.border,
                              borderWidth: isSelected ? 2 : 1,
                              opacity: isLocked ? 0.6 : 1,
                            },
                          ]}
                          onPress={() => {
                            if (!isLocked) {
                              setSelectedSkin(skin.id);
                            }
                          }}
                          disabled={isLocked}
                        >
                          <MaterialIcons
                            name={skin.icon as any}
                            size={32}
                            color={isSelected ? colors.accent : colors.text}
                          />
                          <Text
                            style={[styles.skinLabel, { color: colors.text }]}
                          >
                            {skin.label}
                          </Text>
                          {isLocked && (
                            <View style={styles.lockBadge}>
                              <MaterialIcons
                                name="lock"
                                size={12}
                                color="#ffffff"
                              />
                            </View>
                          )}
                          {skin.premium && (
                            <View
                              style={[
                                styles.premiumBadge,
                                { backgroundColor: colors.accent },
                              ]}
                            >
                              <Text style={styles.premiumText}>PRO</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            {/* Action Button */}
            <Animated.View entering={FadeInDown.delay(800).duration(600)}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.accent },
                ]}
                onPress={onClose}
              >
                <Text style={styles.actionButtonText}>Continue</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

function getMascotIcon(skin: KrishnaMascotSkin): string {
  switch (skin) {
    case "warrior":
      return "shield";
    case "meditative":
      return "self-improvement";
    case "minimalist":
      return "circle";
    default:
      return "auto-awesome";
  }
}

function getMascotColor(skin: KrishnaMascotSkin, defaultColor: string): string {
  switch (skin) {
    case "warrior":
      return "#ff6b35";
    case "meditative":
      return "#6b7fff";
    case "minimalist":
      return "#888888";
    default:
      return defaultColor;
  }
}

function getContextTitle(context: string): string {
  switch (context) {
    case "welcome":
      return "Welcome, Seeker";
    case "verse":
      return "Understanding This Verse";
    case "reflection":
      return "A Moment to Reflect";
    case "encouragement":
      return "Keep Going!";
    default:
      return "Krishna's Wisdom";
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    maxHeight: "85%",
  },
  closeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    padding: spacing.xs,
  },
  mascotContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  mascotCircle: {
    width: 120,
    height: 120,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  messageBox: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  message: {
    fontSize: fontSize.md,
    lineHeight: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: "center",
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  skinsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  skinCard: {
    width: "47%",
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: spacing.sm,
    position: "relative",
  },
  skinLabel: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
  lockBadge: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: radius.full,
    padding: spacing.xs / 2,
  },
  premiumBadge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
    borderRadius: 4,
  },
  premiumText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  actionButton: {
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});

// ==================== Hook for Easy Krishna Guide Usage ====================

export function useKrishnaGuide() {
  const [guideState, setGuideState] = useState<{
    visible: boolean;
    message: string;
    context: "welcome" | "verse" | "reflection" | "encouragement";
  }>({
    visible: false,
    message: "",
    context: "welcome",
  });

  const showGuide = (
    message: string,
    context: "welcome" | "verse" | "reflection" | "encouragement" = "welcome",
  ) => {
    setGuideState({ visible: true, message, context });
  };

  const hideGuide = () => {
    setGuideState((prev) => ({ ...prev, visible: false }));
  };

  return {
    guideState,
    showGuide,
    hideGuide,
  };
}
