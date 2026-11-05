import React, { useState } from 'react';
import { Trophy, Medal, Search, Sparkles } from 'lucide-react';
import { StudentRanking } from '../../types';

interface RankingsViewProps {
  rankings: StudentRanking[];
  onOpenAiDiagnostic: (studentId: string) => void;
}

export const RankingsView: React.FC<RankingsViewProps> = ({ rankings, onOpenAiDiagnostic }) => {
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  const filteredRankings = rankings.filter((r) => {
    const matchSearch =
      search === '' ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.course.toLowerCase().includes(search.toLowerCase());
    const matchSem = semesterFilter === '' || r.semester === Number(semesterFilter);
    return matchSearch && matchSem;
  });

  const top3 = rankings.slice(0, 3);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <Trophy className="w-6 h-6 text-amber-500" />
          <span>Student Rankings & Leaderboard</span>
        </h2>
        <p className="text-xs text-slate-500">
          Computed academic standings based on cumulative semester subject percentages
        </p>
      </div>

      {/* Podium Top 3 Cards */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Silver - 2nd */}
          <div className="order-2 md:order-1 p-6 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/80 shadow-xs text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-200 text-slate-700 font-bold text-lg mb-3 shadow-inner">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">{top3[1].name}</h4>
            <span className="text-xs text-slate-500 mb-2">Sem {top3[1].semester} · Div {top3[1].division}</span>
            <div className="mt-auto pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs">
              <span className="font-mono font-extrabold text-blue-600 tabular-nums">{top3[1].percentage}%</span>
              <span className="font-bold text-slate-700">Grade {top3[1].grade}</span>
            </div>
          </div>

          {/* Gold - 1st */}
          <div className="order-1 md:order-2 p-6 bg-gradient-to-b from-amber-50/70 via-white to-white rounded-2xl border-2 border-amber-300 shadow-md text-center flex flex-col items-center relative -translate-y-1">
            <span className="absolute -top-3 px-3 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-xs">
              Rank #1 Scholar
            </span>
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 font-black text-xl mb-3 shadow-md shadow-amber-300/40">
              1
            </div>
            <h4 className="text-base font-extrabold text-slate-900">{top3[0].name}</h4>
            <span className="text-xs text-slate-500 mb-2">Sem {top3[0].semester} · Div {top3[0].division}</span>
            <div className="mt-auto pt-3 border-t border-amber-100 w-full flex items-center justify-between text-xs">
              <span className="font-mono font-black text-amber-600 text-sm tabular-nums">{top3[0].percentage}%</span>
              <span className="font-extrabold text-amber-700">Grade {top3[0].grade}</span>
            </div>
          </div>

          {/* Bronze - 3rd */}
          <div className="order-3 p-6 bg-gradient-to-b from-orange-50/50 to-white rounded-2xl border border-orange-200/70 shadow-xs text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 font-bold text-lg mb-3 shadow-inner">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">{top3[2].name}</h4>
            <span className="text-xs text-slate-500 mb-2">Sem {top3[2].semester} · Div {top3[2].division}</span>
            <div className="mt-auto pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs">
              <span className="font-mono font-extrabold text-blue-600 tabular-nums">{top3[2].percentage}%</span>
              <span className="font-bold text-slate-700">Grade {top3[2].grade}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Rank</th>
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-6">Course</th>
                <th className="py-3 px-6">Semester</th>
                <th className="py-3 px-6">Attendance</th>
                <th className="py-3 px-6">Percentage</th>
                <th className="py-3 px-6">Grade</th>
                <th className="py-3 px-6 text-right">Diagnostic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredRankings.length > 0 ? (
                filteredRankings.map((st) => (
                  <tr key={st.student_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-6 font-mono font-bold text-slate-800">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${
                          st.rank === 1
                            ? 'bg-amber-100 text-amber-800'
                            : st.rank === 2
                            ? 'bg-slate-200 text-slate-800'
                            : st.rank === 3
                            ? 'bg-orange-100 text-orange-800'
                            : 'text-slate-500'
                        }`}
                      >
                        {st.rank}
                      </span>
                    </td>
                    <td className="py-3 px-6 font-semibold text-slate-900">{st.name}</td>
                    <td className="py-3 px-6 text-slate-600">{st.course}</td>
                    <td className="py-3 px-6">Sem {st.semester}</td>
                    <td className="py-3 px-6 font-mono tabular-nums text-slate-600">
                      {st.attendance}%
                    </td>
                    <td className="py-3 px-6 font-mono font-bold text-blue-600 tabular-nums">
                      {st.percentage}%
                    </td>
                    <td className="py-3 px-6 font-bold text-slate-800">{st.grade}</td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => onOpenAiDiagnostic(st.student_id || st.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No ranking data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
