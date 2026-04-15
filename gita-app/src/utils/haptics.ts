import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MICRO_INTERACTION } from '@/src/config/micro-interactions';

export async function triggerLightHaptic(enabled: boolean): Promise<void> {
  if (!enabled || !MICRO_INTERACTION.haptics.light || Platform.OS === 'web') return;

  try {
    await Haptics.selectionAsync();
  } catch {
    Vibration.vibrate(10);
  }
}

export async function triggerSuccessHaptic(enabled: boolean): Promise<void> {
  if (!enabled || !MICRO_INTERACTION.haptics.success || Platform.OS === 'web') return;

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    Vibration.vibrate(20);
  }
}
