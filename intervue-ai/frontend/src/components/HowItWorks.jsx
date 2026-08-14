import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Sliders, Bot, FileText, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      description: "Upload your resume or pasted experience bullet points. The AI extracts your skills and target role level.",
      icon: Upload,
      color: "from-amber-400 to-orange-500"
    },
    {
      number: "02",
      title: "Choose Your Interview",
      description: "Select target domain (Frontend, Backend, System Design, HR) and set interview duration and difficulty.",
      icon: Sliders,
      color: "from-amber-500 to-yellow-400"
    },
    {
      number: "03",
      title: "Face the AI Interviewer",
      description: "Engage in real-time voice & coding interaction. The AI adapts live, probing your design and code choices.",
      icon: Bot,
      color: "from-orange-500 to-amber-400"
    },
    {
      number: "04",
      title: "Get Performance Report",
      description: "Receive a comprehensive scorecard breaking down technical depth, speech clarity, and actionable tips.",
      icon: FileText,
      color: "from-amber-400 to-amber-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0b0907] border-t border-amber-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How Bit-<span className="text-gradient-accent">Interview Works</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            From setup to performance breakdown in minutes. No manual setup required.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Connecting line behind steps for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/20 via-orange-500/40 to-amber-500/20 -translate-y-6 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Icon Badge */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${step.color} p-[2px] shadow-xl group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full bg-[#14100c] rounded-[14px] flex items-center justify-center relative">
                        <Icon className="w-8 h-8 text-amber-300 group-hover:text-amber-200 transition-colors" />
                        <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-950 border border-amber-500/40 flex items-center justify-center font-mono text-xs font-bold text-amber-300 shadow-md">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
