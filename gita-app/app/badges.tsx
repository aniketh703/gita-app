/**
 * Badges Route
 */

import { ROUTES } from "@/src/navigation/routes";
import BadgesScreen from "@/src/screens/BadgesScreen";
import { useRouter } from "expo-router";
import React from "react";

export default function BadgesRoute() {
  const router = useRouter();

  const safeBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.TABS_HOME);
  };

  return (
    <BadgesScreen
      navigation={{
        goBack: safeBack,
      }}
    />
  );
}
