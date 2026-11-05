# Student Performance Analytics Portal (EduTech SaaS)

A modern, role-based academic performance analytics platform for students, teachers, and administrators, featuring marks tracking, attendance records, ranking leaderboards, automated reports, and Gemini 3.8 Flash AI student risk alerts and tutor remarks.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Summary of Confirmed Choices & Architecture Bridge**:
> - **Backend Preference**: The user requested a Python backend. Because the AI Studio runtime serves on port 3000 via Node/Vite (without system pip or a running MySQL daemon), we implement a dual-architecture solution:
>   1. **Interactive Port 3000 Full-Stack App**: A rich, responsive React + TypeScript EduTech SaaS interface powered by an Express/Node backend that executes Python analytics scripts (`python3 analytics_engine.py`) for data computation and connects to Gemini 3.8 Flash for AI risk analysis.
>   2. **Exportable Python Backend Package (`/python_backend`)**: A complete, self-contained Python Flask + SQLite/MySQL backend (`app.py`, `database.py`, `seed_data.py`, `requirements.txt`, `README.md`) matching the original Flask project for standalone local deployment.
> - **AI Capabilities Confirmed**: Integrated Gemini 3.8 Flash for automated student risk detection (early warning for grades <60% or attendance <75%) and contextual tutor remarks.
> - **Visual Aesthetic Confirmed**: Modern EduTech SaaS design featuring deep navy tones (`#0b2545`, `#102a43`, `#2563eb`), high-density data tables with tabular figures, crisp chart visualizations, and zero-pill typographic discipline.

---

## 1. Overview & Core Concept

- **What It Does**: A complete academic monitoring suite with role-tailored workflows:
  - **Student Portal**: View personal GPA, attendance percentages, subject grades, rank standings, and personalized AI tutor feedback.
  - **Teacher Portal**: Record and delete marks, log attendance, review class grade distributions, and run AI risk assessments across enrolled students.
  - **Administrator Portal**: Manage teacher credentials, supervise student enrollment, configure subject curricula, and generate institution-wide PDF reports.
- **Target Audience**: Students tracking their academic progress, teachers managing classroom records, and school/college administrators overseeing institutional metrics.
- **Key Value**: Replaces disconnected spreadsheets and static paper logs with live performance trends, automated ranking calculations, and proactive AI early warnings before semester examinations.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Authentication & Role Selection**:
   - Clean split-screen login (Student, Teacher, Admin) with instant demo profile switcher for effortless evaluation.
   - Student self-registration with automatic division and semester assignment.
2. **Dashboard Overview**:
   - 4 key KPI cards: Total Students, Average Marks %, Average Attendance %, Total Tests Conducted.
   - Interactive Subject Average Bar Chart and Top 5 Student Leaderboard.
   - Gemini AI Academic Health Summary banner highlighting students needing immediate intervention.
3. **Student & Teacher Management**:
   - Filterable student directory with real-time search by name, course, semester, or division.
   - Teacher creation portal restricted strictly to administrators.
4. **Marks & Attendance Workspaces**:
   - Fast data entry forms with real-time percentage calculations.
   - Tabular records with search, sorting, and administrative delete actions.
5. **Analytics & Rankings**:
   - Subject Performance Breakdown, Grade Distribution (A+, A, B, C, D), and Focus Areas (subjects with class average <60%).
   - Class Rankings table computed by weighted average percentage.
6. **Reports & Export**:
   - Student performance summaries, printable report cards with print stylesheets, and one-click PDF generation.
   - AI Tutor Remarks Generator providing personalized student feedback based on subject marks and attendance records.

### Visual Identity & Theme
- **Color Palette**:
  - Dominant Canvas: Light clean slate (`#f8fafc` background, `#ffffff` card surfaces).
  - Primary Brand: Deep Navy (`#0b2545` and `#102a43`) reflecting academic prestige and stability.
  - Accent Actions: Royal Blue (`#2563eb`) with hover states (`#1d4ed8`).
  - Semantic Status: Emerald (`#16a34a`) for pass/regular, Amber (`#d97706`) for caution (60-70%), Coral (`#dc2626`) for critical risk (<60% or <75% attendance).
- **Typography & Hierarchy**:
  - Headings: `Plus Jakarta Sans` (SemiBold / Bold).
  - Body & UI: `DM Sans` / `Plus Jakarta Sans` (14px–16px, 1.5 line-height).
  - Numbers & Grades: Monospace tabular numerals (`font-mono tabular-nums`) for vertical decimal alignment.
