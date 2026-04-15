# Quick Start: Using New UI/UX Components

This guide helps you quickly integrate the new UI/UX components into your app.

## 🚀 Quick Examples

### 1. Loading States

```tsx
import { Skeleton, VerseCardSkeleton } from '@/components/ui/loading-skeleton';

function MyScreen() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <VerseCardSkeleton />;
  }

  return <MyContent />;
}
```

### 2. Animated Buttons

```tsx
import { AnimatedPressable, AnimatedCard } from '@/components/ui/animated-pressable';

// Simple button with haptic feedback
<AnimatedPressable 
  onPress={handlePress}
  enableHaptic={prefs.toggles.enableHaptics}
>
  <Text>Click Me</Text>
</AnimatedPressable>

// Card that responds to press
<AnimatedCard onPress={navigateToDetail}>
  <Card>
    <CardContent>...</CardContent>
  </Card>
</AnimatedCard>
```

### 3. Progress Indicators

```tsx
import { ProgressIndicator } from '@/components/ui/progress-indicator';

// Linear progress bar
<ProgressIndicator
  current={currentVerse}
  total={totalVerses}
  label="Reading Progress"
  showPercentage={true}
/>

// Usage in chapter list
{chapters.map(chapter => (
  <View key={chapter.id}>
    <Text>{chapter.name}</Text>
    <ProgressIndicator
      current={userProgress[chapter.id] || 0}
      total={chapter.verses}
      height={4}
      showPercentage={false}
    />
  </View>
))}
```

### 4. Toast Notifications

```tsx
import { Toast, useToast } from '@/components/ui/toast';

function MyComponent() {
  const { toast, showToast, hideToast } = useToast();

  const handleBookmark = async () => {
    await addBookmark(chapter, verse);
    showToast('Verse bookmarked!', 'success');
  };

  const handleError = () => {
    showToast('Something went wrong', 'error');
  };

  return (
    <>
      <Button onPress={handleBookmark}>Bookmark</Button>
      <Toast 
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </>
  );
}
```

### 5. Reading Progress

```tsx
import { 
  saveReadingProgress, 
  getReadingProgress,
  addBookmark,
  getBookmarks 
} from '@/src/utils/readingProgress';

// Save progress when user reads a verse
const handleVerseRead = async (chapter: number, verse: number) => {
  await saveReadingProgress(chapter, verse);
};

// Get last read position
const continueReading = async () => {
  const progress = await getReadingProgress();
  if (progress) {
    router.push(`/reading?ch=${progress.chapter}&verse=${progress.verse}`);
  }
};

// Add bookmark with note
const handleBookmark = async () => {
  await addBookmark(chapter, verse, "This is my favorite verse");
  showToast('Bookmark added!', 'success');
};
```

### 6. Accessibility

```tsx
import { AccessibleText, EnhancedTouchTarget } from '@/components/accessibility/AccessibilityHelpers';

// Accessible heading
<AccessibleText
  isHeading={true}
  level={1}
  accessibilityLabel="Chapter Title"
>
  Chapter 1: Arjuna's Dilemma
</AccessibleText>

// Enhanced touch target for icons
<EnhancedTouchTarget minSize={44}>
  <TouchableOpacity onPress={handleBookmark}>
    <Icon name="bookmark" size={24} />
  </TouchableOpacity>
</EnhancedTouchTarget>

// Accessible button
<View
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Continue reading"
  accessibilityHint="Navigate to last read verse"
>
  <Button onPress={continueReading}>Continue</Button>
</View>
```

## 📋 Component Checklist

When creating new screens/features, include:

- [ ] Loading states with Skeleton
- [ ] AnimatedPressable for interactive elements
- [ ] Progress indicators where applicable
- [ ] Toast notifications for user actions
- [ ] Accessibility labels and hints
- [ ] Enhanced touch targets (44x44 minimum)
- [ ] Haptic feedback support
- [ ] Theme support (light/dark)
- [ ] Language support (English/Hindi)

## 🎯 Best Practices

### 1. Always provide visual feedback
```tsx
// ❌ Bad
<TouchableOpacity onPress={handlePress}>
  <Text>Click</Text>
</TouchableOpacity>

// ✅ Good
<AnimatedPressable 
  onPress={handlePress}
  enableHaptic={true}
>
  <Text>Click</Text>
</AnimatedPressable>
```

### 2. Show loading states
```tsx
// ❌ Bad
if (loading) {
  return null; // Blank screen
}

// ✅ Good
if (loading) {
  return <ChapterListSkeleton />;
}
```

### 3. Include accessibility
```tsx
// ❌ Bad
<Pressable onPress={handlePress}>
  <Text>Submit</Text>
</Pressable>

// ✅ Good
<AnimatedPressable
  onPress={handlePress}
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  accessibilityHint="Submits your reading preferences"
>
  <Text>Submit</Text>
</AnimatedPressable>
```

