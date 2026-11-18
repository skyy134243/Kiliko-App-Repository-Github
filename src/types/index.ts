// Core Type Definitions for Kiliko.App

export type Role = 'SISWA' | 'GURU' | 'BK' | 'TU' | 'KEPALA_SEKOLAH' | 'ADMIN';

export type TaskType = 'LKPD_ESAI' | 'PILIHAN_GANDA' | 'PRAKTIKUM' | 'KELOMPOK';

export type TaskCategory = 'TENGGAT' | 'BIASA';

export type SubmissionStatus = 'BELUM_DIKERJAKAN' | 'DIKUMPULKAN' | 'DINILAI';

export type AttendanceStatus = 'HADIR' | 'DISPEN' | 'IZIN' | 'SAKIT' | 'ALPA';

export type AlertPriority = 'MENDESAK' | 'INFORMASI';

export type FollowUpStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface User {
  id: string;
  name: string;
  email: string;
  identifierNumber: string; // NISN untuk siswa, NIP untuk guru/staff
  role: Role;
  avatarUrl?: string;
  classId?: string;
  className?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  gradeLevel: number;
  academicYear: string;
  semester: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  teacherId: string;
  teacherName: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D' | 'E';
    text: string;
  }[];
  correctKey: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  category: TaskCategory; // TENGGAT atau BIASA
  deadline: string; // ISO date string
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  attachmentUrl?: string;
  
  // Pilihan Ganda logic
  isAnswerKeyLocked?: boolean;
  questions?: QuizQuestion[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  status: SubmissionStatus;
  submittedAt?: string;
  
  // Answers
  photoAnswerUrl?: string; // Foto lembar jawaban LKPD
  textContent?: string;
  selectedAnswers?: Record<string, string>; // Quiz student answers { questionId: 'A' }
  attachmentUrls?: string[]; // Media Praktikum/Kelompok
  
  // Tugas Kelompok
  groupId?: string;
  groupName?: string;
  groupMembers?: string[];

  // Grading
  score?: number; // 0 - 100
  teacherFeedback?: string;
  gradedAt?: string;
  gradedById?: string;
}

export interface GradebookEntry {
  id: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  assignmentId: string;
  assignmentTitle: string;
  taskCategory: TaskCategory;
  score: number;
  isAutoSynced: boolean;
  syncedAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  periodNumber: number; // 1 - 8
  subjectId: string;
  subjectName: string;
  classId: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  reason?: string;
  recordedByTeacherId: string;
}

export interface BotAttendanceAlert {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  totalAbsences: number; // >= 3
  alpaCount: number;
  priority: AlertPriority; // MENDESAK if alpaCount >= 1 or >= 3 absences, INFORMASI if mostly izin/sakit
  details: {
    period: number;
    subjectName: string;
    status: AttendanceStatus;
    reason?: string;
  }[];
  followUpStatus: FollowUpStatus;
  bkNotes?: string;
  resolvedAt?: string;
  resolvedByName?: string;
}

export interface ClearanceCertificate {
  id: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  className: string;
  academicYear: string;
  semester: number;
  verificationCode: string;
  isEligible: boolean; // seluruh tugas tenggat tuntas
  uncompletedDeadlinesCount: number;
  issuedAt: string;
  
  // Tanda Tangan Elektronik (TTE) Kepala Sekolah
  isSignedByPrincipal: boolean;
  principalName: string;
  principalNip: string;
  principalSignatureHash?: string;
  principalSignedAt?: string;
}
