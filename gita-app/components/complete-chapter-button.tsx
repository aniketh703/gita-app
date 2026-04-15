/**
 * Complete Chapter Button Component
 * Animated completion button with serene "Sattvic" glow and haptic feedback
 * Provides meaningful visual/tactile feedback when marking a chapter as complete
 */

import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { Text } from "./ui/text";

interface CompleteChapterButtonProps {
  chapterNumber?: number;
  onComplete: () => void | Promise<void>;
  isCompleted?: boolean;
  disabled?: boolean;
  glowColor?: string;
  style?: ViewStyle;
}

export function CompleteChapterButton({
  chapterNumber,
  onComplete,
  isCompleted: initialCompleted = false,
  disabled = false,
  glowColor = "#D4AF37", // Golden Sattvic color
  style,
}: CompleteChapterButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);

  // Shared values for animations
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const checkmarkScale = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);

  // Trigger gentle haptic double-pulse pattern
  const triggerHaptics = useCallback(async () => {
    try {
      // First pulse - gentle impact
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Small delay between pulses
      await new Promise((resolve) => setTimeout(resolve, 120));

      // Second pulse - slightly softer
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Success notification to bookend the effect
      await new Promise((resolve) => setTimeout(resolve, 80));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
    }
  }, []);

  // Animate the expanding glow effect
  const animateGlow = useCallback(() => {
    glowOpacity.value = withTiming(0.8, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });

    glowScale.value = withSequence(
      withTiming(1, { duration: 0 }),
      withTiming(2.8, {
        duration: 1400,
        easing: Easing.out(Easing.cubic),
      }),
    );

    // Fade out the glow
    setTimeout(() => {
      glowOpacity.value = withTiming(0, {
        duration: 800,
        easing: Easing.in(Easing.cubic),
      });
    }, 600);
  }, [glowOpacity, glowScale]);

  // Animate the checkmark entrance
  const animateCheckmark = useCallback(() => {
    checkmarkScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.3, {
        duration: 400,
        easing: Easing.out(Easing.back(1.4)),
      }),
      withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      }),
    );

    checkmarkOpacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  }, [checkmarkScale, checkmarkOpacity]);

  // Main completion handler
  const handlePress = useCallback(async () => {
    if (isCompleted || isLoading || disabled) return;

    setIsLoading(true);

    try {
      // Start animations immediately
      triggerHaptics();
      animateGlow();
      animateCheckmark();

      // Execute the callback (e.g., API call, storage update)
      await onComplete();

      // Mark as completed after animations start
      setIsCompleted(true);
    } catch (error) {
      console.error("Error completing chapter:", error);
      // Reset animations on error
      cancelAnimation(glowScale);
      cancelAnimation(glowOpacity);
      cancelAnimation(checkmarkScale);
      cancelAnimation(checkmarkOpacity);
    } finally {
      setIsLoading(false);
    }
  }, [
    isCompleted,
    isLoading,
    disabled,
    onComplete,
    triggerHaptics,
    animateGlow,
    animateCheckmark,
    glowScale,
    glowOpacity,
    checkmarkScale,
    checkmarkOpacity,
  ]);

  // Animated styles for glow effect
  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  // Animated styles for checkmark
  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkmarkOpacity.value,
    transform: [{ scale: checkmarkScale.value }],
  }));

  // Animated style for ripple effect (when completed)
  const rippleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkmarkOpacity.value * 0.4,
    transform: [{ scale: checkmarkScale.value * 1.2 }],
  }));

  return (
    <Pressable
      onPress={handlePress}
      disabled={isCompleted || isLoading || disabled}
      style={({ pressed }) => [
        {
          opacity:
            isCompleted || disabled ? 0.7 : pressed && !isCompleted ? 0.8 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          paddingHorizontal: 24,
          paddingVertical: 14,
          backgroundColor: isCompleted ? "#E8D5BE" : "#F0E6D8",
          borderWidth: 1.5,
          borderColor: glowColor,
        }}
      >
        {/* Glow layer - expands outward */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: glowColor,
            },
            glowAnimatedStyle,
          ]}
          pointerEvents="none"
        />

        {/* Button content */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            position: "relative",
            zIndex: 1,
          }}
        >
          {isCompleted && (
            <Animated.Text
              style={[
                {
                  fontSize: 20,
                  fontWeight: "600",
                  color: glowColor,
                  textAlignVertical: "center",
                },
                checkmarkAnimatedStyle,
              ]}
            >
              ✓
            </Animated.Text>
          )}

          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#3E2F22",
              opacity: isCompleted ? 0.8 : 1,
            }}
          >
            {isCompleted ? "Chapter Complete" : "Mark Complete"}
          </Text>

          {isLoading && (
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: "#3E2F22",
                borderTopColor: glowColor,
                opacity: 0.7,
              }}
            />
          )}
        </View>

        {/* Subtle ripple effect on completion - quick radial flash */}
        {isCompleted && (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: glowColor,
              },
              rippleAnimatedStyle,
            ]}
            pointerEvents="none"
          />
        )}
      </View>
    </Pressable>
  );
}
