import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Code2, Server, Users, Sparkles, Play, FileText, ArrowRight, UserCheck, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

const TRACKS = [
  {
    id: 'technical',
    title: 'Technical Deep-Dive',
    desc: 'Core CS concepts, framework internals, language features, & async programming.',
    icon: Cpu,
    color: 'from-[#38bdf8] to-[#818cf8]',
    borderColor: 'hover:border-cyan-500/50',
    badge: 'Popular',
  },
  {
    id: 'coding',
    title: 'Coding & Algorithms',
    desc: 'Interactive code editor sandbox with live data structure & complexity challenges.',
    icon: Code2,
    color: 'from-[#818cf8] to-[#a855f7]',
    borderColor: 'hover:border-indigo-500/50',
    badge: 'Monaco IDE',
  },
  {
    id: 'system_design',
    title: 'System Design & Architecture',
    desc: 'Distributed systems, database scaling, caching, microservices, & whiteboard node builder.',
    icon: Server,
    color: 'from-[#a855f7] to-[#ec4899]',
    borderColor: 'hover:border-purple-500/50',
    badge: 'Senior/Lead',
  },
  {
    id: 'behavioral',
    title: 'Behavioral STAR Method',
    desc: 'Conflict resolution, leadership scenarios, project hurdles, & communication skills.',
    icon: Users,
    color: 'from-[#34d399] to-[#059669]',
    borderColor: 'hover:border-emerald-500/50',
    badge: 'Soft Skills',
  },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Advanced'];

export default function TrackSelectionModal({ isOpen, onClose, defaultRole = 'Senior Full Stack Engineer' }) {
  const navigate = useNavigate();

  // Wizard Step: 1 = Track & Difficulty, 2 = Candidate Profile & Resume/JD Target
  const [step, setStep] = useState(1);

  const [selectedTrack, setSelectedTrack] = useState('technical');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [targetRole, setTargetRole] = useState(defaultRole);
  const [candidateName, setCandidateName] = useState('Khushal Kumar');
  const [companyName, setCompanyName] = useState('Target Tech Corp');
  const [resumeText, setResumeText] = useState(
    'Experienced Full Stack Engineer with 3+ years in React, Python (FastAPI/Django), Node.js, SQL databases, and REST APIs.'
  );
  const [jdText, setJdText] = useState(
    'Looking for a Senior Full Stack Engineer skilled in React, Python microservices, Redis caching, System Design, and Docker.'
  );

  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleStartSession() {
    setStarting(true);
    setError('');
    try {
      const res = await interviewAPI.start(
        selectedTrack,
        selectedDifficulty,
        targetRole,
        candidateName,
        companyName,
        resumeText,
        jdText
      );
      onClose();
      navigate(`/interview/${res.session_id}`);
    } catch (err) {
      console.error('Failed to start personalized session:', err);
      setError(err.message || 'Failed to initialize session. Please try again.');
    } finally {
      setStarting(false);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Background Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Wizard Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${step === 1 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-900 text-slate-400'}`}>
              Step 1: Choose Track
            </span>
            <span className="text-slate-600">•</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${step === 2 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400'}`}>
              Step 2: Resume & Job Target
            </span>
          </div>

          {/* STEP 1: Select Track & Difficulty */}
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Select Technical Track</h2>
                <p className="text-sm text-slate-400 mt-1">Choose the specialization for your Bit-Interview session.</p>
              </div>

              {/* Track Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {TRACKS.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedTrack === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTrack(t.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0f172a] border-cyan-400/80 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${t.color} p-[1px]`}>
                            <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {t.badge}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{t.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Difficulty Selection */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Target Difficulty Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {DIFFICULTIES.map((d) => {
                    const isSelected = selectedDifficulty === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDifficulty(d)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 border-cyan-400 shadow-md font-black'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <span>Next: Resume & JD Setup</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Candidate Profile & Resume/JD Matching Target */
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Personalize Your Interview</h2>
                <p className="text-sm text-slate-400 mt-1">Connect your Resume and Target Job Description for customized AI questions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Candidate Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Candidate Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Khushal Kumar"
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Target Role & Company */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Target Role & Company</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Resume Text */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Your Resume Skills & Projects Summary</label>
                <textarea
                  rows={3}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your key resume bullet points or project experience..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Target Job Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Job Description (JD)</label>
                <textarea
                  rows={3}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste target job requirements or responsibilities..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-800"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  disabled={starting}
                  onClick={handleStartSession}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {starting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Parsing Resume & Matching JD...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                      <span>Launch Personalised Interview</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
