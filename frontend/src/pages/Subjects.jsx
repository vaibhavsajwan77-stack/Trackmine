import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SubjectCard from '../components/subjects/SubjectCard';
import AddSubjectModal from '../components/subjects/AddSubjectModal';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

export default function Subjects() {
  const { subjects, deleteSubject, loading } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-[var(--muted)]">
        Loading subjects…
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeUp">

      <div className="flex items-start justify-between">
        <PageHeader
          eyebrow="SUBJECTS"
          title="Your Subjects"
          description="Organise your learning into subjects and track retention per topic."
        />
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + Add Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No subjects yet"
          description="Create your first subject to start tracking your revision."
          actionLabel="Add Subject"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => (
            <SubjectCard
              key={subject._id}
              subject={subject}
              onDelete={deleteSubject}
            />
          ))}
        </div>
      )}

      <AddSubjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
