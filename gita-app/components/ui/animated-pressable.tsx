/**
 * Animated Pressable Component
 * Provides tactile visual feedback for user interactions
 * Principles: Visual Feedback, Affordances, User Engagement
 */

import React, { useRef } from 'react';
import { 
  Pressable, 
  Animated, 
  PressableProps,
  ViewStyle,
  StyleProp,
  Vibration 
} from 'react-native';

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  scaleValue?: number;
  enableHaptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Button with scale animation on press
 * Provides immediate visual feedback that enhances user engagement
 */
export function AnimatedPressable({
  children,
  onPress,
  scaleValue = 0.95,
  enableHaptic = false,
  style,
  ...props
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: scaleValue,
      useNativeDriver: true,
      tension: 400,
      friction: 12,
      velocity: 2,
    }).start();
    
    if (enableHaptic) {
      Vibration.vibrate(10);
    }
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 400,
      friction: 12,
      velocity: 2,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...props}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

/**
 * Card with subtle press feedback
 * Ideal for list items and navigational elements
 */
export function AnimatedCard({
  children,
  onPress,
  enableHaptic = false,
  style,
  ...props
}: AnimatedPressableProps) {
  return (
    <AnimatedPressable
      onPress={onPress}
      scaleValue={0.97}
      enableHaptic={enableHaptic}
      style={style}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
