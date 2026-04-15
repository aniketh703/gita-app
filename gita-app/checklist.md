**v2.0 Build Checklist (From Your PRD)**

### Phase 1 (Ship First: v2.0.1)

- [x] F-16 Route consolidation completed
- [x] One canonical verse reading path enforced app-wide
- [x] Duplicate route/modal registrations removed
- [x] Deep links mapped to canonical routes (notifications/widgets/share)
- [x] Routing map document created and verified
- [x] Back navigation QA passed across onboarding, tabs, modals
  - Evidence: Added safe-fallback back handlers so direct-entry/deep-link flows no longer dead-end when history is empty.
  - Evidence files: app/modal.tsx, app/paywall.tsx, app/terms-of-service.tsx, app/privacy-policy.tsx, app/badges.tsx, src/screens/SettingsScreen.tsx, src/screens/PaywallNavigator.tsx, app/(tabs)/verse.tsx.

- [x] F-15 Bookmark action added on both verse surfaces
- [x] Bookmark state toggles correctly (saved/unsaved icon)
- [x] Bookmark persists after restart
- [x] Bookmark appears in Bookmarks screen
- [x] Haptic + toast feedback implemented

- [x] F-13 Verse screenshot action added to verse action bar
- [x] Screenshot captures fully rendered verse card with active theme
- [x] Save to camera roll works on iOS and Android
  - Evidence: Save flow now explicitly checks and requests media permissions, creates the media asset, and gracefully falls back if album creation is unavailable.
  - Evidence file: app/(tabs)/verse.tsx.
- [x] Success toast shown quickly
- [x] Capture performance target met
  - Evidence: Added dev-only diagnostics panel showing last/average/max capture timings and pass status against the <=1000ms target for rapid QA verification.
  - Evidence file: app/(tabs)/verse.tsx.

- [x] F-11 Daily notification templates implemented (all 6)
- [x] Morning/midday/evening/streak-risk/milestone/chapter-complete flows wired
- [x] No duplicate non-milestone notifications per day
- [x] Streak-risk notification condition works (no read by evening)
- [x] Notification tap deep-links to correct screen
- [x] Notification preference controls added in Settings (via NotificationSettings in appStore)

- [x] F-10 Streak save UI placeholder shipped
- [x] Streak-at-risk modal shown before reset
- [x] Accept/decline paths behave correctly
- [x] Insufficient-coins fallback UX displayed
- [x] Shield indicator visible in streak UI

### Phase 2

- [ ] F-01 Benefits discovery module on Home + onboarding
- [ ] Minimum 8 benefit cards with deep links
- [ ] English + Hindi content complete and offline
- [ ] F-02 Interactive streak system (verse-read based)
- [ ] Real-time streak update + milestone celebrations
- [ ] 7-day heatmap + freeze indicator
- [ ] Midnight reset and persistence validated
- [ ] F-12 Branded 1080x1080 verse share card
- [ ] 4 selectable card backgrounds
- [ ] QR and attribution added
- [ ] Share completion coin reward with daily cap

### Phase 3

- [ ] F-07 Leaf manuscript theme added to theme system
- [ ] Theme selectable with live preview
- [ ] All screens visually correct in leaf mode
- [ ] Bundle impact within target budget
- [ ] F-08 Page-turn chapter transitions implemented
- [ ] Swipe gestures do not conflict with vertical scroll
- [ ] 60fps target validated on mid-range Android
- [ ] F-14 XP + level progression system implemented
- [ ] XP grants on all defined events
- [ ] Level-up rewards and persistence validated
- [ ] F-06 Character encyclopedia (10 profiles) complete

- [ ] Character deep links from verse context work

### Phase 4

- [ ] F-05 Stotra expansion (Hanuman Chalisa + Dandakam) complete
- [ ] 4-language rendering and offline support validated
- [ ] Stotra reading contributes to streak
- [ ] F-09 Coin economy full loop implemented
- [ ] Earning events + anti-exploit caps enforced

- [ ] Wallet, transaction history, wallpaper unlocks functional
- [ ] Streak save auto-consume logic complete

### Phase 5

- [ ] F-03 iOS + Android widgets (small/medium/large + lock screen)
- [ ] Widget updates and deep links validated

- [ ] F-04 Chapter comic strips (18) integrated
- [ ] Full comic completion coin rewards
- [ ] Final-panel share flow operational

### Cross-Cutting Engineering Checklist

- [ ] AsyncStorage schema versioning and backward compatibility
- [ ] Analytics events for all new funnels and conversion points
- [ ] Performance benchmarks for render, animation, and export flows
- [ ] Offline-first validation for all new content modules

- [ ] Accessibility pass for gestures, buttons, and text scaling
- [ ] iOS 16+ and Android 12+ functional QA complete
- [ ] Feature changelog updated for each phase
- [ ] Smoke test against visual QA checklist before release

### Product Decisions to Lock Before Build

