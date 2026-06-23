import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../api/axios';
import AddSubjectModal from '../components/subjects/AddSubjectModal';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TopicItem from '../components/topics/TopicItem';
import ActivityChart from '../components/charts/ActivityChart';
import EmptyState from '../components/ui/EmptyState';
import { buildWeeklyActivity } from '../utils/chartData';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const { topics, getDueTopics, markReviewed, deleteTopic, user } = useApp();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [stats, setStats] = useState(null);

  const dueTopics = getDueTopics().slice(0, 5);
  const weeklyActivity = buildWeeklyActivity(topics);
  const reviewsThisWeek = weeklyActivity.reduce((sum, d) => sum + d.reviews, 0);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null));
  }, [topics.length]);

  const mastered = stats?.statusCounts?.['Mastered'] ?? 0;
  const total = stats?.total ?? topics.length;

  return (
    <div className="space-y-6 animate-fadeUp text-[var(--text)]">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <PageHeader
          eyebrow="TRACKMINE"
          title={`Welcome back, ${user?.name || 'Student'} 👋`}
          description="Your learning progress, retention and daily focus in one place."
        />
        <Button
          variant="secondary"
          onClick={toggleTheme}
          className="h-10 px-4 text-[var(--text)]"
        >
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </Button>
      </div>

      {/* HERO */}
      <Card className="relative overflow-hidden p-8 bg-[var(--card)] border border-[var(--border)]">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-4">
                SMART REVISION SYSTEM
              </span>
              <h2 className="text-3xl font-bold text-[var(--text)] leading-tight">
                Build Memory, Not Just Notes
              </h2>
              <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed">
                Spaced repetition, active recall, and intelligent scheduling
                designed to help you actually remember what you learn.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-[260px]">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <p className="text-xs text-[var(--muted)]">Due Today</p>
                <p className="text-2xl font-bold text-[var(--text)]">{dueTopics.length}</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <p className="text-xs text-[var(--muted)]">Mastered</p>
                <p className="text-2xl font-bold text-[var(--text)]">{mastered}</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <p className="text-xs text-[var(--muted)]">Topics</p>
                <p className="text-2xl font-bold text-[var(--text)]">{total}</p>
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <p className="text-xs text-[var(--muted)]">Weekly</p>
                <p className="text-2xl font-bold text-[var(--text)]">{reviewsThisWeek}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ACTIONS */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button variant="primary" onClick={() => setSubjectModalOpen(true)} className="h-14">
          ➕ Add Subject
        </Button>
        <Button variant="secondary" onClick={() => navigate('/review')} className="h-14">
          ⚡ Start Review
        </Button>
        <Button variant="secondary" onClick={() => navigate('/subjects')} className="h-14">
          📚 View Subjects
        </Button>
      </div>

      {/* CONTENT */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* LEFT - Due Reviews */}
        <Card className="lg:col-span-3 p-5 bg-[var(--card)] border border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-[var(--text)]">Due Reviews</h2>
              <p className="text-xs text-[var(--muted)]">Topics scheduled for revision</p>
            </div>
          </div>

          {dueTopics.length === 0 ? (
            <EmptyState
              icon="🎉"
              title="All caught up!"
              description="No topics due for review."
            />
          ) : (
            <div className="space-y-3">
              {dueTopics.map((t) => (
                <TopicItem
                  key={t._id}
                  topic={t}
                  showSubject
                  onRevise={markReviewed}
                  onDelete={deleteTopic}
                />
              ))}
            </div>
          )}
        </Card>

        {/* RIGHT - Weekly Chart */}
        <Card className="lg:col-span-2 p-5 bg-[var(--card)] border border-[var(--border)]">
          <h2 className="font-semibold text-[var(--text)] mb-1">Weekly Activity</h2>
          <p className="text-xs text-[var(--muted)] mb-4">{reviewsThisWeek} reviews this week</p>
          <div className="h-[260px]">
            <ActivityChart data={weeklyActivity} />
          </div>
        </Card>
      </div>

      {/* MODAL */}
      <AddSubjectModal
        isOpen={subjectModalOpen}
        onClose={() => setSubjectModalOpen(false)}
      />
    </div>
  );
}
