import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Award,
  RefreshCw,
  BarChart2,
  Sliders,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle,
  Download,
  Maximize2,
} from 'lucide-react';
import { Student, PredictionInfographic } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface AIRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId?: string;
  students: Student[];
}

export const AIRiskModal: React.FC<AIRiskModalProps> = ({
  isOpen,
  onClose,
  studentId,
  students,
}) => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';

  const defaultId = isStudent && user?.student_id ? user.student_id : studentId || students[0]?.id || '';
  const [selectedId, setSelectedId] = useState<string>(defaultId);
  const [activeViewTab, setActiveViewTab] = useState<'infographics' | 'counselor'>('infographics');

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [infographics, setInfographics] = useState<PredictionInfographic | null>(null);
  const [metrics, setMetrics] = useState<{ avgMarks: number; avgAttendance: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Interactive Remedial Simulation Slider state
  const [simulatedHours, setSimulatedHours] = useState<number>(4);

  useEffect(() => {
    if (isStudent && user?.student_id) {
      setSelectedId(user.student_id);
    } else if (studentId) {
      setSelectedId(studentId);
    } else if (students.length && !selectedId) {
      setSelectedId(students[0].id);
    }
  }, [studentId, students, isStudent, user]);

  const runDiagnostic = async (idToAnalyze: string) => {
    if (!idToAnalyze) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: idToAnalyze }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        setMetrics(data.metrics || null);
        if (data.infographics) {
          setInfographics(data.infographics);
        }
      } else {
        setError(data.message || 'Failed to complete analysis');
      }
    } catch (e: any) {
      setError(e.message || 'Error communicating with analytics service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && selectedId) {
      runDiagnostic(selectedId);
    }
  }, [isOpen, selectedId]);

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedId);

  // Simulation calculation
  const simulationGain =
    simulatedHours === 0
      ? 0
      : simulatedHours === 2
      ? 3.5
      : simulatedHours === 4
      ? 6.8
      : simulatedHours === 6
      ? 9.9
      : 13.2;

  const baselinePredicted = infographics?.predicted_final_gpa || metrics?.avgMarks || 70;
  const simulatedFinalGpa = Math.min(99.5, Math.round((baselinePredicted + simulationGain) * 10) / 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-[#0b2545] via-[#102a43] to-[#1e3a8a] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 shadow-inner">
              <Compass className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                Academic Performance Prediction & Risk Intelligence
              </h3>
              <p className="text-xs text-slate-300">
                Multi-dimensional statistical forecasting, risk vectors, and remedial impact simulation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Tab Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs">
          {/* Student Selector (Restricted for students: they only see their own profile) */}
          {!isStudent ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Selected Candidate:</span>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  runDiagnostic(e.target.value);
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.roll_number || st.id})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span>Student Candidate:</span>
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold">
                {currentStudent?.name || user?.name}
              </span>
            </div>
          )}

          {/* Toggle between Interactive Infographics & Written Remarks */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveViewTab('infographics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                activeViewTab === 'infographics'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Gauges & Vectors</span>
            </button>
            <button
              onClick={() => setActiveViewTab('counselor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                activeViewTab === 'counselor'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Counselor Diagnostic</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-4 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Synthesizing academic trajectory models, attendance reliability, and predictive infographics...
              </p>
            </div>
          ) : infographics && analysis ? (
            <>
              {/* Top KPI Infographic Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Academic Health Score */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Academic Health Index
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-3xl font-black font-mono tabular-nums ${
                        infographics.health_score >= 75
                          ? 'text-emerald-600'
                          : infographics.health_score >= 60
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {infographics.health_score}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">/ 100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        infographics.health_score >= 75
                          ? 'bg-emerald-500'
                          : infographics.health_score >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${infographics.health_score}%` }}
                    />
                  </div>
                </div>

                {/* 2. Projected Final GPA */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Projected Final GPA
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono text-blue-600 tabular-nums">
                      {infographics.predicted_final_gpa}%
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      (Midterm: {metrics?.avgMarks}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-2.5">
                    {infographics.predicted_final_gpa >= (metrics?.avgMarks || 0) ? (
                      <span className="text-emerald-600 flex items-center font-bold">
                        <ArrowUpRight className="w-3.5 h-3.5" /> Steady Momentum
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center font-bold">
                        <ArrowDownRight className="w-3.5 h-3.5" /> Attendance Penalty
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Potential With Tutoring */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/60 border border-indigo-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                    Intervention Ceiling
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono text-indigo-700 tabular-nums">
                      {infographics.potential_with_intervention}%
                    </span>
                    <span className="text-xs font-bold text-indigo-600">
                      (+{(infographics.potential_with_intervention - infographics.predicted_final_gpa).toFixed(1)}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-600 font-medium mt-2.5">
                    With structured lab revision
                  </p>
                </div>

                {/* 4. Risk Level Assessment */}
                <div
                  className={`p-4 rounded-2xl border shadow-xs ${
                    analysis.risk_level === 'high'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : analysis.risk_level === 'moderate'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider block mb-1">
                    Diagnostic Risk State
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black capitalize font-sans">
                      {analysis.risk_level} Risk
                    </span>
                  </div>
                  <p className="text-[11px] mt-2.5 font-medium leading-tight opacity-90">
                    Risk Index: {infographics.risk_index}% Vulnerability
                  </p>
                </div>
              </div>

              {activeViewTab === 'infographics' ? (
                /* ================= INFOGRAPHICS VIEW ================= */
                <div className="space-y-6">
                  {/* Multi-Factor Radar / Breakdown Infographic Bars */}
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Multi-Factor Risk Diagnostic Vectors
                        </h4>
                        <p className="text-xs text-slate-500">
                          Weighted performance components evaluated across semester milestones
                        </p>
                      </div>
                      <span className="text-[11px] font-bold uppercase text-slate-400">
                        Pillars (0 - 100)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {infographics.factors.map((factor, idx) => (
                        <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800">{factor.category}</span>
                            <span
                              className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                                factor.status === 'optimal'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : factor.status === 'moderate'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {factor.score}% · {factor.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                factor.status === 'optimal'
                                  ? 'bg-emerald-500'
                                  : factor.status === 'moderate'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(10, factor.score))}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-slate-500">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Simulation Infographic: Remedial Tutoring Investment */}
                  <div className="p-6 bg-gradient-to-br from-blue-900 via-[#102a43] to-[#0b2545] text-white rounded-2xl shadow-md space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                          <Sliders className="w-4 h-4" />
                          <span>Interactive Intervention Simulation</span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          Forecast Trajectory with Remedial Tutoring
                        </h4>
                        <p className="text-xs text-slate-300">
                          Slide to simulate the projected academic uplift from weekly supervised study hours
                        </p>
                      </div>

                      {/* Result Pill */}
                      <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-right self-start sm:self-auto">
                        <span className="text-[10px] text-slate-300 font-semibold uppercase block">
                          Simulated Final GPA
                        </span>
                        <span className="text-2xl font-black text-amber-300 font-mono tabular-nums">
                          {simulatedFinalGpa}%
                        </span>
                        <span className="text-[11px] text-emerald-300 font-bold block">
                          +{simulationGain.toFixed(1)}% Projected Gain
                        </span>
                      </div>
                    </div>

                    {/* Interactive Range Slider */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>0 hrs / week</span>
                        <span className="text-amber-300 font-bold text-sm">{simulatedHours} hrs / week</span>
                        <span>8 hrs / week</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        step="2"
                        value={simulatedHours}
                        onChange={(e) => setSimulatedHours(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>No Extra Study</span>
                        <span>Light Review</span>
                        <span>Targeted Mentoring</span>
                        <span>Deep Remedial Labs</span>
                        <span>Comprehensive Immersion</span>
                      </div>
                    </div>
                  </div>

                  {/* Subject Trajectory Forecast Cards */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      Subject-by-Subject Forecast Trajectory
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {infographics.subject_forecasts.map((sub, i) => (
                        <div
                          key={i}
                          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-900 leading-snug">
                              {sub.subject_name}
                            </h5>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                                sub.trajectory === 'up'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : sub.trajectory === 'stable'
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {sub.trajectory === 'up' ? '↑ Gain' : sub.trajectory === 'stable' ? '→ Stable' : '↓ Risk'}
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between pt-1 text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Current Midterm</span>
                              <span className="font-mono font-bold text-slate-700 tabular-nums">
                                {sub.current_marks}%
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">Forecast Final</span>
                              <span className="font-mono font-bold text-blue-600 tabular-nums">
                                {sub.forecast_final}%
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                            <span>Status:</span>
                            <span className="font-semibold text-slate-700">{sub.difficulty_weight}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* ================= COUNSELOR DIAGNOSTIC VIEW ================= */
                <div className="space-y-5">
                  {/* Executive Summary */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-950 text-xs leading-relaxed">
                    <span className="font-bold text-blue-900 block mb-1">
                      Academic Diagnostic Overview:
                    </span>
                    {analysis.summary}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/70">
                      <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Demonstrated Academic Strengths
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {analysis.strengths?.map((str: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200/70">
                      <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5 mb-2.5">
                        <TrendingDown className="w-4 h-4 text-rose-600" />
                        Vulnerabilities & Risk Indicators
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {analysis.weaknesses?.map((w: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-600 font-bold">!</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Prescribed Action Items */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h5 className="text-xs font-bold text-slate-900 mb-2">
                      Recommended Pedagogical Interventions
                    </h5>
                    <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside">
                      {analysis.action_items?.map((item: string, i: number) => (
                        <li key={i} className="leading-relaxed font-medium">
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Official Tutor Remarks */}
                  <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                      Certified Tutor / Counselor Remarks:
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed italic">
                      "{analysis.tutor_remarks}"
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="text-xs text-slate-500 font-medium">
            Candidate: <strong>{currentStudent?.name}</strong> · Sem {currentStudent?.semester} (Div {currentStudent?.division})
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
          >
            Close Forecast
          </button>
        </div>
      </div>
    </div>
  );
};
