import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, UserPlus, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TeachersView: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirm_password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/teachers');
      const data = await res.json();
      if (data.teachers) {
        setTeachers(data.teachers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirm_password) {
      setMessage({ text: 'Passwords do not match', error: true });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Teacher account created successfully!' });
        setFormData({ name: '', username: '', password: '', confirm_password: '' });
        fetchTeachers();
      } else {
        setMessage({ text: data.message || 'Failed to create teacher', error: true });
      }
    } catch (e: any) {
      setMessage({ text: e.message || 'Server error', error: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          Access restricted. Only system administrators can manage faculty credentials.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Faculty & Teacher Accounts
          </h2>
          <p className="text-xs text-slate-500">
            Provision and manage faculty credentials for entering marks and logging attendance
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Administrator Authorization</span>
        </div>
      </div>

      {/* Info notice */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs">
        <Info className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          Only administrators have permission to provision teacher logins. Teachers can record and delete examination marks and track student attendance records.
        </span>
      </div>

      {/* Create Teacher Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Create New Teacher Account</h3>
        </div>

        {message && (
          <div
            className={`p-3 mb-4 text-xs rounded-xl border ${
              message.error
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Teacher Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Prof. Rajesh Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
            <input
              type="text"
              required
              placeholder="e.g. rajesh.sharma"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="Confirm password"
              value={formData.confirm_password}
              onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Creating Account...' : 'Create Teacher Account'}
            </button>
          </div>
        </form>
      </div>

      {/* Teachers Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Faculty Members</h3>
          <span className="text-xs text-slate-500">
            Total teachers: <strong className="text-slate-800">{teachers.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-6">Staff ID</th>
                <th className="py-3 px-6">Faculty Name</th>
                <th className="py-3 px-6">Username</th>
                <th className="py-3 px-6">Assigned Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {teachers.length > 0 ? (
                teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-6 font-mono text-slate-400 font-semibold">{t.id}</td>
                    <td className="py-3 px-6 font-semibold text-slate-900">{t.name}</td>
                    <td className="py-3 px-6 font-mono text-slate-600">{t.username}</td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-700">
                        <UserCheck className="w-3.5 h-3.5" />
                        Teacher
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    No teacher accounts found.
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
