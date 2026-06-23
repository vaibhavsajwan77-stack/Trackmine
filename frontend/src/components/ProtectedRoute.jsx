import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Still verifying token with backend — show nothing (user already visible from cache)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin"
          />
          <p className="text-xs text-[var(--muted)] font-mono">Restoring session…</p>
        </div>
      </div>
    );
  }

  // Token verified (or no token at all) — redirect if not authenticated
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
