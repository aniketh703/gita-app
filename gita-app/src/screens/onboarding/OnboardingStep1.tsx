/**
 * Onboarding Screen 1 - Emotional Hook
 * Sells the transformation value of the app
 * Based on Rule #4: Before → After Transformation
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface OnboardingStep1Props {
  onNext: () => void;
}

export default function OnboardingStep1({ onNext }: OnboardingStep1Props) {
  const { colors: themeColors } = useAppTheme();
  const colors = {
    bg: themeColors.bg,
    text: themeColors.text,
    textSecondary: themeColors.textSecondary,
    accent: themeColors.accent,
    buttonText: themeColors.background,
    gradientStart: themeColors.surface,
    gradientEnd: themeColors.bg,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        {/* Om Symbol or Mandala Icon */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(800)}
          style={styles.iconContainer}
        >
          <MaterialIcons name="auto-awesome" size={80} color={colors.accent} />
        </Animated.View>

        {/* Title */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(800)}
          style={styles.titleContainer}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Discover the Wisdom of{"\n"}the Bhagavad Gita
          </Text>
        </Animated.View>

        {/* Before → After Transformation */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(800)}
          style={styles.transformContainer}
        >
          {/* Before */}
          <View style={styles.transformBox}>
            <MaterialIcons
              name="psychology-alt"
              size={32}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.transformLabel, { color: colors.textSecondary }]}
            >
              Before
            </Text>
            <Text
              style={[styles.transformText, { color: colors.textSecondary }]}
            >
              Feeling lost?{"\n"}Overthinking life?
            </Text>
          </View>

          {/* Arrow */}
          <MaterialIcons name="arrow-forward" size={24} color={colors.accent} />

          {/* After */}
          <View style={styles.transformBox}>
            <MaterialIcons
              name="self-improvement"
              size={32}
              color={colors.accent}
            />
            <Text style={[styles.transformLabel, { color: colors.text }]}>
              After
            </Text>
            <Text style={[styles.transformText, { color: colors.text }]}>
              Find clarity, purpose,{"\n"}and calm
            </Text>
          </View>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text
          entering={FadeInDown.delay(800).duration(800)}
          style={[styles.subtitle, { color: colors.textSecondary }]}
        >
          Through timeless wisdom that has guided{"\n"}millions for thousands of
          years
        </Animated.Text>

        {/* CTA Button */}
        <Animated.View
          entering={FadeInDown.delay(1000).duration(800)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={onNext}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Onboarding: continue to next step"
          >
            <Text style={[styles.buttonText, { color: "#1a1a1a" }]}> 
              Start Your Journey
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color="#1a1a1a"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl + spacing.sm,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  titleContainer: {
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  transformContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xs,
  },
  transformBox: {
    alignItems: "center",
    flex: 1,
  },
  transformLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  transformText: {
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 22,
  },
  subtitle: {
    fontSize: fontSize.md,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  buttonContainer: {
    marginTop: "auto",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    gap: spacing.xs,
  },
  buttonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
