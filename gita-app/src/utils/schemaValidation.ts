/**
 * Data Validation & Utility Functions for Gita Schema
 * 
 * Provides runtime checks for data quality and edge cases
 * Use during development to identify missing translations, broken references, etc.
 * 
 * USAGE:
 *   import { validateAllData, getLocalizedText } from '@/src/utils/schemaValidation';
 */

import { Chapter, Verse, LangKey, LocalizableText } from '@/src/types';

/**
 * SAFE LANGUAGE SELECTION WITH FALLBACK
 * 
 * Handles missing translations gracefully by falling back to English.
 * Should be used in UI components instead of direct dictionary access.
 * 
 * @param localizable - The LocalizableText object
 * @param language - Preferred language (defaults to 'english' if missing)
 * @returns Safe text string, never null
 * 
 * EXAMPLE:
 *   const text = getLocalizedText(verse.translations, userLanguage);
 *   // If user language is 'hindi' but hindi translation is placeholder,
 *   // automatically returns english translation
 */
export function getLocalizedText(
  localizable: LocalizableText | Partial<LocalizableText>,
  language: LangKey = 'english'
): string {
  if (!localizable) {
    console.warn('getLocalizedText: null/undefined passed');
    return '[Content unavailable]';
  }

  // Get the requested language
  const text = (localizable as any)[language];

  // Check if it's a placeholder (data quality issue)
  if (text && typeof text === 'string') {
    if (isPlaceholder(text)) {
      console.warn(
        `Translation missing for ${language}, falling back to English`
      );
      return (localizable as any).english || '[Translation needed]';
    }
    return text;
  }

  // Not found, try English (ultimate fallback)
  const english = (localizable as any).english;
  if (english && !isPlaceholder(english)) {
    return english;
  }

  return '[Translation unavailable]';
}

/**
 * CHECK IF STRING IS A PLACEHOLDER
 * @internal
 */
function isPlaceholder(text: string): boolean {
  if (!text || typeof text !== 'string') return true;
  return text.includes('[') && text.includes('needed]');
}

/**
 * FIND VERSE BY NUMBER (Safe lookup)
 * 
 * Since verse numbers may have gaps (e.g., 1, 2, 3, 7, 8...),
 * never use array index. Always use this function.
 * 
 * @param chapter - The chapter to search
 * @param verseNumber - The verse number to find
 * @returns Verse if found, undefined otherwise
 * 
 * EXAMPLE:
 *   const verse = findVerse(chapter, 4);
 *   // ✅ CORRECT: Finds verse #4 even if it's at array index 3
 *   
 *   // ❌ WRONG - Don't do this:
 *   const verse = chapter.verses[3]; // Assumes index 3 = verse 3
 */
export function findVerse(chapter: Chapter, verseNumber: number): Verse | undefined {
  return chapter.verses.find(v => v.verse === verseNumber);
}

/**
 * GET NEXT/PREVIOUS VERSE (Handles gaps)
 * 
 * @param chapter - The chapter
 * @param currentVerseNumber - Current verse number
 * @param direction - 'next' or 'previous'
 * @returns Next/previous Verse or undefined if at boundary
 * 
 * EXAMPLE:
 *   const nextVerse = getAdjacentVerse(chapter, 4, 'next');
 *   // If verse 5 is missing, jumps to verse 7
 */
export function getAdjacentVerse(
  chapter: Chapter,
  currentVerseNumber: number,
  direction: 'next' | 'previous'
): Verse | undefined {
  const currentIndex = chapter.verses.findIndex(v => v.verse === currentVerseNumber);
  if (currentIndex === -1) return undefined;

  if (direction === 'next') {
    return chapter.verses[currentIndex + 1];
  } else {
    return chapter.verses[currentIndex - 1];
  }
}

