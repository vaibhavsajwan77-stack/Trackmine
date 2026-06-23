import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TopicItem from '../components/topics/TopicItem';
import AddTopicModal from '../components/topics/AddTopicModal';
import Button from '../components/ui/Button';
import RetentionBar from '../components/ui/RetentionBar';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { retentionForStatus, isOverdue } from '../utils/status';

export default function SubjectDetail() {
  const { id } = useParams();
  const { subjects, loading, getTopicsForSubject, markReviewed, deleteTopic } = useApp();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  // Show loading while subjects are fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  // String comparison to avoid ObjectId reference mismatch
  const subject = subjects.find(s => String(s._id) === String(id));

  if (!subject) {
    return (
      <div className="animate-fadeUp">
        <EmptyState
          icon="🔍"
          title="Subject not found"
          description="This subject doesn't exist or was deleted."
          actionLabel="Back to Subjects"
          onAction={() => navigate('/subjects')}
        />
      </div>
    );
  }

  const topics = getTopicsForSubject(subject._id);

  const retention =
    topics.length > 0
      ? Math.round(
          topics.reduce((a, t) => a + retentionForStatus(t.status), 0) / topics.length
        )
      : 0;

  const due = topics.filter(t => t.status !== 'Mastered' && isOverdue(t.nextRevisionDate));
  const mastered = topics.filter(t => t.status === 'Mastered');
  const inProgress = topics.filter(t => t.status !== 'Mastered' && !isOverdue(t.nextRevisionDate));

  return (
    <div className="animate-fadeUp">

      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 mb-5 text-[var(--muted)]">
        <button
          onClick={() => navigate('/subjects')}
          className="text-xs hover:text-[var(--text)] transition-colors"
        >
          Subjects
        </button>
        <span className="text-xs">/</span>
        <span className="text-xs font-medium text-[var(--text)]">{subject.name}</span>
      </div>

      {/* HERO CARD */}
      <Card className="p-6 mb-6 bg-[var(--card)] border border-[var(--border)]">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="font-bold text-2xl text-[var(--text)]">{subject.name}</h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              {topics.length} topics
              {subject.description ? ` · ${subject.description}` : ''}
            </p>
          </div>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + Topic
          </Button>
        </div>

        <RetentionBar value={retention} showLabel size="lg" />

        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="rounded-xl p-3 text-center border border-[var(--border)] bg-[var(--surface)]">
            <span className="font-bold text-xl text-emerald-400">{mastered.length}</span>
            <p className="text-xs text-[var(--muted)] mt-1">Mastered</p>
          </div>
          <div className="rounded-xl p-3 text-center border border-[var(--border)] bg-[var(--surface)]">
            <span className="font-bold text-xl text-red-400">{due.length}</span>
            <p className="text-xs text-[var(--muted)] mt-1">Due now</p>
          </div>
          <div className="rounded-xl p-3 text-center border border-[var(--border)] bg-[var(--surface)]">
            <span className="font-bold text-xl text-blue-400">{inProgress.length}</span>
            <p className="text-xs text-[var(--muted)] mt-1">Learning</p>
          </div>
        </div>
      </Card>

      {/* TOPICS HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-[var(--text)]">All Topics</h2>
        <span className="text-xs text-[var(--muted)]">{topics.length} total</span>
      </div>

      {/* TOPICS LIST */}
      {topics.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No topics yet"
          description="Add your first topic to start tracking retention."
          actionLabel="Add Topic"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="space-y-2">
          {topics.map(t => (
            <TopicItem
              key={t._id}
              topic={t}
              onRevise={markReviewed}
              onDelete={deleteTopic}
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      <AddTopicModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        subjectId={subject._id}
      />
    </div>
  );
}
