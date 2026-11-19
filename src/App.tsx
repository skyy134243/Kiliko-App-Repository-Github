import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { Navbar } from './components/common/Navbar';
import { TugaskuView } from './components/siswa/TugaskuView';
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
  const { currentUser } = useApp();

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Sandbox Role Switcher Bar */}
      <RoleSwitcherBar />

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
            {/* Role SISWA */}
            {currentUser.role === 'SISWA' && (
              <TugaskuView
                onStartQuiz={(task) => setQuizTask(task)}
                onSubmitTask={(task) => setSubmissionTask(task)}
                onOpenClearance={() => setIsClearanceModalOpen(true)}
              />
            )}

            {/* Role GURU MAPEL */}
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

            {/* Role WALI KELAS */}
            {currentUser.role === 'WALI_KELAS' && <WaliKelasDashboardView />}

            {/* Role BK */}
            {currentUser.role === 'BK' && <BKDashboardView />}

            {/* Role TU */}
            {currentUser.role === 'TU' && <TUGradebookView />}

            {/* Role KEPALA SEKOLAH */}
            {currentUser.role === 'KEPALA_SEKOLAH' && <KepsekDashboardView />}

            {/* Role ADMIN */}
            {currentUser.role === 'ADMIN' && <AdminDashboardView />}
          </>
        )}
      </main>

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
