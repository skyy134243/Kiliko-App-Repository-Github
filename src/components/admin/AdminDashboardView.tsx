import React from 'react';
import { useApp } from '../../context/AppContext';

export const AdminDashboardView: React.FC = () => {
  const { users, classes, subjects, assignments, submissions, attendance, resetAllData } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⚙️</span>
            <h1 className="text-xl font-bold text-slate-900">
              Pengelola Teknis Platform — Dasbor Admin (Argha)
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Sesuai PRD Poin 4: Memastikan sistem berjalan tanpa gangguan dan arsitektur database terjaga integritasnya.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mereset seluruh database simulasi ke kondisi awal PRD?')) {
              resetAllData();
            }
          }}
          className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition"
        >
          🔄 Reset Database Sandbox ke Default
        </button>
      </div>

      {/* System Telemetry & Entity Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Pengguna</span>
          <span className="text-xl font-black text-slate-800">{users.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Kelas</span>
          <span className="text-xl font-black text-slate-800">{classes.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Mata Pelajaran</span>
          <span className="text-xl font-black text-slate-800">{subjects.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Tugas Dibuat</span>
          <span className="text-xl font-black text-slate-800">{assignments.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Pengumpulan</span>
          <span className="text-xl font-black text-slate-800">{submissions.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Log Absensi</span>
          <span className="text-xl font-black text-slate-800">{attendance.length}</span>
        </div>
      </div>

      {/* PRD Roadmap & Milestone Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Status Tahapan Pengembangan (PRD Poin 9)
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              ✓
            </span>
            <div className="text-xs">
              <strong className="text-emerald-950 font-bold block">
                Tahap 1 (Inti): Fondasi Lengkap Telah Dibangun
              </strong>
              <p className="text-emerald-800 mt-0.5">
                Login per peran (Siswa, Guru, BK, TU, Kepsek, Admin), Buat Tugas (4 tipe), Unggah foto lembar jawaban fisik LKPD, Penilaian guru, Dasbor Tugasku, Absensi per jam pelajaran, serta Bot otomatis pendeteksi ketidakhadiran harian.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              ✓
            </span>
            <div className="text-xs">
              <strong className="text-emerald-950 font-bold block">
                Tahap 2: Tugas Pilihan Ganda AI & Kolektif
              </strong>
              <p className="text-emerald-800 mt-0.5">
                Simulasi OCR AI dari foto buku, Aturan bisnis penguncian kunci jawaban sebelum publish, Auto-grade kuis instan, dan penyeragaman nilai pada tugas kelompok per folder.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              ✓
            </span>
            <div className="text-xs">
              <strong className="text-emerald-950 font-bold block">
                Tahap 3: Surat Bebas Tugas Digital & TTE Kepala Sekolah
              </strong>
              <p className="text-emerald-800 mt-0.5">
                Pengecekan kelayakan otomatis seluruh tugas tenggat, template kop surat resmi cetak/PDF, QR Code verifikasi publik, serta enkripsi stempel TTE Kepala Sekolah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
