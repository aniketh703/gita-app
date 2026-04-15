import { Text } from "@/components/ui/text";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";

type FocusModeTopHeaderProps = {
  title: string;
  topInset: number;
  onBackPress: () => void;
  backLabel: string;
  animatedStyle: any;
  children?: ReactNode;
};

export function FocusModeTopHeader({
  title,
  topInset,
  onBackPress,
  backLabel,
  animatedStyle,
  children,
}: FocusModeTopHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          paddingTop: topInset,
          backgroundColor: colors.bg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        animatedStyle,
      ]}
    >
      <View className="px-4 h-14 flex-row items-center justify-between">
        <Pressable
          onPress={onBackPress}
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          hitSlop={10}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text
          className="text-lg font-bold"
          style={{ color: colors.text }}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {children ? <View className="px-4 pb-2">{children}</View> : null}
    </Animated.View>
  );
}
