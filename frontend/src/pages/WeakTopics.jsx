import { useMemo } from 'react';
import api from '../api/axios';
import PageHeader from '../components/layout/PageHeader';
import TopicItem from '../components/topics/TopicItem';
import EmptyState from '../components/ui/EmptyState';
import { useAllTopics } from '../hooks/useAllTopics';

export default function WeakTopics() {
  const { topics, loading, reload } = useAllTopics();

  const weak = useMemo(
    () =>
      topics
        .filter((t) => t.isWeak)
        .sort(
          (a, b) =>
            new Date(a.nextRevisionDate) -
            new Date(b.nextRevisionDate)
        ),
    [topics]
  );

  const handleRevise = async (topicId) => {
    await api.patch(`/topics/${topicId}/revise`);
    reload();
  };

  return (
    <div className="min-h-screen animate-fadeUp text-[var(--text)] bg-[var(--bg)]">

      {/* HEADER */}
      <PageHeader
        eyebrow="Needs Attention"
        title="Weak Topics"
        description="Topics that require additional revision to strengthen retention."
      />

      {/* LOADING STATE */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="
                h-20
                rounded-xl
                bg-[var(--card)]
                border
                border-[var(--border)]
                animate-pulse
              "
            />
          ))}
        </div>
      ) : weak.length === 0 ? (

        /* EMPTY STATE */
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <EmptyState
            icon="🌱"
            title="No Weak Topics"
            description="Nothing has slipped through the cracks. Keep revising consistently to stay ahead."
          />
        </div>

      ) : (

        /* LIST */
        <div className="space-y-3">
          {weak.map((t) => (
            <TopicItem
              key={t._id}
              topic={t}
              onRevise={handleRevise}
              showSubject
            />
          ))}
        </div>
      )}

    </div>
  );
}