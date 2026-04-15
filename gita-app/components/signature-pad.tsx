/**
 * Signature Pad Component
 * Allows users to draw their signature as a commitment gesture
 * Used in onboarding for psychological commitment
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    GestureHandlerRootView,
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");
const CANVAS_WIDTH = screenWidth - spacing.lg * 2;
const CANVAS_HEIGHT = 180;

interface SignaturePadProps {
  onSignature: (hasSigned: boolean) => void;
}

export function SignaturePad({ onSignature }: SignaturePadProps) {
  const { colors } = useAppTheme();
  const [paths, setPaths] = useState<string[]>([]);
  const currentPath = useSharedValue("");
  const [hasDrawn, setHasDrawn] = useState(false);

  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { x, y } = event.nativeEvent;
    if (currentPath.value === "") {
      currentPath.value = `M ${x} ${y}`;
    } else {
      currentPath.value += ` L ${x} ${y}`;
    }
  };

  const onGestureEnd = () => {
    if (currentPath.value) {
      setPaths((prev) => [...prev, currentPath.value]);
      setHasDrawn(true);
      onSignature(true);
      currentPath.value = "";
    }
  };

  const handleClear = () => {
    setPaths([]);
    currentPath.value = "";
    setHasDrawn(false);
    onSignature(false);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.canvas,
          {
            backgroundColor: colors.surface,
            borderColor: hasDrawn ? colors.accent : colors.border,
          },
        ]}
      >
        <GestureHandlerRootView style={styles.gestureContainer}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={(event) => {
              if (event.nativeEvent.state === 5) {
                // End state
                onGestureEnd();
              }
            }}
          >
            <Animated.View style={styles.svgContainer}>
              <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                {paths.map((path, index) => (
                  <Path
                    key={index}
                    d={path}
                    stroke={colors.text}
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </Svg>
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>

        {!hasDrawn && (
          <View style={styles.placeholder}>
            <MaterialIcons
              name="create"
              size={24}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.placeholderText, { color: colors.textSecondary }]}
            >
              Sign your name here
            </Text>
          </View>
        )}
      </View>

      {hasDrawn && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <MaterialIcons name="refresh" size={20} color={colors.accent} />
          <Text style={[styles.clearText, { color: colors.accent }]}>
            Clear & Sign Again
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: spacing.md,
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    borderRadius: radius.lg,
    borderWidth: 2,
    overflow: "hidden",
    position: "relative",
  },
  gestureContainer: {
    flex: 1,
  },
  svgContainer: {
    flex: 1,
  },
  placeholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    pointerEvents: "none",
  },
  placeholderText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  clearText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
