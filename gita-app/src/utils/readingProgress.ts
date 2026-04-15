/**
 * Reading Progress Tracking
 * Tracks user's reading progress for personalization
 * Principles: Personalization, User Engagement, Data-Driven Insights
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const DAY_MS = 1000 * 60 * 60 * 24;

function toDayStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateKeyToDayStartMs(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}

function diffInWholeDays(newerMs: number, olderMs: number): number {
  return Math.floor((newerMs - olderMs) / DAY_MS);
}

const STORAGE_KEYS = {
  READING_PROGRESS: "@gita_reading_progress",
  BOOKMARKS: "@gita_bookmarks",
  LAST_READ: "@gita_last_read",
  READING_STATS: "@gita_reading_stats",
  COMPLETED_CHAPTERS: "@gita_completed_chapters",
  CHAPTER_COMPLETION_DATES: "@gita_chapter_completion_dates",
};

export interface ReadingProgress {
  chapter: number;
  verse: number;
  timestamp: number;
  percentComplete?: number;
}

export interface Bookmark {
  id: string;
  chapter: number;
  verse: number;
  note?: string;
  timestamp: number;
}

export interface ReadingStats {
  totalVersesRead: number;
  totalChaptersStarted: number;
  totalChaptersCompleted: number;
  consecutiveDays: number;
  lastReadDate: string;
  versesPerDay: Record<string, number>;
}

export interface ChapterCompletion {
  chapterNumber: number;
  completedAt: number; // timestamp
  duration?: number; // time spent reading in ms
}

/**
 * Save reading progress for a verse
 */
export async function saveReadingProgress(
  chapter: number,
  verse: number,
): Promise<void> {
  try {
    const progress: ReadingProgress = {
      chapter,
      verse,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(
      STORAGE_KEYS.READING_PROGRESS,
      JSON.stringify(progress),
    );

    // Update stats
    await updateReadingStats(chapter, verse);
  } catch (error) {
    console.error("Failed to save reading progress:", error);
  }
}

/**
 * Get last reading progress
 */
export async function getReadingProgress(): Promise<ReadingProgress | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to get reading progress:", error);
    return null;
  }
}

/**
 * Add bookmark for a verse
 */
export async function addBookmark(
  chapter: number,
  verse: number,
  note?: string,
): Promise<void> {
  try {
    const bookmarks = await getBookmarks();
    const newBookmark: Bookmark = {
      id: `${chapter}-${verse}-${Date.now()}`,
      chapter,
      verse,
      note,
      timestamp: Date.now(),
    };
    bookmarks.push(newBookmark);
    await AsyncStorage.setItem(
      STORAGE_KEYS.BOOKMARKS,
      JSON.stringify(bookmarks),
    );
  } catch (error) {
    console.error("Failed to add bookmark:", error);
  }
}

/**
 * Remove bookmark
 */
export async function removeBookmark(id: string): Promise<void> {
  try {
    const bookmarks = await getBookmarks();
    const filtered = bookmarks.filter((b) => b.id !== id);
    await AsyncStorage.setItem(
      STORAGE_KEYS.BOOKMARKS,
      JSON.stringify(filtered),
    );
  } catch (error) {
    console.error("Failed to remove bookmark:", error);
  }
}

/**
 * Remove bookmark by chapter and verse
 * Returns true when a matching bookmark is found and removed
 */
export async function removeBookmarkByVerse(
  chapter: number,
  verse: number,
): Promise<boolean> {
  try {
    const bookmarks = await getBookmarks();
    const matchedBookmark = bookmarks.find(
      (bookmark) => bookmark.chapter === chapter && bookmark.verse === verse,
    );

    if (!matchedBookmark) {
      return false;
    }

    await removeBookmark(matchedBookmark.id);
    return true;
  } catch (error) {
    console.error("Failed to remove bookmark by verse:", error);
    return false;
  }
}

/**
 * Get all bookmarks
 */
export async function getBookmarks(): Promise<Bookmark[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get bookmarks:", error);
    return [];
  }
}

/**
 * Check if verse is bookmarked
 */
export async function isBookmarked(
  chapter: number,
  verse: number,
): Promise<boolean> {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some((b) => b.chapter === chapter && b.verse === verse);
  } catch (error) {
    console.error("Failed to check bookmark:", error);
    return false;
  }
}

/**
 * Update reading statistics
 */
async function updateReadingStats(
  chapter: number,
  verse: number,
): Promise<void> {
  try {
    const stats = await getReadingStats();
    const today = new Date().toISOString().split("T")[0];

    // Update verses per day
    stats.versesPerDay[today] = (stats.versesPerDay[today] || 0) + 1;

    // Update total verses read
    stats.totalVersesRead += 1;

    // Update consecutive days
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    if (stats.lastReadDate === yesterday || stats.lastReadDate === today) {
      stats.consecutiveDays =
        stats.lastReadDate === today
          ? stats.consecutiveDays
          : stats.consecutiveDays + 1;
    } else if (stats.lastReadDate !== today) {
      stats.consecutiveDays = 1;
    }

    stats.lastReadDate = today;

    await AsyncStorage.setItem(
      STORAGE_KEYS.READING_STATS,
      JSON.stringify(stats),
    );
  } catch (error) {
    console.error("Failed to update reading stats:", error);
  }
}

