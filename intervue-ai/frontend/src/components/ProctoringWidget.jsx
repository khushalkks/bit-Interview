import React, { useState, useEffect, useRef } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Camera, CameraOff, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { interviewAPI } from '../services/api';

export default function ProctoringWidget({ sessionId }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [lastViolation, setLastViolation] = useState(null);
  const [minimized, setMinimized] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Tab switch & focus loss listeners
  useEffect(() => {
    if (!sessionId) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationCount((prev) => prev + 1);
        setLastViolation('Tab switched away from interview session.');
        interviewAPI.logProctoringEvent(sessionId, 'tab_switch', 'User switched browser tab during interview session');
      }
    };

    const handleWindowBlur = () => {
      setViolationCount((prev) => prev + 1);
      setLastViolation('Window focus lost.');
      interviewAPI.logProctoringEvent(sessionId, 'window_blur', 'Window lost focus during interview session');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [sessionId]);

  // Camera toggle handler
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        console.error('Camera access denied or unavailable:', err);
        alert('Webcam access was denied or is unavailable on this device.');
      }
    }
  };

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-[#0b1329]/95 backdrop-blur border border-slate-800 rounded-xl p-3 shadow-2xl w-64 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {violationCount > 0 ? (
              <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-xs font-semibold text-slate-200">AI Anti-Cheat Monitor</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleCamera}
              className={`p-1 rounded-md transition ${
                cameraActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={cameraActive ? 'Turn Off Proctored Camera' : 'Turn On Proctored Camera'}
            >
              {cameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              {minimized ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded View */}
        {!minimized && (
          <div className="mt-2 space-y-2 text-xs border-t border-slate-800/60 pt-2">
            {/* Camera Preview */}
            {cameraActive ? (
              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Proctor
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 text-center text-slate-400 text-[11px]">
                Webcam monitor inactive. Click <Camera className="w-3 h-3 inline text-emerald-400" /> to enable live video anti-cheat audit.
              </div>
            )}

            {/* Audit Status summary */}
            <div className="flex items-center justify-between bg-slate-900/80 px-2 py-1.5 rounded border border-slate-800/60 text-[11px]">
              <span className="text-slate-400">Session Integrity:</span>
              <span className={`font-mono font-semibold ${violationCount === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {violationCount === 0 ? '100% (Clean)' : `${Math.max(40, 100 - violationCount * 10)}%`}
              </span>
            </div>

            {lastViolation && (
              <div className="flex items-start gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 p-1.5 rounded text-[10px]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{lastViolation}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
