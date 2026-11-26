import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { checkClearanceEligibility, generateClearanceCertificate } from '../../services/clearanceService';

interface SuratBebasTugasModalProps {
  onClose: () => void;
  onOpenVerificationWithCode: (code: string) => void;
}

export const SuratBebasTugasModal: React.FC<SuratBebasTugasModalProps> = ({
  onClose,
  onOpenVerificationWithCode,
}) => {
  const { currentUser, assignments, submissions } = useApp();

  const eligibility = checkClearanceEligibility(currentUser, assignments, submissions);
  const cert = generateClearanceCertificate(
    currentUser,
    eligibility.isEligible,
    eligibility.pendingDeadlines.length,
    true // signed by principal
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
      >
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="font-bold text-slate-900 text-base">
              Surat Bebas Tugas Digital (Kiliko.App)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {eligibility.isEligible && (
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <span>🖨️ Cetak / Unduh PDF</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {!eligibility.isEligible ? (
          /* Locked / Not yet eligible State */
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-3xl">
              🔒
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Surat Belum Dapat Diterbitkan
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Sesuai Aturan Bisnis Kiliko.App (PRD Poin 7.4), Surat Bebas Tugas Digital hanya diterbitkan bila seluruh <strong>Tugas Tenggat</strong> berstatus tuntas dari semua guru mata pelajaran.
            </p>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 max-w-md mx-auto text-left">
              <span className="text-xs font-bold text-rose-800 block mb-2">
                Daftar Tugas Tenggat yang Belum Tuntas ({eligibility.pendingDeadlines.length}):
              </span>
              <ul className="text-xs space-y-1.5 text-rose-900">
                {eligibility.pendingDeadlines.map((t) => (
                  <li key={t.id} className="flex items-center justify-between bg-white/70 p-2 rounded border border-rose-100">
                    <span className="font-semibold">{t.subjectName}: {t.title}</span>
                    <span className="text-[11px] text-rose-600 font-mono">
                      Batas: {new Date(t.deadline).toLocaleDateString('id-ID')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Tuntaskan Tugas Sekarang
            </button>
          </div>
        ) : (
          /* Official Printable Digital Certificate */
          <div id="printable-certificate" className="border-4 border-double border-slate-300 p-6 sm:p-8 rounded-xl bg-white text-slate-800">
            {/* Kop Surat Sekolah */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                PEMERINTAH DAERAH PROVINSI JAWA BARAT · DINAS PENDIDIKAN
              </h3>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight uppercase mt-0.5">
                SMA NEGERI 1 KILIKO DIGITAL
              </h1>
              <p className="text-[11px] text-slate-500">
                Jl. Pendidikan Karakter No. 88, Gedung EduTech · Website: kiliko.app · NPSN: 20268899
              </p>
            </div>

            {/* Judul Surat */}
            <div className="text-center mb-6">
              <h2 className="text-base font-extrabold underline underline-offset-4 tracking-wide uppercase text-slate-900">
                SURAT KETERANGAN BEBAS TUGAS AKADEMIK
              </h2>
              <span className="text-xs text-slate-500 block mt-1 font-mono">
                Nomor: 421.3/KILIKO-SBT/{cert.verificationCode}/2026
              </span>
            </div>

            {/* Isi Pernyataan */}
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 mb-6">
              <p>
                Kepala SMA Negeri 1 Kiliko Digital dengan ini menerangkan secara sah melalui sistem digital Kiliko.App bahwa:
              </p>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500">Nama Siswa:</span> <strong className="text-slate-900">{cert.studentName}</strong></div>
                <div><span className="text-slate-500">Nomor Induk / NISN:</span> <strong className="text-slate-900">{cert.studentNis}</strong></div>
                <div><span className="text-slate-500">Kelas / Fase:</span> <strong className="text-slate-900">{cert.className}</strong></div>
                <div><span className="text-slate-500">Tahun Ajaran / Sem:</span> <strong className="text-slate-900">{cert.academicYear} (Semester {cert.semester})</strong></div>
              </div>

              <p>
                Telah menyelesaikan dan menuntaskan <strong>seluruh kewajiban tugas tenggat</strong> pada semua mata pelajaran yang dipersyaratkan sekolah. Dokumen ini sah menggantikan lembar paraf penjajakan manual dan menyatakan siswa berhak mengikuti <strong>Penilaian Akhir Semester (PAS)</strong>.
              </p>
            </div>

            {/* Tanda Tangan & QR Code Verifikasi */}
            <div className="grid grid-cols-2 gap-4 items-center pt-4 border-t border-slate-200">
              {/* QR Code Verification Section */}
              <div className="space-y-1.5">
                <div
                  onClick={() => onOpenVerificationWithCode(cert.verificationCode)}
                  className="inline-block p-2 rounded-xl border border-slate-300 bg-slate-50 cursor-pointer hover:border-indigo-500 hover:shadow-xs transition"
                  title="Klik untuk simulasi Scan QR"
                >
                  {/* High Quality Inline SVG QR Code representation */}
                  <svg className="w-20 h-20" viewBox="0 0 100 100" fill="currentColor">
                    <rect width="100" height="100" fill="#f8fafc" />
                    {/* Corner squares */}
                    <rect x="10" y="10" width="24" height="24" fill="#1e293b" />
                    <rect x="14" y="14" width="16" height="16" fill="#f8fafc" />
                    <rect x="18" y="18" width="8" height="8" fill="#4f46e5" />

                    <rect x="66" y="10" width="24" height="24" fill="#1e293b" />
                    <rect x="70" y="14" width="16" height="16" fill="#f8fafc" />
                    <rect x="74" y="18" width="8" height="8" fill="#4f46e5" />

                    <rect x="10" y="66" width="24" height="24" fill="#1e293b" />
                    <rect x="14" y="70" width="16" height="16" fill="#f8fafc" />
                    <rect x="18" y="74" width="8" height="8" fill="#4f46e5" />

                    {/* Data bits */}
                    <rect x="42" y="12" width="6" height="6" fill="#1e293b" />
                    <rect x="52" y="16" width="6" height="6" fill="#1e293b" />
                    <rect x="42" y="26" width="6" height="6" fill="#1e293b" />
                    <rect x="48" y="42" width="8" height="8" fill="#4f46e5" />
                    <rect x="66" y="48" width="6" height="6" fill="#1e293b" />
                    <rect x="78" y="58" width="6" height="6" fill="#1e293b" />
                    <rect x="42" y="68" width="6" height="6" fill="#1e293b" />
                    <rect x="54" y="76" width="6" height="6" fill="#1e293b" />
                    <rect x="72" y="74" width="6" height="6" fill="#1e293b" />
                  </svg>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Kode QR: {cert.verificationCode}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenVerificationWithCode(cert.verificationCode)}
                  className="text-[10px] text-indigo-600 hover:underline font-semibold block"
                >
                  🔗 Buka Halaman Verifikasi Publik
                </button>
              </div>

              {/* Tanda Tangan Elektronik Kepala Sekolah */}
              <div className="text-right space-y-1">
                <p className="text-xs text-slate-600">Diterbitkan di Kiliko, {cert.issuedAt}</p>
                <p className="text-xs font-bold text-slate-800">Kepala SMA Negeri 1 Kiliko Digital</p>

                <div className="my-1.5 inline-block text-left p-2 rounded-lg bg-emerald-50 border border-emerald-300">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                    <span>🔒</span>
                    <span>TERVERIFIKASI TTE</span>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-mono block">
                    {cert.principalSignatureHash}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-extrabold text-slate-900 underline">
                    {cert.principalName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    NIP. {cert.principalNip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
