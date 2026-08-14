import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid
} from 'recharts';
import { Award, TrendingUp, Cpu, BarChart2 } from 'lucide-react';

const DEFAULT_RADAR = [
  { skill: 'System Design', score: 88 },
  { skill: 'Data Structures', score: 94 },
  { skill: 'API Architecture', score: 86 },
  { skill: 'Database Optimization', score: 78 },
  { skill: 'Behavioral STAR', score: 90 },
  { skill: 'Code Cleanliness', score: 85 },
];

const DEFAULT_GROWTH = [
  { session: 'Session 1', score: 72 },
  { session: 'Session 2', score: 76 },
  { session: 'Session 3', score: 79 },
  { session: 'Session 4', score: 83 },
  { session: 'Session 5', score: 85 },
  { session: 'Session 6', score: 88 },
];

export function SkillRadarChart({ data = DEFAULT_RADAR }) {
  return (
    <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-900/40 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-extrabold text-white">Skill Proficiency Radar</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
          Recharts Analytics
        </span>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#451a03" />
            <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#cbd5e1' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#78350f" />
            <Radar
              name="Readiness Score"
              dataKey="score"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ReadinessGrowthChart({ data = DEFAULT_GROWTH }) {
  return (
    <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-900/40 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <h3 className="text-base font-extrabold text-white">Readiness Trajectory</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30">
          +6.4% Velocity
        </span>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#451a03" />
            <XAxis dataKey="session" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#14100c', borderColor: '#451a03', borderRadius: '12px', color: '#fff' }}
            />
            <Area type="monotone" dataKey="score" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#growthGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
