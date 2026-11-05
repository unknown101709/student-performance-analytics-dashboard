import React from 'react';
import {
  Users,
  TrendingUp,
  CalendarCheck,
  ClipboardList,
  Trophy,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BookOpen,
  UserCheck,
  FileText,
} from 'lucide-react';
import { AnalyticsResponse } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface DashboardViewProps {
  analytics: AnalyticsResponse | null;
  loading: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenAiDiagnostic: (studentId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analytics,
  loading,
  onNavigateTab,
  onOpenAiDiagnostic,
}) => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  if (loading || !analytics) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200/80 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-80 bg-slate-200/80 rounded-2xl"></div>
      </div>
    );
  }

  const atRiskCount = analytics.at_risk_students.length;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0b2545] via-[#102a43] to-[#1e3a8a] text-white shadow-xl shadow-blue-950/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-md bg-blue-500/20 text-blue-200 border border-blue-400/30">
              {isStudent ? 'Student Academic Portal' : 'Faculty Analytics Console'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || (isStudent ? 'Aarav Sharma' : 'Prof. Rajesh Sharma')}!
          </h2>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            {isStudent
              ? "Here is your live semester academic progress, current marks, and attendance status."
              : "Review live class grade distributions, attendance health, and predictive academic risk alerts."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenAiDiagnostic(isStudent ? user?.student_id : undefined)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{isStudent ? 'Counselor Feedback' : 'Analyze Academic Health'}</span>
          </button>
        </div>
      </div>

      {/* At-Risk Warning Callout (if students need help) */}
      {atRiskCount > 0 && !isStudent && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">
                {atRiskCount} Student{atRiskCount > 1 ? 's' : ''} Flagged For Academic Review
              </h4>
              <p className="text-xs text-amber-800">
                Identified students with marks &lt;60% or attendance &lt;75% requiring proactive intervention.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('ai-advisor')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs shrink-0"
          >
            <span>Review At-Risk Students</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Students */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              {isStudent ? 'Class Enrolled' : 'Total Students'}
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {analytics.total_students}
            </span>
            <p className="mt-1 text-xs text-slate-500">
              {isStudent ? 'Enrolled in CSE(AIML) Semester 3' : 'Active registered candidates'}
            </p>
          </div>
        </div>

        {/* Card 2: Average Marks */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              {isStudent ? 'My Performance' : 'Average Marks'}
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {analytics.average_marks}%
            </span>
            <p className="mt-1 text-xs text-slate-500">
              {analytics.average_marks >= 75
                ? 'Distinction grade average'
                : analytics.average_marks >= 60
                ? 'Satisfactory grade performance'
                : 'Needs improvement threshold'}
            </p>
          </div>
        </div>

        {/* Card 3: Average Attendance */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              {isStudent ? 'My Attendance' : 'Class Attendance'}
            </span>
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-xl ${
                analytics.average_attendance >= 75
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span
              className={`text-3xl font-extrabold font-mono tabular-nums ${
                analytics.average_attendance >= 75 ? 'text-blue-600' : 'text-rose-600'
              }`}
            >
              {analytics.average_attendance}%
            </span>
            <p className="mt-1 text-xs text-slate-500">
              {analytics.average_attendance >= 75
                ? 'Compliant with 75% rule'
                : 'Below minimum 75% threshold'}
            </p>
          </div>
        </div>

        {/* Card 4: Tests Conducted */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              {isStudent ? 'Examinations Taken' : 'Tests Recorded'}
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-purple-600">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {analytics.total_tests}
            </span>
            <p className="mt-1 text-xs text-slate-500">Evaluated test submissions</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Performance & Top Students */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Performance Bar Chart */}
        <div className="lg:col-span-8 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Subject Performance Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Average marks achieved across active semester courses
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Clean Custom SVG Bar Chart */}
          <div className="space-y-4 pt-2">
            {analytics.subject_data.map((sub) => {
              const pct = sub.average;
              const isLow = pct < 60;
              const isHigh = pct >= 80;
              return (
                <div key={sub.subject_id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      {sub.subject_name}
                    </span>
                    <span className="font-mono font-bold text-slate-700 tabular-nums">
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow
                          ? 'bg-rose-500'
                          : isHigh
                          ? 'bg-emerald-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>Distinction (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span>Satisfactory (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span>Focus Area (&lt;60%)</span>
            </div>
          </div>
        </div>

        {/* Top Performing Students Leaderboard */}
        <div className="lg:col-span-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">
                Top Performing Students
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('rankings')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {analytics.top_students.map((student, idx) => (
              <div
                key={student.student_id}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-xl font-mono text-xs font-bold ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-800'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-800'
                        : idx === 2
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    #{student.rank}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      {student.name}
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Sem {student.semester} · Div {student.division}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-xs font-extrabold text-blue-600 tabular-nums">
                    {student.percentage}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    Grade {student.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('students')}
          className="flex items-center gap-3.5 p-4 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/80 shadow-xs text-left transition-all group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Manage Students</h4>
            <p className="text-[11px] text-slate-500">Directory & enrollment</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('marks')}
          className="flex items-center gap-3.5 p-4 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/80 shadow-xs text-left transition-all group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Record Marks</h4>
            <p className="text-[11px] text-slate-500">Enter exam scores</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('attendance')}
          className="flex items-center gap-3.5 p-4 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/80 shadow-xs text-left transition-all group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Track Attendance</h4>
            <p className="text-[11px] text-slate-500">Log class attendance</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('reports')}
          className="flex items-center gap-3.5 p-4 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/80 shadow-xs text-left transition-all group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Transcripts & Reports</h4>
            <p className="text-[11px] text-slate-500">Printable report cards</p>
          </div>
        </button>
      </div>
    </div>
  );
};
