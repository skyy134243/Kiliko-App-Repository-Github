import React from 'react';

interface VerificationViewProps {
  verificationCode?: string;
  onBack: () => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  verificationCode = 'KLK-20241001-A9Z7X',
  onBack,
}) => {
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Verification Banner */}
        <div className="bg-emerald-600 p-6 text-white text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
            ✓
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">
            Sistem Verifikasi Kiliko.App Resmi
          </span>
          <h1 className="text-xl font-black mt-1">
            Surat Bebas Tugas Digital Sah & Tervalidasi
          </h1>
        </div>

        {/* Verification Details */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Kode Verifikasi QR:</span>
              <span className="font-mono font-bold text-slate-900">{verificationCode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Nama Siswa:</span>
              <span className="font-bold text-slate-900">Andi Pratama</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">NISN / Identitas:</span>
              <span className="font-mono text-slate-900">20241001</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Kelas:</span>
              <span className="font-bold text-slate-900">X IPA 1</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Semester / Tahun Ajaran:</span>
              <span className="text-slate-900">Ganjil · 2026/2027</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Status Tugas Tenggat:</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                100% Tuntas dari Seluruh Guru Mapel
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Penanda Tangan (TTE):</span>
              <span className="text-slate-900 font-bold">
                Drs. H. Mulyadi, M.Pd. (Kepala Sekolah)
              </span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-800">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <span>🔒</span>
              <span>Integritas Kriptografi Terverifikasi:</span>
            </div>
            <p className="font-mono text-[10px] break-all text-emerald-700">
              SHA256:KILIKO-TTE-98F1A20C-VERIFIED-BSRE-VALID
            </p>
          </div>

          <button
            onClick={onBack}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            ← Kembali ke Platform Kiliko.App
          </button>
        </div>
      </div>
    </div>
  );
};
