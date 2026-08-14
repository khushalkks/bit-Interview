import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Bell, User, LogOut, Sparkles, ChevronDown, LayoutDashboard, FileText, BarChart3, Target, Building2 } from 'lucide-react';
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
    <header className="bg-white/85 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 p-[1px] shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">Bit-</span>
              <span className="text-lg font-extrabold tracking-tight text-gradient-accent">Interview</span>
              <span className="ml-2 px-2 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                AI Platform
              </span>
            </div>
          </Link>

          {/* Center Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
              <span>Dashboard</span>
            </Link>
            <Link to="/resume" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-violet-600" />
              <span>Resume</span>
            </Link>
            <Link to="/jd-analyzer" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-purple-600" />
              <span>JD Matcher</span>
            </Link>
            <Link to="/recruiter" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>Recruiter Hub</span>
            </Link>
          </nav>

          {/* Right side Profile & Logout */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative cursor-pointer transition-colors">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 ring-2 ring-white" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-xs text-white flex items-center justify-center shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.name || 'Candidate'}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {user?.target_role || 'Full Stack Engineer'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/50">
                    <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                    <span>My Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-rose-50 text-rose-600 font-medium transition-colors cursor-pointer border-t border-slate-100 mt-1"
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
