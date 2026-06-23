// Builds chart-ready series from real topic data (no fixtures).

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Last 7 calendar days: how many topics were revised ("reviews") and
// how many were first created ("newTopics") on each day.
export function buildWeeklyActivity(topics) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  return days.map((d) => {
    const key = d.toDateString();
    const reviews = topics.filter(
      (t) => t.lastRevisedAt && new Date(t.lastRevisedAt).toDateString() === key
    ).length;
    const newTopics = topics.filter(
      (t) => t.createdAt && new Date(t.createdAt).toDateString() === key
    ).length;
    return { day: DAY_LABELS[d.getDay()], reviews, newTopics };
  });
}

// Average retention (status-based, via retentionForStatus) over the last
// 6 weeks, based on each topic's most recent revision in that window.
export function buildRetentionTrend(topics, retentionForStatus) {
  const now = new Date();
  const weeks = [];

  for (let i = 5; i >= 0; i--) {
    const end = new Date(now);
    end.setDate(end.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 7);

    const revisedInWeek = topics.filter(
      (t) => t.lastRevisedAt && new Date(t.lastRevisedAt) > start && new Date(t.lastRevisedAt) <= end
    );

    const avg = revisedInWeek.length
      ? Math.round(
          revisedInWeek.reduce((sum, t) => sum + retentionForStatus(t.status), 0) / revisedInWeek.length
        )
      : null;

    weeks.push({ week: `W${6 - i}`, avg });
  }

  // Fill gaps (weeks with no activity) by carrying the previous value forward,
  // so the line doesn't break; default to 0 if there's no prior data yet.
  let last = 0;
  return weeks.map((w) => {
    if (w.avg === null) return { ...w, avg: last };
    last = w.avg;
    return w;
  });
}
