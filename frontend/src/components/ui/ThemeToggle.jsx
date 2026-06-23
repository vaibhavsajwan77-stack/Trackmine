import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative flex items-center gap-2
        px-4 py-2 rounded-xl
        border
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        shadow-sm
        hover:scale-[1.04]
        active:scale-[0.98]
        overflow-hidden
      "
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        color: 'var(--text)',
      }}
    >
      {/* sliding background */}
      <span
        className={`
          absolute top-1 bottom-1 left-1 w-1/2
          rounded-lg
          transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${theme === 'dark' ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{
          background:
            theme === 'dark'
              ? 'rgba(91,127,255,0.25)'
              : 'rgba(255,193,7,0.25)',
        }}
      />

      {/* icon */}
      <span className="relative z-10 text-sm">
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>

      {/* label */}
      <span className="relative z-10 text-xs font-medium">
        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );
}