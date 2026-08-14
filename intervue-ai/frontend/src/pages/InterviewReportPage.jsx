import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, ShieldCheck, CheckCircle2, AlertTriangle,
  ChevronDown, ChevronUp, Code2, Clock, Cpu, BookOpen, Share2, Sparkles, BarChart2
} from 'lucide-react';
import { interviewAPI } from '../services/api';
import DashboardNavbar from '../components/DashboardNavbar';

export default function InterviewReportPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await interviewAPI.getReport(sessionId);
        setReport(data);
      } catch (err) {
        console.error('Failed to load report:', err);
        setError(err.message || 'Report not found or unavailable.');
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [sessionId]);

  const handlePrintPDF = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Scorecard URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-600 font-mono text-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
          <span>Generating AI Post-Interview Evaluation Report...</span>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center font-sans">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Report Unavailable</h2>
        <p className="text-slate-500 max-w-md mb-6">{error || 'Could not fetch interview summary data.'}</p>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition text-sm shadow-md"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const scoreGrade =
    report.overall_score >= 85
      ? { label: 'Outstanding / Strong Hire', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' }
      : report.overall_score >= 70
      ? { label: 'Competent / Hire', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
      : report.overall_score >= 50
      ? { label: 'Developing / Needs Practice', color: 'text-purple-700 bg-purple-50 border-purple-200' }
      : { label: 'Requires Preparation', color: 'text-rose-700 bg-rose-50 border-rose-200' };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans print:bg-white print:text-black">
      {/* Hide navbar on print */}
      <div className="print:hidden">
        <DashboardNavbar />
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-medium transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Candidate Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>Share Scorecard</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>

        {/* Printable Official Header */}
        <div className="hidden print:block border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-black">Bit-Interview AI Evaluation Report</h1>
          <p className="text-sm text-gray-600">Candidate Session ID: {report.session_id} | Completed: {report.completed_at}</p>
        </div>

        {/* Hero Scorecard Overview */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden print:border-gray-300 print:bg-none print:shadow-none"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none print:hidden" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Score Gauge */}
            <div className="flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8 print:border-gray-300">
              <div className="relative flex items-center justify-center w-36 h-36 mb-4">
                {/* SVG Radial Score Indicator */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="10" className="text-slate-100 print:text-gray-200" fill="transparent" />
                  <circle
                    cx="72"
                    cy="72"
                    r="62"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={389}
                    strokeDashoffset={389 - (389 * report.overall_score) / 100}
                    strokeLinecap="round"
                    className="text-indigo-600 print:text-indigo-800 transition-all duration-1000"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold font-mono text-slate-900 print:text-black">{report.overall_score}%</span>
                  <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold print:text-gray-600">Overall Score</span>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${scoreGrade.color} mb-2 print:text-black print:border-gray-400`}>
                {scoreGrade.label}
              </span>

              <p className="text-xs text-slate-500 max-w-xs print:text-gray-700">
                Target Role: <strong className="text-slate-900 print:text-black">{report.target_role}</strong>
              </p>
            </div>

            {/* Middle Details & Meta Stats */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-mono text-indigo-600 font-bold print:text-indigo-800">
                  {report.track_title}
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-1 print:text-black">
                  AI Candidate Diagnostic Report
                </h1>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed print:text-gray-800">
                  {report.overall_feedback}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 print:border-gray-300 print:bg-gray-50">
                  <span className="text-[11px] text-slate-500 block print:text-gray-600">Duration</span>
                  <div className="flex items-center gap-1.5 mt-1 font-mono font-semibold text-slate-800 print:text-black text-sm">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>{report.duration}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 print:border-gray-300 print:bg-gray-50">
                  <span className="text-[11px] text-slate-500 block print:text-gray-600">Questions</span>
                  <div className="flex items-center gap-1.5 mt-1 font-mono font-semibold text-slate-800 print:text-black text-sm">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    <span>{report.total_questions} Rounds</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 print:border-gray-300 print:bg-gray-50">
                  <span className="text-[11px] text-slate-500 block print:text-gray-600">Integrity Rating</span>
                  <div className="flex items-center gap-1.5 mt-1 font-mono font-semibold text-emerald-600 print:text-emerald-800 text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{report.integrity_score}%</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 print:border-gray-300 print:bg-gray-50">
                  <span className="text-[11px] text-slate-500 block print:text-gray-600">Date</span>
                  <div className="flex items-center gap-1.5 mt-1 font-mono font-semibold text-slate-800 print:text-black text-xs">
                    <span>{report.completed_at.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Multi-Category Skill Metrics Bar Breakdown */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 print:border-gray-300 print:bg-none">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 print:text-black">
            <BarChart2 className="w-5 h-5 text-indigo-600 print:text-indigo-800" />
            <span>Category Performance Breakdown</span>
          </h2>

          <div className="space-y-4">
            {Object.entries(report.category_scores || {}).map(([cat, val]) => (
              <div key={cat} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700 print:text-gray-800">{cat}</span>
                  <span className="font-mono text-indigo-600 font-bold print:text-indigo-800">{val}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200 print:bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${
                      val >= 80 ? 'bg-indigo-600' : val >= 65 ? 'bg-violet-600' : 'bg-purple-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 print:border-gray-300 print:bg-none">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 print:text-black">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Key Technical Strengths</span>
            </h3>
            <ul className="space-y-2.5">
              {report.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 print:text-gray-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 print:border-gray-300 print:bg-none">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 print:text-black">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Areas for Improvement</span>
            </h3>
            <ul className="space-y-2.5">
              {report.areas_for_improvement.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 print:text-gray-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question-by-Question Deep Dive Accordion */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 print:border-gray-300 print:bg-none">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 print:text-black">
            <Cpu className="w-5 h-5 text-indigo-600 print:text-indigo-800" />
            <span>Question-by-Question Diagnostic Deep Dive</span>
          </h2>

          <div className="space-y-4">
            {report.question_analysis.map((qItem, idx) => {
              const isOpen = expandedQuestion === idx || window.matchMedia('print').matches;
              return (
                <div
                  key={qItem.id}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden print:border-gray-300 print:bg-white"
                >
                  <button
                    onClick={() => setExpandedQuestion(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 transition print:pointer-events-none cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        Q{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 line-clamp-1 print:text-black">
                          {qItem.question}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 font-mono">Score: {qItem.score}%</span>
                          {qItem.time_complexity !== 'N/A' && (
                            <span className="text-[10px] bg-white text-indigo-700 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                              {qItem.time_complexity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="print:hidden">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-4 border-t border-slate-200/80 space-y-4 print:border-gray-300 text-xs"
                      >
                        {/* Question Full */}
                        <div>
                          <span className="text-slate-500 font-mono block mb-1 font-semibold">Interviewer Prompt:</span>
                          <p className="text-slate-800 bg-white p-3 rounded-xl border border-slate-200 print:bg-gray-100 print:text-black">
                            {qItem.question}
                          </p>
                        </div>

                        {/* Candidate Answer */}
                        <div>
                          <span className="text-slate-500 font-mono block mb-1 font-semibold">Your Submission:</span>
                          <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200 print:bg-gray-50 print:text-gray-900">
                            {qItem.candidate_answer}
                          </p>

                          {qItem.code_snippet && (
                            <div className="mt-2 bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[11px] overflow-x-auto text-emerald-400 print:bg-gray-900 print:text-emerald-400">
                              <pre>{qItem.code_snippet}</pre>
                            </div>
                          )}
                        </div>

                        {/* AI Evaluation */}
                        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 space-y-2 print:bg-amber-50 print:border-amber-200">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-indigo-900 print:text-amber-700">AI Diagnostic Evaluation:</span>
                            <span className="font-mono text-indigo-700 font-bold">{qItem.score}%</span>
                          </div>
                          <p className="text-slate-700 print:text-gray-800">{qItem.feedback}</p>
                          <div className="pt-2 border-t border-indigo-100 text-slate-600 print:text-gray-700">
                            <strong className="text-indigo-900 print:text-black">Ideal Model Response Strategy:</strong> {qItem.ideal_answer}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Learning Plan & Anti-Cheat Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Roadmap */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 print:border-gray-300 print:bg-none">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 print:text-black">
              <BookOpen className="w-5 h-5 text-indigo-600 print:text-indigo-800" />
              <span>Recommended Technical Study Roadmap</span>
            </h3>

            <div className="space-y-3">
              {report.actionable_recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl print:border-gray-300 print:bg-gray-50">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-slate-700 font-medium print:text-gray-800">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Integrity & Proctoring Box */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xl shadow-slate-200/50 print:border-gray-300 print:bg-none">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 print:text-black">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Proctoring & Anti-Cheat Audit</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 print:bg-gray-100">
                <span className="text-xs text-slate-500 print:text-gray-700 font-semibold">Integrity Score:</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">{report.integrity_score}%</span>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs text-slate-500 font-mono block">Audit Logs:</span>
                {report.proctoring_flags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 print:bg-gray-50 print:text-gray-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span className="font-medium">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Retake / Next Steps CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white rounded-3xl p-6 shadow-xl shadow-indigo-500/15 print:hidden">
          <div>
            <h4 className="text-base font-bold text-white">Ready to level up your score?</h4>
            <p className="text-xs text-indigo-100 mt-1">Take another adaptive interview round in System Design, Algorithms, or Technical Deep-Dive.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-indigo-600 font-bold rounded-xl text-sm shadow-md transition cursor-pointer"
            >
              Start Next Round
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
