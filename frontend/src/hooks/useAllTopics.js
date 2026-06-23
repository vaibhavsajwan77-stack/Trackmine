import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

// Backend has no "all topics" endpoint, so this fetches all subjects,
// then fetches each subject's topics in parallel and flattens them.
// Fine at MVP scale (few subjects per user); revisit with a dedicated
// /api/topics endpoint if subject counts grow large.
export function useAllTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data: subjects } = await api.get('/subjects');
    const results = await Promise.all(
      subjects.map((s) =>
        api.get(`/topics/subject/${s._id}`).then((res) =>
          res.data.map((t) => ({ ...t, subject: { _id: s._id, name: s.name } }))
        )
      )
    );
    setTopics(results.flat());
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { topics, loading, reload };
}
