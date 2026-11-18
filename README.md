# Kiliko.App — Platform Digital Tugas, Absensi, dan Nilai Sekolah

> **Disusun berdasarkan PRD Resmi oleh Argha (Product Manager) · Versi 1.1 EduTech Enhancement**

Platform digital terintegrasi untuk menghubungkan siswa, guru mata pelajaran, **wali kelas**, guru BK, staf Tata Usaha (TU), dan Kepala Sekolah guna mendigitalisasi tiga pilar utama sekolah: **Pemberian & Pengumpulan Tugas**, **Absensi Kelas**, dan **Pencatatan Nilai Terpadu**, serta menggantikan kertas penjajakan tugas fisik dengan **Surat Bebas Tugas Digital** ber-QR Code & Tanda Tangan Elektronik (TTE).

---

## 🏛️ Struktur Direktori Proyek

```
kiliko-app/
├── prisma/
│   └── schema.prisma              # Skema database lengkap (PostgreSQL / SQLite)
├── src/
│   ├── types/
│   │   └── index.ts               # Definisi Type TypeScript untuk 7 role pengguna & seluruh entitas PRD
│   ├── data/
│   │   └── mockData.ts            # Data awal realistis untuk 7 peran pengguna & skenario absensi bot
│   ├── services/
│   │   ├── botEngine.ts           # Mesin Bot Absensi: Hitung absensi harian ≥ 3 mapel -> Kirim alert ke BK
│   │   ├── gradingEngine.ts       # Auto-grading Pilihan Ganda & Sinkronisasi Tabel Nilai TU & Nilai Tugas Kelompok
│   │   ├── clearanceService.ts    # Validasi kelayakan seluruh Tugas Tenggat & Generator TTE Kepala Sekolah
│   │   ├── imageCompressor.ts     # Kompresi Otomatis Foto LKPD Klien (Hemat 90%+ Kuota & Waktu Upload)
│   │   ├── whatsappGateway.ts     # Notifikasi Otomatis ke Orang Tua Siswa (Alpa ≥ 3 & Pengingat Tenggat)
│   │   └── ocrSimulation.ts       # Ekstraksi AI Vision/OCR Soal Pilihan Ganda dari Foto Buku
│   ├── context/
│   │   └── AppContext.tsx         # Global State & Sandbox Database interaktif dengan LocalStorage
│   ├── components/
│   │   ├── common/
│   │   │   ├── RoleSwitcherBar.tsx # Bar simulasi pergantian 7 role dengan 1-klik
│   │   │   └── Navbar.tsx         # Navigasi responsif adaptif sesuai role aktif
│   │   ├── siswa/
│   │   │   ├── TugaskuView.tsx    # Dasbor Tugasku (Filter, Badge Tenggat, Nilai)
│   │   │   ├── TaskSubmissionModal.tsx # Pengumpulan LKPD foto + Kompresi Otomatis, Praktikum, Tugas Kelompok
│   │   │   ├── MultipleChoiceQuizModal.tsx # Kuis PG interaktif + Auto-grading bot instan
│   │   │   └── SuratBebasTugasModal.tsx # Surat Bebas Tugas resmi ber-Kop, QR & TTE
│   │   ├── guru/
│   │   │   └── GuruDashboardView.tsx # Buat Tugas (4 tipe), Koreksi Foto & Input Absensi
│   │   ├── walikelas/
│   │   │   └── WaliKelasDashboardView.tsx # Dasbor Wali Kelas: Pantau Tugas Tenggat & 1-Klik Kirim WA ke Ortu
│   │   ├── bk/
│   │   │   └── BKDashboardView.tsx   # Laporan Bot Absensi (MENDESAK vs INFORMASI) & Tindak Lanjut
│   │   ├── tu/
│   │   │   └── TUGradebookView.tsx   # Tabel Nilai Terpadu & Format e-Rapor Kurikulum Merdeka Kemendikbud
│   │   ├── kepsek/
│   │   │   └── KepsekDashboardView.tsx # Otorisasi TTE Kepala Sekolah & Pantauan Kelulusan
│   │   ├── admin/
│   │   │   └── AdminDashboardView.tsx  # Manajemen Teknis Platform & Roadmap PRD
│   │   └── public/
│   │       └── VerificationView.tsx   # Halaman Verifikasi Publik Scan QR Surat Digital
│   ├── App.tsx                    # Komponen Utama Aplikasi
│   ├── main.tsx                   # Entry point React
│   └── index.css                  # Styling Tailwind CSS & Print Styling Cetak Dokumen
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

---

## 🚀 Fitur Baru yang Ditambahkan (v1.1)

1. **📋 Dasbor Khusus Wali Kelas (`WaliKelasDashboardView.tsx`)**:
   - Memantau ketuntasan Tugas Tenggat seluruh siswa dalam 1 kelas asuhan.
   - Tombol 1-klik kirim pengingat tugas ke WhatsApp orang tua murid.
   - Tembusan otomatis ketika ada siswa asuhan yang terkena alert ketidakhadiran dari bot.

2. **💬 Integrasi WhatsApp Gateway (`whatsappGateway.ts`)**:
   - Bot otomatis memicu pengiriman pesan WhatsApp ke orang tua saat siswa tercatat Alpa $\ge 3$ mata pelajaran.
   - Fitur pengingat H-1 tugas tenggat langsung ke ponsel orang tua agar siswa didampingi di rumah.

3. **⚡ Kompresi Foto Klien Otomatis (`imageCompressor.ts`)**:
   - Foto lembar jawaban LKPD dari kamera HP siswa (4-6 MB) dikompres otomatis di browser menjadi ~250-350 KB sebelum diunggah.
   - Menghemat kuota internet siswa hingga 90%+ dan menjamin kelancaran upload di area sinyal lemah (PRD Poin 10).

4. **📑 Format Ekspor e-Rapor Kurikulum Merdeka (`TUGradebookView.tsx`)**:
   - Nilai dari tugas dan kuis otomatis dipetakan ke **Tujuan Pembelajaran (TP)**, Asesmen Formatif, dan Asesmen Sumatif Lingkup Materi sesuai standar Kemendikbudristek RI.

---

## 🛠️ Cara Menjalankan Aplikasi di Lokal

Di dalam folder proyek:
```bash
npm install
npm run dev
```
Buka browser di `http://localhost:3000`. Anda dapat langsung mengganti peran di Sandbox Bar atas untuk mencoba seluruh fitur!