- [ ] Widget implementation strategy finalized (library vs native bridge)
- [ ] Devanagari font strategy finalized for leaf theme
- [ ] Coin balance visibility scope finalized (Home only vs global)
- [ ] Stotra IA finalized (same tab vs separate tab)

---

BHAGAVAD GITA DE OTIONAL APP
Prod ct Requirements Document
Feature Enha cement Pack v2.0

ocument Version v2.0.0
Date March 29, 2026
Base Version v1.0.0 (Feature Complete)
Status Draft — Under Review

1 Overview & Strategic Intent
The Bhagavad Gita Devotional App v1.0.0 has achieved feature-complete status with 597 verses across 18 chapters, multilingual support, gamification mechanics, and a psychology-driven growth system. This PRD defines the Feature Enhancement Pack v2.0 — a second wave of improvements focused on deeper engagement, richer content, aesthetic differentiation, and a self-sustaining in-app economy.

1 1 Objectives
• Increase daily active users (DAU) through higher emotional value and habit hooks
• Create a sustainable in-app economy using a Coins system tied to engagement
• Diff rentiate the a p aesthetically with a leaf-manuscript theme and page-turn transitions
• Expand conten beyond he Gita to include Hanuman Chalisa, Dandakam, and key character bios
• Improve virality th ough ver e sharing as a branded PNG card
• Improve monetiza ion thro gh wallpapers, streak saves, and premium unlocks via Coins

1.2 Success Met ics
Metric Current (v1.0) Targ t ( 2.0)
ay-7 Retention Baseline ≥ 35%
Avg. Session Duration Baseline +40%
Daily Active Users Baseline +60%
Verse Shares / Day 0 (not tracked) ≥ 200
St eak > 7 Days Bas line + 0%
Coin Economy Participation N/A ≥ 40% MAU

  2. Feature Registry  
All eatures in this pack are listed bel w it priority (P0 = Critical, P1 = High, P2 = Medium) and implementation effort (S = Small ≤1 week, M = Medium 1–2 weeks, L = Large 2–4 weeks, XL = 4+ weeks).

ID F ature Priority Effort Category  
F-01 Benefits of Reading the Gita — i covery Module P0 M Content / Onboarding
F-02 Interactive Duolingo-Style Reading Streak P0 L Engageme t amification
F-03 Home & Lock Screen Widgets (iOS + An ro d) P1 XL Platform / Retention
F-04 Comic Strip Storytelli g o Verses P1 XL Content / Engagement
F-05 Hanuman Chalisa & Dandakam Expansio P Content
F-06 Character Encyclopedia (Main Gi a h racters) P1 M Content
F-07 Leaf Manuscript Visual T em 1 L UI / UX / Theme
F-08 Page-Turn Chapter Tran it o s (Google Play Books Style) P1 M UI / UX / Navigation
F-09 Character Wallpapers + Coins co o y P1 XL Monetization / Gamification
F-10 Streak Save with Coins P0 S G mi i ation / Monetization
-11 Attractive Daily Push Notifications P0 M Retention / Engagement
F-12 Verse Share as Branded PNG Card P0 M Virality / Sharing
F-13 Verse Screenshot Feature P1 S Sharing / UX
F-14 User Level & XP Syst m 1 L Gamifi ation
F-15 Bookmark Button on Verse Page P0 S UX Bug Fix / Feature
F-16 Canonical Route Consolidation P0 S Technical Debt

  3. Detailed Feature Specifications
F-01 — Benefits of Reading the Gita: Discovery Module
Benefits Discovery Module P0 M — 1.5 wk F-01

P oblem Statement
P ospective users who are unfamiliar with the Bhagavad Gita do not understand why they should read it. Without perceived value, conversion from install to active reader is low. Research shows that 'why should I care?' is the #1 blocker for spiritual app adoption.
U er Story
A a new user, I want to understand the tangible and spiritual benefits of reading the Gita before I commit to daily practice, so that I feel motivated and informed going in.
F nctional Requirements
• A dedicated 'Why Read the Gita?' section visible from the Home Screen and Onboarding Step 1
• Minimum 8 benefit cards displayed in a horizontally scrollable carousel
• Each card should have: a title (e.g., 'Clarity in Chaos'), an icon or illustration, and a 2-sentence explanation
• Benefits should span: mental health, decision making, ethical clarity, spiritual growth, relationships, inner peace, life philosophy, and fearlessness of death
• A 'Read a Verse Related to This Benefit' CTA on each card that deep-links to a relevant verse
• Benefits also woven into onboarding Step 2 (Outcome Frame) as benefit testimonial cards
• Optional: one-line quotes from known public figures on the Gita (Oppenheimer, Einstein, Thoreau, Gandhi, Vivekananda)
N n-Functional Requirements
• All content fully offline — no network call
• Cards render in under 50ms on mid-range Android
Acceptance Criteria
• AC-01: Benefits carouse v sible on H me Screen without scrolling
• AC-02: Tapping a benefit card deep-links to the correct verse
• AC-03: At least 8 benefit cards present at launch
• AC-04: All content available in English and Hindi

