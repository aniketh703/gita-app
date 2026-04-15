import { Text } from "@/components/ui/text";
import { useAppTheme } from "@/hooks/use-app-theme";
import type { LangKey } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

type FocusModeBottomNavProps = {
  language: LangKey;
  onHomePress: () => void;
  onChaptersPress: () => void;
  onSettingsPress: () => void;
};

export function FocusModeBottomNav({
  language,
  onHomePress,
  onChaptersPress,
  onSettingsPress,
}: FocusModeBottomNavProps) {
  const { colors } = useAppTheme();

  return (
    <View className="h-16 flex-row items-center justify-around px-4">
      <Pressable onPress={onHomePress} hitSlop={10} className="items-center">
        <MaterialIcons
          name="auto-stories"
          size={24}
          color={colors.tabBarInactive}
        />
        <Text className="text-xs mt-1" style={{ color: colors.tabBarInactive }}>
          {language === "english" ? "Home" : "होम"}
        </Text>
      </Pressable>

      <Pressable
        onPress={onChaptersPress}
        hitSlop={10}
        className="items-center"
      >
        <MaterialIcons
          name="menu-book"
          size={24}
          color={colors.tabBarInactive}
        />
        <Text className="text-xs mt-1" style={{ color: colors.tabBarInactive }}>
          {language === "english" ? "Chapters" : "अध्याय"}
        </Text>
      </Pressable>

      <Pressable
        onPress={onSettingsPress}
        hitSlop={10}
        className="items-center"
      >
        <MaterialIcons
          name="settings"
          size={24}
          color={colors.tabBarInactive}
        />
        <Text className="text-xs mt-1" style={{ color: colors.tabBarInactive }}>
          {language === "english" ? "Settings" : "सेटिंग्स"}
        </Text>
      </Pressable>
    </View>
  );
}
