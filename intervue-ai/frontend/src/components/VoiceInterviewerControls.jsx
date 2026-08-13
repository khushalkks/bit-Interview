import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Square, Radio } from 'lucide-react';

export default function VoiceInterviewerControls({ latestInterviewerMessage }) {
  const [autoRead, setAutoRead] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const synthRef = useRef(window.speechSynthesis);

  // Auto-speak when a new message arrives from the interviewer
  useEffect(() => {
    const synth = synthRef.current;
    if (!autoRead || !latestInterviewerMessage || !synth) return;

    // Clean text by stripping Markdown formatting or HTML tags
    const cleanText = latestInterviewerMessage.replace(/\*+/g, '').replace(/```[\s\S]*?```/g, ' Code snippet provided. ');

    synth.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);

    return () => {
      if (synth) synth.cancel();
    };
  }, [latestInterviewerMessage, autoRead, speechRate]);

  const toggleSpeech = () => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else if (latestInterviewerMessage) {
      const cleanText = latestInterviewerMessage.replace(/\*+/g, '').replace(/```[\s\S]*?```/g, ' Code snippet provided. ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speechRate;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-[#0f172a]/90 backdrop-blur border border-slate-800/80 px-3 py-1.5 rounded-full text-xs text-slate-300 shadow-md">
      {/* Speaking Indicator Soundwave */}
      <div className="flex items-center gap-1.5">
        {isSpeaking ? (
          <div className="flex items-center gap-0.5 h-4">
            <motion.span
              animate={{ height: ['40%', '100%', '30%'] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="w-1 bg-cyan-400 rounded-full"
            />
            <motion.span
              animate={{ height: ['80%', '20%', '90%'] }}
              transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
              className="w-1 bg-cyan-400 rounded-full"
            />
            <motion.span
              animate={{ height: ['30%', '90%', '40%'] }}
              transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }}
              className="w-1 bg-cyan-400 rounded-full"
            />
          </div>
        ) : (
          <Radio className="w-3.5 h-3.5 text-slate-500" />
        )}
        <span className="font-mono text-[11px] text-slate-400">
          {isSpeaking ? 'AI Speaking...' : 'AI Voice Ready'}
        </span>
      </div>

      <div className="h-3 w-[1px] bg-slate-800" />

      {/* Auto-read Toggle */}
      <button
        type="button"
        onClick={() => {
          if (autoRead && isSpeaking) synthRef.current?.cancel();
          setAutoRead(!autoRead);
        }}
        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] transition-colors ${
          autoRead
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
        }`}
        title="Toggle automatic AI voice narration"
      >
        {autoRead ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
        <span>{autoRead ? 'Auto-Voice ON' : 'Voice Muted'}</span>
      </button>

      {/* Manual Play/Stop */}
      <button
        type="button"
        onClick={toggleSpeech}
        className="p-1 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
        title={isSpeaking ? 'Stop voice readout' : 'Replay AI question'}
      >
        {isSpeaking ? <Square className="w-3 h-3 fill-slate-400" /> : <Play className="w-3 h-3 fill-slate-400" />}
      </button>

      {/* Speech Speed selector */}
      <select
        value={speechRate}
        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
        className="bg-slate-900 border border-slate-800 text-[11px] text-slate-400 rounded px-1 py-0.5 focus:outline-none focus:border-cyan-500/50"
      >
        <option value={0.85}>0.85x</option>
        <option value={1.0}>1.0x</option>
        <option value={1.25}>1.25x</option>
        <option value={1.5}>1.5x</option>
      </select>
    </div>
  );
}
