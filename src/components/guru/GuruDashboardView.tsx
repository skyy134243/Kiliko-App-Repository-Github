import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, TaskCategory, User } from '../../types';

export const GuruTaskGradeTableView: React.FC = () => {
  const {
    currentUser,
    classes,
    subjects,
    assignments,
    submissions,
    users,
    directGradeStudent,
  } = useApp();

  // Filters
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-x-1');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | TaskCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Quick Grade Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStudent, setModalStudent] = useState<User | null>(null);
  const [modalAssignment, setModalAssignment] = useState<Assignment | null>(null);
  const [modalScore, setModalScore] = useState<number>(85);
  const [modalFeedback, setModalFeedback] = useState<string>('Pengerjaan tugas baik dan sesuai instruksi.');

  // Filter students for the selected class
  const classStudents = useMemo(() => {
    return users
      .filter((u) => u.role === 'SISWA' && u.classId === selectedClassId)
      .filter((u) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.identifierNumber.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, selectedClassId, searchQuery]);

  // Filter assignments matching class and filters
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      // Must match class
      if (a.classId !== selectedClassId) return false;
      // Filter by subject
      if (selectedSubjectId !== 'ALL' && a.subjectId !== selectedSubjectId) return false;
      // Filter by category (Tenggat / Biasa)
      if (categoryFilter !== 'ALL' && a.category !== categoryFilter) return false;
      return true;
    });
  }, [assignments, selectedClassId, selectedSubjectId, categoryFilter]);

  // Fast lookup map: `${assignmentId}_${studentId}` -> submission
  const submissionMap = useMemo(() => {
    const map = new Map<string, typeof submissions[0]>();
    submissions.forEach((sub) => {
      map.set(`${sub.assignmentId}_${sub.studentId}`, sub);
    });
    return map;
  }, [submissions]);

  // Selected class & subject display info
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Calculate Overall Statistics
  const stats = useMemo(() => {
    let totalScoreSum = 0;
    let totalGradedCount = 0;
    let studentsPassingAllTenggat = 0;

    const tenggatTasks = filteredAssignments.filter((a) => a.category === 'TENGGAT');

    classStudents.forEach((st) => {
      let stScoreSum = 0;
      let stGradedCount = 0;
      let passedTenggat = true;

      tenggatTasks.forEach((t) => {
        const sub = submissionMap.get(`${t.id}_${st.id}`);
        if (!sub || sub.score === undefined || sub.score < 75) {
          passedTenggat = false;
        }
      });

      if (tenggatTasks.length > 0 && passedTenggat) {
        studentsPassingAllTenggat++;
      }

      filteredAssignments.forEach((a) => {
        const sub = submissionMap.get(`${a.id}_${st.id}`);
        if (sub && sub.score !== undefined) {
          stScoreSum += sub.score;
          stGradedCount++;
          totalScoreSum += sub.score;
          totalGradedCount++;
        }
      });
    });

    const classAverage =
      totalGradedCount > 0 ? Math.round((totalScoreSum / totalGradedCount) * 10) / 10 : 0;

    const tenggatPassPercentage =
      classStudents.length > 0 && tenggatTasks.length > 0
        ? Math.round((studentsPassingAllTenggat / classStudents.length) * 100)
        : classStudents.length > 0 && tenggatTasks.length === 0
        ? 100
        : 0;

    return {
      classAverage,
      totalStudents: classStudents.length,
      totalAssignments: filteredAssignments.length,
      tenggatTasksCount: tenggatTasks.length,
      studentsPassingAllTenggat,
      tenggatPassPercentage,
    };
  }, [classStudents, filteredAssignments, submissionMap]);

  // Open Quick Grade Modal
  const handleOpenGradeModal = (student: User, assignment: Assignment) => {
    const existingSub = submissionMap.get(`${assignment.id}_${student.id}`);
    setModalStudent(student);
    setModalAssignment(assignment);
    setModalScore(existingSub?.score !== undefined ? existingSub.score : 85);
    setModalFeedback(
      existingSub?.teacherFeedback ||
        (assignment.category === 'TENGGAT'
          ? 'Tuntas tugas tenggat kurikulum. Pemahaman materi sangat baik.'
          : 'Pengerjaan tugas baik dan sesuai instruksi.')
    );
    setModalOpen(true);
  };

  // Save Modal Score
  const handleSaveModalGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalStudent || !modalAssignment) return;

    directGradeStudent(
      modalAssignment.id,
      modalStudent.id,
      Number(modalScore),
      modalFeedback
    );

    setModalOpen(false);
  };

  // Export Table to CSV
  const handleExportCSV = () => {
    if (classStudents.length === 0) {
      alert('Tidak ada data siswa untuk diexport!');
      return;
    }

    // CSV Header
    const headers = [
      'No',
      'NISN',
      'Nama Siswa',
      'Kelas',
      ...filteredAssignments.map((a) => `"${a.title} (${a.category})"`),
      'Rata-Rata',
      'Status Ketuntasan',
    ];

    // CSV Rows
    const rows = classStudents.map((st, idx) => {
      let sum = 0;
      let count = 0;
      let allTenggatPassed = true;

      const taskScores = filteredAssignments.map((a) => {
        const sub = submissionMap.get(`${a.id}_${st.id}`);
        if (sub && sub.score !== undefined) {
          sum += sub.score;
          count++;
          if (a.category === 'TENGGAT' && sub.score < 75) allTenggatPassed = false;
          return sub.score;
        } else {
          if (a.category === 'TENGGAT') allTenggatPassed = false;
          return sub ? 'Menunggu Koreksi' : 'Belum Kumpul';
        }
      });

      const avg = count > 0 ? (sum / count).toFixed(1) : '-';
      const status = allTenggatPassed ? 'Tuntas (Bebas Tugas)' : 'Belum Tuntas';

      return [
        idx + 1,
        st.identifierNumber,
        `"${st.name}"`,
        `"${currentClass?.name || 'Kelas'}"`,
        ...taskScores,
        avg,
        `"${status}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Tabel_Nilai_Tugas_${currentClass?.name || 'Kelas'}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">??</span>
            <h1 className="text-xl font-bold text-slate-900">
              Tabel Rekapitulasi Nilai Tugas Siswa
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Dasbor Guru
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Matriks nama tugas dan nilai perolehan seluruh murid. Terintegrasi langsung dengan koreksi LKPD, Kuis AI, Praktikum, dan Tugas Kelompok.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            title="Download CSV untuk dibuka di Microsoft Excel"
          >
            <span>??</span>
            <span>Export ke Excel / CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            title="Cetak format cetak tabel nilai"
          >
            <span>???</span>
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            ?? Siswa di Kelas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalStudents}</span>
            <span className="text-xs text-slate-500">murid ({currentClass?.name})</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            ?? Tugas Aktif
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{stats.totalAssignments}</span>
            <span className="text-xs text-slate-500">({stats.tenggatTasksCount} Tugas Tenggat)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            ?? Rata-Rata Kelas
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">
              {stats.classAverage > 0 ? stats.classAverage : '-'}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            ?? Ketuntasan Tugas Tenggat
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600">{stats.tenggatPassPercentage}%</span>
            <span className="text-xs text-slate-500">
              ({stats.studentsPassingAllTenggat}/{stats.totalStudents} Siswa)
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        {/* Class Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Pilih Kelas:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:ring-2 focus:ring-indigo-500/20"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({users.filter((u) => u.role === 'SISWA' && u.classId === c.id).length} Siswa)
              </option>
            ))}
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Mata Pelajaran:</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white hover:border-slate-400"
          >
            <option value="ALL">Semua Mata Pelajaran</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Kategori Tugas:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white hover:border-slate-400"
          >
            <option value="ALL">Semua Kategori (Tenggat & Biasa)</option>
            <option value="TENGGAT">Tugas Tenggat (Syarat Bebas Tugas)</option>
            <option value="BIASA">Tugas Biasa (Pengayaan Rapor)</option>
          </select>
        </div>

        {/* Student Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Cari Murid:</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Ketik Nama Siswa atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs p-2 pl-8 rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs">??</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ?
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grade Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-2">??</span>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Belum Ada Tugas untuk Kelas Ini</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tidak ada tugas yang sesuai dengan filter kelas atau mata pelajaran saat ini. Silakan buat tugas baru melalui tab "Buat Tugas".
            </p>
          </div>
        ) : classStudents.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-2">??</span>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Tidak Ada Murid Ditemukan</h3>
            <p className="text-xs text-slate-500">
              Tidak ada siswa yang cocok dengan pencarian "{searchQuery}" di kelas {currentClass?.name}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              {/* Table Header */}
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-3.5 font-bold w-12 text-center border-r border-slate-200 bg-slate-50 sticky left-0 z-10">
                    No
                  </th>
                  <th className="p-3.5 font-bold w-28 border-r border-slate-200 bg-slate-50 sticky left-12 z-10">
                    NISN
                  </th>
                  <th className="p-3.5 font-bold min-w-[200px] border-r border-slate-200 bg-slate-50 sticky left-40 z-10">
                    Nama Murid
                  </th>

                  {/* Task Columns Header */}
                  {filteredAssignments.map((task) => (
                    <th
                      key={task.id}
                      className="p-3 border-r border-slate-200 min-w-[170px] max-w-[220px] bg-slate-50/80 align-top"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              task.category === 'TENGGAT'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {task.category}
                          </span>
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                            {task.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div
                          className="font-bold text-slate-900 text-xs leading-snug line-clamp-2"
                          title={task.title}
                        >
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>KKM: 75</span>
                          <span>{task.subjectName}</span>
                        </div>
                      </div>
                    </th>
                  ))}

                  <th className="p-3.5 font-bold w-24 text-center border-r border-slate-200 bg-slate-50">
                    Rata-Rata
                  </th>
                  <th className="p-3.5 font-bold w-32 text-center bg-slate-50">
                    Ketuntasan
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((student, idx) => {
                  let studentScoreSum = 0;
                  let studentGradedCount = 0;
                  let allTenggatPassed = true;

                  const tenggatTasks = filteredAssignments.filter((a) => a.category === 'TENGGAT');

                  tenggatTasks.forEach((t) => {
                    const sub = submissionMap.get(`${t.id}_${student.id}`);
                    if (!sub || sub.score === undefined || sub.score < 75) {
                      allTenggatPassed = false;
                    }
                  });

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      {/* No */}
                      <td className="p-3 text-center font-medium text-slate-500 border-r border-slate-100 bg-white group-hover:bg-slate-50 sticky left-0 z-10">
                        {idx + 1}
                      </td>

                      {/* NISN */}
                      <td className="p-3 font-mono text-[11px] text-slate-600 border-r border-slate-100 bg-white group-hover:bg-slate-50 sticky left-12 z-10">
                        {student.identifierNumber}
                      </td>

                      {/* Nama Murid */}
                      <td className="p-3 border-r border-slate-100 bg-white group-hover:bg-slate-50 sticky left-40 z-10">
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {student.parentPhone ? `WA Ortu: ${student.parentPhone}` : 'SMAN 1 Kandangan'}
                        </div>
                      </td>

                      {/* Dynamic Assignment Columns */}
                      {filteredAssignments.map((task) => {
                        const sub = submissionMap.get(`${task.id}_${student.id}`);
                        const hasScore = sub && sub.score !== undefined;

                        if (hasScore) {
                          studentScoreSum += sub!.score!;
                          studentGradedCount++;
                        }

                        return (
                          <td
                            key={task.id}
                            className="p-2.5 text-center border-r border-slate-100"
                          >
                            {hasScore ? (
                              <button
                                onClick={() => handleOpenGradeModal(student, task)}
                                className={`w-full py-1.5 px-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 hover:shadow-xs ${
                                  sub!.score! >= 85
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                    : sub!.score! >= 75
                                    ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                                    : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                                }`}
                                title={`Nilai: ${sub!.score!}. Klik untuk edit nilai.`}
                              >
                                <span>{sub!.score}</span>
                                <span className="text-[10px] opacity-60">?</span>
                              </button>
                            ) : sub && sub.status === 'DIKUMPULKAN' ? (
                              <button
                                onClick={() => handleOpenGradeModal(student, task)}
                                className="w-full py-1.5 px-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 text-[11px] font-semibold transition"
                                title="Jawaban sudah masuk. Klik untuk koreksi & beri nilai."
                              >
                                ? Koreksi
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenGradeModal(student, task)}
                                className="w-full py-1.5 px-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 text-xs font-medium transition"
                                title="Belum ada nilai. Klik untuk input nilai langsung."
                              >
                                -
                              </button>
                            )}
                          </td>
                        );
                      })}

                      {/* Student Average */}
                      <td className="p-3 text-center font-bold text-slate-800 border-r border-slate-100">
                        {studentGradedCount > 0 ? (
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-extrabold ${
                              studentScoreSum / studentGradedCount >= 75
                                ? 'bg-slate-100 text-slate-800'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {(studentScoreSum / studentGradedCount).toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Clearance Status */}
                      <td className="p-3 text-center">
                        {tenggatTasks.length === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            Tidak Ada Tenggat
                          </span>
                        ) : allTenggatPassed ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ? Bebas Tugas
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            ? Belum Tuntas
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Table Footer: Column Averages */}
              <tfoot className="bg-slate-100/80 font-bold text-slate-700 border-t-2 border-slate-300">
                <tr>
                  <td
                    colSpan={3}
                    className="p-3 text-right text-xs uppercase tracking-wider text-slate-600 sticky left-0 z-10 bg-slate-100"
                  >
                    Rata-Rata Nilai Tugas Kelas:
                  </td>

                  {filteredAssignments.map((task) => {
                    let taskScoreSum = 0;
                    let taskGradedCount = 0;

                    classStudents.forEach((st) => {
                      const sub = submissionMap.get(`${task.id}_${st.id}`);
                      if (sub && sub.score !== undefined) {
                        taskScoreSum += sub.score;
                        taskGradedCount++;
                      }
                    });

                    const taskAvg =
                      taskGradedCount > 0 ? (taskScoreSum / taskGradedCount).toFixed(1) : '-';

                    return (
                      <td key={task.id} className="p-2.5 text-center text-xs">
                        <div className="font-extrabold text-indigo-700">{taskAvg}</div>
                        <div className="text-[10px] font-normal text-slate-500">
                          {taskGradedCount}/{classStudents.length} dinilai
                        </div>
                      </td>
                    );
                  })}

                  <td className="p-3 text-center text-xs font-black text-slate-900">
                    {stats.classAverage > 0 ? stats.classAverage : '-'}
                  </td>
                  <td className="p-3 text-center text-[10px] text-slate-500">
                    {stats.studentsPassingAllTenggat}/{classStudents.length} Tuntas
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Legend / Info Footer */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-700">Keterangan Warna Nilai:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
            <span>? 85 (Sangat Baik)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span>
            <span>75 - 84 (Tuntas / KKM)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
            <span>&lt; 75 (Di Bawah KKM / Remedial)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
            <span>Menunggu Koreksi Guru</span>
          </span>
        </div>

        <div className="text-slate-400 text-[11px]">
          * Klik pada kotak nilai untuk mengedit atau menginput nilai secara langsung.
        </div>
      </div>

      {/* Quick Grade Modal */}
      {modalOpen && modalStudent && modalAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                  Input / Edit Nilai Siswa
                </span>
                <h3 className="text-base font-bold text-slate-900">{modalStudent.name}</h3>
                <p className="text-xs text-slate-500">
                  NISN: {modalStudent.identifierNumber} . Kelas: {currentClass?.name}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ?
              </button>
            </div>

            <form onSubmit={handleSaveModalGrade} className="space-y-4 pt-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">{modalAssignment.title}</div>
                <div className="text-slate-500 flex items-center justify-between">
                  <span>Mata Pelajaran: {modalAssignment.subjectName}</span>
                  <span className="font-bold text-indigo-600">KKM: 75</span>
                </div>
              </div>

              {/* Score Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nilai Siswa (0 - 100):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={modalScore}
                  onChange={(e) => setModalScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-full text-lg font-extrabold p-2.5 rounded-xl border border-slate-300 text-slate-900 text-center focus:ring-2 focus:ring-indigo-500/20"
                  required
                />

                {/* Quick Presets */}
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {[75, 80, 85, 90, 95, 100].map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setModalScore(sc)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition ${
                        modalScore === sc
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teacher Feedback */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Guru / Feedback:
                </label>
                <textarea
                  rows={3}
                  value={modalFeedback}
                  onChange={(e) => setModalFeedback(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Beri umpan balik pengerjaan tugas siswa..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
                >
                  ?? Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
