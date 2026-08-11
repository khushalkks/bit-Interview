import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Bell, User, LogOut, Sparkles, ChevronDown, LayoutDashboard, FileText, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[#0c1220]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] shadow-lg">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold tracking-tight text-white">Bit-</span>
              <span className="text-lg font-bold tracking-tight text-gradient-accent">Interview</span>
              <span className="ml-2 px-2 py-0.5 text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Candidate Hub
              </span>
            </div>
          </Link>

          {/* Center Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-xs font-semibold text-white bg-slate-800/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700/50">
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dashboard</span>
            </Link>
            <a href="#interviews" className="text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Mock Sessions</span>
            </a>
            <a href="#analytics" className="text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Analytics</span>
            </a>
          </nav>

          {/* Right side Profile & Logout */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-2 right-2" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-tight">
                    {user?.name || 'Candidate'}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {user?.target_role || 'Full Stack Engineer'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0d1424] border border-slate-800 shadow-2xl py-1.5 z-50 text-xs text-slate-300 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <p className="font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800/60 text-slate-200"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                    <span>My Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-rose-500/10 text-rose-400 transition-colors cursor-pointer border-t border-slate-800/60 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
