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
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs text-slate-700 shadow-xs font-sans">
      {/* Speaking Indicator Soundwave */}
      <div className="flex items-center gap-1.5">
        {isSpeaking ? (
          <div className="flex items-center gap-0.5 h-4">
            <motion.span
              animate={{ height: ['40%', '100%', '30%'] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="w-1 bg-indigo-600 rounded-full"
            />
            <motion.span
              animate={{ height: ['80%', '20%', '90%'] }}
              transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
              className="w-1 bg-indigo-600 rounded-full"
            />
            <motion.span
              animate={{ height: ['30%', '90%', '40%'] }}
              transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }}
              className="w-1 bg-indigo-600 rounded-full"
            />
          </div>
        ) : (
          <Radio className="w-3.5 h-3.5 text-slate-400" />
        )}
        <span className="font-mono text-[11px] text-slate-500 font-medium">
          {isSpeaking ? 'AI Speaking...' : 'AI Voice Ready'}
        </span>
      </div>

      <div className="h-3 w-[1px] bg-slate-200" />

      {/* Auto-read Toggle */}
      <button
        type="button"
        onClick={() => {
          if (autoRead && isSpeaking) synthRef.current?.cancel();
          setAutoRead(!autoRead);
        }}
        className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
          autoRead
            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            : 'bg-slate-100 text-slate-500 hover:text-slate-900'
        }`}
        title="Toggle automatic AI voice narration"
      >
        {autoRead ? <Volume2 className="w-3 h-3 text-indigo-600" /> : <VolumeX className="w-3 h-3 text-slate-400" />}
        <span>{autoRead ? 'Auto-Voice ON' : 'Voice Muted'}</span>
      </button>

      {/* Manual Play/Stop */}
      <button
        type="button"
        onClick={toggleSpeech}
        className="p-1 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
        title={isSpeaking ? 'Stop voice readout' : 'Replay AI question'}
      >
        {isSpeaking ? <Square className="w-3 h-3 fill-slate-500" /> : <Play className="w-3 h-3 fill-slate-500" />}
      </button>

      {/* Speech Speed selector */}
      <select
        value={speechRate}
        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
        className="bg-white border border-slate-200 text-[11px] text-slate-600 rounded px-1.5 py-0.5 focus:outline-none focus:border-indigo-500 font-mono font-medium"
      >
        <option value={0.85}>0.85x</option>
        <option value={1.0}>1.0x</option>
        <option value={1.25}>1.25x</option>
        <option value={1.5}>1.5x</option>
      </select>
    </div>
  );
}
