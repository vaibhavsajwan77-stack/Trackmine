import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';

export default function AddSubjectModal({ isOpen, onClose }) {
  const { addSubject } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || submitting) return;

    setSubmitting(true);
    try {
      await addSubject({
        name: name.trim(),
        description: description.trim(),
      });

      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      console.log("Add subject error:", err?.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Subject">
      <div className="space-y-4">
        <Input
          label="Subject name"
          placeholder="e.g. Operating Systems"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        <Input
          label="Description (optional)"
          placeholder="e.g. Class 10 syllabus"
          value={description}
          onChange={e => setDescription(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        <div className="flex gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            className="flex-1"
            disabled={!name.trim() || submitting}
          >
            {submitting ? 'Adding…' : 'Add Subject'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}