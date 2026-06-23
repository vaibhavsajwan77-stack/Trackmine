import { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');

  return (
    <div className="max-w-xl mx-auto px-6 md:px-10 py-10 animate-fadeUp text-[var(--text)]">

      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your profile."
      />

      {/* PROFILE CARD */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 space-y-5">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-semibold text-lg">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>

          <div>
            <p className="font-medium text-[var(--text)]">
              {user?.name}
            </p>

            <p className="text-sm text-[var(--muted)]">
              {user?.email}
            </p>
          </div>

        </div>

        <div className="space-y-4">

          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email"
            value={email}
            disabled
            className="opacity-70 cursor-not-allowed"
          />

        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Profile editing isn't connected to the backend yet.
          This section is prepared for the next update.
        </p>

      </div>

      {/* LOGOUT CARD */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mt-4">

        <p className="font-medium text-[var(--text)] mb-1">
          Log out
        </p>

        <p className="text-sm text-[var(--muted)] mb-4">
          Sign out of your account on this device.
        </p>

        <Button variant="danger" onClick={logout}>
          Log out
        </Button>

      </div>

    </div>
  );
}