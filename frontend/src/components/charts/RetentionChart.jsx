import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 shadow-glow border border-white/80 text-xs font-mono">
      <p className="font-display font-semibold text-ink mb-1">{label}</p>
      <p style={{ color: '#33D9B2' }}>Avg retention: {payload[0]?.value}%</p>
    </div>
  );
};

// data: [{ week: 'W1', avg: 48 }, ...]
export default function RetentionChart({ data = [] }) {
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#33D9B2" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#33D9B2" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(11,12,20,0.05)" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: 'rgba(11,12,20,0.4)', fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="avg"
            stroke="#33D9B2"
            strokeWidth={2.5}
            fill="url(#retGrad)"
            dot={{ fill: '#33D9B2', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#33D9B2', strokeWidth: 0, filter: 'drop-shadow(0 0 6px rgba(51,217,178,0.6))' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
