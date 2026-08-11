import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Upload, FileCode2, Play, Award, Clock, ArrowRight, CheckCircle2, TrendingUp, Calendar, AlertCircle, ChevronRight, BarChart2, BookOpen, Cpu, Target, Zap, Shield, Filter, Search } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuth } from '../hooks/useAuth';
import { dashboardAPI } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await dashboardAPI.getSummary();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col w-full">
      <DashboardNavbar />

      {/* Full-width container */}
      <main className="flex-grow w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        
        {/* Widescreen Welcome Banner */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-950/50 via-slate-900/80 to-slate-900/95 border border-indigo-500/25 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="space-y-3 relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Target Role: {user?.target_role || 'Full Stack Engineer'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
              Welcome back, <span className="text-gradient-accent">{user?.name || 'Candidate'}</span> 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Your overall AI interview readiness is currently at <span className="text-emerald-400 font-bold text-lg">86%</span>. You have completed 12 practice rounds this month across Technical, Coding, and System Design.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto relative z-10 pt-2 xl:pt-0">
            <button className="flex-1 xl:flex-initial px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-sm sm:text-base shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.02]">
              <Play className="w-5 h-5 fill-white" />
              <span>Start Adaptive Interview</span>
            </button>
            <button className="px-5 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Update Resume</span>
            </button>
          </div>
        </div>

        {/* Widescreen 4-Stat Metric Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-indigo-500/40 transition-all flex items-center gap-5 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Readiness Score</div>
              <div className="text-3xl font-black text-white mt-1">
                {data?.readiness_score || 86} <span className="text-sm text-slate-500 font-normal">/ 100</span>
              </div>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +5% this week
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/40 transition-all flex items-center gap-5 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Completed Sessions</div>
              <div className="text-3xl font-black text-white mt-1">
                {data?.interviews_completed || 12}
              </div>
              <span className="text-xs text-slate-400 font-normal block mt-1">Across 4 interview tracks</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-purple-500/40 transition-all flex items-center gap-5 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Practice Time</div>
              <div className="text-3xl font-black text-white mt-1">
                {data?.hours_practiced || 8.5} <span className="text-sm text-slate-500 font-normal">hrs</span>
              </div>
              <span className="text-xs text-slate-400 font-normal block mt-1">Live audio + coding</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-emerald-500/40 transition-all flex items-center gap-5 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Resume Sync</div>
              <div className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Parsed & Active
              </div>
              <span className="text-xs text-slate-400 font-mono truncate block mt-1">Khushal_Resume.pdf</span>
            </div>
          </div>
        </div>

        {/* Widescreen Main 3-Column Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Column 1: Recent Interview History (8 cols in XL) */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Recent Sessions List Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    Mock Session Evaluation History
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Detailed breakdown of your recent AI interview rounds</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter sessions..."
                      className="bg-[#080c16] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 outline-none w-36 sm:w-48"
                    />
                  </div>
                </div>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="text-[11px] font-mono text-slate-400 uppercase bg-slate-800/60 rounded-xl">
                    <tr>
                      <th className="px-4 py-3.5 rounded-l-xl">Session Title</th>
                      <th className="px-4 py-3.5">Domain</th>
                      <th className="px-4 py-3.5">Date</th>
                      <th className="px-4 py-3.5">Duration</th>
                      <th className="px-4 py-3.5">Score</th>
                      <th className="px-4 py-3.5 rounded-r-xl text-right">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data?.recent_sessions.map((sess) => (
                      <tr key={sess.id} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="px-4 py-4 font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {sess.title}
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
                            {sess.domain}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-400 font-mono text-xs">
                          {sess.date}
                        </td>
                        <td className="px-4 py-4 text-slate-400 text-xs">
                          {sess.duration}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`font-bold px-2.5 py-1 rounded-lg text-xs ${
                            sess.score >= 85 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {sess.score} / 100
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button className="text-xs text-indigo-400 hover:text-cyan-300 font-semibold flex items-center gap-1 ml-auto">
                            <span>View Full Report</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Action Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card A */}
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">Adaptive Follow-Up Engine</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    AI probes deeper into your code choices and architecture trade-offs based on live speech clarity.
                  </p>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 pt-1 cursor-pointer">
                    <span>Learn How Engine Works →</span>
                  </button>
                </div>
              </div>

              {/* Card B */}
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <FileCode2 className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">Job Description Matching</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Paste any target software engineering job description to generate role-tailored interview prompts.
                  </p>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 pt-1 cursor-pointer">
                    <span>Analyze Target JD →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Skill Matrix & Recommended Focus (4 cols in XL) */}
          <div className="xl:col-span-4 space-y-8">
            
            {/* Skill Matrix Breakdown Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-400" />
                  Skill Competency Breakdown
                </h2>
                <span className="text-[11px] font-mono text-slate-400">Live Matrix</span>
              </div>

              <div className="space-y-4">
                {data?.skills.map((skill, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{skill.category}</span>
                      <span className="text-white font-mono">{skill.score} / 100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          skill.score >= 88 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                          skill.score >= 80 ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' :
                          'bg-gradient-to-r from-amber-500 to-orange-400'
                        }`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Study Focus Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  Recommended Study Plan
                </h2>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">7-Day Plan</span>
              </div>

              <div className="space-y-3 pt-1">
                {data?.recommended_topics.map((topic, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 text-xs text-slate-200 flex items-start gap-3 transition-all hover:bg-slate-800/50">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
