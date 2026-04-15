# F-11 Notification System - Quick Reference

## File Structure

```
gita-app/
├── src/
│   ├── services/
│   │   ├── notificationService.ts          ← Low-level API wrapper
│   │   └── notificationScheduler.ts        ← Business logic
│   │
│   ├── hooks/
│   │   ├── useNotificationInitializer.ts   ← Permission + listeners
│   │   └── useNotificationScheduler.ts     ← App state integration
│   │
│   ├── context/
│   │   └── NotificationContext.tsx         ← Provider + consumer hook
│   │
│   └── utils/
│       ├── badgeNotifications.ts           ← Badge ID → description mapping
│       └── NotificationTestPanel.tsx       ← Testing component
│
├── app/
│   └── _layout.tsx                         ← Added NotificationProvider
│
├── Documentation/
│   ├── NOTIFICATION_INTEGRATION.md         ← Complete guide
│   ├── SETTINGS_UI_WIRING.md              ← Settings UI guide
│   ├── F11_IMPLEMENTATION_COMPLETE.md      ← Full summary
│   └── This file                           ← Quick reference
│
└── Modified Files/
    ├── app/_layout.tsx                    ← Added provider
    ├── src/screens/ReadingScreen.tsx      ← Added trigger
    └── checklist.md                       ← Marked complete
```

## Core API Reference

### `notificationService.ts`

**Templates**:
```tsx
NOTIFICATION_TEMPLATES = {
  morning: Template,
  midday: Template,
  evening: Template,
  streak_risk: Template,
  milestone: Template,
  chapter_complete: Template
}
```

**Functions**:
```tsx
// Schedule with delay
scheduleNotification(template: NotificationTemplate, delayMs?: number)

// Schedule at specific time
scheduleNotificationAtTime(template: NotificationTemplate, hour: number, minute: number)

// Cancel
cancelNotification(id: string)
cancelNotificationsByType(type: NotificationType)

// Query
getScheduledNotificationCountToday(): Promise<number>

// Permissions
requestNotificationPermissions(): Promise<boolean>

// Dynamic content
interpolateTemplate(template: Template, context: Record<string, string>)
```

### `notificationScheduler.ts`

**Functions**:
```tsx
// Main scheduling
scheduleDailyReminders(context: NotificationSchedulerContext)
scheduleStreakRiskNotification(context: NotificationSchedulerContext)
scheduleCompletionNotification(context: NotificationSchedulerContext, chapterNum: number)
scheduleMilestoneNotification(context: NotificationSchedulerContext, description: string)

// Lifecycle
rescheduleNotifications(context: NotificationSchedulerContext)
clearAllScheduledNotifications()
```

### `useNotificationScheduler.ts`

**Hook Return**:
```tsx
{
  onChapterComplete: (chapterNum: number) => Promise<void>,
  onMilestoneUnlocked: (description: string) => Promise<void>,
  rescheduleAll: () => Promise<void>
}
```

### `NotificationContext.tsx`

**Provider**:
```tsx
<NotificationProvider>
  {children}
</NotificationProvider>
```

**Hook**:
```tsx
const { onChapterComplete, onMilestoneUnlocked, rescheduleAll } = useNotifications()
```

## Usage Examples

### Example 1: Trigger on Chapter Complete
```tsx
import { useNotifications } from "@/src/context/NotificationContext";

function ReadingScreen() {
  const { onChapterComplete } = useNotifications();
  
  const onComplete = async () => {
    markChapterComplete(chapterId);
    await onChapterComplete(chapterId); // 🔔
  };
}
```

### Example 2: Trigger on Badge Unlock
```tsx
import { useNotifications } from "@/src/context/NotificationContext";
import { getBadgeDescription } from "@/src/utils/badgeNotifications";

function BadgeScreen() {
  const { onMilestoneUnlocked } = useNotifications();
  
  const unlockBadge = async (badgeId: string) => {
    addBadge(badgeId);
    const description = getBadgeDescription(badgeId);
    await onMilestoneUnlocked(description); // 🔔
  };
}
```

### Example 3: Reschedule After Settings Change
```tsx
const { rescheduleAll } = useNotifications();

const handleNotificationToggle = async (enabled: boolean) => {
  setNotificationEnabled(enabled);
  await rescheduleAll(); // Re-schedule with new setting
};
```

## Status Overview

| Component | Status | Location |
|-----------|--------|----------|
| Notification Service | ✅ Complete | `src/services/notificationService.ts` |
| Scheduler | ✅ Complete | `src/services/notificationScheduler.ts` |
| Hook (Init) | ✅ Complete | `src/hooks/useNotificationInitializer.ts` |
| Hook (Scheduler) | ✅ Complete | `src/hooks/useNotificationScheduler.ts` |
| Context/Provider | ✅ Complete | `src/context/NotificationContext.tsx` |
| Layout Integration | ✅ Complete | `app/_layout.tsx` |
| Chapter Trigger | ✅ Complete | `src/screens/ReadingScreen.tsx` |
| Badge Support | ✅ Complete | `src/utils/badgeNotifications.ts` |
| Testing Panel | ✅ Complete | `src/utils/NotificationTestPanel.tsx` |
| Documentation | ✅ Complete | 4 markdown files |
| Settings UI | ⏳ Next Phase | See `SETTINGS_UI_WIRING.md` |

