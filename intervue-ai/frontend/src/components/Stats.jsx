import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, GitBranch, Terminal, ShieldCheck, Users } from 'lucide-react';

export default function Stats() {
  const stats = [
    {
      icon: Cpu,
      value: "50,000+",
      label: "AI-Powered Interviews",
      description: "Conducted across engineering, product, & behavioral roles"
    },
    {
      icon: Zap,
      value: "< 200ms",
      label: "Real-Time Feedback",
      description: "Instant voice response & live speech clarity evaluation"
    },
    {
      icon: GitBranch,
      value: "100%",
      label: "Adaptive Questions",
      description: "Dynamic difficulty adjustment based on answer depth"
    },
    {
      icon: Terminal,
      value: "500+",
      label: "Coding Practice",
      description: "Curated LeetCode & System Design interview scenarios"
    }
  ];

  return (
    <section className="py-16 bg-[#070b13] border-y border-slate-800/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-base font-semibold text-indigo-300 mt-1">
                  {stat.label}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
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
