import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const TUGradebookView: React.FC = () => {
  const { gradebook, classes, subjects, users } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('ALL');

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

  const handleExportSim = () => {
    alert('✓ File Rekap Nilai Kiliko.xlsx siap diunduh untuk integrasi e-Rapor sekolah!');
  };

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
            onClick={handleExportSim}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
          >
            <span>📥 Export ke Excel / e-Rapor</span>
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
              <th className="p-3.5">Tugas</th>
              <th className="p-3.5 text-center">Kategori</th>
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
                  <td className="p-3.5 text-slate-600 max-w-xs truncate">{rec.assignmentTitle}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rec.taskCategory === 'TENGGAT'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rec.taskCategory}
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
    </div>
  );
};
