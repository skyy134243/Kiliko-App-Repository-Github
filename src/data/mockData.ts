import {
  User,
  ClassRoom,
  Subject,
  Assignment,
  Submission,
  AttendanceRecord,
  GradebookEntry,
  WhatsAppLog,
} from '../types';
import { ALL_CLASSES_X, RAW_STUDENTS_LIST } from './masterStudents';
import { ALL_CLASSES_XI, RAW_STUDENTS_LIST_XI } from './masterStudents11';

// Transform 352 raw students of Kelas X into full User objects
const GENERATED_STUDENTS_X: User[] = RAW_STUDENTS_LIST.map((s) => {
  const nisnNumber = `20241${String(s.no).padStart(4, '0')}`;
  const parentPrefix = s.gender === 'Laki-laki' ? 'Bpk. ' : 'Ibu ';
  const lastName = s.name.split(' ').slice(-1)[0];

  return {
    id: `student-${s.no}`,
    name: s.name,
    email: `${s.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)}${s.no}@sman1kandangan.sch.id`,
    identifierNumber: nisnNumber,
    role: 'SISWA',
    classId: s.classId,
    className: s.className,
    parentName: `${parentPrefix}${lastName}`,
    parentPhone: `0812-${String(1000 + (s.no * 23)).padStart(4, '0')}-${String(2000 + (s.no * 17)).padStart(4, '0')}`,
    avatarUrl: s.gender === 'Laki-laki'
      ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  };
});

// Transform 352 raw students of Kelas XI into full User objects
const GENERATED_STUDENTS_XI: User[] = RAW_STUDENTS_LIST_XI.map((s) => {
  const nisnNumber = `20231${String(s.no).padStart(4, '0')}`;
  const parentPrefix = s.gender === 'Laki-laki' ? 'Bpk. ' : 'Ibu ';
  const lastName = s.name.split(' ').slice(-1)[0];

  return {
    id: `student-xi-${s.no}`,
    name: s.name,
    email: `${s.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)}${s.no}@sman1kandangan.sch.id`,
    identifierNumber: nisnNumber,
    role: 'SISWA',
    classId: s.classId,
    className: s.className,
    parentName: `${parentPrefix}${lastName}`,
    parentPhone: `0813-${String(1000 + (s.no * 19)).padStart(4, '0')}-${String(3000 + (s.no * 23)).padStart(4, '0')}`,
    avatarUrl: s.gender === 'Laki-laki'
      ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  };
});

// All 704 students
const GENERATED_STUDENTS: User[] = [...GENERATED_STUDENTS_X, ...GENERATED_STUDENTS_XI];

// Staff & Teachers
const STAFF_USERS: User[] = [
  {
    id: 'user-guru-1',
    name: 'Ibu Sri Wahyuni, M.Pd',
    email: 'sri.wahyuni@sman1kandangan.sch.id',
    identifierNumber: '198205142005012003',
    role: 'GURU',
    isHomeroomTeacher: true,
    homeroomClassId: 'cls-x-1',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-walikelas-1',
    name: 'Ibu Sri Wahyuni, M.Pd (Wali Kelas X-1)',
    email: 'walikelas.sri@sman1kandangan.sch.id',
    identifierNumber: '198205142005012003',
    role: 'WALI_KELAS',
    isHomeroomTeacher: true,
    homeroomClassId: 'cls-x-1',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-guru-2',
    name: 'Pak Bambang Irawan, S.Pd',
    email: 'bambang@sman1kandangan.sch.id',
    identifierNumber: '197903222003121002',
    role: 'GURU',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-bk-1',
    name: 'Dra. Ratna Megasari',
    email: 'bk.ratna@sman1kandangan.sch.id',
    identifierNumber: '197604101998022001',
    role: 'BK',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-tu-1',
    name: 'Hendra Kurniawan (TU)',
    email: 'tu.hendra@sman1kandangan.sch.id',
    identifierNumber: '198811052010011005',
    role: 'TU',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-kepsek-1',
    name: 'Drs. H. Mulyadi, M.Pd',
    email: 'kepsek@sman1kandangan.sch.id',
    identifierNumber: '197508121999031004',
    role: 'KEPALA_SEKOLAH',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-admin-1',
    name: 'Argha (Admin & PM)',
    email: 'argha@kiliko.app',
    identifierNumber: 'ADMIN-001',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  },
];