/**
 * Get reading statistics
 */
export async function getReadingStats(): Promise<ReadingStats> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.READING_STATS);
    if (data) {
      return JSON.parse(data);
    }

    // Default stats
    return {
      totalVersesRead: 0,
      totalChaptersStarted: 0,
      totalChaptersCompleted: 0,
      consecutiveDays: 0,
      lastReadDate: "",
      versesPerDay: {},
    };
  } catch (error) {
    console.error("Failed to get reading stats:", error);
    return {
      totalVersesRead: 0,
      totalChaptersStarted: 0,
      totalChaptersCompleted: 0,
      consecutiveDays: 0,
      lastReadDate: "",
      versesPerDay: {},
    };
  }
}

/**
 * Reset all reading data
 */
export async function resetReadingData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.READING_PROGRESS,
      STORAGE_KEYS.BOOKMARKS,
      STORAGE_KEYS.READING_STATS,
    ]);
  } catch (error) {
    console.error("Failed to reset reading data:", error);
  }
}

/**
 * Get chapter progress
 * Returns number of verses read vs total in a chapter
 */
export async function getChapterProgress(
  chapterNumber: number,
): Promise<{ read: number; total: number }> {
  try {
    const bookmarks = await getBookmarks();
    const chapterBookmarks = bookmarks.filter(
      (b) => b.chapter === chapterNumber,
    );

    // Get total verses in chapter from gitaData
    // For now, return bookmark count as 'read' indicator
    // In production, you'd track actual read verses separately
    return {
      read: chapterBookmarks.length,
      total: 0, // Will be set by caller based on chapter data
    };
  } catch (error) {
    console.error("Failed to get chapter progress:", error);
    return { read: 0, total: 0 };
  }
}

/**
 * Get bookmarks for a specific chapter
 */
export async function getChapterBookmarks(
  chapterNumber: number,
): Promise<Bookmark[]> {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.filter((b) => b.chapter === chapterNumber);
  } catch (error) {
    console.error("Failed to get chapter bookmarks:", error);
    return [];
  }
}

/**
 * Mark a chapter as completed
 */
export async function markChapterComplete(
  chapterNumber: number,
  duration?: number,
): Promise<void> {
  try {
    const completions = await getCompletedChapters();

    // Avoid duplicates
    if (completions.some((c) => c.chapterNumber === chapterNumber)) {
      return;
    }

    const completion: ChapterCompletion = {
      chapterNumber,
      completedAt: Date.now(),
      duration,
    };

    completions.push(completion);
    await AsyncStorage.setItem(
      STORAGE_KEYS.COMPLETED_CHAPTERS,
      JSON.stringify(completions),
    );

    // Update stats
    const stats = await getReadingStats();
    stats.totalChaptersCompleted = completions.length;
    await AsyncStorage.setItem(
      STORAGE_KEYS.READING_STATS,
      JSON.stringify(stats),
    );
  } catch (error) {
    console.error("Failed to mark chapter complete:", error);
  }
}

/**
 * Get all completed chapters
 */
export async function getCompletedChapters(): Promise<ChapterCompletion[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_CHAPTERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get completed chapters:", error);
    return [];
  }
}

/**
 * Check if a chapter is completed
 */
export async function isChapterCompleted(
  chapterNumber: number,
): Promise<boolean> {
  try {
    const completions = await getCompletedChapters();
    return completions.some((c) => c.chapterNumber === chapterNumber);
  } catch (error) {
    console.error("Failed to check chapter completion:", error);
    return false;
  }
}

/**
 * Get completion progress (0-100)
 */
export async function getCompletionProgress(): Promise<number> {
  try {
    const completions = await getCompletedChapters();
    const totalChapters = 18;
    return Math.round((completions.length / totalChapters) * 100);
  } catch (error) {
    console.error("Failed to get completion progress:", error);
    return 0;
  }
}

/**
 * Get completion streak (consecutive completion days)
 */
export async function getCompletionStreak(): Promise<number> {
  try {
    const completions = await getCompletedChapters();
    if (completions.length === 0) return 0;

    const uniqueCompletionDays = Array.from(
      new Set(
        completions.map((completion) =>
          toLocalDateKey(new Date(completion.completedAt)),
        ),
      ),
    )
      .map(dateKeyToDayStartMs)
      .sort((a, b) => b - a);

    if (uniqueCompletionDays.length === 0) return 0;

    const todayStartMs = toDayStart(new Date()).getTime();
    const daysSinceLatest = diffInWholeDays(
      todayStartMs,
      uniqueCompletionDays[0],
    );

    // No completion today or yesterday means the streak is broken.
    if (daysSinceLatest > 1) return 0;

    let streak = 1;
    for (let i = 1; i < uniqueCompletionDays.length; i += 1) {
      const gap = diffInWholeDays(
        uniqueCompletionDays[i - 1],
        uniqueCompletionDays[i],
      );
      if (gap !== 1) break;
      streak += 1;
    }

    return streak;
  } catch (error) {
    console.error("Failed to get completion streak:", error);
    return 0;
  }
}