- **Design System Restraint**:
  - Zero-pill metadata: clean inline text separated by subtle middots (`·`).
  - No decorative status dots or fake telemetry tickers.
  - Single-elevation card depth with subtle 1px hairline borders (`border-slate-200`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack React + Node Server with Active Python Analytics Execution**
  - *Chosen Approach*: Node/Express server on port 3000 handling API routes and invoking Python 3.10 scripts via child process for analytics algorithms (standard deviation, grade percentiles, focus area clustering), plus local persistence in a JSON/SQLite store.
  - *Why*: Ensures the application works out of the box in the AI Studio preview environment without requiring manual pip/MySQL installations, while genuinely executing Python code.
  - *Alternatives Considered*: Pure static mock data (too rigid for dynamic adds/deletions); external MySQL container (unsupported in serverless preview sandbox).
- **Decision 2: Standalone Python Flask Package (`/python_backend`)**
  - *Chosen Approach*: Generate a complete Python Flask project in `/python_backend` with `app.py`, `database.py`, `schema.sql`, `seed_data.py`, and `requirements.txt` so the user can run the exact native Flask + MySQL/SQLite app locally whenever they want.
  - *Why*: Directly honors the user's explicit preference for "only python".
- **Decision 3: Server-Side Gemini 3.8 Flash Integration**
  - *Chosen Approach*: Server route `/api/ai/analyze-student` uses `@google/genai` with `gemini-3.8-flash` to generate student risk reports and constructive tutor remarks with structured JSON schemas.
  - *Why*: Fast latency, no client-side API key exposure, and high analytical quality for educational feedback.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EduTech SaaS Frontend                           │
│  React 19 + Tailwind CSS + Lucide Icons + Motion Animated Transitions  │
├────────────────────────────────────────────────────────────────────────┤
│  Views:                                                                │
│  ├─ Login / Register (Role Switcher: Student | Teacher | Admin)        │
│  ├─ Dashboard (KPI Stats, Leaderboards, Subject Charts, AI Alerts)     │
│  ├─ Students Management (Filter, Search, Add Student Modal)            │
│  ├─ Marks Manager (Add Mark, Grade Calculation, Delete Action)         │
│  ├─ Attendance Manager (Total Classes, Attended, Attendance %)         │
│  ├─ Analytics Hub (Subject Bar Chart, Grade Pie Chart, Focus Areas)    │
│  ├─ Rankings Leaderboard (Computed Ranks 1..N, Letter Grades)          │
│  ├─ Reports & Print (PDF Card, Printable Layout, AI Remarks)           │
│  └─ Manage Teachers (Admin-only Account Provisioning)                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST API
┌───────────────────────────────────▼────────────────────────────────────┐
│                       Express Server (server.ts)                       │
│  Port 3000 Full-Stack API Router + Python Subprocess Bridge            │
├────────────────────────────────────────────────────────────────────────┤
│  Endpoints:                                                            │
│  ├─ /api/auth (login, register, session check)                         │
│  ├─ /api/students, /api/teachers, /api/marks, /api/attendance          │
│  ├─ /api/analytics (Python bridge: python3 analytics_engine.py)        │
│  ├─ /api/rankings, /api/reports                                        │
│  └─ /api/ai/student-risk & /api/ai/tutor-remarks (Gemini 3.8 Flash)    │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
┌───────────────────▼──────────────┐   ┌─────────────▼───────────────────┐
│     Python Analytics Engine      │   │   @google/genai SDK (Server)    │
│    (python3 analytics_engine.py) │   │        gemini-3.8-flash         │
│  - Weighted rank computation     │   │  - Student Risk Prediction      │
│  - Subject focus area clusters   │   │  - Automated Tutor Remarks      │
│  - Percentile statistics         │   │  - Targeted Action Items        │
└──────────────────────────────────┘   └─────────────────────────────────┘
```

### Data Model
- `User`: `{ id, username, password, role: 'student' | 'teacher' | 'admin', student_id?: string }`
- `Student`: `{ id, name, course, semester, division, email?, roll_number? }`
- `Subject`: `{ id, subject_name, code, max_marks }`
- `Mark`: `{ id, student_id, subject_id, semester, marks, max_marks: 100 }`
- `Attendance`: `{ id, student_id, subject_id, semester, total_classes, attended_classes, percentage }`
- `AIRemark`: `{ id, student_id, risk_level: 'low' | 'moderate' | 'high', summary, strengths, recommendations, timestamp }`

---

## 5. Execution Steps

1. **Server & Storage Layer**:
   - Create `server.ts` with Express routing for authentication, students, teachers, marks, attendance, rankings, reports, and AI endpoints.
   - Implement persistent data storage seeded with realistic sample students, subjects, attendance logs, and test scores.
   - Create `analytics_engine.py` (Python 3.10 standard library script) executed by the server for statistical calculations.
   - Set up `@google/genai` with `gemini-3.8-flash` for student risk scoring and tutor remarks.
2. **Dedicated Python Flask Codebase (`/python_backend`)**:
   - Provide `python_backend/app.py`, `python_backend/database.py`, `python_backend/schema.sql`, `python_backend/seed_data.py`, and `python_backend/requirements.txt` for standalone deployment.
3. **Frontend Application**:
   - Build navigation sidebar with responsive mobile drawer, user profile chip, and role indicator.
   - Implement all 9 views: Login, Register, Dashboard, Students, Marks, Attendance, Analytics, Rankings, Reports, and Manage Teachers.
   - Build interactive charts (Subject averages, Grade distribution donut, Attendance trends) using clean SVG/Canvas.
   - Add the Gemini AI Student Risk Drawer and automated tutor remark generator with print-friendly report card view.
4. **Metadata & HTML Entry Point**:
   - Update `metadata.json` with app title and description.
   - Update `index.html` with matching title and meta tags.
5. **Verification**:
   - Verify build and compilation with `compile_applet`.
