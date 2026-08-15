import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Mic, Code2, Sparkles, BarChart3, ShieldCheck, FileText,
  Cpu, Zap, CheckCircle2, ArrowUpRight, Activity, Layers, Terminal
} from 'lucide-react';

export default function Features() {
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', label: '⚡ All Capabilities' },
    { id: 'ai', label: '🧠 LangGraph Agent' },
    { id: 'ide', label: '💻 Monaco IDE & Sandbox' },
    { id: 'ats', label: '📄 ATS & Analytics' }
  ];

  return (
    <section id="features" className="py-28 bg-[#080c14] relative overflow-hidden">
      {/* Glow Ambient background lighting */}
      <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-14">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase bg-indigo-500/15 border border-indigo-500/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-lg shadow-indigo-500/10">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Next-Gen Technical Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Engineered for Realistic <br />
            <span className="text-gradient-accent">Interview Superiority</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Stateful multi-agent workflows, real-time voice synthesis, sandboxed Monaco execution, and ML diagnostic scorecards.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 text-slate-950 shadow-lg shadow-indigo-500/25 scale-105'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Card 1: Featured Hero Card (Span 8 Cols) — Adaptive LangGraph Agent */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-12 lg:col-span-8 rounded-3xl bg-[#0f172a]/90 border border-slate-800 p-8 shadow-2xl relative overflow-hidden group hover:border-indigo-500/60 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[2px] shadow-xl shrink-0">
                  <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center">
                    <Brain className="w-7 h-7 text-cyan-300 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-indigo-300 uppercase tracking-widest font-bold">LangGraph Core DAG</span>
                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    Stateful Adaptive AI Interviewer
                  </h3>
                </div>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live State Machine Active
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-2xl font-normal">
              Unlike static Q&A bots, our LangGraph agent maintains stateful context across interview rounds. It evaluates response depth, interrupts rambling or hand-waving answers, and scales difficulty automatically.
            </p>

            {/* Embedded Live Agent Decision Tree Simulator Mockup */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0f19] border border-slate-800 font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
                <span className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> LangGraph Decision State Node
                </span>
                <span>Latency: ~120ms</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-indigo-400 font-bold uppercase">Node 1: Evaluator</div>
                  <div className="text-white font-bold mt-1">Accuracy: 94.2%</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Depth threshold passed</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Node 2: Interruption Check</div>
                  <div className="text-white font-bold mt-1">Silence: 0s | Words: 84</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Optimal brevity</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">Node 3: Router Signal</div>
                  <div className="text-emerald-400 font-bold mt-1">INCREASE_DIFFICULTY</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Escalate to Hard Round</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Voice & Speech Engine (Span 4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-6 lg:col-span-4 rounded-3xl bg-[#0f172a]/90 border border-slate-800 p-7 shadow-2xl hover:border-indigo-500/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-[2px]">
                  <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                    <Mic className="w-6 h-6 text-indigo-300 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-2.5 py-1 rounded-md border border-indigo-500/30 font-bold">
                  Web Speech API
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Real-Time Voice Narration
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Natural AI voice narration with Speech-to-Text transcript recorder and customizable playback speed selector (0.85x - 1.5x).
              </p>
            </div>

            {/* Audio Wave Visualizer Simulation */}
            <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800 flex items-center gap-1.5 justify-center h-14">
              {[40, 75, 30, 90, 60, 100, 45, 80, 50, 85, 35, 70, 95, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </motion.div>

          {/* Card 3: Monaco Code Editor & Judge0 Sandbox (Span 4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="md:col-span-6 lg:col-span-4 rounded-3xl bg-[#0f172a]/90 border border-slate-800 p-7 shadow-2xl hover:border-indigo-500/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-500 to-cyan-400 p-[2px]">
                  <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-cyan-300 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-2.5 py-1 rounded-md border border-cyan-500/30 font-bold">
                  Judge0 Engine
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Monaco Sandbox & Judge0
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                In-browser VS-Code powered Monaco editor supporting Python, JavaScript, C++, and Java with isolated test runner execution.
              </p>
            </div>

            {/* Code Snippet Box */}
            <div className="p-3 rounded-xl bg-[#0b0f19] border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5 text-[10px]">
                <Terminal className="w-3 h-3 text-cyan-400" /> LRUCache.py — 4/4 Passed
              </div>
              <div className="text-emerald-400 font-semibold">✓ exec_time: 14.8 ms</div>
            </div>
          </motion.div>

          {/* Card 4: ATS Resume Matcher (Span 4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-6 lg:col-span-4 rounded-3xl bg-[#0f172a]/90 border border-slate-800 p-7 shadow-2xl hover:border-indigo-500/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 p-[2px]">
                  <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-cyan-300 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-2.5 py-1 rounded-md border border-cyan-500/30 font-bold">
                  PyMuPDF Parser
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                ATS Resume-to-JD Matcher
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Calculates TF-IDF vector cosine similarity between candidate resumes and target job descriptions to generate resume bullets.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400 font-medium">Target Role Match:</span>
              <span className="text-cyan-300 font-black">92.7% Cosine Sim</span>
            </div>
          </motion.div>

          {/* Card 5: AI Anti-Cheat Proctoring (Span 4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="md:col-span-6 lg:col-span-4 rounded-3xl bg-[#0f172a]/90 border border-slate-800 p-7 shadow-2xl hover:border-indigo-500/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 p-[2px]">
                  <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-md border border-emerald-500/30 font-bold">
                  Integrity Guard
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                AI Anti-Cheat & Proctoring
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Monitors window focus loss, tab switching, and webcam posture with real-time Session Integrity Score auditing.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400 font-medium">Session Integrity:</span>
              <span className="text-emerald-400 font-black">100% Verified</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

