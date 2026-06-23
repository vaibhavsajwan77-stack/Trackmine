/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink:       '#0B0C14',
        paper:     '#F5F6FA',
        paperDim:  '#ECEEF5',
        focus: {
          DEFAULT: '#5B7FFF',
          dim:     '#EEF2FF',
        },
        retained: {
          DEFAULT: '#33D9B2',
          dim:     '#E6FAF6',
        },
        fade: {
          DEFAULT: '#FF6B6B',
          dim:     '#FFEAEA',
        },
        amber: {
          DEFAULT: '#FFB347',
          dim:     '#FFF4E0',
        },
        line: 'rgba(255,255,255,0.18)',
        glass: {
          white: 'rgba(255,255,255,0.65)',
          whiteStrong: 'rgba(255,255,255,0.85)',
          whiteFaint: 'rgba(255,255,255,0.35)',
          ink: 'rgba(11,12,20,0.55)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '4px',
        glass: '20px',
        heavy: '40px',
      },
      boxShadow: {
        soft:    '0 1px 2px rgba(11,12,20,0.04), 0 4px 16px rgba(11,12,20,0.04)',
        card:    '0 2px 8px rgba(91,127,255,0.06), 0 12px 40px rgba(11,12,20,0.08)',
        glass:   '0 1px 1px rgba(255,255,255,0.8) inset, 0 8px 32px rgba(11,12,20,0.08)',
        glow:    '0 0 24px rgba(91,127,255,0.25), 0 0 48px rgba(91,127,255,0.10)',
        glowMint:'0 0 20px rgba(51,217,178,0.30), 0 0 40px rgba(51,217,178,0.12)',
        glowRed: '0 0 20px rgba(255,107,107,0.28), 0 0 40px rgba(255,107,107,0.10)',
        sidebar: '2px 0 40px rgba(11,12,20,0.06), 4px 0 80px rgba(91,127,255,0.04)',
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.5rem',
        xl4: '2rem',
      },
      keyframes: {
        modalIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%,100%': { opacity: '0.7' },
          '50%':     { opacity: '1' },
        },
        orb: {
          '0%,100%': { transform: 'translateY(0px) scale(1)' },
          '50%':     { transform: 'translateY(-20px) scale(1.04)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        modalIn: 'modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        fadeUp:  'fadeUp 0.3s ease-out',
        glow:    'glow 3s ease-in-out infinite',
        orb:     'orb 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
