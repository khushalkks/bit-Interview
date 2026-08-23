import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, User, Send, Mic, MicOff, Code2, Sparkles, Clock, ArrowLeft,
  CheckCircle2, AlertTriangle, Zap, Award, Volume2, VolumeX, RefreshCw, FileCode, Layers, Radio
} from 'lucide-react';
import { interviewAPI } from '../services/api';
import DashboardNavbar from '../components/DashboardNavbar';
import MonacoCodeEditor from '../components/MonacoCodeEditor';
import VoiceInterviewerControls from '../components/VoiceInterviewerControls';
import SystemDesignWhiteboard from '../components/SystemDesignWhiteboard';

const PERSONA_CONFIG = {
  Sarah: { name: 'Sarah', badge: 'S', badgeBg: 'bg-emerald-600', type: 'Supportive' },
  Daniel: { name: 'Daniel', badge: 'D', badgeBg: 'bg-indigo-600', type: 'Corporate' },
  Fin: { name: 'Fin', badge: 'F', badgeBg: 'bg-teal-600', type: 'Pressure' },
  Clyde: { name: 'Clyde', badge: 'C', badgeBg: 'bg-rose-600', type: 'Probing' },
};

export default function InterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [summary, setSummary] = useState(null);

  // Input states
  const [answerText, setAnswerText] = useState('');
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' | 'text' | 'code' | 'system_design'
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  // Hands-Free Auto Voice Loop State (Set to FALSE by default so candidate has full control)
  const [autoVoiceMode, setAutoVoiceMode] = useState(false);

  // AI Micro-Hint Drawer state
  const [hintLevel, setHintLevel] = useState(0);
  const [currentHint, setCurrentHint] = useState(null);
  const [fetchingHint, setFetchingHint] = useState(false);

  // Voice recording state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const latestAnswerRef = useRef('');
  const autoSubmitTimerRef = useRef(null);
  const autoVoiceModeRef = useRef(false);
  const submittingRef = useRef(false);

  // Keep refs synced
  useEffect(() => {
    latestAnswerRef.current = answerText;
  }, [answerText]);

  useEffect(() => {
    autoVoiceModeRef.current = autoVoiceMode;
  }, [autoVoiceMode]);

  useEffect(() => {
    submittingRef.current = submitting;
  }, [submitting]);

  // Session timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const chatEndRef = useRef(null);

  // Load session data
  useEffect(() => {
    async function loadSession() {
      try {
        const data = await interviewAPI.getSession(sessionId);
        setSession(data);
        if (data.track_title && data.track_title.toLowerCase().includes('system')) {
          setActiveTab('system_design');
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [sessionId]);

  // Auto-scroll chat transcript stream to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  // Web Speech API Initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          if (result.isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const baseline = baseTextRef.current ? baseTextRef.current.trim() : '';
        const spoken = (finalTranscript + interimTranscript).trim();
        const combined = baseline ? (spoken ? baseline + ' ' + spoken : baseline) : spoken;

        setAnswerText(combined);

        // Auto-submit timer ONLY if candidate explicitly turned on autoVoiceMode
        if (autoVoiceModeRef.current && spoken.length > 25 && !submittingRef.current) {
          if (autoSubmitTimerRef.current) clearTimeout(autoSubmitTimerRef.current);
          autoSubmitTimerRef.current = setTimeout(() => {
            if (latestAnswerRef.current && latestAnswerRef.current.trim().length > 10) {
              handleSendAnswerAuto();
            }
          }, 4500);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (autoSubmitTimerRef.current) clearTimeout(autoSubmitTimerRef.current);
    };
  }, []);

  // Session timer ticker
  useEffect(() => {
    if (session && session.status === 'active' && !summary) {
      const timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [session, summary]);

  // Hands-free Auto-Listen when new AI Question arrives
  useEffect(() => {
    if (session && autoVoiceMode && activeTab === 'voice' && !submitting) {
      const lastMsg = session.messages[session.messages.length - 1];
      if (lastMsg && lastMsg.sender === 'interviewer') {
        const timer = setTimeout(() => {
          if (!isListening && recognitionRef.current) {
            startListening();
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [session?.messages, autoVoiceMode, activeTab]);

  function startListening() {
    if (!recognitionRef.current) return;
    baseTextRef.current = answerText;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      // ignore if already active
    }
  }

  function stopListening() {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (err) {
      // ignore
    }
    setIsListening(false);
  }

  function toggleVoiceRecording() {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome or Edge.');
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  async function handleSendAnswerAuto() {
    if (autoSubmitTimerRef.current) clearTimeout(autoSubmitTimerRef.current);
    const currAns = latestAnswerRef.current;
    if (!currAns.trim() && !codeSnippet.trim()) return;
    await executeSubmit(currAns);
  }

  async function handleSendAnswer(e) {
    if (e) e.preventDefault();
    if (autoSubmitTimerRef.current) clearTimeout(autoSubmitTimerRef.current);
    if (!answerText.trim() && !codeSnippet.trim()) return;
    await executeSubmit(answerText);
  }

  async function executeSubmit(textToSend) {
    stopListening();
    baseTextRef.current = '';

    setSubmitting(true);
    try {
      const updatedSession = await interviewAPI.submitAnswer(
        sessionId,
        textToSend,
        codeSnippet ? codeSnippet : null,
        codeSnippet ? codeLanguage : null
      );
      setSession(updatedSession);
      setAnswerText('');
      setCodeSnippet('');
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFinishInterview() {
    if (!window.confirm('Are you sure you want to finish this interview round and generate your scorecard?')) return;
    setEnding(true);
    try {
      const scoreData = await interviewAPI.endSession(sessionId);
      setSummary(scoreData);
      navigate(`/interview/${sessionId}/report`);
    } catch (err) {
      console.error('Failed to end session:', err);
      alert(err.message || 'Failed to finish session.');
    } finally {
      setEnding(false);
    }
  }

  const formatTimer = (totalSec) => {
    const totalDurationSec = 30 * 60;
    const rem = Math.max(0, totalDurationSec - totalSec);
    const mins = Math.floor(rem / 60);
    const secs = rem % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-slate-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Entering Intervue Live Room...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-white p-6 space-y-4 font-sans">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold">Interview Session Not Found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm transition-colors shadow-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const activePersonaName = session.persona || 'Sarah';
  const persona = PERSONA_CONFIG[activePersonaName] || PERSONA_CONFIG.Sarah;
  const latestMessage = session?.messages?.filter((m) => m.sender === 'interviewer').slice(-1)[0]?.content;

  return (
    <div className="min-h-screen bg-[#060913] text-white flex flex-col w-full font-sans overflow-hidden select-none relative">
      {/* Background Ambient Mesh */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Bar (Studio Navigation) */}
      <div className="h-16 bg-[#090d19]/90 border-b border-slate-800/90 px-6 flex items-center justify-between text-xs font-mono relative z-20 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#060913] rounded-[11px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wide text-xs">Bit-Interview Live</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-[10px] text-slate-400 font-sans">
                {session.track_title} • {session.target_role || 'Senior SWE'}
              </div>
            </div>
          </div>
        </div>

        {/* Live Audio Auto-readout Controller */}
        <VoiceInterviewerControls latestInterviewerMessage={latestMessage} />

        <div className="flex items-center gap-4">
          {/* Timer Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          {/* End Session Button */}
          <button
            onClick={handleFinishInterview}
            disabled={ending}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono transition-all cursor-pointer disabled:opacity-50"
          >
            {ending ? 'ENDING...' : 'END SESSION'}
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative z-10">
        
        {/* Left Side: Audio Waveform Room & Workspace (8 Cols) */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between items-center relative bg-[#060913]/60 backdrop-blur-xl">
          
          {/* Top Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800/90 z-10 shadow-xl">
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'voice' 
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'code' 
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Monaco Code IDE</span>
            </button>

            <button
              onClick={() => setActiveTab('system_design')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'system_design' 
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md shadow-cyan-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>System Architecture</span>
            </button>
          </div>          {/* ACTIVE TAB CONTENT */}
          {activeTab === 'voice' && (
            <div className="w-full flex-grow flex flex-col items-center justify-center space-y-10 my-auto max-w-2xl px-4">
              
              {/* Header Status */}
              <div className="text-center space-y-1 select-none">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[10px] font-mono tracking-wider font-semibold mb-1 shadow-md animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Real-Time Voice Session Active</span>
                </div>
                <h3 className="text-xs text-slate-400 font-mono tracking-wide">
                  {isListening ? "• Speaking into Microphone..." : "• AI Assessor Listening"}
                </h3>
              </div>

              {/* Futuristic Glowing AI Orb Container */}
              <div className="relative w-72 h-72 flex items-center justify-center my-2 select-none">
                {/* Outer Ripple Ring 3 */}
                <motion.div
                  animate={{ scale: [1, 1.35, 1], opacity: [0.15, 0.02, 0.15] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-full h-full rounded-full border border-indigo-500/15 pointer-events-none"
                />
                
                {/* Outer Ripple Ring 2 */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.04, 0.25] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute w-[80%] h-[80%] rounded-full border border-violet-500/15 pointer-events-none"
                />

                {/* Outer Ripple Ring 1 */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.08, 0.35] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute w-[65%] h-[65%] rounded-full border border-cyan-500/20 pointer-events-none"
                />

                {/* Core Glowing Orb */}
                <motion.div
                  animate={{
                    boxShadow: isListening 
                      ? [
                          "0 0 25px rgba(6,182,212,0.2), inset 0 0 15px rgba(6,182,212,0.15)",
                          "0 0 50px rgba(99,102,241,0.5), inset 0 0 30px rgba(99,102,241,0.4)",
                          "0 0 25px rgba(6,182,212,0.2), inset 0 0 15px rgba(6,182,212,0.15)"
                        ]
                      : [
                          "0 0 30px rgba(99,102,241,0.2), inset 0 0 15px rgba(99,102,241,0.2)",
                          "0 0 45px rgba(139,92,246,0.35), inset 0 0 25px rgba(139,92,246,0.3)",
                          "0 0 30px rgba(99,102,241,0.2), inset 0 0 15px rgba(99,102,241,0.2)"
                        ],
                    scale: isListening ? [0.98, 1.03, 0.98] : [1, 1.01, 1]
                  }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  className={`w-[45%] h-[45%] rounded-full bg-gradient-to-tr ${
                    isListening 
                      ? 'from-[#0891b2] via-[#4f46e5] to-[#a855f7]' 
                      : 'from-[#1e1b4b] via-[#311c6d] to-[#0f172a]'
                  } flex flex-col items-center justify-center relative border border-white/10 z-10 shadow-2xl`}
                >
                  <Bot className={`w-9 h-9 ${isListening ? 'text-cyan-200 animate-pulse' : 'text-indigo-200'}`} />
                  
                  {/* Rotating decorative ticks */}
                  <div className="absolute inset-[-8px] rounded-full border border-white/5 animate-spin" style={{ animationDuration: '14s' }} />
                </motion.div>
                
                {/* Active pulse glow state indicator */}
                <div className="absolute top-[28%] right-[28%] z-20">
                  <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-cyan-400 shadow-cyan-400' : 'bg-indigo-400 shadow-indigo-400'} shadow-[0_0_8px] block animate-pulse`} />
                </div>
              </div>

              {/* Sound Wave Animation Bars (Modern Segmented wave) */}
              <div className="p-6 rounded-2xl bg-[#090b13]/85 border border-slate-800/80 shadow-2xl backdrop-blur-xl w-full flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center justify-center gap-1.5 h-16 w-full px-4">
                  {[25, 55, 35, 80, 50, 90, 65, 40, 95, 55, 85, 45, 75, 35, 70, 50, 65, 40].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isListening ? [`${h * 0.2}%`, `${h}%`, `${h * 0.2}%`] : ["15%", "35%", "15%"]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.03,
                        ease: 'easeInOut'
                      }}
                      className={`w-2 rounded-full ${
                        isListening 
                          ? 'bg-gradient-to-t from-cyan-400 via-indigo-500 to-violet-500' 
                          : 'bg-slate-850'
                      }`}
                    />
                  ))}
                </div>

                {/* Active Persona Pill Badge */}
                <div className="flex items-center gap-3.5 py-2.5 px-5 rounded-xl bg-slate-950/60 border border-slate-900 shadow-lg">
                  <div className={`w-8.5 h-8.5 rounded-xl ${persona.badgeBg} flex items-center justify-center text-white font-extrabold text-xs shadow-md shrink-0`}>
                    {persona.badge}
                  </div>
                  <div className="text-left font-sans">
                    <div className="text-xs font-extrabold text-white flex items-center gap-2">
                      <span>Interviewer: {persona.name}</span>
                      <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest animate-pulse">
                        <Radio className="w-2.5 h-2.5 text-emerald-400" /> Live
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      {persona.type} Personality • Calibrating Response Depth
                    </div>
                  </div>
                </div>
              </div>

              {/* Spoken Text Live Streaming Preview */}
              {answerText && (
                <div className="w-full p-4 rounded-xl bg-[#090b13]/80 border border-indigo-500/20 text-xs font-mono text-indigo-200 text-center shadow-lg backdrop-blur-md">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold tracking-wider mb-1">Live Dictation Transcript</span>
                  "{answerText}"
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="w-full flex-grow py-2">
              <MonacoCodeEditor
                code={codeSnippet}
                setCode={setCodeSnippet}
                language={codeLanguage}
                setLanguage={setCodeLanguage}
              />
            </div>
          )}

          {activeTab === 'system_design' && (
            <div className="w-full flex-grow py-2">
              <SystemDesignWhiteboard />
            </div>
          )}

          {/* Bottom Control & Input Bar */}
          <div className="w-full pt-4 space-y-3 border-t border-slate-800/80">
            {/* Input Box Row */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-indigo-500/40'
                }`}
                title={isListening ? 'Stop Mic Recording' : 'Start Speech Dictation'}
              >
                {isListening ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5 text-indigo-400" />}
              </button>

              <div className="flex-grow relative">
                <textarea
                  rows={2}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your response here or click mic to dictate..."
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-indigo-500 rounded-2xl p-3 pr-10 text-xs text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none font-sans"
                />
                {answerText && (
                  <button
                    type="button"
                    onClick={() => setAnswerText('')}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={handleSendAnswer}
                disabled={submitting || (!answerText.trim() && !codeSnippet.trim())}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 shrink-0"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <span>Submit Response</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: LIVE TRANSCRIPT Stream (4 Cols) */}
        <div className="lg:col-span-4 bg-[#07090f]/75 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-6 flex flex-col justify-between h-full backdrop-blur-2xl relative">
          <div className="absolute inset-0 bg-[#090b12]/30 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-bold pb-3.5 border-b border-slate-850 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                Live Conversation Stream
              </span>
              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold animate-pulse">
                ACTIVE
              </span>
            </div>

            {/* Scrollable Chat Stream */}
            <div className="py-4 space-y-4 max-h-[calc(100vh-210px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {session.messages.map((msg) => {
                const isAI = msg.sender === 'interviewer';
                return (
                  <div key={msg.id} className="space-y-1.5 text-left text-xs leading-relaxed font-sans">
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span className={isAI ? 'text-indigo-400 font-bold flex items-center gap-1' : 'text-cyan-400 font-bold flex items-center gap-1'}>
                        {isAI ? <Bot className="w-3.5 h-3.5 text-indigo-450" /> : <User className="w-3.5 h-3.5 text-cyan-455" />}
                        {isAI ? persona.name : 'Candidate'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className={`p-4 rounded-2xl border ${
                      isAI 
                        ? 'bg-gradient-to-r from-slate-900/90 to-[#101424]/90 border-indigo-500/15 text-slate-200 shadow-[0_4px_20px_rgba(99,102,241,0.04)]' 
                        : 'bg-gradient-to-r from-[#0d162a]/90 to-[#0e1f37]/90 border-cyan-500/20 text-slate-100 shadow-[0_4px_20px_rgba(6,182,212,0.03)]'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      {msg.code_snippet && (
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-300 overflow-x-auto border border-slate-800">
                          <code>{msg.code_snippet}</code>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Submission visual state simulator */}
              {submitting && (
                <div className="space-y-1.5 text-left text-xs font-sans">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span className="text-indigo-400 font-bold flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5 text-indigo-455" />
                      {persona.name}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-[#101424]/90 border border-indigo-500/15 text-slate-400 flex items-center gap-2 shadow-md">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">Analyzing answer technical depth...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-850 text-[10px] font-mono text-slate-500 text-center flex items-center justify-between relative z-10">
            <span>Bit-Interview Engine v2.0</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Secure Live Feed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
