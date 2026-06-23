import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AddTopicModal({ isOpen, onClose, subjectId }) {
  const { addTopic } = useApp();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Topic title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await addTopic({ subjectId, title: title.trim(), notes: notes.trim() });
      setTitle('');
      setNotes('');
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add topic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="
        relative w-full max-w-md
        bg-[var(--card)]
        border border-[var(--border)]
        rounded-2xl
        p-6
        shadow-2xl
        animate-fadeUp
      ">
        <h2 className="text-xl font-semibold text-[var(--text)] mb-1">
          Add Topic
        </h2>
        <p className="text-sm text-[var(--muted)] mb-5">
          Add a new topic to track for revision
        </p>

        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Topic title (e.g. Linked Lists)"
            className="
              w-full px-4 py-2 rounded-xl
              bg-transparent
              border border-[var(--border)]
              text-[var(--text)]
              outline-none
              focus:border-[var(--primary)]
              transition
            "
          />

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="
              w-full px-4 py-2 rounded-xl
              bg-transparent
              border border-[var(--border)]
              text-[var(--text)]
              outline-none
              focus:border-[var(--primary)]
              transition
              resize-none
              h-24
            "
          />
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading || !title.trim()}
            className="
              px-5 py-2 rounded-xl
              bg-[var(--primary)]
              text-white
              hover:opacity-90
              active:scale-[0.98]
              transition
              disabled:opacity-50
            "
          >
            {loading ? 'Adding...' : 'Add Topic'}
          </button>
        </div>
      </div>
    </div>
  );
}