/**
 * TRANSLATION COMPLETION REPORT
 * 
 * Analyzes data quality and returns coverage percentages
 * Use for debugging and tracking translation progress
 * 
 * @param chapters - All chapters
 * @returns Report with statistics per language
 * 
 * EXAMPLE OUTPUT:
 *   {
 *     totalVerses: 700,
 *     english: { coverage: 95, missing: 35 },
 *     hindi: { coverage: 15, missing: 595 },
 *     tamil: { coverage: 0, missing: 700 },
 *     kannada: { coverage: 0, missing: 700 },
 *     commentary: { coverage: 30, missing: 470 }
 *   }
 */
export interface TranslationReport {
  totalVerses: number;
  english: { coverage: number; missing: number; affectedVerses: string[] };
  hindi: { coverage: number; missing: number; affectedVerses: string[] };
  tamil: { coverage: number; missing: number; affectedVerses: string[] };
  kannada: { coverage: number; missing: number; affectedVerses: string[] };
  commentary: { coverage: number; missing: number; affectedVerses: string[] };
  sanskrit: { coverage: number; missing: number; affectedVerses: string[] };
  transliteration: { coverage: number; missing: number; affectedVerses: string[] };
}

export function generateTranslationReport(chapters: Chapter[]): TranslationReport {
  const report: TranslationReport = {
    totalVerses: 0,
    english: { coverage: 0, missing: 0, affectedVerses: [] },
    hindi: { coverage: 0, missing: 0, affectedVerses: [] },
    tamil: { coverage: 0, missing: 0, affectedVerses: [] },
    kannada: { coverage: 0, missing: 0, affectedVerses: [] },
    commentary: { coverage: 0, missing: 0, affectedVerses: [] },
    sanskrit: { coverage: 0, missing: 0, affectedVerses: [] },
    transliteration: { coverage: 0, missing: 0, affectedVerses: [] },
  };

  const languages: (keyof Omit<
    TranslationReport,
    'totalVerses'
  >)[] = [
    'english',
    'hindi',
    'tamil',
    'kannada',
    'commentary',
    'sanskrit',
    'transliteration',
  ];

  chapters.forEach(chapter => {
    chapter.verses.forEach(verse => {
      report.totalVerses++;
      const verseId = `${chapter.chapter}.${verse.verse}`;

      // Check translations
      (['english', 'hindi', 'tamil', 'kannada'] as const).forEach(lang => {
        if (isPlaceholder(verse.translations[lang])) {
          report[lang].missing++;
          report[lang].affectedVerses.push(verseId);
        } else {
          report[lang].coverage++;
        }
      });

      // Check commentary (optional field)
      const hasCommentary =
        verse.commentary &&
        Object.values(verse.commentary).some(com => !isPlaceholder(com));
      if (!hasCommentary) {
        report.commentary.missing++;
        report.commentary.affectedVerses.push(verseId);
      } else {
        report.commentary.coverage++;
      }

      // Check Sanskrit
      if (isPlaceholder(verse.sanskrit)) {
        report.sanskrit.missing++;
        report.sanskrit.affectedVerses.push(verseId);
      } else {
        report.sanskrit.coverage++;
      }

      // Check Transliteration
      if (isPlaceholder(verse.transliteration)) {
        report.transliteration.missing++;
        report.transliteration.affectedVerses.push(verseId);
      } else {
        report.transliteration.coverage++;
      }
    });
  });

  // Convert to percentages
  if (report.totalVerses > 0) {
    (['english', 'hindi', 'tamil', 'kannada', 'commentary', 'sanskrit', 'transliteration'] as const).forEach(
      lang => {
        report[lang].coverage = Math.round(
          ((report[lang].coverage / report.totalVerses) * 100 * 100) / 100
        );
        report[lang].missing = Math.round(
          ((report[lang].missing / report.totalVerses) * 100 * 100) / 100
        );
      }
    );
  }

  return report;
}

