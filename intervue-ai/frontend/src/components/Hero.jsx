import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Play, Sparkles, Code2, MessageSquare, Award, Mic, CheckCircle2, ChevronRight, Terminal } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern bg-[#080c14]">
      {/* Background ambient light glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-indigo-600/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold tracking-widest uppercase shadow-xl shadow-indigo-500/15 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>⚡ BIT-INTERVIEW — AI TECHNICAL INTERVIEW PLATFORM</span>
          </motion.div>

          {/* Main Headline with Prominent Central Bit-Interview Branding */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]"
          >
            Master Technical Rounds with <br />
            <span className="text-gradient-accent relative inline-block">
              Bit-Interview AI
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-cyan-400/50"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Practice real-time adaptive voice interviews, Monaco IDE code execution, and ATS resume matching. Built to make you interview-ready.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => scrollToSection('interview-types')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-slate-950 font-black text-base shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2.5 cursor-pointer group hover:scale-[1.02]"
            >
              <span>Launch Bit-Interview Session</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-slate-950" />
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-base shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-md"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>Watch AI Workflow</span>
            </button>
          </motion.div>
        </div>

        {/* Visually Impressive Obsidian Glass Interview Room Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 max-w-5xl mx-auto rounded-3xl p-1.5 bg-gradient-to-b from-indigo-500/30 via-violet-500/20 to-slate-900/80 shadow-2xl shadow-indigo-950/80 backdrop-blur-xl"
        >
          <div className="bg-[#0b0f19] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Top Bar of the Mock Editor / Room */}
            <div className="px-5 py-3.5 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-3 text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  bit-interview // Technical - Senior Full Stack Engineer
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  LIVE ADAPTIVE ROOM
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md font-bold">
                  00:14:28
                </div>
              </div>
            </div>

            {/* Grid Layout inside Interview Room Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column: AI Avatar & Live Audio Waveform (5 cols) */}
              <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#0b0f19]/80 flex flex-col justify-between space-y-4">
                {/* AI Interviewer Avatar Card */}
                <div className="relative rounded-2xl p-4 bg-slate-900/90 border border-slate-800 flex items-center gap-4 shadow-lg">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[2px] animate-audio-pulse">
                      <div className="w-full h-full rounded-full bg-[#0b0f19] flex items-center justify-center">
                        <Bot className="w-8 h-8 text-cyan-300" />
                      </div>
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0b0f19]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">AI Interviewer (Alex)</h4>
                      <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30">
                        LangGraph Agent
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-normal">Focus: System Design & Algorithms</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-cyan-400">
                      <Mic className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                      <span>Speaking Question...</span>
                    </div>
                  </div>
                </div>

                {/* AI Question Prompt Card */}
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs sm:text-sm text-indigo-100 leading-relaxed shadow-inner">
                  <p className="font-bold text-cyan-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Current Challenge
                  </p>
                  "Could you explain how asynchronous non-blocking event loops handle high concurrency in Node.js, and how event loop starvation can be prevented in production?"
                </div>

                {/* Real-time Candidate Score Badge Preview */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Live Score</div>
                      <div className="text-base font-black text-white">88 <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Clarity</div>
                      <div className="text-base font-black text-emerald-400">High (92%)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Code Editor & Transcript (7 cols) */}
              <div className="lg:col-span-7 bg-[#070a11] flex flex-col justify-between text-slate-200">
                {/* Code Snippet Header */}
                <div className="px-4 py-2.5 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>lru_cache.py</span>
                  </div>
                  <span className="text-cyan-400 font-bold">Monaco Sandbox IDE</span>
                </div>

                {/* Code Window */}
                <div className="p-5 font-mono text-xs sm:text-sm text-slate-300 space-y-1 bg-[#0b0f19] overflow-x-auto leading-relaxed">
                  <div className="text-slate-500"># O(1) Time Complexity Session Cache Solution</div>
                  <div><span className="text-indigo-400">class</span> <span className="text-cyan-300">LRUCache</span>:</div>
                  <div className="pl-4"><span className="text-indigo-400">def</span> <span className="text-cyan-300">__init__</span>(self, capacity: <span className="text-orange-400">int</span>):</div>
                  <div className="pl-8 text-slate-300">self.capacity = capacity</div>
                  <div className="pl-8 text-slate-300">self.cache = &#123;&#125;  <span className="text-slate-500"># Hash Map + Doubly Linked List</span></div>
                  <div className="pl-4"><span className="text-indigo-400">def</span> <span className="text-cyan-300">get</span>(self, key: <span className="text-orange-400">str</span>):</div>
                  <div className="pl-8 text-slate-300"><span className="text-indigo-400">if</span> key <span className="text-indigo-400">not in</span> self.cache:</div>
                  <div className="pl-12 text-slate-300"><span className="text-indigo-400">return</span> <span className="text-rose-400">-1</span></div>
                  <div className="pl-8 text-slate-300">self.cache.move_to_end(key)</div>
                  <div className="pl-8 text-slate-300"><span className="text-indigo-400">return</span> self.cache[key]</div>
                </div>

                {/* Live Audio Transcript Stream */}
                <div className="p-4 border-t border-slate-800 bg-[#0d1322] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Speech Transcript
                  </div>
                  <div className="p-3 rounded-xl bg-[#070a11] border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="text-cyan-400 font-bold">Candidate:</span> "I implemented an LRU cache using Python's OrderedDict logic to achieve O(1) time complexity for both get and put operations under heavy concurrent loads..."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
