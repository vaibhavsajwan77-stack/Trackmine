import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const navItems = [
  { to: '/', label: 'Home', icon: '◈' },
  { to: '/subjects', label: 'Subjects', icon: '⬡' },
  { to: '/review', label: 'Review', icon: '◎' },
  { to: '/stats', label: 'Stats', icon: '▦' },
];

export default function MobileNav() {
  const { getDueTopics } = useApp();
  const dueCount = getDueTopics().length;

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40">

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl px-2 py-2 shadow-lg backdrop-blur-xl">

        <div className="flex items-center justify-around">

          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-150
                ${isActive ? 'text-[var(--primary)]' : 'text-[var(--muted)]'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="text-lg leading-none"
                    style={{
                      color: isActive ? 'var(--primary)' : 'var(--muted)',
                      filter: isActive
                        ? 'drop-shadow(0 0 6px rgba(91,127,255,0.5))'
                        : 'none',
                    }}
                  >
                    {icon}
                  </span>

                  <span className="text-[11px]">
                    {label}
                  </span>

                  {/* Badge */}
                  {label === 'Review' && dueCount > 0 && (
                    <span className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {dueCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

        </div>

      </div>

    </nav>
  );
}