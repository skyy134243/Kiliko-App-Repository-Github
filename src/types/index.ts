// Core Type Definitions for Kiliko.App (Updated with Wali Kelas, WA Gateway, & Kurikulum Merdeka)

export type Role = 'SISWA' | 'GURU' | 'WALI_KELAS' | 'BK' | 'TU' | 'KEPALA_SEKOLAH' | 'ADMIN';

export type TaskType = 'LKPD_ESAI' | 'PILIHAN_GANDA' | 'PRAKTIKUM' | 'KELOMPOK';

export type TaskCategory = 'TENGGAT' | 'BIASA';

export type SubmissionStatus = 'BELUM_DIKERJAKAN' | 'DIKUMPULKAN' | 'DINILAI' | 'REMEDIAL';

export type AttendanceStatus = 'HADIR' | 'DISPEN' | 'IZIN' | 'SAKIT' | 'ALPA';

export type AlertPriority = 'MENDESAK' | 'INFORMASI';

export type FollowUpStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export type WaNotificationType = 'ABSENSI_ALPA' | 'DEADLINE_TENGGAT' | 'SURAT_BEBAS_TUGAS' | 'PEMANGGILAN_ORTU';

export interface WhatsAppLog {
  id: string;
  recipientPhone: string;
  recipientName: string; // Orang Tua / Wali Siswa
  studentName: string;
  studentNis: string;
  className: string;
  type: WaNotificationType;
  message: string;
  sentAt: string;
  status: 'TERKIRIM' | 'DIBACA' | 'GAGAL';
}

export interface User {
  id: string;
  name: string;
  email: string;
  identifierNumber: string; // NISN untuk siswa, NIP untuk guru/staff
  role: Role;
  avatarUrl?: string;
  classId?: string;
  className?: string;
  parentPhone?: string; // Nomor WA Orang Tua
  parentName?: string;
  isHomeroomTeacher?: boolean; // Wali Kelas
  homeroomClassId?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  gradeLevel: number;
  academicYear: string;
  semester: number;
  homeroomTeacherId?: string;
  homeroomTeacherName?: string;
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
  
  // Aturan Keterlambatan (Late Submission Policy)
  allowLateSubmission?: boolean;
  latePenaltyPerDay?: number; // Pengurangan skor per hari

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
  isLate?: boolean; // Terlambat
  
  // Answers & Compressed Photo Telemetry
  photoAnswerUrl?: string; // Foto lembar jawaban LKPD
  compressedSizeKb?: number; // Ukuran file setelah kompresi
  originalSizeMb?: number;   // Ukuran asli kamera
  textContent?: string;
  selectedAnswers?: Record<string, string>; // Quiz student answers { questionId: 'A' }
  attachmentUrls?: string[]; // Media Praktikum/Kelompok
  
  // Tugas Kelompok
  groupId?: string;
  groupName?: string;
  groupMembers?: string[];

  // Grading & Remedial
  score?: number; // 0 - 100
  teacherFeedback?: string;
  gradedAt?: string;
  gradedById?: string;
  isRemedial?: boolean;
  remedialScore?: number;
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
  
  // Format e-Rapor Kurikulum Merdeka
  assessmentType?: 'FORMATIF' | 'SUMATIF_LINGKUP_MATERI' | 'SUMATIF_AKHIR_SEMESTER';
  learningObjective?: string; // Capaian / Tujuan Pembelajaran (TP)
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
  waSentToParent?: boolean;
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
