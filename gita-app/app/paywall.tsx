/**
 * Paywall Screen
 * Modal route that displays the paywall navigator
 * Accessed when user needs to purchase premium features
 */

import { ROUTES } from "@/src/navigation/routes";
import PaywallNavigator from "@/src/screens/PaywallNavigator";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function PaywallScreen() {
  const router = useRouter();

  const handleDismiss = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.TABS_HOME);
  };

  return (
    <View style={{ flex: 1 }}>
      <PaywallNavigator onDismiss={handleDismiss} />
    </View>
  );
}
