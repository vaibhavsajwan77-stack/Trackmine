import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◈' },
  { to: '/subjects', label: 'Subjects', icon: '⬡' },
  { to: '/review', label: 'Review', icon: '◎' },
  { to: '/weak-topics', label: 'Weak Topics', icon: '⚠' },
  { to: '/calendar', label: 'Calendar', icon: '▤' },
  { to: '/streaks', label: 'Streaks', icon: '🔥' },
  { to: '/stats', label: 'Analytics', icon: '▦' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export default function Sidebar() {
  const { user, getDueTopics, updateAvatar } = useApp();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const dueCount = getDueTopics().length;

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen p-3">
      <div className="flex flex-col h-full bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg overflow-hidden">

        {/* BRAND */}
        <div className="px-5 pt-5 pb-3">
          <span className="font-bold text-lg tracking-tight text-[var(--text)]">
            Track<span style={{
              background: 'linear-gradient(90deg, #5B7FFF, #33D9B2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>mine</span>
          </span>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--text)]'
                }`
              }
            >
              <span className="w-7 h-7 flex items-center justify-center">{icon}</span>
              <span className="flex-1">{label}</span>
              {label === 'Review' && dueCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {dueCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mx-4 h-px bg-[var(--border)]" />

        {/* USER SECTION */}
        <div className="p-4 relative" ref={menuRef}>
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-[var(--bg)]"
          >
            <div className="relative w-8 h-8">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files[0]) updateAvatar(e.target.files[0]);
                }}
              />
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  className="w-8 h-8 rounded-full object-cover border border-[var(--border)]"
                  alt="avatar"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--text)] truncate">{user?.name}</p>
              <p className="text-[11px] text-[var(--muted)] truncate">{user?.email}</p>
            </div>
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute bottom-16 left-4 right-4 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden z-50">
              <button
                onClick={toggleTheme}
                className="w-full flex justify-between px-4 py-2 text-sm hover:bg-[var(--bg)] text-[var(--text)]"
              >
                <span>🎨 Theme</span>
                <span className="text-xs text-[var(--muted)]">{theme}</span>
              </button>

              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg)] text-[var(--text)]"
                onClick={() => setOpen(false)}
              >
                👤 Profile
              </button>

              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 text-red-500"
                onClick={() => { setOpen(false); logout(); }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
