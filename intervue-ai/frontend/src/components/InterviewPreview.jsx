import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Mic, Play, Pause, RefreshCw, Volume2, Code, Terminal, Sparkles, AlertCircle } from 'lucide-react';

export default function InterviewPreview() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="py-24 bg-[#070b13] border-t border-slate-800/60 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            Product Experience
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Interactive <span className="text-gradient-accent">AI Interview Preview</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Experience the actual conversational flow, live transcript stream, and adaptive questioning engine.
          </p>
        </div>

        {/* Dashboard Room Interface Container */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#090e1a] border border-slate-800 shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="px-6 py-4 bg-[#0c1222] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">Live AI Interview Session</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Role: Senior Backend Engineer
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isPlaying ? 'Pause Simulation' : 'Resume Simulation'}</span>
              </button>
            </div>
          </div>

          {/* Conversation Transcript Body */}
          <div className="p-6 md:p-8 space-y-6 bg-[#080c16]/90 font-sans">
            {/* Turn 1: AI Question */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-none p-4 bg-slate-900/90 border border-indigo-500/20 shadow-md">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-indigo-400">AI Interviewer</span>
                  <span className="text-[10px] font-mono text-slate-500">10:42 AM</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                  "Can you explain why you chose this approach?"
                </p>
              </div>
            </motion.div>

            {/* Turn 2: Candidate Answer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start gap-4 flex-row-reverse"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 rounded-2xl rounded-tr-none p-4 bg-indigo-950/40 border border-cyan-500/20 shadow-md">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-500">10:43 AM</span>
                  <span className="text-xs font-bold text-cyan-300">Candidate (You)</span>
                </div>
                <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  "I used a hashmap because it provides constant time average case lookup, O(1), for key verification instead of scanning an array in O(N)."
                </p>
              </div>
            </motion.div>

            {/* Turn 3: AI Follow-up */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-none p-4 bg-slate-900/90 border border-indigo-500/20 shadow-md">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-indigo-400">AI Interviewer</span>
                  <span className="text-[10px] font-mono text-slate-500">10:43 AM</span>
                </div>
                <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                  "Good. What is the time complexity of your solution, and what happens in the worst-case hash collision scenario?"
                </p>
              </div>
            </motion.div>

            {/* Active Listening Indicator */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block animate-ping absolute" />
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 tracking-wide uppercase">
                  <Mic className="w-4 h-4 animate-pulse" />
                  Listening...
                </div>
              </div>

              {/* Audio visualizer bars simulation */}
              <div className="flex items-center gap-1">
                <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-7 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1 h-8 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                <span className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
