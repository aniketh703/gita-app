import { Text, type TextProps } from 'react-native';

export type DevanagariTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'verse' | 'title' | 'subtitle';
  className?: string;
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
  className = '',
  ...rest
}: DevanagariTextProps) {
  const typeClasses = {
    default: 'text-base leading-7',
    verse: 'text-lg leading-8',
    title: 'text-2xl leading-10 font-bold',
    subtitle: 'text-xl leading-8 font-semibold',
  };

  const typeClass = typeClasses[type] || '';
  const combinedClassName = `${typeClass} ${className}`.trim();

  return (
    <Text
      style={style}
      className={combinedClassName}
      {...rest}
    />
  );
}
