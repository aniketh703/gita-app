import { ROUTES } from "@/src/navigation/routes";
import { Redirect } from "expo-router";

export default function LegacyHomeRoute() {
  // Keep /home for backward compatibility while routing to canonical tabs home.
  return <Redirect href={ROUTES.TABS_HOME} />;
}
