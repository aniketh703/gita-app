/**
 * Celebration Screen Component
 * Displays congratulatory message when user completes all 18 chapters
 * Features serene animations and sharing capability
 */

import { useAppTheme } from "@/hooks/use-app-theme";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    ZoomIn,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { Card, CardContent } from "./ui/card";
import { Text } from "./ui/text";

interface CelebrationScreenProps {
  totalChapters?: number;
  completionDate?: Date;
  onContinue?: () => void;
  onShare?: () => void;
}

export function CelebrationScreen({
  totalChapters = 18,
  completionDate = new Date(),
  onContinue,
  onShare,
}: CelebrationScreenProps) {
  const { colors } = useAppTheme();

  // Animated glow effect
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Trigger success haptics
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Start glow animation
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 }),
      ),
      -1,
      true,
    );
  }, [glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const formattedDate = completionDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
      }}
      contentContainerStyle={{
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
      }}
    >
      {/* Golden Glow Background */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: "#D4AF37",
            top: "30%",
          },
          glowStyle,
        ]}
        pointerEvents="none"
      />

      {/* Main Content */}
      <Animated.View
        entering={ZoomIn.duration(800).delay(200)}
        style={{
          alignItems: "center",
          marginBottom: 32,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Text
          style={{
            fontSize: 72,
            marginBottom: 16,
          }}
        >
          🎉
        </Text>

        <Animated.Text
          entering={FadeInUp.duration(600).delay(400)}
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: colors.text,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Journey Complete!
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.duration(600).delay(600)}
          style={{
            fontSize: 16,
            color: colors.secondary,
            textAlign: "center",
            lineHeight: 24,
            paddingHorizontal: 20,
          }}
        >
          You have completed all {totalChapters} chapters of the Bhagavad Gita
        </Animated.Text>
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View
        entering={FadeInDown.duration(600).delay(800)}
        style={{
          width: "100%",
          maxWidth: 400,
          marginBottom: 24,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Card
          style={{
            backgroundColor: colors.verseBox,
            borderColor: colors.border,
          }}
        >
          <CardContent className="pt-6">
            <View
              style={{
                alignItems: "center",
                gap: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.text,
                }}
              >
                Achievement Unlocked
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: "700",
                    color: colors.accent,
                  }}
                >
                  {totalChapters}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.secondary,
                  }}
                >
                  Chapters
                </Text>
              </View>

              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: colors.border,
                  marginVertical: 8,
                }}
              />

              <Text
                style={{
                  fontSize: 13,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                Completed on {formattedDate}
              </Text>
            </View>
          </CardContent>
        </Card>
      </Animated.View>

      {/* Inspirational Quote */}
      <Animated.View
        entering={FadeIn.duration(800).delay(1000)}
        style={{
          width: "100%",
          maxWidth: 400,
          marginBottom: 32,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Card
          style={{
            backgroundColor: colors.section,
            borderLeftWidth: 4,
            borderLeftColor: colors.accent,
            borderColor: "transparent",
          }}
        >
          <CardContent className="pt-4">
            <Text
              style={{
                fontSize: 14,
                fontStyle: "italic",
                color: colors.text,
                lineHeight: 22,
                textAlign: "center",
              }}
            >
              &quot;You have the right to work, but never to the fruit of work.
              You should never engage in action for the sake of reward, nor
              should you long for inaction.&quot;
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.secondary,
                textAlign: "center",
                marginTop: 12,
              }}
            >
              — Bhagavad Gita 2.47
            </Text>
          </CardContent>
        </Card>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        entering={FadeInUp.duration(600).delay(1200)}
        style={{
          width: "100%",
          maxWidth: 400,
          gap: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        {onShare && (
          <Pressable
            onPress={onShare}
            style={({ pressed }) => ({
              backgroundColor: colors.accent,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Share Achievement
            </Text>
          </Pressable>
        )}

        {onContinue && (
          <Pressable
            onPress={onContinue}
            style={({ pressed }) => ({
              backgroundColor: colors.verseBox,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Continue Reading
            </Text>
          </Pressable>
        )}
      </Animated.View>

      {/* Decorative Elements */}
      <Animated.View
        entering={FadeIn.duration(1000).delay(1400)}
        style={{
          marginTop: 32,
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            opacity: 0.6,
          }}
        >
          ✨ 🕉️ ✨
        </Text>
      </Animated.View>
    </ScrollView>
  );
}
