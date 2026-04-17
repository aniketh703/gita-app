## 2025-02-24 - Enforce HTTPS for External Links
**Vulnerability:** External URLs opened in the app via `expo-web-browser` were passing URLs through directly, enabling MITM attacks if the URL was not explicitly `https://`.
**Learning:** Initial implementation only upgraded links on native devices and failed to catch case-insensitive URLs.
**Prevention:** Use a case-insensitive regex pattern (`/^http:\/\//i`) on external links to upgrade `http://` to `https://` systematically on all platforms.
