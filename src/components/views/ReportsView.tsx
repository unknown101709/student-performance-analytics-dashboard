import React, { useState } from 'react';
import { Printer, Sparkles, GraduationCap, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { StudentRanking, EnrichedMark, EnrichedAttendance, Student, Subject } from '../../types';

interface ReportsViewProps {
  rankings: StudentRanking[];
  students: Student[];
  subjects: Subject[];
  marks: EnrichedMark[];
  attendance: EnrichedAttendance[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  rankings,
  students,
  subjects,
  marks,
  attendance,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [aiRemark, setAiRemark] = useState<any | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const studentMarks = marks.filter((m) => m.student_id === selectedStudentId);
  const studentAttendance = attendance.filter((a) => a.student_id === selectedStudentId);

  const studentAvg = studentMarks.length
    ? Math.round((studentMarks.reduce((acc, m) => acc + m.marks, 0) / studentMarks.length) * 10) / 10
    : 0;

  const totalClasses = studentAttendance.reduce((acc, a) => acc + a.total_classes, 0);
  const attendedClasses = studentAttendance.reduce((acc, a) => acc + a.attended_classes, 0);
  const attendanceAvg =
    totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 1000) / 10 : 0;

  const handleGenerateAiRemark = async () => {
    if (!selectedStudentId) return;
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: selectedStudentId }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAiRemark(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Official Academic Reports & Transcripts
          </h2>
          <p className="text-xs text-slate-500">
            Institutional performance summaries and printable semester report cards
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md active:scale-95 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Student Transcript Card Generator (Printable) */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 no-print">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Individual Student Semester Transcript
            </h3>
            <p className="text-xs text-slate-500">
              Select a student to generate their certified report card with official counselor remarks
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setAiRemark(null);
              }}
              className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.roll_number || st.id})
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateAiRemark}
              disabled={generatingAi}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{generatingAi ? 'Generating Remarks...' : 'Generate Counselor Remarks'}</span>
            </button>
          </div>
        </div>

        {/* ================= Printable Report Card Body ================= */}
        <div className="p-6 sm:p-10 border border-slate-200 rounded-2xl bg-white space-y-6 print:border-none print:p-0">
          {/* Institutional Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white mb-2">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
              College of Computer Applications & Technology
            </h3>
            <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mt-0.5">
              Official Semester Performance Grade Sheet
            </p>
            <div className="mt-2 text-[11px] text-slate-500">
              Academic Session 2025-2026 · Department of Computer Science
            </div>
          </div>

          {/* Student Information Block */}
          {currentStudent && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="block text-[11px] text-slate-500 font-semibold uppercase">Student Name</span>
                <span className="block font-bold text-slate-900 mt-0.5">{currentStudent.name}</span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 font-semibold uppercase">Roll Number</span>
                <span className="block font-bold text-slate-900 mt-0.5 font-mono">{currentStudent.roll_number || currentStudent.id}</span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 font-semibold uppercase">Course & Semester</span>
                <span className="block font-bold text-slate-900 mt-0.5">{currentStudent.course} · Sem {currentStudent.semester}</span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500 font-semibold uppercase">Division / Batch</span>
                <span className="block font-bold text-slate-900 mt-0.5">Division {currentStudent.division}</span>
              </div>
            </div>
          )}

          {/* Marks Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Course Evaluation Marks Breakdown
            </h4>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                  <th className="py-2.5 px-4 border-b border-slate-200">Subject Code</th>
                  <th className="py-2.5 px-4 border-b border-slate-200">Subject Name</th>
                  <th className="py-2.5 px-4 border-b border-slate-200 text-right">Max Marks</th>
                  <th className="py-2.5 px-4 border-b border-slate-200 text-right">Obtained Marks</th>
                  <th className="py-2.5 px-4 border-b border-slate-200 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentMarks.map((m) => (
                  <tr key={m.id}>
                    <td className="py-2.5 px-4 font-mono font-semibold text-slate-600">{m.subject_code || 'CS400'}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{m.subject_name}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">100</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900">{m.marks}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`text-[11px] font-bold ${m.marks >= 50 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {m.marks >= 50 ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Attendance & Aggregate Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="block text-[11px] text-slate-500 font-semibold uppercase">Cumulative Performance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{studentAvg}%</span>
                <span className="text-xs font-bold text-slate-600">
                  ({studentAvg >= 80 ? 'Grade A · Distinction' : studentAvg >= 60 ? 'Grade B · First Class' : 'Remedial Required'})
                </span>
              </div>
            </div>
            <div>
              <span className="block text-[11px] text-slate-500 font-semibold uppercase">Classroom Attendance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-2xl font-black font-mono tabular-nums ${attendanceAvg >= 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {attendanceAvg}%
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  ({attendedClasses} / {totalClasses} sessions attended)
                </span>
              </div>
            </div>
          </div>

          {/* AI Tutor Remarks & Pedagogical Assessment */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Academic Counselor & Tutor Remarks:
              </span>
              {aiRemark && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  aiRemark.risk_level === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Risk Level: {aiRemark.risk_level}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed italic">
              "{aiRemark?.tutor_remarks || (studentAvg >= 75
                ? `${currentStudent?.name} maintains exemplary marks and consistent lab engagement. Recommended for advanced elective certifications.`
                : `${currentStudent?.name} demonstrates adequate conceptual understanding but requires targeted revisions on low-scoring courses.`)}"
            </p>

            {aiRemark?.action_items && (
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-800 uppercase block mb-1">
                  Prescribed Action Items:
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {aiRemark.action_items.map((action: string, i: number) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="font-bold text-blue-600">·</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs text-slate-600">
            <div className="border-t border-slate-400 pt-2">
              <span className="font-semibold text-slate-800">Head of Department</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <span className="font-semibold text-slate-800">Academic Counselor</span>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <span className="font-semibold text-slate-800">Controller of Examinations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
        {/* Performance Report */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Cohort Performance Overview
          </h3>
          <div className="divide-y divide-slate-100">
            {rankings.map((r) => (
              <div key={r.student_id} className="flex items-center justify-between py-2.5 text-xs">
                <span className="font-semibold text-slate-900">{r.name}</span>
                <span className="font-mono font-bold text-blue-600 tabular-nums">{r.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Report */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Cohort Attendance Overview
          </h3>
          <div className="divide-y divide-slate-100">
            {rankings.map((r) => {
              const att = r.attendance ?? r.average_attendance ?? 75;
              return (
                <div key={r.student_id || r.id} className="flex items-center justify-between py-2.5 text-xs">
                  <span className="font-semibold text-slate-900">{r.name}</span>
                  <span
                    className={`font-mono font-bold tabular-nums ${
                      att >= 75 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {att}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
