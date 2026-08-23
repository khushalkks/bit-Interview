import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Cpu, Code2, Users, FileText, ArrowRight, Upload, CheckCircle2,
  Play, RefreshCw, Shield, Sparkles, User, Clock, Briefcase, HelpCircle, Layers
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#04060a]/92 backdrop-blur-xl overflow-y-auto font-sans select-none">
        {/* Glowing Ambient Blobs */}
        <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[450px] h-[450px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none" />
        
        {/* Main Intervue Setup Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          className="relative w-full max-w-6xl xl:max-w-7xl bg-gradient-to-br from-[#0b0f19] via-[#080a12] to-[#04060a] border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden my-4"
        >
          {/* Header Bar with Custom Step Nodes */}
          <div className="px-8 py-6 border-b border-slate-800/60 bg-[#090c15]/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 rounded-full uppercase">
                  Session Setup
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  Step {step} of {totalSteps}
                </span>
              </div>
              <h1 className="text-lg font-extrabold text-white font-sans mt-1">Configure Your AI Simulation</h1>
            </div>

            {/* Custom Progress Step Connector */}
            <div className="flex items-center gap-2.5 md:gap-4 font-sans max-w-md w-full">
              {[
                { label: 'Format', num: 1 },
                { label: isResumeMode ? 'Resume' : 'Level', num: 2 },
                { label: 'Duration', num: 3 },
                { label: 'Interviewer', num: 4 }
              ].map((s) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <React.Fragment key={s.num}>
                    {/* Step Node */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6.5 h-6.5 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-tr from-indigo-500 to-cyan-400 text-slate-950 font-black ring-4 ring-indigo-500/20 scale-105'
                            : isCompleted
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-900 border border-slate-800 text-slate-500'
                        }`}
                      >
                        {isCompleted ? '✓' : s.num}
                      </div>
                      <span
                        className={`text-[11px] font-bold hidden sm:inline transition-colors duration-300 ${
                          isActive ? 'text-white' : isCompleted ? 'text-indigo-400' : 'text-slate-500'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {/* Line Connector */}
                    {s.num < 4 && (
                      <div className="flex-grow h-[2px] min-w-[12px] bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                          style={{ width: isCompleted ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 hover:scale-105 transition-all cursor-pointer text-xs font-extrabold font-mono"
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
                      <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest font-bold mb-1">
                        STEP 01 — FORMAT
                      </div>
                      <h2 className="text-3xl font-black text-white tracking-tight">What kind of interview?</h2>
                      <p className="text-sm text-slate-400 mt-1">Pick the format you want to practice today.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      {FORMATS.map((f) => {
                        const isSelected = selectedFormat === f.id;
                        const IconComponent = f.icon;
                        
                        // Icon Colors and themes
                        let themeColor = "indigo";
                        let iconBg = "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
                        let selectedBorder = "border-indigo-500 shadow-indigo-500/10 shadow-lg";
                        
                        if (f.id === 'technical') {
                          themeColor = "violet";
                          iconBg = "bg-violet-500/10 border-violet-500/20 text-violet-400";
                          selectedBorder = "border-violet-500 shadow-violet-500/10 shadow-lg";
                        } else if (f.id === 'resume_deep_dive') {
                          themeColor = "cyan";
                          iconBg = "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
                          selectedBorder = "border-cyan-500 shadow-cyan-500/10 shadow-lg";
                        }

                        return (
                          <div
                            key={f.id}
                            onClick={() => setSelectedFormat(f.id)}
                            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-[210px] relative hover:scale-[1.02] ${
                              isSelected
                                ? `bg-[#121929] ${selectedBorder} shadow-[0_0_20px_rgba(99,102,241,0.08)]`
                                : 'bg-[#090b11] border-slate-800/80 hover:border-slate-700/80 hover:bg-[#0a0d18]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className={`w-10 h-10 rounded-xl ${iconBg} border flex items-center justify-center`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 font-bold">STAGE {f.num}</span>
                            </div>
                            <div className="mt-4">
                              <h4 className="text-base font-extrabold text-white mb-1.5">{f.title}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed font-sans">{f.desc}</p>
                            </div>
                            {isSelected && (
                              <div className="absolute top-4 right-4 flex items-center justify-center">
                                <span className={`w-2.5 h-2.5 rounded-full ${f.id === 'behavioral' ? 'bg-indigo-400 shadow-indigo-400' : f.id === 'technical' ? 'bg-violet-400 shadow-violet-400' : 'bg-cyan-400 shadow-cyan-400'} shadow-[0_0_8px]`} />
                              </div>
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
                          <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest font-bold mb-1">
                            STEP 02 — RESUME
                          </div>
                          <h2 className="text-3xl font-black text-white tracking-tight">Upload your resume</h2>
                          <p className="text-sm text-slate-400 mt-1">We'll tailor every question to your specific experience.</p>
                        </div>

                        {/* Resume Dropzone Box */}
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center space-y-4 relative overflow-hidden ${
                            dragActive
                              ? 'border-indigo-400 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.05)]'
                              : 'border-slate-800 bg-[#07090f] hover:border-slate-700/80 hover:bg-[#0a0d17]'
                          }`}
                        >
                          <input
                            type="file"
                            id="intervue-resume-pdf"
                            accept=".pdf"
                            onChange={(e) => e.target.files?.[0] && handleModalFileUpload(e.target.files[0])}
                            className="hidden"
                          />
                          <label htmlFor="intervue-resume-pdf" className="cursor-pointer space-y-4 block w-full">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-300 shadow-md">
                              <Upload className={`w-7 h-7 text-indigo-400 ${uploadingResume ? 'animate-bounce' : ''}`} />
                            </div>

                            <div className="space-y-1">
                              <div className="text-base font-extrabold text-white">
                                {uploadingResume ? 'Extracting Resume Intelligence...' : 'Upload your Professional Resume'}
                              </div>
                              <p className="text-xs text-slate-400 font-sans">
                                Drag and drop your PDF here, or click to explore folders.
                              </p>
                              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-1">
                                Supported formats: PDF only (Max 5MB)
                              </p>
                            </div>

                            <div className="pt-2">
                              <span className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-extrabold text-xs inline-flex items-center gap-2 transition-all hover:scale-102 hover:shadow-lg hover:shadow-indigo-500/10">
                                {uploadingResume ? (
                                  <>
                                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                    <span>Processing...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Select PDF File</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </>
                                )}
                              </span>
                            </div>
                          </label>
                        </div>

                        {resumeFileName && (
                          <div className="p-3.5 rounded-2xl bg-[#121929] border border-indigo-500/30 flex items-center gap-2 text-xs font-mono text-indigo-300">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span>Attached Resume: <strong>{resumeFileName}</strong></span>
                          </div>
                        )}

                        {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}
                      </div>
                    ) : (
                      /* Technical/Behavioral Step 2: Role Selection */
                      <div className="space-y-6">
                        <div>
                          <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest font-bold mb-1">
                            STEP 02 — ROLE LEVEL
                          </div>
                          <h2 className="text-3xl font-black text-white tracking-tight">What level are you targeting?</h2>
                          <p className="text-sm text-slate-400 mt-1">We'll calibrate question depth and expectations.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          {TARGET_ROLES.map((r) => {
                            const isSelected = selectedRole === r.id;
                            return (
                              <div
                                key={r.id}
                                onClick={() => setSelectedRole(r.id)}
                                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-[130px] relative hover:scale-[1.01] ${
                                  isSelected
                                    ? 'bg-[#121929] border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.08)]'
                                    : 'bg-[#090b11] border-slate-800/80 hover:border-slate-700/80 hover:bg-[#0a0d18]'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <h4 className="text-base font-extrabold text-white">{r.title}</h4>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                                      isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-400 border border-slate-800'
                                    }`}>
                                      {r.level}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{r.desc}</p>
                                </div>
                                {isSelected && (
                                  <div className="absolute top-4 right-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                  </div>
                                )}
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
                      <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest font-bold mb-1">
                        STEP 03 — DURATION
                      </div>
                      <h2 className="text-3xl font-black text-white tracking-tight">How long do you have?</h2>
                      <p className="text-sm text-slate-400 mt-1">We'll pace the questions to fit your window.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      {DURATIONS.map((d) => {
                        const isSelected = selectedDuration === d.id;
                        return (
                          <div
                            key={d.id}
                            onClick={() => setSelectedDuration(d.id)}
                            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer text-center flex flex-col justify-center items-center gap-1.5 hover:scale-[1.02] ${
                              isSelected
                                ? 'bg-[#121929] border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.08)]'
                                : 'bg-[#090b11] border-slate-800/80 hover:border-slate-700/80 hover:bg-[#0a0d18]'
                            }`}
                          >
                            <Clock className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                            <div className="text-lg font-black text-white">{d.title}</div>
                            <div className="text-[10px] font-medium text-slate-400 font-sans">{d.desc}</div>
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
                      <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest font-bold mb-1">
                        STEP 04 — INTERVIEWER
                      </div>
                      <h2 className="text-3xl font-black text-white tracking-tight">Interviewer</h2>
                      <p className="text-sm text-slate-400 mt-1">Pick a persona. Each has a different pace and follow-up style.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {PERSONAS.map((p) => {
                        const isSelected = selectedPersona === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPersona(p.id)}
                            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer space-y-3 hover:scale-[1.01] ${
                              isSelected
                                ? 'bg-[#121929] border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.08)]'
                                : 'bg-[#090b11] border-slate-800/80 hover:border-slate-700/80 hover:bg-[#0a0d18]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl ${p.badgeBg} flex items-center justify-center text-white font-black text-xs shadow-md`}>
                                  {p.badge}
                                </div>
                                <div className="text-left">
                                  <span className="text-sm font-bold text-white block">{p.name}</span>
                                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block leading-tight">
                                    {p.type}
                                  </span>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                                isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-900 text-slate-400 border border-slate-800'
                              }`}>
                                {p.type === 'SUPPORTIVE' ? 'Easy' : p.type === 'CORPORATE' ? 'Medium' : p.type === 'PRESSURE' ? 'Hard' : 'Probing'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">{p.desc}</p>
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
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-black text-xs shadow-lg shadow-indigo-500/15 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-indigo-500/25"
                  >
                    <span>Continue Simulation setup →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={starting || uploadingResume}
                    onClick={handleStartSession}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-500 text-white font-black text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50"
                  >
                    {starting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Initializing Room...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                        <span>Start AI Simulation</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: "YOUR SESSION" Widget */}
            <div className="lg:col-span-4 bg-[#07090f]/75 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-8 space-y-6 flex flex-col justify-between relative">
              <div className="absolute inset-0 bg-[#090b12]/30 pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    Simulation Spec
                  </span>
                  <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-bold">
                    DRAFT
                  </span>
                </div>

                <div className="space-y-5 text-xs font-sans">
                  {/* Type */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/40">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-slate-400 font-medium">Format</span>
                    </div>
                    <span className="text-white font-extrabold text-xs">
                      {currentFormatObj ? currentFormatObj.title : '—'}
                    </span>
                  </div>

                  {/* Resume (if uploaded) */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/40">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span className="text-slate-400 font-medium">Resume</span>
                    </div>
                    <span className="text-white font-extrabold text-xs truncate max-w-[140px]" title={resumeFileName || userResumeProfile?.file_name}>
                      {resumeFileName || userResumeProfile?.file_name || '—'}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/40">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-slate-400 font-medium">Duration</span>
                    </div>
                    <span className="text-white font-extrabold text-xs">
                      {step >= 3 ? selectedDuration : '—'}
                    </span>
                  </div>

                  {/* Interviewer Persona */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/40">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-400 font-medium">Interviewer</span>
                    </div>
                    <span className="text-white font-extrabold text-xs">
                      {step >= 4 ? selectedPersona : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Boarding-pass style ticket notch dotted line */}
              <div className="relative z-10 border-t border-dashed border-slate-800/80 pt-6 space-y-4">
                <div className="text-[10px] text-slate-400 font-mono leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-850">
                  <span className="text-indigo-400 font-bold block mb-1">⚡ Platform Notice</span>
                  Your choices determine the question generation logic. Questions will dynamically calibrate in real-time using LangGraph based on your credentials.
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
