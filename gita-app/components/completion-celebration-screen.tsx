/**
 * Completion Celebration Screen
 * Displayed when user completes all 18 chapters
 */

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAppTheme } from "@/hooks/use-app-theme";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface CompletionCelebrationScreenProps {
  completionProgress: number; // 0-100
  completionStreak: number;
  onDismiss: () => void;
}

export function CompletionCelebrationScreen({
  completionProgress,
  completionStreak,
  onDismiss,
}: CompletionCelebrationScreenProps) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { height } = useWindowDimensions();
  const scaleValue = useSharedValue(0.5);
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    // Trigger celebration haptics
    celebrateCompletion();
  }, []);

  const celebrateCompletion = async () => {
    try {
      // Pattern: three impact pulses followed by success
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((resolve) => setTimeout(resolve, 150));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((resolve) => setTimeout(resolve, 150));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn("Celebration haptics failed:", error);
    }
  };

  // Animate entrance
  useEffect(() => {
    opacityValue.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });

    scaleValue.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.back(1.2)),
    });
  }, [scaleValue, opacityValue]);

  // Pulse animation for the trophy icon
  const pulseAnimStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withTiming(1.15, {
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true,
        ),
      },
    ],
  }));

  const containerAnimStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
    transform: [{ scale: scaleValue.value }],
  }));

  const isFullyCompleted = completionProgress === 100;

  return (
    <Animated.ScrollView
      style={[
        {
          flex: 1,
          backgroundColor: colors.bg,
        },
        containerAnimStyle,
      ]}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
        minHeight: height,
        justifyContent: "center",
        alignItems: "center",
      }}
      scrollEnabled={false}
    >
      <View
        style={{
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Trophy / Celebration Icon */}
        <Animated.Text
          style={[
            {
              fontSize: 120,
            },
            pulseAnimStyle,
          ]}
        >
          {isFullyCompleted ? "🏆" : "⭐"}
        </Animated.Text>

        {/* Main Message */}
        <View
          style={{
            gap: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: colors.text,
              textAlign: "center",
              lineHeight: 42,
            }}
          >
            {isFullyCompleted
              ? "All Chapters Complete!"
              : `${completionProgress}% Complete`}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: colors.secondary,
              textAlign: "center",
              lineHeight: 24,
              marginTop: 8,
            }}
          >
            {isFullyCompleted
              ? "You have journeyed through all 18 chapters of the Bhagavad Gita. A profound spiritual achievement!"
              : "You are on an incredible journey through the sacred wisdom of the Bhagavad Gita."}
          </Text>
        </View>

        {/* Statistics */}
        <View
          style={{
            width: "100%",
            backgroundColor: colors.section,
            borderRadius: 16,
            padding: 20,
            gap: 16,
            borderLeftWidth: 4,
            borderLeftColor: colors.accent,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.secondary,
                fontWeight: "500",
              }}
            >
              Progress
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.accent,
              }}
            >
              {completionProgress}%
            </Text>
          </View>

          <View
            style={{
              height: 12,
              backgroundColor: colors.border,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${completionProgress}%`,
                backgroundColor: colors.accent,
                borderRadius: 6,
              }}
            />
          </View>

          {completionStreak > 0 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.secondary,
                  fontWeight: "500",
                }}
              >
                Reading Streak
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.accent,
                }}
              >
                {completionStreak} day{completionStreak !== 1 ? "s" : ""} 🔥
              </Text>
            </View>
          )}
        </View>

        {/* Inspirational Message */}
        {isFullyCompleted && (
          <View
            style={{
              width: "100%",
              backgroundColor: colors.verseBox,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: colors.text,
                marginBottom: 8,
              }}
            >
              Krishna’s Wisdom
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.secondary,
                lineHeight: 20,
                fontStyle: "italic",
              }}
            >
              The Bhagavad Gita is not merely a scripture to be read once, but a
              guide for life to be revisited again and again. Your commitment to
              this sacred journey reflects the highest spiritual aspiration.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View
          style={{
            width: "100%",
            gap: 12,
            marginTop: 12,
          }}
        >
          {isFullyCompleted && (
            <Button
              variant="default"
              size="lg"
              onPress={() => {
                router.push("/");
              }}
              style={{
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                }}
              >
                {completionProgress === 100
                  ? "Start Again & Deepen Understanding"
                  : "Continue Reading"}
              </Text>
            </Button>
          )}

          <Button
            variant="secondary"
            size="lg"
            onPress={onDismiss}
            style={{
              width: "100%",
            }}
          >
            <Text
              style={{
                fontWeight: "600",
              }}
            >
              {isFullyCompleted ? "View Progress" : "Keep Reading"}
            </Text>
          </Button>
        </View>

        {/* Motivational Quote */}
        <Text
          style={{
            fontSize: 12,
            color: colors.secondary,
            textAlign: "center",
            marginTop: 20,
            fontStyle: "italic",
          }}
        >
          Not just reading, but understanding; not just understanding, but
          living the wisdom. — Bhagavad Gita
        </Text>
      </View>
    </Animated.ScrollView>
  );
}
