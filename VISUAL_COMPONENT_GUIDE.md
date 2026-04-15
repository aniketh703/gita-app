# 🎨 Visual Component Reference

Quick visual guide to all new UI/UX components and their usage.

---

## 📦 Component Categories

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   🎯 VISUAL FEEDBACK & INTERACTIONS                    │
│   ├── AnimatedPressable      Scale animation + haptics │
│   ├── AnimatedCard            Subtle press feedback    │
│   ├── Toast                   Action notifications     │
│   └── LoadingSkeleton         Content loading states   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   📊 PROGRESS & ANALYTICS                              │
│   ├── ProgressIndicator       Linear progress bars     │
│   ├── CircularProgress         Circular indicators     │
│   └── ReadingStats            User metrics display     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ♿ ACCESSIBILITY                                      │
│   ├── AccessibleText          ARIA-compliant text      │
│   ├── AccessibleButton        Accessible interactions  │
│   ├── EnhancedTouchTarget     Minimum 44x44pt targets  │
│   └── ScreenReaderOnly        Screen reader text       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   💾 DATA & PERSISTENCE                                │
│   ├── saveReadingProgress     Track verse position     │
│   ├── getReadingProgress      Retrieve last read       │
│   ├── addBookmark             Save favorite verses     │
│   ├── getBookmarks            Retrieve all bookmarks   │
│   └── getReadingStats         User analytics          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎬 Animation Examples

### AnimatedPressable

```
┌────────────────┐
│    [Button]    │  ← Normal state
└────────────────┘

        ↓ User presses

┌──────────────┐
│   [Button]   │    ← Scales to 0.95
└──────────────┘
      + 📳 Haptic feedback (if enabled)

        ↓ User releases

┌────────────────┐
│    [Button]    │  ← Springs back to 1.0
└────────────────┘
```

### LoadingSkeleton

```
┌─────────────────────────────────┐
│ ▓▓▓▓▓░░░░░░░░░░░░░░░░░         │  ← Shimmer animation
│ ▓▓▓▓░░░░░░░░░░░░░                │     (moves left to right)
│ ▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░        │
└─────────────────────────────────┘
     Opacity: 0.3 → 1.0 → 0.3 (loops)
```

---

## 📱 Screen Layouts

### Home Screen - Before vs After

**Before:**
```
┌─────────────────────────┐
│   Bhagavad Gita        │
│   "Spiritual Wisdom"    │
├─────────────────────────┤
│                         │
│   📊 18 Chapters        │
│   📖 700 Verses         │
│                         │
│   [Start Reading]       │
│                         │
│   About this app...     │
│                         │
└─────────────────────────┘
```

**After:**
```
┌─────────────────────────┐
│   Bhagavad Gita        │
│   "Spiritual Wisdom"    │
├─────────────────────────┤
│ 🔄 Continue Reading     │  ← NEW! Personalization
│ Chapter 3, Verse 12    │
│ [→]                    │
├─────────────────────────┤
│ 📊 Your Progress        │  ← NEW! Statistics
│ 45 verses | 3 day🔥   │
│ 15 bookmarks           │
│ ████████░░░░ 35%       │  ← NEW! Progress bar
├─────────────────────────┤
│   📊 18 Chapters        │
│   📖 700 Verses         │
│                         │
│   [Start Reading]       │
│                         │
│   About this app...     │
└─────────────────────────┘
```

### Chapters Screen - Before vs After

**Before:**
```
┌─────────────────────────┐
│ 1  Chapter 1            │
│    47 verses            │
├─────────────────────────┤
│ 2  Chapter 2            │
│    72 verses            │
├─────────────────────────┤
│ 3  Chapter 3            │
│    43 verses            │
└─────────────────────────┘
```

**After:**
```
┌─────────────────────────┐
│ Continue from...        │  ← NEW! Context
│ Chapter 3, Verse 12    │
├─────────────────────────┤
│ 1  Chapter 1            │
│    47 verses            │
│    ████████████░ 85%    │  ← NEW! Progress
├─────────────────────────┤
│ 2  Chapter 2            │
│    72 verses    ✓       │
│    ████████████ 100%    │
├─────────────────────────┤
│ 3  Chapter 3     📖     │  ← NEW! "Reading" badge
│    43 verses            │
│    ██████░░░░░░ 45%     │
└─────────────────────────┘
   ↑ Animated press feedback
```

### Reading Screen - Before vs After

