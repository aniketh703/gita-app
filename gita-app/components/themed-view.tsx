import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor,
  className = '',
  ...otherProps 
}: ThemedViewProps) {
  const bgClass = 'bg-gita-bg dark:bg-gita-dark-bg';
  const combinedClassName = `${bgClass} ${className}`.trim();

  return (
    <View 
      style={style} 
      className={combinedClassName}
      {...otherProps} 
    />
  );
}
