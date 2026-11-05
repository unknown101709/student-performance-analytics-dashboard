import React from 'react';
import { Menu, Sparkles, ChevronRight, ChevronLeft, LogOut, ShieldCheck, UserCheck, User, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard Portal', subtitle: 'Academic performance and student metrics' },
  infographics: { title: 'Prediction Infographics AI', subtitle: 'Interactive GPA trajectory, correlation matrices & simulation' },
  students: { title: 'Students Directory', subtitle: 'View and manage student enrollment records' },
  marks: { title: 'Examinations & Marks', subtitle: 'Enter, inspect, and calculate subject percentages' },
  attendance: { title: 'Attendance Ledger', subtitle: 'Monitor classroom presence and attendance health' },
  analytics: { title: 'Performance Analytics', subtitle: 'Subject benchmarks, grade spread, and focus alerts' },
  rankings: { title: 'Class Rankings Leaderboard', subtitle: 'Top performers and weighted GPA standings' },
  reports: { title: 'Institutional Reports', subtitle: 'Printable transcripts, report cards, and remarks' },
  teachers: { title: 'Faculty & Teacher Accounts', subtitle: 'Manage academic staff login credentials' },
  'ai-advisor': { title: 'Academic Risk Diagnostics', subtitle: 'Pedagogical counseling and tutor feedback' },
};

interface NavbarProps {
  currentTab: string;
  onOpenMobileSidebar: () => void;
  onOpenAiAdvisor: () => void;
  onNavigateTab?: (tab: string) => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onOpenAiAdvisor,
  onNavigateTab,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
}) => {
  const { user, logout } = useAuth();
  const info = TAB_TITLES[currentTab] || { title: 'Student Analytics', subtitle: 'Academic portal' };

  const roleLabel =
    user?.role === 'admin'
      ? 'Administrator'
      : user?.role === 'teacher'
      ? 'Faculty'
      : 'Student';

  return (
    <header className="sticky top-0 z-30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-4 sm:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-1 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop expand/shrink sidebar button */}
        {onToggleSidebarCollapse && (
          <button
            onClick={onToggleSidebarCollapse}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/90 rounded-lg transition-colors shadow-2xs hover:border-blue-200"
            title={isSidebarCollapsed ? 'Expand sidebar (show full menu labels)' : 'Shrink sidebar (compact icons)'}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Shrink sidebar'}
          >
            {isSidebarCollapsed ? (
              <>
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span>Expand Sidebar</span>
              </>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 text-slate-500" />
                <span>Shrink Sidebar</span>
              </>
            )}
          </button>
        )}

        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>{roleLabel} Portal</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-slate-700 capitalize">{currentTab}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
            {info.title}
          </h1>
        </div>
      </div>

      {/* Right: Risk Advisor & Authenticated Profile (Strict RBAC, no cross-account switcher) */}
      <div className="flex items-center gap-2.5 self-end md:self-center">
        {/* Risk Advisor Trigger Button */}
        <button
          onClick={onOpenAiAdvisor}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-all shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Risk Diagnostics</span>
        </button>

        {/* Authenticated User Status Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase text-white shadow-xs ${
                user?.role === 'admin'
                  ? 'bg-amber-600'
                  : user?.role === 'teacher'
                  ? 'bg-blue-600'
                  : 'bg-emerald-600'
              }`}
            >
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-slate-900 leading-tight">
                {user?.name || user?.username}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${
                  user?.role === 'admin'
                    ? 'text-amber-700'
                    : user?.role === 'teacher'
                    ? 'text-blue-700'
                    : 'text-emerald-700'
                }`}
              >
                {user?.role === 'admin' ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : user?.role === 'teacher' ? (
                  <UserCheck className="w-3 h-3" />
                ) : (
                  <User className="w-3 h-3" />
                )}
                {user?.role} Access
              </span>
            </div>
          </div>

          {/* Secure Logout to change role */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
            title="Sign out of current account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
