/**
 * Bhagavad Gita Data Types
 * 
 * Type definitions for the normalized Gita data structure.
 * Use these types for type-safe access to chapter and verse data.
 */

/**
 * Localized text in multiple languages
 */
export interface LocalizableText {
  english: string;
  hindi: string | null;
}

/**
 * Optional localized text (for sparse content like commentary)
 */
export interface PartialLocalizable {
  english?: string | null;
  hindi?: string | null;
}

/**
 * A single verse in the Gita
 */
export interface Verse {
  /** Verse number (note: may have gaps, e.g., 1, 2, 4, 7, ...) */
  verse: number;

  /** Original Sanskrit text in Devanagari script */
  sanskrit: string | null;

  /** Latin transliteration using IAST standard */
  transliteration: string | null;

  /** Translations in supported languages */
  translations: LocalizableText;

  /** Optional: Commentary from various scholars (incomplete) */
  commentary?: PartialLocalizable;
}

/**
 * A chapter of the Bhagavad Gita
 */
export interface Chapter {
  /** Chapter number (1-18) */
  chapter: number;

  /** Total number of verses in this chapter */
  verse_count: number;

  /** Yoga name in multiple languages */
  name: LocalizableText;

  /** Array of verses in this chapter */
  verses: Verse[];
}

/**
 * Type helper: Get localized text with fallback
 * 
 * @example
 * const text = getLocalizedText(chapter.name, 'hindi');
 * // Returns chapter name in Hindi, or English if Hindi is null
 */
export function getLocalizedText(
  text: LocalizableText,
  language: 'english' | 'hindi' = 'english'
): string {
  const value = text[language];
  if (value) return value;
  return text.english; // Fallback to English
}

/**
 * Type helper: Check if a verse has translations in a language
 */
export function hasTranslation(
  verse: Verse,
  language: keyof LocalizableText
): boolean {
  return verse.translations[language] !== null && verse.translations[language] !== undefined;
}

/**
 * Type helper: Get available languages for a verse
 */
export function getAvailableLanguages(verse: Verse): Array<keyof LocalizableText> {
  const languages: Array<keyof LocalizableText> = [];
  
  if (verse.translations.english) languages.push('english');
  if (verse.translations.hindi) languages.push('hindi');
  
  return languages;
}

/**
 * Type helper: Search for verses containing specific text
 */
export function searchVerses(
  chapter: Chapter,
  query: string,
  language: keyof LocalizableText = 'english'
): Verse[] {
  const lowerQuery = query.toLowerCase();
  return chapter.verses.filter(verse => {
    const text = verse.translations[language];
    if (!text) return false;
    return text.toLowerCase().includes(lowerQuery);
  });
}

/**
 * Import example for React Native
 * 
 * @example
 * // Import a chapter
 * import chapter1 from '../data/chapters/chapter-01.json';
 * 
 * // Type it
 * const ch: Chapter = chapter1;
 * 
 * // Access verse 1
 * const verse1: Verse | undefined = ch.verses[0]; // Note: verses[0] is verse #1
 * 
 * // Find a specific verse by number
 * const verse10 = ch.verses.find(v => v.verse === 10);
 * 
 * // Get translations
 * if (verse10) {
 *   console.log(getLocalizedText(ch.name));  // "Arjuna Vishada Yoga"
 *   console.log(verse10.sanskrit);            // Sanskrit text in Devanagari
 *   console.log(verse10.translations.english); // English translation
 * }
 */

// ============================================================================
// Data Statistics
// ============================================================================

/**
 * Quick reference for Gita structure
 */
export const GITA_STATS = {
  totalChapters: 18,
  totalVerses: 710,
  chaptersWithVerseCounts: {
    1: 47, 2: 73, 3: 44, 4: 43, 5: 30, 6: 48, 7: 31, 8: 29,
    9: 35, 10: 43, 11: 56, 12: 21, 13: 36, 14: 28, 15: 21, 16: 25, 17: 29, 18: 79,
  },
  languages: ['english', 'hindi'] as const,
  completionStatus: {
    sanskrit: 'Complete',
    transliteration: 'Complete (IAST)',
    english: 'Complete',
    hindi: 'Partial (~50%)',
  }
} as const;

// ============================================================================
// Usage Patterns
// ============================================================================

/**
 * Common usage patterns for working with Gita data
 */
