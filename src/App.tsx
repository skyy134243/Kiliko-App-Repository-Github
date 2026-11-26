import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import { useLenis } from './hooks/useLenis';
import { LoginPage } from './components/auth/LoginPage';
import { SiswaDashboard } from './components/siswa/SiswaDashboard';
import { CanvaDashboardShell, TabItem, QuickCardItem } from './components/common/CanvaDashboardShell';
import { TaskSubmissionModal } from './components/siswa/TaskSubmissionModal';
import { MultipleChoiceQuizModal } from './components/siswa/MultipleChoiceQuizModal';
import { SuratBebasTugasModal } from './components/siswa/SuratBebasTugasModal';
import { GuruDashboardView } from './components/guru/GuruDashboardView';
import { WaliKelasDashboardView } from './components/walikelas/WaliKelasDashboardView';
import { BKDashboardView } from './components/bk/BKDashboardView';
import { TUGradebookView } from './components/tu/TUGradebookView';
import { KepsekDashboardView } from './components/kepsek/KepsekDashboardView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { VerificationView } from './components/public/VerificationView';
import { Assignment } from './types';

export const App: React.FC = () => {
  // Initialize Lenis smooth scroll across the entire application
  useLenis();

  const {
    currentUser,
    isAuthenticated,
    login,
    loginError,
    isLoggingIn,
    logout,
    submissions,
    botAlerts,
    waLogs,
    assignments,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('default');

  // Modals state
  const [quizTask, setQuizTask] = useState<Assignment | null>(null);
  const [submissionTask, setSubmissionTask] = useState<Assignment | null>(null);
  const [isClearanceModalOpen, setIsClearanceModalOpen] = useState(false);

  // QR Verification simulator
  const [isVerifyingPublic, setIsVerifyingPublic] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string>('KLK-20241001-A9Z7X');

  const openVerification = (code?: string) => {
    if (code) setVerificationCode(code);
    setIsClearanceModalOpen(false);
    setIsVerifyingPublic(true);
  };

  // ============ 1. NOT AUTHENTICATED => SHOW LOGIN ============
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} loginError={loginError} isLoading={isLoggingIn} />;
  }

  // ============ 2. SISWA ROLE => CANVA-STYLE SISWA DASHBOARD ============
  if (currentUser.role === 'SISWA') {
    return (
      <>
        <SiswaDashboard
          onStartQuiz={(task) => setQuizTask(task)}
          onSubmitTask={(task) => setSubmissionTask(task)}
          onOpenClearance={() => setIsClearanceModalOpen(true)}
          onLogout={logout}
        />

        <AnimatePresence>
          {submissionTask && (
            <TaskSubmissionModal
              assignment={submissionTask}
              onClose={() => setSubmissionTask(null)}
            />
          )}

          {quizTask && (
            <MultipleChoiceQuizModal
              assignment={quizTask}
              onClose={() => setQuizTask(null)}
            />
          )}

          {isClearanceModalOpen && (
            <SuratBebasTugasModal
              onClose={() => setIsClearanceModalOpen(false)}
              onOpenVerificationWithCode={(code) => openVerification(code)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // QR Verification View override if active
  if (isVerifyingPublic) {
    return (
      <div className="min-h-screen bg-cyan-300 p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-xl">
          <VerificationView
            verificationCode={verificationCode}
            onBack={() => setIsVerifyingPublic(false)}
          />
        </div>
      </div>
    );
  }

  // ============ 3. GURU MAPEL ROLE ============
  if (currentUser.role === 'GURU') {
    const pendingSubs = submissions.filter((s) => s.status === 'DIKUMPULKAN');
    const guruTab = activeTab === 'default' ? 'buat-tugas' : activeTab;

    const tabs: TabItem[] = [
      { key: 'buat-tugas', label: '➕ Buat Tugas' },
      { key: 'koreksi', label: '📑 Koreksi Tugas', badge: pendingSubs.length > 0 ? pendingSubs.length : undefined },
      { key: 'absensi', label: '📅 Input Absensi' },
      { key: 'tabel-nilai', label: '📊 Tabel Nilai' },
    ];

    const recommendations: QuickCardItem[] = [
      {
        id: 'rec-tabel',
        title: 'Tabel Nilai Siswa',
        subtitle: 'Matriks nilai tugas seluruh kelas',
        icon: '📊',
        statusBadge: { label: 'Otomatis', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
        onClick: () => setActiveTab('tabel-nilai'),
      },
      {
        id: 'rec-absensi',
        title: 'Absensi Jam Pelajaran',
        subtitle: 'Input absensi hadir/izin/alpa',
        icon: '📅',
        statusBadge: { label: 'Presensi', color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
        onClick: () => setActiveTab('absensi'),
      },
      {
        id: 'rec-ocr',
        title: 'Extract Soal AI',
        subtitle: 'Buat kuis pilihan ganda otomatis',
        icon: '⚡',
        tag: 'OCR Simulation',
        onClick: () => setActiveTab('buat-tugas'),
      },
    ];

    return (
      <CanvaDashboardShell
        roleBadge="GURU MAPEL"
        userName={currentUser.name}
        userSubtitle="SMAN 1 Kandangan · Guru Mata Pelajaran"
        tabs={tabs}
        activeTab={guruTab}
        onTabChange={(t) => setActiveTab(t)}
        searchPlaceholder="Cari tugas, siswa, atau kelas..."
        bestDealCard={{
          title: 'Koreksi Lembar Jawaban & Kuis Siswa',
          subtitle: `${pendingSubs.length} lembar tugas siswa telah dikumpulkan dan menunggu penilaian guru`,
          teacherOrMeta: 'Fisika & Matematika · SMAN 1 Kandangan',
          actionLabel: 'Periksa Sekarang',
          statusBadge: {
            label: pendingSubs.length > 0 ? `${pendingSubs.length} Menunggu` : 'Semua Tuntas',
            color: pendingSubs.length > 0 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300',
          },
          pdfText: 'LKPD & Tugas Siswa.pdf',
          onClick: () => setActiveTab('koreksi'),
        }}
        recommendations={recommendations}
      >
        <GuruDashboardView
          initialSubTab={
            guruTab === 'tabel-nilai'
              ? 'tabel-nilai'
              : guruTab === 'absensi'
              ? 'absensi'
              : guruTab === 'koreksi'
              ? 'koreksi'
              : 'buat-tugas'
          }
          onSubTabChange={(t) => setActiveTab(t)}
        />
      </CanvaDashboardShell>
    );
  }

  // ============ 4. WALI KELAS ROLE ============
  if (currentUser.role === 'WALI_KELAS') {
    const tabs: TabItem[] = [
      { key: 'monitoring', label: '📋 Dasbor & Pantau Tugas' },
      { key: 'wa-logs', label: '💬 Log WhatsApp Ortu', badge: waLogs.length > 0 ? waLogs.length : undefined },
    ];

    return (
      <CanvaDashboardShell
        roleBadge="WALI KELAS"
        userName={currentUser.name}
        userSubtitle="Wali Kelas X-1 · SMAN 1 Kandangan"
        tabs={tabs}
        activeTab={activeTab === 'default' ? 'monitoring' : activeTab}
        onTabChange={(t) => setActiveTab(t)}
        searchPlaceholder="Cari siswa atau tugas tenggat kelas..."
        bestDealCard={{
          title: 'Pemantauan Tugas Tenggat Wajib Kelas X-1',
          subtitle: 'Pastikan seluruh siswa menuntaskan tugas tenggat sebelum diterbitkan Surat Bebas Tugas Digital',
          teacherOrMeta: 'Wali Kelas X-1 · SMAN 1 Kandangan',
          actionLabel: 'Pantau Kelas',
          statusBadge: { label: 'Perlu Monitoring', color: 'bg-orange-100 text-orange-800 border-orange-300' },
          onClick: () => setActiveTab('monitoring'),
        }}
        recommendations={[
          {
            id: 'rec-wa',
            title: 'Kirim Peringatan WA',
            subtitle: 'Notifikasi otomatis ke orang tua',
            icon: '📱',
            statusBadge: { label: 'WhatsApp Gateway', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
            onClick: () => setActiveTab('wa-logs'),
          },
        ]}
      >
        <WaliKelasDashboardView />
      </CanvaDashboardShell>
    );
  }

  // ============ 5. GURU BK ROLE ============
  if (currentUser.role === 'BK') {
    const urgentCount = botAlerts.filter((a) => a.priority === 'MENDESAK' && a.followUpStatus === 'PENDING').length;
    const pendingCount = botAlerts.filter((a) => a.followUpStatus === 'PENDING').length;

    const tabs: TabItem[] = [
      { key: 'bk-alerts', label: '🛡️ Laporan Bot Absensi', badge: urgentCount > 0 ? urgentCount : undefined },
    ];

    return (
      <CanvaDashboardShell
        roleBadge="GURU BK"
        userName={currentUser.name}
        userSubtitle="Bimbingan & Konseling · Penanganan Kehadiran Siswa"
        tabs={tabs}
        activeTab={activeTab === 'default' ? 'bk-alerts' : activeTab}
        onTabChange={(t) => setActiveTab(t)}
        searchPlaceholder="Cari siswa, kelas, atau kasus absensi..."
        bestDealCard={{
          title: 'Bot Pemantau Absensi Siswa Otomatis',
          subtitle: `${pendingCount} siswa memicu peringatan ketidakhadiran (akumulasi >= 3 sesi atau 1x Alpa)`,
          teacherOrMeta: 'Guru BK: Dra. Ratna Megasari',
          actionLabel: 'Tindak Lanjut',
          statusBadge: {
            label: urgentCount > 0 ? 'Mendesak' : 'Terkontrol',
            color: urgentCount > 0 ? 'bg-red-100 text-red-800 border-red-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300',
          },
          onClick: () => setActiveTab('bk-alerts'),
        }}
      >
        <BKDashboardView />
      </CanvaDashboardShell>
    );
  }

  // ============ 6. TATA USAHA (TU) ROLE ============
  if (currentUser.role === 'TU') {
    const tabs: TabItem[] = [
      { key: 'tu-gradebook', label: '📊 Tabel Nilai & e-Rapor' },
    ];

    return (
      <CanvaDashboardShell
        roleBadge="TATA USAHA"
        userName={currentUser.name}
        userSubtitle="Administrasi Nilai & Kurikulum Merdeka"
        tabs={tabs}
        activeTab={activeTab === 'default' ? 'tu-gradebook' : activeTab}
        onTabChange={(t) => setActiveTab(t)}
        searchPlaceholder="Cari nilai siswa atau mata pelajaran..."
        bestDealCard={{
          title: 'Buku Nilai Digital & e-Rapor Kurikulum Merdeka',
          subtitle: 'Sinkronisasi nilai otomatis dengan Capaian Pembelajaran (TP) untuk seluruh 704 siswa',
          teacherOrMeta: 'Staf Tata Usaha: Hendra Kurniawan',
          actionLabel: 'Buka Buku Nilai',
          statusBadge: { label: 'Tersinkron', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
          onClick: () => setActiveTab('tu-gradebook'),
        }}
      >
        <TUGradebookView />
      </CanvaDashboardShell>
    );
  }

  // ============ 7. KEPALA SEKOLAH ROLE ============
  if (currentUser.role === 'KEPALA_SEKOLAH') {
    const tabs: TabItem[] = [
      { key: 'kepsek', label: '🏛️ Dasbor Kepsek & TTE' },
    ];

    return (
      <CanvaDashboardShell
        roleBadge="KEPALA SEKOLAH"
        userName={currentUser.name}
        userSubtitle="Pimpinan Sekolah SMAN 1 Kandangan"
        tabs={tabs}
        activeTab={activeTab === 'default' ? 'kepsek' : activeTab}
        onTabChange={(t) => setActiveTab(t)}
        searchPlaceholder="Cari berkas surat atau data sekolah..."
        bestDealCard={{
          title: 'Otorisasi Tanda Tangan Elektronik (TTE) Digital',
          subtitle: 'Verifikasi keamanan sertifikat digital Surat Bebas Tugas dengan hashing SHA-256 dan QR Code publik',
          teacherOrMeta: 'Drs. H. Mulyadi, M.Pd · Kepala Sekolah',
          actionLabel: 'Tinjau TTE',
          statusBadge: { label: 'Resmi TTE', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
          onClick: () => setActiveTab('kepsek'),
        }}
      >
        <KepsekDashboardView />
      </CanvaDashboardShell>
    );
  }

  // ============ 8. ADMIN ROLE ============
  return (
    <CanvaDashboardShell
      roleBadge="ADMINISTRATOR"
      userName={currentUser.name}
      userSubtitle="Pengelola Teknis Kiliko.App · Argha PM"
      tabs={[
        { key: 'admin', label: '⚙️ Manajemen Sistem' },
      ]}
      activeTab={activeTab === 'default' ? 'admin' : activeTab}
      onTabChange={(t) => setActiveTab(t)}
      searchPlaceholder="Cari modul atau pengaturan sistem..."
      bestDealCard={{
        title: 'Manajemen Basis Data & Integrasi Sekolah',
        subtitle: '704 siswa aktif (Kelas X & XI), 20 rombel kelas, penilaian e-Rapor & gateway WhatsApp',
        teacherOrMeta: 'Argha (Product Manager & Tech Lead)',
        actionLabel: 'Kelola Sistem',
        statusBadge: { label: 'v1.4 Stabil', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
        onClick: () => setActiveTab('admin'),
      }}
    >
      <AdminDashboardView />
    </CanvaDashboardShell>
  );
};
