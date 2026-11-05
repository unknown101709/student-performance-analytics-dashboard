import React from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  BarChart3,
  Trophy,
  FileText,
  UserCheck,
  LogOut,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  User,
  Compass,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const role = user?.role || 'student';

  const navItems =
    role === 'student'
      ? [
          { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { id: 'infographics', label: 'Prediction Infographics', icon: Compass, highlight: false },
          { id: 'marks', label: 'My Subject Marks', icon: BookOpen },
          { id: 'attendance', label: 'My Attendance', icon: CalendarCheck },
          { id: 'rankings', label: 'Class Rankings', icon: Trophy },
          { id: 'reports', label: 'My Transcript', icon: FileText },
          { id: 'ai-advisor', label: 'Counselor Diagnostic', icon: Sparkles, highlight: false },
        ]
      : role === 'teacher'
      ? [
          { id: 'dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
          { id: 'infographics', label: 'Prediction Infographics', icon: Compass, highlight: false },
          { id: 'students', label: 'Student Directory', icon: Users },
          { id: 'marks', label: 'Record Marks', icon: BookOpen },
          { id: 'attendance', label: 'Log Attendance', icon: CalendarCheck },
          { id: 'analytics', label: 'Class Analytics', icon: BarChart3 },
          { id: 'rankings', label: 'Class Rankings', icon: Trophy },
          { id: 'reports', label: 'Cohort Reports', icon: FileText },
          { id: 'ai-advisor', label: 'Risk Diagnostics', icon: Sparkles, highlight: false },
        ]
      : [
          { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
          { id: 'infographics', label: 'Prediction Infographics', icon: Compass, highlight: false },
          { id: 'teachers', label: 'Manage Faculty', icon: UserCheck },
          { id: 'students', label: 'Student Directory', icon: Users },
          { id: 'marks', label: 'Record Marks', icon: BookOpen },
          { id: 'attendance', label: 'Log Attendance', icon: CalendarCheck },
          { id: 'analytics', label: 'Institutional Analytics', icon: BarChart3 },
          { id: 'rankings', label: 'Campus Rankings', icon: Trophy },
          { id: 'reports', label: 'Institutional Reports', icon: FileText },
          { id: 'ai-advisor', label: 'Risk Diagnostics', icon: Sparkles, highlight: false },
        ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-gradient-to-b from-[#0b2545] via-[#102a43] to-[#07172b] text-white shadow-2xl transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isCollapsed ? 'lg:w-20 w-64' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header & Shrink/Expand Toggle Button */}
        {isCollapsed ? (
          <div className="flex flex-col items-center justify-center gap-2.5 px-2 py-5 border-b border-slate-700/50">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30"
              title="EduAnalytics Academic Portal"
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {/* Expand button */}
            <button
              onClick={onToggleCollapse}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors border border-slate-700 shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700/50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="truncate">
                <span className="block text-lg font-bold tracking-tight text-white font-sans truncate">
                  EduAnalytics
                </span>
                <span className="block text-xs font-medium text-slate-400 truncate">
                  Academic Portal
                </span>
              </div>
            </div>
            {/* Shrink button */}
            <button
              onClick={onToggleCollapse}
              title="Shrink sidebar"
              aria-label="Shrink sidebar"
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors border border-slate-700/70 shadow-xs flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Current Active Role Indicator */}
        {isCollapsed ? (
          <div
            className="mx-2 mt-3 p-2.5 flex flex-col items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50"
            title={`Active: ${user?.name || user?.username} (${role.toUpperCase()})`}
          >
            {role === 'admin' ? (
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            ) : role === 'teacher' ? (
              <UserCheck className="w-4 h-4 text-blue-400" />
            ) : (
              <User className="w-4 h-4 text-emerald-400" />
            )}
          </div>
        ) : (
          <div className="px-5 py-4 mx-4 mt-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                {role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                ) : role === 'teacher' ? (
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                )}
                Role: <span className="capitalize text-white font-bold">{role}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate font-medium">
              {user?.name || user?.username}
            </p>
          </div>
        )}

        {/* Main Navigation */}
        {!isCollapsed && (
          <div className="px-5 py-2 mt-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Navigation Menu
          </div>
        )}
        <nav className={`flex-1 ${isCollapsed ? 'px-2 pt-3' : 'px-3'} space-y-1.5 overflow-y-auto`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                title={item.label}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`relative flex items-center ${
                  isCollapsed ? 'lg:justify-center lg:px-2 px-3.5' : 'justify-between px-3.5'
                } w-full py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : item.highlight
                    ? 'text-amber-300 hover:bg-slate-800/80 hover:text-amber-200'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'lg:justify-center lg:w-full' : 'gap-3'}`}>
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0 ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-amber-400'
                        : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span className={`${isCollapsed ? 'lg:hidden ml-3' : 'block'} truncate`}>
                    {item.label}
                  </span>
                </div>
                {item.highlight && !isCollapsed && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    AI
                  </span>
                )}
                {item.highlight && isCollapsed && (
                  <span className="hidden lg:block absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Shrink Toggle & Logout */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-slate-700/60 mt-auto space-y-2`}>
          {/* Dedicated Expand/Shrink Action button */}
          {isCollapsed ? (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-full py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/40"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronsRight className="w-4 h-4 text-blue-400" />
            </button>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700/40"
              title="Shrink sidebar"
              aria-label="Shrink sidebar"
            >
              <span className="flex items-center gap-2">
                <ChevronsLeft className="w-4 h-4 text-slate-400" />
                <span>Shrink Sidebar</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-700/60 font-mono">
                Collapse
              </span>
            </button>
          )}

          <button
            onClick={logout}
            title="Sign Out"
            aria-label="Sign Out"
            className={`flex items-center ${
              isCollapsed ? 'lg:justify-center px-3.5 lg:px-2' : 'gap-3 px-3.5'
            } w-full py-2.5 text-sm font-medium text-rose-300 rounded-xl hover:bg-rose-950/40 hover:text-rose-200 transition-colors`}
          >
            <LogOut className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className={`${isCollapsed ? 'lg:hidden ml-3' : 'block'}`}>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
