import { WhatsAppLog, WaNotificationType, BotAttendanceAlert, User, Assignment } from '../types';

/**
 * WhatsApp Gateway Service (Kiliko Bot Integrator)
 * Menjembatani sistem Kiliko ke Orang Tua/Wali Murid via WhatsApp
 */
export function createAbsenceWaNotification(
  alert: BotAttendanceAlert,
  student: User
): WhatsAppLog {
  const parentName = student.parentName || 'Bapak/Ibu Wali Siswa';
  const parentPhone = student.parentPhone || '0812-3456-7890';

  const message = `*PEMBERITAHUAN KILIKO.APP — SMA NEGERI 1 KILIKO*\n\n` +
    `Yth. ${parentName},\n` +
    `Kami menginformasikan bahwa ananda *${student.name}* (Kelas: ${alert.studentClass}) pada hari ini (${alert.date}) tercatat *TIDAK HADIR di ${alert.totalAbsences} mata pelajaran*.\n\n` +
    `Rincian: Alpa (${alert.alpaCount} mapel).\n` +
    `Status Penanganan: Sedang dikoordinasikan oleh Guru BK dan Wali Kelas.\n\n` +
    `Mohon konfirmasi atau hubungi pihak sekolah apabila ananda berhalangan hadir dengan alasan mendesak.\n` +
    `_Pesan otomatis sistem Kiliko.App._`;

  return {
    id: `WA-${Date.now()}-${student.id}`,
    recipientPhone: parentPhone,
    recipientName: parentName,
    studentName: student.name,
    studentNis: student.identifierNumber,
    className: alert.studentClass,
    type: 'ABSENSI_ALPA',
    message,
    sentAt: new Date().toISOString(),
    status: 'TERKIRIM',
  };
}

export function createDeadlineReminderWaNotification(
  task: Assignment,
  student: User
): WhatsAppLog {
  const parentName = student.parentName || 'Bapak/Ibu Wali Siswa';
  const parentPhone = student.parentPhone || '0812-3456-7890';

  const message = `*PENGINGAT TUGAS TENGGAT — KILIKO.APP*\n\n` +
    `Yth. ${parentName},\n` +
    `Menginfokan bahwa ananda *${student.name}* memiliki tugas wajib (*Tugas Tenggat*):\n` +
    `📚 *${task.subjectName}*: ${task.title}\n` +
    `⏰ Batas Waktu: ${new Date(task.deadline).toLocaleString('id-ID')}\n\n` +
    `Tugas ini menjadi syarat mutlak penerbitan *Surat Bebas Tugas Ujian Semester*. Mohon didampingi agar ananda menyelesaikan tepat waktu.\n` +
    `_Kiliko.App EduTech System_`;

  return {
    id: `WA-${Date.now()}-${student.id}`,
    recipientPhone: parentPhone,
    recipientName: parentName,
    studentName: student.name,
    studentNis: student.identifierNumber,
    className: task.className,
    type: 'DEADLINE_TENGGAT',
    message,
    sentAt: new Date().toISOString(),
    status: 'TERKIRIM',
  };
}