export class GitaHelper {
  /**
   * Load all chapters
   */
  static async loadAllChapters(): Promise<Chapter[]> {
    const chapters: Chapter[] = [];
    for (let i = 1; i <= 18; i++) {
      const chapter = await import(`../data/chapters/chapter-${String(i).padStart(2, '0')}.json`);
      chapters.push(chapter);
    }
    return chapters;
  }

  /**
   * Load a specific chapter
   */
  static async loadChapter(chapterNumber: number): Promise<Chapter> {
    if (chapterNumber < 1 || chapterNumber > 18) {
      throw new Error(`Invalid chapter number: ${chapterNumber}. Must be 1-18.`);
    }
    const module = await import(
      `../data/chapters/chapter-${String(chapterNumber).padStart(2, '0')}.json`
    );
    return module as Chapter;
  }

  /**
   * Find a verse by chapter and verse number
   */
  static findVerse(chapter: Chapter, verseNumber: number): Verse | undefined {
    return chapter.verses.find(v => v.verse === verseNumber);
  }

  /**
   * Get verse range (e.g., verses 1-5)
   */
  static getVerseRange(chapter: Chapter, start: number, end: number): Verse[] {
    return chapter.verses.filter(v => v.verse >= start && v.verse <= end);
  }

  /**
   * Filter verses by language availability
   */
  static getVersesWithLanguage(
    chapter: Chapter,
    language: keyof LocalizableText
  ): Verse[] {
    return chapter.verses.filter(v => hasTranslation(v, language));
  }

  /**
   * Get random verse from chapter
   */
  static getRandomVerse(chapter: Chapter): Verse {
    return chapter.verses[Math.floor(Math.random() * chapter.verses.length)];
  }

  /**
   * Format verse for display
   */
  static formatVerse(
    verse: Verse,
    chapter: Chapter,
    language: keyof LocalizableText = 'english',
    options?: { includeSanskrit?: boolean; includeTranslit?: boolean }
  ): string {
    const parts: string[] = [];
    
    if (options?.includeSanskrit && verse.sanskrit) {
      parts.push(`Sanskrit: ${verse.sanskrit}`);
    }
    
    if (options?.includeTranslit && verse.transliteration) {
      parts.push(`Transliteration: ${verse.transliteration}`);
    }
    
    const translation = verse.translations[language];
    if (translation) {
      parts.push(`${language.charAt(0).toUpperCase() + language.slice(1)}: ${translation}`);
    }
    
    return parts.join('\n\n');
  }
}

// ============================================================================
// Constants for UI
// ============================================================================

export const CHAPTER_NAMES: Record<number, LocalizableText> = {
  1: { english: 'Arjuna Vishada Yoga', hindi: 'अर्जुन विषाद योग' },
  2: { english: 'Sankhya Yoga', hindi: 'सांख्य योग' },
  3: { english: 'Karma Yoga', hindi: 'कर्म योग' },
  4: { english: 'Jnana Yoga', hindi: 'ज्ञान योग' },
  5: { english: 'Sannyasa Yoga', hindi: 'संन्यास योग' },
  6: { english: 'Dhyana Yoga', hindi: 'ध्यान योग' },
  7: { english: 'Jnana-Vijnana Yoga', hindi: 'ज्ञान-विज्ञान योग' },
  8: { english: 'Aksara-Brahman Yoga', hindi: 'अक्षर-ब्रह्मन योग' },
  9: { english: 'Raja-Guhya Yoga', hindi: 'राज-गुह्य योग' },
  10: { english: 'Vibhuti Yoga', hindi: 'विभूति योग' },
  11: { english: 'Visvarupa-Darsana Yoga', hindi: 'विश्वरूप-दर्शन योग' },
  12: { english: 'Bhakti Yoga', hindi: 'भक्ति योग' },
  13: { english: 'Kshetra-Kshetrajna Yoga', hindi: 'क्षेत्र-क्षेत्रज्ञ योग' },
  14: { english: 'Gunatraya-Vibhaga Yoga', hindi: 'गुणत्रय-विभाग योग' },
  15: { english: 'Purushottama Yoga', hindi: 'पुरुषोत्तम योग' },
  16: { english: 'Daivasura-Sampad-Vibhaga Yoga', hindi: 'दैवासुर-सम्पद्-विभाग योग' },
  17: { english: 'Shraddhatraya-Vibhaga Yoga', hindi: 'श्रद्धात्रय-विभाग योग' },
  18: { english: 'Moksha-Sannyasa Yoga', hindi: 'मोक्ष-संन्यास योग' },
};
