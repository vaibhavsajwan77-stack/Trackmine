import React from 'react';
import Card from './Card';

export default function StatCard({
  label,
  value,
  unit,
  icon,
  accent = '#00E5FF',
  trend,
}) {
  return (
    <Card
      hover
      className="
        relative
        overflow-hidden
        p-5
        group
      "
    >
      {/* Glow Orb */}
      <div
        className="
          absolute
          -top-8
          -right-8
          w-32
          h-32
          rounded-full
          blur-3xl
          opacity-20
          transition-all
          duration-500
          group-hover:opacity-30
          group-hover:scale-110
        "
        style={{ backgroundColor: accent }}
      />

      {/* Border Glow */}
      <div
        className="
          absolute
          inset-0
          rounded-3xl
          opacity-0
          group-hover:opacity-100
          transition-all
          duration-500
          pointer-events-none
        "
        style={{
          boxShadow: `0 0 30px ${accent}20`,
        }}
      />

      <div className="relative z-10">
        {/* Top Row */}
        <div className="flex items-start justify-between mb-4">

          <div>
            <p
              className="
                text-xs
                uppercase
                tracking-widest
                font-medium
                text-slate-400
              "
            >
              {label}
            </p>
          </div>

          {icon && (
            <div
              className="
                w-10
                h-10
                rounded-2xl
                flex
                items-center
                justify-center
                text-lg
                border
                border-white/10
                backdrop-blur-xl
              "
              style={{
                background: `${accent}15`,
              }}
            >
              {icon}
            </div>
          )}

        </div>

        {/* Value */}
        <div className="flex items-end gap-2">

          <span
            className="
              text-3xl
              lg:text-4xl
              font-bold
              text-white
              leading-none
              tracking-tight
            "
          >
            {value}
          </span>

          {unit && (
            <span
              className="
                text-sm
                text-slate-400
                mb-1
                font-mono
              "
            >
              {unit}
            </span>
          )}

        </div>

        {/* Trend */}
        {trend && (
          <div
            className="
              mt-3
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white/[0.04]
              px-3
              py-1
            "
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: accent,
              }}
            />
            <span
              className="
                text-xs
                text-slate-400
              "
            >
              {trend}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}