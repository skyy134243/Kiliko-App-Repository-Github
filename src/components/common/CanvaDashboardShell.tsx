import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useApp } from '../../context/AppContext';

export interface TabItem {
  key: string;
  label: string;
  badge?: number | string;
}

export interface QuickCardItem {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  statusBadge?: { label: string; color: string };
  icon?: string;
  onClick?: () => void;
}

interface CanvaDashboardShellProps {
  roleBadge: string;
  userName: string;
  userSubtitle: string;
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  bestDealCard?: {
    title: string;
    subtitle: string;
    teacherOrMeta: string;
    actionLabel: string;
    statusBadge: { label: string; color: string };
    pdfText?: string;
    onClick?: () => void;
  };
  recommendations?: QuickCardItem[];
  children: React.ReactNode;
}

export const CanvaDashboardShell: React.FC<CanvaDashboardShellProps> = ({
  roleBadge,
  userName,
  userSubtitle,
  tabs,
  activeTab,
  onTabChange,
  searchPlaceholder = 'Search...',
  searchQuery,
  onSearchChange,
  bestDealCard,
  recommendations,
  children,
}) => {
  const { currentUser, logout, botAlerts, waLogs } = useApp();
  const [internalSearch, setInternalSearch] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // GSAP: Animate cards entrance smoothly whenever tab changes
  useEffect(() => {
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.querySelectorAll('.canva-anim-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 16, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out',
          }
        );
      }
    }
  }, [activeTab]);

  const effectiveSearch = searchQuery !== undefined ? searchQuery : internalSearch;
  const handleSearch = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    else setInternalSearch(val);
  };

  const allTabs = tabs.some((t) => t.key === 'akun')
    ? tabs
    : [...tabs, { key: 'akun', label: 'Akun ku' }];

  return (
    <div className="min-h-screen bg-cyan-300 text-slate-800 font-sans selection:bg-cyan-200 selection:text-cyan-900">
      {/* ===== HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="bg-cyan-300 px-4 pt-6 pb-4 md:px-8 md:pt-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-400/60 text-cyan-900 border border-cyan-400 shadow-xs">
                  {roleBadge}
                </span>
                <span className="text-[10px] font-medium text-cyan-900/70 hidden sm:inline">
                  Kiliko.App EduTech
                </span>
              </div>
              <h1 className="text-lg md:text-2xl font-black text-slate-900 leading-tight mt-1">
                {userName}
              </h1>
              <p className="text-xs text-cyan-900/70 mt-0.5 font-medium">
                {userSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification Bell with Motion micro-interaction */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 8 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setShowNotificationModal(true)}
                className="relative w-10 h-10 rounded-full bg-white/60 hover:bg-white/90 flex items-center justify-center transition shadow-sm"
                title="Notifikasi"
              >
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-cyan-300 animate-pulse" />
              </motion.button>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={logout}
                className="w-10 h-10 rounded-full bg-white/60 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-700 transition shadow-sm"
                title="Keluar Akun"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== SEARCH & FILTER BAR ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="bg-cyan-300 px-4 pb-4 md:px-8"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={effectiveSearch}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-sm text-slate-700 placeholder:text-slate-400 border-none focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm transition"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleSearch('')}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-slate-50 transition"
            title="Filter / Reset"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* ===== TAB NAVIGATION (CANVA PILL STYLE WITH MOTION LAYOUTID) ===== */}
      <div className="bg-cyan-300 px-4 pb-3 md:px-8">
        <div className="max-w-4xl mx-auto overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {allTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <motion.button
                  key={tab.key}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onTabChange(tab.key)}
                  className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive ? 'text-white font-bold' : 'text-cyan-900/80 hover:bg-white/40'
                  }`}
                >
                  {/* Gliding active pill background using Framer Motion layoutId */}
                  {isActive && (
                    <motion.div
                      layoutId="canvaActivePill"
                      className="absolute inset-0 bg-cyan-600 rounded-full shadow-md shadow-cyan-700/25 -z-10"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`relative z-10 text-[10px] font-black px-1.5 py-0.2 rounded-full transition-colors ${
                        isActive
                          ? 'bg-white text-cyan-700'
                          : 'bg-cyan-500/40 text-cyan-900'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT CONTAINER ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-t-3xl min-h-[75vh] mt-1 px-4 py-6 md:px-8 shadow-sm"
      >
        <div ref={cardsContainerRef} className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'akun' ? (
              <motion.div
                key="tab-akun"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 max-w-xl mx-auto"
              >
                <h2 className="text-lg font-black text-slate-900">Profil & Akun Pengguna</h2>
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-500/20">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{currentUser.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Peran: <strong className="text-cyan-700">{roleBadge}</strong>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">SMAN 1 Kandangan</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Identitas / NIP / ID', value: currentUser.identifierNumber || '-', icon: '🆔' },
                      { label: 'Email Kedinasan', value: currentUser.email || '-', icon: '✉️' },
                      { label: 'Peran Sistem', value: roleBadge, icon: '🏛️' },
                      { label: 'Kelas Pengampu', value: currentUser.className || (currentUser.homeroomClassId ? 'X-1 (Wali Kelas)' : 'Semua Kelas'), icon: '🏫' },
                      { label: 'Sekolah Induk', value: 'SMAN 1 Kandangan (NPSN: 20511959)', icon: '📍' },
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="w-full py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-bold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Keluar dari Akun</span>
                </motion.button>

                <p className="text-center text-[10px] text-slate-400 mt-4">
                  Kiliko.App v1.4 EduTech · Hak Akses: {roleBadge}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`tab-${activeTab}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Best Deal / Hero Highlight Card with Framer Motion hover */}
                {bestDealCard && (
                  <div>
                    <h2 className="text-lg font-black text-slate-900 mb-3">Best Deal & Sorotan</h2>
                    <motion.div
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={bestDealCard.onClick}
                      className="canva-anim-card bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <div className="flex">
                        <div className="flex-1 p-4 sm:p-5">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                              ⭐ Sorotan Utama
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug mb-1">
                            {bestDealCard.title}
                          </h3>
                          <p className="text-xs text-slate-500 mb-0.5 leading-relaxed">
                            {bestDealCard.subtitle}
                          </p>
                          <p className="text-xs font-semibold text-slate-600 italic mt-1">
                            {bestDealCard.teacherOrMeta}
                          </p>
                          {bestDealCard.pdfText && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-cyan-700 bg-cyan-50 rounded-lg px-2.5 py-1.5 w-fit border border-cyan-200">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">{bestDealCard.pdfText}</span>
                            </div>
                          )}
                        </div>
                        <div className="w-32 sm:w-36 bg-slate-100 flex flex-col items-center justify-center p-3 gap-2 border-l border-slate-200">
                          <div className="w-full h-16 bg-slate-200/70 rounded-lg flex items-center justify-center">
                            <p className="text-[10px] text-slate-600 text-center font-bold leading-tight px-1">
                              {bestDealCard.actionLabel}
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border text-center ${bestDealCard.statusBadge.color}`}>
                            {bestDealCard.statusBadge.label}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Recommendation Quick Cards with GSAP entrance + Motion hover */}
                {recommendations && recommendations.length > 0 && (
                  <div>
                    <h2 className="text-lg font-black text-slate-900 mb-3">Recommendation & Menu Cepat</h2>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x scrollbar-none">
                      {recommendations.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ y: -4, scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={item.onClick}
                          className="canva-anim-card min-w-[190px] max-w-[210px] bg-cyan-50/70 hover:bg-cyan-100/70 rounded-2xl p-3.5 border border-cyan-200 shadow-xs cursor-pointer hover:shadow-md transition snap-start flex-shrink-0 flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-full h-12 bg-cyan-100/80 rounded-xl flex items-center justify-center mb-2.5">
                              <span className="text-2xl">{item.icon || '📌'}</span>
                            </div>
                            {item.statusBadge && (
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border inline-block mb-1.5 ${item.statusBadge.color}`}>
                                {item.statusBadge.label}
                              </span>
                            )}
                            <h4 className="text-xs font-bold text-slate-900 leading-tight mb-1">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                              {item.subtitle}
                            </p>
                          </div>
                          {item.tag && (
                            <p className="text-[10px] font-semibold text-cyan-800 mt-2 italic">
                              {item.tag}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Tab Content */}
                <div className="pt-2">{children}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ===== NOTIFICATION MODAL WITH FRAMER MOTION ANIMATION ===== */}
      <AnimatePresence>
        {showNotificationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotificationModal(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔔</span>
                  <h3 className="font-bold text-slate-900 text-base">Notifikasi Kiliko.App</h3>
                </div>
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-800">Sistem Kiliko.App Aktif</span>
                    <span className="text-[10px] text-cyan-600">Baru saja</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Selamat datang di Kiliko.App SMAN 1 Kandangan. Seluruh 704 data siswa telah aktif.
                  </p>
                </div>

                {botAlerts && botAlerts.length > 0 && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-rose-800">Alert Bot Absensi</span>
                      <span className="text-[10px] text-rose-600">Mendesak</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Terdapat {botAlerts.filter((a) => a.priority === 'MENDESAK').length} peringatan siswa alpa/izin berlebih yang dipantau bot.
                    </p>
                  </div>
                )}

                {waLogs && waLogs.length > 0 && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-800">Notifikasi WA Gateway</span>
                      <span className="text-[10px] text-emerald-600">{waLogs.length} Terkirim</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Pesan WhatsApp otomatis berhasil disampaikan ke orang tua siswa.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowNotificationModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-700 transition"
              >
                Tutup Notifikasi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
