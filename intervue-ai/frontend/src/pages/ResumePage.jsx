import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, Trash2, Sparkles, Code2, Briefcase, GraduationCap, Award, AlertCircle, RefreshCw, Layers, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import { resumeAPI } from '../services/api';

export default function ResumePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('parsed'); // 'parsed' or 'raw'

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
    if (!file.name.toLowerCase().endswith?.('.pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col w-full font-sans">
      <DashboardNavbar />

      <main className="flex-grow w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              Resume Intelligence Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Upload your PDF resume to train the AI interviewer on your actual projects, tech stack, and career background.
            </p>
          </div>

          {profile && (
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Resume</span>
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Drag and Drop Dropzone Card */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative p-8 sm:p-10 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center space-y-4 shadow-xl shadow-slate-200/50 ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
              : 'border-slate-300 bg-white hover:border-indigo-400'
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            id="resume-file-input"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
              <Upload className={`w-8 h-8 text-indigo-600 ${uploading ? 'animate-bounce' : ''}`} />
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {uploading ? 'Parsing PDF Resume Text & Skills...' : 'Drag & Drop Your PDF Resume Here'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports single or multi-page engineering PDF resumes up to 10MB
            </p>
          </div>

          <label
            htmlFor="resume-file-input"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 cursor-pointer transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{uploading ? 'Processing PDF...' : 'Select PDF File'}</span>
          </label>
        </div>

        {/* Parsed Profile Viewer Section */}
        {profile && (
          <div className="space-y-6">
            {/* View Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('parsed')}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'parsed' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Structured Candidate Intelligence</span>
                </button>
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'raw' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Raw PyMuPDF Extracted Text</span>
                </button>
              </div>

              <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Context Synced with AI Interviewer
              </span>
            </div>

            {activeTab === 'parsed' ? (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left 7 cols: Skills & Projects */}
                <div className="xl:col-span-7 space-y-8">
                  {/* Extracted Skills Cloud */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-xl shadow-slate-200/50">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-indigo-600" />
                      Extracted Technical Stack & Skills
                    </h3>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold shadow-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Extracted Projects Deep Dive */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-xl shadow-slate-200/50">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-violet-600" />
                      Project Portfolio (AI Deep-Dive Targets)
                    </h3>
                    <p className="text-xs text-slate-500">
                      The AI interviewer will ask specific architectural & trade-off questions about these projects:
                    </p>

                    <div className="space-y-4 pt-2">
                      {profile.projects.map((proj, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.technologies.map((tech, tIdx) => (
                              <span key={tIdx} className="text-[10px] font-mono font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-100 shadow-xs">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 5 cols: Work Experience & Education */}
                <div className="xl:col-span-5 space-y-8">
                  {/* Experience Timeline */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-xl shadow-slate-200/50">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      Experience Timeline
                    </h3>

                    <div className="space-y-4 pt-2">
                      {profile.experience.map((exp, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{exp.title}</h4>
                            <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{exp.duration}</span>
                          </div>
                          <p className="text-xs text-indigo-600 font-bold">{exp.company}</p>
                          <ul className="space-y-1 text-xs text-slate-600 pt-1">
                            {exp.highlights.map((item, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-xl shadow-slate-200/50">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-violet-600" />
                      Education & Certifications
                    </h3>

                    <div className="space-y-3 pt-1">
                      {profile.education.map((edu, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                          <div className="font-bold text-slate-900">{edu.degree}</div>
                          <div className="text-slate-500 flex justify-between">
                            <span>{edu.institution}</span>
                            <span className="font-mono font-semibold text-indigo-600">{edu.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Raw PyMuPDF Text tab */
              <div className="p-6 rounded-3xl bg-white border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed overflow-x-auto max-h-[500px] whitespace-pre-wrap shadow-xl">
                {profile.raw_text}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
