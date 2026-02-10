/**
 * Modal Screen
 * Generic modal for dialogs and overlays - placeholder without styling
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { ModalScreenProps } from '@/src/types/navigation';

export default function ModalScreen({ navigation, route }: ModalScreenProps) {
  // Type-safe access to optional params
  const { title, content } = route.params || {};

  return (
    <View>
      <Text>{title || 'Modal Screen'}</Text>
      {content && <Text>{content}</Text>}
    </View>
  );
}
