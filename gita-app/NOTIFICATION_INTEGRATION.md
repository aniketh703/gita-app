# F-11 Notification System Integration Guide

## Overview

The notification system provides intelligent, habit-forming notifications for the Gita reading app. It includes:

- **6 Notification Types**: Morning wisdom, midday mindfulness, evening encouragement, streak-at-risk warning, milestone achievements, and chapter completion celebrations
- **Smart Scheduling**: Ensures only 1 non-milestone notification per day
- **Reading-Aware Logic**: Doesn't nag if user has already read
- **User Settings**: Respects user's notification preferences and chosen time

## Architecture

### Core Files

1. **`src/services/notificationService.ts`**: Low-level notification API
   - Manages expo-notifications integration
   - Handles scheduling, canceling, and permissions
   - Interpolates notification templates

2. **`src/services/notificationScheduler.ts`**: Business logic
   - Determines which notifications should fire
   - Enforces 1-per-day rule
   - Handles streak-risk conditions
   - Integrates with user preferences

3. **`src/hooks/useNotificationInitializer.ts`**: Permission & listener setup
   - Requests notification permissions on app startup
   - Handles notification tap/deep-linking
   - Sets up foreground/background listeners

4. **`src/hooks/useNotificationScheduler.ts`**: App state integration
   - Watches app lifecycle (foreground/background)
   - Listens to notification settings changes
   - Provides trigger functions for completion events

5. **`src/context/NotificationContext.tsx`**: Provider & consumer hook
   - Wraps both initialization and scheduling hooks
   - Provides `useNotifications()` hook for components

## Usage

### 1. Provider Setup (Already Done)

The `NotificationProvider` is already added to `app/_layout.tsx`:

```tsx
<NotificationProvider>
  <RootLayoutContent />
</NotificationProvider>
```

### 2. Trigger Notifications on Chapter Complete

When user completes reading a chapter, the app automatically triggers a celebration notification:

```tsx
// In ReadingScreen.tsx - already integrated!
const { onChapterComplete } = useNotifications();

const onComplete = async () => {
  markChapterComplete(chapterId);
  onChapterComplete(chapterId); // Trigger notification
};
```

### 3. Trigger Notifications on Badge Unlock

When user unlocks a badge or milestone:

```tsx
import { useNotifications } from "@/src/context/NotificationContext";
import { getBadgeDescription } from "@/src/utils/badgeNotifications";

export function BadgeUnlockComponent() {
  const { onMilestoneUnlocked } = useNotifications();
  const { addBadge } = useAppStore();

  const unlockBadge = async (badgeId: string) => {
    addBadge(badgeId);
    
    // Trigger celebration notification
    const description = getBadgeDescription(badgeId);
    await onMilestoneUnlocked(description);
  };

  return (
    <Button onPress={() => unlockBadge("first-read")}>
      Unlock Badge
    </Button>
  );
}
```

## Notification Types & Behavior

### 1. Morning Wisdom (6:30 AM)
```
Title: 🌅 Begin with Clarity
Body: Let right deeds be thy motive, not the fruit which comes from them. — BG 2.47
Tap: Opens Home screen
```

**When**: Enabled + user hasn't read yet today

### 2. Midday Mindfulness (12:30 PM)
```
Title: 🕉 A Moment of Stillness
Body: Amid the chaos of the day, Arjuna found his answer. So can you. Read today's verse.
Tap: Opens Reading screen
```

**When**: Enabled + user hasn't read yet + no morning notification sent

### 3. Evening Encouragement (6 PM)
```
Title: 🔥 Your Streak Awaits
Body: Day {streak_count} — You've come so far. One verse to keep the flame alive.
Tap: Opens Reading screen
```

**When**: Enabled + user hasn't read yet + no earlier notification sent

### 4. Streak at Risk (8 PM) ⚠️
```
Title: ⚠️ Your Streak is in Danger!
Body: {streak_count}-day streak. Miss today and it resets. 2 minutes is all it takes.
Tap: Opens Reading screen
```

**Conditions**:
- Only if user has active streak (currentStreak > 0)
- Only if user hasn't read yet today
- Fires even if earlier notifications were sent
- Multiple reminders can fire (morning + evening + streak-risk OK)

### 5. Milestone Achieved 🏆
```
Title: 🏆 You Did It!
Body: Reading Seeker - Read your first verse
Tap: Opens Badges screen
```

