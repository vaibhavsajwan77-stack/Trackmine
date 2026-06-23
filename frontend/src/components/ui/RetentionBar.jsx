import React from 'react';

const getRetentionColor = (value) => {
  if (value >= 80) return { track: '#33D9B2', glow: 'rgba(51,217,178,0.5)', label: 'Mastered' };
  if (value >= 60) return { track: '#5B7FFF', glow: 'rgba(91,127,255,0.5)', label: 'Good' };
  if (value >= 40) return { track: '#FFB347', glow: 'rgba(255,179,71,0.5)', label: 'Fair' };
  return { track: '#FF6B6B', glow: 'rgba(255,107,107,0.5)', label: 'Weak' };
};

export default function RetentionBar({ value = 0, showLabel = false, size = 'md' }) {
  const { track, glow, label } = getRetentionColor(value);
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-2.5' };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-ink-tertiary">Retention</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-semibold" style={{ color: track }}>
              {value}%
            </span>
            <span className="text-xs text-ink-tertiary">· {label}</span>
          </div>
        </div>
      )}
      {/* Track */}
      <div className={`w-full ${heights[size]} rounded-full bg-black/5 overflow-hidden relative`}>
        {/* Filled segment */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${track}BB 0%, ${track} 70%, rgba(255,255,255,0.6) 100%)`,
            boxShadow: `0 0 8px ${glow}, 0 0 2px ${track}`,
          }}
        />
        {/* Glow halo at leading edge */}
        {value > 4 && (
          <div
            className="absolute inset-y-0 w-3 rounded-full blur-sm"
            style={{
              left: `calc(${value}% - 8px)`,
              background: track,
              opacity: 0.6,
            }}
          />
        )}
      </div>
    </div>
  );
}
