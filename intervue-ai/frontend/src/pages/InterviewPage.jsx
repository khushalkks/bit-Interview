import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, User, Send, Mic, MicOff, Code2, Sparkles, Clock, ArrowLeft, CheckCircle2,
  AlertTriangle, ShieldCheck, RefreshCw, BarChart2, Award, Zap, ChevronRight, FileCode, Check
} from 'lucide-react';
import { interviewAPI } from '../services/api';
import DashboardNavbar from '../components/DashboardNavbar';
import MonacoCodeEditor from '../components/MonacoCodeEditor';
import VoiceInterviewerControls from '../components/VoiceInterviewerControls';
import ProctoringWidget from '../components/ProctoringWidget';

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
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'code'
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  // Voice recording state (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Session timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const chatEndRef = useRef(null);

  // Load session data
  useEffect(() => {
    async function loadSession() {
      try {
        const data = await interviewAPI.getSession(sessionId);
        setSession(data);
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [sessionId]);

  // Session timer ticker
  useEffect(() => {
    if (session && session.status === 'active' && !summary) {
      const timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [session, summary]);

  // Auto-scroll chat stream to bottom
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
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setAnswerText((prev) => (prev ? prev + ' ' + currentTranscript : currentTranscript));
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  function toggleVoiceRecording() {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }

  async function handleSendAnswer(e) {
    if (e) e.preventDefault();
    if (!answerText.trim() && !codeSnippet.trim()) return;

    setSubmitting(true);
    try {
      const updatedSession = await interviewAPI.submitAnswer(
        sessionId,
        answerText,
        codeSnippet ? codeSnippet : null,
        codeSnippet ? codeLanguage : null
      );
      setSession(updatedSession);
      setAnswerText('');
      setCodeSnippet('');
    } catch (err) {
      console.error('Failed to submit answer:', err);
      alert(err.message || 'Failed to submit answer');
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
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-600 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Entering Adaptive AI Interview Console...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-slate-800 p-6 space-y-4 font-sans">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold">Interview Session Not Found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm transition-colors shadow-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col w-full font-sans overflow-x-hidden">
      <DashboardNavbar />

      {/* Main Console Workspace */}
      <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col space-y-6">

        {/* Live Session Header */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                  {session.track_title}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200 font-semibold">
                  Role: {session.target_role}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                Adaptive AI Room <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </h1>
            </div>
          </div>

          {/* Center Status Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* AI Voice Readout Controls */}
            <VoiceInterviewerControls
              latestInterviewerMessage={session?.messages?.filter(m => m.sender === 'interviewer').slice(-1)[0]?.content}
            />

            {/* Timer */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-xs font-mono font-semibold">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>{formatTimer(secondsElapsed)}</span>
            </div>

            {/* Current Difficulty Level */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold">
              <Zap className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span className="text-slate-500">Difficulty:</span>
              <span className={`font-mono ${
                session.current_difficulty === 'Advanced' ? 'text-rose-600' :
                session.current_difficulty === 'Hard' ? 'text-purple-600' :
                session.current_difficulty === 'Medium' ? 'text-indigo-600' : 'text-emerald-600'
              }`}>
                {session.current_difficulty}
              </span>
            </div>
          </div>

          {/* End Session CTA */}
          <button
            onClick={handleFinishInterview}
            disabled={ending || summary}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/20 flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] cursor-pointer"
          >
            {ending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>Finish Session & Scorecard</span>
              </>
            )}
          </button>
        </div>

        {/* Main Conversation Stream */}
        <div className="flex-grow min-h-[420px] max-h-[560px] overflow-y-auto p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-6 scrollbar-thin scrollbar-thumb-slate-300">
          {session.messages.map((msg) => {
            const isAI = msg.sender === 'interviewer';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-4 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-0.5 shrink-0 shadow-md shadow-indigo-500/20">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-indigo-600">
                      <Bot className="w-5 h-5" />
                    </div>
                  </div>
                )}

                <div className={`max-w-3xl space-y-2 ${isAI ? 'text-left' : 'text-right'}`}>
                  {/* Message Metadata */}
                  <div className={`flex items-center gap-2 text-[11px] text-slate-500 ${isAI ? '' : 'justify-end'}`}>
                    <span className="font-semibold text-slate-800">{isAI ? 'AI Technical Interviewer' : 'Candidate (You)'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.difficulty && (
                      <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-[10px]">
                        Level: {msg.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-5 rounded-2xl text-sm leading-relaxed ${
                      isAI
                        ? 'bg-slate-50 border border-slate-200/90 text-slate-900 rounded-tl-none shadow-xs'
                        : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-medium rounded-tr-none shadow-lg shadow-indigo-500/15'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Code Snippet Attachment if present */}
                    {msg.code_snippet && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-left font-mono text-xs overflow-x-auto text-emerald-400">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider mb-2 pb-2 border-b border-slate-800">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                            {msg.code_language || 'code'}
                          </span>
                          <span>Submitted Code</span>
                        </div>
                        <pre><code>{msg.code_snippet}</code></pre>
                      </div>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-0.5 shrink-0 shadow-md shadow-indigo-500/20">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-indigo-600 font-bold">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Dynamic Candidate Input Console */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-4">

          {/* Input Type Selector Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'text'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Text Explanation</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code Editor</span>
              </button>
            </div>

            {/* Voice Input Web Speech API toggle */}
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4 text-rose-600" /> : <Mic className="w-4 h-4 text-indigo-600" />}
              <span>{isListening ? 'Recording... (Click to Stop)' : 'Voice-to-Text'}</span>
            </button>
          </div>

          {/* Active Tab View */}
          {activeTab === 'text' ? (
            <div className="space-y-3">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your technical explanation or answer here... (Tip: You can use voice-to-text recording or switch to the Code Editor tab to include snippets!)"
                rows={4}
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-sm font-normal leading-relaxed transition-colors resize-none"
              />

              {/* Quick Answer Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-500 font-mono">Quick Starters:</span>
                {[
                  "In terms of time complexity, this approach operates in O(N)...",
                  "To ensure high availability and horizontal scaling, I would recommend...",
                  "The main edge cases to consider include null pointer checks and network timeouts..."
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAnswerText((prev) => (prev ? prev + ' ' + chip : chip))}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    + {chip.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <MonacoCodeEditor
                code={codeSnippet}
                setCode={setCodeSnippet}
                language={codeLanguage}
                setLanguage={setCodeLanguage}
              />
            </div>
          )}

          {/* Submit CTA */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              Pressing Submit will submit your response for AI difficulty evaluation & follow-up generation.
            </div>

            <button
              type="button"
              disabled={submitting || (!answerText.trim() && !codeSnippet.trim())}
              onClick={handleSendAnswer}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2.5 disabled:opacity-50 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 fill-white" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Post-Session Performance Scorecard Modal */}
      {summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden text-slate-900"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Interview Session Complete</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Performance Scorecard
              </h2>
              <p className="text-sm text-slate-500">
                Track: <span className="text-indigo-600 font-semibold">{summary.track_title}</span> • Role: <span className="text-violet-600 font-semibold">{summary.target_role}</span>
              </p>
            </div>

            {/* Scorecard Hero Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <div className="text-[11px] font-mono text-slate-500 uppercase">Overall Score</div>
                <div className="text-3xl font-black text-indigo-600 mt-1">{summary.overall_score}%</div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-500 uppercase">Tech Accuracy</div>
                <div className="text-3xl font-black text-violet-600 mt-1">{summary.technical_accuracy}%</div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-500 uppercase">Problem Solving</div>
                <div className="text-3xl font-black text-purple-600 mt-1">{summary.problem_solving}%</div>
              </div>
              <div>
                <div className="text-[11px] font-mono text-slate-500 uppercase">Communication</div>
                <div className="text-3xl font-black text-emerald-600 mt-1">{summary.communication}%</div>
              </div>
            </div>

            {/* Strengths & Improvement Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Key Strengths Demonstrated
                </div>
                <ul className="space-y-1.5 text-slate-700 list-disc list-inside leading-relaxed">
                  {summary.strengths.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> Key Areas for Improvement
                </div>
                <ul className="space-y-1.5 text-slate-700 list-disc list-inside leading-relaxed">
                  {summary.areas_for_improvement.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Summary Feedback */}
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-indigo-900 block mb-1">AI Evaluator Summary:</span>
              {summary.overall_feedback}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-transform"
              >
                <span>Return to Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Proctoring & Anti-Cheat Widget */}
      <ProctoringWidget sessionId={sessionId} />
    </div>
  );
}
