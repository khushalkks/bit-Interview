import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Cpu, TrendingUp } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-extrabold text-white">Skill Proficiency Radar</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          AI Competency Score
        </span>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#cbd5e1' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
            <Radar
              name="Readiness Score"
              dataKey="score"
              stroke="#6366f1"
              fill="#8b5cf6"
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-extrabold text-white">Readiness Trajectory</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          +6.4% Growth Velocity
        </span>
      </div>

      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="session" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#090d19', borderColor: '#334155', borderRadius: '14px', color: '#fff' }}
            />
            <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#growthGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

