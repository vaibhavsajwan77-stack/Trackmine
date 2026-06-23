// Computes a daily study streak from topics' lastRevisedAt timestamps.
// A "study day" = at least one topic was revised that calendar day.
export function calculateStreak(topics) {
  const revisedDates = new Set(
    topics
      .filter((t) => t.lastRevisedAt)
      .map((t) => new Date(t.lastRevisedAt).toDateString())
  );

  if (revisedDates.size === 0) {
    return { current: 0, longest: 0, activeDates: revisedDates };
  }

  // Current streak: walk back from today while consecutive days exist
  let current = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // allow today to be "pending" (streak isn't broken if today not yet revised)
  if (!revisedDates.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (revisedDates.has(cursor.toDateString())) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Longest streak: scan all known dates
  const sorted = [...revisedDates]
    .map((d) => new Date(d))
    .sort((a, b) => a - b);

  let longest = 0;
  let run = 0;
  let prev = null;
  for (const d of sorted) {
    if (prev) {
      const diff = Math.round((d - prev) / 86400000);
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  }

  return { current, longest, activeDates: revisedDates };
}
