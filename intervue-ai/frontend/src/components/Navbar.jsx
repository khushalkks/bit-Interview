import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 py-3.5 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#0b0f19] rounded-[11px] flex items-center justify-center">
                <Bot className="w-5.5 h-5.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-black tracking-tight text-white">Bit-</span>
              <span className="text-xl font-black tracking-tight text-gradient-accent">Interview</span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full font-mono">
                AI v2.0
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('interview-types')}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Interview Tracks
            </button>
            <button
              onClick={() => scrollToSection('analytics')}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Analytics
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-3 py-2 cursor-pointer"
            >
              Log In
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <span>Start Practice</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1322]/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 mt-3 shadow-2xl">
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-800/60 rounded-lg"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-800/60 rounded-lg"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('interview-types')}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-800/60 rounded-lg"
          >
            Interview Tracks
          </button>
          <button
            onClick={() => scrollToSection('analytics')}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-200 hover:bg-slate-800/60 rounded-lg"
          >
            Analytics
          </button>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-bold text-slate-300"
            >
              Log In
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-sm text-center shadow-lg shadow-indigo-500/25"
            >
              Start Practice
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
