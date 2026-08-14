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
          ? 'bg-[#0b0907]/90 backdrop-blur-lg border-b border-amber-900/40 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 p-[1px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
              <div className="w-full h-full bg-[#0b0907] rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-white">Bit-</span>
              <span className="text-xl font-bold tracking-tight text-gradient-accent">Interview</span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                v1.0
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('interview-types')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Interview Types
            </button>
            <button
              onClick={() => scrollToSection('analytics')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 cursor-pointer"
            >
              Log In
            </Link>
            <Link
              to="/dashboard"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-xl group bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-[#0b0907]/60 rounded-[10px] flex items-center gap-2 font-semibold text-white group-hover:bg-[#0b0907]/20">
                Start Interview
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#120e0a]/95 backdrop-blur-xl border-b border-amber-900/60 px-4 pt-3 pb-6 space-y-3 mt-3 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:bg-amber-950/50 rounded-lg"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:bg-amber-950/50 rounded-lg"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('interview-types')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:bg-amber-950/50 rounded-lg"
          >
            Interview Types
          </button>
          <button
            onClick={() => scrollToSection('analytics')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:bg-amber-950/50 rounded-lg"
          >
            Pricing
          </button>
          <div className="pt-4 border-t border-amber-900/60 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              Log In
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl text-sm text-center shadow-lg shadow-amber-500/20"
            >
              Start Interview
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