**When**: Badge/achievement unlocked (can fire anytime)

### 6. Chapter Complete 📖
```
Title: 📖 Chapter {num} Done!
Body: You've completed Chapter {name}. Earned 25 Coins. What does Chapter {next} hold?
Tap: Opens Chapters screen
```

**When**: User completes reading a chapter

## Configuration

### User Settings

Users can control notifications in Settings tab:

```tsx
// NotificationSettings in appStore
{
  enabled: true,           // Global on/off
  time: "morning",         // "morning" | "midday" | "evening"
  permissionAsked: false   // Track if permission was requested
}
```

### Notification Times

Users choose their preferred notification time:

| Option | Times |
|--------|-------|
| Morning | 6:30 AM |
| Midday | 12:30 PM |
| Evening | 6:00 PM |
| Streak-risk | 8:00 PM (separate) |

## Smart Rules

The system enforces these rules automatically:

1. **Max 1 per day rule**: Only ONE of (morning, midday, evening) fires per day
   - User reads at 6am? Morning scheduled.
   - User reads at 1pm? Midday skipped.
   - Evening can still fire at 6pm if not read yet.

2. **Streak-risk exception**: Can fire alongside other notifications
   - User hasn't read + 8pm reached = Streak-risk fires
   - This is the "last chance" warning

3. **Read-aware logic**: Cancels reminders if user reads
   - User reads at 2pm after getting morning notification
   - Any pending notifications are canceled
   - App detects read via AppStore state

4. **Settings-aware**: Respects user preferences
   - If `notificationSettings.enabled === false`, nothing is scheduled
   - Changes to settings immediately reschedule notifications

## Deep Linking

Notifications deep-link to relevant screens:

```json
{
  "screen": "home",       // Home screen
  "chapter": 1,          // (optional) Chapter number
  "verse": 15            // (optional) Verse number
}
```

Supported screens:
- `home` → `/`
- `reading` → `/(tabs)/home` with chapter/verse params
- `chapters` → `/(tabs)/home`
- `badges` → `/badges`
- `settings` → `/(tabs)/settings`

## Testing

### Manual Testing

1. **Request Permissions**
   - Open app and check for notification permission prompt
   - Tap "Allow"

2. **Schedule Notifications**
   - Go to Settings tab
   - Enable notifications
   - Choose time preference

3. **Trigger Chapter Completion**
   - Read and complete a chapter
   - Should see celebration notification

4. **Trigger Badge**
   - Manually call `useNotifications().onMilestoneUnlocked("Test Badge")`

5. **Check Scheduled**
   ```tsx
   import * as Notifications from "expo-notifications";
   const scheduled = await Notifications.getAllScheduledNotificationsAsync();
   console.log("Scheduled:", scheduled);
   ```

### Debugging

Enable verbose logging in the notification service:

```tsx
// In notificationService.ts, add:
console.log("Scheduling notification:", template.title);
console.log("Deep link:", template.deepLink);
```

## Troubleshooting

### "Button doesn't appear on Android"
- Android limits notification action buttons
- Title/body should be sufficient for engagement

### "Notifications not showing"
- Verify permissions are granted
- Check Device Settings > Notifications > [App Name]
- Check `notificationSettings.enabled === true`
- Verify schedule time is correct

### "Same notification fires multiple times"
- Check `getAllScheduledNotificationsAsync()` 
- May need to call `cancelNotificationsByType()` first

## Future Enhancements

Planned improvements:

1. **A/B Testing**: Test different messages with cohorts
2. **Personalization**: Use name from onboarding in messages
3. **Smart Timing**: Learn best notification time for each user
4. **Analytics**: Track notification engagement (tap rate, dismiss rate)
5. **Custom Schedules**: Let users set custom notification times
6. **Rich Media**: Add image/audio to notifications
7. **Notification Groups**: Group related notifications on Android

## File Summary

| File | Purpose | Imports From |
|------|---------|--------------|
| `notificationService.ts` | Low-level expo-notifications wrapper | expo-notifications |
| `notificationScheduler.ts` | Scheduling business logic | notificationService |
| `useNotificationInitializer.ts` | Permissions & deep-linking | notificationService |
| `useNotificationScheduler.ts` | App state integration | notificationScheduler, useAppStore |
| `NotificationContext.tsx` | Provider & consumer hook | Both hooks |
| `badgeNotifications.ts` | Badge description mapping | (utilities only) |
