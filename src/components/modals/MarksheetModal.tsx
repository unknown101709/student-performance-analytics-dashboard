import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  X,
  GraduationCap,
  TrendingUp,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { Student } from '../../types';

interface MarksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSuccess?: () => void;
  initialMode?: 'upload' | 'manual';
}

const DEFAULT_CSE_AIML_SUBJECTS = [
  { subject_name: 'Data Structures & Algorithms', subject_code: 'AIML301', marks: 85, max_marks: 100 },
  { subject_name: 'Artificial Intelligence Foundations', subject_code: 'AIML302', marks: 88, max_marks: 100 },
  { subject_name: 'Object Oriented Programming with Java', subject_code: 'AIML303', marks: 82, max_marks: 100 },
  { subject_name: 'Discrete Mathematics & Linear Algebra', subject_code: 'AIML304', marks: 78, max_marks: 100 },
  { subject_name: 'Computer Organization & Architecture', subject_code: 'AIML305', marks: 80, max_marks: 100 },
  { subject_name: 'Probability & Statistics for ML', subject_code: 'AIML306', marks: 84, max_marks: 100 },
];

export const MarksheetModal: React.FC<MarksheetModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess,
}) => {
  // Manual Marks State
  const [manualSubjects, setManualSubjects] = useState<
    { subject_name: string; subject_code?: string; marks: number; max_marks: number }[]
  >(DEFAULT_CSE_AIML_SUBJECTS);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load existing student marks if available
  useEffect(() => {
    if (student?.id && isOpen) {
      fetch(`/api/students`)
        .then((res) => res.json())
        .then((data) => {
          // If we can get student marks from API, we can prefill
        })
        .catch(() => {});
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleSubjectChange = (index: number, field: string, value: any) => {
    setManualSubjects((prev) => {
      const updated = [...prev];
      if (field === 'marks') {
        const num = Math.max(0, Math.min(100, isNaN(Number(value)) ? 0 : Number(value)));
        updated[index] = { ...updated[index], marks: num };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleAddSubject = () => {
    setManualSubjects((prev) => [
      ...prev,
      {
        subject_name: `CSE Elective / Lab ${prev.length + 1}`,
        subject_code: `AIML30${prev.length + 1}`,
        marks: 75,
        max_marks: 100,
      },
    ]);
  };

  const handleRemoveSubject = (index: number) => {
    if (manualSubjects.length <= 1) return;
    setManualSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetSubjects = () => {
    setManualSubjects(DEFAULT_CSE_AIML_SUBJECTS);
  };

  const handleSaveMarks = async () => {
    if (!student?.id) {
      setError('No active student profile selected');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/students/${student.id}/marksheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marks: manualSubjects,
          marks_source: 'manual',
          exam_title: 'CSE(AIML) Semester 3 Scorecard',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || 'Marks saved successfully! Prediction model recalculated.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1000);
      } else {
        setError(data.message || 'Failed to save marks');
      }
    } catch (err: any) {
      setError(err.message || 'Network error saving marks');
    } finally {
      setSaving(false);
    }
  };

  const avgScore =
    manualSubjects.length > 0
      ? Math.round(
          (manualSubjects.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0) /
            manualSubjects.length) *
            10
        ) / 10
      : 0;

  const getGradeBadge = (score: number) => {
    if (score >= 90) return { label: 'A+ (Distinction)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 80) return { label: 'A (First Class)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 70) return { label: 'B+ (Upper Second)', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (score >= 60) return { label: 'B (Second Class)', color: 'text-sky-700 bg-sky-50 border-sky-200' };
    if (score >= 50) return { label: 'C (Pass Grade)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'F (At-Risk)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#07172b] via-[#0b2545] to-[#1d4ed8] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              <GraduationCap className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight">Enter Subject Marks & Calibrate Prediction</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-400/20 text-blue-200 border border-blue-300/30">
                  CSE(AIML) Sem 3
                </span>
              </div>
              <p className="text-xs text-blue-100/80">
                {student ? `Candidate: ${student.name} (${student.roll_number || '23AIML'})` : 'Student Candidate Profile'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Performance Summary Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm font-mono shadow-sm">
                {manualSubjects.length}
              </div>
              <div>
                <span className="font-bold text-slate-800 block text-sm">
                  CSE(AIML) Semester 3 Curriculum
                </span>
                <span className="text-[11px] text-slate-500">
                  Adjust subject marks (0-100) to update GPA trajectory and vector radar
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-blue-200/80 shadow-xs self-start sm:self-auto">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Average Score</span>
                <span className="text-base font-extrabold text-blue-700 font-mono leading-none">
                  {avgScore}%
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getGradeBadge(avgScore).color}`}>
                {getGradeBadge(avgScore).label}
              </span>
            </div>
          </div>

          {/* Subject Marks Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Subject Scores Ledger</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Elective / Lab</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetSubjects}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors cursor-pointer"
                  title="Reset to 6 core subjects"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-4">Subject Name</th>
                    <th className="py-2.5 px-3 text-center">Code</th>
                    <th className="py-2.5 px-3 text-center w-32">Score (/100)</th>
                    <th className="py-2.5 px-3 text-center w-28">Status</th>
                    <th className="py-2.5 px-2 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {manualSubjects.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">
                        <input
                          type="text"
                          value={sub.subject_name}
                          onChange={(e) => handleSubjectChange(i, 'subject_name', e.target.value)}
                          className="w-full font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none py-0.5"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="text"
                          value={sub.subject_code || ''}
                          onChange={(e) => handleSubjectChange(i, 'subject_code', e.target.value)}
                          className="w-20 text-center font-mono text-[11px] font-bold text-blue-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none py-0.5"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={sub.marks}
                            onChange={(e) => handleSubjectChange(i, 'marks', e.target.value)}
                            className="w-16 py-1.5 px-2 text-center font-mono font-bold text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                          />
                          <span className="text-slate-400 font-bold text-xs">/100</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getGradeBadge(sub.marks).color}`}>
                          {getGradeBadge(sub.marks).label}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {manualSubjects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(i)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove Subject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveMarks}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Marks & Recalculating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Save Marks & Run AI Prediction</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
