import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import RetentionBar from '../components/ui/RetentionBar';
import EmptyState from '../components/ui/EmptyState';
import { retentionForStatus } from '../utils/status';

export default function Review() {
  const { getDueTopics, markReviewed } = useApp();

  const dueTopics = getDueTopics();
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [busy, setBusy] = useState(false);

  const current = dueTopics[0];
  const retention = current ? retentionForStatus(current.status) : 0;

  const progress =
    reviewed + dueTopics.length > 0
      ? (reviewed / (reviewed + dueTopics.length)) * 100
      : 100;

  const handleReview = async () => {
    if (!current || busy) return;

    setBusy(true);
    try {
      await markReviewed(current._id);
      setReviewed(r => r + 1);
      setFlipped(false);
    } finally {
      setBusy(false);
    }
  };

  if (dueTopics.length === 0) {
    return (
      <div className="animate-fadeUp text-[var(--text)]">

        <PageHeader eyebrow="Session" title="Review" />

        <EmptyState
          icon="🎉"
          title="All caught up!"
          description={
            reviewed > 0
              ? `Great work! You reviewed ${reviewed} topic${
                  reviewed !== 1 ? 's' : ''
                } this session.`
              : 'No topics are due right now. Check back later.'
          }
        />

      </div>
    );
  }

  return (
    <div className="animate-fadeUp text-[var(--text)]">

      <PageHeader
        eyebrow="Session"
        title="Review"
        description={`${dueTopics.length} topic${
          dueTopics.length !== 1 ? 's' : ''
        } remaining`}
      />

      {/* PROGRESS */}
      <Card className="p-4 mb-6 bg-[var(--card)] border border-[var(--border)]">

        <div className="flex items-center justify-between mb-2">

          <span className="text-xs text-[var(--muted)]">
            Session progress
          </span>

          <span className="text-xs text-[var(--muted)]">
            {reviewed} done
          </span>

        </div>

        <RetentionBar value={Math.round(progress)} size="md" />

      </Card>

      {/* FLASHCARD */}
      <div className="max-w-lg mx-auto">

        <Card className="p-7 mb-4 min-h-56 flex flex-col justify-between bg-[var(--card)] border border-[var(--border)] relative overflow-hidden">

          {/* SUBJECT BADGE */}
          {current?.subject?.name && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-4 self-start bg-[var(--primary)]/10 text-[var(--primary)]">
              {current.subject.name}
            </div>
          )}

          {/* CONTENT */}
          <div className="flex-1 flex flex-col justify-center">

            {!flipped ? (
              <div className="text-center py-4">

                <p className="text-xs text-[var(--muted)] mb-3 uppercase tracking-wider">
                  Topic
                </p>

                <h2 className="font-bold text-2xl text-[var(--text)] leading-tight">
                  {current?.title}
                </h2>

                <p className="text-sm text-[var(--muted)] mt-3">
                  Status: {current?.status} · retention {retention}%
                </p>

              </div>
            ) : (
              <div className="text-center py-4 animate-fadeUp">

                <p className="text-xs text-green-400 mb-3 uppercase tracking-wider">
                  Reviewed!
                </p>

                <RetentionBar value={retention} showLabel size="lg" />

                <p className="text-sm text-[var(--muted)] mt-4">
                  Mark as reviewed to move this topic forward.
                </p>

              </div>
            )}

          </div>

        </Card>

        {/* ACTIONS */}
        <div className="flex gap-3">

          {!flipped ? (
            <Button
              variant="primary"
              onClick={() => setFlipped(true)}
              className="flex-1"
            >
              I studied this →
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => setFlipped(false)}
                className="flex-1"
              >
                ← Back
              </Button>

              <Button
                variant="danger"
                onClick={handleReview}
                disabled={busy}
                className="flex-1"
              >
                {busy ? 'Saving…' : '✓ Mark reviewed'}
              </Button>
            </>
          )}

        </div>

      </div>

    </div>
  );
}