// Single source of truth for status -> visual language across the app.
// "retention" = how far along the spaced-repetition path a topic is (0-100).
// This isn't time-based decay, it's stage-based progress through the 5 statuses,
// which is what the retention bar (the app's signature visual) renders.

export const STATUS_ORDER = ['Not Started', 'Learned', 'Revision 1', 'Revision 2', 'Mastered'];

export const STATUS_TOKENS = {
  'Not Started': { color: '#9C99AE', bg: '#EEECF3', label: 'Not started', retention: 4 },
  'Learned': { color: '#6D5AE6', bg: '#EDEAFB', label: 'Learned', retention: 28 },
  'Revision 1': { color: '#C9962F', bg: '#FBF1DE', label: 'Revision 1', retention: 52 },
  'Revision 2': { color: '#E8714A', bg: '#FCEAE1', label: 'Revision 2', retention: 76 },
  'Mastered': { color: '#2BB673', bg: '#E3F6EC', label: 'Mastered', retention: 100 },
};

export function retentionForStatus(status) {
  return STATUS_TOKENS[status]?.retention ?? 4;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.round((d.setHours(0,0,0,0) - today.setHours(0,0,0,0)) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays < 7) return `In ${diffDays}d`;

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}
