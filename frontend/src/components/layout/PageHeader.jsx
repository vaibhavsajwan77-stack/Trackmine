import React from 'react';

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className = ''
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 mb-7 ${className}`}
    >
      {/* LEFT CONTENT */}
      <div className="min-w-0">
        
        {/* EYEBROW */}
        {eyebrow && (
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--primary)',
                boxShadow: '0 0 10px rgba(91,127,255,0.6)'
              }}
            />
            
            <span className="text-xs font-medium uppercase tracking-wider font-display text-[var(--primary)]">
              {eyebrow}
            </span>
          </div>
        )}

        {/* TITLE */}
        <h1 className="font-display font-bold text-2xl md:text-3xl leading-tight text-[var(--text)]">
          {title}
        </h1>

        {/* DESCRIPTION */}
        {description && (
          <p className="text-sm mt-1 text-[var(--muted)] leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* RIGHT ACTION */}
      {action && (
        <div className="flex-shrink-0 flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
}