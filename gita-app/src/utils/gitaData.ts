import { Chapter, ChapterSummary } from "@/src/types";

// Import the bundled JSON data
import gitaDataJson from "@/assets/data.json";

// Cache for individual chapters (lazy-loaded)
const chapterCache = new Map<number, Chapter>();

// Cache for chapter summaries (lightweight, loaded once)
let chapterSummariesCache: ChapterSummary[] | null = null;

// Maximum chapters to keep in memory (LRU-style cache)
const MAX_CACHED_CHAPTERS = 5;

/**
 * Get chapter summaries (lightweight, no verse data)
 * This loads quickly and allows chapter list to render fast
 */
export function getChapters(): ChapterSummary[] {
  if (!chapterSummariesCache) {
    const fullData = gitaDataJson as unknown as Chapter[];
    chapterSummariesCache = fullData.map((ch) => ({
      chapter: ch.chapter,
      name: ch.name,
      verse_count: ch.verse_count,
    }));
  }
  return chapterSummariesCache;
}

/**
 * Get a specific chapter with lazy loading
 * Only loads the chapter when needed and caches it
 */
export function getChapter(chapterNum: number): Chapter | undefined {
  // Check if already in cache
  if (chapterCache.has(chapterNum)) {
    return chapterCache.get(chapterNum);
  }

  // Load from full data
  const fullData = gitaDataJson as unknown as Chapter[];
  const chapter = fullData.find((ch) => ch.chapter === chapterNum);

  if (chapter) {
    // Add to cache
    chapterCache.set(chapterNum, chapter);

    // Implement LRU: Keep only MAX_CACHED_CHAPTERS in memory
    if (chapterCache.size > MAX_CACHED_CHAPTERS) {
      const oldestKey = chapterCache.keys().next().value;
      if (typeof oldestKey === "number") {
        chapterCache.delete(oldestKey);
      }
    }
  }

  return chapter;
}

/**
 * Get all Gita data (for backwards compatibility)
 * ⚠️ Note: This loads all data into memory. Use getChapter() instead when possible.
 */
export function getGitaData(): Chapter[] {
  return gitaDataJson as unknown as Chapter[];
}

export function getVerse(chapterNum: number, verseNum: number) {
  const chapter = getChapter(chapterNum);
  return chapter?.verses.find((v) => v.verse === verseNum);
}

export function getTotalVerses(): number {
  // Use lightweight summaries instead of full data
  return getChapters().reduce((sum, ch) => sum + ch.verse_count, 0);
}

export function getNextVerse(chapterNum: number, verseNum: number) {
  const chapter = getChapter(chapterNum);
  if (!chapter) return null;

  const currentIndex = chapter.verses.findIndex((v) => v.verse === verseNum);
  if (currentIndex < chapter.verses.length - 1) {
    return {
      chapter: chapterNum,
      verse: chapter.verses[currentIndex + 1].verse,
    };
  }

  // Move to next chapter
  if (chapterNum < 18) {
    const nextChapter = getChapter(chapterNum + 1);
    if (nextChapter && nextChapter.verses.length > 0) {
      return { chapter: chapterNum + 1, verse: nextChapter.verses[0].verse };
    }
  }

  return null;
}

export function getPreviousVerse(chapterNum: number, verseNum: number) {
  const chapter = getChapter(chapterNum);
  if (!chapter) return null;

  const currentIndex = chapter.verses.findIndex((v) => v.verse === verseNum);
  if (currentIndex > 0) {
    return {
      chapter: chapterNum,
      verse: chapter.verses[currentIndex - 1].verse,
    };
  }

  // Move to previous chapter
  if (chapterNum > 1) {
    const prevChapter = getChapter(chapterNum - 1);
    if (prevChapter && prevChapter.verses.length > 0) {
      return {
        chapter: chapterNum - 1,
        verse: prevChapter.verses[prevChapter.verses.length - 1].verse,
      };
    }
  }

  return null;
}

/**
 * Clear chapter cache (useful for memory management or testing)
 */
export function clearChapterCache() {
  chapterCache.clear();
}
