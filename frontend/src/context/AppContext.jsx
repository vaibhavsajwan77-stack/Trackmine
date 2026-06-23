import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user) {
      setSubjects([]);
      setTopics([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: subjectList } = await api.get('/subjects');
      setSubjects(subjectList);

      const topicResponses = await Promise.all(
        subjectList.map(s =>
          api.get(`/topics/subject/${s._id}`)
            .then(res =>
              res.data.map(t => ({
                ...t,
                subject: { _id: s._id, name: s.name },
              }))
            )
            .catch(() => [])
        )
      );

      setTopics(topicResponses.flat());
    } catch (err) {
      console.error('reload error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load data on mount and whenever user changes
  useEffect(() => {
    reload();
  }, [reload]);

  // ---- SUBJECT ACTIONS ----
  const addSubject = async ({ name, description }) => {
    const { data } = await api.post('/subjects', { name, description });
    await reload();
    return data;
  };

  const deleteSubject = async (id) => {
    await api.delete(`/subjects/${id}`);
    await reload();
  };

  // ---- TOPIC ACTIONS ----
  const addTopic = async ({ subjectId, title, notes }) => {
    const { data } = await api.post('/topics', { subjectId, title, notes });
    await reload();
    return data;
  };

  const deleteTopic = async (id) => {
    await api.delete(`/topics/${id}`);
    await reload();
  };

  const markReviewed = async (id) => {
    await api.patch(`/topics/${id}/revise`);
    await reload();
  };

  // ---- DERIVED HELPERS ----
  const getTopicsForSubject = (subjectId) =>
    topics.filter(t => String(t.subject?._id) === String(subjectId));

  const getDueTopics = () =>
    topics.filter(t => {
      if (t.status === 'Mastered') return false;
      if (!t.nextRevisionDate) return true;
      return new Date(t.nextRevisionDate) <= new Date();
    });

  // Avatar update (local only - stored in localStorage for now)
  const updateAvatar = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const avatarUrl = e.target.result;
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        u.avatar = avatarUrl;
        localStorage.setItem('user', JSON.stringify(u));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        subjects,
        topics,
        loading,
        reload,
        addSubject,
        deleteSubject,
        addTopic,
        deleteTopic,
        markReviewed,
        getTopicsForSubject,
        getDueTopics,
        updateAvatar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
