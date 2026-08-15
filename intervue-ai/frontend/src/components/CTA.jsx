import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function CTA() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-28 bg-[#080c14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-16 bg-[#0f172a]/95 border border-slate-800 shadow-2xl overflow-hidden text-center group hover:border-indigo-500/60 transition-all duration-300">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold tracking-widest uppercase shadow-lg shadow-indigo-500/10">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              ⚡ Instant Access • Bit-Interview Platform
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Ready to Master Technical Rounds with <br />
              <span className="text-gradient-accent">Bit-Interview AI?</span>
            </h2>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-xl mx-auto">
              Practice under realistic interview constraints, get immediate AI evaluation feedback, and double your candidate offer rate.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('interview-types')}
                className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-slate-950 font-black text-base shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2.5 cursor-pointer group hover:scale-[1.02]"
              >
                <span>Launch Your First Bit-Interview</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-slate-950" />
              </button>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Free Practice Sessions
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Monaco Sandbox IDE
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> ML Diagnostic Scorecards
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
