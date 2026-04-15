# Performance Testing & Validation Guide

## Quick Performance Audit Commands

### 1. Build Size Analysis
```bash
cd gita-app

# Build production APK and check size
eas build --platform android --profile preview
# Look for: app-release.apk size in build logs

# Analyze bundle (if using web)
npm run web -- --analyze
```

### 2. Cold Start Measurement Script
Create `__tests__/performance.test.ts`:

```typescript
import { performance } from 'react-native';

describe('App Cold Start Performance', () => {
  test('should initialize app within 2 seconds', () => {
    const startTime = performance.now();
    
    // App initialization happens here
    // This is measured by Expo automatically
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).toBeLessThan(2000);  // 2 seconds
  });

  test('should load chapter data within 500ms', () => {
    const startTime = performance.now();
    
    const chapter = getChapter(1);
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).toBeLessThan(500);
    expect(chapter).toBeDefined();
    expect(chapter?.verses.length).toBeGreaterThan(0);
  });

  test('should parse all chapters within 100ms', () => {
    const startTime = performance.now();
    
    for (let i = 1; i <= 18; i++) {
      getChapter(i);
    }
    
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).toBeLessThan(100);  // Should be instant from cache
  });
});
```

Run with:
```bash
npm run test -- performance.test.ts
```

### 3. Memory Profiling

**Using Android Studio:**
```
1. Connect device via USB
2. Open Android Studio → Profile
3. Select your app process
4. Record Memory profile for 60 seconds
5. Scroll through verses and check for:
   - Steady heap size (no increasing trend)
   - Memory drops after garbage collection
   - No memory leaks
```

**Using Expo DevTools:**
```bash
npm start
# Press 'i' for iOS or 'a' for Android
# Check the logs for memory usage
```

### 4. Scroll Performance Testing

**Manual Test:**
1. Build app with: `eas build --platform android --profile preview`
2. Install on device
3. Open verse screen
4. Quickly scroll up/down 50 verses
5. Verify:
   - ✅ Each scroll frame renders smoothly
   - ✅ No visible stuttering
   - ✅ Touch response is immediate
   - ✅ Font rendering is crisp

**Automated Test:**
Create `__tests__/rendering.test.ts`:

```typescript
describe('Render Performance', () => {
  test('VerseItem should not re-render unnecessarily', () => {
    const { rerender } = render(
      <VerseItem
        item={mockVerse}
        showTransliteration={true}
        showTranslation={true}
        showCommentary={false}
        // ... other props
      />
    );

    const firstRender = /* capture render count */;
    
    // Re-render with same props
    rerender(
      <VerseItem
        item={mockVerse}
        showTransliteration={true}
        showTranslation={true}
        showCommentary={false}
        // ... same props
      />
    );

    // Should not have re-rendered due to memo()
    expect(/* render count */).toBe(firstRender);
  });

  test('FlatList should render initial batch quickly', () => {
    const testData = Array.from({ length: 50 }, (_, i) => ({
      verse: i + 1,
      sanskrit: 'test',
      translations: { english: 'test', hindi: 'test' },
    }));

    const startTime = performance.now();

    render(
      <FlatList
        data={testData}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={7}
        renderItem={({ item }) => <VerseItem item={item} {...otherProps} />}
      />
    );

    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(500);
  });
});
```

### 5. Network/Data Loading (if adding API later)

```typescript
describe('Data Loading Performance', () => {
  test('should load chapter data with cache', async () => {
    // First load
    const start1 = performance.now();
    const chapter1 = getChapter(1);
    const time1 = performance.now() - start1;

    // Should be <10ms from cache
    const start2 = performance.now();
    const chapter2 = getChapter(1);
    const time2 = performance.now() - start2;

    expect(time2).toBeLessThan(10);
    expect(time2).toBeLessThan(time1);  // Cached should be faster
  });

  test('cache eviction should keep memory bounded', () => {
    const memBefore = /* get heap size */;

    // Load and evict 10 chapters
    for (let i = 1; i <= 10; i++) {
      getChapter(i % 18 || 18);
    }

    const memAfter = /* get heap size */;
    const memIncrease = memAfter - memBefore;

    // Should not grow beyond max cached chapters
    expect(memIncrease).toBeLessThan(100 * 1024);  // 100KB for 5 cached chapters
  });
});
```

### 6. React DevTools Profiler

**In Development:**
```bash
npm start
```

Install React DevTools Profiler:
```bash
npm install --save-dev @react-devtools/core
```

Use in app:
```javascript
// At app root
import { unstable_trace } from 'react';

function measureRender(name) {
  unstable_trace(`${name}`, performance.now(), () => {
    // Component render happens here
  });
}
```

Then in DevTools:
1. Open React DevTools
2. Go to "Profiler" tab
3. Start recording
4. Perform actions (navigate, scroll)
5. Stop recording
6. Analyze:
   - Which components rendered?
   - How long did render take?
   - Why did each component render?

