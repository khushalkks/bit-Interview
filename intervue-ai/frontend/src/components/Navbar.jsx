import React, { useState, useEffect } from 'react';
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
          ? 'bg-[#090d16]/80 backdrop-blur-lg border-b border-slate-800/80 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-white">Bit-</span>
              <span className="text-xl font-bold tracking-tight text-gradient-accent">Interview</span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                v1.0
              </span>
            </div>
          </a>

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
            <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 cursor-pointer">
              Log In
            </button>
            <button
              onClick={() => scrollToSection('interview-types')}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-xl group bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 group-hover:from-indigo-500 group-hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-[#090d16]/40 rounded-[10px] flex items-center gap-2 font-semibold">
                Start Interview
                <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
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
        <div className="md:hidden bg-[#0c1220]/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 mt-3 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => scrollToSection('features')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800/50 rounded-lg"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800/50 rounded-lg"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('interview-types')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800/50 rounded-lg"
          >
            Interview Types
          </button>
          <button
            onClick={() => scrollToSection('analytics')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800/50 rounded-lg"
          >
            Pricing
          </button>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <button className="w-full text-center py-2 text-sm font-medium text-slate-300 hover:text-white">
              Log In
            </button>
            <button
              onClick={() => scrollToSection('interview-types')}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-medium text-sm text-center shadow-lg shadow-indigo-500/20"
            >
              Start Interview
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
