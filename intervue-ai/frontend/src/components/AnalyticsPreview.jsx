import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, TrendingUp, AlertTriangle, Lightbulb, ChevronRight, BarChart2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { dashboardAPI } from '../services/api';

/**
 * Baseline Data Structure for Analytics Preview
 */
const MOCK_ANALYTICS_DATA = {
  overallScore: 82,
  maxScore: 100,
  performanceLevel: "Strong Hire",
  categories: [
    { name: 'Technical', score: 88, fullMark: 100 },
    { name: 'Coding', score: 91, fullMark: 100 },
    { name: 'Communication', score: 74, fullMark: 100 },
    { name: 'Problem Solving', score: 86, fullMark: 100 },
  ],
  strengths: [
    "Clean code structure with modular functions",
    "Optimal O(1) space & time complexity choice",
    "Strong understanding of hash table collision resolution"
  ],
  improvements: [
    "Speak with more pauses when explaining complex recursion",
    "Consider edge cases (null pointer/empty inputs) before typing code"
  ]
};

export default function AnalyticsPreview() {
  const [analyticsData, setAnalyticsData] = useState(MOCK_ANALYTICS_DATA);

  useEffect(() => {
    async function loadLiveMetrics() {
      const token = localStorage.getItem('bit_interview_token');
      if (!token) return;
      try {
        const summary = await dashboardAPI.getSummary();
        if (summary && summary.skills && summary.skills.length > 0) {
          const categories = summary.skills.map(s => ({
            name: s.category,
            score: s.score,
            fullMark: 100
          }));
          setAnalyticsData(prev => ({
            ...prev,
            overallScore: summary.readiness_score || prev.overallScore,
            performanceLevel: summary.readiness_score >= 85 ? "Strong Hire" : summary.readiness_score >= 70 ? "Hire" : "Needs Practice",
            categories: categories.length >= 4 ? categories.slice(0, 4) : prev.categories
          }));
        }
      } catch (err) {
        // Fallback to baseline data silently
      }
    }
    loadLiveMetrics();
  }, []);

  const data = analyticsData;


  return (
    <section id="analytics" className="py-24 bg-[#0b0907] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Actionable Feedback Engine
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Detailed Performance <span className="text-gradient-accent">Analytics</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Get comprehensive, multi-dimensional feedback after every interview session to track your growth trajectory.
          </p>
        </div>

        {/* Analytics Card Mockup */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#14100c] border border-amber-900/80 p-6 md:p-8 shadow-2xl space-y-8">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-xl bg-amber-950/40 border border-amber-900/60 items-center">
            {/* Overall Score Dial */}
            <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-amber-900/60 pb-6 md:pb-0 md:pr-6">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Overall Interview Score</span>
              <div className="relative flex items-baseline gap-1">
                <span className="text-6xl font-black text-white tracking-tight">{data.overallScore}</span>
                <span className="text-xl font-bold text-slate-500">/ {data.maxScore}</span>
              </div>
              <span className="mt-3 px-3 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {data.performanceLevel}
              </span>
            </div>

            {/* Score Breakdown Bar List */}
            <div className="md:col-span-8 space-y-3">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">Skill Breakdown</h4>
              {data.categories.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-300">{cat.name}</span>
                    <span className="text-white font-bold">{cat.score} <span className="text-xs text-slate-500">/ 100</span></span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-amber-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${
                        cat.score >= 90 ? 'from-amber-400 to-yellow-400' :
                        cat.score >= 80 ? 'from-amber-500 to-orange-400' :
                        'from-orange-500 to-rose-400'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recharts Visualization Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recharts Radar Chart */}
            <div className="lg:col-span-6 p-6 rounded-xl bg-amber-950/20 border border-amber-900/60 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-amber-400" />
                  Competency Radar Map
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">Live Matrix</span>
              </div>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.categories}>
                    <PolarGrid stroke="#451a03" />
                    <PolarAngleAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#78350f" />
                    <Radar name="Candidate" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strengths & Improvements Callout */}
            <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
              {/* Strengths */}
              <div className="p-5 rounded-xl bg-amber-950/40 border border-amber-500/20 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400" /> Key Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {data.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Focus Areas */}
              <div className="p-5 rounded-xl bg-orange-950/20 border border-orange-500/20 space-y-2">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-orange-400" /> Recommended Focus Areas
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {data.improvements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
