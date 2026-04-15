/**
 * Toast Notification Component
 * Provides non-intrusive feedback for user actions
 * Principles: Visual Feedback, Error Prevention
 */

import { useAppTheme } from "@/hooks/use-app-theme";
import { MICRO_INTERACTION } from "@/src/config/micro-interactions";
import { triggerSuccessHaptic } from "@/src/utils/haptics";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
  visible: boolean;
  enableHaptic?: boolean;
}

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onHide,
  visible,
  enableHaptic = false,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const scale = useRef(
    new Animated.Value(MICRO_INTERACTION.toast.initialScale),
  ).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const { colors: themeColors, isDark } = useAppTheme();

  useEffect(() => {
    if (visible) {
      if (type === "success" && MICRO_INTERACTION.toast.successHaptic) {
        triggerSuccessHaptic(enableHaptic);
      }

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: MICRO_INTERACTION.toast.springTension,
          friction: MICRO_INTERACTION.toast.springFriction,
          useNativeDriver: true,
        }),
      ]).start();

      if (type === "success") {
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: MICRO_INTERACTION.toast.glowPeak,
            duration: MICRO_INTERACTION.toast.glowInDuration,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0,
            duration: MICRO_INTERACTION.toast.glowOutDuration,
            useNativeDriver: true,
          }),
        ]).start();
      }

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -20,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: MICRO_INTERACTION.toast.initialScale,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide?.();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [
    visible,
    duration,
    opacity,
    translateY,
    scale,
    glowOpacity,
    onHide,
    type,
    enableHaptic,
  ]);

  if (!visible) return null;

  const getBackgroundColor = () => {
    const colors = {
      success: isDark ? "#1b2b1b" : "#e8f5e9",
      error: isDark ? "#3b1f1f" : "#fdecea",
      warning: isDark ? "#3b3320" : "#fff8e1",
      info: isDark ? "#1c2d3d" : "#e3f2fd",
    };
    return colors[type];
  };

  const getTextColor = () => {
    const colors = {
      success: isDark ? themeColors.success : "#1b5e20",
      error: isDark ? "#ef9a9a" : "#b71c1c",
      warning: isDark ? "#ffe082" : "#8d6e63",
      info: isDark ? "#90caf9" : "#0d47a1",
    };
    return colors[type];
  };

  const getIcon = () => {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type];
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      {type === "success" && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
            },
          ]}
        />
      )}
      <View style={styles.content}>
        <Text style={[styles.icon, { color: getTextColor() }]}>
          {getIcon()}
        </Text>
        <Text style={[styles.message, { color: getTextColor() }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: "bold",
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});

// Hook for managing toast state
export function useToast() {
  const [toast, setToast] = React.useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return { toast, showToast, hideToast };
}
