import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Mic, Code2, Sparkles, BarChart3, Map, ArrowUpRight } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: "Adaptive AI Interviewer",
      description: "AI dynamically changes questions and probes deeper based on your answers, testing real comprehension rather than static memorization.",
      color: "from-indigo-500 to-blue-600",
      badge: "Core AI Engine"
    },
    {
      icon: Mic,
      title: "Real-Time Voice Interview",
      description: "Practice speaking naturally with a low-latency conversational AI interviewer that listens, pauses, and responds in real time.",
      color: "from-blue-500 to-cyan-500",
      badge: "Speech AI"
    },
    {
      icon: Code2,
      title: "Live Coding Environment",
      description: "Solve complex data structure & algorithmic problems inside a rich browser code editor with syntax highlighting and instant execution.",
      color: "from-cyan-500 to-emerald-500",
      badge: "IDE Integration"
    },
    {
      icon: Sparkles,
      title: "Smart Evaluation",
      description: "Receive granular scores across technical accuracy, problem-solving framework, code cleanliness, and speech clarity.",
      color: "from-purple-500 to-indigo-500",
      badge: "Multi-Dim Scoring"
    },
    {
      icon: BarChart3,
      title: "Interview Analytics",
      description: "Track your progress over time with deep data insights, identifying specific technical blindspots before real recruiter calls.",
      color: "from-pink-500 to-rose-500",
      badge: "Insights"
    },
    {
      icon: Map,
      title: "Personalized Roadmap",
      description: "Get an automated AI study schedule tailored to your weak points with targeted practice questions and recommended study topics.",
      color: "from-amber-500 to-orange-500",
      badge: "Growth Engine"
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#090d16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            Cutting-Edge Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Realistic <br />
            <span className="text-gradient-accent">Interview Preparation</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Everything you need to master technical interviews, communicate with confidence, and land top-tier tech offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 p-8 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] shadow-lg`}>
                      <div className="w-full h-full bg-[#0b101d] rounded-[11px] flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/50">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-cyan-300 transition-colors">
                  <span>Explore Feature</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
