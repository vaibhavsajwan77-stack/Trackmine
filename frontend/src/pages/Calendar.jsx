import { useMemo, useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { useAllTopics } from '../hooks/useAllTopics';
import { isOverdue } from '../utils/status';

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push(new Date(year, month, d));

  return cells;
}

export default function Calendar() {
  const { topics, loading } = useAllTopics();

  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  // 🧠 NEW: notes storage (per date)
  const [notes, setNotes] = useState({});
  const [activeDate, setActiveDate] = useState(null);
  const [input, setInput] = useState('');

  const cells = useMemo(
    () => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );

  const topicsByDate = useMemo(() => {
    const map = {};

    topics.forEach((t) => {
      if (!t.nextRevisionDate || t.status === 'Mastered') return;

      const key = new Date(t.nextRevisionDate).toDateString();

      if (!map[key]) map[key] = [];
      map[key].push(t);
    });

    return map;
  }, [topics]);

  const todayStr = new Date().toDateString();

  function saveNote(dateKey) {
    if (!input.trim()) return;

    setNotes((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), input]
    }));

    setInput('');
    setActiveDate(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 animate-fadeUp bg-black text-white">

      <PageHeader
        eyebrow="Schedule"
        title="Revision calendar"
        description="Tap a date to add notes or quick reminders."
        action={
          <div className="flex items-center gap-1">

            <Button variant="ghost" size="sm"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
              }
            >
              ←
            </Button>

            <span className="px-3 text-sm w-32 text-center text-white">
              {cursor.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </span>

            <Button variant="ghost" size="sm"
              onClick={() =>
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
              }
            >
              →
            </Button>

          </div>
        }
      />

      {/* CALENDAR */}
      {loading ? (
        <div className="h-96 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative">

          {/* GRID */}
          <div className="grid grid-cols-7 gap-1.5">

            {cells.map((date, i) => {
              if (!date)
                return <div key={i} className="aspect-square" />;

              const key = date.toDateString();
              const dayTopics = topicsByDate[key] || [];
              const overdue = dayTopics.some(t => isOverdue(t.nextRevisionDate));
              const isToday = key === todayStr;

              const hasNotes = notes[key]?.length > 0;

              return (
                <div
                  key={i}
                  onClick={() => setActiveDate(key)}
                  className={`aspect-square rounded-lg border p-1.5 flex flex-col cursor-pointer relative ${
                    isToday
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : 'border-zinc-800'
                  }`}
                >

                  <span
                    className={`text-xs ${
                      isToday ? 'text-cyan-400 font-semibold' : 'text-zinc-400'
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  {dayTopics.length > 0 && (
                    <div className="flex-1 flex items-end">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          overdue
                            ? 'bg-zinc-700 text-zinc-300'
                            : 'bg-cyan-500 text-black'
                        }`}
                      >
                        {dayTopics.length}
                      </span>
                    </div>
                  )}

                  {/* 🟣 NOTE INDICATOR */}
                  {hasNotes && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-400" />
                  )}

                  {/* 🧠 POPUP PANEL */}
                  {activeDate === key && (
                    <div className="absolute z-50 left-full ml-2 top-0 w-56 bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-lg">

                      <p className="text-xs text-zinc-400 mb-2">
                        Notes for {date.getDate()}/{cursor.getMonth() + 1}
                      </p>

                      {/* existing notes */}
                      <div className="space-y-1 max-h-24 overflow-auto mb-2">
                        {(notes[key] || []).map((n, idx) => (
                          <div key={idx} className="text-xs text-white bg-zinc-700 p-1 rounded">
                            {n}
                          </div>
                        ))}
                      </div>

                      {/* input */}
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add note..."
                        className="w-full text-xs bg-zinc-900 border border-zinc-700 rounded p-1 text-white"
                      />

                      <button
                        onClick={() => saveNote(key)}
                        className="mt-2 w-full text-xs bg-cyan-500 text-black py-1 rounded"
                      >
                        Save
                      </button>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>
      )}

    </div>
  );
}