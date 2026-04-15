/**
 * Badge Preview Component
 * Shows recent badges on home screen
 * Tappable to view all badges
 * Based on Rule #11: Gamification
 */

import { BADGES } from "@/src/types/gamification";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

interface BadgePreviewProps {
  badgeIds: string[];
  isDark?: boolean;
  showTitle?: boolean;
}

export function BadgePreview({
  badgeIds,
  isDark = false,
  showTitle = true,
}: BadgePreviewProps) {
  const router = useRouter();

  const colors = {
    bg: isDark ? "#1a1a1a" : "#f8f9fa",
    text: isDark ? "#ffffff" : "#0a0a0a",
    textSecondary: isDark ? "#a0a0a0" : "#666666",
    accent: "#ff6b35",
    border: isDark ? "#333333" : "#e0e0e0",
    rarityColors: {
      common: isDark ? "#9ca3af" : "#6b7280",
      rare: "#3b82f6",
      epic: "#8b5cf6",
      legendary: "#f59e0b",
    },
  };

  // Show max 4 badges
  const displayBadges = badgeIds.slice(0, 4);
  const totalBadges = badgeIds.length;
  const hasMore = totalBadges > 4;

  if (totalBadges === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      {showTitle && (
        <View style={styles.header}>
          <MaterialIcons name="emoji-events" size={24} color={colors.accent} />
          <Text style={[styles.title, { color: colors.text }]}>
            Your Achievements
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/badges")}
            style={styles.viewAllButton}
          >
            <Text style={[styles.viewAllText, { color: colors.accent }]}>
              View All
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={16}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.badgesGrid}>
        {displayBadges.map((badgeId, index) => {
          const badge = BADGES[badgeId];
          if (!badge) return null;

          const rarityColor =
            colors.rarityColors[badge.rarity] || colors.textSecondary;

          return (
            <Animated.View
              key={badgeId}
              entering={FadeInRight.delay(index * 100).duration(500)}
            >
              <TouchableOpacity
                style={[styles.badgeCard, { borderColor: rarityColor }]}
                onPress={() => router.push("/badges")}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: rarityColor + "20" },
                  ]}
                >
                  <MaterialIcons
                    name={badge.icon as any}
                    size={28}
                    color={rarityColor}
                  />
                </View>
                <Text
                  style={[styles.badgeName, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {badge.name}
                </Text>
                <View
                  style={[styles.rarityBadge, { backgroundColor: rarityColor }]}
                >
                  <Text style={styles.rarityText}>
                    {badge.rarity.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {hasMore && (
          <Animated.View
            entering={FadeInRight.delay(displayBadges.length * 100).duration(
              500,
            )}
          >
            <TouchableOpacity
              style={[
                styles.badgeCard,
                styles.moreCard,
                { borderColor: colors.border, backgroundColor: colors.bg },
              ]}
              onPress={() => router.push("/badges")}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.accent + "20" },
                ]}
              >
                <MaterialIcons
                  name="more-horiz"
                  size={28}
                  color={colors.accent}
                />
              </View>
              <Text style={[styles.moreText, { color: colors.textSecondary }]}>
                +{totalBadges - 4} more
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  badgeCard: {
    width: "48%",
    minWidth: 150,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeName: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    minHeight: 32,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rarityText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "700",
  },
  moreCard: {
    justifyContent: "center",
  },
  moreText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