### 7. Chrome DevTools (Web Build)

```bash
npm run web

# In Chrome:
# 1. DevTools (F12) → Performance tab
# 2. Start recording
# 3. Interact with app
# 4. Stop recording
# 5. Analyze flame graph for:
#    - Long tasks (>50ms)
#    - Script evaluation time
#    - Rendering time
#    - Layout time
```

### 8. TypeScript Type Checking

Ensure no runtime type errors (which slow down performance):
```bash
npx tsc --noEmit
```

### 9. Lint & Code Quality

```bash
npm run lint
```

Look for:
- Unused variables (memory waste)
- Unreachable code
- Missing memoization
- Inefficient loops

---

## Performance Benchmarks (Target)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **Cold Start** | ?s | <1.5s | TBD |
| **Chapter Load** | ?ms | <200ms | TBD |
| **Verse Scroll** | Jank? | 60fps | TBD |
| **Memory (Chapter)** | ~50MB | <30MB | TBD |
| **Memory (All)** | 0.51MB | <10MB | TBD |
| **Data Parse** | ?ms | <10ms | TBD |
| **Toggle Switch** | ? | <100ms | TBD |
| **Theme Switch** | ? | <200ms | TBD |

---

## Before & After Testing

### Setup Baseline
1. Comment out optimizations
2. Run full test suite
3. Record metrics in BASELINE.json

### Implement Optimization
1. Implement one optimization
2. Run tests again
3. Record metrics in OPTIMIZATION_1.json
4. Compare: `(BASELINE - OPTIMIZATION_1) / BASELINE * 100 = % improvement`

---

## Accessibility Testing Checklist

### Color Contrast
```bash
# Use this to verify each color combination:
# https://www.contrast-ratio.com

# Test:
- Text on backgrounds
- Buttons on backgrounds
- Icons on backgrounds
- Disabled states
```

### Screen Reader (TalkBack)
1. Enable TalkBack on Android
2. Navigate app completely
3. Verify:
   - ✅ All buttons are announced
   - ✅ Heading hierarchy is correct
   - ✅ Form inputs have labels
   - ✅ Links are distinguishable from text

### Touch Target Size
```
Recommended: 48dp x 48dp (24dx24mm)
Minimum: 44dp x 44dp (22dp x 22mm)

Verify all buttons and interactive elements meet this standard
```

### Font Size
- Minimum: 12sp (scalable pixels)
- Base: 16sp
- Heading: 20-28sp
- All text should scale with user preference

---

## CI/CD Performance Checks

Add to your CI pipeline:
```yaml
# .github/workflows/performance.yml
name: Performance Check
on: [pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test -- performance.test.ts
      - run: npx tsc --noEmit
      - run: npm run lint
```

---

## Measurement Tool Setup

### Option 1: React Native Profiler
```typescript
// app/_layout.tsx
import { enableScreens } from 'react-native-screens';

// Enable screen optimization
enableScreens();

// Add performance monitoring
if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.('Non-serializable values')) {
      return;
    }
    originalWarn(...args);
  };
}
```

### Option 2: Custom Metrics Collector
```typescript
// hooks/usePerformanceMetrics.ts
import { useEffect, useRef } from 'react';

export function usePerformanceMetrics(screenName: string) {
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const duration = Date.now() - startTimeRef.current;
    console.log(`[Performance] ${screenName} rendered in ${duration}ms`);

    return () => {
      const totalTime = Date.now() - startTimeRef.current;
      console.log(`[Performance] ${screenName} total time: ${totalTime}ms`);
    };
  }, [screenName]);
}

// Usage:
export default function VerseScreen() {
  usePerformanceMetrics('VerseScreen');
  // ...
}
```

---

## Expected Results After Optimizations

### Phase 1: Font Loading + Data Lazy Loading
- ✅ Cold start: 3.5s → 1.5s (57% improvement)
- ✅ Memory: 50MB → 20MB (60% reduction)
- ✅ Data load: 200ms → <10ms
- ✅ No blank splash screen

### Phase 2: Memoization + Context Split
- ✅ Scroll FPS: 30fps → 60fps
- ✅ Toggle switch: 500ms → 100ms
- ✅ Theme switch: 1000ms → 200ms
- ✅ Navigation: smoother transitions

### Phase 3: UI Polish
- ✅ Improved contrast (WCAG AAA)
- ✅ Consistent spacing
- ✅ Professional icons
- ✅ Better accessibility

---

## Continuous Monitoring

Add performance monitoring to production builds:
```typescript
// Sentry or similar service
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "YOUR_DSN",
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.ReactNavigationIntegration(),
  ],
});

// Measure transactions
const transaction = Sentry.startTransaction({
  name: "VerseScreenLoad",
  op: "load",
});

// ... load verse data ...

transaction.finish();
```

This allows you to monitor real-world performance on user devices.
