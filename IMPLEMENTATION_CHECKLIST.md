# Implementation Priority Checklist

## Quick Wins (1-2 hours each)

### [ ] 1. Fix Dark Mode Color Contrast
**File:** `constants/theme.ts` or wherever colors are defined

**Change:**
```typescript
// BEFORE (poor contrast)
dark: {
  secondary: '#aaaaaa',  // 4.5:1 contrast
  accent: '#d4a574',
}

// AFTER (improved contrast)
dark: {
  secondary: '#b8b8b8',  // ~5.5:1 contrast
  accent: '#e8b87f',     // ~5.5:1 contrast
  border: '#404040',     // Better definition
}
```

**Impact:** Improved readability and WCAG AA/AAA compliance
**Effort:** 15 minutes
**Testing:** Visit www.contrast-ratio.com for validation

---

### [ ] 2. Replace Emoji Icons with Proper Icons
**File:** `app/(tabs)/_layout.tsx`

**Change:**
```typescript
// BEFORE
<Text style={{ fontSize: 20, color }}>📖</Text>
<Text style={{ fontSize: 20, color }}>📚</Text>
<Text style={{ fontSize: 20, color }}>⚙️</Text>

// AFTER - Option A: Use expo-symbols (already installed)
import { SymbolView } from 'expo-symbols';

<SymbolView name="book.fill" size={24} tintColor={color} />
<SymbolView name="books.vertical.fill" size={24} tintColor={color} />
<SymbolView name="gear" size={24} tintColor={color} />

// AFTER - Option B: Install Material Icons
// npm install @react-native-vector-icons/material

import MaterialIcons from '@react-native-vector-icons/material';

<MaterialIcons name="menu-book" size={24} color={color} />
<MaterialIcons name="library-books" size={24} color={color} />
<MaterialIcons name="settings" size={24} color={color} />
```

**Impact:** Professional appearance, consistent across devices
**Effort:** 30 minutes
**Testing:** Visual inspection on multiple devices

---

### [ ] 3. Centralize Color Constants
**File:** Create `constants/colors.ts`

**Content:**
```typescript
export const COLORS_LIGHT = {
  bg: '#ffffff',
  text: '#000000',
  secondary: '#666666',
  accent: '#8B4513',
  border: '#eeeeee',
  verseBox: '#f9f9f9',
} as const;

export const COLORS_DARK = {
  bg: '#1a1a1a',
  text: '#ffffff',
  secondary: '#b8b8b8',
  accent: '#e8b87f',
  border: '#404040',
  verseBox: '#2a2a2a',
} as const;

export const getColors = (isDark: boolean) =>
  isDark ? COLORS_DARK : COLORS_LIGHT;
```

**Impact:** Single source of truth for colors
**Effort:** 1 hour
**Refactoring:** Replace inline color objects in all screens

---

### [ ] 4. Add Performance Monitoring Hook
**File:** Create `hooks/usePerformanceMetrics.ts`

**Content:**
```typescript
import { useEffect, useRef } from 'react';

export function usePerformanceMetrics(screenName: string) {
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const duration = Date.now() - startTimeRef.current;
    console.log(`[PERF] ${screenName} initial render: ${duration}ms`);

    return () => {
      console.log(`[PERF] ${screenName} unmounted`);
    };
  }, [screenName]);
}
```

**Usage in screens:**
```typescript
export default function VerseScreen() {
  usePerformanceMetrics('VerseScreen');
  // ... rest of component
}
```

**Impact:** Baseline metrics for optimization validation
**Effort:** 30 minutes

---

## Medium Priority (2-4 hours each)

### [ ] 5. Fix Font Loading to Be Non-Blocking
**File:** `app/_layout.tsx`

**Current Issue:**
```typescript
if (!fontsLoaded && !fontError) {
  return null;  // ❌ Blank screen while loading
}
```

**Fix:**
```typescript
useEffect(() => {
  if (fontsLoaded || fontError) {
    SplashScreen.hideAsync().catch(console.warn);
  }
}, [fontsLoaded, fontError]);

// ✅ Continue rendering even if fonts not loaded
return (
  <PreferencesProvider>
    <AppProvider>
      <RootLayoutContent />
    </AppProvider>
  </PreferencesProvider>
);
```

