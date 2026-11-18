import React from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, switchRole, resetAllData } = useApp();

  const roles: { role: Role; label: string; desc: string; icon: string }[] = [
    { role: 'SISWA', label: 'Siswa', desc: 'Tugasku & Surat Bebas Tugas', icon: '🎓' },
    { role: 'GURU', label: 'Guru Mapel', desc: 'Buat Tugas, Koreksi & Absensi', icon: '👩‍🏫' },
    { role: 'BK', label: 'Guru BK', desc: 'Pendamping Absensi & Bot Alert', icon: '🛡️' },
    { role: 'TU', label: 'Tata Usaha (TU)', desc: 'Tabel Nilai Otomatis & Rapor', icon: '📊' },
    { role: 'KEPALA_SEKOLAH', label: 'Kepala Sekolah', desc: 'TTE Surat & Monitoring', icon: '🏛️' },
    { role: 'ADMIN', label: 'Admin (Argha)', desc: 'Pengelola Teknis', icon: '⚙️' },
  ];

  return (
    <div className="bg-slate-900 text-white px-4 py-2.5 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            PRD Sandbox Mode
          </span>
          <span className="text-xs text-slate-300 hidden sm:inline">
            Simulasi Role Aktif:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {roles.map((r) => {
            const isActive = currentUser.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                title={r.desc}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-900 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-300 text-right">
            <span className="font-semibold text-white">{currentUser.name}</span>
            <span className="text-slate-400 text-[11px] block">
              {currentUser.identifierNumber ? `ID: ${currentUser.identifierNumber}` : currentUser.role}
            </span>
          </div>
          <button
            onClick={() => {
              if (confirm('Reset seluruh data simulasi ke setelan awal PRD?')) {
                resetAllData();
              }
            }}
            className="text-[11px] text-slate-400 hover:text-amber-300 transition underline underline-offset-2"
          >
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};
