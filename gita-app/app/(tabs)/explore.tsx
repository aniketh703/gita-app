import { Redirect } from "expo-router";
import { ROUTES } from "@/src/navigation/routes";
import React from "react";

export default function ExploreAliasRoute() {
  return <Redirect href={ROUTES.SETTINGS} />;
}
