import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode2, Sparkles, ArrowLeft, CheckCircle2, Building2, Briefcase, Zap, Cpu,
  Target, Rocket, ArrowRight, BookOpen, Layers, ShieldCheck, AlertCircle, Copy,
  Check, FileText, BarChart2, Lightbulb, Compass
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
  const [activeTab, setActiveTab] = useState('gap'); // 'gap' | 'ats' | 'prep'
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [launchingSession, setLaunchingSession] = useState(false);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!jdText.trim()) return;

    setLoading(true);
    try {
      const res = await jdAPI.analyze(jdText, targetRole, companyName);
      setAnalysis(res);
      setActiveTab('gap');
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
        `${analysis.company_name} — ${analysis.target_role}`
      );
      navigate(`/interview/${session.session_id}`);
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert(err.message || 'Failed to start customized interview session');
    } finally {
      setLaunchingSession(false);
    }
  };

  const handleCopyBullet = (text, idx) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
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
            <span>Back to Candidate Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATS Resume & JD Intelligence Engine v2.5</span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0e1629] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Resume-to-JD Matcher & ATS Optimizer
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Job Description ATS & Skill Gap Analyzer
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Compare your resume against any target tech Job Description. Identify critical skill gaps, generate ATS-optimized resume bullets, and launch a tailored mock interview round!
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
                    Target Company Name
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
                  Paste Job Posting Requirements
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  rows={7}
                  placeholder="Paste full job posting requirements, responsibilities, and required tech stack here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 outline-none focus:border-cyan-500/60 font-mono leading-relaxed resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Performing Resume vs. JD ATS Analysis...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Run ATS Gap Analysis & Interview Prep</span>
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
                <span>Preset Company Job Descriptions</span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any preset to test the ATS Gap Analysis engine on top companies:
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
              <strong className="text-slate-200">Pro Tip:</strong> Resolving critical skill gaps before real interview calls increases candidate offer rates by 3.2x.
            </div>
          </div>
        </div>

        {/* AI Analysis Command Center */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6 bg-gradient-to-br from-[#0f172a] to-[#0b1329] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              {/* Analysis Hero Header */}
              <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                      Target Analysis Complete
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {analysis.experience_level}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {analysis.company_name} — {analysis.target_role}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    {analysis.company_culture_notes}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* ATS Match Gauge */}
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-14 h-14">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeDasharray={138}
                          strokeDashoffset={138 - (138 * analysis.resume_match_score) / 100}
                          strokeLinecap="round"
                          className="text-cyan-400 transition-all duration-1000"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute font-mono text-xs font-extrabold text-white">
                        {analysis.resume_match_score}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">ATS Resume Match</span>
                      <span className="text-xs font-bold text-cyan-400">
                        {analysis.resume_match_score >= 80 ? 'Strong ATS Match' : 'Gap Action Required'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Tab Command Center Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <button
                  onClick={() => setActiveTab('gap')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'gap'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>Resume vs. JD Gap Analysis</span>
                </button>

                <button
                  onClick={() => setActiveTab('ats')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'ats'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>ATS Resume Optimizer</span>
                </button>

                <button
                  onClick={() => setActiveTab('prep')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'prep'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Tailored Interview Prep & Questions</span>
                </button>
              </div>

              {/* TAB 1: RESUME vs. JD GAP ANALYSIS */}
              {activeTab === 'gap' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matching Skills */}
                    <div className="bg-slate-950/80 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Matching Skills (Already in Your Resume)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Skills detected in both your resume and this target Job Description:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {analysis.matching_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Critical Skill Gaps */}
                    <div className="bg-slate-950/80 border border-rose-500/20 rounded-2xl p-5 space-y-3">
                      <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Critical Skill Gaps (Required by JD)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Key requirements in this JD that are missing from your profile:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {analysis.missing_skills.length > 0 ? (
                          analysis.missing_skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300"
                            >
                              ! {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs font-mono text-emerald-400">
                            Zero skill gaps detected! Your resume covers 100% of required tech.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Key Focus Areas */}
                  <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Role Alignment Strategy</span>
                    </h3>
                    <div className="space-y-2 text-xs text-slate-300">
                      {analysis.key_focus_areas.map((area, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-800/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ATS RESUME OPTIMIZER */}
              {activeTab === 'ats' && (
                <div className="space-y-6">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>ATS Resume Bullet Point Recommendations</span>
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">Copy & Add to Your Resume</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Copy these ATS-optimized accomplishment bullets into your resume to pass applicant tracking filters for {analysis.company_name}:
                    </p>

                    <div className="space-y-3">
                      {analysis.ats_recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 group hover:border-cyan-500/40 transition"
                        >
                          <div className="text-xs font-mono text-slate-200 leading-relaxed">
                            "{rec}"
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyBullet(rec, idx)}
                            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition shrink-0 cursor-pointer"
                            title="Copy Bullet Point"
                          >
                            {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TAILORED INTERVIEW PREP & QUESTIONS */}
              {activeTab === 'prep' && (
                <div className="space-y-6">
                  {/* 7-Day Roadmap */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>7-Day Technical Study Roadmap</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {analysis.prep_study_plan.map((step, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-3">
                          <span className="w-5 h-5 rounded-md bg-cyan-500/10 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company Tailored Questions */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      <span>Company Tailored Interview Questions Generated for this JD</span>
                    </h3>
                    <div className="space-y-3">
                      {analysis.suggested_interview_questions.map((q, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            Q{idx + 1}
                          </span>
                          <span className="leading-relaxed">{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Launch CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                <div>
                  <h4 className="text-sm font-bold text-white">Ready to test your readiness in real time?</h4>
                  <p className="text-xs text-slate-400">Launch an adaptive mock round combining your resume skills and this target JD requirements.</p>
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
                      <span>Launch Dual-Context JD Interview Track</span>
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
