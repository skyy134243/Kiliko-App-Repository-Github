import React from 'react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenClearanceModal?: () => void;
  onOpenVerification?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenClearanceModal,
  onOpenVerification,
}) => {
  const { currentUser, botAlerts, waLogs } = useApp();

  const pendingAlertsCount = botAlerts.filter((a) => a.followUpStatus === 'PENDING').length;
  const urgentAlertsCount = botAlerts.filter((a) => a.priority === 'MENDESAK' && a.followUpStatus === 'PENDING').length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-100">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Kiliko<span className="text-indigo-600">.App</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase">
                v1.1 EduTech
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Tugas, Absensi & Nilai Sekolah
            </p>
          </div>
        </div>

        {/* Dynamic Navigation according to Role */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {currentUser.role === 'SISWA' && (
            <>
              <button
                onClick={() => setActiveTab('tugasku')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'tugasku'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Tugasku
              </button>
              <button
                onClick={() => onOpenClearanceModal && onOpenClearanceModal()}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1.5"
              >
                <span>📜</span>
                <span>Surat Bebas Tugas</span>
              </button>
            </>
          )}

          {currentUser.role === 'GURU' && (
            <>
              <button
                onClick={() => setActiveTab('buat-tugas')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'buat-tugas'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                + Buat Tugas
              </button>
              <button
                onClick={() => setActiveTab('koreksi')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'koreksi'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Riwayat & Koreksi
              </button>
              <button
                onClick={() => setActiveTab('absensi')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'absensi'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Isi Absensi
              </button>
              <button
                onClick={() => setActiveTab('tabel-nilai')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeTab === 'tabel-nilai'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                📊 Tabel Nilai
              </button>
            </>
          )}

          {currentUser.role === 'WALI_KELAS' && (
            <button
              onClick={() => setActiveTab('walikelas')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'walikelas'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>📋 Dasbor Kelas X IPA 1</span>
              {waLogs.length > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full font-bold bg-emerald-600 text-white">
                  {waLogs.length} WA
                </span>
              )}
            </button>
          )}

          {currentUser.role === 'BK' && (
            <button
              onClick={() => setActiveTab('bk-alerts')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'bk-alerts'
                  ? 'bg-rose-50 text-rose-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Laporan Bot Absensi</span>
              {pendingAlertsCount > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full font-bold text-white ${urgentAlertsCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-500'}`}>
                  {pendingAlertsCount}
                </span>
              )}
            </button>
          )}

          {currentUser.role === 'TU' && (
            <button
              onClick={() => setActiveTab('tu-gradebook')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'tu-gradebook'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tabel Nilai & e-Rapor
            </button>
          )}

          {currentUser.role === 'KEPALA_SEKOLAH' && (
            <button
              onClick={() => setActiveTab('kepsek')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'kepsek'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Dasbor Kepsek & TTE
            </button>
          )}

          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'admin'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Manajemen Sistem
            </button>
          )}

          <button
            onClick={() => onOpenVerification && onOpenVerification()}
            title="Uji Halaman Verifikasi QR Code Publik"
            className="text-xs text-slate-500 hover:text-indigo-600 font-medium px-2 py-1 rounded border border-dashed border-slate-300 ml-2"
          >
            🔍 Tes Scan QR
          </button>
        </nav>
      </div>
    </header>
  );
};
