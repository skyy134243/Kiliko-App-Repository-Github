import { Assignment, Submission, GradebookEntry, User } from '../types';

/**
 * Auto-Grading & Gradebook Engine
 * Sesuai PRD Bagian 1, 5, 6.1, 7:
 * - Pilihan Ganda dinilai otomatis berdasarkan kunci jawaban terkunci
 * - Nilai otomatis masuk ke tabel nilai kelas (Gradebook)
 * - Nilai tugas kelompok otomatis berlaku sama untuk seluruh anggota kelompok
 */
export function calculateQuizScore(
  assignment: Assignment,
  selectedAnswers: Record<string, string>
): number {
  if (!assignment.questions || assignment.questions.length === 0) return 0;

  let correctCount = 0;
  assignment.questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctKey) {
      correctCount++;
    }
  });

  const rawScore = (correctCount / assignment.questions.length) * 100;
  return Math.round(rawScore * 10) / 10;
}

export function syncSubmissionToGradebook(
  submission: Submission,
  assignment: Assignment,
  allStudents: User[],
  currentGradebook: GradebookEntry[]
): GradebookEntry[] {
  if (submission.score === undefined || submission.score === null) {
    return currentGradebook;
  }

  let updated = [...currentGradebook];

  // Jika tugas kelompok, duplikasi nilai sama untuk semua anggota kelompok
  if (assignment.type === 'KELOMPOK' && submission.groupMembers && submission.groupMembers.length > 0) {
    submission.groupMembers.forEach((memberName) => {
      const studentMatch = allStudents.find((s) => s.name.toLowerCase() === memberName.toLowerCase());
      const sId = studentMatch ? studentMatch.id : `guest-${memberName}`;
      const sNis = studentMatch ? studentMatch.identifierNumber : '-';

      const entryId = `GB-${assignment.id}-${sId}`;
      const existingIndex = updated.findIndex((g) => g.id === entryId || (g.assignmentId === assignment.id && g.studentId === sId));

      const entry: GradebookEntry = {
        id: entryId,
        studentId: sId,
        studentName: memberName,
        studentNis: sNis,
        classId: assignment.classId,
        subjectId: assignment.subjectId,
        subjectName: assignment.subjectName,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        taskCategory: assignment.category,
        score: submission.score!,
        isAutoSynced: true,
        syncedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        updated[existingIndex] = entry;
      } else {
        updated.push(entry);
      }
    });
  } else {
    // Tugas perorangan (LKPD, Pilihan Ganda, Praktikum)
    const entryId = `GB-${assignment.id}-${submission.studentId}`;
    const existingIndex = updated.findIndex((g) => g.id === entryId || (g.assignmentId === assignment.id && g.studentId === submission.studentId));

    const entry: GradebookEntry = {
      id: entryId,
      studentId: submission.studentId,
      studentName: submission.studentName,
      studentNis: submission.studentNis,
      classId: assignment.classId,
      subjectId: assignment.subjectId,
      subjectName: assignment.subjectName,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      taskCategory: assignment.category,
      score: submission.score,
      isAutoSynced: true,
      syncedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      updated[existingIndex] = entry;
    } else {
      updated.push(entry);
    }
  }

  return updated;
}