## Key Type Definitions

```tsx
// Notification type selector
type NotificationType = 
  | "morning" 
  | "midday" 
  | "evening" 
  | "streak_risk" 
  | "milestone" 
  | "chapter_complete"

// Notification template
interface NotificationTemplate {
  type: NotificationType;
  title: string;
  body: string;
  deepLink?: DeepLinkPayload;
  scheduleTime?: { hour: number; minute: number };
}

// Scheduler context
interface NotificationSchedulerContext {
  settings: NotificationSettings;
  progress: { chapters: number[]; totalRead: number };
  currentStreak: number;
  lastReadDate: string | null;
  currentChapter?: number;
  chapters?: ChapterSummary[];
}

// Notification settings (in appStore)
interface NotificationSettings {
  enabled: boolean;
  time: string;           // "morning" | "midday" | "evening" 
  permissionAsked: boolean;
}
```

## Quick Debugging

### Check Scheduled Notifications
```tsx
import * as Notifications from "expo-notifications";

const scheduled = await Notifications.getAllScheduledNotificationsAsync();
console.log("Scheduled notifications:", scheduled);
console.log("Count:", scheduled.length);
```

### Check Permissions
```tsx
const { granted } = await Notifications.getPermissionsAsync();
console.log("Notifications granted:", granted);
```

### Cancel All (for testing)
```tsx
await Notifications.cancelAllScheduledNotificationsAsync();
```

### Manually Trigger Test
```tsx
import { scheduleNotification, NOTIFICATION_TEMPLATES } from "@/src/services/notificationService";

// Schedule morning notification in 2 seconds
await scheduleNotification(NOTIFICATION_TEMPLATES.morning, 2000);
```

## Common Patterns

### Pattern 1: Event → Notification
```tsx
const { onChapterComplete } = useNotifications();

// Event happens
completeChapter();

// Trigger notification
await onChapterComplete(chapterNum);
```

### Pattern 2: Settings Change → Reschedule
```tsx
const { rescheduleAll } = useNotifications();
const store = useAppStore();

useEffect(() => {
  rescheduleAll(); // Runs when settings change
}, [store.notificationSettings]);
```

### Pattern 3: Query for Enforcement
```tsx
import { getScheduledNotificationCountToday } from "@/src/services/notificationService";

const count = await getScheduledNotificationCountToday();
if (count === 0) {
  // Can schedule today
}
```

## Testing Checklist

### Unit Tests
- [ ] `interpolateTemplate()` with various placeholders
- [ ] `hasUserReadToday()` with different dates
- [ ] Badge description mapping complete

### Integration Tests
- [ ] Provider renders without error
- [ ] `useNotifications()` hook accessible in components
- [ ] Scheduler receives correct context from store
- [ ] Settings changes trigger reschedule

### Manual Tests (on device)
- [ ] Permission request shows and persists
- [ ] Morning notification schedules correctly
- [ ] Streak-risk fires at 8pm if conditions met
- [ ] Chapter completion shows notification
- [ ] Tapping notification deep-links correctly
- [ ] Settings toggle works

## Links to Detailed Guides

- [Complete Architecture & Usage Guide](./NOTIFICATION_INTEGRATION.md)
- [Settings UI Implementation](./SETTINGS_UI_WIRING.md)  
- [Full Implementation Summary](./F11_IMPLEMENTATION_COMPLETE.md)
- [App Store Submission Notes](./F11_IMPLEMENTATION_COMPLETE.md#app-store-notes) (if any)

## Support & Troubleshooting

**Issue**: Notifications not showing
- Check device notification settings
- Verify `notificationSettings.enabled === true`
- Check permissions with debugging code above
- Ensure app is in background when testing

**Issue**: Deep-link not working
- Verify notification data includes `deepLink` property
- Check screen name mapping in `useNotificationInitializer`
- Test with manual route navigation

**Issue**: Scheduled counter not working
- Check date format: should be `YYYY-MM-DD`
- Verify `getAllScheduledNotificationsAsync()` is called
- Ensure fireDate is set on trigger

## Next Steps for Team

1. **QA**: Use `NotificationTestPanel` to verify all types
2. **Settings**: Implement Settings UI using the wiring guide
3. **Analytics**: Add tracking for notification engagement
4. **Device Test**: Test on real iOS/Android devices
5. **Localization**: Translate notification messages for other languages
6. **Polish**: Refine message copy based on user feedback

---

**Questions?** See the detailed guides above or check the inline code documentation.
