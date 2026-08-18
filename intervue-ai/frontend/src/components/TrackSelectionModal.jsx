import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Cpu, Code2, Users, FileText, ArrowRight, Upload, CheckCircle2,
  Play, RefreshCw, Shield, Sparkles, User, Clock, Briefcase, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI, resumeAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const FORMATS = [
  {
    id: 'behavioral',
    trackId: 'behavioral',
    num: '01',
    title: 'Behavioral',
    desc: 'STAR questions + adaptive follow-ups',
    icon: Users,
  },
  {
    id: 'technical',
    trackId: 'technical',
    num: '02',
    title: 'Technical',
    desc: 'LeetCode-style coding with voice interviewer',
    icon: Code2,
  },
  {
    id: 'resume_deep_dive',
    trackId: 'technical',
    num: '03',
    title: 'Resume Deep Dive',
    desc: 'Questions tailored to your CV',
    icon: FileText,
  },
];

const TARGET_ROLES = [
  {
    id: 'intern',
    title: 'Software Engineer Intern',
    desc: 'Data structures, algorithms, behavioral',
    level: 'Junior',
  },
  {
    id: 'new_grad',
    title: 'New Grad SWE',
    desc: 'Core SWE loop, system design intro',
    level: 'Entry-Level',
  },
  {
    id: 'mid_level',
    title: 'Mid-Level SWE',
    desc: 'System design, technical depth, ownership',
    level: 'Mid-Level',
  },
  {
    id: 'senior',
    title: 'Senior SWE',
    desc: 'System design, leadership, execution',
    level: 'Senior',
  },
];

const DURATIONS = [
  { id: '20 min', title: '20 min', desc: 'Quick warm-up' },
  { id: '30 min', title: '30 min', desc: 'Short screen' },
  { id: '45 min', title: '45 min', desc: 'Standard session' },
  { id: '60 min', title: '60 min', desc: 'Full loop round' },
];

const PERSONAS = [
  {
    id: 'Sarah',
    name: 'Sarah',
    badge: 'S',
    badgeBg: 'bg-emerald-600',
    type: 'SUPPORTIVE',
    desc: 'Warm, encouraging — prompts deeper storytelling and personal impact',
  },
  {
    id: 'Daniel',
    name: 'Daniel',
    badge: 'D',
    badgeBg: 'bg-indigo-600',
    type: 'CORPORATE',
    desc: 'Formal, structured — strictly enforces STAR format throughout',
  },
  {
    id: 'Fin',
    name: 'Fin',
    badge: 'F',
    badgeBg: 'bg-teal-600',
    type: 'PRESSURE',
    desc: 'Fast-paced, direct — cuts off rambling, demands conciseness',
  },
  {
    id: 'Clyde',
    name: 'Clyde',
    badge: 'C',
    badgeBg: 'bg-rose-600',
    type: 'PROBING',
    desc: 'Skeptical, detail-oriented — questions every claim and motive',
  },
];

