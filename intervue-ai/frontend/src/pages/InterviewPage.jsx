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

  // Hands-Free Auto Voice Loop State
  const [autoVoiceMode, setAutoVoiceMode] = useState(true);

  // AI Micro-Hint Drawer state
  const [hintLevel, setHintLevel] = useState(0);
  const [currentHint, setCurrentHint] = useState(null);
  const [fetchingHint, setFetchingHint] = useState(false);

  // Voice recording & Silence Auto-Submit Timer state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const latestAnswerRef = useRef('');
  const autoSubmitTimerRef = useRef(null);
  const autoVoiceModeRef = useRef(true);
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

        // Hands-free Silence Auto-Submit Timer (Triggers submit after 2.2s of silence post-speech)
        if (autoVoiceModeRef.current && spoken.length > 5 && !submittingRef.current) {
          if (autoSubmitTimerRef.current) clearTimeout(autoSubmitTimerRef.current);
          autoSubmitTimerRef.current = setTimeout(() => {
            if (latestAnswerRef.current && latestAnswerRef.current.trim().length > 3) {
              handleSendAnswerAuto();
            }
          }, 2200);
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
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col w-full font-sans overflow-hidden select-none">
      
      {/* Top Header Bar (Intervue Style) */}
      <div className="h-14 bg-[#0a0d14] border-b border-slate-800/80 px-6 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-white tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Intervue</span>
          </div>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 font-bold">{session.track_title}</span>
        </div>

        {/* Live Audio Auto-readout Controller */}
        <VoiceInterviewerControls latestInterviewerMessage={latestMessage} />

        <div className="flex items-center gap-4">
          {/* Hands-Free Auto Voice Mode Toggle */}
          <button
            onClick={() => setAutoVoiceMode(!autoVoiceMode)}
            className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              autoVoiceMode
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Hands-Free Voice: {autoVoiceMode ? 'ON' : 'OFF'}</span>
          </button>

          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <button
            onClick={handleFinishInterview}
            disabled={ending}
            className="text-[11px] font-mono font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            {ending ? 'ENDING...' : 'END SESSION'}
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Audio Waveform Room & Canvas */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between items-center relative bg-[#07090e]">
          
          {/* Top Switcher Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#0d1117] rounded-xl border border-slate-800 z-10">
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'voice' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Room</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'code' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Monaco Code IDE</span>
            </button>

            <button
              onClick={() => setActiveTab('system_design')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'system_design' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>System Design</span>
            </button>
          </div>

          {/* ACTIVE TAB CONTENT */}
          {activeTab === 'voice' && (
            <div className="w-full flex-grow flex flex-col items-center justify-center space-y-10 my-auto">
              
              {/* INTERVIEW IN PROGRESS Header */}
              <div className="text-center space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                  INTERVIEW IN PROGRESS
                </div>
                <h3 className="text-sm text-slate-400 font-mono">
                  {isListening ? "• You're speaking..." : "• Interviewer is speaking"}
                </h3>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-20 w-full max-w-md">
                {[40, 70, 45, 90, 60, 100, 75, 50, 85, 65, 95, 55, 80, 40, 90, 60].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isListening ? [`${h * 0.3}%`, `${h}%`, `${h * 0.3}%`] : [`${h * 0.4}%`, `${h * 0.7}%`, `${h * 0.4}%`]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.05,
                      ease: 'easeInOut'
                    }}
                    className={`w-2 rounded-full ${isListening ? 'bg-cyan-400' : 'bg-emerald-500'}`}
                  />
                ))}
              </div>

              {/* Active Persona Pill Card */}
              <div className="p-3 px-5 rounded-2xl bg-[#0d1117] border border-slate-800/90 flex items-center gap-3 shadow-xl">
                <div className={`w-8 h-8 rounded-xl ${persona.badgeBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {persona.badge}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>AI Interviewer</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {persona.name} ({persona.type})
                  </div>
                </div>
              </div>

              {/* Spoken Text Live Streaming Preview */}
              {answerText && (
                <div className="max-w-lg p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-emerald-300 text-center">
                  "{answerText}"
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="w-full flex-grow py-4">
              <MonacoCodeEditor
                code={codeSnippet}
                setCode={setCodeSnippet}
                language={codeLanguage}
                setLanguage={setCodeLanguage}
              />
            </div>
          )}

          {activeTab === 'system_design' && (
            <div className="w-full flex-grow py-4">
              <SystemDesignWhiteboard />
            </div>
          )}

          {/* Bottom Control Bar */}
          <div className="w-full pt-4 flex items-center justify-center gap-4 border-t border-slate-800/60">
            <button
              onClick={toggleVoiceRecording}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-[#0d1117] border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isListening ? 'STOP RECORDING' : 'START SPEECH RECORDING'}</span>
            </button>

            {(answerText.trim() || codeSnippet.trim()) && (
              <button
                onClick={handleSendAnswer}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono shadow-lg flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {submitting ? 'SENDING...' : 'SUBMIT RESPONSE →'}
              </button>
            )}

            <button
              onClick={handleFinishInterview}
              disabled={ending}
              className="px-5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-rose-400 font-bold text-xs font-mono cursor-pointer transition-colors"
            >
              END INTERVIEW
            </button>
          </div>
        </div>

        {/* Right Side: LIVE TRANSCRIPT Stream */}
        <div className="lg:col-span-4 bg-[#0a0d14] border-t lg:border-t-0 lg:border-l border-slate-800/80 p-6 flex flex-col justify-between h-full">
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold pb-3 border-b border-slate-800/60 flex items-center justify-between">
              <span>TRANSCRIPT</span>
              <span className="text-[10px] text-emerald-400 font-normal">HANDS-FREE ACTIVE</span>
            </div>

            {/* Scrollable Chat Stream */}
            <div className="py-4 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {session.messages.map((msg) => {
                const isAI = msg.sender === 'interviewer';
                return (
                  <div key={msg.id} className="space-y-1 text-left text-xs leading-relaxed font-sans">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span className={isAI ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                        {isAI ? `[${persona.name}]` : '[YOU]'}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className={`p-3 rounded-xl ${isAI ? 'bg-slate-900/80 text-slate-200 border border-slate-800/80' : 'bg-emerald-950/40 text-emerald-100 border border-emerald-500/30'}`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.code_snippet && (
                        <div className="mt-2 p-2 rounded bg-slate-950 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-slate-800">
                          <code>{msg.code_snippet}</code>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/60 text-[10px] font-mono text-slate-500 text-center">
            Hands-Free Continuous Voice Loop Enabled • Powered by Intervue Engine
          </div>
        </div>

      </div>
    </div>
  );
}
