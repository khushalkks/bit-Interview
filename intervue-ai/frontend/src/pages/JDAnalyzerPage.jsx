import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode2, Sparkles, ArrowLeft, CheckCircle2, Building2, Briefcase, Zap, Cpu,
  Target, Rocket, ArrowRight, BookOpen, Layers
} from 'lucide-react';
import { jdAPI, interviewAPI } from '../services/api';
import DashboardNavbar from '../components/DashboardNavbar';

const SAMPLE_JDS = [
  {
    title: 'Senior Backend Engineer (Stripe)',
    company: 'Stripe',
    role: 'Senior Backend Engineer',
    jd: `We are looking for a Senior Backend Engineer to join our Core Financial Services team. You will build high-throughput distributed payment processing pipelines using Python, Go, and PostgreSQL. Requirements: 5+ years experience with distributed systems, microservices, Redis caching, Kafka streaming, high availability, and strong SQL query optimization skills. Experience with AWS cloud infrastructure and RESTful API security is required.`
  },
  {
    title: 'Frontend Tech Lead (Vercel)',
    company: 'Vercel',
    role: 'Frontend Tech Lead',
    jd: `As a Frontend Lead at Vercel, you will architect next-generation web platforms using Next.js, React 19, TypeScript, and TailwindCSS. Requirements: Deep understanding of Server Side Rendering (SSR), Static Site Generation (SSG), Web Vitals optimization, state management, complex UI components, and browser rendering engines.`
  },
  {
    title: 'Full Stack Systems Engineer (Linear)',
    company: 'Linear',
    role: 'Full Stack Systems Engineer',
    jd: `Linear is building the future of software development tools. We need a Full Stack Engineer fluent in TypeScript, Node.js, GraphQL, WebSockets, real-time sync algorithms (CRDTs), and React. You will work on real-time multiplayer application state, database indexing, and ultra-fast UI response times under 50ms.`
  }
];

export default function JDAnalyzerPage() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('Stripe');
  const [targetRole, setTargetRole] = useState('Senior Backend Engineer');
  const [jdText, setJdText] = useState(SAMPLE_JDS[0].jd);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [launchingSession, setLaunchingSession] = useState(false);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!jdText.trim()) return;

    setLoading(true);
    try {
      const res = await jdAPI.analyze(jdText, targetRole, companyName);
      setAnalysis(res);
    } catch (err) {
      console.error('Failed to analyze JD:', err);
      alert(err.message || 'Failed to analyze Job Description.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCustomInterview = async () => {
    if (!analysis) return;
    setLaunchingSession(true);
    try {
      const session = await interviewAPI.start(
        analysis.recommended_track || 'technical',
        'Medium',
        `${analysis.company_name} - ${analysis.target_role}`
      );
      navigate(`/interview/${session.session_id}`);
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert(err.message || 'Failed to start customized interview session');
    } finally {
      setLaunchingSession(false);
    }
  };

  const handleSelectSample = (sample) => {
    setCompanyName(sample.company);
    setTargetRole(sample.role);
    setJdText(sample.jd);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans">
      <DashboardNavbar />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JD AI Intelligence v2.0</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0e1629] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4" /> Role Matcher & Custom Track Generator
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Target Job Description AI Analyzer
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Paste any target job description below. Our AI engine extracts required tech stacks, evaluates experience expectations, and generates a personalized mock interview round tailored to that exact job posting!
            </p>
          </div>
        </div>

        {/* Input & Preset Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Input Form */}
          <div className="lg:col-span-2 space-y-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Role Title
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500/60"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Stripe, Vercel, Meta"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500/60"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Paste Job Description Requirements
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  rows={7}
                  placeholder="Paste the full job posting requirements, responsibilities, and required tech stack here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 outline-none focus:border-cyan-500/60 font-mono leading-relaxed resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing Job Description...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Analyze JD & Generate Interview Track</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sample Preset Selector */}
          <div className="space-y-4 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Preset Sample Job Postings</span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any preset to test the AI analyzer on top engineering roles:
              </p>

              <div className="space-y-2.5">
                {SAMPLE_JDS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left transition group"
                  >
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                      {sample.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {sample.company}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
              <strong className="text-slate-200">Pro Tip:</strong> Matching your resume against specific target JDs increases mock interview efficacy by 40%.
            </div>
          </div>
        </div>

        {/* AI Analysis Output Section */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6 bg-gradient-to-br from-[#0f172a] to-[#0b1329] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              {/* Analysis Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                    Analysis Completed
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {analysis.company_name} — {analysis.target_role}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Match Baseline</span>
                    <span className="text-lg font-mono font-extrabold text-cyan-400">{analysis.match_score}%</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Detected Level</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{analysis.experience_level}</span>
                  </div>
                </div>
              </div>

              {/* Extracted Skills & Focus Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Extracted Tech Stack & Skills</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {analysis.extracted_skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-xs font-mono text-cyan-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Key Evaluation Focus Areas</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300 pt-1">
                    {analysis.key_focus_areas.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Generated Custom Questions */}
              <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>Custom AI Interview Questions Generated for this JD</span>
                </h3>
                <div className="space-y-2 pt-1">
                  {analysis.suggested_interview_questions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                <div>
                  <h4 className="text-sm font-bold text-white">Ready for your tailored mock interview?</h4>
                  <p className="text-xs text-slate-400">Launch an adaptive round configured specifically for this {analysis.company_name} position.</p>
                </div>

                <button
                  type="button"
                  onClick={handleStartCustomInterview}
                  disabled={launchingSession}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-xl flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {launchingSession ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Configuring Interview Room...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      <span>Launch JD Interview Track</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
