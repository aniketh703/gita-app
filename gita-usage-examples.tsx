/**
 * Bhagavad Gita Data - Practical Usage Examples
 * 
 * Real-world code patterns for using the normalized Gita data in React Native
 */

import type { Chapter, Verse, LocalizableText } from '../types/gita';

// ============================================================================
// Example 1: Component to Display a Verse
// ============================================================================

/**
 * Display a single verse with Sanskrit, transliteration, and translation
 */
export function VerseDisplay({ verse, chapter }: { verse: Verse; chapter: Chapter }) {
  return (
    <div className="verse-container">
      <h2>
        {chapter.name.english} {verse.verse}
      </h2>

      {/* Sanskrit Section */}
      {verse.sanskrit && (
        <section className="sanskrit">
          <h3>Sanskrit (Devanagari)</h3>
          <p className="sanskrit-text">{verse.sanskrit}</p>
        </section>
      )}

      {/* Transliteration Section */}
      {verse.transliteration && (
        <section className="transliteration">
          <h3>Transliteration (IAST)</h3>
          <p>{verse.transliteration}</p>
        </section>
      )}

      {/* Translations Section */}
      <section className="translations">
        <h3>Translations</h3>
        
        {verse.translations.english && (
          <div className="translation-item">
            <h4>English</h4>
            <p>{verse.translations.english}</p>
          </div>
        )}

        {verse.translations.hindi && (
          <div className="translation-item">
            <h4>Hindi (हिन्दी)</h4>
            <p>{verse.translations.hindi}</p>
          </div>
        )}

        {verse.translations.tamil && (
          <div className="translation-item">
            <h4>Tamil (தமிழ்)</h4>
            <p>{verse.translations.tamil}</p>
          </div>
        )}

        {/* Show "Coming Soon" for unavailable translations */}
        {!verse.translations.tamil && (
          <div className="translation-item unavailable">
            <h4>Tamil (தமிழ்)</h4>
            <p className="placeholder">Coming soon...</p>
          </div>
        )}
      </section>
    </div>
  );
}

// ============================================================================
// Example 2: Hook to Load Chapter Data
// ============================================================================

/**
 * React hook to load and cache chapter data
 */
