export const ROUTES = {
  ROOT: "/",
  SPLASH: "/splash",
  WELCOME: "/welcome",
  ONBOARDING: "/onboarding",
  TABS_HOME: "/(tabs)",
  CHAPTERS: "/chapters",
  SEARCH: "/search",
  JOURNAL: "/journal",
  SETTINGS: "/settings",
  BOOKMARKS: "/bookmarks",
  BADGES: "/badges",
  PAYWALL: "/paywall",
  READING: "/reading",
  VERSE: "/verse",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
  MODAL: "/modal",
} as const;

export type DeepLinkPayload = {
  screen?: "home" | "chapters" | "search" | "journal" | "settings" | "bookmarks" | "badges" | "paywall" | "reading" | "verse";
  chapter?: number;
  verse?: number;
};

export const verseRoute = (chapter: number, verse: number) =>
  `${ROUTES.VERSE}?ch=${chapter}&verse=${verse}` as const;

export const readingRoute = (chapter: number) =>
  `${ROUTES.READING}?ch=${chapter}` as const;

export function deepLinkPayloadToRoute(payload: DeepLinkPayload): string {
  switch (payload.screen) {
    case "home":
      return ROUTES.TABS_HOME;
    case "chapters":
      return ROUTES.CHAPTERS;
    case "search":
      return ROUTES.SEARCH;
    case "journal":
      return ROUTES.JOURNAL;
    case "settings":
      return ROUTES.SETTINGS;
    case "bookmarks":
      return ROUTES.BOOKMARKS;
    case "badges":
      return ROUTES.BADGES;
    case "paywall":
      return ROUTES.PAYWALL;
    case "reading":
      return readingRoute(Math.max(1, payload.chapter ?? 1));
    case "verse":
      return verseRoute(
        Math.max(1, payload.chapter ?? 1),
        Math.max(1, payload.verse ?? 1),
      );
    default:
      return ROUTES.TABS_HOME;
  }
}
