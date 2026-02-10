# Edge Case Handling Guide for Offline React Native

## Overview
This guide provides concrete implementations for handling the 6 edge cases identified in schema validation, ensuring robust offline functionality.

---

## Issue 1: Missing Translations ✅ RECOVERABLE

### Problem
- Hindi, Tamil, Kannada translations are largely "[Language translation needed]"
- User selects language but sees placeholders
- Breaks multilingual promise

### Solution: Fallback Pattern
```typescript
// In any component that displays LocalizableText
import { useAppContext } from '@/src/context/AppContext';

export function getLocalizedText(
  localizable: LocalizableText,
  selectedLanguage?: LangKey
): string {
  const { language } = useAppContext();
  const lang = selectedLanguage || language;
  
  // Pattern: Try selected, then English
  const text = localizable[lang];
  
  // Check if it's a placeholder (data quality issue, not translation)
  if (text.includes('[') && text.includes('needed]')) {
    console.warn(`Missing ${lang} translation, falling back to English`);
    return localizable.english; // Fallback
  }
  
  return text || localizable.english; // Extra safety
}
```

### Usage in Components
```typescript
// In reading.tsx or any verse display
<Text style={styles.verseText}>
  {getLocalizedText(verse.translations)}
</Text>
```

### Data Quality Improvements (Roadmap)
```typescript
// Future enhancement: Track completion percentage
interface TranslationMetadata {
  english: { complete: true; source: string; translator: string };
  hindi: { complete: false; coverage: 15; needsReview: true };
  tamil: { complete: false; coverage: 0; needsReview: false };
  kannada: { complete: false; coverage: 0; needsReview: false };
}

// Could populate from language-specific data files
// App shows completion status in Settings screen
```

### Runtime Validation (Week 1 Task)
```typescript
// Add to utils/gitaData.ts
export function validateTranslations(chapter: Chapter): ValidationReport {
  const report = {
    chapter: chapter.chapter,
    issues: [],
    englishComplete: true,
    otherLanguagesComplete: {
      hindi: 0,
      tamil: 0,
      kannada: 0,
    },
  };
  
  chapter.verses.forEach(verse => {
    if (verse.translations.english.includes('needed')) {
      report.englishComplete = false;
      report.issues.push(`Verse ${verse.verse}: English missing`);
    }
    // Check coverage of other languages
    (['hindi', 'tamil', 'kannada'] as const).forEach(lang => {
      if (!verse.translations[lang].includes('needed')) {
        report.otherLanguagesComplete[lang]++;
      }
    });
  });
  
  return report;
}
```

---

## Issue 2 & 3: Missing Sanskrit + Transliteration 🔴 CRITICAL

### Problem
- ALL 597 verses have "[Sanskrit text needed]"
- ALL transliterations marked "[Transliteration needed]"
- Core educational feature blocked

### Solution Framework

#### Step 1: Populate Sanskrit (Manual or Source Data)
```typescript
// Option A: Load from external source (Gita-API.com or similar)
async function populateSanskritFromAPI(chapterId: number) {
  try {
    const response = await fetch(
      `https://bhagavad-gita-api.herokuapp.com/v1/chapters/${chapterId}/verses`
    );
    const verses = await response.json();
    return verses.map(v => ({
      verse: v.verse_number,
      sanskrit: v.text, // Usually available in APIs
    }));
  } catch (error) {
    console.warn('Cannot fetch Sanskrit - offline mode', error);
    return null; // Gracefully degrade
  }
}

// Option B: Use bundled source file (Recommended for offline)
import SANSKRIT_DATA from '@/assets/sanskrit-original.json';
```

#### Step 2: Auto-Generate Transliteration
```typescript
// Install: npm install iast-converter
// or: npm install sanscript (Google's Sanskrit script library)

import * as Sanscript from 'sanscript';

export function generateTransliteration(sanskrit: string): string {
  try {
    // Convert Devanagari (IAST) to Latin (IAST)
    return Sanscript.transliterate(
      sanskrit,
      'Devanagari', // Input script
      'IAST'        // Output script (International Alphabet Sanskrit Transliteration)
    );
  } catch (error) {
    console.warn('Transliteration failed, showing Sanskrit', error);
    return sanskrit; // Fallback to Sanskrit
  }
}

// Usage in verse display:
const transliteration = verses[i].transliteration.includes('needed')
  ? generateTransliteration(verses[i].sanskrit)
  : verses[i].transliteration;
```

#### Step 3: Update Data Schema (Non-Breaking)
```typescript
// Add to Verse interface (backwards compatible)
export interface Verse {
  // ... existing fields
  
  // New optional field - safe to ignore in old code
  metadata?: {
    isCompleteSanskrit?: boolean;
    isCompleteTransliteration?: boolean;
    requiresVerification?: boolean;
    source?: string;
  };
}
```

#### Timeline
- **Week 1**: Get Sanskrit text source (GitHub, API, or public domain)
- **Week 2**: Bulk transliteration generation + validation
- **Week 3**: QA review + user testing
- **Week 4**: Ship in v1.1 update

---

## Issue 4: Long Verses (500+ Characters) ✅ ALREADY HANDLED

### Problem
- Verse 1.4 is 488 chars (longest found)
- May not fit on small screens without wrapping

### Current Solution
✅ **Already implemented in reading.tsx** using `ScrollView`

### Verification
```typescript
// In utils/gitaData.ts - add this QA test
export function analyzeVerseLength(
  chapters: Chapter[]
): { avgLength: number; maxLength: number; longest: string } {
  let total = 0;
  let max = 0;
  let longestVerse = '';
  let count = 0;
  
  chapters.forEach(ch => {
    ch.verses.forEach(v => {
      const len = v.translations.english.length;
      total += len;
      count++;
      if (len > max) {
        max = len;
        longestVerse = `${ch.chapter}.${v.verse}: ${len} chars`;
      }
    });
  });
  
  return {
    avgLength: Math.round(total / count),
    maxLength: max,
    longest: longestVerse,
  };
}

