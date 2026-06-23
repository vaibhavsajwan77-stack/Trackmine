import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import RetentionBar from '../ui/RetentionBar';

export default function SubjectCard({ subject, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card
      hover
      className="
        p-5 relative overflow-hidden group
        cursor-pointer
        transition-all duration-300
      "
      onClick={() => navigate(`/subjects/${subject._id}`)}
    >

      {/* glow background on hover */}
      <div className="
        absolute inset-0 opacity-0 group-hover:opacity-100
        transition-all duration-500
        bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5
      " />

      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-4 gap-3">

          <div className="min-w-0">
            <h3 className="font-display font-semibold text-[var(--text)] leading-tight truncate">
              {subject.name}
            </h3>

            {subject.description && (
              <p className="text-xs text-[var(--muted)] mt-0.5 truncate">
                {subject.description}
              </p>
            )}

            <p className="text-xs text-[var(--muted)] font-mono mt-1">
              {subject.totalTopics} topics
            </p>
          </div>

          {/* DELETE BUTTON */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(subject._id);
              }}
              className="
                p-2 rounded-lg
                text-[var(--muted)]
                hover:text-red-400
                hover:bg-red-500/10
                transition-all duration-200
                opacity-60 hover:opacity-100
              "
              aria-label={`Delete ${subject.name}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

        </div>

        {/* RETENTION */}
        <RetentionBar value={subject.progress ?? 0} showLabel />

      </div>
    </Card>
  );
}