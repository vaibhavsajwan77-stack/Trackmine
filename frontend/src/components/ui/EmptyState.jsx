import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center

        py-16
        px-6

        text-center
        animate-fadeUp
      "
    >
      {/* Neon Icon Container */}
      <div className="relative mb-6">

        <div
          className="
            absolute
            inset-0
            rounded-3xl
            blur-2xl
            bg-cyan-500/20
          "
        />

        <div
          className="
            relative
            w-20
            h-20

            rounded-3xl

            glass

            border
            border-white/10

            flex
            items-center
            justify-center

            text-4xl

            shadow-[0_0_30px_rgba(0,229,255,0.08)]
          "
        >
          {icon}
        </div>

      </div>

      <h3
        className="
          text-white
          text-xl
          font-bold
          font-display
          mb-3
        "
      >
        {title}
      </h3>

      {description && (
        <p
          className="
            text-slate-400
            text-sm
            max-w-md
            leading-relaxed
            mb-8
          "
        >
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