export default function TrackSelectionModal({ isOpen, onClose, defaultRole = 'Senior SWE' }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Wizard Step: 1..4 (4 Steps Total)
  const [step, setStep] = useState(1);

  const [selectedFormat, setSelectedFormat] = useState('resume_deep_dive');
  const [selectedRole, setSelectedRole] = useState('senior');
  const [selectedDuration, setSelectedDuration] = useState('30 min');
  const [selectedPersona, setSelectedPersona] = useState('Sarah');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');

  const [candidateName, setCandidateName] = useState(user?.name || 'Kushal Kumar');
  const [companyName, setCompanyName] = useState('Target Tech Corp');

  // Resume states
  const [userResumeProfile, setUserResumeProfile] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');

  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [resumeSuccessMsg, setResumeSuccessMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Fetch saved resume on open
  useEffect(() => {
    if (user?.name) setCandidateName(user.name);
    if (isOpen) fetchUserResume();
  }, [isOpen, user]);

  const fetchUserResume = async () => {
    setLoadingResume(true);
    try {
      const data = await resumeAPI.getMe();
      if (data && (data.raw_text || data.file_name)) {
        setUserResumeProfile(data);
        if (data.candidate_name && data.candidate_name !== 'Candidate Engineer') {
          setCandidateName(data.candidate_name);
        }
        if (data.file_name) setResumeFileName(data.file_name);
        if (data.raw_text) setResumeText(data.raw_text);
      }
    } catch (err) {
      console.log('No saved user resume found:', err);
    } finally {
      setLoadingResume(false);
    }
  };

  const handleModalFileUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file (.pdf)');
      return;
    }
    setError('');
    setUploadingResume(true);
    setResumeSuccessMsg('');
    try {
      const profile = await resumeAPI.upload(file);
      setUserResumeProfile(profile);
      setResumeFileName(file.name);
      if (profile.candidate_name && profile.candidate_name !== 'Candidate Engineer') {
        setCandidateName(profile.candidate_name);
      }
      if (profile.raw_text) {
        setResumeText(profile.raw_text);
      } else if (profile.skills) {
        setResumeText(`Uploaded Resume (${profile.file_name}). Skills: ${profile.skills.join(', ')}.`);
      }
      setResumeSuccessMsg(`✅ Resume "${file.name}" uploaded successfully!`);
    } catch (err) {
      console.error('Failed to parse uploaded PDF:', err);
      setError(err.message || 'Failed to upload PDF. Please check file format.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleModalFileUpload(e.dataTransfer.files[0]);
    }
  };

  if (!isOpen) return null;

  const currentFormatObj = FORMATS.find((f) => f.id === selectedFormat);
  const currentRoleObj = TARGET_ROLES.find((r) => r.id === selectedRole);
  const currentPersonaObj = PERSONAS.find((p) => p.id === selectedPersona);

  const isResumeMode = selectedFormat === 'resume_deep_dive';
  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  async function handleStartSession() {
    setStarting(true);
    setError('');
    try {
      const trackId = currentFormatObj ? currentFormatObj.trackId : 'technical';
      const roleTitle = isResumeMode
        ? 'Software Engineer'
        : (currentRoleObj ? currentRoleObj.title : defaultRole);

      const res = await interviewAPI.start(
        trackId,
        selectedDifficulty,
        roleTitle,
        candidateName,
        companyName,
        resumeText || 'Experienced Software Engineer with proficiency in Python, React, JavaScript, SQL, and REST APIs.',
        'Target Job Description matching resume experience.',
        selectedPersona,
        selectedDuration,
        currentRoleObj ? currentRoleObj.level : 'Senior'
      );
      onClose();
      navigate(`/interview/${res.session_id}`);
    } catch (err) {
      console.error('Failed to start interview session:', err);
      setError(err.message || 'Failed to initialize session. Please try again.');
    } finally {
      setStarting(false);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#07090e]/95 backdrop-blur-md overflow-y-auto font-sans select-none">
        
        {/* Main Intervue Setup Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-5xl bg-[#0d1117] border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden my-4"
        >
          {/* Header Bar */}
          <div className="px-6 pt-5 pb-3 border-b border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold uppercase tracking-wider">
                SESSION SETUP &nbsp; 0{step} / 0{totalSteps}
              </span>
              <div className="w-32 sm:w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
            >
              <span>✕ Cancel</span>
            </button>
          </div>

          {/* Grid Layout: Left Content + Right YOUR SESSION Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div>
                
                {/* STEP 01 — FORMAT */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold mb-1">
                        STEP 01 — FORMAT
                      </div>
                      <h2 className="text-3xl font-black text-white tracking-tight">What kind of interview?</h2>
                      <p className="text-sm text-slate-400 mt-1">Pick the format you want to practice today.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                      {FORMATS.map((f) => {
                        const isSelected = selectedFormat === f.id;
                        return (
                          <div
                            key={f.id}
                            onClick={() => setSelectedFormat(f.id)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-[160px] relative ${
                              isSelected
                                ? 'bg-[#121926] border-emerald-500 shadow-xl shadow-emerald-500/10'
                                : 'bg-[#0a0d14] border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-xs font-mono text-slate-500">{f.num}</div>
                            <div>
                              <h4 className="text-base font-bold text-white mb-1">{f.title}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                            </div>
                            {isSelected && (
                              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 02 — RESUME UPLOAD (for Resume Deep Dive) OR ROLE LEVEL (for Behavioral/Technical) */}
                {step === 2 && (
                  <div className="space-y-6">
                    {isResumeMode ? (
                      /* Resume Deep Dive Step 2: Upload Resume */
                      <div className="space-y-5">
                        <div>
                          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold mb-1">
                            STEP 02 — RESUME
                          </div>
                          <h2 className="text-3xl font-black text-white tracking-tight">Upload your resume</h2>
                          <p className="text-sm text-slate-400 mt-1">We'll tailor every question to your specific experience.</p>
                        </div>

                        {/* Resume Dropzone Box (Exact match to screenshot 2) */}
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                            dragActive
                              ? 'border-emerald-400 bg-emerald-950/20'
                              : 'border-slate-800 bg-[#0a0d14] hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="file"
                            id="intervue-resume-pdf"
                            accept=".pdf"
                            onChange={(e) => e.target.files?.[0] && handleModalFileUpload(e.target.files[0])}
                            className="hidden"
                          />
                          <label htmlFor="intervue-resume-pdf" className="cursor-pointer space-y-3 block w-full">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                              <FileText className="w-6 h-6 text-slate-300" />
                            </div>

                            <div>
                              <div className="text-base font-bold text-white">
                                {uploadingResume ? 'Parsing Resume PDF...' : 'Drop your resume PDF here'}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">or click to browse — PDF only</p>
                            </div>

                            <div className="pt-2">
                              <span className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors">
                                {uploadingResume ? 'Parsing...' : '• Browse files →'}
                              </span>
                            </div>
                          </label>
                        </div>

                        {resumeFileName && (
                          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs font-mono text-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Attached Resume: <strong>{resumeFileName}</strong></span>
                          </div>
                        )}

                        {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}
                      </div>
                    ) : (
                      /* Technical/Behavioral Step 2: Role Selection */
                      <div className="space-y-6">
                        <div>
                          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold mb-1">
                            STEP 02 — ROLE LEVEL
                          </div>
                          <h2 className="text-3xl font-black text-white tracking-tight">What level are you targeting?</h2>
                          <p className="text-sm text-slate-400 mt-1">We'll calibrate question depth and expectations.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                          {TARGET_ROLES.map((r) => {
                            const isSelected = selectedRole === r.id;
                            return (
                              <div
                                key={r.id}
                                onClick={() => setSelectedRole(r.id)}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#121926] border-emerald-500 shadow-xl shadow-emerald-500/10'
                                    : 'bg-[#0a0d14] border-slate-800/80 hover:border-slate-700'
                                }`}
                              >
                                <h4 className="text-base font-bold text-white mb-1">{r.title}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 03 — DURATION */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold mb-1">
                        STEP 03 — DURATION
                      </div>
                      <h2 className="text-3xl font-black text-white tracking-tight">How long do you have?</h2>
                      <p className="text-sm text-slate-400 mt-1">We'll pace the questions to fit your window.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                      {DURATIONS.map((d) => {
                        const isSelected = selectedDuration === d.id;
                        return (
                          <div
                            key={d.id}
                            onClick={() => setSelectedDuration(d.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                              isSelected
                                ? 'bg-[#121926] border-emerald-500 shadow-xl shadow-emerald-500/10'
                                : 'bg-[#0a0d14] border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-lg font-black text-white mb-1">{d.title}</div>
                            <div className="text-[11px] text-slate-400">{d.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 04 — INTERVIEWER PERSONA */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold mb-1">
                        STEP 04 — INTERVIEWER
                      </div>
                      <h2 className="text-3xl font-black text-white tracking-tight">Interviewer</h2>
                      <p className="text-sm text-slate-400 mt-1">Pick a persona. Each has a different pace and follow-up style.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {PERSONAS.map((p) => {
                        const isSelected = selectedPersona === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPersona(p.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                              isSelected
                                ? 'bg-[#121926] border-emerald-500 shadow-xl shadow-emerald-500/10'
                                : 'bg-[#0a0d14] border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg ${p.badgeBg} flex items-center justify-center text-white font-bold text-xs`}>
                                {p.badge}
                              </div>
                              <div>
                                <span className="text-sm font-bold text-white">{p.name}</span>
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                                  {p.type}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/60">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                ) : (
                  <div />
                )}

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <span>• Continue →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={starting || uploadingResume}
                    onClick={handleStartSession}
                    className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50"
                  >
                    {starting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Initializing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                        <span>• Start interview →</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: "YOUR SESSION" Widget */}
            <div className="lg:col-span-4 bg-[#0a0c12] border-t lg:border-t-0 lg:border-l border-slate-800/80 p-6 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold pb-3 border-b border-slate-800/60">
                  YOUR SESSION
                </div>

                <div className="space-y-4 text-xs font-mono">
                  {/* Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Type</span>
                    <span className="text-slate-200 font-bold">
                      {currentFormatObj ? currentFormatObj.title : '—'}
                    </span>
                  </div>

                  {/* Resume (if uploaded) */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Resume</span>
                    <span className="text-slate-200 font-bold text-right truncate max-w-[150px]">
                      {resumeFileName || userResumeProfile?.file_name || '—'}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration</span>
                    <span className="text-slate-200 font-bold">
                      {step >= 3 ? selectedDuration : '—'}
                    </span>
                  </div>

                  {/* Interviewer Persona */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Interviewer</span>
                    <span className="text-slate-200 font-bold">
                      {step >= 4 ? selectedPersona : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 leading-relaxed">
                Your choices will appear here as you go. Questions will adapt in real-time to your specific resume experience.
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
