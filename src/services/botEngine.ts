import { AttendanceRecord, BotAttendanceAlert, AlertPriority } from '../types';

/**
 * Bot Otomatis Absensi Kiliko.App
 * Sesuai PRD Bagian 1, 5, dan 6.4:
 * - Bot membaca data harian absensi
 * - Bila seorang siswa tidak hadir (Dispen, Izin, Sakit, Alpa) di 3 mata pelajaran atau lebih dalam 1 hari:
 *   Datanya dikirim ke pihak sekolah (BK)
 * - Prioritas: Alpa ditandai MENDESAK (Urgensi Tinggi), sedangkan Sakit/Izin/Dispen bersifat INFORMASI
 */
export function evaluateDailyAttendance(
  records: AttendanceRecord[],
  existingAlerts: BotAttendanceAlert[] = []
): BotAttendanceAlert[] {
  // Kelompokkan absensi berdasarkan tanggal & studentId
  const grouped: Record<string, AttendanceRecord[]> = {};

  records.forEach((rec) => {
    // Hanya hitung yang TIDAK HADIR
    if (rec.status !== 'HADIR') {
      const key = `${rec.date}_${rec.studentId}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(rec);
    }
  });

  const generatedAlerts: BotAttendanceAlert[] = [...existingAlerts];

  Object.entries(grouped).forEach(([key, absences]) => {
    // Ambang batas ketidakhadiran minimal 3 mata pelajaran dalam sehari
    if (absences.length >= 3) {
      const first = absences[0];
      const alertId = `ALERT-${key}`;

      // Cek apakah alert untuk tanggal & siswa ini sudah ada
      const alreadyExists = generatedAlerts.some(
        (a) => a.date === first.date && a.studentId === first.studentId
      );

      if (!alreadyExists) {
        const alpaList = absences.filter((a) => a.status === 'ALPA');
        const alpaCount = alpaList.length;

        // Usulan PRD: Alpa ditandai MENDESAK, sakit/izin/dispen bersifat INFORMASI
        const priority: AlertPriority = alpaCount > 0 ? 'MENDESAK' : 'INFORMASI';

        const newAlert: BotAttendanceAlert = {
          id: alertId,
          date: first.date,
          studentId: first.studentId,
          studentName: first.studentName,
          studentClass: 'X IPA 1', // fallback class name
          totalAbsences: absences.length,
          alpaCount,
          priority,
          details: absences.map((a) => ({
            period: a.periodNumber,
            subjectName: a.subjectName,
            status: a.status,
            reason: a.reason || 'Tidak ada keterangan rinci',
          })),
          followUpStatus: 'PENDING',
        };

        generatedAlerts.unshift(newAlert);
      }
    }
  });

  return generatedAlerts;
}