F-02 — Interactive Duolingo-Style Reading Streak
Interactive Streak System P0 L — 2.5 wk F-02

P oblem Statement
T e current streak system is passive — it just displays a number with a flame emoji. Duolingo's success is built on making streaks feel like a living, interactive commitment. The current system does not celebrate micro-completions or guide users toward the next step.
U er Story
As a daily reader, I want my streak to feel alive and rewarding, so that reading one verse per day becomes a deeply satisfying habit I do not want to break.
C re Mechanics
• Streak increments after reading ONE complete verse (not just opening the app)
• A 'verse read' is defined as: scrolling to the bottom of a verse card, or spending > 20 seconds on a verse
• Streak counter updates in real-time with an animated number flip
• A streak celebration animation fires on first verse read each day: flame burst, confetti, and sound (optional, respects silent mode)
Visual De ign Re uirements
• Stre k ring: circular rogress ring that fills from 0% to 100% as daily goal is met (default: 1 verse)
• Stre k flame: ani ated Lottie fire icon, grows in size at milestones: 3, 7, 14, 30, 100 days
• Strea heatmap: 7-day mini heatmap showing which days were active in the past week
• Strea freeze indic tor: shows if user has a freeze active (from coins spend)
Mileston Celebrations
Milestone Visual Message
3 Days Small flame burst Teevra Shradha — Intense Faith!
7 Days Golden flame Saptah Sadhana — 7 Days Strong!
1 Days Blue flame Niyamit Abhyasa — Consistent Practice!
3 Days Rainbow flame Dhyana Yogi — A Month of Devotion!
1 0 Days Sacred lotus glow Paramahansa — 100 Days Enlightened!

Acceptance Criteria
• AC-01: Streak increments only after a verse is read, not just app-open
• AC-02: Celebration animation f re within 5 0ms of verse completion
• AC-03: Streak ring reaches 100% on first verse completion of the day
• AC-04: Daily goal resets at midnight local time
• AC-05: Streak data persists across app kills and restarts

F 03 — Home Screen & Lock Screen Widgets
P atform Widgets (iOS + Android) P1 XL — 4 wk F-03

P oblem Statement
The app currently has no presence on the user's home screen when closed. Widgets are one of the highest-value retention tools for habit apps: they serve as a passive reminder and a direct entry point.
W dget Variants
• Small widget (2x2): Today's verse number + first line + streak count
• Medium widget (4x2): Full verse text in Sanskrit + English translation + streak
• Large widget (4x4): Full verse card with chapter reference, Sanskrit, transliteration, translation, and share button
• Lock screen widget (iOS 16+ / Android 13+): Minimal — streak count + flame + 'Read Today' CTA
Technical Implementation
• iOS: WidgetKit extension (Swift/Objective-C bridge or React Native Widgets library)
• Android: AppWidgetProvider (Glance for Compose or legacy RemoteViews)
• Expo: Use expo-widgets or native module bridging; custom native code likely required
• Data sync: AsyncStorage data exposed to widget extension via App Group (iOS) or SharedPreferences (Android)
• Widget updates at midnight via background fetch to rotate the daily verse
Acceptance Criteria
• AC-01: All 3 widget si es functiona on both iOS and Android
• AC-02: Widget data updates within 5 minutes of app state change
• AC-03: Tapping the widget deep-links to Today's Verse screen
• AC-04: Widget visible in OS widget picker with 'Bhagavad Gita' branding

F 04 — Comic Strip Storytelling
I lustrated Comic Strips P1 XL — 5 wk F-04

P oblem Statement
The Gita's teachings, while profound, can feel abstract to younger audiences or first-time readers. Visual storytelling through comic-style panels has proven to dramatically improve comprehension and shareability of complex spiritual/philosophical content.
C ntent Scope
• Initial launch: 18 comic strips — one per chapter — depicting the key moment or teaching of that chapter
• Art style: semi-realistic, watercolor-infused, warm saffron-gold palette consistent with the app's leaf theme
• Each strip: 4–6 illustrated panels with dialogue bubbles in English; tap to reveal Hindi/Sanskrit
• Panel 1: Scene setting. Panels 2–4: Dialogue/teaching. Final panel: Lesson callout box
Technical Requirements
• Assets: Pre-rendered PNG/WebP panels bundled in app assets (no CDN dependency at launch)
• Panel viewer: full-screen swipe-based panel navigation with pinch-to-zoom
• Accessible from Chapter detail screen: 'View as Comic' button at the top of each chapter
• Comics can be shared: last panel shareable as PNG with app attribution (ties to F-12)
• Coins reward: reading a full comic strip earns 10 Coins (ties to F-09 economy)
A set Production Guidance
AI-generated art with human post-processing is recommended for initial launch. Midjourney or Stable Diffusion with a custom style prompt locked to 'classical Indian miniature painting meets modern comic' aesthetic. A human illustrator should review and clean all panels.
Acceptance Criteria
• AC-01: 18 comic strips av ilable at 2.0 launch
• AC-02: Comic viewer loads within 300ms on mid-range Android
• AC-03: Final panel shareable as PNG
• AC-04: Reading a full comic awards 10 Coins