// Combine all 704 students (Kelas X & XI) + Staff
export const INITIAL_USERS: User[] = [...GENERATED_STUDENTS_X, ...GENERATED_STUDENTS_XI, ...STAFF_USERS];

export const INITIAL_CLASSES: ClassRoom[] = [
  ...ALL_CLASSES_X.map((c) => ({
    ...c,
    homeroomTeacherId: c.id === 'cls-x-1' ? 'user-guru-1' : 'user-guru-2',
    homeroomTeacherName: c.id === 'cls-x-1' ? 'Ibu Sri Wahyuni, M.Pd' : 'Pak Bambang Irawan, S.Pd',
  })),
  ...ALL_CLASSES_XI.map((c) => ({
    ...c,
    homeroomTeacherId: c.id === 'cls-xi-1' ? 'user-guru-1' : 'user-guru-2',
    homeroomTeacherName: c.id === 'cls-xi-1' ? 'Ibu Sri Wahyuni, M.Pd' : 'Pak Bambang Irawan, S.Pd',
  })),
];

export const INITIAL_SUBJECTS: Subject[] = [
  // Mata Pelajaran Kelas X
  { id: 'sbj-fis', code: 'FIS-10', name: 'Fisika X', teacherId: 'user-guru-1', teacherName: 'Ibu Sri Wahyuni, M.Pd' },
  { id: 'sbj-mat', code: 'MAT-10', name: 'Matematika Wajib X', teacherId: 'user-guru-1', teacherName: 'Ibu Sri Wahyuni, M.Pd' },
  { id: 'sbj-bio', code: 'BIO-10', name: 'Biologi X', teacherId: 'user-guru-2', teacherName: 'Pak Bambang Irawan, S.Pd' },
  { id: 'sbj-sos', code: 'SOS-10', name: 'Sosiologi X', teacherId: 'user-guru-2', teacherName: 'Pak Bambang Irawan, S.Pd' },
  { id: 'sbj-kim', code: 'KIM-10', name: 'Kimia X', teacherId: 'user-guru-1', teacherName: 'Ibu Sri Wahyuni, M.Pd' },
  { id: 'sbj-ind', code: 'IND-10', name: 'Bahasa Indonesia X', teacherId: 'user-guru-2', teacherName: 'Pak Bambang Irawan, S.Pd' },

  // Mata Pelajaran Kelas XI
  { id: 'sbj-fis-11', code: 'FIS-11', name: 'Fisika XI', teacherId: 'user-guru-1', teacherName: 'Ibu Sri Wahyuni, M.Pd' },
  { id: 'sbj-mat-11', code: 'MAT-11', name: 'Matematika XI', teacherId: 'user-guru-1', teacherName: 'Ibu Sri Wahyuni, M.Pd' },
  { id: 'sbj-bio-11', code: 'BIO-11', name: 'Biologi XI', teacherId: 'user-guru-2', teacherName: 'Pak Bambang Irawan, S.Pd' },
  { id: 'sbj-sos-11', code: 'SOS-11', name: 'Sosiologi XI', teacherId: 'user-guru-2', teacherName: 'Pak Bambang Irawan, S.Pd' },
  { id: 'sbj-kim-11', code: 'KIM-11', name: 'Kimia XI', teacherId: 'user-guru-1', teacherName: 'Ibu Sri Wahyuni, M.Pd' },
  { id: 'sbj-ind-11', code: 'IND-11', name: 'Bahasa Indonesia XI', teacherId: 'user-guru-2', teacherName: 'Pak Bambang Irawan, S.Pd' },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'task-1',
    title: 'LKPD 04: Pembuktian Hukum II Newton',
    description: 'Kerjakan soal latihan nomor 1-5 di lembar kerja siswa. Foto lembar jawaban fisik Anda dengan pencahayaan jelas lalu unggah ke aplikasi.',
    type: 'LKPD_ESAI',
    category: 'TENGGAT', // Wajib untuk surat bebas tugas
    deadline: '2026-11-20T23:59:00',
    subjectId: 'sbj-fis',
    subjectName: 'Fisika',
    classId: 'cls-x-1',
    className: 'X-1',
    teacherId: 'user-guru-1',
    teacherName: 'Ibu Sri Wahyuni, M.Pd',
    attachmentUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    allowLateSubmission: true,
    latePenaltyPerDay: 5,
    createdAt: '2026-11-10T08:00:00',
  },
  {
    id: 'task-2',
    title: 'Kuis Bab 2: Struktur & Fungsi Organel Sel',
    description: 'Pilihan ganda interaktif. Di-extract otomatis dari buku paket Biologi menggunakan AI. Nilai akan otomatis dihitung dan masuk ke tabel nilai kelas.',
    type: 'PILIHAN_GANDA',
    category: 'TENGGAT', // Wajib untuk surat bebas tugas
    deadline: '2026-11-22T17:00:00',
    subjectId: 'sbj-bio',
    subjectName: 'Biologi',
    classId: 'cls-x-1',
    className: 'X-1',
    teacherId: 'user-guru-2',
    teacherName: 'Pak Bambang Irawan, S.Pd',
    isAnswerKeyLocked: true,
    allowLateSubmission: false,
    questions: [
      {
        id: 'q1',
        questionText: 'Organel sel yang berfungsi sebagai tempat berlangsungnya respirasi sel dan penghasil energi (ATP) adalah...',
        options: [
          { key: 'A', text: 'Ribosom' },
          { key: 'B', text: 'Mitokondria' },
          { key: 'C', text: 'Badan Golgi' },
          { key: 'D', text: 'Lisosom' },
          { key: 'E', text: 'Sentriol' },
        ],
        correctKey: 'B',
      },
      {
        id: 'q2',
        questionText: 'Bagian sel tumbuhan yang tidak dimiliki oleh sel hewan adalah...',
        options: [
          { key: 'A', text: 'Membran plasma dan sitoplasma' },
          { key: 'B', text: 'Dinding sel dan kloroplas' },
          { key: 'C', text: 'Nukleus dan ribosom' },
          { key: 'D', text: 'Retikulum endoplasma' },
          { key: 'E', text: 'Mitokondria' },
        ],
        correctKey: 'B',
      },
      {
        id: 'q3',
        questionText: 'Fungsi utama dari ribosom di dalam sitoplasma adalah untuk...',
        options: [
          { key: 'A', text: 'Sintesis protein' },
          { key: 'B', text: 'Pencernaan intraseluler' },
          { key: 'C', text: 'Pengatur pembelahan sel' },
          { key: 'D', text: 'Ekskresi zat sisa' },
          { key: 'E', text: 'Menyimpan cadangan makanan' },
        ],
        correctKey: 'A',
      },
    ],
    createdAt: '2026-11-12T09:30:00',
  },
  {
    id: 'task-3',
    title: 'Praktikum Mandiri: Uji Asam Basa Indikator Alami',
    description: 'Lakukan uji ekstrak kunyit pada cuka dan air sabun. Tuliskan pengamatan dan unggah foto tabel hasil percobaan.',
    type: 'PRAKTIKUM',
    category: 'BIASA',
    deadline: '2026-11-25T23:59:00',
    subjectId: 'sbj-fis',
    subjectName: 'Fisika',
    classId: 'cls-x-1',
    className: 'X-1',
    teacherId: 'user-guru-1',
    teacherName: 'Ibu Sri Wahyuni, M.Pd',
    createdAt: '2026-11-14T10:00:00',
  },
  {
    id: 'task-4',
    title: 'Tugas Kelompok: Analisis Perilaku Remaja Digital',
    description: 'Kerjakan per kelompok 3-4 orang. Kumpulkan presentasi/video infografis per folder kelompok. Nilai yang diberikan akan otomatis berlaku sama ke seluruh anggota.',
    type: 'KELOMPOK',
    category: 'TENGGAT',
    deadline: '2026-11-28T18:00:00',
    subjectId: 'sbj-sos',
    subjectName: 'Sosiologi',
    classId: 'cls-x-1',
    className: 'X-1',
    teacherId: 'user-guru-2',
    teacherName: 'Pak Bambang Irawan, S.Pd',
    createdAt: '2026-11-15T11:00:00',
  },
  {
    id: 'task-xi-1',
    title: 'LKPD 01: Dinamika Rotasi & Momen Inersia',
    description: 'Kerjakan tugas analisis gerak menggelinding tanpa slip pada bidang miring. Foto lembar jawaban fisik Anda dan unggah ke aplikasi.',
    type: 'LKPD_ESAI',
    category: 'TENGGAT',
    deadline: '2026-11-26T23:59:00',
    subjectId: 'sbj-fis-11',
    subjectName: 'Fisika XI',
    classId: 'cls-xi-1',
    className: 'XI-1',
    teacherId: 'user-guru-1',
    teacherName: 'Ibu Sri Wahyuni, M.Pd',
    createdAt: '2026-11-16T08:00:00',
  },
  {
    id: 'task-xi-2',
    title: 'Kuis Bab 3: Sistem Sirkulasi Darah Manusia',
    description: 'Kuis pilihan ganda interaktif. Diperiksa dan dinilai langsung secara otomatis oleh bot aplikasi.',
    type: 'PILIHAN_GANDA',
    category: 'TENGGAT',
    deadline: '2026-11-27T23:59:00',
    subjectId: 'sbj-bio-11',
    subjectName: 'Biologi XI',
    classId: 'cls-xi-1',
    className: 'XI-1',
    teacherId: 'user-guru-2',
    teacherName: 'Pak Bambang Irawan, S.Pd',
    isAnswerKeyLocked: true,
    questions: [
      {
        id: 'q1',
        questionText: 'Bagian jantung yang memompa darah bersih ke seluruh tubuh adalah...',
        options: [
          { key: 'A', text: 'Serambi kanan' },
          { key: 'B', text: 'Bilik kiri' },
          { key: 'C', text: 'Bilik kanan' },
          { key: 'D', text: 'Serambi kiri' },
        ],
        correctKey: 'B',
      },
    ],
    createdAt: '2026-11-17T09:00:00',
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'task-1',
    studentId: 'student-1',
    studentName: 'ACHMAD RAFKI ZIDNA AYUBA',
    studentNis: '202410001',
    status: 'DINILAI',
    submittedAt: '2026-11-14T14:20:00',
    photoAnswerUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
    originalSizeMb: 4.8,
    compressedSizeKb: 312,
    score: 88,
    teacherFeedback: 'Langkah pengerjaan rumus percepatan dan gaya gesek sudah runtut dan tepat. Bagus!',
    gradedAt: '2026-11-15T09:15:00',
    gradedById: 'user-guru-1',
  },
  {
    id: 'sub-2',
    assignmentId: 'task-2',
    studentId: 'student-1',
    studentName: 'ACHMAD RAFKI ZIDNA AYUBA',
    studentNis: '202410001',
    status: 'DINILAI',
    submittedAt: '2026-11-15T16:00:00',
    selectedAnswers: { q1: 'B', q2: 'B', q3: 'A' },
    score: 100,
    teacherFeedback: 'Sempurna! Semua jawaban kuis pilihan ganda benar (dinilai otomatis).',
    gradedAt: '2026-11-15T16:00:05',
    gradedById: 'bot-auto-grader',
  },
  {
    id: 'sub-3',
    assignmentId: 'task-1',
    studentId: 'student-2',
    studentName: 'AHMAD FARI AMRULLOH WONG',
    studentNis: '202410002',
    status: 'DIKUMPULKAN',
    submittedAt: '2026-11-16T10:10:00',
    photoAnswerUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    originalSizeMb: 5.2,
    compressedSizeKb: 340,
    textContent: 'Mohon maaf bu Sri baru bisa mengumpulkan sekarang.',
  },
  {
    id: 'sub-xi-1',
    assignmentId: 'task-xi-1',
    studentId: 'student-xi-1',
    studentName: 'ANGGUN FADHILLA RAMADHANI',
    studentNis: '202311001',
    status: 'DINILAI',
    submittedAt: '2026-11-17T11:00:00',
    score: 92,
    teacherFeedback: 'Analisis momen gaya dan rotasi sangat terinci dan benar.',
    gradedAt: '2026-11-17T14:30:00',
    gradedById: 'user-guru-1',
  },
  {
    id: 'sub-xi-2',
    assignmentId: 'task-xi-2',
    studentId: 'student-xi-1',
    studentName: 'ANGGUN FADHILLA RAMADHANI',
    studentNis: '202311001',
    status: 'DINILAI',
    submittedAt: '2026-11-17T15:20:00',
    score: 100,
    teacherFeedback: 'Nilai otomatis oleh bot kuis: 100/100',
    gradedAt: '2026-11-17T15:20:02',
    gradedById: 'bot-auto-grader',
  },
];

