import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Sliders, Bot, FileText, Sparkles, Zap, CheckCircle2, Cpu } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload Candidate Resume",
      tagline: "PDF Extraction & Context Engine",
      description: "Upload your resume or paste experience bullets. Our PyMuPDF engine extracts your core stack, frameworks, and architecture background to personalize the interview.",
      badge: "Context Intelligence",
      icon: Upload,
      color: "from-indigo-500 to-violet-500",
      accentGlow: "rgba(99, 102, 241, 0.25)",
      tags: ["PyMuPDF Parser", "Skill Extraction", "ATS Match Score"]
    },
    {
      number: "02",
      title: "Select Practice Track & Role",
      tagline: "Adaptive Interview Setup",
      description: "Choose your focus area — Technical Deep-Dive, Monaco Coding Sandbox, System Design Architecture, or Behavioral STAR method — and set your target role & difficulty.",
      badge: "Customization",
      icon: Sliders,
      color: "from-violet-500 to-purple-500",
      accentGlow: "rgba(139, 92, 246, 0.25)",
      tags: ["Monaco Sandbox", "System Design", "Difficulty Scaling"]
    },
    {
      number: "03",
      title: "Face the LangGraph AI Agent",
      tagline: "Real-Time Voice & Code Execution",
      description: "Engage in live dynamic conversation with voice narration and Monaco IDE code execution. The LangGraph agent probes your architectural decisions and interrupts if you ramble or hand-wave.",
      badge: "Stateful AI Engine",
      icon: Bot,
      color: "from-purple-500 to-cyan-500",
      accentGlow: "rgba(168, 85, 247, 0.25)",
      tags: ["Voice Speech-to-Text", "Judge0 Execution", "Silence Interruption"]
    },
    {
      number: "04",
      title: "Get Diagnostic Scorecard Report",
      tagline: "Actionable Feedback & Roadmap",
      description: "Receive a comprehensive scorecard breaking down technical depth, coding speed, communication clarity, anti-cheat audit log, and a tailored 7-day technical study roadmap.",
      badge: "ML Analytics Engine",
      icon: FileText,
      color: "from-cyan-400 to-indigo-500",
      accentGlow: "rgba(6, 182, 212, 0.25)",
      tags: ["Competency Radar", "7-Day Roadmap", "Proctoring Audit"]
    }
  ];

  return (
    <section id="how-it-works" className="py-28 bg-[#090d16] border-t border-slate-800/80 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase bg-indigo-500/15 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-lg shadow-indigo-500/10">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Interactive Flowchart Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            How Bit-<span className="text-gradient-accent">Interview Works</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            A stateful 4-step workflow connecting candidate preparation to actionable diagnostic analytics.
          </p>
        </div>

        {/* Serpentine Vertical Flowchart Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Curved SVG Connecting Flow Line (Desktop View) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 1000 1100" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                  <stop offset="33%" stopColor="#8b5cf6" stopOpacity="0.9" />
                  <stop offset="66%" stopColor="#a855f7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Smooth Serpentine S-Curve Path connecting nodes */}
              <motion.path
                d="M 260 120 
                   C 750 120, 750 380, 740 380 
                   C 730 380, 240 380, 260 640 
                   C 280 640, 750 640, 740 900"
                stroke="url(#flowGradient)"
                strokeWidth="4"
                strokeDasharray="8 6"
                filter="url(#glow)"
                initial={{ pathLength: 0, opacity: 0.3 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          {/* Flowchart Steps List */}
          <div className="space-y-12 lg:space-y-24 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Flowcard Node Card */}
                  <div className="w-full lg:w-1/2">
                    <div
                      className="group relative rounded-3xl bg-[#0f172a]/90 border border-slate-800 hover:border-indigo-500/60 p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1 backdrop-blur-xl overflow-hidden"
                      style={{ boxShadow: `0 15px 35px -10px ${step.accentGlow}` }}
                    >
                      {/* Top Accent Gradient Bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${step.color}`} />

                      {/* Header Badge & Number */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-300 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center gap-1.5">
                          <Cpu className="w-3 h-3 text-cyan-400" /> {step.badge}
                        </span>
                        <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-indigo-400 transition-colors">
                          STEP {step.number}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <div className="space-y-1 mb-3">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                          {step.title}
                        </h3>
                        <p className="text-xs font-mono text-cyan-400 font-bold">
                          ⚡ {step.tagline}
                        </p>
                      </div>

                      {/* Body Description */}
                      <p className="text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                        {step.description}
                      </p>

                      {/* Technical Feature Tags */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
                        {step.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1 group-hover:border-indigo-500/40 transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Flow Connection Center Node Icon (Desktop & Mobile) */}
                  <div className="relative flex items-center justify-center shrink-0 my-2 lg:my-0">
                    <div className="relative">
                      {/* Pulse Ring */}
                      <div className="absolute -inset-3 rounded-full bg-indigo-500/20 animate-ping opacity-75 pointer-events-none" />

                      {/* Center Glowing Icon Circle */}
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${step.color} p-[2px] shadow-2xl z-10 relative`}>
                        <div className="w-full h-full bg-[#0b0f19] rounded-[14px] flex items-center justify-center relative">
                          <Icon className="w-7 h-7 sm:w-9 sm:h-9 text-cyan-300 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty Spacer Column for Alignment on Desktop */}
                  <div className="hidden lg:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
