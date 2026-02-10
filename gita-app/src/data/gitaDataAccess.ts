import gitaDataJson from '@/assets/data.json';
import type { Chapter, Verse } from '@/src/types';

export type ChapterId = number;
export type VerseId = number;

interface GitaDataCache {
  chapters: Chapter[];
  chapterById: Map<ChapterId, Chapter>;
  verseByKey: Map<string, Verse>;
}

let cache: GitaDataCache | null = null;

function loadCache(): GitaDataCache {
  if (cache) {
    return cache;
  }

  const chapters = gitaDataJson as unknown as Chapter[];
  const chapterById = new Map<ChapterId, Chapter>();
  const verseByKey = new Map<string, Verse>();

  for (const chapter of chapters) {
    chapterById.set(chapter.chapter, chapter);

    for (const verse of chapter.verses) {
      verseByKey.set(`${chapter.chapter}:${verse.verse}`, verse);
    }
  }

  cache = { chapters, chapterById, verseByKey };
  return cache;
}

export function getChapters(): Chapter[] {
  return loadCache().chapters;
}

export function getChapterById(id: ChapterId): Chapter | undefined {
  return loadCache().chapterById.get(id);
}

export function getVerse(chapterId: ChapterId, verseId: VerseId): Verse | undefined {
  return loadCache().verseByKey.get(`${chapterId}:${verseId}`);
}