export const INITIAL_GRADEBOOK: GradebookEntry[] = [
  {
    id: 'gb-1',
    studentId: 'student-1',
    studentName: 'ACHMAD RAFKI ZIDNA AYUBA',
    studentNis: '202410001',
    classId: 'cls-x-1',
    subjectId: 'sbj-fis',
    subjectName: 'Fisika',
    assignmentId: 'task-1',
    assignmentTitle: 'LKPD 04: Pembuktian Hukum II Newton',
    taskCategory: 'TENGGAT',
    score: 88,
    isAutoSynced: true,
    assessmentType: 'FORMATIF',
    learningObjective: 'TP 10.1: Menganalisis besaran fisika pada dinamika gerak',
    syncedAt: '2026-11-15T09:15:00',
  },
  {
    id: 'gb-2',
    studentId: 'student-1',
    studentName: 'ACHMAD RAFKI ZIDNA AYUBA',
    studentNis: '202410001',
    classId: 'cls-x-1',
    subjectId: 'sbj-bio',
    subjectName: 'Biologi',
    assignmentId: 'task-2',
    assignmentTitle: 'Kuis Bab 2: Struktur & Fungsi Organel Sel',
    taskCategory: 'TENGGAT',
    score: 100,
    isAutoSynced: true,
    assessmentType: 'SUMATIF_LINGKUP_MATERI',
    learningObjective: 'TP 10.2: Mengidentifikasi organel sel dan fungsinya',
    syncedAt: '2026-11-15T16:00:05',
  },
  {
    id: 'gb-xi-1',
    studentId: 'student-xi-1',
    studentName: 'ANGGUN FADHILLA RAMADHANI',
    studentNis: '202311001',
    classId: 'cls-xi-1',
    subjectId: 'sbj-fis-11',
    subjectName: 'Fisika XI',
    assignmentId: 'task-xi-1',
    assignmentTitle: 'LKPD 01: Dinamika Rotasi & Momen Inersia',
    taskCategory: 'TENGGAT',
    score: 92,
    isAutoSynced: true,
    assessmentType: 'FORMATIF',
    learningObjective: 'TP 11.1: Menganalisis gerak rotasi dan kesetimbangan benda tegar',
    syncedAt: '2026-11-17T14:30:00',
  },
  {
    id: 'gb-xi-2',
    studentId: 'student-xi-1',
    studentName: 'ANGGUN FADHILLA RAMADHANI',
    studentNis: '202311001',
    classId: 'cls-xi-1',
    subjectId: 'sbj-bio-11',
    subjectName: 'Biologi XI',
    assignmentId: 'task-xi-2',
    assignmentTitle: 'Kuis Bab 3: Sistem Sirkulasi Darah Manusia',
    taskCategory: 'TENGGAT',
    score: 100,
    isAutoSynced: true,
    assessmentType: 'SUMATIF_LINGKUP_MATERI',
    learningObjective: 'TP 11.2: Memahami struktur peredaran darah besar dan kecil',
    syncedAt: '2026-11-17T15:20:02',
  },
];

