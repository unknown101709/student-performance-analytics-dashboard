import React from 'react';
import {
  Users,
  TrendingUp,
  CalendarCheck,
  ClipboardList,
  Trophy,
  AlertTriangle,
  Compass,
  ArrowRight,
  BookOpen,
  FileText,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { AnalyticsResponse, StudentRanking } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface TeacherDashboardViewProps {
  analytics: AnalyticsResponse | null;
  loading: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenAiDiagnostic: (studentId?: string) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  analytics,
  loading,
  onNavigateTab,
  onOpenAiDiagnostic,
}) => {
  const { user } = useAuth();

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

  const atRiskStudents = analytics.at_risk_students || [];
  const highRiskCount = atRiskStudents.filter((s) => s.risk_level === 'high').length;
  const modRiskCount = atRiskStudents.filter((s) => s.risk_level === 'moderate').length;
  const safeCount = Math.max(0, analytics.total_students - atRiskStudents.length);

  const teacherName =
    !user?.name || user?.name === 'Prof. David Miller' || user?.name === 'teacher1'
      ? 'Prof. Rajesh Sharma'
      : user.name;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Faculty Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#07172b] via-[#0b2545] to-[#1e3a8a] text-white shadow-xl shadow-blue-950/15">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-lg bg-blue-500/20 text-blue-200 border border-blue-400/30">
              Faculty / Instructor Console
            </span>
            <span className="text-xs text-blue-200">
              Active Academic Cohort
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {teacherName}!
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl">
            Monitor class performance, record test marks, verify classroom attendance compliance, and evaluate predictive risk interventions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('infographics')}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Prediction Infographics</span>
          </button>
          <button
            onClick={() => onNavigateTab('marks')}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md active:scale-95 border border-blue-400/30"
          >
            <BookOpen className="w-4 h-4 text-blue-200" />
            <span>Record Marks</span>
          </button>
        </div>
      </div>

      {/* 4 Faculty KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Enrolled */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Class Enrollment
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {analytics.total_students}
            </span>
            <p className="mt-1 text-xs text-slate-500">Registered student candidates</p>
          </div>
        </div>

        {/* Card 2: Average Class Score */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Class Grade Average
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {analytics.average_marks}%
            </span>
            <p className="mt-1 text-xs text-slate-500">
              {analytics.average_marks >= 75 ? 'Distinction cohort benchmark' : 'Satisfactory class benchmark'}
            </p>
          </div>
        </div>

        {/* Card 3: Class Attendance Average */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Cohort Attendance
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
            <p className="mt-1 text-xs text-slate-500">
              {analytics.average_attendance >= 75 ? 'Meets mandatory 75% rule' : 'Deficit below 75% requirement'}
            </p>
          </div>
        </div>

        {/* Card 4: Tests Conducted */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Evaluated Tests
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-purple-50 text-purple-600">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {analytics.total_tests}
            </span>
            <p className="mt-1 text-xs text-slate-500">Recorded exam evaluations</p>
          </div>
        </div>
      </div>

      {/* Cohort Risk Distribution Infographic Strip for Teachers */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#07172b] via-[#0b2545] to-[#1e3a8a] text-white rounded-3xl shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Teacher Academic Intelligence</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Class Cohort Risk & Performance Prediction Infographic
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Distribution of enrolled candidates based on predictive examination trajectories and attendance health.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('infographics')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md self-start md:self-auto"
          >
            <span>Full Prediction Suite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cohort Risk Breakdown Bar Infographic */}
        <div className="space-y-4 pt-1">
          {/* Key Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-300 block">Safe Standing</span>
                <span className="text-xl font-extrabold text-white font-mono tabular-nums">{safeCount}</span>
                <span className="text-[10px] text-slate-400 block">Distinction / Steady</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {analytics.total_students ? Math.round((safeCount / analytics.total_students) * 100) : 0}%
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-amber-300 block">Moderate Risk</span>
                <span className="text-xl font-extrabold text-white font-mono tabular-nums">{modRiskCount}</span>
                <span className="text-[10px] text-slate-400 block">Needs Monitoring</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                {analytics.total_students ? Math.round((modRiskCount / analytics.total_students) * 100) : 0}%
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-rose-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-rose-300 block">High Priority</span>
                <span className="text-xl font-extrabold text-white font-mono tabular-nums">{highRiskCount}</span>
                <span className="text-[10px] text-slate-400 block">Immediate Action</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                {analytics.total_students ? Math.round((highRiskCount / analytics.total_students) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Clean Segmented Cohort Distribution Bar */}
          <div className="space-y-1.5 bg-slate-900/50 p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Cohort Distribution Meter</span>
              <span className="text-[11px] text-blue-200 font-mono">
                {analytics.total_students} Enrolled Students
              </span>
            </div>

            <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex gap-0.5 p-0.5 shadow-inner">
              <div
                className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
                style={{ width: `${(safeCount / (analytics.total_students || 1)) * 100}%` }}
                title={`Safe Standing: ${safeCount}`}
              />
              <div
                className="bg-amber-400 h-full transition-all duration-500"
                style={{ width: `${(modRiskCount / (analytics.total_students || 1)) * 100}%` }}
                title={`Moderate Risk: ${modRiskCount}`}
              />
              <div
                className="bg-rose-500 h-full rounded-r-full transition-all duration-500"
                style={{ width: `${(highRiskCount / (analytics.total_students || 1)) * 100}%` }}
                title={`High Priority: ${highRiskCount}`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-300 pt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  Safe ({safeCount})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                  Moderate ({modRiskCount})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  High Priority ({highRiskCount})
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>Pass Rate: <strong className="text-white">89.2%</strong></span>
                <span>Interventions Needed: <strong className="text-amber-300">{atRiskStudents.length}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Students Requiring Review & Subject Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flagged At-Risk Students Action Board */}
        <div className="lg:col-span-6 p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Students Flagged for Review ({atRiskStudents.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Scores &lt;60% or attendance &lt;75% requiring teacher follow-up
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('rankings')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {atRiskStudents.length > 0 ? (
              atRiskStudents.map((st) => (
                <div
                  key={st.student_id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-900">{st.name}</h5>
                    <span className="text-[11px] text-slate-500">
                      Score: <strong className="text-slate-700">{st.percentage}%</strong> · Attendance: <strong className="text-slate-700">{st.attendance}%</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        st.risk_level === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {st.risk_level}
                    </span>
                    <button
                      onClick={() => onOpenAiDiagnostic(st.student_id)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                    >
                      Diagnose
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                All students are currently meeting distinction and attendance thresholds!
              </p>
            )}
          </div>
        </div>

        {/* Subject Performance Breakdown Bar Chart */}
        <div className="lg:col-span-6 p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Subject Performance Benchmark
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

          <div className="space-y-4 pt-2">
            {analytics.subject_data.map((sub) => {
              const pct = sub.average;
              const isLow = pct < 60;
              const isHigh = pct >= 80;
              return (
                <div key={sub.subject_id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{sub.subject_name}</span>
                    <span className="font-mono font-bold text-slate-700 tabular-nums">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow ? 'bg-rose-500' : isHigh ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Teacher Operational Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('marks')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs text-left transition-all group flex items-center gap-3"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Record Test Marks</h4>
            <p className="text-[11px] text-slate-500">Enter exam scores</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('attendance')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs text-left transition-all group flex items-center gap-3"
        >
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Log Attendance</h4>
            <p className="text-[11px] text-slate-500">Record session presence</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('students')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs text-left transition-all group flex items-center gap-3"
        >
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Student Directory</h4>
            <p className="text-[11px] text-slate-500">Manage student profiles</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('reports')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs text-left transition-all group flex items-center gap-3"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Cohort Reports</h4>
            <p className="text-[11px] text-slate-500">Printable transcripts</p>
          </div>
        </button>
      </div>
    </div>
  );
};
