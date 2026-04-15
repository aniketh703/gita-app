/**
 * Badges Screen
 * Shows all badges and user progress
 */

import { useAppTheme } from "@/hooks/use-app-theme";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { useAppStore } from "@/src/store/appStore";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BadgesDisplay from "../components/BadgesDisplay";

interface BadgesScreenProps {
  navigation: any;
}

export default function BadgesScreen({ navigation }: BadgesScreenProps) {
  const { colors } = useAppTheme();
  const { badges } = useAppStore();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg }]}
      edges={["left", "right"]}
    >
      <ScreenHeader title="Badges" onBack={() => navigation?.goBack()} />

      {/* Badges Display */}
      <BadgesDisplay unlockedBadgeIds={badges} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
