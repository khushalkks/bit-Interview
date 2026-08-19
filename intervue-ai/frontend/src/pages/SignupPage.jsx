import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register(name, email, password, targetRole);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Mesh & Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Value Proposition Showcase */}
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
              Start Your Journey to <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Interview Mastery</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
              Create your account to unlock personalized AI interview sessions, automated resume evaluation, job-description alignment, and live performance metrics.
            </p>
          </div>

          {/* Benefits Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Tailored Question Banks</h3>
              <p className="text-xs text-slate-400">AI adapts questions specifically to your targeted engineering role & seniority level.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl space-y-2">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Actionable Analytics</h3>
              <p className="text-xs text-slate-400">Get granular scores on Technical Knowledge, System Architecture, and Soft Skills.</p>
            </div>
          </div>

          {/* Testimonial Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl flex items-center gap-4">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white text-xs font-bold flex items-center justify-center">AK</div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-purple-500 to-pink-400 text-white text-xs font-bold flex items-center justify-center">PS</div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white text-xs font-bold flex items-center justify-center">RK</div>
            </div>
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">Joined by 10,000+ engineers</span> practicing for FAANG & top tech companies daily.
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Ultra-Glassmorphic Signup Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-6 w-full max-w-md mx-auto"
        >
          <div className="relative rounded-3xl bg-slate-900/80 border border-indigo-500/25 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl space-y-6">
            
            {/* Top Glowing Edge Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent rounded-full shadow-lg shadow-violet-500/50" />

            {/* Title & Subtitle */}
            <div className="text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Get Started Free</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Your Account
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Start practicing with your personal AI interviewer today
              </p>
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

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Khushal Kumar"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

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
                    placeholder="khushal@example.com"
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Target Job Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Job Role
                </label>
                <div className="relative group">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Full Stack Engineer" className="bg-slate-900 text-white">Full Stack Engineer</option>
                    <option value="Frontend Developer" className="bg-slate-900 text-white">Frontend Developer</option>
                    <option value="Backend Engineer" className="bg-slate-900 text-white">Backend Engineer</option>
                    <option value="System Design Architect" className="bg-slate-900 text-white">System Design Architect</option>
                    <option value="DevOps / Cloud Engineer" className="bg-slate-900 text-white">DevOps / Cloud Engineer</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 group mt-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Redirect Link */}
            <p className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors inline-flex items-center gap-1">
                <span>Sign In</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