### 4. Notify users of actions
```tsx
// ❌ Bad
const handleBookmark = async () => {
  await addBookmark(chapter, verse);
  // User doesn't know if it worked
};

// ✅ Good
const handleBookmark = async () => {
  try {
    await addBookmark(chapter, verse);
    showToast('Bookmark added!', 'success');
  } catch (error) {
    showToast('Failed to add bookmark', 'error');
  }
};
```

### 5. Optimize performance
```tsx
// ✅ FlatList optimization
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  initialNumToRender={10}
  windowSize={10}
/>

// ✅ Memoize expensive computations
const sortedChapters = useMemo(() => 
  chapters.sort((a, b) => a.chapter - b.chapter),
  [chapters]
);
```

## 🔧 Common Patterns

### Pattern: Continue Reading Card

```tsx
const [lastRead, setLastRead] = useState(null);

useEffect(() => {
  async function loadProgress() {
    const progress = await getReadingProgress();
    setLastRead(progress);
  }
  loadProgress();
}, []);

{lastRead && (
  <AnimatedCard
    onPress={() => router.push(`/reading?ch=${lastRead.chapter}&verse=${lastRead.verse}`)}
  >
    <Card>
      <CardContent>
        <Text>Continue Reading</Text>
        <Text>Chapter {lastRead.chapter}, Verse {lastRead.verse}</Text>
      </CardContent>
    </Card>
  </AnimatedCard>
)}
```

### Pattern: Reading Statistics

```tsx
const [stats, setStats] = useState(null);

useEffect(() => {
  async function loadStats() {
    const readingStats = await getReadingStats();
    setStats(readingStats);
  }
  loadStats();
}, []);

{stats && (
  <Card>
    <CardContent>
      <View className="flex-row justify-around">
        <View>
          <Text>{stats.totalVersesRead}</Text>
          <Text>Verses Read</Text>
        </View>
        <View>
          <Text>{stats.consecutiveDays}</Text>
          <Text>Day Streak</Text>
        </View>
      </View>
      <ProgressIndicator
        current={stats.totalVersesRead}
        total={700}
        label="Overall Progress"
      />
    </CardContent>
  </Card>
)}
```

### Pattern: Bookmarkable List Item

```tsx
const [bookmarked, setBookmarked] = useState(new Set());

const handleBookmarkToggle = async (verseId) => {
  if (bookmarked.has(verseId)) {
    await removeBookmark(verseId);
    setBookmarked(prev => {
      const next = new Set(prev);
      next.delete(verseId);
      return next;
    });
    showToast('Bookmark removed', 'info');
  } else {
    await addBookmark(chapter, verseId);
    setBookmarked(prev => new Set(prev).add(verseId));
    showToast('Verse bookmarked', 'success');
  }
};

<FlatList
  data={verses}
  renderItem={({ item }) => (
    <AnimatedCard>
      <View className="flex-row justify-between">
        <Text>{item.text}</Text>
        <TouchableOpacity onPress={() => handleBookmarkToggle(item.id)}>
          <Text>{bookmarked.has(item.id) ? '🔖' : '🏷️'}</Text>
        </TouchableOpacity>
      </View>
    </AnimatedCard>
  )}
/>
```

## 🎨 Styling Tips

### Use Theme Colors
```tsx
// Always use theme-aware colors
className="text-gita-text dark:text-gita-dark-text"
className="bg-gita-bg dark:bg-gita-dark-bg"
className="border-gita-border dark:border-gita-dark-border"
```

### Respect Font Size Preference
```tsx
// Scale text with user preference
<Text 
  style={{ fontSize: Math.min(16, prefs.fontSize) }}
>
  Content
</Text>
```

### Minimum Touch Targets
```tsx
// Ensure 44x44pt minimum
<EnhancedTouchTarget minSize={44}>
  <Icon name="close" size={20} />
</EnhancedTouchTarget>
```

## 📱 Testing

### Test on Multiple Devices
- Small screen (iPhone SE)
- Medium screen (iPhone 12)
- Large screen (iPhone 14 Pro Max)
- Android devices

### Test Accessibility
- Enable VoiceOver/TalkBack
- Navigate with screen reader
- Test with larger text sizes
- Test in high contrast mode

### Test Performance
- Scroll performance in lists
- Navigation transitions
- Memory usage
- Battery consumption

## 🆘 Troubleshooting

### Issue: Animations laggy
```tsx
// Solution: Add useNativeDriver: true
Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // ✅
}).start();
```

### Issue: FlatList slow scrolling
```tsx
// Solution: Add performance props
<FlatList
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Issue: Toast not showing
```tsx
// Solution: Ensure Toast is rendered and zIndex is set
<View style={{ flex: 1 }}>
  <Toast {...toast} onHide={hideToast} />
  <MyContent />
</View>
```

## 📚 Additional Resources

- Full documentation: [UI_UX_IMPROVEMENTS.md](./UI_UX_IMPROVEMENTS.md)
- Component API reference: [API_REFERENCE.md](./API_REFERENCE.md)
- Accessibility guide: Check component files for inline documentation

---

**Need Help?** Check the comprehensive documentation or review component source code for detailed examples.