export function useChapter(chapterNumber: number): {
  chapter: Chapter | null;
  loading: boolean;
  error: Error | null;
} {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadChapter = async () => {
      try {
        setLoading(true);
        // Dynamic import based on chapter number
        const module = await import(
          `../data/chapters/chapter-${String(chapterNumber).padStart(2, '0')}.json`
        );
        setChapter(module);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load chapter'));
        setChapter(null);
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [chapterNumber]);

  return { chapter, loading, error };
}

// ============================================================================
// Example 3: Search Verses Within Chapter
// ============================================================================

/**
 * Search verses in a chapter by keyword
 */
export function searchInChapter(
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
 * Example usage
 */
export function ChapterSearch({ chapter }: { chapter: Chapter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState<keyof LocalizableText>('english');
  const results = searchInChapter(chapter, searchTerm, language);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search verses..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      
      <select value={language} onChange={e => setLanguage(e.target.value as keyof LocalizableText)}>
        <option value="english">English</option>
        <option value="hindi">Hindi</option>
        <option value="tamil">Tamil</option>
        <option value="kannada">Kannada</option>
      </select>

      <div className="results">
        {results.length > 0 ? (
          results.map(verse => (
            <div key={verse.verse} className="result-item">
              <h4>Verse {verse.verse}</h4>
              <p>{verse.translations[language]}</p>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Example 4: Verse of the Day
// ============================================================================

/**
 * Get a random verse from a chapter
 */
export function getRandomVerse(chapter: Chapter): Verse {
  return chapter.verses[Math.floor(Math.random() * chapter.verses.length)];
}

/**
 * Component to display Verse of the Day
 */
export function VerseOfTheDay({ chapter }: { chapter: Chapter }) {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [language, setLanguage] = useState<keyof LocalizableText>('english');

  useEffect(() => {
    setVerse(getRandomVerse(chapter));
  }, [chapter]);

  if (!verse) return <p>Loading...</p>;

  return (
    <div className="musing-of-the-day">
      <h2>Verse of the Day</h2>
      <div className="verse-card">
        <h3>
          {chapter.name.english} {verse.verse}
        </h3>
        
        {verse.sanskrit && (
          <div className="sanskrit-highlight">
            {verse.sanskrit}
          </div>
        )}

        <div className="translation-highlight">
          {verse.translations[language]}
        </div>

        <select value={language} onChange={e => setLanguage(e.target.value as keyof LocalizableText)}>
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>

        <button onClick={() => setVerse(getRandomVerse(chapter))}>
          Get Another Verse
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 5: Multi-Language Display
// ============================================================================

/**
 * Display a verse with graceful handling of missing translations
 */
export function MultiLanguageVerseDisplay({ verse }: { verse: Verse }) {
  const getLanguageName = (lang: keyof LocalizableText): string => {
    const names: Record<keyof LocalizableText, string> = {
      english: 'English',
      hindi: 'Hindi (हिन्दी)',
      tamil: 'Tamil (தமிழ்)',
      kannada: 'Kannada (ಕನ್ನಡ)',
    };
    return names[lang];
  };

  return (
    <div className="verse-languages">
      {Object.entries(verse.translations).map(([lang, text]) => (
        <div key={lang} className={`language-section ${text ? 'available' : 'unavailable'}`}>
          <h4>{getLanguageName(lang as keyof LocalizableText)}</h4>
          {text ? (
            <p>{text}</p>
          ) : (
            <p className="placeholder">Translation not available yet</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Example 6: Bookmark and Favorite Verses
// ============================================================================

/**
 * Service to manage bookmarked verses (using AsyncStorage in React Native)
 */
export class BookmarkService {
  private static STORAGE_KEY = 'gita_bookmarks';

  static async addBookmark(chapter: number, verse: number): Promise<void> {
    const bookmarks = await this.getBookmarks();
    const key = `${chapter}:${verse}`;
    if (!bookmarks.includes(key)) {
      bookmarks.push(key);
      // In React Native, use AsyncStorage:
      // await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
    }
  }

  static async removeBookmark(chapter: number, verse: number): Promise<void> {
    const bookmarks = await this.getBookmarks();
    const key = `${chapter}:${verse}`;
    const updatedBookmarks = bookmarks.filter(b => b !== key);
    void updatedBookmarks;
    // await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
  }

  static async getBookmarks(): Promise<string[]> {
    // In React Native:
    // const data = await AsyncStorage.getItem(this.STORAGE_KEY);
    // return data ? JSON.parse(data) : [];
    return [];
  }

  static async isBookmarked(chapter: number, verse: number): Promise<boolean> {
    const bookmarks = await this.getBookmarks();
    return bookmarks.includes(`${chapter}:${verse}`);
  }
}

/**
 * Verse component with bookmark feature
 */
export function BookmarkableVerse({
  chapter,
  verse,
}: {
  chapter: Chapter;
  verse: Verse;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    BookmarkService.isBookmarked(chapter.chapter, verse.verse).then(
      setIsBookmarked
    );
  }, [chapter.chapter, verse.verse]);

  const toggleBookmark = async () => {
    if (isBookmarked) {
      await BookmarkService.removeBookmark(chapter.chapter, verse.verse);
    } else {
      await BookmarkService.addBookmark(chapter.chapter, verse.verse);
    }
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="verse-with-bookmark">
      <button
        onClick={toggleBookmark}
        className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
      >
        {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
      </button>
      <VerseDisplay verse={verse} chapter={chapter} />
    </div>
  );
}

// ============================================================================
// Example 7: List View of All Verses in Chapter
// ============================================================================

/**
 * Display all verses in a chapter as a scrollable list
 */
export function VersesList({
  chapter,
  language = 'english',
}: {
  chapter: Chapter;
  language?: keyof LocalizableText;
}) {
  return (
    <div className="verses-list">
      <h2>{chapter.name.english}</h2>
      <div className="verse-count">
        {chapter.verses.length} verses in this chapter
      </div>

      {chapter.verses.map(verse => (
        <div key={verse.verse} className="verse-list-item">
          <h4>Verse {verse.verse}</h4>
          {verse.translations[language] ? (
            <p>{verse.translations[language]}</p>
          ) : (
            <p className="no-translation">
              Translation not available in {language}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Export utilities for use throughout app
// ============================================================================

/**
 * Collection of helper functions for working with Gita data
 */
export const GitaUtils = {
  /**
   * Parse chapter:verse string (e.g., "2:13") to chapter and verse numbers
   */
  parseReference(ref: string): { chapter: number; verse: number } | null {
    const match = ref.match(/^(\d+):(\d+)$/);
    if (!match) return null;
    return {
      chapter: parseInt(match[1], 10),
      verse: parseInt(match[2], 10),
    };
  },

  /**
   * Format chapter and verse as string reference
   */
  formatReference(chapter: number, verse: number): string {
    return `${chapter}:${verse}`;
  },

  /**
   * Check if translation is available
   */
  hasTranslation(verse: Verse, language: keyof LocalizableText): boolean {
    return (
      verse.translations[language] !== null &&
      verse.translations[language] !== undefined
    );
  },

  /**
   * Get available languages for a verse
   */
  getAvailableLanguages(verse: Verse): (keyof LocalizableText)[] {
    return (['english', 'hindi', 'tamil', 'kannada'] as const).filter(lang =>
      this.hasTranslation(verse, lang)
    );
  },
};
