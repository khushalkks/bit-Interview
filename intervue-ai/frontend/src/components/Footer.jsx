import React from 'react';
import { Bot, Globe, Share2, Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070504] border-t border-amber-900/40 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-amber-900/40">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 p-[1px]">
                <div className="w-full h-full bg-[#0b0907] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Bit-</span>
              <span className="text-xl font-bold tracking-tight text-gradient-accent">Interview</span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The next-generation adaptive AI interviewer that helps candidate engineers practice realistic coding, technical, and behavioral interviews.
            </p>
            <div className="flex items-center gap-4 text-slate-400 pt-2">
              {/* GitHub SVG */}
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors p-1" aria-label="GitHub">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              {/* Twitter SVG */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors p-1" aria-label="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn SVG */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors p-1" aria-label="LinkedIn">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.262-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-amber-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a></li>
                <li><a href="#analytics" className="hover:text-amber-400 transition-colors">Pricing</a></li>
                <li><a href="#analytics" className="hover:text-amber-400 transition-colors">Analytics Preview</a></li>
              </ul>
            </div>

            {/* Column 2: Interview Types */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Interview Types</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#interview-types" className="hover:text-amber-400 transition-colors">Technical Interview</a></li>
                <li><a href="#interview-types" className="hover:text-amber-400 transition-colors">Coding Practice</a></li>
                <li><a href="#interview-types" className="hover:text-amber-400 transition-colors">Behavioral STAR</a></li>
                <li><a href="#interview-types" className="hover:text-amber-400 transition-colors">System Design</a></li>
              </ul>
            </div>

            {/* Column 3: Legal & Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">GitHub Repository</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Bit-Interview Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with precision & AI technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
