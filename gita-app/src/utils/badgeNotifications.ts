/**
 * Badge/Milestone Notification Helper
 * Utility to trigger notifications when badges are unlocked
 * 
 * Usage in any component:
 * ```tsx
 * const { onMilestoneUnlocked } = useNotifications();
 * 
 * // When badge is unlocked:
 * await onMilestoneUnlocked("Reading Seeker - Read 50 verses");
 * ```
 */

export const BADGE_DESCRIPTIONS: Record<string, string> = {
  // Reading Badges
  "first-read": "🎯 Reading Seeker - Read your first verse",
  "fifty-verses": "📖 Devotional Reader - Read 50 verses",
  "hundred-verses": "🕉️ Sacred Scholar - Read 100 verses",
  "full-chapter": "📚 Chapter Master - Complete a full chapter",
  "all-chapters": "🏆 Gita Master - Read all 18 chapters",

  // Streak Badges
  "three-day-streak": "🔥 Steady Flame - 3-day reading streak",
  "week-streak": "🌟 Weekly Devotee - 7-day reading streak",
  "month-streak": "💪 Monthly Warrior - 30-day reading streak",
  "century-streak": "⭐ Century Sage - 100-day reading streak",

  // Exploration Badges
  "random-chapter": "🎲 Serendipity - Read a random chapter suggestion",
  "time-explorer": "⏰ Time Traveler - Read at 5 different times of day",
  "all-languages": "🌍 Polyglot Seeker - Read in all available languages",
};

/**
 * Get badge display description
 */
export function getBadgeDescription(badgeId: string): string {
  return BADGE_DESCRIPTIONS[badgeId] || `Achievement Unlocked - ${badgeId}`;
}

/**
 * Check if a badge has a custom description
 */
export function hasBadgeDescription(badgeId: string): boolean {
  return badgeId in BADGE_DESCRIPTIONS;
}
