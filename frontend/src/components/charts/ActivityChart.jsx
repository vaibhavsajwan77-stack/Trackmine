import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-strong rounded-xl p-3 shadow-glow border border-white/20 text-xs font-mono">
      <p className="font-display font-semibold text-white mb-1">
        {label}
      </p>

      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// data: [{ day: 'Mon', reviews: 3, newTopics: 1 }, ...]
export default function ActivityChart({ data = [] }) {
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} barSize={18}>
          <CartesianGrid
            vertical={false}
            stroke="rgba(255,255,255,0.08)"
          />

          <XAxis
            dataKey="day"
            tick={{
              fontSize: 11,
              fill: '#CBD5E1',
              fontFamily: 'JetBrains Mono',
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis hide />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: 'rgba(91,127,255,0.06)',
            }}
          />

          <Bar
            dataKey="reviews"
            name="Reviews"
            fill="#5B7FFF"
            radius={[4, 4, 0, 0]}
            opacity={0.85}
          />

          <Bar
            dataKey="newTopics"
            name="New"
            fill="#33D9B2"
            radius={[4, 4, 0, 0]}
            opacity={0.85}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}