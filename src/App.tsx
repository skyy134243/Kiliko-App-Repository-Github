import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { SiswaDashboard } from './components/siswa/SiswaDashboard';
import { Navbar } from './components/common/Navbar';
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
  const { currentUser, isAuthenticated, login, loginError, isLoggingIn, logout } = useApp();

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

  // ============ NOT AUTHENTICATED => SHOW LOGIN ============
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} loginError={loginError} isLoading={isLoggingIn} />;
  }

  // ============ SISWA ROLE => CUSTOM CANVA-STYLE DASHBOARD ============
  if (currentUser.role === 'SISWA') {
    return (
      <>
        <SiswaDashboard
          onStartQuiz={(task) => setQuizTask(task)}
          onSubmitTask={(task) => setSubmissionTask(task)}
          onOpenClearance={() => setIsClearanceModalOpen(true)}
          onLogout={logout}
        />

        {/* Modals */}
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
      </>
    );
  }

  // ============ STAFF/NON-SISWA ROLES => STANDARD LAYOUT ============
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Compact Role Info Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              {currentUser.role === 'GURU' && '👩‍🏫 Guru Mapel'}
              {currentUser.role === 'WALI_KELAS' && '📋 Wali Kelas'}
              {currentUser.role === 'BK' && '🛡️ Guru BK'}
              {currentUser.role === 'TU' && '📊 Tata Usaha'}
              {currentUser.role === 'KEPALA_SEKOLAH' && '🏛️ Kepala Sekolah'}
              {currentUser.role === 'ADMIN' && '⚙️ Administrator'}
            </span>
            <span className="text-xs text-slate-300">{currentUser.name}</span>
          </div>
          <button
            onClick={logout}
            className="text-xs text-slate-400 hover:text-red-300 transition flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsVerifyingPublic(false);
          setActiveTab(tab);
        }}
        onOpenClearanceModal={() => setIsClearanceModalOpen(true)}
        onOpenVerification={() => openVerification()}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isVerifyingPublic ? (
          <VerificationView
            verificationCode={verificationCode}
            onBack={() => setIsVerifyingPublic(false)}
          />
        ) : (
          <>
            {currentUser.role === 'GURU' && (
              <GuruDashboardView
                initialSubTab={
                  activeTab === 'tabel-nilai'
                    ? 'tabel-nilai'
                    : activeTab === 'absensi'
                    ? 'absensi'
                    : activeTab === 'koreksi'
                    ? 'koreksi'
                    : 'buat-tugas'
                }
              />
            )}

            {currentUser.role === 'WALI_KELAS' && <WaliKelasDashboardView />}
            {currentUser.role === 'BK' && <BKDashboardView />}
            {currentUser.role === 'TU' && <TUGradebookView />}
            {currentUser.role === 'KEPALA_SEKOLAH' && <KepsekDashboardView />}
            {currentUser.role === 'ADMIN' && <AdminDashboardView />}
          </>
        )}
      </main>

      {/* Modals */}
      {isClearanceModalOpen && (
        <SuratBebasTugasModal
          onClose={() => setIsClearanceModalOpen(false)}
          onOpenVerificationWithCode={(code) => openVerification(code)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Kiliko.App</strong> · Platform Digital Tugas, Absensi, dan Nilai Sekolah
          </span>
          <span className="text-slate-400">
            Disusun oleh Argha (Product Manager) · Versi 1.1 EduTech Enhancement
          </span>
        </div>
      </footer>
    </div>
  );
};
