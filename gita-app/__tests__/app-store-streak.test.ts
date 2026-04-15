import { useAppStore } from "@/src/store/appStore";

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

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateKeyFromOffset(daysOffset: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysOffset);
  return toLocalDateKey(date);
}

describe("app store reading streak", () => {
  beforeEach(() => {
    Object.keys(asyncStorageMemory).forEach(
      (key) => delete asyncStorageMemory[key],
    );
    useAppStore.setState((state) => ({
      ...state,
      streak: {
        currentStreak: 0,
        lastStreakDate: "",
        longestStreak: 0,
        totalDaysRead: 0,
        readings: {},
      },
    }));
  });

  test("starts streak at 1 on first read", () => {
    useAppStore.getState().updateStreak(1);

    const today = dateKeyFromOffset(0);
    const { streak } = useAppStore.getState();

    expect(streak.currentStreak).toBe(1);
    expect(streak.longestStreak).toBe(1);
    expect(streak.lastStreakDate).toBe(today);
    expect(streak.readings[today]).toBe(1);
  });

  test("does not increment currentStreak multiple times on same day", () => {
    useAppStore.getState().updateStreak(2);
    useAppStore.getState().updateStreak(3);

    const today = dateKeyFromOffset(0);
    const { streak } = useAppStore.getState();

    expect(streak.currentStreak).toBe(1);
    expect(streak.readings[today]).toBe(5);
    expect(streak.totalDaysRead).toBe(1);
  });

  test("increments when last streak date is yesterday", () => {
    const yesterday = dateKeyFromOffset(-1);
    useAppStore.setState((state) => ({
      ...state,
      streak: {
        currentStreak: 4,
        longestStreak: 4,
        lastStreakDate: yesterday,
        totalDaysRead: 1,
        readings: { [yesterday]: 2 },
      },
    }));

    useAppStore.getState().updateStreak(1);

    const { streak } = useAppStore.getState();
    expect(streak.currentStreak).toBe(5);
    expect(streak.longestStreak).toBe(5);
  });

  test("resets to 1 when a day gap is missed", () => {
    const threeDaysAgo = dateKeyFromOffset(-3);
    useAppStore.setState((state) => ({
      ...state,
      streak: {
        currentStreak: 7,
        longestStreak: 9,
        lastStreakDate: threeDaysAgo,
        totalDaysRead: 10,
        readings: { [threeDaysAgo]: 1 },
      },
    }));

    useAppStore.getState().updateStreak(1);

    const { streak } = useAppStore.getState();
    expect(streak.currentStreak).toBe(1);
    expect(streak.longestStreak).toBe(9);
  });
});
