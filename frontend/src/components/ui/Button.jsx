import React from 'react';

const variants = {
  primary: `
    bg-gradient-to-r
    from-cyan-500
    via-sky-500
    to-violet-600
    border-[var(--border)]
    border-black

    text-white
    font-semibold

    shadow-[0_0_20px_rgba(0,229,255,0.25)]

    hover:scale-[1.03]
    hover:shadow-[0_0_35px_rgba(0,229,255,0.4)]

    active:scale-[0.98]
  `,

  secondary: `
    glass

    text-[var(--text)]
    border-[var(--border)]

    border
    border-white/10

    hover:bg-white/10
    hover:border-cyan-400/20

    active:scale-[0.98]
  `,

  ghost: `
    bg-transparent

    text-[var(--muted)]

    hover:bg-white/5
    hover:text-[var(--text)]

    active:scale-[0.98]
  `,

  danger: `
    bg-gradient-to-r
    from-red-500
    to-rose-600

    text-white

    hover:scale-[1.03]

    shadow-[0_0_20px_rgba(239,68,68,0.25)]

    active:scale-[0.98]
  `,

  mint: `
    bg-gradient-to-r
    from-emerald-500
    to-cyan-500

    text-white

    hover:scale-[1.03]

    shadow-[0_0_20px_rgba(16,185,129,0.25)]

    active:scale-[0.98]
  `,
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-2xl',
  lg: 'px-7 py-3 text-base rounded-2xl',
  icon: 'p-2.5 rounded-xl',
};

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2

        font-display
        transition-all
        duration-300

        disabled:opacity-40
        disabled:cursor-not-allowed
        disabled:hover:scale-100

        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}