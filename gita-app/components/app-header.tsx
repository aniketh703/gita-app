import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
  textColor?: string;
  secondaryTextColor?: string;
  borderColor?: string;
  accentColor?: string;
}

export function AppHeader({
  title,
  subtitle,
  showBackButton = false,
  backgroundColor,
  textColor,
  secondaryTextColor,
  borderColor,
  accentColor,
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <View className="px-4 py-3 border-b border-gita-border dark:border-gita-dark-border bg-gita-bg dark:bg-gita-dark-bg">
      <View className="flex-row items-center">
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="mr-3 p-1"
          >
            <Ionicons name="chevron-back" size={24} color={textColor || '#000'} />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text
            numberOfLines={1}
            className="text-lg font-semibold text-gita-text dark:text-gita-dark-text"
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              numberOfLines={1}
              className="text-xs text-gita-secondary dark:text-gita-dark-secondary mt-0.5"
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
