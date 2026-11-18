import React from 'react';
import { useApp } from '../../context/AppContext';

export const KepsekDashboardView: React.FC = () => {
  const { users, assignments, submissions, botAlerts } = useApp();

  const students = users.filter((u) => u.role === 'SISWA');
  const deadlineTasks = assignments.filter((a) => a.category === 'TENGGAT');

  // Count how many students have completed all deadline tasks
  const eligibleCount = students.filter((student) => {
    return deadlineTasks.every((task) => {
      const sub = submissions.find(
        (s) => s.assignmentId === task.id && s.studentId === student.id
      );
      return sub && (sub.status === 'DINILAI' || sub.status === 'DIKUMPULKAN');
    });
  }).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🏛️</span>
          <div>
            <h1 className="text-xl font-bold">Dasbor Eksekutif Kepala Sekolah</h1>
            <p className="text-xs text-slate-300">
              Otorisasi Tanda Tangan Elektronik (TTE) & Pengawasan Akademik Terpadu
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Kelayakan Surat Bebas Tugas
          </span>
          <div className="text-3xl font-extrabold text-indigo-600 my-1">
            {eligibleCount} / {students.length} Siswa
          </div>
          <span className="text-[11px] text-slate-500">
            {Math.round((eligibleCount / (students.length || 1)) * 100)}% siswa siap mengikuti ujian semester
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Kasus Absensi Perlu Perhatian
          </span>
          <div className="text-3xl font-extrabold text-rose-600 my-1">
            {botAlerts.filter((a) => a.priority === 'MENDESAK').length} Siswa
          </div>
          <span className="text-[11px] text-slate-500">
            Terdeteksi tidak hadir di ≥3 mapel (sedang diproses BK)
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Status Tanda Tangan Elektronik (TTE)
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 my-1 flex items-center gap-1.5">
            <span>🔒</span> AKTIF & TERVALIDASI
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Sertifikat Digital BSrE/Kominfo Ready
          </span>
        </div>
      </div>

      {/* Kebijakan Sekolah & TTE Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Otorisasi Kebijakan Surat Bebas Tugas (PRD 6.5 & 12.2)
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Dengan mengaktifkan sistem digital ini, Kepala Sekolah memberikan mandat resmi bahwa setiap siswa yang telah menuntaskan seluruh <strong>Tugas Tenggat</strong> di Kiliko.App akan secara otomatis diterbitkan Surat Bebas Tugas Digital ber-QR Code dengan stempel TTE Kepala Sekolah, menggantikan kertas paraf fisik manual yang membebani guru.
        </p>

        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-900 block">
              TTE Kepala Sekolah: Drs. H. Mulyadi, M.Pd. (NIP. 19750812 199903 1 004)
            </span>
            <span className="text-[11px] text-emerald-700">
              Otomatis tersemat pada setiap surat bebas tugas yang diunduh siswa yang berhak.
            </span>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs">
            ✓ Terotorisasi Penuh
          </span>
        </div>
      </div>
    </div>
  );
};