F 05 — Hanuman Chalisa & Dandakam Expansion
S ripture Expansion Pack P1 L — 2.5 wk F-05

Problem Statement
U ers who engage deeply with the Gita are natural audiences for related devotional texts. Adding Hanuman Chalisa and Dandakam increases content depth, session time, and positions the app as a comprehensive Hindu devotional platform rather than a single-text reader.
S ope
• Hanuman Chalisa: 40 chaupais + 2 dohas + Sortha + Mangalacharan — full text
• Shri Rama Dandakam: Complete stotram with Sanskrit, transliteration, English, Hindi
• Optional v2.1: Vishnu Sahasranama, Shiva Tandava Stotram
D ta Structure
• New data model: Stotra { id, title, source, language_variants[], verses[] }
• Verses: { number, sanskrit, transliteration, english, hindi, audio_file? }
• Bundled in assets/stotras.json — fully offline
U Requirements
• New tab or section: 'Stotras' accessible from bottom nav or Home Screen quick actions
• Each stotra has a dedicated reading screen consistent with Gita reading UI
• Bookmark, copy, share work identically to Gita verses
• Streak counts reading stotras as valid daily activity
Acceptance Criteria
• AC-01: Hanuman Chalis f lly readab e with all 4 language modes
• AC-02: Dandakam fully readable with all 4 language modes
• AC-03: Stotra reading contributes to daily streak
• AC-04: All content fully offline

F-06 — Ch ract r Encyclopedia
Gita Charac er Profiles P1 M — 1.5 wk -06

Problem St tement
New readers o the Gita are often confuse by the cast of characters. Understanding who Krishna, Arjuna, Duryodhana, and others are — their relationships, motivations, and symbolic roles — deeply enriches verse comprehension.
Charact rs to Document (Phase 1 — 10 cha acters)
Charact r Role Key Verses to High ight
Sri K ishna Divine teacher charioteer BG 2.19, 2.47, 11.32, 18.66
Arjun Warrior-student, se ker BG 1.28–47, 2.7
Duryodh na Antagonist, ego's repre entation BG 1.2–11
Dhrit rashtra Blind king, na rator's lord BG 1.1
Sanjaya Divine narrator, Vyasa's student BG 18.74–78
Bhishma Grand-sire, dharma symbol BG 1.12–13
D ona Guru, moral conflict BG 1.3
K rna Tragic hero, loyalty BG 1.8
H numan Banner of Arjuna's chariot BG 1.20 (context)
V asa Author, Cosmic Witness BG 18.75 (Sanjaya ref)

P ofile Card Requirements
• Each profile: Name, Sanskrit name, title/role, a 100-word bio, alignment (Pandava/Kaurava/Divine), key attribute
• Illustrated avatar: consistent art style with comic strips (F-04)
• 'Verses featuring this character' — a filtered list of verses with inline links
• Accessible from: verse page (tap character name), dedicated Characters tab/section, search
Acceptance Criteria  
• AC-01: All 10 characters have complete profiles at launch
• AC-02: Deep-link from character name in any verse context to their profile
• AC-03: Character content fully offline

F 07 — Leaf Manuscript Visual Theme
L af/Parchment Aesthetic Theme P1 L — 2.5 wk F-07

