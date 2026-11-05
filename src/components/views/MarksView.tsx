import React, { useState } from 'react';
import { PlusCircle, Trash2, Search, BookOpen, AlertCircle } from 'lucide-react';
import { EnrichedMark, Student, Subject } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MarksViewProps {
  marks: EnrichedMark[];
  students: Student[];
  subjects: Subject[];
  onRefresh: () => void;
}

export const MarksView: React.FC<MarksViewProps> = ({ marks, students, subjects, onRefresh }) => {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [semester, setSemester] = useState(4);
  const [marksValue, setMarksValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !subjectId || marksValue === '') return;

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          subject_id: subjectId,
          semester: Number(semester),
          marks: Number(marksValue),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ text: 'Marks recorded successfully!' });
        setMarksValue('');
        onRefresh();
      } else {
        setStatusMsg({ text: data.message || 'Failed to record marks', error: true });
      }
    } catch (e: any) {
      setStatusMsg({ text: e.message || 'Error communicating with server', error: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mark record?')) return;
    try {
      const res = await fetch(`/api/marks/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredMarks = marks.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.subject_name.toLowerCase().includes(q);
  });

  const getGradeInfo = (score: number) => {
    if (score >= 90) return { grade: 'O', gp: 10, label: 'Outstanding', color: 'bg-emerald-100 text-emerald-800' };
    if (score >= 80) return { grade: 'A+', gp: 9, label: 'Excellent', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { grade: 'A', gp: 8, label: 'Very Good', color: 'bg-cyan-100 text-cyan-800' };
    if (score >= 60) return { grade: 'B+', gp: 7, label: 'Good', color: 'bg-indigo-100 text-indigo-800' };
    if (score >= 55) return { grade: 'B', gp: 6, label: 'Above Avg', color: 'bg-amber-100 text-amber-800' };
    if (score >= 50) return { grade: 'C', gp: 5, label: 'Average', color: 'bg-amber-100 text-amber-800' };
    if (score >= 40) return { grade: 'P', gp: 4, label: 'Pass', color: 'bg-slate-100 text-slate-800' };
    return { grade: 'F', gp: 0, label: 'Fail', color: 'bg-rose-100 text-rose-800 font-bold' };
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & UGC Scale Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
            10-Point Indian University Grade Scale
          </span>
          <span className="text-xs text-slate-400">· Standard UGC / AICTE Norms</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Student Marks & Examination Scores
        </h2>
        <p className="text-xs text-slate-500">
          {user?.role === 'student'
            ? 'View your subject scores, letter grades, grade points (GP), and semester academic standing'
            : 'Enter and manage student evaluation records with automatic grade computation'}
        </p>
      </div>

      {/* Enter Marks Card (Teacher/Admin only) */}
      {canEdit && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Enter Subject Marks</h3>
          </div>

          {statusMsg && (
            <div
              className={`p-3 mb-4 text-xs rounded-xl border ${
                statusMsg.error
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Student
              </label>
              <select
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Student</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.roll_number || st.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Subject
              </label>
              <select
                required
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select Subject</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.subject_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Semester
              </label>
              <input
                type="number"
                min="1"
                max="8"
                required
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Marks (out of 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
                placeholder="e.g. 85.5"
                value={marksValue}
                onChange={(e) => setMarksValue(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Add Marks'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Marks Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search marks by student or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <span className="text-xs text-slate-500">
            Total records: <strong className="text-slate-800">{filteredMarks.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Record ID</th>
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-6">Semester</th>
                <th className="py-3 px-6">Score</th>
                <th className="py-3 px-6">Grade</th>
                <th className="py-3 px-6">Grade Point (GP)</th>
                <th className="py-3 px-6">Percentage</th>
                {canEdit && <th className="py-3 px-6 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredMarks.length > 0 ? (
                filteredMarks.map((m) => {
                  const isFail = m.marks < 50;
                  const isDistinction = m.marks >= 80;
                  const gradeInfo = getGradeInfo(m.marks);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-6 font-mono text-slate-400">{m.id}</td>
                      <td className="py-3 px-6 font-semibold text-slate-900">{m.name}</td>
                      <td className="py-3 px-6 text-slate-600">{m.subject_name}</td>
                      <td className="py-3 px-6">Sem {m.semester}</td>
                      <td className="py-3 px-6 font-mono font-bold tabular-nums">
                        <span
                          className={
                            isFail
                              ? 'text-rose-600'
                              : isDistinction
                              ? 'text-emerald-600'
                              : 'text-blue-600'
                          }
                        >
                          {m.marks}
                        </span>{' '}
                        <span className="text-slate-400 font-normal">/ 100</span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1.5 hidden sm:inline">{gradeInfo.label}</span>
                      </td>
                      <td className="py-3 px-6 font-mono font-bold text-slate-800">
                        {gradeInfo.gp}.0 / 10
                      </td>
                      <td className="py-3 px-6 font-mono font-bold tabular-nums text-slate-800">
                        {m.percentage}%
                      </td>
                      {canEdit && (
                        <td className="py-3 px-6 text-right">
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete mark entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="py-12 text-center text-slate-400">
                    No marks records found.
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
