import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Users, UserCheck, Network, Layers, ArrowRight, Zap } from 'lucide-react';

export default function InterviewTypes() {
  const types = [
    {
      icon: Terminal,
      title: "Technical Interview Track",
      description: "Deep dive into language specs, frameworks, operating systems, networking fundamentals, and core engineering concepts.",
      tags: ["React", "Python", "Node.js", "DB Internals"],
      badge: "Core Stack"
    },
    {
      icon: Code,
      title: "Monaco Coding Sandbox",
      description: "Solve algorithmic puzzles, data structure challenges, dynamic programming, and optimization problems in real-time.",
      tags: ["Judge0 Engine", "O(1) Complexity", "Clean Code"],
      badge: "In-Browser IDE"
    },
    {
      icon: Network,
      title: "System Design Architecture",
      description: "Architect scalable distributed systems, data pipelines, load balancing, caching strategies, and database sharding.",
      tags: ["Scalability", "Microservices", "Cap Theorem"],
      badge: "High Throughput"
    },
    {
      icon: Users,
      title: "Behavioral STAR Round",
      description: "Practice STAR method responses to conflict resolution, leadership, failure recovery, and cross-team collaboration.",
      tags: ["STAR Method", "Leadership", "Ownership"],
      badge: "Soft Skills"
    },
    {
      icon: UserCheck,
      title: "HR & Culture Assessment",
      description: "Answer culture fit, background overview, salary expectation positioning, and long-term career ambition questions.",
      tags: ["Culture Fit", "Career Goals", "Positioning"],
      badge: "Recruiter Fit"
    },
    {
      icon: Layers,
      title: "Full Simulation Round",
      description: "Full-simulation interview combining coding, system architecture, and behavioral assessment in one realistic session.",
      tags: ["Full Stack", "End-to-End", "Comprehensive"],
      badge: "Complete Challenge"
    }
  ];

  return (
    <section id="interview-types" className="py-28 bg-[#080c14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase bg-indigo-500/15 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-lg shadow-indigo-500/10">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Tailored AI Practice Domains
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Choose Your <span className="text-gradient-accent">Bit-Interview Track</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Tailored AI interviewer personas and scoring algorithms for every major technical format.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type, idx) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-7 rounded-3xl bg-[#0f172a]/90 border border-slate-800 hover:border-indigo-500/60 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/15 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1px] shadow-lg group-hover:scale-105 transition-transform">
                      <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center text-cyan-300">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-2.5 py-1 rounded-md border border-indigo-500/30 font-bold">
                      {type.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {type.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                    {type.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800 mb-5">
                    {type.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-semibold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.01]">
                    <span>Start Practice Session</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
