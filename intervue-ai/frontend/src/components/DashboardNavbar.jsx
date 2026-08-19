import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Bell, LogOut, ChevronDown, LayoutDashboard, FileText, Target, Building2 } from 'lucide-react';
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
    <header className="bg-[#090d19]/90 backdrop-blur-2xl border-b border-slate-800/90 sticky top-0 z-40 shadow-xl font-sans">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#060913] rounded-[9.5px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-extrabold tracking-tight text-white">Bit-</span>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Interview</span>
              <span className="ml-2 px-2 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                AI Platform
              </span>
            </div>
          </Link>

          {/* Center Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800/60">
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dashboard</span>
            </Link>
            <Link to="/resume" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800/60">
              <FileText className="w-3.5 h-3.5 text-violet-400" />
              <span>Resume</span>
            </Link>
            <Link to="/jd-analyzer" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800/60">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>JD Matcher</span>
            </Link>
            <Link to="/recruiter" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800/60">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recruiter Hub</span>
            </Link>
          </nav>

          {/* Right side Profile & Logout */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-xl relative cursor-pointer transition-colors">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-2 ring-2 ring-slate-900" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-xs text-white flex items-center justify-center shadow-md">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
                    {user?.name || 'Candidate'}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[110px]">
                    {user?.target_role || 'Full Stack Engineer'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 text-xs text-slate-300 backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/60">
                    <p className="font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800/60 text-slate-200 font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                    <span>My Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-rose-500/10 text-rose-400 font-medium transition-colors cursor-pointer border-t border-slate-800 mt-1"
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

