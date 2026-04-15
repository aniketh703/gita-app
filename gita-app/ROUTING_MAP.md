# Routing Map (Canonical)

This document defines canonical app routes and compatibility routes.

## Canonical Routes

- `/` -> Redirects to `/splash`
- `/splash` -> App bootstrap and first-run decision
- `/welcome` -> Welcome entry point
- `/onboarding` -> Onboarding flow
- `/(tabs)` -> Home tab root
- `/chapters` -> Chapter list
- `/reading?ch={chapter}` -> Chapter reading list
- `/verse?ch={chapter}&verse={verse}` -> Canonical verse detail path
- `/search` -> Verse search
- `/journal` -> Journal tab
- `/bookmarks` -> Bookmarks list
- `/settings` -> Settings screen
- `/badges` -> Badges modal
- `/paywall` -> Paywall modal
- `/privacy-policy` -> Privacy policy
- `/terms-of-service` -> Terms of service
- `/modal` -> Generic info modal

## Compatibility Routes

- `/home` -> Redirects to `/(tabs)` for backward compatibility.
- `/(tabs)/explore` -> Redirects to `/settings` as a legacy alias.

## Navigation Rules

- Use shared route helpers from `src/navigation/routes.ts`.
- For verse detail navigation, always use `verseRoute(chapter, verse)`.
- For chapter reading navigation, always use `readingRoute(chapter)`.
- Prefer constants in `ROUTES` over inline string literals.

## Deep Link Notes

- Existing internal navigation now targets canonical routes.
- Use `deepLinkPayloadToRoute(payload)` from `src/navigation/routes.ts` to normalize notification/widget/share payloads to canonical routes.
- Verse opens resolve to `/verse?ch={chapter}&verse={verse}` and chapter opens resolve to `/reading?ch={chapter}`.
