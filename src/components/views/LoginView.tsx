import React, { useState } from 'react';
import {
  GraduationCap,
  TrendingUp,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  Edit3,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  Plus,
  Trash2,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const DEFAULT_CSE_AIML_SUBJECTS = [
  { subject_name: 'Data Structures & Algorithms', subject_code: 'AIML301', marks: 85, max_marks: 100 },
  { subject_name: 'Artificial Intelligence Foundations', subject_code: 'AIML302', marks: 88, max_marks: 100 },
  { subject_name: 'Object Oriented Programming with Java', subject_code: 'AIML303', marks: 82, max_marks: 100 },
  { subject_name: 'Discrete Mathematics & Linear Algebra', subject_code: 'AIML304', marks: 78, max_marks: 100 },
  { subject_name: 'Computer Organization & Architecture', subject_code: 'AIML305', marks: 80, max_marks: 100 },
  { subject_name: 'Probability & Statistics for ML', subject_code: 'AIML306', marks: 84, max_marks: 100 },
];

export const LoginView: React.FC = () => {
  const { login, registerStudent } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [regStep, setRegStep] = useState<1 | 2>(1); // 1: Personal Details, 2: Manual Marks Entry

  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regCourse, setRegCourse] = useState('CSE(AIML)');
  const [regSemester, setRegSemester] = useState(3);
  const [regDivision, setRegDivision] = useState('A');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Manual Marks State in Register Step 2
  const [regSubjects, setRegSubjects] = useState(DEFAULT_CSE_AIML_SUBJECTS);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCredentialsHint, setShowCredentialsHint] = useState(false);

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMsg('');
    setUsername('');
    setPassword('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    const res = await login(username.trim(), password.trim(), role);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid credentials for selected role.');
    }
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters long');
      return;
    }
    // Proceed to Step 2: Manual Marks Entry
    setRegStep(2);
  };

  const handleSubjectChange = (index: number, val: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
    setRegSubjects((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], marks: clamped };
      return updated;
    });
  };

  const handleAddSubject = () => {
    setRegSubjects((prev) => [
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
    if (regSubjects.length <= 1) return;
    setRegSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetSubjects = () => {
    setRegSubjects(DEFAULT_CSE_AIML_SUBJECTS);
  };

  const handleCompleteRegister = async () => {
    setLoading(true);
    setErrorMsg('');

    const payload = {
      name: regName,
      username: regUsername,
      course: regCourse,
      semester: regSemester,
      division: regDivision,
      password: regPassword,
      confirm_password: regConfirmPassword,
      marks: regSubjects,
      marks_source: 'manual',
    };

    const res = await registerStudent(payload);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  const calculatedAverage =
    regSubjects.length > 0
      ? Math.round(
          (regSubjects.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0) /
            regSubjects.length) *
            10
        ) / 10
      : 0;

  const roleTitle =
    role === 'admin'
      ? 'Institutional Administrator'
      : role === 'teacher'
      ? 'Faculty & Teacher'
      : 'Student Candidate';

  const rolePlaceholder =
    role === 'admin'
      ? 'Enter admin username (e.g. admin)'
      : role === 'teacher'
      ? 'Enter teacher ID (e.g. teacher1)'
      : 'Enter student username (e.g. aarav)';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-blue-50/50 to-indigo-50/40">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col md:flex-row min-h-[660px]">
        {/* Left Section: Academic Branding */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#07172b] via-[#0b2545] to-[#1d4ed8] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/30 border border-blue-400/40 shadow-inner">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">EduAnalytics</span>
            </div>

            <div>
              <div className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-400/20 text-blue-200 border border-blue-300/30 mb-2 uppercase tracking-wider">
                CSE(AIML) Engineering Space
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Academic Performance AI Prediction Portal
              </h1>
              <p className="mt-2.5 text-xs text-blue-100/90 leading-relaxed">
                Department of Computer Science & Engineering (Artificial Intelligence & Machine Learning) · Semester 3
              </p>
            </div>

            <div className="space-y-3.5 pt-3 border-t border-blue-500/20 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 text-blue-200 shrink-0">
                  <Edit3 className="w-4 h-4" />
                </div>
                <span className="text-blue-50">
                  Direct subject marks entry & real-time SGPA prediction
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 text-blue-200 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-blue-50">
                  Vector radar diagnostics & subject trajectory forecasts
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 text-blue-200 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-blue-50">
                  Gemini-powered academic tutoring & mentoring circles
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 text-[11px] text-blue-200/70 border-t border-white/10 mt-6">
            Autonomous Predictive Analytics · CSE(AIML) Sem 3 Standard
          </div>
        </div>

        {/* Right Section: Forms */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-center">
          {!isRegistering ? (
            /* Login Form */
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                  Portal Authentication
                </span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Sign In to {roleTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your role and enter your registered campus credentials.
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Your Account Role:
                </label>
                <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 text-xs font-semibold">
                  {(['student', 'teacher', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`py-2 capitalize rounded-xl transition-all ${
                        role === r
                          ? 'bg-white text-blue-700 shadow-sm font-bold border border-slate-200/60'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {r === 'admin' ? 'Administrator' : r === 'teacher' ? 'Teacher' : 'Student'}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl leading-relaxed">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {role === 'admin' ? 'Admin Username' : role === 'teacher' ? 'Teacher ID / Username' : 'Student Username'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder={rolePlaceholder}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter account password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50"
                >
                  {loading ? 'Verifying Account...' : `Sign In to ${roleTitle}`}
                </button>
              </form>

              {/* Quick Fill One-Click Demo Profiles */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
                  Quick Demo Accounts (Click to Fill & Test)
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('student');
                      setUsername('soham');
                      setPassword('student@123');
                    }}
                    className="p-2 text-left bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 rounded-xl transition text-[11px] group"
                  >
                    <div className="font-bold text-blue-900 flex items-center justify-between">
                      <span>Soham Wani</span>
                      <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-mono">Lead</span>
                    </div>
                    <div className="text-[10px] text-blue-700 font-mono mt-0.5">soham · student@123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('student');
                      setUsername('aarav');
                      setPassword('student@123');
                    }}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition text-[11px]"
                  >
                    <div className="font-bold text-slate-800">Aarav Sharma</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">aarav · student@123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('teacher');
                      setUsername('teacher1');
                      setPassword('teacher@123');
                    }}
                    className="p-2 text-left bg-indigo-50/60 hover:bg-indigo-100/60 border border-indigo-200/70 rounded-xl transition text-[11px]"
                  >
                    <div className="font-bold text-indigo-900">Prof. Rajesh Sharma</div>
                    <div className="text-[10px] text-indigo-700 font-mono mt-0.5">teacher1 · teacher@123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('admin');
                      setUsername('admin');
                      setPassword('admin@12345');
                    }}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition text-[11px]"
                  >
                    <div className="font-bold text-slate-800">Dr. Ramesh Deshmukh</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">admin · admin@12345</div>
                  </button>
                </div>
              </div>

              {/* Toggle to Register */}
              <div className="text-center text-xs text-slate-500 pt-1">
                {role === 'student' ? (
                  <div>
                    Need a new student account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegistering(true);
                        setRegStep(1);
                        setErrorMsg('');
                      }}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      Register & Enter Marks
                    </button>
                  </div>
                ) : (
                  <span className="text-slate-400">
                    Faculty and Admin accounts are provisioned securely by institutional IT.
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Student Registration Wizard */
            <div className="space-y-4">
              {/* Registration Wizard Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {regStep === 1 ? 'Step 1: Student Account Registration' : 'Step 2: Enter Subject Marks'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {regStep === 1
                      ? 'Create credentials for CSE(AIML) Semester 3'
                      : 'Input your marks in each subject to calibrate your GPA prediction model'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 font-mono">
                  {regStep}/2
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* STEP 1: Basic Information */}
              {regStep === 1 && (
                <form onSubmit={handleStep1Next} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Verma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Create unique student username"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">
                        Course
                      </label>
                      <input
                        type="text"
                        required
                        value={regCourse}
                        readOnly
                        className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">
                        Semester
                      </label>
                      <input
                        type="text"
                        required
                        value="Semester 3"
                        readOnly
                        className="w-full px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Min 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-0.5">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md active:scale-98 mt-2 flex items-center justify-center gap-2"
                  >
                    <span>Next: Enter Subject Marks</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center text-xs text-slate-500 pt-1">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegistering(false)}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Manual Subject Marks Setup */}
              {regStep === 2 && (
                <div className="space-y-4">
                  {/* Performance Target Summary */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold font-mono">
                        {regSubjects.length}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">CSE(AIML) Sem 3 Curriculum</span>
                        <span className="text-[11px] text-slate-500">Edit scores below (out of 100)</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Calculated Avg:</span>
                        <span className="text-sm font-black text-blue-700 font-mono">
                          {calculatedAverage}%
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {calculatedAverage >= 80 ? 'Distinction Pace' : calculatedAverage >= 60 ? 'First Class Pace' : 'Passing Threshold'}
                      </span>
                    </div>
                  </div>

                  {/* Subject Scores Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Subject Marks (Out of 100):
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleAddSubject}
                          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Subject</span>
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={handleResetSubjects}
                          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-700"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto bg-white shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                          <tr>
                            <th className="py-2 px-3">Subject Name & Code</th>
                            <th className="py-2 px-3 text-center w-28">Score (/100)</th>
                            <th className="py-2 px-2 text-center w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {regSubjects.map((sub, i) => (
                            <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-2 px-3">
                                <div className="font-semibold text-slate-800 text-[11px]">
                                  {sub.subject_name}
                                </div>
                                <div className="text-[10px] text-blue-600 font-mono">
                                  {sub.subject_code || `AIML30${i + 1}`}
                                </div>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={sub.marks}
                                  onChange={(e) => handleSubjectChange(i, Number(e.target.value))}
                                  className="w-16 py-1 px-2 text-center font-mono font-bold text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                                />
                              </td>
                              <td className="py-2 px-2 text-center">
                                {regSubjects.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSubject(i)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                                    title="Remove Subject"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Wizard Bottom Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCompleteRegister}
                      disabled={loading}
                      className="flex-1 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Creating Account & Ingesting Marks...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete Registration & Run Prediction</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
