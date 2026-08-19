import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  Briefcase, 
  Zap, 
  Star, 
  Activity,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithOAuth } = useAuth();

  const [activeTab, setActiveTab] = useState('candidate'); // 'candidate' | 'recruiter'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const handleOAuthLogin = async (provider) => {
    setError('');
    try {
      await loginWithOAuth(provider);
    } catch (err) {
      console.error('OAuth Login Error:', err);
      if (err.message && err.message.toLowerCase().includes('not enabled')) {
        setError(`${provider.toUpperCase()} Login is not toggled ON in your Supabase Dashboard yet. Enable Google in Supabase -> Authentication -> Providers, or use Email / Demo login!`);
      } else {
        setError(err.message || 'Failed to initialize social login.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      if (activeTab === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role) => {
    const demoEmail = role === 'recruiter' ? 'recruiter@example.com' : 'khushal@example.com';
    const demoPass = 'password123';
    
    setActiveTab(role);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setIsSubmitting(true);

    try {
      await login(demoEmail, demoPass);
      navigate(role === 'recruiter' ? '/recruiter' : '/dashboard');
    } catch (err) {
      setError('Demo login failed. Please check backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Mesh & Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Feature Showcase & AI Visualizer */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-6 space-y-8 pr-0 lg:pr-4"
        >
          {/* Brand Header */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px] shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#090d19] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-6.5 h-6.5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-extrabold tracking-tight text-white">Bit-</span>
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Interview</span>
              </div>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Master Technical Interviews with <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Adaptive AI</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
              Experience real-time voice interviews, instant AI feedback, domain-specific coding challenges, and comprehensive candidate analytical reports.
            </p>
          </div>

          {/* AI Interactive Feature Preview Card */}
          <div className="relative rounded-2xl bg-slate-900/60 border border-slate-800/90 p-5 backdrop-blur-xl shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Live AI Assessor Active</span>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
                GPT-4o Voice Engine
              </span>
            </div>

            {/* Simulated Voice Waveform & Quote */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-3">
                <Bot className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-200">"Explain how Python's AsyncIO event loop handles non-blocking I/O tasks under heavy concurrency."</p>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-1.5">
                  {[40, 70, 25, 90, 50, 80, 30, 95, 60, 30].map((h, idx) => (
                    <div 
                      key={idx} 
                      className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full animate-audio-pulse"
                      style={{ height: `${h}%`, animationDelay: `${idx * 0.15}s` }} 
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-slate-400">Listening to candidate response...</span>
                </div>
              </div>
            </div>

            {/* Stat Badges Row */}
            <div className="grid grid-cols-3 gap-2 pt-4 mt-2 border-t border-slate-800/60">
              <div className="text-center p-2 rounded-lg bg-slate-950/40 border border-slate-800/40">
                <div className="text-lg font-bold text-indigo-400">94.8%</div>
                <div className="text-[10px] text-slate-400 font-medium">Match Accuracy</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-950/40 border border-slate-800/40">
                <div className="text-lg font-bold text-violet-400">50K+</div>
                <div className="text-[10px] text-slate-400 font-medium">Interviews</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-950/40 border border-slate-800/40">
                <div className="text-lg font-bold text-cyan-400">&lt; 200ms</div>
                <div className="text-[10px] text-slate-400 font-medium">Voice Latency</div>
              </div>
            </div>
          </div>

          {/* Quick Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-Time Voice Analysis</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Detailed Scorecards</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>System Design & Coding</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Recruiter Candidate Pipeline</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Ultra-Glassmorphic Login Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-6 w-full max-w-md mx-auto"
        >
          <div className="relative rounded-3xl bg-slate-900/80 border border-indigo-500/25 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl space-y-6">
            
            {/* Top Glowing Edge Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full shadow-lg shadow-indigo-500/50" />

            {/* Auth Title & Subtitle */}
            <div className="text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Secure AI Authentication</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Sign in to continue your adaptive interview session
              </p>
            </div>

            {/* Portal Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => setActiveTab('candidate')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'candidate'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Candidate</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('recruiter')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'recruiter'
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-violet-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Recruiter / HR</span>
              </button>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activeTab === 'recruiter' ? 'recruiter@company.com' : 'candidate@example.com'}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-1 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-medium">Keep me signed in</span>
                </label>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  256-bit Encrypted
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 group mt-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In to {activeTab === 'recruiter' ? 'Recruiter Hub' : 'Dashboard'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Preset Demo Accounts */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-1">
                ⚡ Instant Demo Login
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('candidate')}
                  className="py-2.5 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 text-indigo-300 border border-indigo-500/20 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Candidate Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('recruiter')}
                  className="py-2.5 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 text-cyan-300 border border-cyan-500/20 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Recruiter Demo</span>
                </button>
              </div>
            </div>

            {/* Supabase Social OAuth Section */}
            <div className="pt-2 space-y-2">
              <div className="relative text-center">
                <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                  Or continue with Supabase Auth
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.30 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z" />
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>

            {/* Bottom Redirect Link */}
            <p className="text-center text-xs text-slate-400 pt-2">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors inline-flex items-center gap-1">
                <span>Create an account</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

