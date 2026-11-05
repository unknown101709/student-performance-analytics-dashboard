import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  student_id?: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  course: string;
  semester: number;
  division: string;
  email?: string;
  roll_number?: string;
  marksheet_url?: string;
  marksheet_filename?: string;
  marksheet_uploaded_at?: string;
  marks_source?: 'manual' | 'marksheet_upload' | 'system_benchmark';
}

export interface Subject {
  id: string;
  subject_name: string;
  subject_code: string;
  max_marks: number;
}

export interface Mark {
  id: string;
  student_id: string;
  subject_id: string;
  semester: number;
  marks: number;
  max_marks?: number;
  exam_type?: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  subject_id: string;
  semester: number;
  total_classes: number;
  attended_classes: number;
}

export interface AIRemark {
  id: string;
  student_id: string;
  risk_level: 'low' | 'moderate' | 'high';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  action_items: string[];
  tutor_remarks: string;
  generated_at: string;
}

export interface MentoringProgram {
  id: string;
  title: string;
  subject_id?: string;
  subject_name?: string;
  mentor_name: string;
  mentor_role: string;
  schedule: string;
  location: string;
  capacity: number;
  description: string;
  target_benefit: string;
  topics: string[];
}

export interface MentoringEnrollment {
  id: string;
  program_id: string;
  student_id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
}

export interface DatabaseState {
  users: User[];
  students: Student[];
  subjects: Subject[];
  marks: Mark[];
  attendance: Attendance[];
  ai_remarks: AIRemark[];
  mentoring_programs: MentoringProgram[];
  mentoring_enrollments: MentoringEnrollment[];
}

const DB_PATH = path.resolve(process.cwd(), 'student_records.json');

