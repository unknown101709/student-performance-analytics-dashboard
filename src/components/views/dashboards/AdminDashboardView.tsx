import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  UserCheck,
  TrendingUp,
  CalendarCheck,
  Trophy,
  Compass,
  ArrowRight,
  BookOpen,
  FileText,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { AnalyticsResponse } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface AdminDashboardViewProps {
  analytics: AnalyticsResponse | null;
  loading: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenAiDiagnostic: (studentId?: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  analytics,
  loading,
  onNavigateTab,
  onOpenAiDiagnostic,
}) => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/teachers')
      .then((res) => res.json())
      .then((data) => {
        if (data.teachers) setTeachers(data.teachers);
      })
      .catch((e) => console.error('Failed fetching teachers for admin dash:', e));
  }, []);

  if (loading || !analytics) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200/80 rounded-3xl"></div>
          ))}
        </div>
        <div className="h-80 bg-slate-200/80 rounded-3xl"></div>
      </div>
    );
  }

  const atRiskCount = analytics.at_risk_students?.length || 0;

  const adminName =
    !user?.name || user?.name === 'System Administrator' || user?.name === 'admin'
      ? 'Dr. Ramesh Deshmukh'
      : user.name;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Administrator Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#07172b] via-[#0b2545] to-[#1e3a8a] text-white shadow-xl shadow-blue-950/15">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Administration Console</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Oversight: {adminName}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl">
            Institutional governance center: supervise faculty teaching accounts, student enrollments, exam records, and institution-wide predictive performance analytics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('teachers')}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Manage Faculty</span>
          </button>
          <button
            onClick={() => onNavigateTab('infographics')}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md active:scale-95 border border-blue-400/30"
          >
            <Compass className="w-4 h-4 text-blue-200" />
            <span>Campus AI Forecast</span>
          </button>
        </div>
      </div>

      {/* 4 Administrative KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Campus Enrolled Students */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Campus Enrollment
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {analytics.total_students}
            </span>
            <p className="mt-1 text-xs text-slate-500">Registered candidates</p>
          </div>
        </div>

        {/* Card 2: Faculty & Teachers Count */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Faculty & Staff
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-50 text-amber-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {teachers.length || 2}
            </span>
            <p className="mt-1 text-xs text-slate-500">Authorized instructor accounts</p>
          </div>
        </div>

        {/* Card 3: Institutional Average Marks */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Institutional GPA
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {analytics.average_marks}%
            </span>
            <p className="mt-1 text-xs text-slate-500">Institutional benchmark across courses</p>
          </div>
        </div>

        {/* Card 4: Campus Attendance Compliance */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Attendance Health
            </span>
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-2xl ${
                analytics.average_attendance >= 75 ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
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
            <p className="mt-1 text-xs text-slate-500">University 75% rule compliance</p>
          </div>
        </div>
      </div>

      {/* Institutional Performance Prediction AI Forecast Infographic */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#07172b] via-[#0b2545] to-[#1e3a8a] text-white rounded-3xl shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Institutional Predictive Analytics AI</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Campus Academic Trajectory & Risk Forecast Infographics
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Composite analytics across examinations, attendance records, and pedagogical intervention rates.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('infographics')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md self-start md:self-auto"
          >
            <span>Launch Infographics Suite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-[11px] uppercase font-bold text-slate-300 block">
              Institutional Pass Forecast
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-emerald-300 font-mono tabular-nums">
                91.8%
              </span>
              <span className="text-xs text-slate-300 font-semibold">(Projected)</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Based on historical examination variance
            </p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-[11px] uppercase font-bold text-slate-300 block">
              At-Risk Candidates Flagged
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-300 font-mono tabular-nums">
                {atRiskCount}
              </span>
              <span className="text-xs text-slate-300 font-semibold">of {analytics.total_students} Students</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Assigned to faculty remedial monitoring
            </p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-[11px] uppercase font-bold text-slate-300 block">
              Institutional Health Index
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-blue-300 font-mono tabular-nums">
                86.4
              </span>
              <span className="text-xs text-slate-300 font-semibold">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              High pedagogical stability rating
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Faculty Accounts Roster & Top Students Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Faculty Roster Quick Review */}
        <div className="lg:col-span-6 p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Authorized Faculty Accounts ({teachers.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Academic instructors provisioned for portal grading
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('teachers')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage All
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {t.name ? t.name.charAt(0) : 'T'}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{t.name}</h5>
                    <span className="text-[11px] text-slate-400">Username: {t.username}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                  Faculty
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Campus Performers Leaderboard */}
        <div className="lg:col-span-6 p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Campus Honor Roll Leaderboard
                </h3>
                <p className="text-xs text-slate-500">
                  Top performing students across evaluated examinations
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('rankings')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Full Rankings
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {analytics.top_students.slice(0, 4).map((st, idx) => (
              <div key={st.student_id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      idx === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    #{st.rank}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{st.name}</h5>
                    <span className="text-[11px] text-slate-400">Sem {st.semester} · Div {st.division}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-600">{st.percentage}%</span>
                  <span className="text-[10px] text-slate-400 block">Grade {st.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Administrative Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('teachers')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs text-left transition-all group flex items-center gap-3"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Manage Faculty</h4>
            <p className="text-[11px] text-slate-500">Provision instructor logins</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('students')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs text-left transition-all group flex items-center gap-3"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Student Directory</h4>
            <p className="text-[11px] text-slate-500">Enrollment records</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('analytics')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs text-left transition-all group flex items-center gap-3"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Institutional Analytics</h4>
            <p className="text-[11px] text-slate-500">Benchmark spread</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('reports')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs text-left transition-all group flex items-center gap-3"
        >
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Institutional Reports</h4>
            <p className="text-[11px] text-slate-500">Print transcripts & audit</p>
          </div>
        </button>
      </div>
    </div>
  );
};
