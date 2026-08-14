import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code, Users, UserCheck, Network, Layers, ArrowRight } from 'lucide-react';

export default function InterviewTypes() {
  const types = [
    {
      icon: Terminal,
      title: "Technical Interview",
      description: "Deep dive into language specs, frameworks, operating systems, networking fundamentals, and core engineering concepts.",
      tags: ["React", "Python", "Node.js", "DB Internals"]
    },
    {
      icon: Code,
      title: "Coding Interview",
      description: "Solve algorithmic puzzles, data structure challenges, dynamic programming, and optimization problems in real-time.",
      tags: ["LeetCode Medium/Hard", "O(N) Complexity", "Clean Code"]
    },
    {
      icon: Users,
      title: "Behavioral Interview",
      description: "Practice STAR method responses to conflict resolution, leadership, failure recovery, and cross-team collaboration.",
      tags: ["STAR Method", "Leadership", "Ownership"]
    },
    {
      icon: UserCheck,
      title: "HR Interview",
      description: "Answer culture fit, background overview, salary expectation positioning, and long-term career ambition questions.",
      tags: ["Culture Fit", "Career Goals", "Soft Skills"]
    },
    {
      icon: Network,
      title: "System Design",
      description: "Architect scalable distributed systems, data pipelines, load balancing, caching strategies, and database sharding.",
      tags: ["Scalability", "Microservices", "Cap Theorem"]
    },
    {
      icon: Layers,
      title: "Mixed Interview",
      description: "Full-simulation interview combining coding, system architecture, and behavioral assessment in one realistic session.",
      tags: ["Full Stack", "End-to-End", "Comprehensive"]
    }
  ];

  return (
    <section id="interview-types" className="py-24 bg-[#0b0907] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Tailored Practice Domains
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Choose Your <span className="text-gradient-accent">Interview Track</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Tailored AI interview persona and scoring algorithms for every major technical interview format.
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
                className="p-6 rounded-2xl bg-amber-950/20 border border-amber-900/40 hover:border-amber-500/40 hover:bg-amber-950/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      {type.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {type.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-amber-900/40 mb-4">
                    {type.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono text-slate-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-500 text-slate-200 hover:text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-amber-900/40">
                    <span>Start Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
