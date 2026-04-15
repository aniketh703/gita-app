# Settings UI Wiring Guide for F-11 Notifications

This guide shows how to add notification controls to the Settings screen so users can manage their notification preferences.

## UI Components Needed

### 1. Notification Master Toggle
```tsx
<View>
  <Text>Notifications</Text>
  <Switch
    value={store.notificationSettings.enabled}
    onValueChange={(enabled) => store.setNotificationEnabled(enabled)}
  />
</View>
```

### 2. Time Preference Selector
```tsx
<View>
  <Text>Notification Time</Text>
  <Picker
    selectedValue={store.notificationSettings.time}
    onValueChange={(time) => store.setNotificationTime(time)}
  >
    <Picker.Item label="🌅 Morning (6:30 AM)" value="morning" />
    <Picker.Item label="☀️ Midday (12:30 PM)" value="midday" />
    <Picker.Item label="🌆 Evening (6:00 PM)" value="evening" />
  </Picker>
</View>
```

### 3. Permission Status Display
```tsx
<View>
  <Text>
    {store.notificationSettings.permissionAsked
      ? "Notifications enabled"
      : "Tap to enable push notifications"}
  </Text>
</View>
```

## Full Settings Component Example

```tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Picker,
  Alert,
} from "react-native";
import { useAppStore } from "@/src/store/appStore";
import { useNotifications } from "@/src/context/NotificationContext";

export function NotificationSettings() {
  const store = useAppStore();
  const { rescheduleAll } = useNotifications();
  const [saving, setSaving] = useState(false);

  const handleToggleNotifications = async (enabled: boolean) => {
    try {
      setSaving(true);
      
      // Store the preference
      store.setNotificationEnabled(enabled);
      
      // Reschedule based on new setting
      await rescheduleAll();
      
      // Show feedback
      Alert.alert(
        "Success",
        enabled
          ? "Notifications enabled! You'll receive daily reminders."
          : "Notifications disabled."
      );
    } catch (error) {
      console.error("Failed to update notifications:", error);
      Alert.alert("Error", "Failed to update notification settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChangeTime = async (time: string) => {
    try {
      setSaving(true);
      
      // Store the preference
      store.setNotificationTime(time);
      
      // Reschedule with new time
      await rescheduleAll();
      
      Alert.alert(
        "Success",
        `Notification time updated to ${getTimeLabel(time)}`
      );
    } catch (error) {
      console.error("Failed to update notification time:", error);
      Alert.alert("Error", "Failed to update notification time");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🔔 Notifications</Text>

      {/* Master Toggle */}
      <View style={styles.settingRow}>
        <View style={styles.settingLabel}>
          <Text style={styles.label}>Enable Notifications</Text>
          <Text style={styles.description}>
            Get daily reminders to read your verses
          </Text>
        </View>
        <Switch
          value={store.notificationSettings.enabled}
          onValueChange={handleToggleNotifications}
          disabled={saving}
        />
      </View>

      {/* Time Selection (only if enabled) */}
      {store.notificationSettings.enabled && (
        <View style={styles.timeSelectorContainer}>
          <Text style={styles.label}>Preferred Time</Text>
          <Text style={styles.description}>
            When would you like daily reminders?
          </Text>
          
          <View style={styles.timeOptions}>
            {["morning", "midday", "evening"].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  store.notificationSettings.time === time &&
                    styles.timeButtonActive,
                ]}
                onPress={() => handleChangeTime(time)}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    store.notificationSettings.time === time &&
                      styles.timeButtonTextActive,
                  ]}
                >
                  {getTimeEmoji(time)} {getTimeLabel(time)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Streak-at-Risk Warning Info */}
      {store.notificationSettings.enabled && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>⚠️ Streak-at-Risk Warnings</Text>
          <Text style={styles.infoText}>
            If you have an active reading streak and haven't read by 8:00 PM, 
            you'll get a reminder to keep your streak alive.
          </Text>
        </View>
      )}

      {/* About Notifications */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📱 How Notifications Work</Text>
        <Text style={styles.infoText}>
          You'll receive:
          {"\n"}
          • 1 daily reminder at your preferred time
          {"\n"}
          • Celebration notifications when you complete chapters
          {"\n"}
          • Badge earned notifications for achievements
          {"\n"}
          • No notifications after you've read for the day
        </Text>
      </View>

      {/* Save Status */}
      {saving && (
        <View style={styles.savingIndicator}>
          <Text style={styles.savingText}>Updating preferences...</Text>
        </View>
      )}
    </View>
  );
}

// Helper functions
function getTimeEmoji(time: string): string {
  const emojis: Record<string, string> = {
    morning: "🌅",
    midday: "☀️",
    evening: "🌆",
  };
  return emojis[time] || "🕐";
}

function getTimeLabel(time: string): string {
  const labels: Record<string, string> = {
    morning: "Morning (6:30 AM)",
    midday: "Midday (12:30 PM)",
    evening: "Evening (6:00 PM)",
  };
  return labels[time] || time;
}

// Styles
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
  },
  settingLabel: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#666",
  },
  timeSelectorContainer: {
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
    gap: 12,
  },
  timeOptions: {
    gap: 8,
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  timeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  timeButtonText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  timeButtonTextActive: {
    color: "#fff",
    fontWeight: "500",
  },
  infoBox: {
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  savingIndicator: {
    padding: 12,
    backgroundColor: "#E8F4F8",
    borderRadius: 8,
    alignItems: "center",
  },
  savingText: {
    fontSize: 13,
    color: "#0066CC",
  },
});
```

