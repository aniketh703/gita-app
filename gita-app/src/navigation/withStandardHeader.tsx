import { ScreenHeader } from "@/src/components/ScreenHeader";
import React from "react";
import { StyleSheet, View } from "react-native";

interface HeaderOptions {
  title: string;
  getBackAction?: (props: any) => (() => void) | undefined;
}

export function withStandardHeader<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: HeaderOptions,
) {
  return function HeaderWrappedScreen(props: P) {
    const onBack = options.getBackAction?.(props);

    return (
      <View style={styles.container}>
        <ScreenHeader title={options.title} onBack={onBack} />
        <View style={styles.content}>
          <WrappedComponent {...props} />
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