**Before:**
```
┌─────────────────────────┐
│ Home / Chapters / Ch 3  │
├─────────────────────────┤
│                         │
│ 3.1                     │
│ [Sanskrit]              │
│ गतासूनगतासूंश्च...    │
│                         │
├─────────────────────────┤
│ 3.2                     │
│ [Sanskrit]              │
│ श्रेयान्स्वधर्मो...     │
│                         │
└─────────────────────────┘
```

**After:**
```
┌─────────────────────────┐
│ ████████░░░░░░ 45%      │  ← NEW! Chapter progress
│ 43 verses in chapter    │
├─────────────────────────┤
│ 3.1              🏷️     │  ← NEW! Bookmark button
│ [Sanskrit]              │
│ गतासूनगतासूंश्च...    │
│                         │
│ Arjuna said: But by... │  ← NEW! Preview
│ Tap to read more →      │
├─────────────────────────┤
│ 3.2              🔖     │  ← Bookmarked (filled)
│ [Sanskrit]              │
│ श्रेयान्स्वधर्मो...     │
│                         │
│ The Lord said: O son... │
│ Tap to read more →      │
└─────────────────────────┘
   ↑ Animated cards with haptics
   ↑ Toast appears on bookmark
```

---

## 🎨 Color System

### Light Theme
```
┌─────────────────────────────────────┐
│ Background:   #ffffff               │
│ Text:         #000000               │
│ Secondary:    #666666               │
│ Accent:       #8B4513 (brown)       │
│ Border:       #eeeeee               │
│ Card BG:      #f9f9f9               │
└─────────────────────────────────────┘
```

### Dark Theme
```
┌─────────────────────────────────────┐
│ Background:   #1a1a1a               │
│ Text:         #ffffff               │
│ Secondary:    #aaaaaa               │
│ Accent:       #d4a574 (tan)         │
│ Border:       #333333               │
│ Card BG:      #2a2a2a               │
└─────────────────────────────────────┘
```

---

## 🎯 Touch Target Zones

### Minimum Standards

```
Standard Button (iOS/Android):
┌─────────────────────┐
│      44 x 44 pt     │  ← Minimum touch target
│    [Button Text]    │
└─────────────────────┘

Small Icon with Enhanced Target:
         ┌───────────────┐
         │   44 x 44 pt  │
         │   ┌─────┐     │
         │   │ 🔖  │     │  ← 24x24 icon
         │   └─────┘     │  ← 44x44 hit area
         └───────────────┘
```

### Accessibility Contrast

```
Normal Text (4.5:1):
─────────────────────────
Light: #000000 on #ffffff ✓
Dark:  #ffffff on #1a1a1a ✓

Large Text (3:1):
─────────────────────────
Light: #666666 on #ffffff ✓
Dark:  #aaaaaa on #1a1a1a ✓
```

---

## 📊 Progress Visualization

### Linear Progress Bar

```
Label: Reading Progress        74%
┌─────────────────────────────────┐
│████████████████████████░░░░░░░░│  ← 74% complete
└─────────────────────────────────┘
  Current: 45 / Total: 61 verses
```

### Circular Progress

```
        ╭─────────╮
       ╱           ╲
      │     74%     │
       ╲           ╱
        ╰─────────╯
         Complete
```

---

## 🔔 Toast Notifications

### Success Toast
```
┌──────────────────────────────────┐
│ ✓  Verse bookmarked!             │  ← Green background
└──────────────────────────────────┘
    ↑ Slides in from top
    ↑ Auto-dismisses after 3s
```

### Error Toast
```
┌──────────────────────────────────┐
│ ✕  Failed to save bookmark       │  ← Red background
└──────────────────────────────────┘
```

### Info Toast
```
┌──────────────────────────────────┐
│ ℹ  Bookmark removed              │  ← Blue background
└──────────────────────────────────┘
```

---

## 🎭 State Variations

### Button States

```
Normal:     ┌─────────────┐
            │   [Button]  │
            └─────────────┘

Pressed:    ┌───────────┐
            │ [Button]  │    ← Scaled to 0.95
            └───────────┘

Disabled:   ┌─────────────┐
            │  [Button]   │   ← Grayed out
            └─────────────┘
                ↑ Lower opacity
```

### Card States

```
Idle:       ┌─────────────────┐
            │   Card Content  │
            └─────────────────┘

Hover:      ┌─────────────────┐
            │   Card Content  │   ← Subtle shadow
            └─────────────────┘

Pressed:    ┌───────────────┐
            │ Card Content  │     ← Scaled to 0.98
            └───────────────┘
```

