import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../api/axios';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import RetentionChart from '../components/charts/RetentionChart';
import ActivityChart from '../components/charts/ActivityChart';
import RetentionBar from '../components/ui/RetentionBar';
import { retentionForStatus } from '../utils/status';
import { buildWeeklyActivity, buildRetentionTrend } from '../utils/chartData';
import { calculateStreak } from '../utils/streak';

export default function Stats() {
  const { subjects, topics } = useApp();
  const [serverStats, setServerStats] = useState(null);

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then(({ data }) => setServerStats(data))
      .catch(() => setServerStats(null));
  }, [topics.length]);

  const weeklyActivity = buildWeeklyActivity(topics);
  const retentionTrend = buildRetentionTrend(topics, retentionForStatus);

  const reviewsThisWeek = weeklyActivity.reduce(
    (sum, d) => sum + d.reviews,
    0
  );

  const { current: streak } = calculateStreak(topics);

  const mastered = serverStats?.statusCounts?.['Mastered'] ?? 0;
  const total = serverStats?.total ?? topics.length;

  const subjectRetentions = subjects
    .map(s => {
      const subTopics = topics.filter(t => t.subject?._id === s._id);

      const avg =
        subTopics.length > 0
          ? Math.round(
              subTopics.reduce(
                (a, t) => a + retentionForStatus(t.status),
                0
              ) / subTopics.length
            )
          : 0;

      return {
        ...s,
        avgRetention: avg,
        subjectTopicCount: subTopics.length
      };
    })
    .sort((a, b) => b.avgRetention - a.avgRetention);

  return (
    <div className="animate-fadeUp">

      {/* HEADER */}
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="Your memory performance over time."
      />

      {/* TOP STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

        <StatCard label="Total Topics" value={total} icon="▦" accent="#5B7FFF" />
        <StatCard label="Mastered" value={mastered} icon="✓" accent="#33D9B2" />
        <StatCard label="Reviews this week" value={reviewsThisWeek} icon="↺" accent="#FFB347" />
        <StatCard label="Current streak" value={streak} unit="d" icon="🔥" accent="#FF6B6B" />

      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">

        <Card className="p-5">
          <h2 className="font-semibold mb-1">Retention Trend</h2>
          <p className="text-xs text-[var(--muted)] mb-4">
            6-week average retention %
          </p>

          <div className="w-full h-[280px]">
            <RetentionChart data={retentionTrend} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-1">Weekly Activity</h2>
          <p className="text-xs text-[var(--muted)] mb-4">
            Reviews and new topics per day
          </p>

          <div className="w-full h-[280px]">
            <ActivityChart data={weeklyActivity} />
          </div>
        </Card>

      </div>

      {/* SUBJECT BREAKDOWN */}
      <Card className="p-5">

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold">Subject Breakdown</h2>
            <p className="text-xs text-[var(--muted)]">
              Sorted by average retention
            </p>
          </div>
        </div>

        {subjectRetentions.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            Add a subject to see breakdown here.
          </p>
        ) : (
          <div className="space-y-3">

            {subjectRetentions.map(s => (
              <div
                key={s._id}
                className="group flex items-center gap-4 p-2 rounded-lg hover:bg-[var(--card)] transition-all"
              >

                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between mb-1.5">

                    <span className="text-sm font-medium">
                      {s.name}
                    </span>

                    <span className="text-xs text-[var(--muted)]">
                      {s.subjectTopicCount} topics
                    </span>

                  </div>

                  <RetentionBar value={s.avgRetention} size="sm" />

                </div>

                <span
                  className="font-semibold text-sm w-10 text-right"
                  style={{
                    color:
                      s.avgRetention >= 80
                        ? '#33D9B2'
                        : s.avgRetention >= 60
                        ? '#5B7FFF'
                        : s.avgRetention >= 40
                        ? '#FFB347'
                        : '#FF6B6B'
                  }}
                >
                  {s.avgRetention}%
                </span>

              </div>
            ))}

          </div>
        )}

      </Card>

    </div>
  );
}