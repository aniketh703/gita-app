import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  className = '',
  ...rest
}: ThemedTextProps) {
  const typeClasses = {
    default: 'text-base leading-6',
    defaultSemiBold: 'text-base leading-6 font-semibold',
    title: 'text-3xl font-bold',
    subtitle: 'text-2xl font-bold',
    link: 'text-base leading-6 text-blue-600 dark:text-blue-400',
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
