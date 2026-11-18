import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Assignment,
  Submission,
  AttendanceRecord,
  BotAttendanceAlert,
  GradebookEntry,
  TaskType,
  TaskCategory,
  AttendanceStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_GRADEBOOK,
  INITIAL_ATTENDANCE,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
} from '../data/mockData';
import { evaluateDailyAttendance } from '../services/botEngine';
import { syncSubmissionToGradebook, calculateQuizScore } from '../services/gradingEngine';

interface AppContextType {
  currentUser: User;
  switchRole: (role: Role) => void;
  users: User[];
  classes: typeof INITIAL_CLASSES;
  subjects: typeof INITIAL_SUBJECTS;
  assignments: Assignment[];
  submissions: Submission[];
  gradebook: GradebookEntry[];
  attendance: AttendanceRecord[];
  botAlerts: BotAttendanceAlert[];
  
  // Actions
  createAssignment: (newAssignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  submitAssignment: (
    assignmentId: string,
    payload: {
      photoAnswerUrl?: string;
      textContent?: string;
      selectedAnswers?: Record<string, string>;
      attachmentUrls?: string[];
      groupId?: string;
      groupName?: string;
      groupMembers?: string[];
    }
  ) => void;
  gradeSubmission: (
    submissionId: string,
    score: number,
    feedback: string
  ) => void;
  recordClassAttendance: (
    date: string,
    periodNumber: number,
    subjectId: string,
    records: { studentId: string; status: AttendanceStatus; reason?: string }[]
  ) => void;
  resolveBotAlert: (alertId: string, bkNotes: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user (defaults to Siswa Andi Pratama)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('kiliko_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [users] = useState<User[]>(INITIAL_USERS);
  const [classes] = useState(INITIAL_CLASSES);
  const [subjects] = useState(INITIAL_SUBJECTS);

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('kiliko_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('kiliko_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [gradebook, setGradebook] = useState<GradebookEntry[]>(() => {
    const saved = localStorage.getItem('kiliko_gradebook');
    return saved ? JSON.parse(saved) : INITIAL_GRADEBOOK;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('kiliko_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [botAlerts, setBotAlerts] = useState<BotAttendanceAlert[]>(() => {
    const saved = localStorage.getItem('kiliko_bot_alerts');
    if (saved) return JSON.parse(saved);
    // Initial evaluation based on INITIAL_ATTENDANCE
    return evaluateDailyAttendance(INITIAL_ATTENDANCE, []);
  });

  // Local storage synchronizers
  useEffect(() => {
    localStorage.setItem('kiliko_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kiliko_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('kiliko_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('kiliko_gradebook', JSON.stringify(gradebook));
  }, [gradebook]);

  useEffect(() => {
    localStorage.setItem('kiliko_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('kiliko_bot_alerts', JSON.stringify(botAlerts));
  }, [botAlerts]);

  // Switch role helper
  const switchRole = (role: Role) => {
    const target = users.find((u) => u.role === role) || users[0];
    setCurrentUser(target);
  };

  // Buat Tugas Baru (Oleh Guru)
  const createAssignment = (newAssignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    const task: Assignment = {
      ...newAssignment,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAssignments((prev) => [task, ...prev]);
  };

  // Kumpulkan Tugas (Oleh Siswa)
  const submitAssignment = (
    assignmentId: string,
    payload: {
      photoAnswerUrl?: string;
      textContent?: string;
      selectedAnswers?: Record<string, string>;
      attachmentUrls?: string[];
      groupId?: string;
      groupName?: string;
      groupMembers?: string[];
    }
  ) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    let initialScore: number | undefined = undefined;
    let initialFeedback: string | undefined = undefined;
    let gradedById: string | undefined = undefined;
    let status: Submission['status'] = 'DIKUMPULKAN';

    // Jika Pilihan Ganda: Auto-Grade langsung!
    if (assignment.type === 'PILIHAN_GANDA' && payload.selectedAnswers) {
      initialScore = calculateQuizScore(assignment, payload.selectedAnswers);
      initialFeedback = `Nilai otomatis terhitung oleh Bot: ${initialScore}/100`;
      gradedById = 'bot-auto-grader';
      status = 'DINILAI';
    }

    const subId = `sub-${assignmentId}-${currentUser.id}`;
    const newSubmission: Submission = {
      id: subId,
      assignmentId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNis: currentUser.identifierNumber,
      status,
      submittedAt: new Date().toISOString(),
      photoAnswerUrl: payload.photoAnswerUrl,
      textContent: payload.textContent,
      selectedAnswers: payload.selectedAnswers,
      attachmentUrls: payload.attachmentUrls,
      groupId: payload.groupId,
      groupName: payload.groupName,
      groupMembers: payload.groupMembers,
      score: initialScore,
      teacherFeedback: initialFeedback,
      gradedAt: initialScore !== undefined ? new Date().toISOString() : undefined,
      gradedById,
    };

    setSubmissions((prev) => {
      const idx = prev.findIndex((s) => s.assignmentId === assignmentId && s.studentId === currentUser.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newSubmission;
        return copy;
      }
      return [newSubmission, ...prev];
    });

    // Jika ada nilai otomatis (kuis PG), sinkronkan ke Gradebook
    if (initialScore !== undefined) {
      setGradebook((prevGb) =>
        syncSubmissionToGradebook(newSubmission, assignment, users, prevGb)
      );
    }
  };

  // Nilai Jawaban Siswa (Oleh Guru)
  const gradeSubmission = (
    submissionId: string,
    score: number,
    feedback: string
  ) => {
    let updatedSub: Submission | undefined;

    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          updatedSub = {
            ...s,
            score,
            teacherFeedback: feedback,
            status: 'DINILAI',
            gradedAt: new Date().toISOString(),
            gradedById: currentUser.id,
          };
          return updatedSub;
        }
        return s;
      })
    );

    if (updatedSub) {
      const relatedAssignment = assignments.find((a) => a.id === updatedSub!.assignmentId);
      if (relatedAssignment) {
        setGradebook((prevGb) =>
          syncSubmissionToGradebook(updatedSub!, relatedAssignment, users, prevGb)
        );
      }
    }
  };

  // Input Absensi Kelas & Pemicu Bot Alert Otomatis
  const recordClassAttendance = (
    date: string,
    periodNumber: number,
    subjectId: string,
    records: { studentId: string; status: AttendanceStatus; reason?: string }[]
  ) => {
    const subject = subjects.find((s) => s.id === subjectId) || subjects[0];
    const newRecords: AttendanceRecord[] = records.map((r) => {
      const student = users.find((u) => u.id === r.studentId);
      return {
        id: `att-${date}-${periodNumber}-${subjectId}-${r.studentId}`,
        date,
        periodNumber,
        subjectId,
        subjectName: subject.name,
        classId: student?.classId || 'cls-x-ipa-1',
        studentId: r.studentId,
        studentName: student?.name || 'Siswa',
        status: r.status,
        reason: r.reason,
        recordedByTeacherId: currentUser.id,
      };
    });

    const updatedAttendance = [...newRecords, ...attendance];
    setAttendance(updatedAttendance);

    // Jalankan bot otomatis absensi untuk mendeteksi ketidakhadiran >= 3 mapel
    const updatedAlerts = evaluateDailyAttendance(updatedAttendance, botAlerts);
    setBotAlerts(updatedAlerts);
  };

  // Tindak Lanjut Bot Alert oleh Guru BK
  const resolveBotAlert = (alertId: string, bkNotes: string) => {
    setBotAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          return {
            ...a,
            followUpStatus: 'RESOLVED',
            bkNotes,
            resolvedAt: new Date().toISOString(),
            resolvedByName: currentUser.name,
          };
        }
        return a;
      })
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setAssignments(INITIAL_ASSIGNMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setGradebook(INITIAL_GRADEBOOK);
    setAttendance(INITIAL_ATTENDANCE);
    setBotAlerts(evaluateDailyAttendance(INITIAL_ATTENDANCE, []));
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        users,
        classes,
        subjects,
        assignments,
        submissions,
        gradebook,
        attendance,
        botAlerts,
        createAssignment,
        submitAssignment,
        gradeSubmission,
        recordClassAttendance,
        resolveBotAlert,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
