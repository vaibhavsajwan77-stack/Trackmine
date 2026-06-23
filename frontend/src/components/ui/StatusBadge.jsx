import React from 'react';
import { STATUS_TOKENS } from '../../utils/status';

export default function StatusBadge({ status }) {
  const token = STATUS_TOKENS[status] || STATUS_TOKENS['Not Started'];

  return (
    <span
      className="
        inline-flex
        items-center
        gap-2

        px-3
        py-1

        rounded-full

        text-xs
        font-medium

        border

        backdrop-blur-xl

        transition-all
        duration-300

        hover:scale-105
      "
      style={{
        backgroundColor: `${token.color}12`,
        borderColor: `${token.color}30`,
        color: token.color,
      }}
    >
      <span
        className="
          w-2
          h-2
          rounded-full
          flex-shrink-0
          animate-pulse
        "
        style={{
          backgroundColor: token.color,
          boxShadow: `0 0 12px ${token.color}`,
        }}
      />

      <span className="tracking-wide">
        {token.label}
      </span>
    </span>
  );
}