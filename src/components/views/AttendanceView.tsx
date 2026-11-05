import React, { useState } from 'react';
import { CalendarCheck, PlusCircle, Trash2, Search, AlertCircle, Printer, X, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { EnrichedAttendance, Student, Subject } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface AttendanceViewProps {
  attendance: EnrichedAttendance[];
  students: Student[];
  subjects: Subject[];
  onRefresh: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendance,
  students,
  subjects,
  onRefresh,
}) => {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [semester, setSemester] = useState(4);
  const [totalClasses, setTotalClasses] = useState('36');
  const [attendedClasses, setAttendedClasses] = useState('30');
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const previewPct =
    Number(totalClasses) > 0
      ? Math.round((Number(attendedClasses) / Number(totalClasses)) * 1000) / 10
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !subjectId) return;

    if (Number(attendedClasses) > Number(totalClasses)) {
      setStatusMsg({ text: 'Attended classes cannot exceed total classes', error: true });
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          subject_id: subjectId,
          semester: Number(semester),
          total_classes: Number(totalClasses),
          attended_classes: Number(attendedClasses),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ text: 'Attendance recorded successfully!' });
        onRefresh();
      } else {
        setStatusMsg({ text: data.message || 'Failed to record attendance', error: true });
      }
    } catch (e: any) {
      setStatusMsg({ text: e.message || 'Error communicating with server', error: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    try {
      const res = await fetch(`/api/attendance/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Defaulter tier filter: 'all' | 'eligible' | 'warning' | 'critical'
  const [filterTier, setFilterTier] = useState<'all' | 'eligible' | 'warning' | 'critical'>('all');
  const [isDefaulterModalOpen, setIsDefaulterModalOpen] = useState(false);

  // Group attendance by student for aggregated defaulter calculation
  const studentAttendanceSummary = students.map((st) => {
    const stRecords = attendance.filter((a) => a.student_id === st.id);
    const totalCls = stRecords.reduce((acc, curr) => acc + (curr.total_classes || 0), 0);
    const attendedCls = stRecords.reduce((acc, curr) => acc + (curr.attended_classes || 0), 0);
    const pct = totalCls > 0 ? Math.round((attendedCls / totalCls) * 1000) / 10 : 0;
    return {
      student: st,
      totalClasses: totalCls,
      attendedClasses: attendedCls,
      percentage: pct,
      records: stRecords,
      status: pct >= 75 ? 'eligible' : pct >= 60 ? 'warning' : 'critical',
    };
  });

  const totalEligible = studentAttendanceSummary.filter((s) => s.status === 'eligible').length;
  const totalWarning = studentAttendanceSummary.filter((s) => s.status === 'warning').length;
  const totalCritical = studentAttendanceSummary.filter((s) => s.status === 'critical').length;

  const filteredAttendance = attendance.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      if (!a.name.toLowerCase().includes(q) && !a.subject_name.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filterTier === 'eligible') return a.percentage >= 75;
    if (filterTier === 'warning') return a.percentage >= 60 && a.percentage < 75;
    if (filterTier === 'critical') return a.percentage < 60;
    return true;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Defaulter Notice Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              75% Attendance Compliance Rule
            </span>
            <span className="text-xs text-slate-400">· Academic Year 2025-26</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Attendance Ledger & Defaulter Management
          </h2>
          <p className="text-xs text-slate-500">
            {user?.role === 'student'
              ? 'Track your classroom attendance and verify compliance with the 75% examination threshold'
              : 'Enter attendance, track defaulter cohorts, and issue official college notices'}
          </p>
        </div>

        <button
          onClick={() => setIsDefaulterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition shadow-xs shrink-0 self-start sm:self-auto"
        >
          <AlertCircle className="w-4 h-4 text-amber-700" />
          <span>Official Defaulter Notice (PDF)</span>
        </button>
      </div>

      {/* Attendance Defaulters KPI Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => setFilterTier('all')}
          className={`p-4 rounded-2xl border text-left transition ${
            filterTier === 'all'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase">Monitored Students</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
            {students.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">All enrolled candidates</div>
        </button>

        <button
          type="button"
          onClick={() => setFilterTier('eligible')}
          className={`p-4 rounded-2xl border text-left transition ${
            filterTier === 'eligible'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-700 uppercase">Eligible (≥ 75%)</div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
            {totalEligible}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Compliant with exam norms</div>
        </button>

        <button
          type="button"
          onClick={() => setFilterTier('warning')}
          className={`p-4 rounded-2xl border text-left transition ${
            filterTier === 'warning'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-amber-700 uppercase">Warning (60-74%)</div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono mt-1">
            {totalWarning}
          </div>
          <div className="text-[10px] text-amber-600 mt-0.5">Urgent makeup required</div>
        </button>

        <button
          type="button"
          onClick={() => setFilterTier('critical')}
          className={`p-4 rounded-2xl border text-left transition ${
            filterTier === 'critical'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-bold text-rose-700 uppercase">Critical Defaulter (&lt;60%)</div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono mt-1">
            {totalCritical}
          </div>
          <div className="text-[10px] text-rose-600 mt-0.5">Liable for exam detention</div>
        </button>
      </div>

      {/* Enter Attendance Card (Teacher/Admin only) */}
      {canEdit && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Enter Attendance Record</h3>
            </div>
            {Number(totalClasses) > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Calculated Percentage:</span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                    previewPct >= 75
                      ? 'bg-emerald-50 text-emerald-700'
                      : previewPct >= 60
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {previewPct}%
                </span>
              </div>
            )}
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

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
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
                Total Classes
              </label>
              <input
                type="number"
                min="1"
                required
                value={totalClasses}
                onChange={(e) => setTotalClasses(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Attended Classes
              </label>
              <input
                type="number"
                min="0"
                required
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Add Attendance'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Attendance Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search attendance by student or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <span className="text-xs text-slate-500">
            Total records: <strong className="text-slate-800">{filteredAttendance.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Student</th>
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-6">Semester</th>
                <th className="py-3 px-6">Total Classes</th>
                <th className="py-3 px-6">Attended</th>
                <th className="py-3 px-6">Attendance %</th>
                <th className="py-3 px-6">Status</th>
                {canEdit && <th className="py-3 px-6 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((a) => {
                  const isSafe = a.percentage >= 75;
                  const isWarning = a.percentage >= 60 && a.percentage < 75;
                  const isDanger = a.percentage < 60;
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-6 font-semibold text-slate-900">{a.name}</td>
                      <td className="py-3 px-6 text-slate-600">{a.subject_name}</td>
                      <td className="py-3 px-6">Sem {a.semester}</td>
                      <td className="py-3 px-6 font-mono tabular-nums">{a.total_classes}</td>
                      <td className="py-3 px-6 font-mono tabular-nums">{a.attended_classes}</td>
                      <td className="py-3 px-6 font-mono font-bold tabular-nums">
                        <span
                          className={
                            isSafe
                              ? 'text-emerald-600'
                              : isWarning
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }
                        >
                          {a.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`text-[11px] font-semibold ${
                            isSafe
                              ? 'text-emerald-700'
                              : isWarning
                              ? 'text-amber-700'
                              : 'text-rose-700 font-bold'
                          }`}
                        >
                          {isSafe ? 'Compliant' : isWarning ? 'Warning (<75%)' : 'Critical Risk'}
                        </span>
                      </td>
                      {canEdit && (
                        <td className="py-3 px-6 text-right">
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete attendance record"
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
                  <td colSpan={canEdit ? 8 : 7} className="py-12 text-center text-slate-400">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official College Defaulter List & Undertaking Modal */}
      {isDefaulterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between no-print">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                  <ShieldAlert className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Official College Attendance Defaulter List & Notice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Department of Computer Science & Engineering · Semester 3
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Notice</span>
                </button>
                <button
                  onClick={() => setIsDefaulterModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Printable Content */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 print:p-0">
              {/* College Letterhead Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Department of Computer Science & Engineering (AIML)
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
                  Academic Performance & Attendance Regulatory Committee
                </h1>
                <p className="text-xs text-slate-600">
                  Notification as per University Regulation Clause 7.1 (75% Minimum Attendance Requirement)
                </p>
                <div className="pt-2 text-xs font-mono font-bold text-rose-700">
                  OFFICIAL ATTENDANCE DEFAULTER LIST · SEMESTER 3 (SESSION 2025-2026)
                </div>
              </div>

              {/* Regulatory Notice Text */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong>Statutory Notice:</strong> All students named below have failed to satisfy the mandatory 75% attendance threshold in the listed courses. Students with attendance below 60% are placed under <em>Critical Risk of Detention</em> and are hereby directed to submit an undertaking countersigned by their parents/guardians to the HOD within 7 working days.
              </div>

              {/* Defaulter Table */}
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px] text-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Course / Div</th>
                      <th className="py-2.5 px-3">Classes (Attd / Total)</th>
                      <th className="py-2.5 px-3">Attendance %</th>
                      <th className="py-2.5 px-3">Defaulter Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {studentAttendanceSummary.filter((s) => s.status !== 'eligible').length > 0 ? (
                      studentAttendanceSummary
                        .filter((s) => s.status !== 'eligible')
                        .map(({ student: st, totalClasses: tc, attendedClasses: ac, percentage: pct, status }) => (
                          <tr key={st.id} className="hover:bg-slate-50 font-medium">
                            <td className="py-2 px-3 font-mono font-bold">{st.roll_number || st.id}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{st.name}</td>
                            <td className="py-2 px-3">{st.course} - Div {st.division}</td>
                            <td className="py-2 px-3 font-mono">{ac} / {tc}</td>
                            <td className="py-2 px-3 font-mono font-bold">
                              <span className={status === 'critical' ? 'text-rose-700' : 'text-amber-700'}>
                                {pct}%
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                  status === 'critical'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {status === 'critical' ? 'Critical Defaulter' : 'Warning Defaulter'}
                              </span>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400">
                          No defaulters found! All students maintain ≥ 75% attendance.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Signatures & Undertaking */}
              <div className="pt-10 grid grid-cols-3 gap-6 text-center text-xs text-slate-800 border-t border-slate-200">
                <div className="space-y-8">
                  <div className="h-6"></div>
                  <div className="border-t border-slate-400 pt-1">
                    <strong>Prof. Rajesh Sharma</strong>
                    <div className="text-[10px] text-slate-500">Class Teacher / Mentor</div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="h-6"></div>
                  <div className="border-t border-slate-400 pt-1">
                    <strong>Dr. Ramesh Deshmukh</strong>
                    <div className="text-[10px] text-slate-500">Head of Department (HOD)</div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="h-6"></div>
                  <div className="border-t border-slate-400 pt-1">
                    <strong>Parent / Guardian Signature</strong>
                    <div className="text-[10px] text-slate-500">Date & Undertaking Acknowledgment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
