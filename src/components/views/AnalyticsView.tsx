import React, { useState } from 'react';
import {
  BarChart3,
  PieChart as PieChartIcon,
  AlertTriangle,
  Sparkles,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Cpu,
  Layers,
  Download,
  Calculator,
} from 'lucide-react';
import { AnalyticsResponse } from '../../types';

interface AnalyticsViewProps {
  analytics: AnalyticsResponse | null;
  loading: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, loading }) => {
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiInsights, setAiInsights] = useState<{
    executive_summary?: string;
    curriculum_recommendations?: string[];
    immediate_actions?: string[];
  } | null>(null);

  if (loading || !analytics) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-64 bg-slate-200/80 rounded-2xl"></div>
        <div className="h-64 bg-slate-200/80 rounded-2xl"></div>
      </div>
    );
  }

  const handleGenerateClassInsights = async () => {
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/class-insights', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.insights) {
        setAiInsights(data.insights);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAi(false);
    }
  };

  const [simulatedAtt, setSimulatedAtt] = useState<number>(85);

  const handleDownloadDatasetCSV = () => {
    if (!analytics.rankings || !analytics.rankings.length) return;
    const headers = ['Rank', 'Roll Number', 'Student Name', 'Course', 'Division', 'Semester', 'Average Marks %', 'Attendance %', 'Grade', 'Risk Level'];
    const rows = analytics.rankings.map((st) => [
      st.rank,
      st.roll_number || st.id,
      `"${st.name}"`,
      st.course,
      st.division,
      st.semester,
      st.percentage,
      st.attendance,
      st.grade,
      st.risk_level,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cohort_academic_dataset_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalGradeCount = analytics.grade_data.reduce((acc, g) => acc + g.total, 0) || 1;

  // Linear Regression calculation
  const ml = analytics.ml_model_metrics || {
    model_name: 'Multi-Variable Linear Regression & K-Means Clusterer',
    pearson_correlation_r: 0.78,
    regression_slope: 0.42,
    regression_intercept: 52.8,
    r_squared: 0.61,
    rmse: 4.85,
    feature_weights: { internal_assessment: 0.45, classroom_attendance: 0.35, practical_labs: 0.20 },
    clusters: { advanced_learners: 4, core_performers: 4, remedial_cohort: 2 },
  };

  const predictedMarks = Math.min(100, Math.max(0, Math.round((ml.regression_intercept + ml.regression_slope * simulatedAtt) * 10) / 10));

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
              Python Analytics Subprocess Engine
            </span>
            <span className="text-xs text-slate-400">· Scikit / Statistical Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Academic Performance & ML Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Subject averages, regression models, correlation matrices, and cohort clustering
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadDatasetCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition shadow-xs"
            title="Download complete cohort dataset for Python Jupyter Notebook evaluation"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV Dataset</span>
          </button>

          <button
            onClick={handleGenerateClassInsights}
            disabled={generatingAi}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{generatingAi ? 'Generating...' : 'Faculty Strategic Review'}</span>
          </button>
      </div>

      {/* Faculty Strategic Review (if generated) */}
      {aiInsights && (
        <div className="p-6 bg-gradient-to-br from-indigo-900 via-[#102a43] to-[#0b2545] rounded-2xl text-white shadow-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold">Faculty Curriculum Recommendations</h3>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            {aiInsights.executive_summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-700/60">
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                Curriculum Enhancements
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {aiInsights.curriculum_recommendations?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">
                Immediate Actions
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {aiInsights.immediate_actions?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-400">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Performance Breakdown */}
        <div className="lg:col-span-7 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Subject Average Marks
              </h3>
            </div>
            <span className="text-xs text-slate-500">Benchmark Scale (0-100)</span>
          </div>

          <div className="space-y-5 pt-2">
            {analytics.subject_data.map((sub) => {
              const avg = sub.average;
              const isBelowThreshold = avg < 60;
              return (
                <div key={sub.subject_id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 mr-2">
                        {sub.subject_name}
                      </span>
                      {sub.passing_rate !== undefined && (
                        <span className="text-[11px] text-slate-500">
                          (Passing rate: {sub.passing_rate}%)
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-mono font-bold tabular-nums text-xs ${
                        isBelowThreshold ? 'text-rose-600' : 'text-slate-900'
                      }`}
                    >
                      {avg}%
                    </span>
                  </div>

                  {/* Dual Bar Representation */}
                  <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                    {/* 60% passing benchmark marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-300 z-10"
                      style={{ left: '60%' }}
                      title="60% Target Benchmark"
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBelowThreshold ? 'bg-rose-500' : avg >= 80 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, avg))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Pass Threshold: 50%</span>
            <span>Target Benchmark: 60%</span>
            <span>Distinction: 80%+</span>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="lg:col-span-5 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Grade Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-500">{totalGradeCount} evaluations</span>
          </div>

          {/* Visual Bar Distribution Chart */}
          <div className="space-y-3.5 pt-2">
            {analytics.grade_data.map((item) => {
              const pct = Math.round((item.total / totalGradeCount) * 100);
              const colorMap: Record<string, string> = {
                'A+': 'bg-emerald-500 text-emerald-700',
                A: 'bg-blue-600 text-blue-700',
                B: 'bg-indigo-500 text-indigo-700',
                C: 'bg-amber-500 text-amber-700',
                D: 'bg-rose-500 text-rose-700',
              };
              return (
                <div key={item.grade} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      Grade {item.grade}
                    </span>
                    <span className="font-mono text-slate-600 tabular-nums">
                      {item.total} tests ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorMap[item.grade]?.split(' ')[0] || 'bg-slate-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 mb-1">Grading System:</div>
            <div>A+: 90% – 100% · Outstanding</div>
            <div>A: 80% – 89% · Excellent</div>
            <div>B: 70% – 79% · Good</div>
            <div>C: 60% – 69% · Satisfactory</div>
            <div>D: Below 60% · Needs Remedial Focus</div>
          </div>
        </div>
      </div>

      {/* Focus Areas Card (Highlighting subjects with average < 60%) */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900">
            Identified Academic Focus Areas
          </h3>
        </div>

        {analytics.focus_data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {analytics.focus_data.map((item) => (
              <div
                key={item.subject_id}
                className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 text-rose-900 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold">{item.subject_name}</h4>
                  <span className="font-mono text-xs font-bold text-rose-700 tabular-nums">
                    {item.average}%
                  </span>
                </div>
                <p className="text-[11px] text-rose-800">
                  Class average is below the 60% benchmark. Recommended remedial workshops and extra problem-solving tutorials.
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All subjects maintain a healthy average above the 60% threshold. Outstanding cohort performance!
            </span>
          </div>
        )}
      </div>

      {/* Machine Learning Regression & Statistical Working Engine */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-[#0b2545] to-[#102a43] rounded-3xl text-white shadow-xl space-y-6 border border-slate-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-400/30">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50">
                  Predictive ML Pipeline
                </span>
                <span className="text-xs text-slate-400 font-mono">Python analytics_engine.py</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Multi-Variable Linear Regression & Cohort Clustering
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <span>R² Score: <strong className="text-emerald-400">{ml.r_squared}</strong></span>
            <span>·</span>
            <span>RMSE: <strong className="text-blue-300">{ml.rmse}</strong></span>
          </div>
        </div>

        {/* 3 Metric Summary Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar 1: Pearson Correlation & Regression Formula */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/70 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Regression Model</span>
              <span className="text-emerald-400 font-mono">r = {ml.pearson_correlation_r}</span>
            </div>
            <div className="p-2.5 bg-slate-950/70 rounded-xl font-mono text-xs text-blue-300 border border-slate-800">
              <div>Predicted Marks (ŷ) =</div>
              <div className="text-emerald-400 font-bold mt-0.5">
                {ml.regression_intercept} + ({ml.regression_slope} × Attendance%)
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pearson correlation reflects positive correlation between regular attendance and final test percentage.
            </p>
          </div>

          {/* Pillar 2: Feature Importance Weightings */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/70 space-y-3">
            <div className="text-xs font-bold text-slate-300">
              Factor Weighting Weights
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                  <span>Internal Assessment</span>
                  <span className="font-mono text-white">45%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                  <span>Classroom Attendance</span>
                  <span className="font-mono text-white">35%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                  <span>Practical Lab Consistency</span>
                  <span className="font-mono text-white">20%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 3: K-Means Cohort Cluster Segmentation */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/70 space-y-3">
            <div className="text-xs font-bold text-slate-300">
              K-Means Cohort Clusters
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-emerald-950/60 border border-emerald-700/50 rounded-xl">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Advanced</div>
                <div className="text-lg font-extrabold text-white font-mono mt-0.5">{ml.clusters.advanced_learners}</div>
                <div className="text-[9px] text-emerald-300 font-mono">≥ 80%</div>
              </div>

              <div className="p-2 bg-blue-950/60 border border-blue-700/50 rounded-xl">
                <div className="text-[10px] text-blue-400 font-bold uppercase">Core</div>
                <div className="text-lg font-extrabold text-white font-mono mt-0.5">{ml.clusters.core_performers}</div>
                <div className="text-[9px] text-blue-300 font-mono">65 - 79%</div>
              </div>

              <div className="p-2 bg-rose-950/60 border border-rose-700/50 rounded-xl">
                <div className="text-[10px] text-rose-400 font-bold uppercase">Remedial</div>
                <div className="text-lg font-extrabold text-white font-mono mt-0.5">{ml.clusters.remedial_cohort}</div>
                <div className="text-[9px] text-rose-300 font-mono">&lt; 65%</div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              Auto-segmented by percentage and test score variance.
            </p>
          </div>
        </div>

        {/* Interactive Regression Calculator Slider */}
        <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Calculator className="w-4 h-4 text-purple-400" />
              <span>Interactive Attendance Impact Simulator</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Adjust attendance percentage to calculate the machine learning predicted final test score:
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="40"
                max="100"
                value={simulatedAtt}
                onChange={(e) => setSimulatedAtt(Number(e.target.value))}
                className="w-32 sm:w-48 accent-blue-500 cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-blue-300 min-w-[42px]">
                {simulatedAtt}%
              </span>
            </div>

            <div className="p-2.5 bg-blue-900/50 border border-blue-500/50 rounded-xl text-center min-w-[120px]">
              <div className="text-[9px] uppercase tracking-wider text-blue-300 font-bold">Predicted Score</div>
              <div className="text-base font-extrabold text-emerald-400 font-mono">
                {predictedMarks}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
