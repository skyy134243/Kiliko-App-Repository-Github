import { PrismaClient } from '@prisma/client';
import { ALL_CLASSES_X, RAW_STUDENTS_LIST } from '../src/data/masterStudents';
import { ALL_CLASSES_XI, RAW_STUDENTS_LIST_XI } from '../src/data/masterStudents11';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Memulai Seeding 704 Siswa (Kelas X & XI) SMAN 1 Kandangan ke Database Kiliko.App ---');

  // 1. Seed Classes X-1 to X-10 & XI-1 to XI-10
  const allClasses = [...ALL_CLASSES_X, ...ALL_CLASSES_XI];
  for (const cls of allClasses) {
    await prisma.class.upsert({
      where: { id: cls.id },
      update: { name: cls.name },
      create: {
        id: cls.id,
        name: cls.name,
        gradeLevel: cls.gradeLevel,
        academicYear: cls.academicYear,
        semester: cls.semester,
      },
    });
  }
  console.log('✓ 20 Kelas (X-1 s.d X-10 & XI-1 s.d XI-10) berhasil disimpan.');

  // 2. Seed Guru & Staff
  const teachers = [
    { id: 'user-guru-1', name: 'Ibu Sri Wahyuni, M.Pd', email: 'sri@sman1kandangan.sch.id', role: 'GURU', nip: '198205142005012003' },
    { id: 'user-guru-2', name: 'Pak Bambang Irawan, S.Pd', email: 'bambang@sman1kandangan.sch.id', role: 'GURU', nip: '197903222003121002' },
    { id: 'user-bk-1', name: 'Dra. Ratna Megasari', email: 'bk@sman1kandangan.sch.id', role: 'BK', nip: '197604101998022001' },
    { id: 'user-tu-1', name: 'Hendra Kurniawan', email: 'tu@sman1kandangan.sch.id', role: 'TU', nip: '198811052010011005' },
    { id: 'user-kepsek-1', name: 'Drs. H. Mulyadi, M.Pd', email: 'kepsek@sman1kandangan.sch.id', role: 'KEPALA_SEKOLAH', nip: '197508121999031004' },
  ];

  for (const t of teachers) {
    await prisma.user.upsert({
      where: { id: t.id },
      update: { name: t.name },
      create: {
        id: t.id,
        name: t.name,
        email: t.email,
        passwordHash: '$2a$12$hashedPasswordPlaceholder',
        role: t.role as any,
        identifierNumber: t.nip,
      },
    });
  }
  console.log('✓ Guru & Staff berhasil disimpan.');

  // 3. Seed 352 Siswa Kelas X
  for (const s of RAW_STUDENTS_LIST) {
    const studentId = `student-${s.no}`;
    const nisn = `20241${String(s.no).padStart(4, '0')}`;
    const parentPrefix = s.gender === 'Laki-laki' ? 'Bpk. ' : 'Ibu ';
    const lastName = s.name.split(' ').slice(-1)[0];

    await prisma.user.upsert({
      where: { id: studentId },
      update: { name: s.name, classId: s.classId },
      create: {
        id: studentId,
        name: s.name,
        email: `${s.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}${s.no}@sman1kandangan.sch.id`,
        passwordHash: '$2a$12$hashedPasswordPlaceholder',
        identifierNumber: nisn,
        role: 'SISWA',
        classId: s.classId,
        parentName: `${parentPrefix}${lastName}`,
        parentPhone: `0812-${String(1000 + (s.no * 23)).padStart(4, '0')}-${String(2000 + (s.no * 17)).padStart(4, '0')}`,
      },
    });
  }
  console.log('✓ 352 Siswa Kelas X lengkap berhasil disimpan.');

  // 4. Seed 352 Siswa Kelas XI
  for (const s of RAW_STUDENTS_LIST_XI) {
    const studentId = `student-xi-${s.no}`;
    const nisn = `20231${String(s.no).padStart(4, '0')}`;
    const parentPrefix = s.gender === 'Laki-laki' ? 'Bpk. ' : 'Ibu ';
    const lastName = s.name.split(' ').slice(-1)[0];

    await prisma.user.upsert({
      where: { id: studentId },
      update: { name: s.name, classId: s.classId },
      create: {
        id: studentId,
        name: s.name,
        email: `${s.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)}${s.no}@sman1kandangan.sch.id`,
        passwordHash: '$2a$12$hashedPasswordPlaceholder',
        identifierNumber: nisn,
        role: 'SISWA',
        classId: s.classId,
        parentName: `${parentPrefix}${lastName}`,
        parentPhone: `0813-${String(1000 + (s.no * 19)).padStart(4, '0')}-${String(3000 + (s.no * 23)).padStart(4, '0')}`,
      },
    });
  }
  console.log('✓ 352 Siswa Kelas XI lengkap berhasil disimpan (Total 704 Siswa di Database)!');
}
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
