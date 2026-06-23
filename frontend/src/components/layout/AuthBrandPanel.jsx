import React from 'react';

export default function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden bg-ink rounded-l-xl3">

      {/* Soft ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 animate-orb"
          style={{
            background: 'radial-gradient(circle, #5B7FFF, transparent)',
            top: '15%',
            left: '20%',
          }}
        />
        <div
          className="absolute w-56 h-56 rounded-full blur-3xl opacity-15 animate-orb"
          style={{
            background: 'radial-gradient(circle, #33D9B2, transparent)',
            bottom: '10%',
            right: '15%',
            animationDelay: '2s',
          }}
        />
      </div>

      {/* TOP BRAND */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-xl bg-focus flex items-center justify-center shadow-glow">
            <span className="text-white font-bold font-display">T</span>
          </div>
          <span className="font-display font-semibold text-lg text-white tracking-wide">
            Trackmine
          </span>
        </div>

        {/* HEADLINE with fancy font for Revision */}
        <h1 className="text-4xl font-bold text-white leading-tight">
          Learn & Master
          <br />
          <span
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontStyle: 'italic',
              background: 'linear-gradient(90deg, #5B7FFF, #33D9B2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Revision
          </span>
          <span
            style={{
              background: 'linear-gradient(90deg, #33D9B2, #5B7FFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {' '}Like a Pro.
          </span>
        </h1>

        <p className="text-white/50 text-sm mt-5 max-w-xs leading-relaxed">
          A focused revision system for long-term memory retention 🤫.
        </p>
      </div>

      {/* VALUE INDICATORS */}
      <div className="relative z-10 space-y-3">
        <div className="glass-faint rounded-xl px-4 py-3 border border-white/10">
          <p className="text-white/60 text-sm">Smart spaced repetition 👽</p>
        </div>
        <div className="glass-faint rounded-xl px-4 py-3 border border-white/10">
          <p className="text-white/60 text-sm">Focus on weak topics only 👍</p>
        </div>
      </div>

    </div>
  );
}
