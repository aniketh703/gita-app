# Complete Chapter Button Component

A beautiful, accessible React Native Reanimated 3 component for marking chapters as complete in the Bhagavad Gita app. Features serene "Sattvic" glow animations, haptic feedback, and semantic completion states.

## Overview

The `CompleteChapterButton` provides a meaningful completion experience that combines:

- **Reanimated 3 Animations**: Smooth, 60-FPS glow expansion and checkmark entrance
- **Haptic Feedback**: Gentle double-pulse pattern + success notification via `expo-haptics`
- **Sattvic Glow**: Golden (#D4AF37) expanding aura for spiritual/serene feel
- **Accessibility**: Proper semantic states and disabled states
- **Theme Integration**: Works seamlessly with the app's Light/Sepia/Dark theme system

## Features

### Visual Feedback

- **Expanding Glow**: Golden light expands outward from center over 1.4 seconds
- **Checkmark Animation**: Animated ✓ mark bounces in with elastic easing
- **Ripple Effect**: Subtle border flash synchronized with checkmark
- **State Transitions**: Button styling changes to reflect completed state

### Haptic Feedback

- **Double-Pulse Pattern**: Two gentle impact haptics (Light intensity)
- **Success Notification**: Bookends the effect with success vibration
- **Fallback**: Gracefully handles devices without haptic support

### UX States

- **Idle**: "Mark Complete" button ready for interaction
- **Loading**: Shows subtle spinner during async completion
- **Completed**: "Chapter Complete" with persistent checkmark and reduced opacity
- **Disabled**: Prevents accidental re-triggering and external disabling

## Installation & Setup

The component is already included in your project. Required dependencies:

```json
{
  "expo-haptics": "~15.0.8",
  "react-native-reanimated": "~4.1.1"
}
```

Both are already in your `package.json`.

## Basic Usage

```tsx
import { CompleteChapterButton } from "@/components/complete-chapter-button";

export function ReadingScreen() {
  const handleMarkComplete = async () => {
    // Save to AsyncStorage, update UI state, log analytics, etc.
    await updateReadingProgress({ chapterId: 1, completed: true });
  };

  return (
    <CompleteChapterButton
      chapterNumber={1}
      onComplete={handleMarkComplete}
      glowColor="#D4AF37"
    />
  );
}
```

## API Reference

### Props

```typescript
interface CompleteChapterButtonProps {
  // Callback when button is pressed and animations complete
  onComplete: () => void | Promise<void>;

  // Optional chapter number for context/logging
  chapterNumber?: number;

  // Whether the chapter is already marked complete
  isCompleted?: boolean;

  // Disable button interaction
  disabled?: boolean;

  // Color of the glow effect (default: "#D4AF37" - golden)
  glowColor?: string;

  // Style overrides for the button container
  style?: ViewStyle;
}
```

### Return Value

The component doesn't return any value. Completion state should be managed by parent component.

## Animation Details

### Glow Animation (1400ms total)

1. **Opacity Ramp** (0-200ms): Fade in to 0.8 opacity
2. **Scale Expansion** (0-1400ms): 1x → 2.8x scale with cubic easing
3. **Opacity Fade** (600-1400ms): Fade out with cubic easing

The glow is a 50x50 unit circle that expands outward, creating a "blooming" effect.

### Checkmark Animation (600ms total)

1. **Scale Pop** (0-400ms): 0x → 1.3x with back/elastic easing (overshoot effect)
2. **Scale Settle** (400-600ms): 1.3x → 1x with quad easing
3. **Opacity Fade-In** (0-300ms): 0 → 1 opacity

### Haptic Sequence

1. Light impact (0ms) - press confirmation
2. Light impact (120ms delay) - double-pulse effect
3. Success notification (200ms delay) - completion celebration

## Customization

### Custom Glow Color (Theme-Aware)

```tsx
import { useAppTheme } from "@/hooks/use-app-theme";

export function CustomColorButton() {
  const { colors } = useAppTheme();

  return (
    <CompleteChapterButton
      onComplete={async () => {
        /* ... */
      }}
      glowColor={colors.accent} // Use theme accent color
    />
  );
}
```

### Multiple Themes

For Sepia mode (warm, reading-friendly):

```tsx
<CompleteChapterButton
  onComplete={handleComplete}
  glowColor="#C19A6B" // Warmer gold for sepia
/>
```

For Dark mode:

```tsx
<CompleteChapterButton
  onComplete={handleComplete}
  glowColor="#FFD700" // Brighter gold stands out better
/>
```

### Size & Styling

```tsx
<CompleteChapterButton
  onComplete={handleComplete}
  style={{
    marginVertical: 20,
    marginHorizontal: 16,
    minHeight: 56, // Accessibility minimum touch target
  }}
/>
```

## Integration Patterns

### 1. End-of-Chapter Screen

```tsx
export function ChapterEndScreen({ chapter }) {
  const { readingProgress, updateProgress } = useReadingProgress();

  const handleComplete = async () => {
    // Update local state
    setCompletedChapters((prev) => [...prev, chapter.id]);

    // Persist to storage
    await updateProgress({
      chapterId: chapter.id,
      completedAt: Date.now(),
    });

    // Optional: Track analytics
    logEvent("chapter_completed", { chapterId: chapter.id });
  };

  const isAlreadyCompleted = readingProgress.completedChapters.includes(
    chapter.id,
  );

  return (
    <View>
      {/* ... chapter summary content ... */}
      <CompleteChapterButton
        chapterNumber={chapter.id}
        onComplete={handleComplete}
        isCompleted={isAlreadyCompleted}
      />
    </View>
  );
}
```

### 2. Chapter Selection with Progressive Unlock

```tsx
export function ChapterList() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const isChapterUnlocked = (id: number) => {
    return id === 1 || completed.has(id - 1);
  };

  return (
    <FlatList
      data={chapters}
      renderItem={({ item }) => (
        <ChapterCard
          chapter={item}
          disabled={!isChapterUnlocked(item.id)}
          onComplete={() => {
            setCompleted((prev) => new Set([...prev, item.id]));
          }}
        />
      )}
    />
  );
}
```

### 3. Settings Page Progress Tracker

```tsx
export function ProgressOverview() {
  const { completedChapters } = useReadingProgress();
  const totalChapters = 18;
  const percentComplete = (completedChapters.size / totalChapters) * 100;

  return (
    <View>
      <ProgressBar value={percentComplete} />
      <Text>
        {completedChapters.size}/{totalChapters} chapters complete
      </Text>

      {percentComplete === 100 && (
        <CompleteChapterButton
          onComplete={() => celebrateCompletion()}
          disabled={true}
          glowColor="#FFD700"
        />
      )}
    </View>
  );
}
```

## Accessibility

The component is designed with accessibility in mind:

- **Touch Target**: Button maintains 56px minimum height for comfortable interaction
- **Semantic States**: Disabled state is properly communicated to screen readers
- **Focus Management**: Uses pressable states for keyboard navigation
- **Haptic Feedback**: Acts as secondary confirmation for users with visual impairments
- **Loading Indicator**: Provides visual feedback during async operations

### Screen Reader Support (iOS VoiceOver / Android TalkBack)

The component automatically communicates:

- Button purpose: "Mark chapter complete, button"
- State: "Disabled" when completion is locked
- Feedback: Haptic pattern provides tactile confirmation

## Performance Considerations

### Animation Optimization

- Uses Reanimated's `runOnJS` for state updates that don't require 60-FPS
- Animations run on native thread (doesn't block JS)
- All animated values use `useSharedValue` for efficient updates

### Memory Management

- Animations are properly cancelled if component unmounts during playing state
- No memory leaks from timer-based delays (using setTimeout within callbacks)
- Haptic requests use proper error handling

### Battery Impact

- Glow animation runs once per press (~1.4 seconds)
- Haptic pulses are brief and light intensity
- Minimal impact on device battery

## Error Handling

The component gracefully handles errors:

```tsx
// If onComplete() throws an error:
try {
  await onComplete();
  setIsCompleted(true);
} catch (error) {
  console.error("Error completing chapter:", error);
  // Reset animations on failure
  cancelAnimation(glowScale);
  cancelAnimation(glowOpacity);
  cancelAnimation(checkmarkScale);
  cancelAnimation(checkmarkOpacity);
}

// If haptics fail (device doesn't support):
try {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
} catch (error) {
  console.warn("Haptic feedback failed:", error);
  // Silent fail - visual feedback still shows
}
```

## Browser & Platform Support

| Platform   | Support    | Notes                                  |
| ---------- | ---------- | -------------------------------------- |
| iOS        | ✅ Full    | Native haptics work perfectly          |
| Android    | ✅ Full    | Haptics depend on device support       |
| Web (Expo) | ⚠️ Partial | Animations work, haptics not available |
| Simulator  | ⚠️ Partial | Haptics unavailable, visual shows      |

## Testing

### Unit Test Example

```tsx
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { CompleteChapterButton } from "@/components/complete-chapter-button";

describe("CompleteChapterButton", () => {
  it("calls onComplete when pressed", async () => {
    const mockOnComplete = jest.fn();
    const { getByText } = render(
      <CompleteChapterButton onComplete={mockOnComplete} />,
    );

    fireEvent.press(getByText("Mark Complete"));
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it("shows completed state after pressing", async () => {
    const { getByText, queryByText } = render(
      <CompleteChapterButton onComplete={async () => {}} />,
    );

    fireEvent.press(getByText("Mark Complete"));
    await waitFor(() => {
      expect(queryByText("Chapter Complete")).toBeDefined();
    });
  });

  it("disables button when isCompleted is true", () => {
    const { getByRole } = render(
      <CompleteChapterButton onComplete={jest.fn()} isCompleted={true} />,
    );

    expect(getByRole("button")).toBeDisabled();
  });
});
```

## Best Practices

1. **Show Progress Context**: Always display chapter number or name for user orientation
2. **Provide Summary**: Show stats (verses read, time spent) before completion
3. **Offer Next Steps**: Suggest next chapter after marking complete
4. **Use Theme Colors**: Let button blend with app's active theme
5. **Debounce Multiple Presses**: Component handles this, but good to know
6. **Log Analytics**: Track which chapters users complete for engagement metrics
7. **Respect User Preferences**: Consider users who disable haptics in system settings
8. **Test Accessibility**: Verify with VoiceOver/TalkBack before release

## Troubleshooting

### Haptics Not Working

- Check device supports haptics (most modern devices do)
- Verify `expo-haptics` is properly installed
- Device may have haptics disabled in system settings

### Animations Stuttering

- Ensure you're not doing heavy computation in `onComplete`
- Move async operations to a background task
- Check device performance monitor in dev tools

### Button Not Responding to Presses

- Verify parent component isn't blocking touch events
- Check `disabled` or `isCompleted` props aren't true
- Ensure `onComplete` isn't throwing errors silently

### Glow Not Visible

- Increase `glowColor` brightness for dark backgrounds
- Adjust parent container's `overflow` property
- Verify Reanimated is properly configured in your project

## Examples in App

See [complete-chapter-button-examples.tsx](./complete-chapter-button-examples.tsx) for:

- Basic usage
- End-of-chapter screen integration
- Multi-chapter progress tracking

## Future Enhancements

Potential improvements for future versions:

- Confetti particle effect option
- Sound effect support (complements haptics)
- Streak/milestone celebrations
- Custom animation easing presets
- Accessibility voice notification
- Chapter milestone badges