const todayStr = '2026-11-17';

// Generate Comprehensive Initial Attendance for all classes
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Absensi Kelas X-1 Sesi 1 (Fisika)
  ...GENERATED_STUDENTS.filter((s) => s.classId === 'cls-x-1').map((s) => ({
    id: `att-${todayStr}-1-fis-${s.id}`,
    date: todayStr,
    periodNumber: 1,
    subjectId: 'sbj-fis',
    subjectName: 'Fisika',
    classId: 'cls-x-1',
    studentId: s.id,
    studentName: s.name,
    status: s.id === 'student-7' ? ('ALPA' as const) : s.id === 'student-3' ? ('IZIN' as const) : ('HADIR' as const),
    reason: s.id === 'student-7' ? 'Tanpa keterangan jam pertama' : s.id === 'student-3' ? 'Izin lomba PMR' : undefined,
    recordedByTeacherId: 'user-guru-1',
  })),

  // Absensi Kelas X-1 Sesi 2 (Biologi)
  ...GENERATED_STUDENTS.filter((s) => s.classId === 'cls-x-1').map((s) => ({
    id: `att-${todayStr}-3-bio-${s.id}`,
    date: todayStr,
    periodNumber: 3,
    subjectId: 'sbj-bio',
    subjectName: 'Biologi',
    classId: 'cls-x-1',
    studentId: s.id,
    studentName: s.name,
    status: s.id === 'student-7' ? ('ALPA' as const) : ('HADIR' as const),
    reason: s.id === 'student-7' ? 'Tidak masuk lab biologi' : undefined,
    recordedByTeacherId: 'user-guru-2',
  })),

  // Absensi Kelas X-1 Sesi 3 (Matematika) - Menjadikan student-7 (BADRUL MUSOFFA) 3x Alpa sehingga memicu Bot Alert BK & WA Ortu!
  ...GENERATED_STUDENTS.filter((s) => s.classId === 'cls-x-1').map((s) => ({
    id: `att-${todayStr}-5-mat-${s.id}`,
    date: todayStr,
    periodNumber: 5,
    subjectId: 'sbj-mat',
    subjectName: 'Matematika Wajib',
    classId: 'cls-x-1',
    studentId: s.id,
    studentName: s.name,
    status: s.id === 'student-7' ? ('ALPA' as const) : ('HADIR' as const),
    reason: s.id === 'student-7' ? 'Belum ada surat pemberitahuan ke wali kelas' : undefined,
    recordedByTeacherId: 'user-guru-1',
  })),

  // Sampel Kehadiran Kelas X-2 sampai X-10
  ...GENERATED_STUDENTS.filter((s) => s.classId !== 'cls-x-1').slice(0, 50).map((s) => ({
    id: `att-${todayStr}-1-ind-${s.id}`,
    date: todayStr,
    periodNumber: 1,
    subjectId: 'sbj-ind',
    subjectName: 'Bahasa Indonesia',
    classId: s.classId || 'cls-x-2',
    studentId: s.id,
    studentName: s.name,
    status: 'HADIR' as const,
    recordedByTeacherId: 'user-guru-2',
  })),
];

export const INITIAL_WA_LOGS: WhatsAppLog[] = [
  {
    id: 'wa-1',
    recipientPhone: '0812-1161-2119',
    recipientName: 'Bpk. MUSOFFA',
    studentName: 'BADRUL MUSOFFA',
    studentNis: '202410007',
    className: 'X-1',
    type: 'ABSENSI_ALPA',
    message: '*PEMBERITAHUAN KILIKO.APP — SMAN 1 KANDANGAN*\nYth. Bpk. MUSOFFA, ananda BADRUL MUSOFFA tercatat tidak hadir pada 3 mapel hari ini (Alpa). Mohon segera konfirmasi ke pihak sekolah.',
    sentAt: '2026-11-17T11:45:00',
    status: 'TERKIRIM',
  },
];