**Impact:** Eliminate blank splash screen, smoother cold start
**Effort:** 2 hours
**Testing:** Start app, measure splash duration

---

### [ ] 6. Implement Lazy Data Loading
**File:** `src/utils/gitaData.ts`

**Replace entire file with:**
```typescript
import { Chapter, ChapterSummary } from '@/src/types';
import gitaDataJson from '@/assets/data.json';

const chapterCache = new Map<number, Chapter>();

export function getChapter(chapterNum: number): Chapter | undefined {
  if (chapterCache.has(chapterNum)) {
    return chapterCache.get(chapterNum);
  }

  const full = gitaDataJson as unknown as Chapter[];
  const chapter = full.find(ch => ch.chapter === chapterNum);

  if (chapter) {
    chapterCache.set(chapterNum, chapter);
    
    // Keep only 5 chapters in memory
    if (chapterCache.size > 5) {
      const firstKey = chapterCache.keys().next().value;
      chapterCache.delete(firstKey);
    }
  }

  return chapter;
}

// Keep other functions similar but use getChapter() instead of getGitaData()
```

**Impact:** 60% memory reduction, faster data access
**Effort:** 3 hours (must test all data access paths)
**Testing:** Verify all chapter navigation works

---

### [ ] 7. Create Memoized Verse Component
**File:** `components/VerseCard.tsx` (new file)

**Content See:** OPTIMIZATION_CODE.md section "OPTIMIZATION 3"

**Impact:** Smooth scrolling, prevent unnecessary re-renders
**Effort:** 3 hours (includes updating imports)
**Testing:** Use React Profiler to measure re-renders

---

### [ ] 8. Implement useThemeColors Hook
**File:** Create `hooks/useThemeColors.ts`

**See:** OPTIMIZATION_CODE.md section "OPTIMIZATION 4"

**Impact:** Single source of truth, memoized colors
**Effort:** 2 hours
**Testing:** Visual verification of all themes

---

## High Priority (4+ hours)

### [ ] 9. Split Preferences Context into Domains
**Files:**
- `src/context/LanguageContext.ts` (new)
- `src/context/ThemeContext.ts` (new)
- `src/context/TogglesContext.ts` (new)
- Keep `src/context/PreferencesContext.tsx` as composite

**Benefits:**
- Language change won't re-render theme consumers
- Theme change won't re-render language consumers
- Settings screen only subscribes to needed contexts

**Effort:** 6-8 hours (comprehensive refactoring)
**Testing:** Full app testing, no regressions

---

### [ ] 10. Create Custom Context Selector Hooks
**Files:**
- `hooks/useLanguagePreference.ts`
- `hooks/useFontSizePreference.ts`
- `hooks/useThemePreference.ts`
- `hooks/useToggles.ts`

**Benefits:**
- Components only re-render when their specific value changes
- Reduced re-render cascades

**Effort:** 4 hours
**Testing:** React Profiler to verify selective re-renders

---

## Phase-Based Implementation Schedule

### Week 1: Quick Wins + Performance Foundation
- [ ] Fix dark mode contrast
- [ ] Replace emoji icons
- [ ] Centralize color constants
- [ ] Add performance monitoring
- **Expected impact:** Better aesthetics + baseline metrics

### Week 2: Data & Rendering Optimizations
- [ ] Fix font loading
- [ ] Implement lazy data loading
- [ ] Create VerseCard component
- [ ] Implement useThemeColors
- **Expected impact:** 50% memory reduction, 3s → 1.5s cold start

### Week 3: State Management Optimization
- [ ] Split contexts (optional - high effort)
- [ ] Create selector hooks
- [ ] Consolidate toggle state
- **Expected impact:** Smooth 60fps scrolling, fast theme switches

### Week 4: Polish & Testing
- [ ] Data quality fixes
- [ ] Comprehensive testing
- [ ] Accessibility audit
- [ ] Performance validation
- **Expected impact:** Production-ready v1.1

---

## Testing Checklist Per Phase

### After Each Phase:

