import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, Submission } from '../../types';
import { checkClearanceEligibility } from '../../services/clearanceService';

interface SiswaDashboardProps {
  onStartQuiz: (assignment: Assignment) => void;
  onSubmitTask: (assignment: Assignment) => void;
  onOpenClearance: () => void;
  onLogout: () => void;
}

type SiswaTab = 'tugas' | 'riwayat' | 'suratku' | 'akun';

export const SiswaDashboard: React.FC<SiswaDashboardProps> = ({
  onStartQuiz,
  onSubmitTask,
  onOpenClearance,
  onLogout,
}) => {
  const { currentUser, assignments, submissions } = useApp();
  const [activeTab, setActiveTab] = useState<SiswaTab>('tugas');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tugas untuk kelas siswa saat ini
  const myClassAssignments = assignments.filter(
    (a) => !currentUser.classId || a.classId === currentUser.classId
  );

  const getSub = (assignmentId: string): Submission | undefined => {
    return submissions.find(
      (s) => s.assignmentId === assignmentId && s.studentId === currentUser.id
    );
  };

  // Clearance
  const clearanceStatus = checkClearanceEligibility(currentUser, assignments, submissions);

  // Separate tasks
  const unfinishedTasks = myClassAssignments.filter((t) => {
    const sub = getSub(t.id);
    return !sub || sub.status === 'BELUM_DIKERJAKAN';
  });

  const completedTasks = myClassAssignments.filter((t) => {
    const sub = getSub(t.id);
    return sub && (sub.status === 'DINILAI' || sub.status === 'DIKUMPULKAN');
  });

  // Search filter
  const filterBySearch = (tasks: Assignment[]) => {
    if (!searchQuery) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subjectName.toLowerCase().includes(q) ||
        t.teacherName.toLowerCase().includes(q)
    );
  };

  const getStatusBadge = (task: Assignment) => {
    const sub = getSub(task.id);
    if (!sub || sub.status === 'BELUM_DIKERJAKAN') {
      return { label: 'Belum Tuntas', color: 'bg-orange-100 text-orange-700 border-orange-300' };
    }
    if (sub.status === 'DIKUMPULKAN') {
      return { label: 'Menunggu', color: 'bg-amber-100 text-amber-700 border-amber-300' };
    }
    if (sub.status === 'DINILAI') {
      return { label: 'Tuntas', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' };
    }
    return { label: 'Remedial', color: 'bg-rose-100 text-rose-700 border-rose-300' };
  };

  const tabs: { key: SiswaTab; label: string }[] = [
    { key: 'tugas', label: 'Tugas' },
    { key: 'riwayat', label: 'Riwayat Tugas' },
    { key: 'suratku', label: 'Suratku' },
    { key: 'akun', label: 'Akun ku' },
  ];

  return (
    <div className="min-h-screen bg-cyan-300">
      {/* ===== HEADER ===== */}
      <div className="bg-cyan-300 px-4 pt-6 pb-4 md:px-8 md:pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-cyan-800/70 tracking-wider uppercase">
                {currentUser.className || 'Siswa'}
              </p>
              <h1 className="text-lg md:text-xl font-black text-slate-900 leading-tight mt-0.5">
                {currentUser.name}
              </h1>
              <p className="text-xs text-cyan-800/60 mt-0.5">
                SMAN 1 Kandangan
              </p>
            </div>
            <button className="relative w-10 h-10 rounded-full bg-white/50 flex items-center justify-center hover:bg-white/80 transition">
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-cyan-300" />
            </button>
          </div>
        </div>
      </div>

      {/* ===== SEARCH BAR ===== */}
      <div className="bg-cyan-300 px-4 pb-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-sm text-slate-700 placeholder:text-slate-400 border-none focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-slate-50 transition">
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ===== TAB NAVIGATION ===== */}
      <div className="bg-cyan-300 px-4 pb-2 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-700/20'
                    : 'text-cyan-800/70 hover:bg-white/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="bg-white rounded-t-3xl min-h-[60vh] mt-2 px-4 py-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          {/* TAB: TUGAS */}
          {activeTab === 'tugas' && (
            <div className="space-y-6">
              {/* Best Deal Section - Featured Task */}
              {filterBySearch(unfinishedTasks).length > 0 && (
                <>
                  <h2 className="text-lg font-black text-slate-900">Best Deal</h2>
                  {/* Featured card (first unfinished task) */}
                  {(() => {
                    const featured = filterBySearch(unfinishedTasks)[0];
                    const badge = getStatusBadge(featured);
                    return (
                      <div
                        className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                        onClick={() =>
                          featured.type === 'PILIHAN_GANDA'
                            ? onStartQuiz(featured)
                            : onSubmitTask(featured)
                        }
                      >
                        <div className="flex">
                          <div className="flex-1 p-4">
                            <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                              {featured.title}
                            </h3>
                            <p className="text-xs text-slate-500 mb-0.5">{featured.subjectName}</p>
                            <p className="text-xs font-semibold text-slate-600 italic">
                              {featured.teacherName}
                            </p>
                            {featured.attachmentUrl && (
                              <div className="mt-3 flex items-center gap-1.5 text-xs text-cyan-700 bg-cyan-50 rounded-lg px-2.5 py-1.5 w-fit border border-cyan-200">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">{featured.title.split(':')[0]}.pdf</span>
                              </div>
                            )}
                          </div>
                          <div className="w-32 bg-slate-100 flex flex-col items-center justify-center p-3 gap-2 border-l border-slate-200">
                            <div className="w-full h-16 bg-slate-200/70 rounded-lg flex items-center justify-center">
                              <p className="text-[10px] text-slate-500 text-center font-medium leading-tight px-1">
                                Upload Jawaban Tugas
                              </p>
                            </div>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.color}`}>
                              {badge.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}

              {/* Recommendation Section */}
              {filterBySearch(unfinishedTasks).length > 1 && (
                <>
                  <h2 className="text-lg font-black text-slate-900 mt-6">Recommendation</h2>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                    {filterBySearch(unfinishedTasks)
                      .slice(1)
                      .map((task) => {
                        const badge = getStatusBadge(task);
                        return (
                          <div
                            key={task.id}
                            onClick={() =>
                              task.type === 'PILIHAN_GANDA' ? onStartQuiz(task) : onSubmitTask(task)
                            }
                            className="min-w-[180px] max-w-[200px] bg-cyan-50 rounded-2xl p-3 border border-cyan-200 shadow-sm cursor-pointer hover:shadow-md transition snap-start flex-shrink-0"
                          >
                            <div className="w-full h-14 bg-cyan-100/70 rounded-lg flex items-center justify-center mb-2">
                              <p className="text-[10px] text-cyan-600 text-center font-medium leading-tight px-2">
                                {task.attachmentUrl
                                  ? `${task.title.split(':')[0]}.pdf`
                                  : 'Upload Jawaban Tugas'}
                              </p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-2 ${badge.color}`}>
                              {badge.label}
                            </span>
                            <h4 className="text-xs font-bold text-slate-800 leading-tight mb-0.5">
                              {task.title.length > 40 ? task.title.slice(0, 40) + '...' : task.title}
                            </h4>
                            <p className="text-[10px] text-slate-500">{task.subjectName}</p>
                            <p className="text-[10px] font-semibold text-slate-600 italic">
                              {task.teacherName}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}

              {/* All Tasks List (desktop view enhancement) */}
              <div className="hidden md:block mt-8">
                <h2 className="text-lg font-black text-slate-900 mb-4">Semua Tugas</h2>
                <div className="grid grid-cols-2 gap-4">
                  {filterBySearch(myClassAssignments).map((task) => {
                    const sub = getSub(task.id);
                    const badge = getStatusBadge(task);
                    return (
                      <div
                        key={task.id}
                        className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                        onClick={() =>
                          task.type === 'PILIHAN_GANDA' ? onStartQuiz(task) : onSubmitTask(task)
                        }
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            {task.subjectName}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">{task.title}</h3>
                        <p className="text-xs text-slate-500 italic">{task.teacherName}</p>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                          <span className="text-[10px] text-slate-400">
                            Deadline: {new Date(task.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                          {sub && sub.score !== undefined && (
                            <span className="text-xs font-black text-emerald-600">{sub.score}/100</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Empty state */}
              {filterBySearch(unfinishedTasks).length === 0 && (
                <div className="text-center py-12">
                  <span className="text-5xl mb-4 block">🎉</span>
                  <h3 className="text-base font-bold text-slate-800">Semua tugas sudah dikerjakan!</h3>
                  <p className="text-xs text-slate-500 mt-1">Tidak ada tugas yang menunggu untuk kelas Anda.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: RIWAYAT TUGAS */}
          {activeTab === 'riwayat' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900">Riwayat Tugas</h2>
              {completedTasks.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl mb-4 block">📭</span>
                  <h3 className="text-base font-bold text-slate-800">Belum ada riwayat</h3>
                  <p className="text-xs text-slate-500 mt-1">Tugas yang sudah dikumpulkan atau dinilai akan muncul di sini.</p>
                </div>
              ) : (
                filterBySearch(completedTasks).map((task) => {
                  const sub = getSub(task.id)!;
                  const badge = getStatusBadge(task);
                  return (
                    <div
                      key={task.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{task.title}</h3>
                          <p className="text-xs text-slate-500">{task.subjectName} · {task.teacherName}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      {sub.score !== undefined && (
                        <div className="bg-emerald-50 rounded-xl p-3 mt-2 border border-emerald-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-800">Nilai</span>
                            <span className="text-lg font-black text-emerald-700">{sub.score}/100</span>
                          </div>
                          {sub.teacherFeedback && (
                            <p className="text-[11px] text-emerald-700 italic mt-1 bg-white/50 p-2 rounded-lg">
                              "{sub.teacherFeedback}"
                            </p>
                          )}
                        </div>
                      )}
                      {sub.status === 'DIKUMPULKAN' && (
                        <div className="bg-amber-50 rounded-xl p-2.5 mt-2 border border-amber-200 flex items-center gap-2">
                          <span className="text-sm">⏳</span>
                          <span className="text-xs text-amber-700 font-medium">Menunggu pemeriksaan guru</span>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-400 mt-2">
                        Dikumpulkan: {new Date(sub.submittedAt || '').toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB: SURATKU */}
          {activeTab === 'suratku' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900">Surat Bebas Tugas Digital</h2>
              <div className={`p-5 rounded-2xl border shadow-sm ${
                clearanceStatus.isEligible
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{clearanceStatus.isEligible ? '✅' : '📋'}</span>
                  <div className="flex-1">
                    <h3 className={`font-bold text-sm ${clearanceStatus.isEligible ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {clearanceStatus.isEligible
                        ? 'Selamat! Anda berhak mendapatkan Surat Bebas Tugas'
                        : 'Surat Bebas Tugas belum bisa diterbitkan'
                      }
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {clearanceStatus.isEligible
                        ? 'Semua tugas tenggat telah diselesaikan. Anda dapat mengunduh surat bebas tugas digital.'
                        : `Masih ada ${clearanceStatus.pendingDeadlines.length} tugas tenggat wajib yang belum selesai.`
                      }
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="text-center">
                        <span className="text-xl font-black text-cyan-700">{clearanceStatus.completedDeadlines}</span>
                        <p className="text-[10px] text-slate-500">Tuntas</p>
                      </div>
                      <div className="text-center">
                        <span className="text-xl font-black text-slate-400">/</span>
                      </div>
                      <div className="text-center">
                        <span className="text-xl font-black text-slate-700">{clearanceStatus.totalDeadlines}</span>
                        <p className="text-[10px] text-slate-500">Total Tenggat</p>
                      </div>
                    </div>
                    <button
                      onClick={onOpenClearance}
                      className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 ${
                        clearanceStatus.isEligible
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-amber-600 text-white hover:bg-amber-700'
                      }`}
                    >
                      <span>{clearanceStatus.isEligible ? '📄 Unduh Surat Bebas Tugas' : '🔍 Cek Status Penjajakan'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AKUN KU */}
          {activeTab === 'akun' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900">Profil Akun</h2>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-500/20">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{currentUser.name}</h3>
                    <p className="text-xs text-slate-500">Kelas {currentUser.className}</p>
                  </div>
                </div>

                {/* Info rows */}
                <div className="space-y-3">
                  {[
                    { label: 'Status', value: 'Siswa Aktif', icon: '🎓' },
                    { label: 'Kelas', value: currentUser.className || '-', icon: '🏫' },
                    { label: 'Email', value: currentUser.email, icon: '✉️' },
                    { label: 'Nama Orang Tua', value: currentUser.parentName || '-', icon: '👤' },
                    { label: 'No. HP Orang Tua', value: currentUser.parentPhone || '-', icon: '📱' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-xs text-slate-500">{item.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-800 text-right max-w-[55%] truncate">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="w-full py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-bold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Keluar Akun</span>
              </button>

              {/* App version */}
              <p className="text-center text-[10px] text-slate-400 mt-4">
                Kiliko.App v1.1 EduTech · SMAN 1 Kandangan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
