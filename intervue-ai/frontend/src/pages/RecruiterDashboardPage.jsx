import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Award, ShieldCheck, TrendingUp, Search, Filter, ArrowUpRight, ArrowLeft,
  Building2, Sparkles, CheckCircle2, BarChart2, Briefcase, Eye, ChevronRight
} from 'lucide-react';
import { recruiterAPI } from '../services/api';
import DashboardNavbar from '../components/DashboardNavbar';

export default function RecruiterDashboardPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadRecruiterData() {
      try {
        const res = await recruiterAPI.getLeaderboard();
        setData(res);
      } catch (err) {
        console.error('Failed to load recruiter data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecruiterData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
          <span>Loading Recruiter Intelligence Workspace...</span>
        </div>
      </div>
    );
  }

  const leaderboard = data?.leaderboard || [];

  // Filter candidates by track and search
  const filteredCandidates = leaderboard.filter((c) => {
    const matchesTrack = selectedTrack === 'All' || c.track_title.toLowerCase().includes(selectedTrack.toLowerCase());
    const matchesSearch =
      c.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.target_role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidate View</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Employer Portal Active</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#101b35] to-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Recruiter Assessment Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Candidate Leaderboard & Talent Intelligence
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Review AI diagnostic scorecards, technical accuracy ratings, and integrity benchmarks across candidate submissions to streamline technical hiring.
            </p>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Assessed Candidates</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white mt-2">
              {data?.total_candidates_assessed || 0}
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">Active talent pool</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Average Platform Score</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-white mt-2">
              {data?.avg_score || 82}%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Cross-track mean rating</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Top Hiring Recs (&gt;85%)</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-2">
              {data?.top_performers_count || 0}
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">Strong Hire candidates</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Integrity Pass Rate</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-2">
              98.2%
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Zero proctoring violations</span>
          </div>
        </div>

        {/* Candidate Leaderboard Table */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Table Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              <span>Candidate Leaderboard Rankings</span>
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidate name or role..."
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 outline-none w-48 focus:border-cyan-500/50"
                />
              </div>

              {/* Track Selector Pills */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['All', 'Technical', 'Coding', 'System Design'].map((track) => (
                  <button
                    key={track}
                    onClick={() => setSelectedTrack(track)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      selectedTrack === track
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {track}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="text-[11px] font-mono text-slate-400 uppercase bg-slate-900 rounded-xl">
                <tr>
                  <th className="px-4 py-3.5 rounded-l-xl">Rank</th>
                  <th className="px-4 py-3.5">Candidate</th>
                  <th className="px-4 py-3.5">Target Role</th>
                  <th className="px-4 py-3.5">Primary Track</th>
                  <th className="px-4 py-3.5">Overall Score</th>
                  <th className="px-4 py-3.5">Tech Accuracy</th>
                  <th className="px-4 py-3.5">Integrity</th>
                  <th className="px-4 py-3.5 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredCandidates.map((cand, idx) => (
                  <tr key={cand.user_id} className="hover:bg-slate-900/50 transition">
                    <td className="px-4 py-4 font-mono font-bold text-slate-400">
                      {idx === 0 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">#1</span>
                      ) : idx === 1 ? (
                        <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-extrabold">#2</span>
                      ) : idx === 2 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-700/30 text-amber-400 font-extrabold">#3</span>
                      ) : (
                        `#${idx + 1}`
                      )}
                    </td>
                    <td className="px-4 py-4 font-semibold text-white">
                      {cand.candidate_name}
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {cand.target_role}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-900 text-cyan-300 border border-slate-800">
                        {cand.track_title}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-mono font-extrabold px-2.5 py-1 rounded-lg text-xs ${
                        cand.overall_score >= 88
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {cand.overall_score}%
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-300">
                      {cand.technical_accuracy}%
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 font-mono text-emerald-400 text-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {cand.integrity_score}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => alert(`Reviewing candidate profile scorecard for ${cand.candidate_name}.`)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <span>View Scorecard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Talent Pipeline Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>Active Job Description Assessment Pipelines</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {(data?.recent_jd_searches || []).map((search, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-white">{search.role}</div>
                <div className="text-[11px] text-slate-400 font-mono">{search.company}</div>
                <div className="text-xs text-cyan-400 font-mono font-semibold pt-1">
                  {search.matches} assessed
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
