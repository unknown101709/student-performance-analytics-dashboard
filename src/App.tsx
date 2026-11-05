import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { StudentDashboardView } from './components/views/dashboards/StudentDashboardView';
import { TeacherDashboardView } from './components/views/dashboards/TeacherDashboardView';
import { AdminDashboardView } from './components/views/dashboards/AdminDashboardView';
import { PredictionInfographicsView } from './components/views/PredictionInfographicsView';
import { StudentsView } from './components/views/StudentsView';
import { MarksView } from './components/views/MarksView';
import { AttendanceView } from './components/views/AttendanceView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { RankingsView } from './components/views/RankingsView';
import { ReportsView } from './components/views/ReportsView';
import { TeachersView } from './components/views/TeachersView';
import { LoginView } from './components/views/LoginView';
import { AIRiskModal } from './components/modals/AIRiskModal';
import {
  AnalyticsResponse,
  Student,
  Subject,
  EnrichedMark,
  EnrichedAttendance,
  StudentRanking,
} from './types';

const MainApp: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  // Core Data
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [marks, setMarks] = useState<EnrichedMark[]>([]);
  const [attendance, setAttendance] = useState<EnrichedAttendance[]>([]);
  const [rankings, setRankings] = useState<StudentRanking[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // AI Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiStudentId, setAiStudentId] = useState<string | undefined>(undefined);

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';

  // Role Access Guard: ensure students can never view teacher/admin views, teachers can't view admin views
  useEffect(() => {
    if (!user) return;
    if (isStudent && ['students', 'teachers', 'analytics'].includes(currentTab)) {
      setCurrentTab('dashboard');
    } else if (isTeacher && currentTab === 'teachers') {
      setCurrentTab('dashboard');
    }
  }, [user, isStudent, isTeacher, currentTab]);

  const loadAllData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);

    try {
      const studentParam = isStudent && user.student_id ? `?student_id=${user.student_id}` : '';

      const [analyticsRes, studentsRes, subjectsRes, marksRes, attRes, rankRes] = await Promise.all([
        fetch(`/api/analytics${studentParam}`),
        fetch('/api/students'),
        fetch('/api/subjects'),
        fetch(`/api/marks${studentParam}`),
        fetch(`/api/attendance${studentParam}`),
        fetch('/api/rankings'),
      ]);

      const [analyticsData, studentsData, subjectsData, marksData, attData, rankData] = await Promise.all([
        analyticsRes.json(),
        studentsRes.json(),
        subjectsRes.json(),
        marksRes.json(),
        attRes.json(),
        rankRes.json(),
      ]);

      if (analyticsData.data) setAnalytics(analyticsData.data);
      if (studentsData.students) setStudents(studentsData.students);
      if (subjectsData.subjects) setSubjects(subjectsData.subjects);
      if (marksData.marks) setMarks(marksData.marks);
      if (attData.attendance) setAttendance(attData.attendance);
      if (rankData.rankings) setRankings(rankData.rankings);
    } catch (e) {
      console.error('Failed loading academic records:', e);
    } finally {
      setDataLoading(false);
    }
  }, [user, isStudent]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleOpenAiDiagnostic = (studentId?: string) => {
    setAiStudentId(studentId || user?.student_id || students[0]?.id);
    setAiModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'ai-advisor') {
            handleOpenAiDiagnostic();
          } else {
            setCurrentTab(tab);
          }
        }}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Navbar
          currentTab={currentTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenAiAdvisor={() => handleOpenAiDiagnostic()}
          onNavigateTab={setCurrentTab}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={toggleSidebarCollapse}
        />

        <main className="flex-1 pb-16">
          {/* 1. ROLE-SEGREGATED DASHBOARDS: Strictly Isolated */}
          {currentTab === 'dashboard' && (
            <>
              {isStudent && (
                <StudentDashboardView
                  analytics={analytics}
                  marks={marks}
                  attendance={attendance}
                  rankings={rankings}
                  onNavigateTab={setCurrentTab}
                  onOpenAiDiagnostic={handleOpenAiDiagnostic}
                />
              )}
              {isTeacher && (
                <TeacherDashboardView
                  analytics={analytics}
                  loading={dataLoading}
                  onNavigateTab={setCurrentTab}
                  onOpenAiDiagnostic={handleOpenAiDiagnostic}
                />
              )}
              {isAdmin && (
                <AdminDashboardView
                  analytics={analytics}
                  loading={dataLoading}
                  onNavigateTab={setCurrentTab}
                  onOpenAiDiagnostic={handleOpenAiDiagnostic}
                />
              )}
            </>
          )}

          {/* DEDICATED PREDICTION INFOGRAPHICS VIEW */}
          {currentTab === 'infographics' && (
            <PredictionInfographicsView
              students={students}
              onOpenModal={handleOpenAiDiagnostic}
            />
          )}

          {/* 3. STUDENTS VIEW: Restricted to Faculty & Admins */}
          {currentTab === 'students' && !isStudent && (
            <StudentsView
              students={students}
              onRefresh={loadAllData}
              onOpenAiDiagnostic={handleOpenAiDiagnostic}
            />
          )}

          {/* 4. MARKS VIEW */}
          {currentTab === 'marks' && (
            <MarksView
              marks={marks}
              students={students}
              subjects={subjects}
              onRefresh={loadAllData}
            />
          )}

          {/* 5. ATTENDANCE VIEW */}
          {currentTab === 'attendance' && (
            <AttendanceView
              attendance={attendance}
              students={students}
              subjects={subjects}
              onRefresh={loadAllData}
            />
          )}

          {/* 6. ANALYTICS VIEW: Faculty & Admin overview */}
          {currentTab === 'analytics' && !isStudent && (
            <AnalyticsView
              analytics={analytics}
              loading={dataLoading}
            />
          )}

          {/* 7. RANKINGS VIEW */}
          {currentTab === 'rankings' && (
            <RankingsView
              rankings={rankings}
              onOpenAiDiagnostic={handleOpenAiDiagnostic}
            />
          )}

          {/* 8. REPORTS VIEW */}
          {currentTab === 'reports' && (
            <ReportsView
              rankings={rankings}
              students={students}
              subjects={subjects}
              marks={marks}
              attendance={attendance}
            />
          )}

          {/* 9. TEACHERS VIEW: Strictly Admin Only */}
          {currentTab === 'teachers' && isAdmin && <TeachersView />}
        </main>
      </div>

      {/* AI Risk Modal */}
      <AIRiskModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        studentId={aiStudentId}
        students={students}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
