// Status -> next status, and days until next revision after that status is set
const FLOW = {
  'Not Started': { next: 'Learned', days: 1 },
  'Learned': { next: 'Revision 1', days: 1 },
  'Revision 1': { next: 'Revision 2', days: 3 },
  'Revision 2': { next: 'Mastered', days: 7 },
  'Mastered': { next: 'Mastered', days: null },
};

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Called when user marks a topic as revised today.
// Moves topic to the next status and computes nextRevisionDate.
function advanceTopic(currentStatus) {
  const rule = FLOW[currentStatus] || FLOW['Not Started'];
  const now = new Date();

  const nextRevisionDate = rule.days === null ? null : addDays(now, rule.days);

  return {
    status: rule.next,
    lastRevisedAt: now,
    nextRevisionDate,
    isWeak: false,
  };
}

module.exports = { advanceTopic, FLOW };
