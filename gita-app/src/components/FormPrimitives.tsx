import { radius, spacing } from "@/constants/spacing";
import { fontSize, fontWeight, textStyles } from "@/constants/typography";
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, Text, View, type ViewProps } from "react-native";

export function FormSection({
  title,
  children,
  style,
}: ViewProps & { title: string }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.section, style]}>
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>
        {title}
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.section, borderColor: colors.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export function FormRow({ children, style }: ViewProps) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }, style]}>
      {children}
    </View>
  );
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  const { colors } = useAppTheme();
  return <Text style={[styles.label, { color: colors.text }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.caption,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  row: {
    minHeight: 54,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
