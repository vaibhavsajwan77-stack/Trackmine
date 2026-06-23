import { useMemo } from 'react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/ui/StatCard';
import { useAllTopics } from '../hooks/useAllTopics';
import { calculateStreak } from '../utils/streak';

function buildLast12Weeks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay()));

  const start = new Date(end);
  start.setDate(start.getDate() - 7 * 12 + 1);

  const days = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export default function Streaks() {
  const { topics, loading } = useAllTopics();

  const streak = useMemo(() => calculateStreak(topics), [topics]);
  const days = useMemo(() => buildLast12Weeks(), []);

  const weeks = useMemo(() => {
    const grid = [];
    for (let i = 0; i < days.length; i += 7) {
      grid.push(days.slice(i, i + 7));
    }
    return grid;
  }, [days]);

  const totalRevisions = topics.filter(t => t.lastRevisedAt).length;

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 animate-fadeUp bg-black text-white">

      {/* HEADER */}
      <PageHeader
        eyebrow="Consistency"
        title="Your streaks"
        description="Every day you revise something keeps your streak alive."
      />

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">

        <StatCard
          label="Current streak"
          value={streak.current}
          unit="d"
          icon="🔥"
          accent="#5B7FFF"
        />

        <StatCard
          label="Longest streak"
          value={streak.longest}
          unit="d"
          icon="🏆"
          accent="#33D9B2"
        />

        <StatCard
          label="Total revisions"
          value={totalRevisions}
          icon="↺"
          accent="#A1A1AA"
        />

      </div>

      {/* LOADING */}
      {loading ? (
        <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 overflow-x-auto">

          <h3 className="font-semibold mb-4 text-white">
            Last 12 weeks
          </h3>

          <div className="flex gap-1.5 min-w-fit">

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1.5">

                {week.map((day, di) => {
                  const active = streak.activeDates.has(day.toDateString());
                  const isFuture = day > new Date();

                  return (
                    <div
                      key={di}
                      title={day.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                      className="w-3.5 h-3.5 rounded-[3px]"
                      style={{
                        backgroundColor: isFuture
                          ? 'transparent'
                          : active
                            ? '#5B7FFF'
                            : '#27272A'
                      }}
                    />
                  );
                })}

              </div>
            ))}

          </div>

          {/* LEGEND */}
          <div className="flex items-center gap-2 mt-4 text-xs text-zinc-400">

            <span>Less</span>

            <span className="w-3 h-3 rounded-[3px] bg-zinc-700" />

            <span className="w-3 h-3 rounded-[3px] bg-indigo-500" />

            <span>More</span>

          </div>

        </div>
      )}

    </div>
  );
}