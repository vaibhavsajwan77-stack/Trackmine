import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        glass
        rounded-3xl
        border
        border-white/10
        backdrop-blur-2xl

        ${
          hover
            ? `
              card-lift
              cursor-pointer
              hover:border-cyan-400/20
              hover:shadow-[0_0_30px_rgba(0,229,255,0.08)]
            `
            : ''
        }

        ${
          glow
            ? 'shadow-[0_0_35px_rgba(0,229,255,0.12)]'
            : 'shadow-[0_8px_32px_rgba(0,0,0,0.25)]'
        }

        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}