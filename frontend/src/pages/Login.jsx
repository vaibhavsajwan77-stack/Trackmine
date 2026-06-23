import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthBrandPanel from '../components/layout/AuthBrandPanel';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const navigate  = useNavigate();
  const { login, user, loading: authLoading } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [pos,      setPos]      = useState({ x: 0, y: 0 });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouse = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setPos({ x, y });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Already logged in → go straight to dashboard (handles reload / back-button)
  if (!authLoading && user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Login failed. Check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#05060A]">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        {[...Array(60)].map((_, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[2px] bg-white/60 rounded-full"
            style={{
              top:  `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${1 + Math.random() * 3}s infinite alternate`,
              transform: `translate(${pos.x * 10}px, ${pos.y * 10}px)`,
            }}
          />
        ))}
        {[...Array(6)].map((_, i) => (
          <span
            key={`shoot-${i}`}
            className="shooting-star"
            style={{
              top:            `${Math.random() * 40}%`,
              left:           `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
        <div className="absolute w-[600px] h-[600px] bg-cyan-500/10  blur-[150px] -top-40 -left-40" />
        <div className="absolute w-[500px] h-[500px] bg-violet-500/10 blur-[150px] bottom-0 right-0" />
      </div>

      {/* CARD */}
      <div
        style={{ transform: `translate(${pos.x * -10}px, ${pos.y * -10}px)` }}
        className="
          relative z-10 w-full max-w-5xl
          grid lg:grid-cols-2
          rounded-3xl overflow-hidden
          glass border border-white/10
          shadow-[0_0_100px_rgba(91,127,255,0.15)]
          transition-transform duration-200 ease-out
        "
      >
        <AuthBrandPanel />

        <div className="flex flex-col justify-center p-10 lg:p-14">

          <h2 className="text-4xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-white/40 text-sm mb-8">Access your space — you'll stay logged in.</p>

          <div className="space-y-5">
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && (
            <div className="mt-4 text-red-400 text-sm">{error}</div>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6"
          >
            {loading ? 'Signing in…' : 'Enter System →'}
          </Button>

          <div className="mt-5 text-center text-white/40 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:underline">
              Create one
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(1); }
          to   { opacity: 1;   transform: scale(1.5); }
        }
        .shooting-star {
          position: absolute;
          width: 120px; height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.9));
          transform: rotate(-45deg);
          opacity: 0;
          animation: shoot 3s linear infinite;
        }
        @keyframes shoot {
          0%   { transform: translateX(0)    translateY(0)    rotate(-45deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateX(600px) translateY(600px) rotate(-45deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
