/**
 * Modal Screen
 */

import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import type { ModalScreenProps } from "@/src/types/navigation";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ModalScreen({ navigation, route }: ModalScreenProps) {
  const { title, content } = route.params || {};
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.closeButton, { backgroundColor: colors.surfaceSoft }]}
          accessibilityRole="button"
          accessibilityLabel="Close modal"
        >
          <MaterialIcons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>
          {title || "Modal"}
        </Text>
        <Text style={[styles.content, { color: colors.textSecondary }]}>
          {content || "More details will appear here."}
        </Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.cta, { backgroundColor: colors.accent }]}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaText, { color: colors.bg }]}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  closeButton: {
    alignSelf: "flex-end",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  content: {
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
  cta: {
    marginTop: spacing.xs,
    borderRadius: radius.md,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
