/**
 * App Entry Point
 * Redirects to splash screen for initialization
 */

import { Redirect } from "expo-router";
import { ROUTES } from "@/src/navigation/routes";

export default function Index() {
  return <Redirect href={ROUTES.SPLASH} />;
}
