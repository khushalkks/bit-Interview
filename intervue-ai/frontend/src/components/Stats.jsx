import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, GitBranch, Terminal, ShieldCheck, Award } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: Cpu,
      value: "50,000+",
      label: "AI Interview Rounds",
      description: "Conducted across Frontend, Backend, System Design, & Behavioral tracks.",
      badge: "Scale"
    },
    {
      icon: Zap,
      value: "< 150ms",
      label: "Speech Synthesis Latency",
      description: "Low-latency streaming voice response with live transcript recording.",
      badge: "Real-Time"
    },
    {
      icon: GitBranch,
      value: "98.4%",
      label: "Adaptive Precision",
      description: "LangGraph state machine difficulty adjustment tailored to candidate depth.",
      badge: "LangGraph"
    },
    {
      icon: Terminal,
      value: "O(1) Judge0",
      label: "Monaco Execution",
      description: "In-browser sandboxed code execution with automated test case validation.",
      badge: "Sandbox IDE"
    }
  ];

  return (
    <section className="py-20 bg-[#090d16] border-y border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 sm:p-7 rounded-3xl bg-[#0f172a]/90 border border-slate-800 hover:border-indigo-500/60 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/15 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1px] shadow-lg group-hover:scale-105 transition-transform">
                      <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center text-cyan-300">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-2.5 py-1 rounded-md border border-indigo-500/30 font-bold">
                      {stat.badge}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-cyan-400 mt-1">
                    {stat.label}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-4 leading-relaxed font-normal pt-3 border-t border-slate-800">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
