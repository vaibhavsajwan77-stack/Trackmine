import React from 'react';

export default function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          className="
            text-sm
            font-medium
            text-slate-300
            font-display
          "
        >
          {label}
        </label>
      )}

      <input
        className={`
          w-full

          px-4
          py-3

          rounded-2xl

          bg-white/[0.04]
          backdrop-blur-xl

          border
          border-white/10

          text-white

          placeholder:text-slate-500

          focus:outline-none
          focus:border-cyan-400/40
          focus:bg-white/[0.06]

          focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08),0_0_25px_rgba(0,229,255,0.15)]

          transition-all
          duration-300

          ${error ? 'border-red-500/40' : ''}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}