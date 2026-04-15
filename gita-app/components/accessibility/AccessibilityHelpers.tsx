/**
 * Accessibility Helper Component
 * Improves app accessibility for all users
 * Principles: Accessibility & Inclusivity, Universal Design
 */

import React from 'react';
import { 
  View, 
  Text as RNText, 
  TextProps as RNTextProps,
  ViewProps,
  AccessibilityRole,
  AccessibilityState,
} from 'react-native';

interface AccessibleTextProps extends RNTextProps {
  children: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  isHeading?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Text component with enhanced accessibility support
 */
export function AccessibleText({
  children,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'text',
  isHeading = false,
  level = 1,
  ...props
}: AccessibleTextProps) {
  return (
    <RNText
      accessible={true}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityHint={accessibilityHint}
      accessibilityRole={isHeading ? 'header' : accessibilityRole}
      {...(isHeading && { 'aria-level': level })}
      {...props}
    >
      {children}
    </RNText>
  );
}

interface AccessibleButtonProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

/**
 * Button wrapper with proper accessibility attributes
 */
export const AccessibleButton = React.forwardRef<View, AccessibleButtonProps>(
  (
    {
      children,
      onPress,
      accessibilityLabel,
      accessibilityHint,
      disabled = false,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    const accessibilityState: AccessibilityState = {
      disabled: disabled || isLoading,
      busy: isLoading,
    };

    return (
      <View
        ref={ref}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={accessibilityState}
        {...props}
      >
        {children}
      </View>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

/**
 * Enhanced touch target for better accessibility
 * Ensures minimum 44x44pt touch area (iOS HIG, Android Material)
 */
export function EnhancedTouchTarget({
  children,
  minSize = 44,
  style,
  ...props
}: ViewProps & { minSize?: number }) {
  return (
    <View
      style={[
        {
          minWidth: minSize,
          minHeight: minSize,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Skip link for keyboard navigation
 */
interface SkipLinkProps {
  label: string;
  onPress: () => void;
}

export function SkipLink({ label, onPress }: SkipLinkProps) {
  return (
    <View
      accessible={true}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={{
        position: 'absolute',
        left: -9999,
        top: 0,
      }}
    >
      <RNText>{label}</RNText>
    </View>
  );
}

/**
 * Focus trap for modal dialogs
 */
export function FocusTrap({ children }: { children: React.ReactNode }) {
  return (
    <View
      accessible={true}
      accessibilityViewIsModal={true}
      importantForAccessibility="yes"
    >
      {children}
    </View>
  );
}

/**
 * Screen reader only text
 */
export function ScreenReaderOnly({ children }: { children: string }) {
  return (
    <RNText
      accessible={true}
      accessibilityElementsHidden={false}
      style={{
        position: 'absolute',
        left: -9999,
        width: 1,
        height: 1,
        overflow: 'hidden',
      }}
    >
      {children}
    </RNText>
  );
}

/**
 * Hook for managing focus
 */
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = React.useState<string | null>(null);

  const setFocus = (elementId: string) => {
    setFocusedElement(elementId);
  };

  const clearFocus = () => {
    setFocusedElement(null);
  };

  return { focusedElement, setFocus, clearFocus };
}
