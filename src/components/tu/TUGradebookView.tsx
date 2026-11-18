import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const TUGradebookView: React.FC = () => {
  const { gradebook, classes, subjects } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('ALL');
  const [showRaporModal, setShowRaporModal] = useState<boolean>(false);

  // Filter gradebook
  const filteredRecords = gradebook.filter((entry) => {
    if (selectedClassId && entry.classId !== selectedClassId) return false;
    if (selectedSubjectId !== 'ALL' && entry.subjectId !== selectedSubjectId) return false;
    return true;
  });

  // Calculate stats
  const averageScore =
    filteredRecords.length > 0
      ? Math.round(
          (filteredRecords.reduce((acc, curr) => acc + curr.score, 0) / filteredRecords.length) * 10
        ) / 10
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📊</span>
            <h1 className="text-xl font-bold text-slate-900">
              Tabel Nilai Terpadu — Tata Usaha (TU)
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Sesuai PRD Poin 4 & 5: Nilai dari kuis PG otomatis terisi oleh Bot, dan nilai tugas LKPD manual otomatis tersinkron ke tabel sekolah.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] font-bold text-indigo-700 uppercase block">Rata-Rata Nilai</span>
            <span className="text-2xl font-black text-indigo-900">{averageScore}</span>
          </div>

          <button
            onClick={() => setShowRaporModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
          >
            <span>📑 Format e-Rapor Kurikulum Merdeka</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Pilih Kelas:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Pilih Mata Pelajaran:</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">Semua Mata Pelajaran</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-500 font-medium">
          Ditemukan: <strong className="text-slate-900">{filteredRecords.length}</strong> entri nilai
        </div>
      </div>

      {/* Table Nilai */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
            <tr>
              <th className="p-3.5">NISN</th>
              <th className="p-3.5">Nama Siswa</th>
              <th className="p-3.5">Mata Pelajaran</th>
              <th className="p-3.5">Tugas & Capaian (TP)</th>
              <th className="p-3.5 text-center">Tipe Penilaian</th>
              <th className="p-3.5 text-center">Nilai</th>
              <th className="p-3.5 text-center">Sinkronisasi</th>
              <th className="p-3.5">Waktu Sinkron</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  Belum ada rekaman nilai untuk filter yang dipilih.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60">
                  <td className="p-3.5 font-mono text-slate-500">{rec.studentNis}</td>
                  <td className="p-3.5 font-bold text-slate-900">{rec.studentName}</td>
                  <td className="p-3.5 font-medium text-slate-700">{rec.subjectName}</td>
                  <td className="p-3.5 text-slate-600 max-w-xs">
                    <p className="font-semibold text-slate-800">{rec.assignmentTitle}</p>
                    <span className="text-[10px] text-slate-400 italic block mt-0.5 truncate">
                      {rec.learningObjective || 'TP Kurikulum Merdeka'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rec.assessmentType === 'FORMATIF'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {rec.assessmentType || 'FORMATIF'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`text-sm font-black px-2.5 py-1 rounded-lg ${
                        rec.score >= 85
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.score >= 75
                          ? 'bg-indigo-50 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rec.score}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1 w-max mx-auto">
                      <span>⚡</span> Bot Auto-Sync
                    </span>
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-400 font-mono">
                    {new Date(rec.syncedAt).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Format e-Rapor Kurikulum Merdeka */}
      {showRaporModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  Kemendikbudristek RI Template Ready
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Format Ekspor e-Rapor Kurikulum Merdeka
                </h3>
              </div>
              <button onClick={() => setShowRaporModal(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tabel nilai Kiliko.App telah dipetakan secara otomatis ke kolom <strong>Tujuan Pembelajaran (TP)</strong>, <strong>Asesmen Formatif</strong>, dan <strong>Asesmen Sumatif Lingkup Materi</strong> sesuai standar e-Rapor SMA/SMK Kemendikbudristek.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Sekolah: SMAN 1 Kiliko Digital</span>
                <span>Fase / Kelas: E / X IPA 1</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Semester: 1 (Ganjil) 2026/2027</span>
                <span>Status: Nilai Siap Diimpor ke Aplikasi e-Rapor</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRaporModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert('✓ File "Format_Impor_eRapor_X_IPA_1.xlsx" berhasil diunduh!');
                  setShowRaporModal(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100 flex items-center gap-1.5"
              >
                <span>📥 Unduh Template Excel e-Rapor Resmi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