## Integration Steps

### 1. Add Notification Settings Section to Settings Screen

```tsx
// In your main Settings screen component
import { NotificationSettings } from "@/src/components/settings/NotificationSettings";

export function SettingsScreen() {
  return (
    <ScrollView>
      {/* Other settings sections */}
      <NotificationSettings />
      {/* Other settings sections */}
    </ScrollView>
  );
}
```

### 2. Ensure AppStore Functions are Exposed

Verify these methods exist in `useAppStore`:

```tsx
// In src/store/appStore.ts
setNotificationEnabled: (enabled: boolean) => void;
setNotificationTime: (time: string) => void;
setNotificationPermissionAsked: (asked: boolean) => void;
```

### 3. Test the Integration

```tsx
// In your test component
const store = useAppStore();

// These should work:
store.setNotificationEnabled(true);
store.setNotificationTime("morning");
console.log(store.notificationSettings); // Should show updated values
```

## UX Flow

```
Settings Screen
  └─ Notification Section
      ├─ Master Toggle: "Enable Notifications"
      │   └─ ON → Show Time Selection
      │   └─ OFF → Hide Time Selection
      │
      ├─ Time Selector (if enabled)
      │   ├─ Button: 🌅 Morning (6:30 AM)
      │   ├─ Button: ☀️ Midday (12:30 PM)
      │   └─ Button: 🌆 Evening (6:00 PM)
      │
      ├─ Info Box: Streak-at-Risk warnings (8 PM)
      │
      └─ Info Box: How notifications work
          └─ Lists all 6 notification types
```

## Behavior Rules

| Action | Behavior |
|--------|----------|
| Enable notification | All daily reminders scheduled |
| Change time | Notifications rescheduled for new time |
| Disable notification | All scheduled notifications canceled |
| First time enable | Request permission + schedule |
| Already granted | Skip permission, just schedule |
| Permission denied | Show message but don't crash |

## Error Handling

```tsx
// Always wrap in try-catch
try {
  store.setNotificationEnabled(true);
  await rescheduleAll();
  // Show success toast/alert
} catch (error) {
  console.error("Failed:", error);
  Alert.alert("Error", "Failed to update notifications");
  // Revert UI state if needed
}
```

## Testing

Before shipping:

- [ ] Toggle notifications on/off
- [ ] Change time preference multiple times
- [ ] Verify settings persist after app restart
- [ ] Check that new time schedule takes effect
- [ ] Test with notifications already enabled
- [ ] Test on device with notification permissions denied
- [ ] Verify all 3 time options work
- [ ] Check UI updates immediately

## Further Customization

Could add:

1. **Custom Times** - Let users set exact time (e.g., 7:15 AM)
2. **Frequency** - "Daily" vs "Weekdays only" vs "Weekends"
3. **Notification Types** - Toggle individual types on/off
4. **Do Not Disturb** - Quiet hours (e.g., 10 PM - 8 AM)
5. **Preview** - "Send me a test notification"

For now, the 3 preset times cover most use cases.
