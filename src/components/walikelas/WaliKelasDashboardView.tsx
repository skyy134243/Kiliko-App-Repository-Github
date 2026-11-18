import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { createDeadlineReminderWaNotification } from '../../services/whatsappGateway';

export const WaliKelasDashboardView: React.FC = () => {
  const { users, classes, assignments, submissions, botAlerts, waLogs, sendWhatsAppMessage } = useApp();

  const [activeTab, setActiveTab] = useState<'monitoring' | 'wa-logs'>('monitoring');
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-x-1');

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Filter siswa kelas terpilih
  const classStudents = users.filter((u) => u.role === 'SISWA' && u.classId === selectedClassId);
  const deadlineTasks = assignments.filter((a) => a.category === 'TENGGAT' && (!a.classId || a.classId === selectedClassId));

  // Function to send WhatsApp reminder to parent
  const handleSendWaReminder = (studentId: string, taskId: string) => {
    const student = users.find((u) => u.id === studentId);
    const task = assignments.find((a) => a.id === taskId);
    if (!student || !task) return;

    const notif = createDeadlineReminderWaNotification(task, student);
    sendWhatsAppMessage(notif);
    alert(`✓ Pesan Pengingat Tugas Tenggat berhasil dikirimkan via WhatsApp ke ${student.parentName} (${student.parentPhone})!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-2xl shadow-md border border-emerald-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">👩‍🏫</span>
              <h1 className="text-xl font-extrabold tracking-tight">
                Dasbor Wali Kelas — Kelas {selectedClass?.name || 'X-1'}
              </h1>
            </div>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              {selectedClass?.homeroomTeacherName || 'Ibu Sri Wahyuni, M.Pd'} · Memantau rekap ketuntasan tugas tenggat seluruh mapel, absensi harian, dan notifikasi WhatsApp ke orang tua murid SMAN 1 Kandangan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-emerald-950/60 p-2 rounded-xl border border-emerald-600/30">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="text-xs font-bold bg-emerald-900 border border-emerald-700 text-white rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-400"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Kelas {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'monitoring' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-200 hover:text-white'
              }`}
            >
              📊 Pemantauan Siswa
            </button>
            <button
              onClick={() => setActiveTab('wa-logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'wa-logs' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <span>💬 Log WhatsApp Ortu</span>
              <span className="px-1.5 py-0.2 bg-emerald-500 text-[10px] rounded-full text-white font-mono">
                {waLogs.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'monitoring' ? (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Total Siswa Kelas {selectedClass?.name}
              </span>
              <div className="text-3xl font-black text-slate-800 my-1">{classStudents.length} Siswa</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Tahun Ajaran 2026/2027</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Siswa Memiliki Tunggakan Tugas
              </span>
              <div className="text-3xl font-black text-amber-600 my-1">
                {
                  classStudents.filter((s) => {
                    return deadlineTasks.some((t) => {
                      const sub = submissions.find((sub) => sub.assignmentId === t.id && sub.studentId === s.id);
                      return !sub || sub.status === 'BELUM_DIKERJAKAN';
                    });
                  }).length
                }{' '}
                Siswa
              </div>
              <span className="text-[11px] text-slate-500">Perlu pendampingan sebelum ujian semester</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Peringatan Bot Absensi Hari Ini
              </span>
              <div className="text-3xl font-black text-rose-600 my-1">
                {botAlerts.filter((a) => a.studentClass === selectedClass?.name).length} Kasus
              </div>
              <span className="text-[11px] text-rose-600 font-semibold">Tembusan dikirim ke BK & Wali Kelas</span>
            </div>
          </div>

          {/* Tabel Status Siswa Kelas */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Daftar Peserta Didik Kelas {selectedClass?.name} ({classStudents.length} Siswa)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Wali kelas dapat langsung mengirimkan pengingat WhatsApp ke orang tua siswa yang belum menuntaskan tugas.
                </p>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="p-3.5">Nama Siswa</th>
                  <th className="p-3.5">Kontak Orang Tua / Wali</th>
                  <th className="p-3.5 text-center">Tuntas Tugas Tenggat</th>
                  <th className="p-3.5">Tugas Belum Selesai</th>
                  <th className="p-3.5 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((student) => {
                  const pending = deadlineTasks.filter((task) => {
                    const sub = submissions.find((s) => s.assignmentId === task.id && s.studentId === student.id);
                    return !sub || sub.status === 'BELUM_DIKERJAKAN';
                  });

                  const isAllClear = pending.length === 0;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">
                        {student.name}
                        <span className="block text-[10px] text-slate-400 font-mono font-normal">
                          NISN: {student.identifierNumber}
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-700">
                        <span className="font-semibold block">{student.parentName}</span>
                        <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <span>📱</span> {student.parentPhone}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <span
                          className={`font-black px-2.5 py-1 rounded-full text-[11px] ${
                            isAllClear
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isAllClear ? '✓ 100% Tuntas' : `${deadlineTasks.length - pending.length} / ${deadlineTasks.length} Tuntas`}
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-600">
                        {isAllClear ? (
                          <span className="text-emerald-700 font-medium">Bebas Tanggungan (Siap Ujian)</span>
                        ) : (
                          <div className="space-y-1">
                            {pending.map((t) => (
                              <span
                                key={t.id}
                                className="inline-block bg-rose-50 text-rose-700 text-[10px] px-2 py-0.5 rounded border border-rose-200 mr-1"
                              >
                                {t.subjectName}: {t.title}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        {!isAllClear ? (
                          <button
                            onClick={() => handleSendWaReminder(student.id, pending[0]?.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 mx-auto"
                            title="Kirim pesan peringatan tugas ke WA Orang Tua"
                          >
                            <span>💬 Kirim WA Ortu</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAB 2: LOG NOTIFIKASI WHATSAPP */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Riwayat Pengiriman Pesan WhatsApp Otomatis</h2>
              <p className="text-xs text-slate-500">
                Log real-time notifikasi yang dikirimkan oleh Bot Kiliko.App ke nomor WhatsApp orang tua/wali murid SMAN 1 Kandangan.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Gateway Online · WhatsApp Cloud API
            </span>
          </div>

          <div className="space-y-3">
            {waLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      📱 Kepada: {log.recipientName} ({log.recipientPhone})
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-semibold">Siswa: {log.studentName} ({log.className})</span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.sentAt).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px] whitespace-pre-line leading-relaxed shadow-xs">
                  {log.message}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Jenis: <strong>{log.type}</strong></span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span>✓✓</span> Status: {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
