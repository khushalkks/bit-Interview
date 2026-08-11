import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function CTA() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-[#070b13] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/30 shadow-2xl overflow-hidden text-center">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Instant Access • No Credit Card Required
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Your next interview <br className="hidden sm:inline" />
              <span className="text-gradient-accent">starts here.</span>
            </h2>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-xl mx-auto">
              Practice under realistic interview conditions and understand exactly where you need to improve before speaking to real hiring teams.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('interview-types')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Start Your First Interview</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-cyan-200" />
              </button>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Free Trial Available
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Real-time Speech AI
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Score Reports
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
