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
    <section id="interview-types" className="py-24 bg-[#090d16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
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
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {type.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {type.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/60 mb-4">
                    {type.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-200 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer">
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