/**
 * VERSE LENGTH ANALYSIS (for mobile layout planning)
 * 
 * Identifies longest verses to ensure UI can handle them
 * 
 * @param chapters - All chapters
 * @returns Analysis with statistics
 * 
 * EXAMPLE OUTPUT:
 *   {
 *     avgCharacters: 287,
 *     maxCharacters: 488,
 *     verseWithMaxLength: "1.4",
 *     versesOver400Chars: ["1.4", "3.21", ...],
 *     warning: "Longest verse is 488 chars - ensure text scrolls on small screens"
 *   }
 */
export interface VerseLengthAnalysis {
  avgCharacters: number;
  maxCharacters: number;
  minCharacters: number;
  verseWithMaxLength: string;
  versesOver400Chars: string[];
  versesOver500Chars: string[];
}

export function analyzeVerseLengths(chapters: Chapter[]): VerseLengthAnalysis {
  const analysis: VerseLengthAnalysis = {
    avgCharacters: 0,
    maxCharacters: 0,
    minCharacters: Infinity,
    verseWithMaxLength: '',
    versesOver400Chars: [],
    versesOver500Chars: [],
  };

  let total = 0;
  let count = 0;

  chapters.forEach(chapter => {
    chapter.verses.forEach(verse => {
      const length = verse.translations.english.length;
      total += length;
      count++;

      if (length > analysis.maxCharacters) {
        analysis.maxCharacters = length;
        analysis.verseWithMaxLength = `${chapter.chapter}.${verse.verse}`;
      }

      if (length < analysis.minCharacters) {
        analysis.minCharacters = length;
      }

      if (length > 400) {
        analysis.versesOver400Chars.push(`${chapter.chapter}.${verse.verse}`);
      }

      if (length > 500) {
        analysis.versesOver500Chars.push(`${chapter.chapter}.${verse.verse}`);
      }
    });
  });

  analysis.avgCharacters = Math.round(total / count);
  return analysis;
}

/**
 * VERSE NUMBERING VALIDATION (detects gaps)
 * 
 * Ensures verse numbers are sequential or identifies intentional gaps
 * 
 * @param chapters - All chapters
 * @returns Report of any numbering issues
 * 
 * EXAMPLE OUTPUT:
 *   {
 *     validated: true,
 *     gaps: [
 *       { chapter: 1, after: 4, before: 7, missingCount: 2 },
 *       { chapter: 1, after: 34, before: 36, missingCount: 1 }
 *     ],
 *     totalGaps: 3,
 *     note: "Use verse.verse field for lookup, not array index"
 *   }
 */
export interface VerseNumberingReport {
  validated: boolean;
  totalVerses: number;
  gaps: Array<{
    chapter: number;
    after: number;
    before: number;
    missingCount: number;
  }>;
  totalGaps: number;
}

export function validateVerseNumbering(chapters: Chapter[]): VerseNumberingReport {
  const report: VerseNumberingReport = {
    validated: true,
    totalVerses: 0,
    gaps: [],
    totalGaps: 0,
  };

  chapters.forEach(chapter => {
    const verses = chapter.verses;
    report.totalVerses += verses.length;

    for (let i = 1; i < verses.length; i++) {
      const prev = verses[i - 1].verse;
      const curr = verses[i].verse;

      if (curr !== prev + 1) {
        report.gaps.push({
          chapter: chapter.chapter,
          after: prev,
          before: curr,
          missingCount: curr - prev - 1,
        });
        report.totalGaps++;
      }
    }
  });

  return report;
}

/**
 * FULL DATA VALIDATION (Run on app startup in dev mode)
 * 
 * Performs all checks and returns comprehensive report
 * 
 * USAGE:
 *   if (__DEV__) {
 *     const report = validateAllData(gitaData);
 *     console.log(report);
 *     if (!report.isValid) {
 *       Alert.alert('Data Quality Issues', report.summary);
 *     }
 *   }
 */
