import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CalendarCheck,
  Trophy,
  TrendingUp,
  ArrowRight,
  Compass,
  Sliders,
  Award,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  MessageSquare,
  GraduationCap,
  Edit3,
} from 'lucide-react';
import { AnalyticsResponse, Student, EnrichedMark, EnrichedAttendance, StudentRanking, PredictionInfographic } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { MarksheetModal } from '../../modals/MarksheetModal';

interface StudentDashboardViewProps {
  analytics: AnalyticsResponse | null;
  marks: EnrichedMark[];
  attendance: EnrichedAttendance[];
  rankings: StudentRanking[];
  onNavigateTab: (tab: string) => void;
  onOpenAiDiagnostic: (studentId?: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  analytics,
  marks,
  attendance,
  rankings,
  onNavigateTab,
  onOpenAiDiagnostic,
}) => {
  const { user } = useAuth();

  // Find student's own records
  const myStudentId = user?.student_id;
  const myMarks = marks.filter((m) => !myStudentId || m.student_id === myStudentId);
  const myAttendance = attendance.filter((a) => !myStudentId || a.student_id === myStudentId);
  const myRanking = rankings.find((r) => r.student_id === myStudentId) || (rankings.length ? rankings[0] : null);

  // Calculate my averages
  const myAvgMarks = myMarks.length
    ? Math.round((myMarks.reduce((acc, m) => acc + m.marks, 0) / myMarks.length) * 10) / 10
    : analytics?.average_marks || 75;

  const totalClasses = myAttendance.reduce((acc, a) => acc + a.total_classes, 0);
  const attendedClasses = myAttendance.reduce((acc, a) => acc + a.attended_classes, 0);
  const myAvgAttendance = totalClasses > 0
    ? Math.round((attendedClasses / totalClasses) * 1000) / 10
    : analytics?.average_attendance || 82;

  // Embedded Prediction Infographics state for student
  const [infographics, setInfographics] = useState<PredictionInfographic | null>(null);
  const [simulatedHours, setSimulatedHours] = useState(4);
  const [isMarksheetModalOpen, setIsMarksheetModalOpen] = useState(false);

  useEffect(() => {
    if (myStudentId) {
      fetch('/api/ai/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: myStudentId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.infographics) {
            setInfographics(data.infographics);
          }
        })
        .catch((e) => console.error('Student dashboard forecast fetch error:', e));
    }
  }, [myStudentId]);

  const simulationGain =
    simulatedHours === 0
      ? 0
      : simulatedHours === 2
      ? 3.2
      : simulatedHours === 4
      ? 6.8
      : simulatedHours === 6
      ? 10.1
      : 12.9;

  const baselinePredicted = infographics?.predicted_final_gpa || myAvgMarks;
  const simulatedFinalScore = Math.min(99.5, Math.round((baselinePredicted + simulationGain) * 10) / 10);

  const studentName =
    user?.name || (user?.username === 'aarav' ? 'Aarav Sharma' : user?.username || 'Aarav Sharma');

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Student Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#07172b] via-[#0b2545] to-[#1d4ed8] text-white shadow-xl shadow-blue-950/15">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-bold tracking-wider uppercase rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Student Academic Space
            </span>
            <span className="text-xs text-blue-200">
              {user?.studentDetails?.course || 'CSE(AIML)'} · Sem {user?.studentDetails?.semester || 3} ({user?.studentDetails?.division || 'A'})
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {studentName}!
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl">
            Track your semester GPA, attendance compliance, subject examination performance, and predictive AI trajectory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setIsMarksheetModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-500/30 hover:bg-blue-500/50 rounded-xl transition-all shadow-xs border border-blue-400/40 active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-sky-200" />
            <span>Enter Marks</span>
          </button>
          <button
            onClick={() => onNavigateTab('infographics')}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Prediction Infographics</span>
          </button>
        </div>
      </div>

      {/* 4 Student KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: My Marks GPA */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              My Semester GPA
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-blue-600 font-mono tabular-nums">
                {myAvgMarks}%
              </span>
              <span className="text-xs font-bold text-slate-500">
                Grade {myRanking?.grade || (myAvgMarks >= 80 ? 'A' : myAvgMarks >= 70 ? 'B+' : 'B')}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {myAvgMarks >= 75 ? 'Distinction academic standing' : 'Higher second class'}
            </p>
          </div>
        </div>

        {/* Card 2: My Attendance */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Attendance Compliance
            </span>
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-2xl ${
                myAvgAttendance >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-extrabold font-mono tabular-nums ${
                  myAvgAttendance >= 75 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {myAvgAttendance}%
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                ({attendedClasses}/{totalClasses} sessions)
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {myAvgAttendance >= 75 ? 'Compliant with university 75% rule' : 'Warning: Below mandatory 75%'}
            </p>
          </div>
        </div>

        {/* Card 3: Class Rank */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Class Standing
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-50 text-amber-600">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
                #{myRanking?.rank || 1}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                in {user?.studentDetails?.course || 'CSE(AIML)'} Class
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Top {(myRanking ? Math.round((myRanking.rank / (rankings.length || 1)) * 100) : 10)}% cohort percentile
            </p>
          </div>
        </div>

        {/* Card 4: Evaluated Subjects */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Courses Evaluated
            </span>
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-purple-50 text-purple-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {myMarks.length || 4}
            </span>
            <p className="mt-1 text-xs text-slate-500">
              {myMarks.filter((m) => m.marks < 50).length === 0
                ? 'Zero academic backlogs'
                : `${myMarks.filter((m) => m.marks < 50).length} backlog requiring re-test`}
            </p>
          </div>
        </div>
      </div>



      {/* Embedded Performance Prediction AI Infographics Widget */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#07172b] via-[#0b2545] to-[#1e3a8a] text-white rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Predictive AI Infographics</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              My Semester Trajectory & Performance Forecast
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Simulate end-of-semester final exam GPA gains with weekly supervised study hours.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('infographics')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md self-start md:self-auto"
          >
            <span>Open Infographics Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Interactive Prediction Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-[11px] uppercase font-bold text-slate-300 block">
              Projected Final Exam GPA
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-300 font-mono tabular-nums">
                {infographics?.predicted_final_gpa || myAvgMarks}%
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                (Baseline)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Based on midterms and current {myAvgAttendance}% attendance
            </p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-[11px] uppercase font-bold text-slate-300 block">
              Remedial Tutoring Simulator
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-emerald-300 font-mono tabular-nums">
                {simulatedFinalScore}%
              </span>
              <span className="text-xs text-amber-300 font-bold">
                (+{simulationGain.toFixed(1)}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              With {simulatedHours} hrs/week mentored review
            </p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-[11px] uppercase font-bold text-slate-300 block">
              Academic Health State
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white font-mono tabular-nums">
                {infographics?.health_score || 85}
              </span>
              <span className="text-xs text-slate-300 font-bold">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {infographics?.risk_index && infographics.risk_index > 35 ? 'Moderate risk alert' : 'Optimal momentum'}
            </p>
          </div>
        </div>

        {/* Live Simulator Slider */}
        <div className="p-4 bg-black/20 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-200">
            <span>Simulate Tutoring Commitment:</span>
            <span className="text-amber-300 font-bold">{simulatedHours} Study Hours / Week</span>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            step="2"
            value={simulatedHours}
            onChange={(e) => setSimulatedHours(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0h (Self Study)</span>
            <span>2h (Review)</span>
            <span>4h (Tutoring)</span>
            <span>6h (Intensive)</span>
            <span>8h (Immersion)</span>
          </div>
        </div>

        {infographics && (
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-sky-300">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Predictive Vector Infographics Calibrated</span>
                <span className="text-[11px] text-slate-300">
                  Spider radar diagnostics, trajectory velocity forecasts, and cohort quad correlation
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('infographics')}
              className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Explore Infographics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: My Subject Scores & Attendance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* My Subject Performance Breakdown */}
        <div className="lg:col-span-7 p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                My Subject Scorecard
              </h3>
              <p className="text-xs text-slate-500">
                Examination results and percentage benchmarks for current semester
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsMarksheetModalOpen(true);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Enter Marks</span>
              </button>
              <button
                onClick={() => onNavigateTab('marks')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1"
              >
                <span>Detailed Marks</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {myMarks.length > 0 ? (
              myMarks.map((m) => {
                const pct = m.percentage || m.marks;
                const isHigh = pct >= 80;
                const isLow = pct < 60;
                return (
                  <div key={m.id || m.mark_id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{m.subject_name}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({m.subject_code})</span>
                      </div>
                      <span className="font-mono font-bold text-slate-800 tabular-nums">
                        {m.marks}/100 ({pct}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow ? 'bg-rose-500' : isHigh ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(8, pct))}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No examination marks recorded yet.</p>
            )}
          </div>
        </div>

        {/* My Subject Attendance Breakdown */}
        <div className="lg:col-span-5 p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Attendance by Subject
              </h3>
              <p className="text-xs text-slate-500">
                Mandatory minimum 75% attendance rule tracker
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {myAttendance.length > 0 ? (
              myAttendance.map((a) => {
                const pct = a.percentage || (a.total_classes > 0 ? Math.round((a.attended_classes / a.total_classes) * 100) : 0);
                const isCompliant = pct >= 75;
                return (
                  <div key={a.id || a.attendance_id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-slate-900 leading-tight">{a.subject_name}</h5>
                      <span className="text-[11px] text-slate-500">
                        {a.attended_classes} of {a.total_classes} attended
                      </span>
                    </div>
                    <span
                      className={`font-mono font-bold px-2.5 py-1 rounded-xl text-[11px] ${
                        isCompliant ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {pct}% {isCompliant ? '✓' : '⚠️'}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No attendance sessions recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Student Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('marks')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs text-left transition-all group flex items-center gap-3"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">My Subject Marks</h4>
            <p className="text-[11px] text-slate-500">View test scorecard</p>
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
            <h4 className="text-xs font-bold text-slate-900">My Attendance</h4>
            <p className="text-[11px] text-slate-500">Track 75% rule compliance</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('rankings')}
          className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-xs text-left transition-all group flex items-center gap-3"
        >
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Class Rankings</h4>
            <p className="text-[11px] text-slate-500">Class leaderboard position</p>
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
            <h4 className="text-xs font-bold text-slate-900">Official Transcript</h4>
            <p className="text-[11px] text-slate-500">Printable report card</p>
          </div>
        </button>
      </div>

      {/* Marksheet Upload & Manual Entry Modal */}
      <MarksheetModal
        isOpen={isMarksheetModalOpen}
        onClose={() => setIsMarksheetModalOpen(false)}
        student={
          user?.studentDetails ||
          (myStudentId
            ? {
                id: myStudentId,
                name: user?.name || user?.username || 'Student Candidate',
                course: 'CSE(AIML)',
                semester: 3,
                division: 'A',
                roll_number: '23AIML01',
              }
            : null)
        }
        onSuccess={() => {
          if (myStudentId) {
            fetch('/api/ai/analyze-student', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ student_id: myStudentId }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success && data.infographics) {
                  setInfographics(data.infographics);
                }
              })
              .catch((e) => console.error(e));
          }
        }}
      />
    </div>
  );
};