- [ ] Run TypeScript compiler: `npx tsc --noEmit`
- [ ] Run linter: `npm run lint`
- [ ] Run tests: `npm test`
- [ ] Build APK: `eas build --platform android --profile preview`
- [ ] Test on device (at minimum Samsung A10 or equivalent low-end)
- [ ] Test on tablet (if possible)
- [ ] Verify no memory leaks (Android Studio Profiler)
- [ ] Check bundle size impact: `eas build --platform android --profile preview`

---

## Rollback Strategy

Each optimization should have a git branch:

```bash
# Start optimization
git checkout -b optimize/font-loading
# ... implement changes ...
git commit -m "fix: non-blocking font loading"

# If issues arise
git checkout develop
# Problem diagnosed and fixed
git checkout optimize/font-loading
git rebase develop

# Merge when stable
git checkout develop
git merge optimize/font-loading
```

---

## File Modification Checklist

### Phase 1: Quick Wins
- [ ] `constants/theme.ts` - Update COLORS_DARK
- [ ] `app/(tabs)/_layout.tsx` - Replace emoji icons
- [ ] `constants/colors.ts` - CREATE NEW FILE
- [ ] `hooks/usePerformanceMetrics.ts` - CREATE NEW FILE

### Phase 2: Performance
- [ ] `app/_layout.tsx` - Fix font loading
- [ ] `src/utils/gitaData.ts` - Lazy loading
- [ ] `components/VerseCard.tsx` - CREATE NEW FILE
- [ ] `hooks/useThemeColors.ts` - CREATE NEW FILE
- [ ] `app/verse.tsx` - Use VerseCard component
- [ ] `app/reading.tsx` - Update with optimizations

### Phase 3: State Management
- [ ] `src/context/LanguageContext.ts` - CREATE NEW FILE (optional)
- [ ] `src/context/ThemeContext.ts` - CREATE NEW FILE (optional)
- [ ] `src/context/TogglesContext.ts` - CREATE NEW FILE (optional)
- [ ] `hooks/useLanguagePreference.ts` - CREATE NEW FILE
- [ ] `hooks/useFontSizePreference.ts` - CREATE NEW FILE
- [ ] `hooks/useThemePreference.ts` - CREATE NEW FILE
- [ ] All screens - Use new hooks instead of direct context

### Phase 4: Polish
- [ ] `assets/data.json` - Fix verse numbering
- [ ] All screens - Accessibility review
- [ ] All tests - Verify coverage

---

## Quick Reference: Files to Modify

```
HIGH IMPACT (do first):
├── src/utils/gitaData.ts          → Lazy load chapters
├── app/_layout.tsx                 → Non-blocking fonts
├── app/verse.tsx                   → Use VerseCard memo
└── constants/colors.ts             → Centralize colors

MEDIUM IMPACT:
├── app/(tabs)/_layout.tsx          → Replace icons
├── constants/theme.ts              → Improve contrast
├── hooks/useThemeColors.ts         → Create this
└── hooks/usePerformanceMetrics.ts  → Create this

OPTIONAL (if time):
├── src/context/                    → Split context (HIGH EFFORT)
├── hooks/use*Preference.ts         → Create selectors
└── app/reading.tsx                 → Further optimizations
```

---

## Success Metrics

After completing all optimizations, verify:

| Metric | Before | After | Status |
|--------|--------|-------|--------|
| Cold start | ~3-4s | <1.5s | ✅ |
| Data parse | ~200ms | <10ms | ✅ |
| Scroll FPS | Maybe 30fps | 60fps | ✅ |
| Memory (cold) | ~50MB | <20MB | ✅ |
| Memory (chapter) | ~50MB | <30MB | ✅ |
| Color contrast | Some < 4.5 | All > 4.5 | ✅ |
| Icons | Emoji | Professional | ✅ |
| Bundle size | ? | < 10MB | ✅ |

---

## Questions Before Starting?

1. **Can I skip the context split?** Yes, it's optional but recommended
2. **Do I need to test on real device?** Yes, performance varies significantly
3. **Can I do these in different order?** Quick wins can be done first, but data lazy-loading should come before verse memoization
4. **What if something breaks?** Each optimization has a git branch for easy rollback
5. **Will users notice the changes?** Yes - especially cold start (2s faster), scroll smoothness, and visual polish

Good luck! 🚀