export interface FullValidationReport {
  isValid: boolean;
  timestamp: string;
  chapters: number;
  verses: number;
  summary: string;
  translations: TranslationReport;
  verseLengths: VerseLengthAnalysis;
  verseNumbering: VerseNumberingReport;
  recommendations: string[];
}

export function validateAllData(chapters: Chapter[]): FullValidationReport {
  const translations = generateTranslationReport(chapters);
  const verseLengths = analyzeVerseLengths(chapters);
  const verseNumbering = validateVerseNumbering(chapters);

  const recommendations: string[] = [];

  // Build recommendations based on analysis
  if (translations.sanskrit.coverage < 50) {
    recommendations.push(
      '⚠️ Sanskrit text incomplete - populate from original source'
    );
  }
  if (translations.transliteration.coverage < 50) {
    recommendations.push(
      '⚠️ Transliterations missing - generate using sanscript library'
    );
  }
  if (translations.hindi.coverage < 30) {
    recommendations.push('⚠️ Hindi translations sparse - only ' +
      translations.hindi.coverage + '% complete');
  }
  if (verseLengths.versesOver500Chars.length > 0) {
    recommendations.push(
      `ℹ️ ${verseLengths.versesOver500Chars.length} verses exceed 500 chars - ensure scrollable UI`
    );
  }
  if (verseNumbering.totalGaps > 0) {
    recommendations.push(
      `ℹ️ ${verseNumbering.totalGaps
        } gaps in verse numbering - always use verse.verse field for lookup`
    );
  }

  const report: FullValidationReport = {
    isValid:
      translations.english.coverage > 90 &&
      translations.sanskrit.coverage > 90 &&
      verseNumbering.totalGaps === 0,
    timestamp: new Date().toISOString(),
    chapters: chapters.length,
    verses: verseNumbering.totalVerses,
    summary:
      `Data Quality: ${Math.round(
        (translations.english.coverage + translations.sanskrit.coverage) / 2
      )}% complete. ${recommendations.length} issues found.`,
    translations,
    verseLengths,
    verseNumbering,
    recommendations,
  };

  return report;
}

/**
 * PRETTY PRINT VALIDATION REPORT (for debugging)
 */
export function printValidationReport(report: FullValidationReport): void {
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📖 Gita Data Validation Report - ${report.timestamp}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Status: ${report.isValid ? '✅ VALID' : '❌ ISSUES FOUND'}`);
  console.log(`\nData: ${report.chapters} chapters, ${report.verses} verses`);

  console.log('\n📊 Translation Coverage:');
  console.log(`  English:     ${report.translations.english.coverage}%`);
  console.log(`  Sanskrit:    ${report.translations.sanskrit.coverage}%`);
  console.log(`  Transliter.: ${report.translations.transliteration.coverage}%`);
  console.log(`  Hindi:       ${report.translations.hindi.coverage}%`);
  console.log(`  Tamil:       ${report.translations.tamil.coverage}%`);
  console.log(`  Kannada:     ${report.translations.kannada.coverage}%`);
  console.log(`  Commentary:  ${report.translations.commentary.coverage}%`);

  console.log('\n📏 Verse Lengths:');
  console.log(`  Average: ${report.verseLengths.avgCharacters} chars`);
  console.log(`  Max: ${report.verseLengths.maxCharacters} chars (${report.verseLengths.verseWithMaxLength})`);
  console.log(`  Long verses (>400 chars): ${report.verseLengths.versesOver400Chars.length}`);

  if (report.verseNumbering.totalGaps > 0) {
    console.log('\n⚠️ Verse Numbering Gaps:');
    report.verseNumbering.gaps.slice(0, 5).forEach(gap => {
      console.log(
        `  Chapter ${gap.chapter}: verses ${gap.after} → ${gap.before} (${gap.missingCount} missing)`
      );
    });
  }

  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`  ${rec}`));
  }

  console.log('\n═══════════════════════════════════════════════════════════');
}
