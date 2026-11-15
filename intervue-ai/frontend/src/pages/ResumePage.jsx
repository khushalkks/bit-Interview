import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp, 
  Gauge, 
  Zap, 
  Check, 
  Copy, 
  ShieldCheck,
  ChevronRight,
  Database,
  Cloud,
  Cpu,
  Terminal
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import { resumeAPI } from '../services/api';

export default function ResumePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('executive'); // 'executive' | 'skills' | 'projects' | 'experience' | 'raw'
  const [copiedBulletIdx, setCopiedBulletIdx] = useState(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await resumeAPI.getMe();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF document (.pdf)');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const updatedProfile = await resumeAPI.upload(file);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err.message || 'Failed to upload and parse resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your active resume context?')) return;
    try {
      await resumeAPI.delete();
      setProfile(null);
    } catch (err) {
      setError('Failed to delete resume');
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  const atsScore = profile?.ats_score ?? 85;
  const breakdown = profile?.ats_breakdown || {
    impact_score: 85,
    keyword_density: 88,
    structure_score: 90,
    skills_depth: 84
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col w-full font-sans selection:bg-indigo-500 selection:text-white">
      <DashboardNavbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1.5">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold mb-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-[#090d1a] rounded-[14px] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Resume <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Intelligence Hub</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Advanced PyMuPDF extraction, ATS readiness audit, impact metric scoring, and adaptive interview calibration.
            </p>
          </div>

          {profile && (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>Start Interview With This Resume</span>
              </Link>
              <button
                onClick={handleDelete}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Delete current resume context"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative p-8 sm:p-10 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center space-y-4 backdrop-blur-xl ${
            dragActive
              ? 'border-indigo-400 bg-indigo-950/40 scale-[1.01]'
              : 'border-slate-800 bg-[#0b0e1b]/70 hover:border-indigo-500/50 hover:bg-[#0d1222]/80'
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            id="resume-file-input"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px] shadow-xl shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0a0d1a] rounded-[14px] flex items-center justify-center">
              <Upload className={`w-7 h-7 text-indigo-400 ${uploading ? 'animate-bounce' : ''}`} />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {uploading ? 'Parsing PDF Text & Computing ATS Score...' : 'Drag & Drop PDF Resume'}
            </h3>
            <p className="text-xs text-slate-400">
              Supports single or multi-page engineering PDF resumes up to 10MB • Auto-synced to MongoDB
            </p>
          </div>

          <label
            htmlFor="resume-file-input"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 cursor-pointer transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{uploading ? 'Analyzing Resume...' : 'Select PDF File'}</span>
          </label>
        </div>

        {/* Loaded Profile Insights */}
        {profile && (
          <div className="space-y-8">
            
            {/* Top Stat Cards: ATS Score, Role Fit, Skills Count, Synced Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* ATS Overall Score Card */}
              <div className="p-5 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">ATS Health Score</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Gauge className="w-4 h-4" />
                  </div>
                </div>
                <div className="pt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{atsScore}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${
                    atsScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {atsScore >= 80 ? 'ATS Optimized' : 'Needs Polish'}
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${atsScore}%` }}
                  />
                </div>
              </div>

              {/* Detected Role Fit Card */}
              <div className="p-5 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Primary Role Fit</span>
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-bold text-white truncate">{profile.detected_role_fit || "Full Stack Engineer"}</p>
                  <p className="text-[11px] text-slate-400 pt-0.5">{profile.candidate_name}</p>
                </div>
                <div className="text-[10px] text-violet-400 font-mono pt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Targeted for AI Interviews</span>
                </div>
              </div>

              {/* Skills Extracted Card */}
              <div className="p-5 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Tech Keywords</span>
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="pt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{profile.skills?.length || 0}</span>
                  <span className="text-xs text-slate-400">technologies indexed</span>
                </div>
                <div className="text-[10px] text-cyan-400 font-mono pt-2">
                  <span>Across 5 distinct domains</span>
                </div>
              </div>

              {/* Cloud Database Sync Status */}
              <div className="p-5 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Database Persistence</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Database className="w-4 h-4" />
                  </div>
                </div>
                <div className="pt-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>MongoDB Atlas Synced</span>
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1.5 truncate">File: {profile.file_name || 'Resume.pdf'}</p>
                </div>
              </div>

            </div>

            {/* Main Tabs Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setActiveTab('executive')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'executive'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive ATS Intelligence</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'skills'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Skill Matrix ({profile.skills?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Projects & Impact Metrics ({profile.projects?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('experience')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'experience'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Experience & Education</span>
              </button>

              <button
                onClick={() => setActiveTab('raw')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'raw'
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Raw PyMuPDF Text</span>
              </button>
            </div>

            {/* TAB 1: EXECUTIVE INTELLIGENCE & ATS AUDIT */}
            {activeTab === 'executive' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left 7 cols: ATS Breakdown & AI Bullet Optimizer */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* ATS Diagnostic Breakdown Card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        ATS Dimensional Diagnostic Breakdown
                      </h3>
                      <span className="text-xs text-indigo-400 font-mono font-bold">Standard 4-Pillar Model</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Measurable Impact</span>
                          <span className="font-bold text-white font-mono">{breakdown.impact_score}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${breakdown.impact_score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-500">Quantifiable metrics, scale, and performance indicators</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Keyword Density</span>
                          <span className="font-bold text-white font-mono">{breakdown.keyword_density}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${breakdown.keyword_density}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-500">Industry-standard tech stack & framework recognition</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Structure & Brevity</span>
                          <span className="font-bold text-white font-mono">{breakdown.structure_score}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-violet-400 h-full rounded-full" style={{ width: `${breakdown.structure_score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-500">Clean sections, readable layout, contact details</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Skill Depth & Breadth</span>
                          <span className="font-bold text-white font-mono">{breakdown.skills_depth}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${breakdown.skills_depth}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-500">Cross-functional stack: front, back, database, cloud</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Resume Bullet Enhancer (Google XYZ Formula) */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Zap className="w-5 h-5 text-amber-400" />
                          AI Resume Bullet Enhancer (Google XYZ Formula)
                        </h3>
                        <p className="text-xs text-slate-400">
                          Transforms passive descriptions into high-impact accomplishment bullets: "Accomplished [X] measured by [Y] by doing [Z]"
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      {(profile.enhanced_bullets || []).map((bullet, idx) => (
                        <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                          <div className="text-xs space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Original Bullet:</span>
                            <p className="text-slate-400 italic font-mono text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                              "{bullet.original}"
                            </p>
                          </div>

                          <div className="text-xs space-y-1 pt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                Recommended XYZ Upgrade:
                              </span>
                              <button
                                onClick={() => copyToClipboard(bullet.improved, idx)}
                                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                {copiedBulletIdx === idx ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Bullet</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-slate-200 font-medium text-xs bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/20 leading-relaxed">
                              {bullet.improved}
                            </p>
                          </div>

                          <div className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg inline-block">
                            {bullet.impact_factor}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right 5 cols: Strengths, Fix Checklist & Action Button */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Strengths Card */}
                  <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Detected Resume Strengths
                    </h3>
                    <ul className="space-y-2 pt-1 text-xs text-slate-300">
                      {(profile.strengths || []).map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/15 p-2.5 rounded-xl">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      ATS Optimization Checklist
                    </h3>
                    <ul className="space-y-2 pt-1 text-xs text-slate-300">
                      {(profile.improvement_suggestions || []).map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/15 p-2.5 rounded-xl">
                          <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick JD Matcher Callout */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-violet-950/30 to-[#0b0e1b] border border-indigo-500/30 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      <span>Next Step: ATS Job Match</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-white">Compare Against Target Job Descriptions</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Use our semantic ATS Matcher to calculate your match % with Stripe, Vercel, or custom job descriptions.
                    </p>
                    <Link
                      to="/jd-analyzer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200 pt-1"
                    >
                      <span>Open ATS Job Matcher</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: CATEGORIZED SKILL MATRIX */}
            {activeTab === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Languages */}
                <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Terminal className="w-4 h-4" />
                    <span>Programming Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(profile.programming_languages || []).map((tech, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                    {!profile.programming_languages?.length && (
                      <span className="text-xs text-slate-500">None detected</span>
                    )}
                  </div>
                </div>

                {/* Frameworks & Tools */}
                <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-violet-400 font-bold text-xs">
                    <Layers className="w-4 h-4" />
                    <span>Frameworks & Libraries</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(profile.frameworks_and_tools || []).map((tech, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Databases */}
                <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Database className="w-4 h-4" />
                    <span>Databases & Storage</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(profile.databases || []).map((tech, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cloud & DevOps */}
                <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Cloud className="w-4 h-4" />
                    <span>Cloud, DevOps & CI/CD</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(profile.cloud_and_devops || []).map((tech, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                    {!profile.cloud_and_devops?.length && (
                      <span className="text-xs text-slate-500">Add Docker, AWS, or GitHub Actions to strengthen ATS score</span>
                    )}
                  </div>
                </div>

                {/* AI & Data */}
                <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Cpu className="w-4 h-4" />
                    <span>AI, Machine Learning & Data</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(profile.ai_and_data || []).map((tech, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                    {!profile.ai_and_data?.length && (
                      <span className="text-xs text-slate-500">General SWE track</span>
                    )}
                  </div>
                </div>

                {/* All Extracted Skills */}
                <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Complete Skill Vocabulary</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2 max-h-48 overflow-y-auto">
                    {(profile.skills || []).map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: PROJECTS & QUANTIFIED METRICS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                
                {/* Quantified Metrics Highlight Bar */}
                {profile.quantified_metrics?.length > 0 && (
                  <div className="p-6 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      Quantified Engineering Achievements Extracted
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {profile.quantified_metrics.map((m, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(profile.projects || []).map((proj, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                            Project #{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-slate-850">
                        <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Technologies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(proj.technologies || []).map((tech, tIdx) => (
                            <span key={tIdx} className="text-[10px] font-mono font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 4: EXPERIENCE & EDUCATION */}
            {activeTab === 'experience' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Experience Timeline */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-400" />
                      Experience Timeline
                    </h3>

                    <div className="space-y-4 pt-2">
                      {(profile.experience || []).map((exp, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                              <p className="text-xs text-indigo-400 font-semibold">{exp.company}</p>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                              {exp.duration}
                            </span>
                          </div>
                          
                          <ul className="space-y-1.5 text-xs text-slate-300 pt-2">
                            {(exp.highlights || []).map((item, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2">
                                <span className="text-indigo-400 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Education & Certs */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-violet-400" />
                      Education & Certifications
                    </h3>

                    <div className="space-y-3 pt-1">
                      {(profile.education || []).map((edu, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                          <div className="font-bold text-white">{edu.degree}</div>
                          <div className="text-slate-400 flex justify-between pt-0.5">
                            <span>{edu.institution}</span>
                            <span className="font-mono text-indigo-400 font-bold">{edu.year}</span>
                          </div>
                        </div>
                      ))}

                      {(profile.certifications || []).map((cert, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-violet-950/20 border border-violet-500/20 text-xs flex items-center gap-2.5 text-violet-200">
                          <Award className="w-4 h-4 text-violet-400 shrink-0" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: RAW PyMuPDF TEXT */}
            {activeTab === 'raw' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0b0e1b] border border-slate-800/80 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    Extracted Text Stream ({profile.raw_text?.length || 0} characters)
                  </span>
                  <button
                    onClick={() => copyToClipboard(profile.raw_text || '', 'raw')}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedBulletIdx === 'raw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBulletIdx === 'raw' ? 'Copied' : 'Copy All'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 font-mono text-xs text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
                  {profile.raw_text}
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
