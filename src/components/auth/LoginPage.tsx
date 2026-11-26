import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

interface LoginPageProps {
  onLogin: (name: string, npsn: string) => void;
  loginError: string | null;
  isLoading: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, loginError, isLoading }) => {
  const [name, setName] = useState('');
  const [npsn, setNpsn] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const bubble1Ref = useRef<HTMLDivElement>(null);
  const bubble2Ref = useRef<HTMLDivElement>(null);
  const bubble3Ref = useRef<HTMLDivElement>(null);

  // GSAP: Smooth ambient floating background bubbles
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bubble1Ref.current) {
        gsap.to(bubble1Ref.current, {
          y: -25,
          x: 15,
          scale: 1.08,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (bubble2Ref.current) {
        gsap.to(bubble2Ref.current, {
          y: 30,
          x: -20,
          scale: 0.95,
          duration: 5.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.8,
        });
      }
      if (bubble3Ref.current) {
        gsap.to(bubble3Ref.current, {
          y: -20,
          scale: 1.15,
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.2,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(name.trim(), npsn.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-300 to-sky-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* GSAP Animated Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          ref={bubble1Ref}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/20 blur-3xl"
        />
        <div
          ref={bubble2Ref}
          className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl"
        />
        <div
          ref={bubble3Ref}
          className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-sky-300/30 blur-2xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo & Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-xl shadow-cyan-500/20 mb-4"
          >
            <span className="text-4xl font-black text-cyan-600">K</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-white drop-shadow-sm"
          >
            Kiliko<span className="text-cyan-800">.App</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/80 mt-1 font-medium"
          >
            Platform Digital Tugas, Absensi & Nilai
          </motion.p>
          <p className="text-xs text-white/60 mt-0.5">
            SMAN 1 Kandangan · Tahun Ajaran 2024/2025
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/95 rounded-3xl shadow-2xl shadow-cyan-900/10 p-6 sm:p-8 backdrop-blur-md border border-white/40"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Masuk Akun Siswa</h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan Nama Lengkap dan NPSN Sekolah
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Nama Lengkap Siswa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="Contoh: ACHMAD RAFKI ZIDNA AYUBA"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* NPSN */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                NPSN (Nomor Pokok Sekolah Nasional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={npsn}
                  onChange={(e) => setNpsn(e.target.value.replace(/\D/g, ''))}
                  placeholder="Masukkan NPSN (20511959)"
                  maxLength={8}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  required
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 ml-1">
                Gunakan NPSN SMAN 1 Kandangan (20511959) sebagai kata sandi
              </p>
            </div>

            {/* Animated Error Message with AnimatePresence */}
            <AnimatePresence>
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5 overflow-hidden"
                >
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-700">Akun tidak valid</p>
                    <p className="text-[11px] text-red-600 mt-0.5">{loginError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button with Framer Motion hover & tap */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading || !name || !npsn}
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                isLoading || !name || !npsn
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-medium">atau masuk sebagai</span>
            </div>
          </div>

          {/* Quick Role Access for Staff with Motion micro-interactions */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'GURU', label: 'Guru', icon: '👩‍🏫' },
              { role: 'WALI_KELAS', label: 'Wali Kelas', icon: '📋' },
              { role: 'BK', label: 'Guru BK', icon: '🛡️' },
              { role: 'TU', label: 'TU', icon: '📊' },
              { role: 'KEPALA_SEKOLAH', label: 'Kepsek', icon: '🏛️' },
              { role: 'ADMIN', label: 'Admin', icon: '⚙️' },
            ].map((r) => (
              <motion.button
                key={r.role}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLogin(`__ROLE__${r.role}`, '')}
                className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 transition text-center shadow-xs"
              >
                <span className="text-lg">{r.icon}</span>
                <span className="text-[10px] font-semibold text-slate-600">{r.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-white/60 mt-6">
          © 2024 Kiliko.App · Disusun oleh Argha (Product Manager)
        </p>
      </motion.div>
    </div>
  );
};
