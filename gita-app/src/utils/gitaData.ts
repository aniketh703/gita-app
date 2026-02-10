import { Chapter, ChapterSummary } from '@/src/types';

// Import the bundled JSON data
import gitaDataJson from '@/assets/data.json';

let cachedData: Chapter[] | null = null;

export function getGitaData(): Chapter[] {
  if (!cachedData) {
    cachedData = gitaDataJson as unknown as Chapter[];
  }
  return cachedData;
}

export function getChapters(): ChapterSummary[] {
  return getGitaData().map((ch) => ({
    chapter: ch.chapter,
    name: ch.name,
    verse_count: ch.verse_count,
  }));
}

export function getChapter(chapterNum: number): Chapter | undefined {
  return getGitaData().find((ch) => ch.chapter === chapterNum);
}

export function getVerse(chapterNum: number, verseNum: number) {
  const chapter = getChapter(chapterNum);
  return chapter?.verses.find((v) => v.verse === verseNum);
}

export function getTotalVerses(): number {
  return getGitaData().reduce((sum, ch) => sum + ch.verse_count, 0);
}

export function getNextVerse(chapterNum: number, verseNum: number) {
  const chapter = getChapter(chapterNum);
  if (!chapter) return null;

  const currentIndex = chapter.verses.findIndex((v) => v.verse === verseNum);
  if (currentIndex < chapter.verses.length - 1) {
    return { chapter: chapterNum, verse: chapter.verses[currentIndex + 1].verse };
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
    return { chapter: chapterNum, verse: chapter.verses[currentIndex - 1].verse };
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