const INITIAL_DATA: DatabaseState = {
  users: [
    {
      id: 'u-admin',
      username: 'admin',
      password: 'admin@12345',
      role: 'admin',
      name: 'Dr. Ramesh Deshmukh',
    },
    {
      id: 'u-teacher-1',
      username: 'teacher1',
      password: 'teacher@123',
      role: 'teacher',
      name: 'Prof. Rajesh Sharma',
    },
    {
      id: 'u-teacher-2',
      username: 'teacher2',
      password: 'teacher@123',
      role: 'teacher',
      name: 'Dr. Sunita Kulkarni',
    },
    {
      id: 'u-student-soham',
      username: 'soham',
      password: 'student@123',
      role: 'student',
      student_id: 'st-soham',
      name: 'Soham Wani',
    },
    {
      id: 'u-student-1',
      username: 'aarav',
      password: 'student@123',
      role: 'student',
      student_id: 'st-1',
      name: 'Aarav Sharma',
    },
    {
      id: 'u-student-2',
      username: 'priya',
      password: 'student@123',
      role: 'student',
      student_id: 'st-2',
      name: 'Priya Patel',
    },
    {
      id: 'u-student-3',
      username: 'rohan',
      password: 'student@123',
      role: 'student',
      student_id: 'st-3',
      name: 'Rohan Mehta',
    },
    {
      id: 'u-student-4',
      username: 'ananya',
      password: 'student@123',
      role: 'student',
      student_id: 'st-4',
      name: 'Ananya Roy',
    },
    {
      id: 'u-student-5',
      username: 'vikram',
      password: 'student@123',
      role: 'student',
      student_id: 'st-5',
      name: 'Vikram Joshi',
    },
  ],
  students: [
    {
      id: 'st-soham',
      name: 'Soham Wani',
      course: 'CSE(AIML)',
      semester: 3,
      division: 'A',
      email: 'sohamwani967@gmail.com',
      roll_number: '21CO042',
      marks_source: 'manual',
    },
    {
      id: 'st-1',
      name: 'Aarav Sharma',
      course: 'CSE(AIML)',
      semester: 3,
      division: 'A',
      email: 'aarav.sharma@campus.edu',
      roll_number: '23AIML01',
      marks_source: 'marksheet_upload',
    },
    {
      id: 'st-2',
      name: 'Priya Patel',
      course: 'CSE(AIML)',
      semester: 3,
      division: 'A',
      email: 'priya.patel@campus.edu',
      roll_number: '23AIML02',
      marks_source: 'marksheet_upload',
    },
    {
      id: 'st-3',
      name: 'Rohan Mehta',
      course: 'CSE(AIML)',
      semester: 3,
      division: 'B',
      email: 'rohan.mehta@campus.edu',
      roll_number: '23AIML03',
      marks_source: 'manual',
    },
    {
      id: 'st-4',
      name: 'Ananya Roy',
      course: 'CSE(AIML)',
      semester: 3,
      division: 'A',
      email: 'ananya.roy@campus.edu',
      roll_number: '23AIML04',
      marks_source: 'marksheet_upload',
    },
    {
      id: 'st-5',
      name: 'Vikram Joshi',
      course: 'CSE(AIML)',
      semester: 3,
      division: 'B',
      email: 'vikram.joshi@campus.edu',
      roll_number: '23AIML05',
      marks_source: 'manual',
    },
    {
      id: 'st-6',
      name: 'Sneha Gupta',
      course: 'CSE(AIML)',
      semester: 3,
      division: 'A',
      email: 'sneha.gupta@campus.edu',
      roll_number: '23AIML06',
      marks_source: 'marksheet_upload',
    },
  ],
  subjects: [
    { id: 'sub-1', subject_name: 'Data Structures & Algorithms', subject_code: 'AIML301', max_marks: 100 },
    { id: 'sub-2', subject_name: 'Artificial Intelligence Foundations', subject_code: 'AIML302', max_marks: 100 },
    { id: 'sub-3', subject_name: 'Object Oriented Programming with Java', subject_code: 'AIML303', max_marks: 100 },
    { id: 'sub-4', subject_name: 'Discrete Mathematics & Linear Algebra', subject_code: 'AIML304', max_marks: 100 },
    { id: 'sub-5', subject_name: 'Computer Organization & Architecture', subject_code: 'AIML305', max_marks: 100 },
    { id: 'sub-6', subject_name: 'Probability & Statistics for ML', subject_code: 'AIML306', max_marks: 100 },
  ],
  marks: [
    // Aarav Sharma (Top performer)
    { id: 'm-1', student_id: 'st-1', subject_id: 'sub-1', semester: 3, marks: 92, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-2', student_id: 'st-1', subject_id: 'sub-2', semester: 3, marks: 94, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-3', student_id: 'st-1', subject_id: 'sub-3', semester: 3, marks: 88, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-4', student_id: 'st-1', subject_id: 'sub-4', semester: 3, marks: 95, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-5', student_id: 'st-1', subject_id: 'sub-5', semester: 3, marks: 89, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-6-1', student_id: 'st-1', subject_id: 'sub-6', semester: 3, marks: 91, max_marks: 100, exam_type: 'Sem-3 Midterm' },

    // Priya Patel (Solid B+/A student)
    { id: 'm-6', student_id: 'st-2', subject_id: 'sub-1', semester: 3, marks: 84, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-7', student_id: 'st-2', subject_id: 'sub-2', semester: 3, marks: 82, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-8', student_id: 'st-2', subject_id: 'sub-3', semester: 3, marks: 79, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-9', student_id: 'st-2', subject_id: 'sub-4', semester: 3, marks: 87, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-10', student_id: 'st-2', subject_id: 'sub-5', semester: 3, marks: 76, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-10-1', student_id: 'st-2', subject_id: 'sub-6', semester: 3, marks: 81, max_marks: 100, exam_type: 'Sem-3 Midterm' },

    // Rohan Mehta (Struggling in Math & DSA - Needs Mentoring Focus)
    { id: 'm-11', student_id: 'st-3', subject_id: 'sub-1', semester: 3, marks: 48, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-12', student_id: 'st-3', subject_id: 'sub-2', semester: 3, marks: 62, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-13', student_id: 'st-3', subject_id: 'sub-3', semester: 3, marks: 58, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-14', student_id: 'st-3', subject_id: 'sub-4', semester: 3, marks: 44, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-15', student_id: 'st-3', subject_id: 'sub-5', semester: 3, marks: 65, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-15-1', student_id: 'st-3', subject_id: 'sub-6', semester: 3, marks: 51, max_marks: 100, exam_type: 'Sem-3 Midterm' },

    // Ananya Roy (High performer)
    { id: 'm-16', student_id: 'st-4', subject_id: 'sub-1', semester: 3, marks: 89, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-17', student_id: 'st-4', subject_id: 'sub-2', semester: 3, marks: 93, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-18', student_id: 'st-4', subject_id: 'sub-3', semester: 3, marks: 85, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-19', student_id: 'st-4', subject_id: 'sub-4', semester: 3, marks: 91, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-20', student_id: 'st-4', subject_id: 'sub-5', semester: 3, marks: 84, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-20-1', student_id: 'st-4', subject_id: 'sub-6', semester: 3, marks: 88, max_marks: 100, exam_type: 'Sem-3 Midterm' },

    // Vikram Joshi (Moderate performer)
    { id: 'm-21', student_id: 'st-5', subject_id: 'sub-1', semester: 3, marks: 72, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-22', student_id: 'st-5', subject_id: 'sub-2', semester: 3, marks: 68, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-23', student_id: 'st-5', subject_id: 'sub-3', semester: 3, marks: 64, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-24', student_id: 'st-5', subject_id: 'sub-4', semester: 3, marks: 61, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-25', student_id: 'st-5', subject_id: 'sub-5', semester: 3, marks: 75, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-25-1', student_id: 'st-5', subject_id: 'sub-6', semester: 3, marks: 66, max_marks: 100, exam_type: 'Sem-3 Midterm' },

    // Sneha Gupta (Very strong)
    { id: 'm-26', student_id: 'st-6', subject_id: 'sub-1', semester: 3, marks: 90, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-27', student_id: 'st-6', subject_id: 'sub-2', semester: 3, marks: 91, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-28', student_id: 'st-6', subject_id: 'sub-3', semester: 3, marks: 86, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-29', student_id: 'st-6', subject_id: 'sub-4', semester: 3, marks: 85, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-30', student_id: 'st-6', subject_id: 'sub-5', semester: 3, marks: 89, max_marks: 100, exam_type: 'Sem-3 Midterm' },
    { id: 'm-30-1', student_id: 'st-6', subject_id: 'sub-6', semester: 3, marks: 87, max_marks: 100, exam_type: 'Sem-3 Midterm' },
  ],
  attendance: [
    // Aarav Sharma
    { id: 'att-1', student_id: 'st-1', subject_id: 'sub-1', semester: 3, total_classes: 36, attended_classes: 34 },
    { id: 'att-2', student_id: 'st-1', subject_id: 'sub-2', semester: 3, total_classes: 32, attended_classes: 31 },
    { id: 'att-3', student_id: 'st-1', subject_id: 'sub-3', semester: 3, total_classes: 30, attended_classes: 29 },
    { id: 'att-4', student_id: 'st-1', subject_id: 'sub-4', semester: 3, total_classes: 40, attended_classes: 39 },
    { id: 'att-5', student_id: 'st-1', subject_id: 'sub-5', semester: 3, total_classes: 34, attended_classes: 32 },
    { id: 'att-5-1', student_id: 'st-1', subject_id: 'sub-6', semester: 3, total_classes: 36, attended_classes: 35 },

    // Priya Patel
    { id: 'att-6', student_id: 'st-2', subject_id: 'sub-1', semester: 3, total_classes: 36, attended_classes: 31 },
    { id: 'att-7', student_id: 'st-2', subject_id: 'sub-2', semester: 3, total_classes: 32, attended_classes: 28 },
    { id: 'att-8', student_id: 'st-2', subject_id: 'sub-3', semester: 3, total_classes: 30, attended_classes: 27 },
    { id: 'att-9', student_id: 'st-2', subject_id: 'sub-4', semester: 3, total_classes: 40, attended_classes: 36 },
    { id: 'att-10', student_id: 'st-2', subject_id: 'sub-5', semester: 3, total_classes: 34, attended_classes: 30 },
    { id: 'att-10-1', student_id: 'st-2', subject_id: 'sub-6', semester: 3, total_classes: 36, attended_classes: 32 },

    // Rohan Mehta (Low Attendance Risk)
    { id: 'att-11', student_id: 'st-3', subject_id: 'sub-1', semester: 3, total_classes: 36, attended_classes: 20 },
    { id: 'att-12', student_id: 'st-3', subject_id: 'sub-2', semester: 3, total_classes: 32, attended_classes: 21 },
    { id: 'att-13', student_id: 'st-3', subject_id: 'sub-3', semester: 3, total_classes: 30, attended_classes: 19 },
    { id: 'att-14', student_id: 'st-3', subject_id: 'sub-4', semester: 3, total_classes: 40, attended_classes: 24 },
    { id: 'att-15', student_id: 'st-3', subject_id: 'sub-5', semester: 3, total_classes: 34, attended_classes: 22 },
    { id: 'att-15-1', student_id: 'st-3', subject_id: 'sub-6', semester: 3, total_classes: 36, attended_classes: 21 },

    // Ananya Roy
    { id: 'att-16', student_id: 'st-4', subject_id: 'sub-1', semester: 3, total_classes: 36, attended_classes: 35 },
    { id: 'att-17', student_id: 'st-4', subject_id: 'sub-2', semester: 3, total_classes: 32, attended_classes: 30 },
    { id: 'att-18', student_id: 'st-4', subject_id: 'sub-3', semester: 3, total_classes: 30, attended_classes: 28 },
    { id: 'att-19', student_id: 'st-4', subject_id: 'sub-4', semester: 3, total_classes: 40, attended_classes: 38 },
    { id: 'att-20', student_id: 'st-4', subject_id: 'sub-5', semester: 3, total_classes: 34, attended_classes: 33 },
    { id: 'att-20-1', student_id: 'st-4', subject_id: 'sub-6', semester: 3, total_classes: 36, attended_classes: 34 },

    // Vikram Joshi
    { id: 'att-21', student_id: 'st-5', subject_id: 'sub-1', semester: 3, total_classes: 36, attended_classes: 29 },
    { id: 'att-22', student_id: 'st-5', subject_id: 'sub-2', semester: 3, total_classes: 32, attended_classes: 25 },
    { id: 'att-23', student_id: 'st-5', subject_id: 'sub-3', semester: 3, total_classes: 30, attended_classes: 23 },
    { id: 'att-24', student_id: 'st-5', subject_id: 'sub-4', semester: 3, total_classes: 40, attended_classes: 33 },
    { id: 'att-25', student_id: 'st-5', subject_id: 'sub-5', semester: 3, total_classes: 34, attended_classes: 26 },
    { id: 'att-25-1', student_id: 'st-5', subject_id: 'sub-6', semester: 3, total_classes: 36, attended_classes: 27 },

    // Sneha Gupta
    { id: 'att-26', student_id: 'st-6', subject_id: 'sub-1', semester: 3, total_classes: 36, attended_classes: 33 },
    { id: 'att-27', student_id: 'st-6', subject_id: 'sub-2', semester: 3, total_classes: 32, attended_classes: 30 },
    { id: 'att-28', student_id: 'st-6', subject_id: 'sub-3', semester: 3, total_classes: 30, attended_classes: 27 },
    { id: 'att-29', student_id: 'st-6', subject_id: 'sub-4', semester: 3, total_classes: 40, attended_classes: 37 },
    { id: 'att-30', student_id: 'st-6', subject_id: 'sub-5', semester: 3, total_classes: 34, attended_classes: 31 },
    { id: 'att-30-1', student_id: 'st-6', subject_id: 'sub-6', semester: 3, total_classes: 36, attended_classes: 33 },
  ],
  ai_remarks: [
    {
      id: 'air-1',
      student_id: 'st-3',
      risk_level: 'high',
      summary: 'Academic risk in Discrete Math and Data Structures; attendance intervention required before end-semester examinations.',
      strengths: ['Demonstrates strong engagement in AI Foundations (62%) and Computer Architecture (65%)'],
      weaknesses: ['Below passing threshold in Discrete Math (44%) and Data Structures (48%)', 'Low attendance in Data Structures (55.5%)'],
      action_items: [
        'Mandatory remedial lab sessions for Data Structures algorithm problem-solving',
        'Attendance improvement plan: minimum 85% attendance target over next 4 weeks',
        'Enroll in Peer Mentoring with Aarav Sharma for Linear Algebra and recurrence relations',
      ],
      tutor_remarks: 'Rohan possesses strong intuitive reasoning in AI principles. Focused tutoring on algorithmic foundations will quickly elevate his Sem 3 SGPA.',
      generated_at: new Date().toISOString(),
    },
  ],
  mentoring_programs: [
    {
      id: 'prog-algo',
      title: 'Data Structures & Algorithms Mastery Circle',
      subject_id: 'sub-1',
      subject_name: 'Data Structures & Algorithms',
      mentor_name: 'Dr. Sunita Kulkarni',
      mentor_role: 'Senior Professor, CSE(AIML)',
      schedule: 'Tuesdays & Thursdays, 4:00 PM – 5:30 PM',
      location: 'Turing Computing Lab 2',
      capacity: 20,
      description: 'Intensive practice in trees, dynamic programming, sorting algorithms, and algorithmic problem solving for CSE(AIML).',
      target_benefit: 'Boost core problem-solving speed and semester exam scores by 15-25%.',
      topics: ['Binary Trees & Graphs', 'Dynamic Programming', 'Recursion & Backtracking', 'Complexity Analysis'],
    },
    {
      id: 'prog-ai',
      title: 'AI Foundations & Machine Learning Studio',
      subject_id: 'sub-2',
      subject_name: 'Artificial Intelligence Foundations',
      mentor_name: 'Prof. Rajesh Sharma',
      mentor_role: 'AI Specialization Lead',
      schedule: 'Mondays & Wednesdays, 3:30 PM – 5:00 PM',
      location: 'AIML Research Suite 4',
      capacity: 18,
      description: 'Hands-on heuristic search, state spaces, knowledge representation, and foundational machine learning mathematical models.',
      target_benefit: 'Master core AI concepts with real-world case studies and exam problem sets.',
      topics: ['A* & Heuristic Search', 'Game Playing & Minimax', 'Constraint Satisfaction', 'Neural Net Fundamentals'],
    },
    {
      id: 'prog-math',
      title: 'Discrete Math & Probability for AIML Intensive',
      subject_id: 'sub-4',
      subject_name: 'Discrete Mathematics & Linear Algebra',
      mentor_name: 'Dr. Sunita Kulkarni & Department Faculty',
      mentor_role: 'Mathematics & Computing Chair',
      schedule: 'Fridays, 2:00 PM – 4:00 PM',
      location: 'Seminar Hall B',
      capacity: 25,
      description: 'Demystifying linear algebra matrices, eigenvalues, graph theory, combinatorics, and probability distributions for ML.',
      target_benefit: 'Solidify theoretical foundation to overcome exam stumbling blocks and secure grade A+.',
      topics: ['Matrix Algebra & Eigenvectors', 'Combinatorics & Relations', 'Graph Theory Proofs', 'Probability Distributions'],
    },
    {
      id: 'prog-honors',
      title: 'Dean’s List Distinction & Research Mentorship',
      mentor_name: 'Dr. Sunita Kulkarni & Department Faculty',
      mentor_role: 'Honors Committee Mentors',
      schedule: 'Saturdays, 11:00 AM – 1:00 PM',
      location: 'Innovation Seminar Suite 3',
      capacity: 25,
      description: 'Strategic exam scoring methodologies, high-yield revision tactics, active recall frameworks, and technical research paper writing.',
      target_benefit: 'Elevate cumulative semester GPA towards Dean’s List and university gold-medal standing.',
      topics: ['High-Yield Revision Techniques', 'Examiner Scoring Rubrics', 'Paper Writing & Projects', 'Exam Time Management'],
    },
  ],
  mentoring_enrollments: [
    {
      id: 'menr-1',
      program_id: 'prog-algo',
      student_id: 'st-3',
      enrolled_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      status: 'active',
      notes: 'Focus on recursion and dynamic programming exam prep',
    },
  ],
};

export class DataStore {
  private data: DatabaseState;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseState {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        let needsSave = false;

        // Upgrade subjects if old or missing
        if (!parsed.subjects || parsed.subjects.length < 6 || parsed.subjects.some((s: any) => s.subject_code && s.subject_code.startsWith('CS4'))) {
          parsed.subjects = INITIAL_DATA.subjects;
          needsSave = true;
        }

        // Upgrade students course & semester to CSE(AIML) Sem 3
        if (parsed.students && parsed.students.length) {
          parsed.students.forEach((st: Student) => {
            if (!st.course || st.course.includes('BCA')) {
              st.course = 'CSE(AIML)';
              st.semester = 3;
              if (st.roll_number && st.roll_number.startsWith('BCA')) {
                st.roll_number = st.roll_number.replace('BCA-2024-0', '23AIML0').replace('BCA-2024-', '23AIML');
              }
              needsSave = true;
            }
          });
        }

        // Upgrade marks & attendance semester
        if (parsed.marks) {
          parsed.marks.forEach((m: Mark) => {
            if (m.semester === 4) {
              m.semester = 3;
              needsSave = true;
            }
          });
        }
        if (parsed.attendance) {
          parsed.attendance.forEach((a: Attendance) => {
            if (a.semester === 4) {
              a.semester = 3;
              needsSave = true;
            }
          });
        }

        if (!parsed.mentoring_programs || !parsed.mentoring_programs.length) {
          parsed.mentoring_programs = INITIAL_DATA.mentoring_programs;
          needsSave = true;
        }
        if (!parsed.mentoring_enrollments) {
          parsed.mentoring_enrollments = INITIAL_DATA.mentoring_enrollments;
          needsSave = true;
        }

        if (needsSave) {
          this.saveData(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed reading db file, using seed data:', e);
    }
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  private saveData(data: DatabaseState) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed writing db file:', e);
    }
  }

  public getState(): DatabaseState {
    return this.data;
  }

  public mutate(fn: (data: DatabaseState) => void): DatabaseState {
    fn(this.data);
    this.saveData(this.data);
    return this.data;
  }
}

export const db = new DataStore();