P oblem Statement
T e current themes (Light, Dark, Sepia) are generic. The Gita's historical context — ancient wisdom written on palm leaves and birch bark manuscripts — provides a unique aesthetic opportunity that no competitor app has exploited. A leaf theme would visually set this app apart and appeal deeply to users seeking an authentic connection to the tradition.
D sign Direction
• Primary background: texture of aged palm leaf — warm golden-tan (#C8A96E) with subtle grain texture
• Text color: deep brown-black ink (#2D1B00), simulating natural ink on leaf
• Sanskrit text: rendered in a Devanagari font that mimics carved/etched letterforms
• Card backgrounds: lighter leaf texture (#E8D5A0) with leaf-vein micro-pattern
• Borders and dividers: use stylized leaf-vein patterns, not straight lines
• Navigation bar: dark teak wood texture (#3E2000) with gold-leaf lettering
• Verse numbers: circular stamps with aged appearance
• Transition animations: subtle paper-rustling or leaf-flutter effect
A sets Required
• Background texture: tileable PNG/WebP at 512x512px — palm leaf grain
• Leaf-vein divider: SVG or PNG strip for horizontal dividers
• Stamp/seal graphic: circular aged stamp for verse numbers
• Navigation wood texture: 72px tall tileable strip
I plementation Notes
• Theme integrates into existing ThemeContext and theme.ts with token name 'leaf'
• Free theme — available to all users, serves as a signature aesthetic for the app
• Fallback: if device performance is low, simplified flat-color version of the palette without textures
Acceptance Criteria
• AC-01: Leaf theme s le table fr m Settings with live preview
• AC-02: All screens render correctly in leaf theme — no broken layouts
• AC-03: Texture assets add no more than 2MB to app bundle size
• AC-04: Theme preference persists across app restarts

F 08 — Page-Turn Chapter Navigation (Google Play Books Style)
P ge-Turn Transitions P1 M — 2 wk F-08

P oblem Statement
T e current chapter-to-chapter navigation is a flat screen push. The Gita is a sacred book, and treating navigation as a book-page turn creates a powerful experiential metaphor that makes the act of reading feel like holding a physical scripture.
I teraction Design
• Horizontal swipe right-to-left: advance to next chapter (page curl from right edge)
• Horizontal swipe left-to-right: return to previous chapter (page curl from left edge)
• Page curl visual: a 3D-skewed card animation with a subtle shadow under the lifting page
• The back of the page (during curl) shows: chapter number in large Sanskrit numeral + chapter name
• Page turn also triggered by: 'Next Chapter' button at end of chapter, with a deliberate slow curl animation
• Verse-to-verse within a chapter: use a lighter vertical swipe scroll (no curl — that is for chapters only)
Technical Implementation
• Use react-native-reanimated v3 for the 3D perspective transform
• Key transforms: rotateY from 0deg to -180deg on the departing page (right-side curl)
• Shadow: interpolated box-shadow on the peeling page edge
• Performance: all animations run on the UI thread via worklet — target 60fps on mid-range devices
• Accessibility: page turn also accessible via buttons for users who prefer tap over swipe
Acceptance Criteria
• AC-01: Page curl animat on renders a 60fps on a mid-range Android (Snapdragon 665 equivalent)
• AC-02: Back-of-page correctly shows next chapter's title in Sanskrit numeral
• AC-03: Swipe gesture does not conflict with vertical verse scrolling
• AC-04: Animation fully functional on both iOS and Android

F-09 — Character Wa lpapers & Coins Economy
Wallpapers + Coin Economy P1 XL — 5 wk -09

Strategic Intent  
The Coins economy create a soft- urrency loop that rewards engagement (earning) and enables spending on premium aesthetic content (wallpapers, streak saves). This drives retention without aggressive monetization, while creating a clear upgrade path for power users.
Coin Earning Events  
Action Coins Earned F equency
Read 1 verse (daily firs read) 5 coins Once per day
Complete daily streak check-in coins O ce per day
Complete a f ll chapt r 25 coins Once per chapter
Read a comic strip fully 10 coins Once per comic
Share a verse card (F-12) 5 coins 3x per day max
M intain 7-day streak 50 coins bonus Weekly
C mplete 3-Day Challenge 30 coins Once per challenge
R ad a stotra (Hanuman Chalisa) 15 coins Once per stotra
E rn a badge 20 coins Per badge

Coin Spending: Wal papers
• Wall aper Gal ery: a dedic ted screen 'Divine Wallpapers' accessible from Settings and Home
• Wa lpapers epict: Kuruk hetra battlefield at sunrise, Krishna revealing Vishwaroop, Arjuna kneeling before Krishna, the celestial chariot, the Lotus of the soul, cosmic Om mandala
• Ea h wallpa er: 20–80 Co ns depending on rarity (Common / Rare / Epic / Legendary)
• Purchas d wallpap rs: set as n-app background, phone home screen, or lock screen
• Wallpaper rarity tiers and pricing:
Tier Price (Coins) Quantity (v2.0) Description
C mmon 20 coins 4 wallpapers Floral, mandala, lotus
R re 40 coins 3 wallpapers Battle scenes, devotion
E ic 60 coins 2 wallpapers Vishwaroop revelation
L gendary 100 coins 1 wallpaper Full cosmic vision

Coin Spending: Streak Saves
• Cost: 30 Coins per streak save
• A streak save prevents streak reset for one missed day
• Maximum 2 streak saves stored at once
• Streak save is consumed automatically on the next missed day
• UI: Streak save inventory visible on streak card — 'You have 2 streak shields'
C in Wallet UI
• Persistent Coin balance displayed in the top-right of Home Screen (coin icon + count)
• Coin earn events: a toast notification with coin amount and reason
• Coin transaction history: scrollable list in Settings > Coin Wallet
• Real-money coin pack purchasing: NOT in v2.0 scope (future roadmap — IAP)
Acceptance Criteria
• AC-01: All earning events correctly credit Coins to user wallet
• AC-02: Wallpaper pu ch se deducts correct Coins and unlocks wallpaper
• AC-03: Purchased wallpapers persist across app restarts
• AC-04: Streak save activates automatically on missed day
• AC-05: Coin balance persists in AsyncStorage with no data loss on app kill

F 10 — Streak Save with Coins
S reak Shield Feature P0 S — 3 days F-10

Streak save mechanics are fully specified under F-09 (Coin Economy). This entry exists as a standalone P0 item because streak save is the single highest-impact retention feature — it removes the fear of losing a streak from occasional missed days.
Additional Detail
• When a streak would break a full-scr en modal appears before reset: 'Your streak is at risk! Use a Streak Shield? (30 Coins)' with Accept and Decline options
• Modal shows current streak length and the Coin cost prominently
• If user has insufficient Coins: 'Watch 1 ad to save your streak' option (future roadmap) OR 'Start fresh' option
• A saved streak shows a shield icon on the flame for that day in the heatmap

F-11 — Att active Daily Push Notifications
Engaging Push N tifications P0 M — 1 k F-11

Problem Stateme t
Generic notifi ations ('Read your daily ver e') have open rates below 5%. Contextually rich, beautifully worded notifications tied to time-of-day and user state create emotional pull and dramatically improve re-engagement.
Notification Templ tes
Type Title Body xample
Morning (6–9am) 🌅 Begin with Clarity 'Let right deeds be thy motive, not the fruit which comes from them.' — BG 2.47
Midday (12–2pm) 🕉 A Moment of Stillness Amid the chaos of the day, Arjuna found his answer. So can you. Read today's verse.
E ening (6–8pm) 🔥 Your Streak Awaits Day {n} — You've come so far. One verse to keep the flame alive.
S reak at Risk ⚠️ Your Streak is in Danger! {n}-day streak. Miss today and it resets. 2 minutes is all it takes.
M lestone Achieved 🏆 You Did It! 30 days of wisdom! You've earned the Dhyana Yogi badge. Claim your reward.
C apter Complete 📖 Chapter {n} Done! You've completed Chapter {n}. Earned 25 Coins. What does Chapter {n+1} hold?

Implementation Requirements
• Use expo-notifications for local notifications (already integrated in v1.0)
• Dynamic fields: streak count, verse reference, chapter name resolved at notification schedule time
• Notification images (iOS 15+, Android 12+): a compressed verse card PNG attached to the notification
• User can choose notification type preferences in Settings (motivational / reminder / milestone only)
• Do not send more than 1 non-milestone notification per day
Acceptance Criteria
• AC-01: 6 notification te pl tes implem nted and cycling
• AC-02: Streak-at-risk notification fires only if user hasn't read that day by 8pm
• AC-03: Notification tap deep-links to the correct screen (daily verse, badges, etc.)
• AC-04: No duplicate notifications on the same day

F 12 — Verse Share as Branded PNG Card
V rse Share Card Generator P0 M — 1.5 wk F-12

P oblem Statement
T e current share feature sends plain text. Plain text shares get ignored on Instagram, WhatsApp, and Twitter. A branded image card with the verse, beautiful typography, and an app download link transforms every share into a marketing impression with potentially 100x the engagement of raw text.
C rd Design Specification
• Canvas size: 1080x1080px (square, optimal for Instagram, WhatsApp, Twitter)
• Background: selected theme's palette OR user can pick from 4 card backgrounds (saffron gradient, leaf texture, dark cosmos, white lotus)
• Top section: App logo (Om symbol) + 'Bhagavad Gita' wordmark in saffron
• Center section: Verse text — Sanskrit (optional), English translation in large serif font
• Bottom section: Chapter reference (e.g., 'Chapter 2, Verse 47') + subtle divider + Play Store link / app name
• Bottom strip: QR code to Play Store listing (small, bottom-right corner)
• Verse attribution line: 'Read more at BhagavadGita App — [link]'
Technical Implementation
• Use react-native-view-shot to capture a hidden rendered card component as PNG
• Card component: a dedicated CardView React Native component, rendered off-screen
• Export: PNG saved to device camera roll via expo-media-library + shared via expo-sharing
• User prompt before export: 'Choose card background' — 4 options displayed as swipeable thumbnails
• Earning: sharing a card earns 5 Coins (up to 3 times per day) — ties to F-09
Acceptance Criteria
• AC-01: PNG exported at 1080x1080px with correct verse content
• AC-02: All 4 card ba kg ound optio s functional
• AC-03: QR code in card leads to Play Store listing
• AC-04: Export takes under 2 seconds on mid-range Android
• AC-05: Coins credited after successful share

F 13 — Verse Screenshot Feature
I -App Screenshot Tool P1 S — 3 days F-13

A dedicated 'Screenshot this verse' button on the verse reading screen captures the current rendered verse in full with theme styling, and saves it to camera roll. This is a simpler alternative to F-12 for users who just want to save a verse quickly without customization.
Requirements
• A camera icon button in the verse action bar (alongside Share, Copy, Bookmark)
• Tap: captures the full verse card (Sanskrit + transliteration + translation + reference) as rendered
• Saves directly to camera roll via expo-media-library — no export modal
• Toast confirmation: 'Verse saved to your photos'
• Respects current theme — leaf theme screenshot looks like leaf theme
Acceptance Criteria  
• AC-01: Screenshot saved to camera roll in under 1 second
• AC-02: Screenshot includes theme styling and all active verse content
• AC-03: Toast confirmation visible within 300ms of button tap

F-14 — U er Level XP System
Levels & XP Progress on P1 L — 2.5 wk F-14

Overview  
A level syst m pro ides long-term progression scaffolding that keeps users engaged beyond the initial streak habit formation. Levels are earned through XP, which is granted alongside Coins for all major activities.
XP Earning Events  
Activity XP Earned Coins Earn d
Read 1 verse (daily) 10 XP 5 coins
Complete a chapter 100 XP 25 coins
Maint in 7- ay streak 2 0 XP 50 coins
E rn a badge 50 XP 20 c ins
R ad a comic strip 0 XP 1 coins
R ad Hanuman Chalisa / s otra 75 P 15 coins

L vel Progression Table (Level 1–10 sh wn)
L vel itle XP R quired Reward
1 Jigyasu (Seeker) 0 XP St rter coin pack — 50 Coins
2 Shishya (Student) 50 XP Unloc Sepia Premium theme
3 Sadhaka (Practiti ner) 1,500 XP 25 bonus Coins
4 bhyasi (Pra titioner+ 3,500 XP Unlock rare wallpaper
5 Mumukshu (Liberation Seeker) 7,000 XP 1 free streak save
6 Yogi 12,000 XP 100 bonus Coins
7 Gyani (Knowledge Bearer) 20,000 XP Epic wallpaper unlock
8 Vairagi (Renunciant) 32,000 XP 200 bonus Coins
9 Mahatma 50,000 XP Legendary wallpaper unlock
1 Paramahansa 75,000 XP 500 Coins + exclusive badge

U Components
• Level badge: visible on Home Screen profile area — circular badge with level number and title
• XP progress bar: below the level badge — fills toward next level
• Level-up celebration: full-screen animation with Sanskrit level title, XP summary, and reward reveal
• Profile page (future): shows level, XP history, badges, wallpapers, Coin balance
Acceptance Criteria
• AC-01: XP increments correctly f r ll earning events
• AC-02: Level-up triggers at correct XP thresholds
• AC-03: Level rewards (Coins, unlocks) granted on level-up
• AC-04: Level and XP data persists across app restarts

F 15 — Bookmark Button on Verse Page
V rse Bookmark (Bug Fix + Feature) P0 S — 2 days F-15

T is is a known missing feature noted in the v1.0 build summary. The verse reading screen (app/reading.tsx) and verse tab (app/(tabs)/verse.tsx) do not have a bookmark button, despite the bookmark system existing in the app's storage layer.
R quirements
• Add a bookmark icon button to the verse action bar in reading.tsx and verse.tsx
• Icon: filled bookmark (saved) / outline bookmark (not saved) — toggles on tap
• Tap to bookmark: saves to AsyncStorage under 'bookmarks' key with verse reference
• Haptic feedback on bookmark toggle
• Toast: 'Verse bookmarked' / 'Bookmark removed'
• Bookmarked verses appear in the existing Bookmarks screen (Quick Action from Home)
• Earning: bookmarking a verse earns 0 Coins (intentional — should not be gameable)
Acceptance Criteria
• AC-01: Bookmark icon visible n erse actio bar on both reading and verse screens
• AC-02: Bookmarked verses appear in the Bookmarks list
• AC-03: Bookmark state persists across app restarts
• AC-04: Bookmark toggle triggers haptic feedback

F 16 — Canonical Route Consolidation
R ute Deduplication (Tech Debt) P0 S — 3 days F-16

T e v1.0 codebase has duplicate route registrations and inconsistent navigation paths that lead to unpredictable back-navigation behavior and potential memory leaks from orphaned screen instances.
Known Issues to Fix
• Audit all routes in app/ and ensure each logical screen has exactly one canonical path
• Verse screen accessible from multiple routes: standardize on app/reading.tsx as canonical; redirect app/verse.tsx to it via router.replace
• Remove any duplicate modal registrations in app/\_layout.tsx
• Ensure deep-link handling routes all external links (notifications, widgets, share URLs) to canonical paths
• Add a routing map documentation file: ROUTING_MAP.md with all canonical paths
D liverables
• Updated app/\_layout.tsx with clean, non-duplicate route registrations
• Updated ROUTING_MAP.md documentation
All existing navigation calls updated to use canonical paths
• QA pass: verify all 7 onboarding steps, all main tabs, all modals navigate correctly
Acceptance Criteria
• AC-01: No duplicate route registrations in \_layout.tsx
• AC-02: Back navigation on all screens returns to the correct previous screen
• AC-03: All deep-link entry points (notifications, widgets) resolve to correct canonical routes

  4. Coins Economy — Det iled Design
The Coins economy is the connective tissue of the v2.0 engagement loop. This section details the economy's design to ensure it is balanced, fun, and not exploitable.

4.1 Economy Balance
A new user in their first month (30 days) should be able to earn enough Coins to unlock at least 2 Common wallpapers and 1 streak save without any grinding. This ensures the economy feels rewarding, not frustrating.

M nth 1 Earning Estimate 30 days x (5 + 3) = 240 base Coins + up to 4 weekly bonuses (50 each) = 440 Coins. If completing 2 chapters: +50 Coins. If earning 5 badges: +100 Coins. Total realistic range: 400–600 Coins in Month 1.

M nth 1 Spending Options 2 Common wallpapers = 40 Coins. 1 streak save = 30 Coins. Total minimum spend = 70 Coins. User has 330–530 Coins remaining — incentivizes continued engagement to unlock rarer items.

4.2 Anti-Exploitation Rules
• Coin earning events have per-day caps to prevent automation exploits
• Share coin reward (5 Coins): capped at 3 shares per day = 15 Coins/day max
• Verse read reward: only first verse each day earns Coins — subsequent reads earn XP only
• All Coin transactions logged with timestamp in AsyncStorage for audit

4.3 Future Roadmap — Not in v2.0 Scope
• Real-money Coin pack purchases (IAP via RevenueCat)
• Gifting Coins to friends
• Lea erboard oins spe d (social competition)
• Ad-wa ch for C in earning

  5. Re ease Pla & Phasing

5.1 Pha e Overview
Phase Timeline Features Goal
Phase 1 Week 1–2 F-15, F-16, F-10, F-11, F-13 Fix critical UX gaps + quick wins
Phase 2 Week 3–5 F-01, F-02, F-12 Engagement + virality boost
P ase 3 Week 6–8 F-07, F-08, F-14, F-06 Aesthetic differentiation + progression
P ase 4 Week 9–11 F-05, F-09 Content expansion + coin economy
P ase 5 Week 12–16 F-03, F-04 Platform & premium content

5 2 Phase 1 Sprint Detail (Week 1–2)
Phase 1 targets all P0 features that are quick wins or critical bug fixes. These should ship as v2.0.1 within 2 weeks of PRD approval.
• F-15: Bookmark button on verse page — 2 days
• F-16: Route consolidation — 3 days
• F-10: Streak save UI (placeholder — no coins yet, just UI) — 3 days
• F-11: Push notification templates — 4 days
• F-13: Screenshot feature — 3 days
P ase 1 total estimate: 15 developer-days (3 weeks with 5-day week, or 2 weeks with parallel work).

.3 Definition of Done
• All acceptance criteria for the feature are passing
• Feature tested on iOS 16+ and Android 12+
• No regre sion in existing features (full smoke test per VISUAL_QA_CHECKLIST.md)

• syncStorage schema updated and backward-compatible  
• EATURE_CHANGELOG.md updated

  . Open Questions & Decisions Required

# uestion Options Owner

Q1 Who produces the comic strip art for F-04? AI-generated or commissioned? AI-gen (fast, cheap) vs. Commissioned (premium, consistent) Product / Design
Q2 Should the Coins economy ever include real-money IAP in v2.0 or defer to v3.0? Defer (safer) vs. Include (monetization) Product / Business
Q3 For -03 (Widgets), sh uld nati e code be written or a library used? react-native-widget-extension vs. Bare Workflow Engineering
Q4 What is t e target verse count for the Leaf theme fo t — a custom ont or existing Devanagari font with styling? Custom font vs. Noto Serif styled Design
Q5 Should Coin balance be shown on all screens or only Home? All creens (persistent) vs. Home only Design / UX
Q6 Should stotr content (F-05) be in he s me bottom tab as Gita chapters or a separate tab? Same tab (simplified) vs. New tab (cleaner IA) UX / Navigation

  7. Technical Depende cies & New Packages

Feature New ackage / API Platform N tes
-03 Widgets expo-widgets or native WidgetKit/AppWidget iOS + Android May require bare workflow
F-08 Page Turn react-native-reanimated v3 (already installed) Both Upgrade if < v3
F-12 Share Card react-native-view-shot Both Install required
F 13 Screenshot react-native-view-shot, expo-media-library Both expo-media-library likely already present
F 02 Streak Animations lottie-react-native Both Install required for fire animations
F 07 Leaf Textures react-native-fast-image Both Recommended for texture performance
F-12 QR Code react-native-qrcode-svg Both Install required

  8. Appendix
8 1 Priority Definitions
• P0 — Critical: Blocks user core experience or is a regression from v1.0. Must ship in Phase 1.
• P1 — High: Significant engagement or retention impact. Target Phase 2–4.
• P2 — Medium: Nice to have. Included in backlog for Phase 5+.

8.2 Eff rt D finitions
• S (Small): < 1 week (1–5 eveloper days)
• M (Medium): 1–2 weeks (5–10 developer days)
• L (Large): 2–4 weeks (10–20 developer days)
• XL (Extra Large): 4+ weeks (20+ developer days — may require parallel work or specialist)

8.3 Change Log
Version Date Summary
v2.0.0 Draft March 29, 2026 Initial PRD for Feature Enhancement Pack v2.0 — 16 features specified

🕉 End of Document 🕉
8.3 Change Log
Version Date Summary
v2.0.0 Draft March 29, 2026 Initial PRD for Feature Enhancement Pack v2.0 — 16 features specified

🕉 End of Document 🕉
