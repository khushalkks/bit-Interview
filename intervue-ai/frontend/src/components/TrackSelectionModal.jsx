import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Code2, Server, Users, Zap, Sparkles, Play, ShieldAlert, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

const TRACKS = [
  {
    id: 'technical',
    title: 'Technical Deep-Dive',
    desc: 'Core CS concepts, framework internals, language features, & async programming.',
    icon: Cpu,
    color: 'from-amber-400 to-orange-500',
    borderColor: 'hover:border-amber-500/50',
    badge: 'Popular',
  },
  {
    id: 'coding',
    title: 'Coding & Algorithms',
    desc: 'Interactive code editor sandbox with live data structure & complexity challenges.',
    icon: Code2,
    color: 'from-amber-500 to-yellow-400',
    borderColor: 'hover:border-amber-500/50',
    badge: 'Interactive Code',
  },
  {
    id: 'system_design',
    title: 'System Design & Architecture',
    desc: 'Distributed systems, database scaling, caching, microservices, & CAP theorem.',
    icon: Server,
    color: 'from-orange-500 to-amber-400',
    borderColor: 'hover:border-orange-500/50',
    badge: 'Senior/Lead',
  },
  {
    id: 'behavioral',
    title: 'Behavioral STAR Method',
    desc: 'Conflict resolution, leadership scenarios, project hurdles, & communication skills.',
    icon: Users,
    color: 'from-amber-400 to-amber-600',
    borderColor: 'hover:border-amber-500/50',
    badge: 'Soft Skills',
  },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Advanced'];

export default function TrackSelectionModal({ isOpen, onClose, defaultRole = 'Full Stack Engineer' }) {
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState('technical');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [targetRole, setTargetRole] = useState(defaultRole);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleStartSession() {
    setStarting(true);
    setError('');
    try {
      const res = await interviewAPI.start(selectedTrack, selectedDifficulty, targetRole);
      onClose();
      navigate(`/interview/${res.session_id}`);
    } catch (err) {
      console.error('Failed to start session:', err);
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
          className="relative w-full max-w-3xl bg-[#14100c]/95 border border-amber-900/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Ambient light glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-xl bg-amber-950/80 hover:bg-amber-900 transition-colors border border-amber-900/60"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-orange-300" />
              <span>Adaptive AI Interview Launcher</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Choose Interview Track & Settings
            </h2>
            <p className="text-sm text-slate-400">
              Select your round focus. The AI will dynamically evaluate your answers and adapt difficulty in real time.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Input & Difficulty Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full px-4 py-3 rounded-xl bg-amber-950/80 border border-amber-900/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Starting Difficulty
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-amber-950/80 border border-amber-900/80 rounded-xl">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Track Selection Cards */}
          <div className="space-y-2 mb-8">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Round Track
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRACKS.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedTrack === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrack(t.id)}
                    className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-950/90 border-amber-500 shadow-lg shadow-amber-500/10'
                        : 'bg-amber-950/40 border-amber-900/60 hover:bg-amber-950/80 ' + t.borderColor
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-r ${t.color} text-slate-950 font-bold shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-900/60 border border-amber-800/50 text-slate-300">
                        {t.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white mb-1">{t.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-900/60">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-slate-400 hover:text-white font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={starting}
              onClick={handleStartSession}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              {starting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Initializing Session...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Start Interview Room</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
