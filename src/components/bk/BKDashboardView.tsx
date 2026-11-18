import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BotAttendanceAlert } from '../../types';

export const BKDashboardView: React.FC = () => {
  const { botAlerts, resolveBotAlert } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<BotAttendanceAlert | null>(botAlerts[0] || null);
  const [actionNotes, setActionNotes] = useState('');

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert) return;
    resolveBotAlert(selectedAlert.id, actionNotes || 'Sudah dipanggil ke ruang BK dan dilakukan pembinaan.');
    alert('✓ Tindak lanjut berhasil dicatat! Status penanganan selesai.');
    setActionNotes('');
  };

  const urgentCount = botAlerts.filter((a) => a.priority === 'MENDESAK' && a.followUpStatus === 'PENDING').length;
  const infoCount = botAlerts.filter((a) => a.priority === 'INFORMASI' && a.followUpStatus === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🤖</span>
              <h1 className="text-xl font-extrabold tracking-tight">
                Dasbor Bot Absensi — Bimbingan Konseling (BK)
              </h1>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Sesuai PRD Poin 4 & 6.4: Bot otomatis mendeteksi siswa yang tidak hadir di 3 mata pelajaran atau lebih dalam satu hari. Alpa ditandai mendesak untuk segera ditindaklanjuti.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-rose-500/20 border border-rose-500/40 px-3.5 py-2 rounded-xl text-center">
              <span className="text-rose-300 text-[10px] font-bold uppercase tracking-wider block">
                Mendesak (Alpa ≥ 3)
              </span>
              <span className="text-2xl font-black text-rose-400">{urgentCount}</span>
            </div>

            <div className="bg-amber-500/20 border border-amber-500/40 px-3.5 py-2 rounded-xl text-center">
              <span className="text-amber-300 text-[10px] font-bold uppercase tracking-wider block">
                Info (Sakit/Izin)
              </span>
              <span className="text-2xl font-black text-amber-300">{infoCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Daftar Alert dari Bot */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center justify-between">
            <span>Daftar Peringatan Otomatis</span>
            <span className="text-xs text-slate-500 font-normal">Total: {botAlerts.length}</span>
          </h2>

          {botAlerts.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
              Tidak ada peringatan absensi saat ini. Semua siswa hadir normal!
            </div>
          ) : (
            <div className="space-y-2.5">
              {botAlerts.map((alert) => {
                const isSelected = selectedAlert?.id === alert.id;
                const isUrgent = alert.priority === 'MENDESAK';
                const isResolved = alert.followUpStatus === 'RESOLVED';

                return (
                  <button
                    key={alert.id}
                    onClick={() => {
                      setSelectedAlert(alert);
                      setActionNotes(alert.bkNotes || '');
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition flex flex-col gap-2 ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-200 bg-white shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isUrgent
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isUrgent && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />}
                        {alert.priority}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isResolved ? '✓ Ditindaklanjuti' : 'Menunggu Tindak Lanjut'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{alert.studentName}</h3>
                      <p className="text-xs text-slate-500">
                        {alert.studentClass} · Tanggal {alert.date}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      Tidak hadir di <strong>{alert.totalAbsences} mapel</strong> (Alpa: {alert.alpaCount})
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Kolom Detail Laporan Bot & Tindak Lanjut BK */}
        <div className="lg:col-span-2">
          {selectedAlert ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        selectedAlert.priority === 'MENDESAK'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      STATUS: {selectedAlert.priority}
                    </span>
                    <span className="text-xs text-slate-400">ID: {selectedAlert.id}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Laporan Ketidakhadiran: {selectedAlert.studentName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Kelas: {selectedAlert.studentClass} · Tanggal Laporan: {selectedAlert.date}
                  </p>
                </div>
              </div>

              {/* Rincian Mata Pelajaran yang ditinggalkan */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Daftar Jam Pelajaran yang Tidak Dihadiri ({selectedAlert.details.length} Mapel):
                </h3>
                <div className="space-y-2">
                  {selectedAlert.details.map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">
                          Jam ke-{d.period}: {d.subjectName}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5 italic">
                          Alasan guru: "{d.reason}"
                        </p>
                      </div>

                      <span
                        className={`font-black px-2.5 py-1 rounded-md text-[10px] ${
                          d.status === 'ALPA'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Tindak Lanjut Guru BK */}
              <form onSubmit={handleResolve} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <span>📝</span>
                    <span>Tindak Lanjut & Konseling Siswa (Guru BK):</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Catat hasil konfirmasi ke orang tua, wali kelas, atau sesi bimbingan tatap muka dengan siswa.
                  </p>
                  <textarea
                    required
                    rows={3}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Contoh: Menghubungi orang tua siswa. Siswa izin urusan keluarga mendadak namun surat tertinggal. Sudah dibuatkan berita acara..."
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {selectedAlert.resolvedAt && (
                  <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    ✓ Sudah ditindaklanjuti oleh <strong>{selectedAlert.resolvedByName}</strong> pada{' '}
                    {new Date(selectedAlert.resolvedAt).toLocaleString('id-ID')}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  ✓ Simpan Catatan & Selesaikan Kasus Penanganan BK
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
              Pilih salah satu laporan bot di sisi kiri untuk melihat rincian kasus.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