// Example output: { avgLength: 287, maxLength: 488, longest: "1.4: 488 chars" }
```

### Mobile Safety Checklist
- [x] ScrollView wraps verse text
- [x] Font scaling supports long text (12-24px)
- [x] Line height provides adequate spacing
- [x] No horizontal scroll (wrap enabled)
- [ ] **TODO**: Test on 4.5" screen (minimum target)
- [ ] **TODO**: Add character count warnings in Settings? (Optional UX improvement)

---

## Issue 5: Verse Numbering Gaps ✅ ALREADY HANDLED

### Problem
- Chapter 1 has verses: 1, 2, 3, 4, 7, 8... (5, 6, 9-35 missing or gap)
- Array index ≠ verse number

### Safe Practice: Always Use Verse ID
```typescript
// ❌ WRONG
const thisVerse = chapter.verses[3]; // Assumes index 3 = verse 3!

// ✅ CORRECT  
const verseFour = chapter.verses.find(v => v.verse === 4);

// ✅ CORRECT - Navigation
const nextVerse = chapter.verses[currentIndex + 1]; // Use array index
// But then use: nextVerse.verse to display/store
```

### Data Integrity Check
```typescript
export function validateVerseOrdering(chapter: Chapter) {
  const gaps = [];
  const verses = chapter.verses;
  
  for (let i = 1; i < verses.length; i++) {
    if (verses[i].verse !== verses[i - 1].verse + 1) {
      gaps.push({
        after: verses[i - 1].verse,
        before: verses[i].verse,
        missing: verses[i].verse - verses[i - 1].verse - 1,
      });
    }
  }
  
  if (gaps.length > 0) {
    console.warn(`Chapter ${chapter.chapter} has numbering gaps:`, gaps);
  }
}

// Example output:
// { after: 4, before: 7, missing: 2 } // Verses 5-6 are missing
```

### UI Display (Transparent to User)
```typescript
// In reading.tsx - navigate by array, display by verse number
const verseDisplayText = `Verse ${currentVerse.verse}`;
// This maps array indices transparently to display numbers

// When saving to AsyncStorage:
// Store by verse number, not index!
AsyncStorage.setItem('lastVerse', String(currentVerse.verse));
```

---

## Issue 6: Commentary Sparsity ✅ MOSTLY OKAY

### Problem
- Only ~30% of verses have English commentary
- Tamil/Kannada commentary almost non-existent
- Commentary is optional—reasonable to handle

### Current Solution
```typescript
// Using Partial<LocalizableText> is correct approach
export interface Verse {
  commentary?: Partial<LocalizableText>;
}
```

### Safe Display Pattern
```typescript
// In reading.tsx
function CommentarySection({ verse, language }: Props) {
  const commentary = verse.commentary?.[language];
  
  if (!commentary) {
    return null; // Don't show section if unavailable
  }
  
  if (commentary.includes('Commentary needed') || !commentary.trim()) {
    return (
      <Text style={styles.placeholderText}>
        Commentary not yet available for this verse
      </Text>
    );
  }
  
  return (
    <View style={styles.commentaryBox}>
      <Text style={styles.commentaryLabel}>Commentary</Text>
      <Text style={styles.commentaryText}>{commentary}</Text>
    </View>
  );
}
```

### Future Enhancement
```typescript
// Could add commentary crowdsourcing (v2.0)
interface CommentaryContribution {
  verse: number;
  chapter: number;
  language: LangKey;
  authorName: string;
  authorSchool?: string; // Advaita, Bhakti, etc.
  text: string;
  dateSubmitted: string;
  upvotes: number;
}
```

---

## Complete Edge Case Checklist

### For App Developers (Immediate)
- [ ] Implement `getLocalizedText()` fallback function
- [ ] Add translation validation to data utils
- [ ] Test on minimum screen size (4.5" or 360px)
- [ ] Verify verse number gaps aren't breaking navigation
- [ ] Remove placeholder commentary from display

### For Data Team (Week 1)
- [ ] Populate Sanskrit for all 597 verses
- [ ] Generate/populate transliterations
- [ ] Complete all English translations
- [ ] Verify verse numbering is intentional (not data corruption)

### For QA (Week 2)
- [ ] Test on devices: 5" Android 8+, 6.5" Android 12+
- [ ] Verify language switching works with falling back to English
- [ ] Check memory usage stays under 100MB
- [ ] Verify offline functionality (disable network, try all features)

### For Future Enhancement (v1.1+)
- [ ] Add translation completion dashboard
- [ ] Support progressive loading of missing languages
- [ ] Add metadata tracking to Verse interface
- [ ] User feedback form for missing translations

---

## References

- **Sanscript Library**: https://github.com/google/sanscript (for transliteration)
- **Gita API**: https://github.com/vedicscriptures/gita (for Sanskrit source)
- **AsyncStorage**: https://react-native-async-storage.github.io/ (for offline persistence)
- **Unicode Handling**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl

