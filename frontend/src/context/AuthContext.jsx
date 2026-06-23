import { createContext, useContext, useEffect, useState } from 'react';
import api, { getMe } from '../api/axios';

const AuthContext = createContext(null);

// ─── helpers ────────────────────────────────────────────────────────────────

function readStorage() {
  try {
    const token = localStorage.getItem('token');
    const raw   = localStorage.getItem('user');
    const user  = raw ? JSON.parse(raw) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

function writeStorage(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function clearStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// ─── provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {

  // Initialise user from localStorage immediately — no flicker on reload
  const [user, setUser] = useState(() => readStorage().user);

  // loading = true only while we're verifying the token with the backend
  const [loading, setLoading] = useState(() => !!readStorage().token);

  useEffect(() => {
    const { token, user: cachedUser } = readStorage();

    // No token → nothing to verify, stay logged-out
    if (!token) {
      setLoading(false);
      return;
    }

    // We already restored user from storage above, so the UI is visible
    // immediately. Now verify the token is still valid in the background.
    getMe()
      .then(({ data }) => {
        // Refresh stored profile with latest data from server
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch((err) => {
        const status = err?.response?.status;

        if (status === 401) {
          // Token is expired or invalid — force logout
          clearStorage();
          setUser(null);
        }
        // Any other error (network down, server cold-start, etc.)
        // → keep the cached user so the app still works offline
      })
      .finally(() => setLoading(false));
  }, []);

  // ── actions ──────────────────────────────────────────────────────────────

  const saveSession = (token, profile) => {
    writeStorage(token, profile);
    setUser(profile);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    // Token expiry is 30 days — user stays logged in across reloads
    saveSession(data.token, data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    saveSession(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    clearStorage();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
