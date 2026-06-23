import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

export default function TopicForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    setSaving(true);

    try {
      await onAdd({ title, notes });
      setTitle('');
      setNotes('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        glass
        border
        border-white/10

        rounded-3xl

        p-5

        flex
        flex-col
        lg:flex-row

        gap-4

        backdrop-blur-2xl

        shadow-[0_8px_32px_rgba(0,0,0,0.25)]
      "
    >
      {/* Topic Name */}
      <div className="flex-1">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter topic name..."
        />
      </div>

      {/* Notes */}
      <div className="flex-1">
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Quick notes (optional)"
        />
      </div>

      {/* Add Button */}
      <Button
        type="submit"
        variant="primary"
        disabled={saving}
        className="
          lg:w-auto
          min-w-[140px]
          h-[50px]
        "
      >
        {saving ? (
          <>
            <span className="animate-pulse">
              Adding...
            </span>
          </>
        ) : (
          <>
            ✨ Add Topic
          </>
        )}
      </Button>
    </form>
  );
}