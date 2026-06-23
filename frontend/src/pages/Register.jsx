import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthBrandPanel from '../components/layout/AuthBrandPanel';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const { register, user, loading: authLoading } = useAuth();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Already logged in → go straight to dashboard
  if (!authLoading && user) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError('Enter your name, email, and password to continue.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Could not create the account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="
        w-full max-w-5xl overflow-hidden rounded-3xl
        glass border border-white/10
        shadow-[0_0_50px_rgba(124,58,237,0.12)]
        grid lg:grid-cols-2 min-h-[650px]
      ">
        <AuthBrandPanel />

        <div className="flex flex-col justify-center p-8 lg:p-12">

          <div className="mb-8">
            <div className="
              inline-flex items-center px-3 py-1
              rounded-full bg-violet-500/10 border border-violet-500/20
              text-violet-400 text-xs font-medium mb-4
            ">
              Join Trackmine
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">Create Account</h2>
            <p className="text-slate-400">
              Start mastering your subjects with smart revision tracking.
            </p>
          </div>

          <div className="space-y-5 mb-6">
            <Input
              label="Full Name"
              placeholder="Alex Chen"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
            />
          </div>

          {error && (
            <div className="
              mb-5 p-3 rounded-2xl
              bg-red-500/10 border border-red-500/20
              text-red-400 text-sm
            ">
              {error}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleRegister}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating account…' : 'Create Account →'}
          </Button>

          <div className="mt-6 text-center">
            <span className="text-slate-400">Already have an account?</span>
            <button
              onClick={() => navigate('/login')}
              className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Sign In
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
