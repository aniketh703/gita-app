/**
 * Badge Display Component
 * Shows unlocked and locked badges with beautiful UI
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import type { Badge } from "@/src/types/gamification";
import { BADGES } from "@/src/types/gamification";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.sm) / 2;

function withHexAlpha(hex: string, alpha: string): string {
  return `${hex}${alpha}`;
}

interface BadgeCardProps {
  badge: Omit<Badge, "unlockedAt">;
  unlocked: boolean;
  index: number;
}

function BadgeCard({ badge, unlocked, index }: BadgeCardProps) {
  const { colors } = useAppTheme();
  const rarityIntensity = {
    common: "66",
    rare: "88",
    epic: "AA",
    legendary: "CC",
  } as const;

  const rarityBorderColor = withHexAlpha(
    colors.accent,
    rarityIntensity[badge.rarity],
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(400)}
      style={[
        styles.badgeCard,
        {
          backgroundColor: colors.surface,
          borderColor: unlocked ? rarityBorderColor : colors.border,
          opacity: unlocked ? 1 : 0.5,
        },
      ]}
    >
      <View
        style={[
          styles.badgeIconContainer,
          {
            backgroundColor: unlocked
              ? withHexAlpha(colors.accent, "20")
              : withHexAlpha(colors.border, "66"),
          },
        ]}
      >
        <MaterialIcons
          name={badge.icon as any}
          size={32}
          color={unlocked ? colors.accent : colors.textSecondary}
        />
      </View>

      <Text
        style={[styles.badgeName, { color: colors.text }]}
        numberOfLines={2}
      >
        {badge.name}
      </Text>

      <Text
        style={[styles.badgeDescription, { color: colors.textSecondary }]}
        numberOfLines={2}
      >
        {badge.description}
      </Text>

      <View
        style={[
          styles.rarityBadge,
          { backgroundColor: withHexAlpha(colors.accent, "30") },
        ]}
      >
        <Text style={[styles.rarityText, { color: colors.accent }]}>
          {badge.rarity}
        </Text>
      </View>

      {!unlocked && (
        <View style={styles.lockIcon}>
          <MaterialIcons name="lock" size={16} color={colors.textSecondary} />
        </View>
      )}

      {unlocked && (
        <View style={[styles.checkIcon, { backgroundColor: colors.accent }]}>
          <MaterialIcons name="check" size={16} color={colors.background} />
        </View>
      )}
    </Animated.View>
  );
}

interface BadgesDisplayProps {
  unlockedBadgeIds: string[];
}

export default function BadgesDisplay({
  unlockedBadgeIds,
}: BadgesDisplayProps) {
  const { colors } = useAppTheme();

  const badgesByCategory = Object.entries(BADGES).reduce(
    (acc, [_, badge]) => {
      let category = "Reading";

      if (
        badge.id.includes("streak") ||
        badge.id.includes("learner") ||
        badge.id.includes("soul") ||
        badge.id.includes("student") ||
        badge.id.includes("path")
      ) {
        category = "Dedication";
      } else if (badge.id.includes("search") || badge.id.includes("bookmark")) {
        category = "Exploration";
      }

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(badge);

      return acc;
    },
    {} as Record<string, Omit<Badge, "unlockedAt">[]>,
  );

  const totalBadges = Object.keys(BADGES).length;
  const unlockedCount = unlockedBadgeIds.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {unlockedCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Unlocked
          </Text>
        </View>

        <View
          style={[styles.statDivider, { backgroundColor: colors.border }]}
        />

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {totalBadges}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total
          </Text>
        </View>

        <View
          style={[styles.statDivider, { backgroundColor: colors.border }]}
        />

        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {Math.round((unlockedCount / totalBadges) * 100)}%
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Complete
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Object.entries(badgesByCategory).map(([category, badges]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={[styles.categoryTitle, { color: colors.text }]}>
              {category}
            </Text>
            <View style={styles.badgesGrid}>
              {badges.map((badge, index) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  unlocked={unlockedBadgeIds.includes(badge.id)}
                  index={index}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    padding: spacing.lg - spacing.xs / 2,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    fontSize: fontSize.xs + 1,
    fontWeight: fontWeight.medium,
  },
  statDivider: {
    width: 1,
    marginVertical: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg - spacing.xs / 2,
    paddingBottom: spacing.xxl - spacing.xs,
  },
  categorySection: {
    marginBottom: spacing.xl,
  },
  categoryTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  badgeCard: {
    width: CARD_WIDTH,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    position: "relative",
  },
  badgeIconContainer: {
    width: spacing.xxl - spacing.xs / 2,
    height: spacing.xxl - spacing.xs / 2,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    alignSelf: "center",
  },
  badgeName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs - 2,
    textAlign: "center",
    minHeight: 40,
  },
  badgeDescription: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.33,
    textAlign: "center",
    marginBottom: spacing.sm,
    minHeight: 32,
  },
  rarityBadge: {
    alignSelf: "center",
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },
  rarityText: {
    fontSize: fontSize.xs - 1,
    fontWeight: fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  lockIcon: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
  },
  checkIcon: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
