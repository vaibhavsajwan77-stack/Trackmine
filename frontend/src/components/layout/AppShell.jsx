import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useApp } from '../../context/AppContext';

export default function AppShell() {
  const { loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
        <p className="font-mono text-sm text-[var(--muted)]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)]">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 px-4 md:px-8 pt-6 pb-24 md:pb-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
