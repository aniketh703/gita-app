import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Fonts } from '@/constants/theme';

export type DevanagariTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'verse' | 'title' | 'subtitle';
};

/**
 * DevanagariText component for displaying Sanskrit/Devanagari text
 * Uses Noto Serif Devanagari font family
 */
export function DevanagariText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: DevanagariTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'verse' ? styles.verse : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 28,
    fontFamily: Fonts.devanagari.regular,
  },
  verse: {
    fontSize: 18,
    lineHeight: 32,
    fontFamily: Fonts.devanagari.regular,
  },
  title: {
    fontSize: 28,
    lineHeight: 40,
    fontFamily: Fonts.devanagari.bold,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 32,
    fontFamily: Fonts.devanagari.semiBold,
  },
});