---

## 📐 Layout Patterns

### Card Layout
```
┌─────────────────────────────────┐
│ Title                   Badge   │ ← Header
├─────────────────────────────────┤
│                                 │
│ Content area with text and      │ ← Body
│ other elements...               │
│                                 │
├─────────────────────────────────┤
│ [Secondary Action] [Primary]    │ ← Footer
└─────────────────────────────────┘
      ↑ 16px padding all sides
```

### List Item
```
┌─────────────────────────────────┐
│ [Icon] Title          [Action]  │
│        Subtitle       button     │
│        ████████░░░░░ 60%        │
└─────────────────────────────────┘
      ↑ 12-16px vertical padding
      ↑ Minimum 52px height
```

---

## 🎪 Animation Timeline

### Button Press Sequence

```
Time:  0ms    100ms   200ms   300ms
       │      │       │       │
State: Idle → Press → Hold  → Release
       │      │       │       │
Scale: 1.0 → 0.95  → 0.95 → 1.0
       │      │       │       │
Haptic:      🔊             
```

### Toast Lifecycle

```
Time:  0ms    300ms   3000ms  3300ms
       │      │       │       │
State: Hidden→Visible→Visible→Hidden
       │      │       │       │
Y-pos: -20 → 0     → 0     → -20
       │      │       │       │
Opacity:0 → 1     → 1     → 0
```

---

## 📱 Responsive Breakpoints

```
Small Screen (< 375px):
├── Font scale: 0.9x
├── Padding: Reduced
└── Touch targets: 48x48 (larger)

Medium Screen (375-430px):
├── Font scale: 1.0x
├── Padding: Standard
└── Touch targets: 44x44

Large Screen (> 430px):
├── Font scale: 1.0x
├── Padding: Increased
└── Touch targets: 44x44
```

---

## ♿ Accessibility Labels

### Screen Reader Announcements

```
Button:
├── Label: "Continue reading"
├── Hint: "Navigate to last read verse"
└── Role: "button"

Progress:
├── Label: "Reading progress"
├── Value: "45 out of 61 verses, 74 percent"
└── Role: "progressbar"

Switch:
├── Label: "Enable haptics"
├── Hint: "Vibration feedback for interactions"
├── Role: "switch"
└── State: "on" or "off"
```

---

## 🎨 Component Gallery

### Headers
```
H1: ‖ Chapter Title ‖  (24-32px, bold)
H2: ‖ Section Title ‖  (18-24px, semibold)
H3: ‖ Subsection ‖     (16-18px, semibold)
```

### Badges
```
Primary:   [ Chapter 1 ]  (accent color)
Success:   [ Reading  ]   (green)
Info:      [ Bookmark ]   (blue)
```

### Icons
```
🔖 Bookmarked
🏷️ Not bookmarked
→  Continue/Next
✓  Success
✕  Error
ℹ  Info
⚠  Warning
📖 Reading
🔥 Streak
```

---

## 🔗 Component Relationships

```
HomeScreen
├── AnimatedPressable (Continue button)
├── ProgressIndicator (Overall progress)
├── Card (Stats display)
└── Toast (Notifications)

ChaptersScreen
├── ChapterListSkeleton (Loading)
├── AnimatedCard (Each chapter)
├── ProgressIndicator (Per chapter)
└── Badge (Status indicators)

ReadingScreen
├── ProgressIndicator (Chapter progress)
├── AnimatedCard (Verse cards)
├── Toast (Bookmark feedback)
└── EnhancedTouchTarget (Bookmark button)

SettingsScreen
├── AnimatedPressable (Selection buttons)
├── Switch (Feature toggles)
└── Slider (Font size)
```

---

## 📊 Component Usage Frequency

```
Most Used:
├── Text              ████████████████  100%
├── View              ████████████████   95%
├── Card              ████████████░░░░   75%
├── AnimatedPressable ██████████░░░░░░   60%
└── ProgressIndicator ███████░░░░░░░░░   45%

Medium Use:
├── Toast             ████░░░░░░░░░░░░   25%
├── Badge             ███░░░░░░░░░░░░░   20%
└── Skeleton          ██░░░░░░░░░░░░░░   15%

Specialized:
├── AccessibleText    █░░░░░░░░░░░░░░░   10%
└── CircularProgress  █░░░░░░░░░░░░░░░    5%
```

---

**Visual Reference v1.0.0**  
*For component API details, see UI_UX_IMPROVEMENTS.md*
