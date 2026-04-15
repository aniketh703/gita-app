import { getCompletionStreak } from "@/src/utils/readingProgress";
import AsyncStorage from "@react-native-async-storage/async-storage";

const asyncStorageMemory: Record<string, string> = {};

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(async (key: string) => asyncStorageMemory[key] ?? null),
  setItem: jest.fn(async (key: string, value: string) => {
    asyncStorageMemory[key] = value;
  }),
  removeItem: jest.fn(async (key: string) => {
    delete asyncStorageMemory[key];
  }),
  multiRemove: jest.fn(async (keys: string[]) => {
    keys.forEach((key) => delete asyncStorageMemory[key]);
  }),
}));

function dayOffsetTimestamp(daysOffset: number): number {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysOffset);
  return date.getTime();
}

describe("completion streak", () => {
  beforeEach(() => {
    Object.keys(asyncStorageMemory).forEach(
      (key) => delete asyncStorageMemory[key],
    );
  });

  test("returns 0 when latest completion is older than yesterday", async () => {
    await AsyncStorage.setItem(
      "@gita_completed_chapters",
      JSON.stringify([
        { chapterNumber: 1, completedAt: dayOffsetTimestamp(-3) },
        { chapterNumber: 2, completedAt: dayOffsetTimestamp(-4) },
      ]),
    );

    await expect(getCompletionStreak()).resolves.toBe(0);
  });

  test("counts strict consecutive completion days", async () => {
    await AsyncStorage.setItem(
      "@gita_completed_chapters",
      JSON.stringify([
        { chapterNumber: 1, completedAt: dayOffsetTimestamp(0) },
        { chapterNumber: 2, completedAt: dayOffsetTimestamp(-1) },
        { chapterNumber: 3, completedAt: dayOffsetTimestamp(-2) },
        { chapterNumber: 4, completedAt: dayOffsetTimestamp(-4) },
      ]),
    );

    await expect(getCompletionStreak()).resolves.toBe(3);
  });

  test("ignores multiple completions on the same day", async () => {
    await AsyncStorage.setItem(
      "@gita_completed_chapters",
      JSON.stringify([
        { chapterNumber: 1, completedAt: dayOffsetTimestamp(0) },
        { chapterNumber: 2, completedAt: dayOffsetTimestamp(0) },
        { chapterNumber: 3, completedAt: dayOffsetTimestamp(-1) },
      ]),
    );

    await expect(getCompletionStreak()).resolves.toBe(2);
  });
});
