import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Play, Sparkles, Award, Mic, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-36 pb-24 md:pt-48 md:pb-36 overflow-hidden bg-transparent">
      {/* Background ambient light glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[750px] bg-sky-500/10 rounded-full blur-[200px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[650px] h-[650px] bg-sky-600/8 rounded-full blur-[180px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Stacked Layout */}
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800/80 text-sky-400 text-xs font-mono tracking-wider font-semibold shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Gen Technical Simulator</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]"
          >
            Master Technical Rounds with <br />
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Bit-Interview AI
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Practice real-time voice sessions with adaptive LangGraph AI agents, write live code in Monaco IDE, and track job match accuracy instantly.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full"
          >
            <button
              onClick={() => scrollToSection('interview-types')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-[0_8px_30px_rgb(14,165,233,0.25)] hover:shadow-[0_8px_30px_rgb(14,165,233,0.45)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Launch Interview Room</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>Watch Workflow</span>
            </button>
          </motion.div>
        </div>

        {/* Large Centered 3D Preview Container (Spans full page width up to max-w-5xl) */}
        <div className="mt-20 flex justify-center relative px-6 sm:px-0 z-10" style={{ perspective: 1400 }}>
          {/* Ambient Synapse Backlight Glow */}
          <div className="absolute inset-16 bg-gradient-to-tr from-sky-500/12 via-cyan-500/12 to-blue-600/12 rounded-full blur-[110px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateX: 8, rotateY: -10, z: -30 }}
            animate={{ 
              y: [0, -8, 0],
              rotateX: 8,
              rotateY: -10,
              z: -30,
              opacity: 1,
              scale: 1
            }}
            whileHover={{
              scale: 1.04,
              rotateX: 0,
              rotateY: 0,
              z: 40,
              y: -20,
              transition: { duration: 0.45, ease: "easeOut" }
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.4 },
              scale: { duration: 0.8, delay: 0.4 },
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
              rotateX: { duration: 0.4, ease: "easeOut" },
              rotateY: { duration: 0.4, ease: "easeOut" },
              z: { duration: 0.4, ease: "easeOut" }
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative max-w-5xl w-full rounded-3xl p-1.5 bg-gradient-to-b from-sky-500/40 via-cyan-500/25 to-slate-900/90 shadow-[0_0_80px_rgba(14,165,233,0.28)] hover:shadow-[0_0_100px_rgba(14,165,233,0.45)] border border-sky-500/10 hover:border-cyan-400/30 transition-all duration-300 overflow-visible z-10"
          >
            
            {/* Floating Live Metric Card */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ translateZ: 50, transformStyle: "preserve-3d" }}
              className="absolute -bottom-6 -left-8 p-3.5 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-md flex items-center gap-3.5 z-20 select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Award className="w-5.5 h-5.5 text-cyan-400" />
              </div>
              <div className="text-left">
                <div className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">Evaluation Score</div>
                <div className="text-sm font-black text-white">92% <span className="text-[10px] font-normal text-slate-500">Match</span></div>
              </div>
            </motion.div>

            {/* Floating Live Agent Status Card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              style={{ translateZ: 75, transformStyle: "preserve-3d" }}
              className="absolute -top-6 -right-4 p-2.5 px-4 rounded-xl bg-slate-950/95 border border-slate-855 shadow-2xl backdrop-blur-md flex items-center gap-2 z-20 font-mono text-[9px] select-none"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-slate-300 font-bold uppercase tracking-widest">LangGraph: Active</span>
            </motion.div>

            <div className="bg-[#0b0f19] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative z-10">
              {/* Browser top-bar */}
              <div className="px-5 py-3.5 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="ml-2 font-semibold text-slate-300">bit-interview // Live Simulation Screen</span>
                </div>
                <span className="text-cyan-400 font-bold tracking-widest">PLATFORM ACTIVE</span>
              </div>

              {/* 3D Cartoon Interview Scene Illustration */}
              <div className="relative group overflow-hidden aspect-[16/9] w-full">
                <img 
                  src="/cartoon_interview_scene.jpg" 
                  alt="AI Robot and Candidate Interview Session Simulation"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle glassmorphic HUD overlays on the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-300">
                  <span className="flex items-center gap-2 text-cyan-400 font-bold">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    LangGraph DAG Active
                  </span>
                  <span>Assessors Connected</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
