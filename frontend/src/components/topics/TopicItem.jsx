import React from 'react';
import StatusBadge from '../ui/StatusBadge';
import RetentionBar from '../ui/RetentionBar';
import Button from '../ui/Button';
import { retentionForStatus, formatDate, isOverdue } from '../../utils/status';

// topic comes from the backend: { _id, title, status, nextRevisionDate, subject?, isWeak }
export default function TopicItem({ topic, onRevise, onDelete, showSubject }) {
  const retention = retentionForStatus(topic.status);
  const overdue = isOverdue(topic.nextRevisionDate) && topic.status !== 'Mastered';

  return (
    <div className="glass glass-inner rounded-xl p-4 flex items-center gap-4 card-lift border border-white/60 shadow-soft">
      {/* Retention indicator */}
      <div
        className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-mono font-bold text-xs"
        style={{ background: `${STATUS_DOT_BG(retention)}`, color: STATUS_DOT_FG(retention) }}
      >
        {retention}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-display font-medium text-ink text-sm truncate">{topic.title}</span>
          <StatusBadge status={topic.status} />
          {topic.isWeak && (
            <span className="text-[10px] font-mono uppercase tracking-wide bg-fade-dim text-fade px-1.5 py-0.5 rounded">
              Weak
            </span>
          )}
        </div>
        {showSubject && topic.subject?.name && (
          <p className="text-xs text-ink-tertiary mb-1">{topic.subject.name}</p>
        )}
        <RetentionBar value={retention} size="sm" />
      </div>

      {/* Meta + action */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`hidden sm:block text-xs font-mono ${overdue ? 'text-fade font-medium' : 'text-ink-tertiary'}`}>
          {formatDate(topic.nextRevisionDate)}
        </span>
        {topic.status !== 'Mastered' && onRevise && (
          <Button variant="mint" size="sm" onClick={() => onRevise(topic._id)}>
            Review
          </Button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(topic._id)}
            className="text-ink/25 hover:text-fade transition-colors p-1"
            aria-label={`Delete ${topic.title}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function STATUS_DOT_BG(retention) {
  if (retention >= 80) return 'rgba(51,217,178,0.12)';
  if (retention >= 60) return 'rgba(91,127,255,0.12)';
  if (retention >= 40) return 'rgba(255,179,71,0.12)';
  return 'rgba(255,107,107,0.12)';
}

function STATUS_DOT_FG(retention) {
  if (retention >= 80) return '#33D9B2';
  if (retention >= 60) return '#5B7FFF';
  if (retention >= 40) return '#FFB347';
  return '#FF6B6B';
}
