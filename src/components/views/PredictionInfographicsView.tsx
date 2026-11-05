import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Compass,
  BarChart2,
  Sliders,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  AlertTriangle,
  RefreshCw,
  Users,
  CalendarCheck,
  CheckCircle2,
  Download,
  FileText,
  Target,
  Zap,
  Edit3,
  Printer,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Student, PredictionInfographic } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { MarksheetModal } from '../modals/MarksheetModal';

interface PredictionInfographicsViewProps {
  students: Student[];
  onOpenModal?: (studentId?: string) => void;
}

export const PredictionInfographicsView: React.FC<PredictionInfographicsViewProps> = ({
  students,
  onOpenModal,
}) => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const defaultId = isStudent && user?.student_id ? user.student_id : students[0]?.id || '';
  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultId);

  const [loading, setLoading] = useState(false);
  const [infographics, setInfographics] = useState<PredictionInfographic | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [metrics, setMetrics] = useState<{ avgMarks: number; avgAttendance: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tab mode: 'interactive' | 'forecasts' | 'correlation' | 'master_poster'
  const [viewMode, setViewMode] = useState<'interactive' | 'forecasts' | 'correlation' | 'master_poster'>('interactive');

  // Marksheet Modal State
  const [isMarksheetModalOpen, setIsMarksheetModalOpen] = useState(false);

  // Interactive Remedial Tutoring Simulation Slider
  const [simulatedHours, setSimulatedHours] = useState<number>(4);

  // Poster container ref for print
  const posterRef = useRef<HTMLDivElement>(null);

  // Sync selected student ID
  useEffect(() => {
    if (isStudent && user?.student_id) {
      setSelectedStudentId(user.student_id);
    } else if (students.length && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, isStudent, user]);

  const fetchInfographics = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        setInfographics(data.infographics);
        setAnalysis(data.analysis);
        setMetrics(data.metrics || null);
      } else {
        setError(data.message || 'Unable to compute prediction infographics');
      }
    } catch (e: any) {
      setError(e.message || 'Network error fetching prediction data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudentId) {
      fetchInfographics(selectedStudentId);
    }
  }, [selectedStudentId]);

  const currentStudent = students.find((s) => s.id === selectedStudentId);

  // Simulation calculations based on slider (0 to 12 hours)
  const simulationGain =
    simulatedHours === 0
      ? 0
      : simulatedHours === 2
      ? 3.2
      : simulatedHours === 4
      ? 6.8
      : simulatedHours === 6
      ? 10.1
      : simulatedHours === 8
      ? 12.9
      : simulatedHours === 10
      ? 14.5
      : 16.0;

  const baselinePredicted = infographics?.predicted_final_gpa || metrics?.avgMarks || 70;
  const simulatedFinalGpa = Math.min(99.5, Math.round((baselinePredicted + simulationGain) * 10) / 10);

  const getSimulatedGrade = (pct: number) => {
    if (pct >= 90) return 'A+ (Distinction / Gold Medal)';
    if (pct >= 80) return 'A (First Class with Distinction)';
    if (pct >= 70) return 'B+ (First Class Standing)';
    if (pct >= 60) return 'B (Higher Second Class)';
    if (pct >= 50) return 'C (Pass Class Threshold)';
    return 'D (At-Risk / Remedial Essential)';
  };

  const handlePrintPoster = () => {
    window.print();
  };

  // Radar Chart Geometry Calculator
  const renderRadarChart = () => {
    const factors = infographics?.factors || [
      { category: 'Core Curriculum Mastery', score: 85 },
      { category: 'Classroom Attendance Reliability', score: 80 },
      { category: 'Curriculum Breadth Stability', score: 90 },
      { category: 'Exam Readiness Confidence', score: 75 },
      { category: 'Practical & Lab Rigor', score: 88 },
      { category: 'AI Concept Foundation', score: 82 },
    ];

    const size = 340;
    const center = size / 2;
    const radius = 120;
    const total = factors.length;

    // Generate concentric polygon grid points
    const levels = [0.25, 0.5, 0.75, 1.0];

    // Compute student polygon points
    const points = factors.map((f, i) => {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const r = (f.score / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, angle, ...f };
    });

    const polygonPointsString = points.map((p) => `${p.x},${p.y}`).join(' ');

    return (
      <div className="relative flex flex-col items-center justify-center p-4">
        <svg width={size} height={size} className="overflow-visible select-none">
          {/* Background Concentric Webs */}
          {levels.map((lvl, lIdx) => {
            const lvlPoints = Array.from({ length: total }).map((_, i) => {
              const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
              const r = lvl * radius;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ');

            return (
              <g key={lIdx}>
                <polygon
                  points={lvlPoints}
                  fill={lIdx === 3 ? '#f8fafc' : 'none'}
                  stroke="#cbd5e1"
                  strokeWidth={lIdx === 3 ? '1.5' : '1'}
                  strokeDasharray={lIdx === 3 ? 'none' : '3 3'}
                />
                <text
                  x={center + 6}
                  y={center - lvl * radius + 12}
                  fontSize="9"
                  fill="#94a3b8"
                  fontWeight="bold"
                >
                  {lvl * 100}%
                </text>
              </g>
            );
          })}

          {/* Radial Spokes */}
          {Array.from({ length: total }).map((_, i) => {
            const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            );
          })}

          {/* Target Distinction Ring (80%) */}
          {(() => {
            const distPoints = Array.from({ length: total }).map((_, i) => {
              const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
              const r = 0.8 * radius;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ');
            return (
              <polygon
                points={distPoints}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="4 2"
                opacity="0.8"
              />
            );
          })()}

          {/* Student Filled Polygon */}
          <polygon
            points={polygonPointsString}
            fill="rgba(59, 130, 246, 0.28)"
            stroke="#2563eb"
            strokeWidth="2.5"
            className="transition-all duration-500 ease-out"
          />

          {/* Vertex Nodes & Category Labels */}
          {points.map((p, i) => {
            const labelDist = radius + 28;
            const lx = center + labelDist * Math.cos(p.angle);
            const ly = center + labelDist * Math.sin(p.angle);

            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  className="hover:scale-125 transition-transform origin-center cursor-pointer"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="2"
                  fill="#1d4ed8"
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#334155"
                  className="pointer-events-none"
                >
                  {p.category.split(' ')[0]}
                </text>
                <text
                  x={lx}
                  y={ly + 11}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fontWeight="extrabold"
                  fill={p.score >= 75 ? '#15803d' : p.score >= 60 ? '#b45309' : '#b91c1c'}
                >
                  {p.score}%
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500/30 border border-blue-600 inline-block" />
            <span>Candidate Assessment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0 border-t-2 border-sky-400 border-dashed inline-block" />
            <span>80% Distinction Baseline</span>
          </div>
        </div>
      </div>
    );
  };

  // Cohort Correlation Scatter Plot Geometry Calculator
  const renderCohortScatter = () => {
    const cohort = infographics?.cohort_distribution || [
      { attendance: 92, marks: 91, name: 'Aarav Sharma', isCurrent: true },
      { attendance: 88, marks: 82, name: 'Priya Patel' },
      { attendance: 58, marks: 49, name: 'Rohan Mehta' },
      { attendance: 94, marks: 90, name: 'Ananya Roy' },
      { attendance: 75, marks: 68, name: 'Vikram Joshi' },
      { attendance: 90, marks: 88, name: 'Sneha Gupta' },
    ];

    const width = 480;
    const height = 300;
    const padding = 45;
    const plotW = width - padding * 2;
    const plotH = height - padding * 2;

    const scaleX = (att: number) => padding + ((att - 40) / 60) * plotW;
    const scaleY = (m: number) => height - padding - ((m - 30) / 70) * plotH;

    const att75X = scaleX(75);
    const marks60Y = scaleY(60);

    return (
      <div className="relative flex flex-col items-center justify-center p-2">
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible select-none max-w-lg">
          {/* Quadrant Background Shading */}
          <rect x={att75X} y={padding} width={width - padding - att75X} height={marks60Y - padding} fill="#f0fdf4" opacity="0.6" />
          <rect x={padding} y={padding} width={att75X - padding} height={marks60Y - padding} fill="#fefce8" opacity="0.4" />
          <rect x={att75X} y={marks60Y} width={width - padding - att75X} height={height - padding - marks60Y} fill="#eff6ff" opacity="0.4" />
          <rect x={padding} y={marks60Y} width={att75X - padding} height={height - padding - marks60Y} fill="#fef2f2" opacity="0.5" />

          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" strokeWidth="1.5" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#94a3b8" strokeWidth="1.5" />

          {/* 75% Attendance Threshold Line */}
          <line x1={att75X} y1={padding} x2={att75X} y2={height - padding} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={att75X} y={padding - 6} fontSize="9" fill="#d97706" textAnchor="middle" fontWeight="bold">
            75% Attendance Rule
          </text>

          {/* 60% Passing / First-Class Line */}
          <line x1={padding} y1={marks60Y} x2={width - padding} y2={marks60Y} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={width - padding + 5} y={marks60Y + 3} fontSize="9" fill="#2563eb" fontWeight="bold">
            60% First Class
          </text>

          {/* Quadrant Labels */}
          <text x={width - padding - 8} y={padding + 16} fontSize="10" fontWeight="bold" fill="#166534" textAnchor="end">
            Honors & Regular (Tier 1)
          </text>
          <text x={padding + 8} y={padding + 16} fontSize="10" fontWeight="bold" fill="#854d0e" textAnchor="start">
            High Marks · Attendance Deficit
          </text>
          <text x={width - padding - 8} y={height - padding - 10} fontSize="10" fontWeight="bold" fill="#1e40af" textAnchor="end">
            Diligent · Needs Study Push
          </text>
          <text x={padding + 8} y={height - padding - 10} fontSize="10" fontWeight="bold" fill="#991b1b" textAnchor="start">
            Critical Intervention Tier
          </text>

          {/* Axis Labels */}
          <text x={width / 2} y={height - 8} fontSize="10" fontWeight="bold" fill="#475569" textAnchor="middle">
            Classroom Attendance (%)
          </text>
          <text
            x={14}
            y={height / 2}
            fontSize="10"
            fontWeight="bold"
            fill="#475569"
            textAnchor="middle"
            transform={`rotate(-90 14 ${height / 2})`}
          >
            Average Semester Score (%)
          </text>

          {/* Classmate Scatter Points */}
          {cohort.map((c, i) => {
            const cx = Math.max(padding + 10, Math.min(width - padding - 10, scaleX(c.attendance)));
            const cy = Math.max(padding + 10, Math.min(height - padding - 10, scaleY(c.marks)));
            const isTarget = c.isCurrent || c.name === currentStudent?.name;

            return (
              <g key={i} className="cursor-pointer">
                {isTarget ? (
                  <>
                    <circle cx={cx} cy={cy} r="14" fill="#3b82f6" opacity="0.25" className="animate-ping" />
                    <circle cx={cx} cy={cy} r="9" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2.5" />
                    <circle cx={cx} cy={cy} r="3" fill="#ffffff" />
                    <rect
                      x={cx - 45}
                      y={cy - 28}
                      width="90"
                      height="18"
                      rx="6"
                      fill="#0f172a"
                      opacity="0.9"
                    />
                    <text x={cx} y={cy - 16} fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">
                      {c.name.split(' ')[0]} ({c.marks}%)
                    </text>
                  </>
                ) : (
                  <>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="6"
                      fill={c.marks >= 80 ? '#10b981' : c.marks >= 60 ? '#60a5fa' : '#f87171'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      opacity="0.85"
                    />
                    <text x={cx} y={cy + 13} fontSize="8" fill="#64748b" textAnchor="middle">
                      {c.name.split(' ')[0]}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        <div className="mt-3 flex items-center justify-between w-full text-[11px] text-slate-500 px-4">
          <span>CSE(AIML) Sem 3 Cohort Distribution</span>
          <span className="font-semibold text-blue-700">Pulsing Node: Selected Candidate Profile</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Header with Marksheet Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">
              AI Pedagogical Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Department of CSE(AIML) · Semester 3
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Predictive Performance Infographics</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time vector radar diagnostics, subject score trajectories, attendance correlation, and remedial impact simulation.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setIsMarksheetModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-98 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-blue-200" />
            <span>Enter Subject Marks</span>
          </button>

          {/* Student Selector (If teacher or admin) */}
          {!isStudent && students.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.roll_number || '23AIML'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => fetchInfographics(selectedStudentId)}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh AI Calculation"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main View Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setViewMode('interactive')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'interactive'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Vector Radar & Health Diagnostics</span>
          </button>

          <button
            onClick={() => setViewMode('forecasts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'forecasts'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>CSE(AIML) Subject Trajectories & Simulator</span>
          </button>

          <button
            onClick={() => setViewMode('correlation')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'correlation'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Cohort Correlation Quad</span>
          </button>

          <button
            onClick={() => setViewMode('master_poster')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'master_poster'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Executive 4-in-1 Master Poster</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 px-3">
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <span>Interactive Vector Engine: <strong>Clean & Retina Sharp</strong></span>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">
            Synthesizing Interactive CSE(AIML) Infographics...
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Computing multidimensional radar vectors, subject velocity trajectories, and cohort regression models.
          </p>
        </div>
      ) : infographics && analysis ? (
        <div className="space-y-8">
          {/* ========================================================= */}
          {/* TAB 1: VECTOR RADAR & HEALTH DIAGNOSTICS */}
          {/* ========================================================= */}
          {viewMode === 'interactive' && (
            <div className="space-y-6">
              {/* Top KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Academic Health Index
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-blue-600 font-mono">
                      {infographics.health_score}/100
                    </span>
                    <span className="text-xs text-slate-500">Curriculum Score</span>
                  </div>
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${infographics.health_score}%` }}
                    />
                  </div>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Predicted Sem 3 SGPA
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-emerald-600 font-mono">
                      {infographics.predicted_final_gpa}%
                    </span>
                    <span className="text-xs text-emerald-600 font-bold">
                      {getSimulatedGrade(infographics.predicted_final_gpa).split(' ')[0]}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    Potential with tutoring:{' '}
                    <strong className="text-emerald-700">{infographics.potential_with_intervention}%</strong>
                  </p>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Class Attendance Compliance
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">
                      {metrics?.avgAttendance || 75}%
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        (metrics?.avgAttendance || 75) >= 75 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {(metrics?.avgAttendance || 75) >= 75 ? 'Eligible' : 'At-Risk (<75%)'}
                    </span>
                  </div>
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (metrics?.avgAttendance || 75) >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${metrics?.avgAttendance || 75}%` }}
                    />
                  </div>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Risk Diagnostic Tier
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span
                      className={`text-2xl font-extrabold capitalize ${
                        analysis.risk_level === 'low'
                          ? 'text-emerald-600'
                          : analysis.risk_level === 'moderate'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {analysis.risk_level} Risk
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 line-clamp-1">
                    {analysis.summary}
                  </p>
                </div>
              </div>

              {/* Main Dual Column: Interactive Vector Radar Chart + Factor Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Vector Radar Chart Canvas */}
                <div className="lg:col-span-6 p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <h3 className="text-base font-bold text-slate-900">
                          Multi-Vector Academic Spider Diagnostic
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        Vector SVG
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Evaluates six fundamental pillars: Core Curriculum, Attendance, Breadth Stability, Exam Readiness, Lab Rigor, and AIML Foundations.
                    </p>
                  </div>

                  {renderRadarChart()}
                </div>

                {/* Factor Diagnostic Breakdown */}
                <div className="lg:col-span-6 p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Factor-by-Factor Evaluation
                    </h3>
                    <p className="text-xs text-slate-500">
                      Calibrated based on latest marksheet data and internal classroom assessments
                    </p>
                  </div>

                  <div className="space-y-3">
                    {infographics.factors.map((factor, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{factor.category}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              factor.status === 'optimal'
                                ? 'bg-emerald-100 text-emerald-800'
                                : factor.status === 'moderate'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {factor.score}% · {factor.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{factor.description}</p>
                        <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              factor.status === 'optimal'
                                ? 'bg-emerald-500'
                                : factor.status === 'moderate'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${factor.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: SUBJECT TRAJECTORIES & REMEDIAL SIMULATOR */}
          {/* ========================================================= */}
          {viewMode === 'forecasts' && (
            <div className="space-y-6">
              {/* Interactive Remedial Tutoring Simulator Slider */}
              <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center">
                      <Sliders className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Interactive Remedial Study & Mentoring Simulator</h3>
                      <p className="text-xs text-blue-200">
                        Adjust weekly mentoring and supervised study hours to project SGPA trajectory gains
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-200 block">Projected SGPA</span>
                      <span className="text-2xl font-extrabold text-amber-300 font-mono">{simulatedFinalGpa}%</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/30 text-emerald-200 font-bold border border-emerald-400/30">
                      +{simulationGain}% Gain
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Remedial Study Intensity: {simulatedHours} Hours / Week</span>
                    <span className="text-amber-300">{getSimulatedGrade(simulatedFinalGpa)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="2"
                    value={simulatedHours}
                    onChange={(e) => setSimulatedHours(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>0h (Self-Study)</span>
                    <span>2h (Review)</span>
                    <span>4h (Tutoring)</span>
                    <span>6h (Intensive)</span>
                    <span>8h (Mentorship)</span>
                    <span>10h+ (Distinction)</span>
                  </div>
                </div>
              </div>

              {/* CSE(AIML) Subject Scorecard Trajectory Cards */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      CSE(AIML) Semester 3 Subject Forecast Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Current marks scored vs predicted final examination scores with momentum trajectory
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMarksheetModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Update Scores</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {infographics.subject_forecasts.map((sub, i) => {
                    const isGain = sub.forecast_final > sub.current_marks;
                    const diff = Math.round((sub.forecast_final - sub.current_marks) * 10) / 10;
                    return (
                      <div
                        key={i}
                        className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Course #{i + 1}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sub.current_marks >= 80
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : sub.current_marks >= 60
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {sub.difficulty_weight}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {sub.subject_name}
                          </h4>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold">Current</span>
                            <span className="text-xl font-extrabold text-slate-800 font-mono">
                              {sub.current_marks}%
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-slate-300">
                            <ChevronRight className="w-4 h-4" />
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-bold">Predicted</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xl font-extrabold text-blue-600 font-mono">
                                {sub.forecast_final}%
                              </span>
                              {isGain ? (
                                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-rose-600" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar with 80% mark */}
                        <div className="mt-3 relative w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              sub.forecast_final >= 80
                                ? 'bg-emerald-500'
                                : sub.forecast_final >= 60
                                ? 'bg-blue-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${sub.forecast_final}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: COHORT CORRELATION QUAD */}
          {/* ========================================================= */}
          {viewMode === 'correlation' && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Attendance vs Performance Cohort Correlation
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mapping student regularity against examination scores across CSE(AIML) Semester 3 cohort
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    75% Attendance Threshold Policy
                  </span>
                </div>

                {renderCohortScatter()}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <strong className="text-emerald-900 block font-bold">Top Right Quadrant</strong>
                    <span className="text-emerald-700 text-[11px]">Honors standing & consistent attendance. Eligible for university distinction.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                    <strong className="text-amber-900 block font-bold">Top Left Quadrant</strong>
                    <span className="text-amber-700 text-[11px]">Strong test capability but below 75% attendance. Exam hall ticket at risk.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200">
                    <strong className="text-blue-900 block font-bold">Bottom Right Quadrant</strong>
                    <span className="text-blue-700 text-[11px]">Regular attendance but scoring below 60%. Needs conceptual peer tutoring.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                    <strong className="text-rose-900 block font-bold">Bottom Left Quadrant</strong>
                    <span className="text-rose-700 text-[11px]">Critical intervention required. Both attendance and test marks below thresholds.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: EXECUTIVE 4-IN-1 MASTER POSTER */}
          {/* ========================================================= */}
          {viewMode === 'master_poster' && (
            <div className="space-y-4">
              <div className="flex justify-end gap-2">
                <button
                  onClick={handlePrintPoster}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>

              {/* Master Poster Container */}
              <div
                ref={posterRef}
                className="bg-white border-2 border-slate-300 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 print:shadow-none print:border-none print:p-0"
              >
                {/* Official University Header */}
                <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
                      EA
                    </div>
                    <div>
                      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        EduAnalytics University Institute of Technology
                      </h1>
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                        Department of Computer Science & Engineering (AI & Machine Learning)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Official Academic Forecast & Diagnostic Assessment · Semester 3
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Candidate</span>
                    <strong className="text-base text-slate-900 block">{currentStudent?.name}</strong>
                    <span className="text-xs text-blue-700 font-mono font-bold">
                      Roll: {currentStudent?.roll_number || '23AIML01'} · Div {currentStudent?.division || 'A'}
                    </span>
                  </div>
                </div>

                {/* 4 Poster Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pillar 1: Radar Diagnostic */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div className="border-b border-slate-200 pb-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        1. Multi-Vector Spider Diagnostic
                      </h3>
                      <p className="text-[11px] text-slate-500">Curriculum Health: {infographics.health_score}/100</p>
                    </div>
                    {renderRadarChart()}
                  </div>

                  {/* Pillar 2: Cohort Correlation Quad */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div className="border-b border-slate-200 pb-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        2. Attendance & Performance Quad
                      </h3>
                      <p className="text-[11px] text-slate-500">Attendance: {metrics?.avgAttendance}% · Marks: {metrics?.avgMarks}%</p>
                    </div>
                    {renderCohortScatter()}
                  </div>
                </div>

                {/* Pillar 3 & 4: Subject Forecast & Actionable Pedagogy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      3. Subject Score Trajectories
                    </h3>
                    <div className="space-y-2">
                      {infographics.subject_forecasts.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          <span className="font-semibold text-slate-800">{sub.subject_name}</span>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-slate-500">{sub.current_marks}%</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-bold text-blue-700">{sub.forecast_final}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      4. Remedial Study Action Roadmap
                    </h3>
                    <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-2.5">
                      <div className="font-bold text-blue-900 flex items-center justify-between">
                        <span>Advisor Diagnostic: {analysis.risk_level.toUpperCase()} RISK</span>
                        <span className="text-emerald-700">Projected SGPA: {infographics.predicted_final_gpa}%</span>
                      </div>
                      <p className="text-blue-800 text-[11px] leading-relaxed">
                        {analysis.tutor_remarks}
                      </p>
                      <div className="space-y-1 pt-1 border-t border-blue-200/60">
                        {analysis.action_items?.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-blue-950 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dean & System Seal */}
                <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Machine Learning Academic Diagnostic Verified · Model Calibrated for CSE(AIML) Sem 3</span>
                  </div>
                  <div className="text-right font-serif">
                    <span className="font-bold text-slate-900 block">Faculty Evaluation Committee</span>
                    <span className="text-[10px] text-slate-400">EduAnalytics Academic Governance</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Marksheet Modal */}
      <MarksheetModal
        isOpen={isMarksheetModalOpen}
        onClose={() => setIsMarksheetModalOpen(false)}
        student={currentStudent || null}
        onSuccess={() => {
          if (selectedStudentId) {
            fetchInfographics(selectedStudentId);
          }
        }}
      />
    </div>
  );
};
