# Kiliko.App — Platform Digital Tugas, Absensi, dan Nilai Sekolah

> **Disusun berdasarkan PRD Resmi oleh Argha (Product Manager) · Versi 1.0 (8 November 2026)**

Platform digital terintegrasi untuk menghubungkan siswa, guru mata pelajaran, guru BK, staf Tata Usaha (TU), dan Kepala Sekolah guna mendigitalisasi tiga pilar utama sekolah: **Pemberian & Pengumpulan Tugas**, **Absensi Kelas**, dan **Pencatatan Nilai Terpadu**, serta menggantikan kertas penjajakan tugas fisik dengan **Surat Bebas Tugas Digital** ber-QR Code & Tanda Tangan Elektronik (TTE).

---

## 🏛️ Struktur Direktori Proyek

```
kiliko-app/
├── prisma/
│   └── schema.prisma              # Skema database lengkap (PostgreSQL / SQLite)
├── src/
│   ├── types/
│   │   └── index.ts               # Definisi Type TypeScript untuk seluruh entitas PRD
│   ├── data/
│   │   └── mockData.ts            # Data awal realistis untuk 6 role pengguna
│   ├── services/
│   │   ├── botEngine.ts           # Mesin Bot Absensi (Mendeteksi ≥3 ketidakhadiran harian -> Alert BK)
│   │   ├── gradingEngine.ts       # Auto-grading Pilihan Ganda & Sinkronisasi Tabel Nilai
│   │   ├── clearanceService.ts    # Validator Surat Bebas Tugas & Hash TTE Kepala Sekolah
│   │   └── ocrSimulation.ts       # Ekstraksi AI Vision/OCR Soal Pilihan Ganda dari Foto Buku
│   ├── context/
│   │   └── AppContext.tsx         # Global State & Database Sandbox dengan LocalStorage
│   ├── components/
│   │   ├── common/
│   │   │   ├── RoleSwitcherBar.tsx # Bar simulasi pergantian 6 role dengan 1-klik
│   │   │   └── Navbar.tsx         # Navigasi responsif adaptif sesuai role aktif
│   │   ├── siswa/
│   │   │   ├── TugaskuView.tsx    # Dasbor Tugasku (Filter, Badge Tenggat, Nilai)
│   │   │   ├── TaskSubmissionModal.tsx # Pengumpulan LKPD foto, Praktikum, Tugas Kelompok
│   │   │   ├── MultipleChoiceQuizModal.tsx # Kuis PG interaktif + Auto-grading bot instan
│   │   │   └── SuratBebasTugasModal.tsx # Surat Bebas Tugas resmi ber-Kop, QR & TTE
│   │   ├── guru/
│   │   │   └── GuruDashboardView.tsx # Buat Tugas (4 tipe), Koreksi Foto & Input Absensi
│   │   ├── bk/
│   │   │   └── BKDashboardView.tsx   # Laporan Bot Absensi (MENDESAK vs INFORMASI) & Tindak Lanjut
│   │   ├── tu/
│   │   │   └── TUGradebookView.tsx   # Tabel Nilai Terpadu & Sinkronisasi Otomatis Rapor
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

## 🚀 Fitur yang Sesuai dengan Spesifikasi PRD

### 1. Empat (4) Jenis Tugas (PRD Poin 6.1)
- **a. LKPD / Esai (Foto Jawaban Fisik)**: Siswa memotret lembar jawaban fisik di kertas dan mengunggahnya. Guru memeriksa foto secara langsung di layar dan menginput nilai tepat di bawah foto.
- **b. Pilihan Ganda (Auto-Grade & AI OCR)**: Guru dapat memotret soal dari buku teks. Sistem mengekstrak soal & opsi jawaban. **Aturan Bisnis (PRD 7.3):** Guru wajib memeriksa dan mengunci kunci jawaban sebelum dipublikasikan. Nilai dihitung otomatis dan langsung disinkronkan ke tabel nilai.
- **c. Praktikum**: Penugasan eksperimen atau laboratorium dengan instruksi spesifik, laporan, dan dokumentasi foto/video.
- **d. Tugas Kelompok (Folder Bersama)**: Siswa mengumpulkan per kelompok/folder. **Aturan Bisnis (PRD 7.5):** Nilai dari guru otomatis terdistribusi sama rata untuk seluruh anggota kelompok yang didaftarkan.

### 2. Kategori Tugas (PRD Poin 6.2)
- **🔴 Tugas Tenggat**: Wajib dituntaskan oleh siswa. Menjadi prasyarat mutlak penerbitan Surat Bebas Tugas Digital.
- **⚪ Tugas Biasa**: Nilai tetap masuk ke tabel nilai dan rapor, tetapi tidak memblokir penerbitan surat bebas tugas.

### 3. Absensi & Bot Otomatis (PRD Poin 5 & 6.4)
- Guru mengisi absensi per sesi mata pelajaran: Hadir, Dispen, Izin, Sakit, atau Alpa beserta alasan.
- **Bot Engine**: Menghitung ketidakhadiran per hari. Jika seorang siswa tidak hadir pada **3 mata pelajaran atau lebih**, bot otomatis membuat laporan ke Guru BK.
- **Klasifikasi Prioritas Bot**:
  - `MENDESAK` (Warna Merah): Siswa dengan status Alpa.
  - `INFORMASI` (Warna Kuning/Biru): Siswa dengan status Sakit, Izin, atau Dispen.
- Guru BK dapat mencatat hasil pemanggilan siswa/orang tua dan menyelesaikan penanganan kasus.

### 4. Surat Bebas Tugas Digital (PRD Poin 6.5)
- Menggantikan kertas penjajakan tugas fisik yang diparaf satu per satu oleh guru mata pelajaran menjelang ujian semester.
- **Terbit Otomatis**: Hanya aktif jika seluruh tugas tenggat siswa berstatus tuntas.
- **Fitur Validasi & Cetak**:
  - Kop surat resmi sekolah.
  - QR Code verifikasi publik yang mengarah ke halaman verifikasi online.
  - Tanda Tangan Elektronik (TTE) Kepala Sekolah dengan hash kriptografi SHA-256.
  - Dukungan cetak langsung / simpan PDF (`@media print`).

### 5. Tabel Nilai Terpadu TU (PRD Poin 4 & 5.5)
- Rekapitulasi nilai kelas yang terisi otomatis dari bot penilaian kuis dan koreksi guru mapel, siap diexport untuk integrasi e-Rapor sekolah.

---

## 🛠️ Cara Menjalankan Aplikasi di Lokal

### Prasyarat
- Node.js (v18 ke atas disarankan)
- npm, yarn, atau pnpm

### Langkah Instalasi
1. Buka terminal di folder proyek `kiliko-app`:
   ```bash
   npm install
   ```

2. Jalankan server pengembangan (development mode):
   ```bash
   npm run dev
   ```

3. Buka browser pada tautan yang ditampilkan:
   ```
   http://localhost:3000
   ```

4. Uji alur sistem dengan memilih role pada **Sandbox Bar** di bagian paling atas:
   - Klik **Siswa** untuk melihat Dasbor *Tugasku* & Cetak *Surat Bebas Tugas*.
   - Klik **Guru Mapel** untuk Buat Tugas (coba simulasi AI OCR Pilihan Ganda & Lock Kunci Jawaban), Koreksi Jawaban, dan Input Absensi.
   - Klik **Guru BK** untuk memantau Laporan Bot Absensi (mendesak & info).
   - Klik **Tata Usaha (TU)** untuk melihat Tabel Nilai yang tersinkron otomatis.
   - Klik **Kepala Sekolah** untuk melihat TTE dan statistik kelulusan tugas.
   - Klik **🔍 Tes Scan QR** untuk melihat simulasi pemindaian QR Code publik.

---

## 🔗 Langkah Push ke Repositori GitHub Anda

Setelah membuat repositori baru di GitHub (misalnya: `https://github.com/username/kiliko-app.git`), jalankan perintah berikut di folder proyek:

```bash
git init
git add .
git commit -m "feat: inisialisasi fondasi lengkap Kiliko.App v1.0 sesuai PRD"
git branch -M main
git remote add origin <LINK_REPO_GITHUB_ANDA>
git push -u origin main
```
