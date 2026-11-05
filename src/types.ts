export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  student_id?: string;
  studentDetails?: Student | null;
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

export interface EnrichedMark {
  id: string;
  mark_id: string;
  student_id: string;
  name: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  semester: number;
  marks: number;
  max_marks?: number;
  percentage: number;
  exam_type?: string;
}

export interface EnrichedAttendance {
  id: string;
  attendance_id: string;
  student_id: string;
  name: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  semester: number;
  total_classes: number;
  attended_classes: number;
  percentage: number;
}

export interface SubjectStat {
  subject_id: string;
  subject_name: string;
  average: number;
  total_records: number;
  passing_rate: number;
}

export interface StudentRanking {
  id: string;
  student_id?: string;
  name: string;
  roll_number?: string;
  course: string;
  semester: number;
  division: string;
  average_marks: number;
  average_attendance: number;
  percentage?: number;
  attendance?: number;
  grade?: string;
  risk_level: 'low' | 'moderate' | 'high';
  rank: number;
}

export interface AnalyticsSummary {
  total_students: number;
  average_marks: number;
  average_attendance: number;
  total_tests: number;
  subject_data: SubjectStat[];
  focus_data: SubjectStat[];
  grade_data: { grade: string; total: number }[];
  rankings: StudentRanking[];
  top_students: StudentRanking[];
  at_risk_students: StudentRanking[];
  ml_model_metrics?: {
    model_name: string;
    pearson_correlation_r: number;
    regression_slope: number;
    regression_intercept: number;
    r_squared: number;
    rmse: number;
    feature_weights: {
      internal_assessment: number;
      classroom_attendance: number;
      practical_labs: number;
    };
    clusters: {
      advanced_learners: number;
      core_performers: number;
      remedial_cohort: number;
    };
  };
}

export type AnalyticsResponse = AnalyticsSummary;

export interface AIRemarkRecord {
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

export interface PredictionInfographic {
  health_score: number;
  predicted_final_gpa: number;
  potential_with_intervention: number;
  risk_index: number;
  factors: {
    category: string;
    score: number;
    status: 'optimal' | 'moderate' | 'critical';
    description: string;
  }[];
  subject_forecasts: {
    subject_name: string;
    current_marks: number;
    forecast_final: number;
    trajectory: 'up' | 'stable' | 'down';
    difficulty_weight: string;
  }[];
  intervention_simulation: {
    remedial_hours: number;
    projected_gain: number;
  }[];
  cohort_distribution?: {
    attendance: number;
    marks: number;
    name: string;
    isCurrent?: boolean;
  }[];
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
  enrolled_count?: number;
  is_enrolled?: boolean;
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'model';
  content: string;
  timestamp: string;
  recommended_programs?: any[];
  suggested_actions?: any[];
  suggested_action?: {
    label: string;
    type: 'enroll_program' | 'open_tab' | 'view_plan';
    target_id?: string;
  };
}

export interface MarksheetExtractedData {
  student_name?: string;
  roll_number?: string;
  semester?: number;
  exam_title?: string;
  subjects: {
    subject_name: string;
    marks: number;
    max_marks: number;
    subject_code?: string;
  }[];
}
