import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, Submission } from '../../types';
import { checkClearanceEligibility } from '../../services/clearanceService';

interface TugaskuViewProps {
  onStartQuiz: (assignment: Assignment) => void;
  onSubmitTask: (assignment: Assignment) => void;
  onOpenClearance: () => void;
}

export const TugaskuView: React.FC<TugaskuViewProps> = ({
  onStartQuiz,
  onSubmitTask,
  onOpenClearance,
}) => {
  const { currentUser, assignments, submissions } = useApp();
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'BELUM' | 'MENUNGGU' | 'DINILAI'>('ALL');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'TENGGAT' | 'BIASA'>('ALL');

  // Filter tugas untuk kelas siswa saat ini
  const myClassAssignments = assignments.filter(
    (a) => !currentUser.classId || a.classId === currentUser.classId
  );

  // Clearance status
  const clearanceStatus = checkClearanceEligibility(currentUser, assignments, submissions);

  // Get submission for assignment
  const getSub = (assignmentId: string): Submission | undefined => {
    return submissions.find(
      (s) => s.assignmentId === assignmentId && s.studentId === currentUser.id
    );
  };

  const filteredTasks = myClassAssignments.filter((task) => {
    const sub = getSub(task.id);
    const status = sub ? sub.status : 'BELUM_DIKERJAKAN';

    if (filterCategory !== 'ALL' && task.category !== filterCategory) return false;

    if (filterStatus === 'BELUM' && status !== 'BELUM_DIKERJAKAN') return false;
    if (filterStatus === 'MENUNGGU' && status !== 'DIKUMPULKAN') return false;
    if (filterStatus === 'DINILAI' && status !== 'DINILAI') return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner Surat Bebas Tugas Progress */}
      <div className={`p-5 rounded-2xl border shadow-xs transition ${
        clearanceStatus.isEligible
          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400'
          : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📜</span>
              <h2 className={`text-lg font-bold ${clearanceStatus.isEligible ? 'text-white' : 'text-slate-900'}`}>
                Status Surat Bebas Tugas Digital (Semester 1)
              </h2>
            </div>
            <p className={`text-sm ${clearanceStatus.isEligible ? 'text-emerald-100' : 'text-slate-600'}`}>
              {clearanceStatus.isEligible
                ? 'Selamat! Seluruh Tugas Tenggat Anda telah TUNTAS. Anda berhak mengunduh Surat Bebas Tugas Digital.'
                : `Masih ada ${clearanceStatus.pendingDeadlines.length} Tugas Tenggat wajib yang belum selesai sebelum surat bebas tugas dapat diterbitkan.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`text-right text-xs ${clearanceStatus.isEligible ? 'text-emerald-100' : 'text-slate-500'}`}>
              <span className="font-bold text-base block text-white">
                {clearanceStatus.completedDeadlines} / {clearanceStatus.totalDeadlines}
              </span>
              Tugas Tenggat Tuntas
            </div>

            <button
              onClick={onOpenClearance}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 ${
                clearanceStatus.isEligible
                  ? 'bg-white text-emerald-700 hover:bg-emerald-50'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              <span>{clearanceStatus.isEligible ? 'Unduh Surat Bebas Tugas' : 'Cek Status Penjajakan'}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Dasbor Tugasku</h1>
          <p className="text-xs text-slate-500">
            Kelas {currentUser.className || 'X IPA 1'} · Pantau tenggat, kumpulkan tugas, dan cek nilai otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 rounded-md transition ${filterStatus === 'ALL' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'}`}
            >
              Semua ({myClassAssignments.length})
            </button>
            <button
              onClick={() => setFilterStatus('BELUM')}
              className={`px-3 py-1 rounded-md transition ${filterStatus === 'BELUM' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'}`}
            >
              Belum
            </button>
            <button
              onClick={() => setFilterStatus('MENUNGGU')}
              className={`px-3 py-1 rounded-md transition ${filterStatus === 'MENUNGGU' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600'}`}
            >
              Terkirim
            </button>
            <button
              onClick={() => setFilterStatus('DINILAI')}
              className={`px-3 py-1 rounded-md transition ${filterStatus === 'DINILAI' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'}`}
            >
              Dinilai
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="text-xs font-semibold bg-slate-100 border-none rounded-lg px-2.5 py-1.5 text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="TENGGAT">🔴 Tugas Tenggat (Wajib)</option>
            <option value="BIASA">⚪ Tugas Biasa</option>
          </select>
        </div>
      </div>

      {/* Grid List Tugas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-4xl mb-2">🎉</p>
            <h3 className="text-base font-bold text-slate-800">Tidak ada tugas pada filter ini</h3>
            <p className="text-xs text-slate-500 mt-1">
              Coba ganti filter status atau kategori tugas di bagian atas.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const sub = getSub(task.id);
            const status = sub ? sub.status : 'BELUM_DIKERJAKAN';
            const isDeadlineMandatory = task.category === 'TENGGAT';

            const typeBadges: Record<string, { label: string; color: string; icon: string }> = {
              LKPD_ESAI: { label: 'LKPD / Foto Jawaban', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '📝' },
              PILIHAN_GANDA: { label: 'Pilihan Ganda (Auto)', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '⚡' },
              PRAKTIKUM: { label: 'Praktikum', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🔬' },
              KELOMPOK: { label: 'Tugas Kelompok', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '👥' },
            };

            const typeInfo = typeBadges[task.type] || { label: task.type, color: 'bg-slate-50 text-slate-700', icon: '📌' };

            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Header badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                      {task.subjectName}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isDeadlineMandatory ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                          Tugas Tenggat
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Tugas Biasa
                        </span>
                      )}

                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${typeInfo.color}`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Info Guru & Deadline */}
                  <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 mb-4 border border-slate-100">
                    <div className="flex justify-between text-slate-500">
                      <span>Guru Pengampu:</span>
                      <span className="font-semibold text-slate-700">{task.teacherName}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Batas Tenggat:</span>
                      <span className="font-semibold text-rose-600">
                        {new Date(task.deadline).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Graded Feedback or Submission preview if available */}
                  {sub && sub.status === 'DINILAI' && (
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <span>✓</span> Sudah Dinilai & Masuk Tabel Nilai
                        </span>
                        <span className="text-lg font-black text-emerald-700">
                          {sub.score}/100
                        </span>
                      </div>
                      {sub.teacherFeedback && (
                        <p className="text-emerald-900 italic mt-1 bg-white/70 p-2 rounded-lg border border-emerald-100">
                          "{sub.teacherFeedback}"
                        </p>
                      )}
                    </div>
                  )}

                  {sub && sub.status === 'DIKUMPULKAN' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-800 flex items-center justify-between mb-4">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span>⏳</span> Menunggu pemeriksaan guru
                      </span>
                      <span className="text-[11px] text-amber-700">
                        {new Date(sub.submittedAt || '').toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="pt-2 border-t border-slate-100">
                  {task.type === 'PILIHAN_GANDA' ? (
                    <button
                      onClick={() => onStartQuiz(task)}
                      disabled={status === 'DINILAI'}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 ${
                        status === 'DINILAI'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100'
                      }`}
                    >
                      <span>⚡</span>
                      <span>{status === 'DINILAI' ? 'Kuis Selesai (Skor Tersimpan)' : 'Kerjakan Kuis Pilihan Ganda'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSubmitTask(task)}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 ${
                        status === 'DINILAI'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : status === 'DIKUMPULKAN'
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                      }`}
                    >
                      <span>{status === 'BELUM_DIKERJAKAN' ? '📤' : '👁️'}</span>
                      <span>
                        {status === 'BELUM_DIKERJAKAN'
                          ? task.type === 'LKPD_ESAI'
                            ? 'Unggah Foto Jawaban LKPD'
                            : task.type === 'KELOMPOK'
                            ? 'Kumpulkan Tugas Kelompok'
                            : 'Unggah Laporan Praktikum'
                          : 'Lihat / Ubah Pengumpulan'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
