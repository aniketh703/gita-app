/**
 * Index Tab Screen
 * Main tab content - placeholder without styling
 */

import React from 'react';
import { View, Text } from 'react-native';
import type { IndexTabScreenProps } from '@/src/types/navigation';

export default function IndexScreen({ navigation, route }: IndexTabScreenProps) {
  return (
    <View>
      <Text>Index Tab</Text>
    </View>
  );
}
