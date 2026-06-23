import React, { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="
          absolute
          inset-0
          bg-black/60
          backdrop-blur-md
          animate-fadeIn
        "
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative
          w-full
          ${sizes[size]}

          overflow-hidden

          rounded-3xl

          bg-white/[0.05]
          backdrop-blur-2xl

          border
          border-white/10

          shadow-[0_0_50px_rgba(0,229,255,0.08)]

          animate-modalIn

          p-6
        `}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">

          <div>
            <h2
              className="
                text-xl
                font-bold
                text-white
                font-display
              "
            >
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="
              w-10
              h-10

              rounded-2xl

              bg-white/[0.05]

              border
              border-white/10

              flex
              items-center
              justify-center

              text-slate-400

              hover:text-white
              hover:bg-white/[0.08]
              hover:border-cyan-400/20

              transition-all
              duration-300
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>

        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

      </div>
    </div>
  );
}