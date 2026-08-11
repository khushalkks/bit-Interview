import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Upload, FileCode2, Play, Award, Clock, ArrowRight, CheckCircle2, TrendingUp, Calendar, AlertCircle, ChevronRight, BarChart2, BookOpen } from 'lucide-react';
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <DashboardNavbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-900/30 via-slate-900/60 to-slate-900/90 border border-indigo-500/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target: {user?.target_role || 'Full Stack Engineer'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-gradient-accent">{user?.name || 'Candidate'}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Your AI interview readiness is currently at <span className="text-emerald-400 font-bold">86%</span>. Ready for your next mock session?
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
            <button className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all">
              <Play className="w-4 h-4 fill-white" />
              <span>Start New Interview</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metric 1: Readiness Score */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Readiness Score</div>
              <div className="text-2xl font-bold text-white mt-0.5">
                {data?.readiness_score || 86} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +5 pts this week
              </span>
            </div>
          </div>

          {/* Metric 2: Interviews Completed */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Completed Sessions</div>
              <div className="text-2xl font-bold text-white mt-0.5">
                {data?.interviews_completed || 12}
              </div>
              <span className="text-[10px] text-slate-400 font-normal block mt-0.5">Across 4 domains</span>
            </div>
          </div>

          {/* Metric 3: Hours Practiced */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Practice Time</div>
              <div className="text-2xl font-bold text-white mt-0.5">
                {data?.hours_practiced || 8.5} <span className="text-xs text-slate-400 font-normal">hrs</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal block mt-0.5">Live voice + coding</span>
            </div>
          </div>

          {/* Metric 4: Resume Status */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Resume Context</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Parsed & Active
              </div>
              <span className="text-[10px] text-slate-400 font-normal block mt-0.5">Khushal_Resume.pdf</span>
            </div>
          </div>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Start Adaptive Session</h3>
                <p className="text-xs text-slate-400">Technical + Coding + Behavioral</p>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <span>Configure Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-all group flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Upload / Sync Resume</h3>
                <p className="text-xs text-slate-400">Update projects & skill list</p>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <span>Manage Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/40 transition-all group flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                <FileCode2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Analyze Target JD</h3>
                <p className="text-xs text-slate-400">Paste job requirements for AI</p>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <span>Analyze Job Description</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Section: Recent Sessions Table & Recommended Practice */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Recent Interview History (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  Recent Mock Interview Sessions
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Your past AI interview evaluations and scores</p>
              </div>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] font-mono text-slate-400 uppercase bg-slate-800/60 rounded-xl">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Session Title</th>
                    <th className="px-4 py-3">Domain</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3 rounded-r-xl text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data?.recent_sessions.map((sess) => (
                    <tr key={sess.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-white">
                        {sess.title}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                          {sess.domain}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 font-mono">
                        {sess.date}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          sess.score >= 85 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {sess.score} / 100
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                          Report →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Recommended Topics & Practice (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Recommended Focus Topics
              </h2>
              <p className="text-xs text-slate-400">Based on your recent interview evaluation gaps:</p>

              <div className="space-y-2.5 pt-2">
                {data?.recommended_topics.map((topic, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 text-xs text-slate-200 flex items-start gap-2.5 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                    <span>{topic}</span>
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
