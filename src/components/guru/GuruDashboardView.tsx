import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, TaskType, TaskCategory, AttendanceStatus, QuizQuestion } from '../../types';
import { simulateAiOcrExtraction } from '../../services/ocrSimulation';

interface GuruDashboardViewProps {
  initialSubTab?: 'buat-tugas' | 'koreksi' | 'absensi';
}

export const GuruDashboardView: React.FC<GuruDashboardViewProps> = ({
  initialSubTab = 'buat-tugas',
}) => {
  const {
    currentUser,
    assignments,
    submissions,
    classes,
    subjects,
    users,
    createAssignment,
    gradeSubmission,
    recordClassAttendance,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'buat-tugas' | 'koreksi' | 'absensi'>(initialSubTab);

  // --- FORM STATE: BUAT TUGAS ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [taskType, setTaskType] = useState<TaskType>('LKPD_ESAI');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('TENGGAT');
  const [deadline, setDeadline] = useState('2026-11-25T23:59');

  // AI OCR state for Multiple Choice
  const [isExtractingOcr, setIsExtractingOcr] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isAnswerKeyLocked, setIsAnswerKeyLocked] = useState(false);

  // --- STATE: KOREKSI JAWABAN ---
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(assignments[0]?.id || '');
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [inputScore, setInputScore] = useState<number>(85);
  const [inputFeedback, setInputFeedback] = useState<string>('Jawaban terstruktur rapi dan lengkap.');

  // --- STATE: ABSENSI ---
  const [attDate, setAttDate] = useState('2026-11-17');
  const [attPeriod, setAttPeriod] = useState<number>(1);
  const [attSubjectId, setAttSubjectId] = useState(subjects[0]?.id || '');
  const [attClassId, setAttClassId] = useState(classes[0]?.id || '');

  // Students in selected class
  const classStudents = users.filter(
    (u) => u.role === 'SISWA' && (!u.classId || u.classId === attClassId)
  );

  const [studentAttMap, setStudentAttMap] = useState<
    Record<string, { status: AttendanceStatus; reason: string }>
  >({});

  const handleAttStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentAttMap((prev) => ({
      ...prev,
      [studentId]: {
        status,
        reason: prev[studentId]?.reason || '',
      },
    }));
  };

  const handleAttReasonChange = (studentId: string, reason: string) => {
    setStudentAttMap((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'HADIR',
        reason,
      },
    }));
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const records = classStudents.map((s) => ({
      studentId: s.id,
      status: studentAttMap[s.id]?.status || 'HADIR',
      reason: studentAttMap[s.id]?.reason || '',
    }));

    recordClassAttendance(attDate, attPeriod, attSubjectId, records);
    alert('✓ Absensi berhasil disimpan! Bot absensi telah memeriksa ketidakhadiran siswa.');
  };

  // Trigger AI OCR extraction for MC
  const handleAiExtract = async () => {
    setIsExtractingOcr(true);
    try {
      const extracted = await simulateAiOcrExtraction();
      setQuizQuestions(extracted);
      setIsAnswerKeyLocked(false);
    } finally {
      setIsExtractingOcr(false);
    }
  };

  // Submit Buat Tugas
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();

    // Aturan Bisnis 3: Tugas pilihan ganda tidak dapat dipublikasikan sebelum guru mengunci kunci jawaban.
    if (taskType === 'PILIHAN_GANDA') {
      if (quizQuestions.length === 0) {
        alert('Harap masukkan soal pilihan ganda atau gunakan tombol "Extract Soal via AI"!');
        return;
      }
      if (!isAnswerKeyLocked) {
        alert('Aturan Bisnis: Tugas Pilihan Ganda WAJIB dikunci kunci jawabannya sebelum dipublikasikan!');
        return;
      }
    }

    const sub = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
    const cls = classes.find((c) => c.id === selectedClassId) || classes[0];

    createAssignment({
      title,
      description,
      subjectId: sub.id,
      subjectName: sub.name,
      classId: cls.id,
      className: cls.name,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      type: taskType,
      category: taskCategory,
      deadline,
      isAnswerKeyLocked: taskType === 'PILIHAN_GANDA' ? isAnswerKeyLocked : undefined,
      questions: taskType === 'PILIHAN_GANDA' ? quizQuestions : undefined,
    });

    alert('✓ Tugas berhasil dipublikasikan ke siswa!');
    setTitle('');
    setDescription('');
    setQuizQuestions([]);
    setIsAnswerKeyLocked(false);
    setActiveTab('koreksi');
  };

  // Submissions for currently selected assignment
  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];
  const currentSubmissions = submissions.filter((s) => s.assignmentId === currentAssignment?.id);
  const activeSubmission = currentSubmissions.find((s) => s.id === selectedSubId) || currentSubmissions[0];

  const handleSaveGrade = () => {
    if (!activeSubmission) return;
    gradeSubmission(activeSubmission.id, inputScore, inputFeedback);
    alert('✓ Nilai berhasil disimpan dan langsung masuk ke tabel nilai kelas!');
  };

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('buat-tugas')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'buat-tugas'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          ➕ Buat Tugas Baru
        </button>
        <button
          onClick={() => setActiveTab('koreksi')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'koreksi'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          📑 Riwayat & Koreksi Tugas
        </button>
        <button
          onClick={() => setActiveTab('absensi')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'absensi'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          📅 Input Absensi Kelas
        </button>
      </div>

      {/* TAB 1: BUAT TUGAS */}
      {activeTab === 'buat-tugas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Buat Tugas Baru untuk Kelas</h2>
            <p className="text-xs text-slate-500">
              Sesuai PRD Poin 5.1 & 6.1: Tentukan 4 jenis tugas dan kategori tugas (Tenggat / Biasa).
            </p>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran:</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kelas Tujuan:</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (T.A. {c.academicYear})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Tugas:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: LKPD 05 - Pembiasan Cahaya Pada Lensa"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Petunjuk & Deskripsi Tugas:</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan petunjuk pengerjaan soal secara rinci..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Jenis & Kategori Tugas Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Jenis Tugas (4 Pilihan PRD 6.1):
                </label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as TaskType)}
                  className="w-full text-xs p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 font-bold text-indigo-900"
                >
                  <option value="LKPD_ESAI">📝 LKPD / Esai (Foto Jawaban Fisik)</option>
                  <option value="PILIHAN_GANDA">⚡ Pilihan Ganda (Auto-Grade + AI OCR)</option>
                  <option value="PRAKTIKUM">🔬 Praktikum</option>
                  <option value="KELOMPOK">👥 Tugas Kelompok (Folder Kolektif)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Kategori Tugas (PRD 6.2):
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTaskCategory('TENGGAT')}
                    className={`flex-1 p-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      taskCategory === 'TENGGAT'
                        ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>🔴</span>
                    <span>Tugas Tenggat (Syarat Bebas Tugas)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTaskCategory('BIASA')}
                    className={`flex-1 p-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      taskCategory === 'BIASA'
                        ? 'bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>⚪</span>
                    <span>Tugas Biasa</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Batas Waktu Tenggat (Deadline):</label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            {/* Khusus PILIHAN GANDA: AI OCR & KUNCI JAWABAN */}
            {taskType === 'PILIHAN_GANDA' && (
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-purple-900 block">
                      Konfigurasi Soal Pilihan Ganda & AI OCR (PRD 6.1.b)
                    </span>
                    <span className="text-[11px] text-purple-700">
                      Foto soal dari buku diubah menjadi form interaktif berbasis AI.
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isExtractingOcr}
                    onClick={handleAiExtract}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1"
                  >
                    <span>📷</span>
                    <span>{isExtractingOcr ? 'Memproses AI...' : 'Simulasi Foto Buku & Extract AI'}</span>
                  </button>
                </div>

                {quizQuestions.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-purple-200">
                    <span className="text-xs font-bold text-slate-700 block">
                      Hasil Ekstraksi Soal ({quizQuestions.length} butir):
                    </span>

                    {quizQuestions.map((q, idx) => (
                      <div key={q.id} className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                        <p className="font-semibold text-slate-800">
                          {idx + 1}. {q.questionText}
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 text-slate-600 text-[11px]">
                          {q.options.map((opt) => (
                            <span
                              key={opt.key}
                              className={`p-1 rounded ${
                                opt.key === q.correctKey ? 'bg-emerald-100 font-bold text-emerald-800' : ''
                              }`}
                            >
                              <strong>{opt.key}.</strong> {opt.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Aturan Bisnis 3: Kunci Kunci Jawaban */}
                    <div className="p-3 bg-white rounded-xl border border-purple-200 flex items-center justify-between">
                      <div className="text-xs text-slate-700">
                        <strong className="block text-slate-900">Aturan Bisnis PRD Poin 7.3:</strong>
                        Tugas pilihan ganda tidak dapat dipublikasikan sebelum guru mengunci kunci jawaban.
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAnswerKeyLocked(!isAnswerKeyLocked)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 ${
                          isAnswerKeyLocked
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-amber-500 text-white hover:bg-amber-600 animate-pulse'
                        }`}
                      >
                        <span>{isAnswerKeyLocked ? '🔒 Kunci Jawaban Terkunci' : '🔓 Kunci Jawaban Sekarang'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              🚀 Publikasikan Tugas ke Siswa
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: RIWAYAT & KOREKSI TUGAS */}
      {activeTab === 'koreksi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Tugas & Siswa */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Tugas:</label>
              <select
                value={selectedAssignmentId}
                onChange={(e) => {
                  setSelectedAssignmentId(e.target.value);
                  setSelectedSubId(null);
                }}
                className="w-full text-xs p-2 rounded-lg border border-slate-300"
              >
                {assignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    [{a.type}] {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Daftar Pengumpulan ({currentSubmissions.length}):
              </span>

              {currentSubmissions.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada siswa yang mengumpulkan tugas ini.</p>
              ) : (
                <div className="space-y-2">
                  {currentSubmissions.map((s) => {
                    const isSelected = activeSubmission?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedSubId(s.id);
                          if (s.score) setInputScore(s.score);
                          if (s.teacherFeedback) setInputFeedback(s.teacherFeedback);
                        }}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{s.studentName}</p>
                          <span className="text-[10px] text-slate-400">NIS: {s.studentNis}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.status === 'DINILAI'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.status === 'DINILAI' ? `Nilai: ${s.score}` : 'Belum Dinilai'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Kolom Koreksi: Foto & Input Nilai di bawah foto (PRD 5.4) */}
          <div className="lg:col-span-2">
            {activeSubmission ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{activeSubmission.studentName}</h3>
                    <span className="text-xs text-slate-500">
                      Tugas: {currentAssignment?.title} · Status: {activeSubmission.status}
                    </span>
                  </div>
                  {activeSubmission.submittedAt && (
                    <span className="text-[11px] text-slate-400">
                      Dikumpulkan: {new Date(activeSubmission.submittedAt).toLocaleString('id-ID')}
                    </span>
                  )}
                </div>

                {/* Tampilan Foto Jawaban Fisik Siswa */}
                {activeSubmission.photoAnswerUrl ? (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700 block">
                      📷 Foto Jawaban Fisik Lembar Kerja Siswa (PRD 5.4):
                    </span>
                    <div className="bg-slate-900 rounded-xl overflow-hidden p-2 text-center">
                      <img
                        src={activeSubmission.photoAnswerUrl}
                        alt="Foto Jawaban Siswa"
                        className="max-h-96 mx-auto rounded-lg object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600">
                    <span className="font-bold block mb-1">Catatan Pengumpulan:</span>
                    {activeSubmission.textContent || 'Tidak ada teks/foto langsung.'}
                  </div>
                )}

                {/* Input Nilai di bawah foto (PRD Poin 5.4) */}
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950">
                      Kolom Penilaian Guru (Otomatis Masuk ke Tabel Nilai):
                    </span>
                    <span className="text-xs font-semibold text-indigo-700">Skala 0 - 100</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nilai:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={inputScore}
                        onChange={(e) => setInputScore(Number(e.target.value))}
                        className="w-full text-lg font-black text-center p-2 rounded-lg border border-indigo-300 bg-white"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Catatan / Feedback untuk Siswa:
                      </label>
                      <input
                        type="text"
                        value={inputFeedback}
                        onChange={(e) => setInputFeedback(e.target.value)}
                        placeholder="Catatan koreksi guru..."
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveGrade}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    💾 Simpan Nilai & Sinkronkan Otomatis ke Tabel Nilai Kelas
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400">
                Pilih pengumpulan siswa di sisi kiri untuk mulai memeriksa jawaban.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INPUT ABSENSI KELAS */}
      {activeTab === 'absensi' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Input Absensi Sesi Kelas</h2>
              <p className="text-xs text-slate-500">
                Sesuai PRD Poin 5 (Alur Absensi) & 6.4: Centang kehadiran per jam pelajaran. Bot otomatis melaporkan siswa yang tidak hadir di ≥3 mapel ke BK.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveAttendance} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal:</label>
                <input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Jam Pelajaran Ke-:</label>
                <select
                  value={attPeriod}
                  onChange={(e) => setAttPeriod(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                    <option key={p} value={p}>
                      Jam ke-{p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mata Pelajaran:</label>
                <select
                  value={attSubjectId}
                  onChange={(e) => setAttSubjectId(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kelas:</label>
                <select
                  value={attClassId}
                  onChange={(e) => setAttClassId(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tabel Daftar Siswa untuk Absensi */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                  <tr>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">NISN</th>
                    <th className="p-3 text-center">Status Kehadiran</th>
                    <th className="p-3">Keterangan / Alasan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((student) => {
                    const currentStatus = studentAttMap[student.id]?.status || 'HADIR';
                    const currentReason = studentAttMap[student.id]?.reason || '';

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{student.name}</td>
                        <td className="p-3 font-mono text-slate-500">{student.identifierNumber}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            {(['HADIR', 'DISPEN', 'IZIN', 'SAKIT', 'ALPA'] as AttendanceStatus[]).map((st) => {
                              const isChecked = currentStatus === st;
                              const colors: Record<AttendanceStatus, string> = {
                                HADIR: 'bg-emerald-500 text-white',
                                DISPEN: 'bg-blue-500 text-white',
                                IZIN: 'bg-cyan-500 text-white',
                                SAKIT: 'bg-amber-500 text-white',
                                ALPA: 'bg-rose-600 text-white font-black',
                              };

                              return (
                                <button
                                  type="button"
                                  key={st}
                                  onClick={() => handleAttStatusChange(student.id, st)}
                                  className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                                    isChecked
                                      ? `${colors[st]} shadow-xs`
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {st}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="p-3">
                          {currentStatus !== 'HADIR' ? (
                            <input
                              type="text"
                              value={currentReason}
                              onChange={(e) => handleAttReasonChange(student.id, e.target.value)}
                              placeholder={`Alasan ${currentStatus}...`}
                              className="w-full text-xs p-1.5 rounded border border-rose-200 bg-rose-50/30"
                            />
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-medium">Hadir di kelas</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              💾 Simpan Absensi & Jalankan Bot Evaluasi
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
