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
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide shadow-lg shadow-amber-500/10 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Next-Gen Adaptive AI Interview Platform</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Practice Like <br className="hidden sm:inline" />
            <span className="text-gradient-accent relative inline-block">
              It's Real.
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-amber-500/40"
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
            An adaptive AI interviewer that challenges your thinking, evaluates your communication, and helps you become interview-ready.
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
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Start Free Interview</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-slate-950" />
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-950/40 hover:bg-amber-950/80 text-slate-200 hover:text-white border border-amber-800/80 font-semibold text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-md"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>See How It Works</span>
            </button>
          </motion.div>
        </div>

        {/* Visually Impressive Interview Room Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 max-w-5xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-amber-500/30 via-orange-800/40 to-slate-900/80 shadow-2xl shadow-amber-950/50 backdrop-blur-xl"
        >
          <div className="bg-[#14100c] rounded-xl overflow-hidden border border-amber-900/80 shadow-2xl">
            {/* Top Bar of the Mock Editor / Room */}
            <div className="px-4 py-3 bg-[#1c1611] border-b border-amber-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  intervue-session // Technical - Senior Frontend Engineer
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  LIVE INTERVIEW
                </div>
                <div className="text-xs font-mono text-slate-400 bg-amber-950/80 px-2.5 py-1 rounded-md">
                  00:14:28
                </div>
              </div>
            </div>

            {/* Grid Layout inside Interview Room Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column: AI Avatar & Live Audio Waveform (5 cols) */}
              <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-amber-900/60 bg-[#14100c]/70 flex flex-col justify-between space-y-4">
                {/* AI Interviewer Avatar Card */}
                <div className="relative rounded-xl p-4 bg-amber-950/60 border border-amber-500/20 flex items-center gap-4 shadow-lg">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 p-[2px] animate-audio-pulse">
                      <div className="w-full h-full rounded-full bg-[#1c1611] flex items-center justify-center">
                        <Bot className="w-8 h-8 text-amber-300" />
                      </div>
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#14100c]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">AI Interviewer (Alex)</h4>
                      <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                        Adaptive Mode
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Focus: Data Structures & System Thinking</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-400">
                      <Mic className="w-3.5 h-3.5 animate-pulse" />
                      <span>Speaking...</span>
                    </div>
                  </div>
                </div>

                {/* AI Question Prompt Card */}
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs sm:text-sm text-amber-100 leading-relaxed shadow-inner">
                  <p className="font-semibold text-amber-300 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Current Question
                  </p>
                  "Could you explain your choice of data structure for storing user session caches, and how it handles high concurrent read spikes?"
                </div>

                {/* Real-time Candidate Score Badge Preview */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-900/60 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Live Score</div>
                      <div className="text-base font-bold text-white">88 <span className="text-xs text-slate-400 font-normal">/ 100</span></div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-900/60 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Clarity</div>
                      <div className="text-base font-bold text-amber-400">High (92%)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Code Editor & Transcript (7 cols) */}
              <div className="lg:col-span-7 bg-[#100d0a] flex flex-col justify-between">
                {/* Code Snippet Header */}
                <div className="px-4 py-2 bg-[#1c1611] border-b border-amber-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span>solution.py</span>
                  </div>
                  <span className="text-slate-500">Python 3.11</span>
                </div>

                {/* Code Window */}
                <div className="p-4 font-mono text-xs sm:text-sm text-slate-300 space-y-1 bg-[#14100c]/90 overflow-x-auto leading-relaxed">
                  <div className="text-slate-500"># Optimized Session Cache with LRU Strategy</div>
                  <div><span className="text-amber-400">class</span> <span className="text-amber-200">LRUCache</span>:</div>
                  <div className="pl-4"><span className="text-amber-400">def</span> <span className="text-amber-300">__init__</span>(self, capacity: <span className="text-orange-400">int</span>):</div>
                  <div className="pl-8 text-slate-300">self.capacity = capacity</div>
                  <div className="pl-8 text-slate-300">self.cache = &#123;&#125;  <span className="text-slate-500"># Dict retains insertion order in Python 3.7+</span></div>
                  <div className="pl-4"><span className="text-amber-400">def</span> <span className="text-amber-300">get</span>(self, key: <span className="text-orange-400">str</span>):</div>
                  <div className="pl-8 text-slate-300"><span className="text-amber-400">if</span> key <span className="text-amber-400">not in</span> self.cache:</div>
                  <div className="pl-12 text-slate-300"><span className="text-amber-400">return</span> <span className="text-rose-400">-1</span></div>
                  <div className="pl-8 text-slate-300">self.cache.move_to_end(key)</div>
                  <div className="pl-8 text-slate-300"><span className="text-amber-400">return</span> self.cache[key]</div>
                </div>

                {/* Live Audio Transcript Stream */}
                <div className="p-4 border-t border-amber-900/60 bg-[#1c1611] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Live Speech-to-Text Transcript
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-900/60 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="text-amber-400 font-semibold">Candidate:</span> "I implemented an LRU cache using Python's OrderedDict logic to achieve O(1) time complexity for both get and put operations..."
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
