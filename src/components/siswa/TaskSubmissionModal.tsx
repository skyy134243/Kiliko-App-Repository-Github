import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment } from '../../types';

interface TaskSubmissionModalProps {
  assignment: Assignment;
  onClose: () => void;
}

export const TaskSubmissionModal: React.FC<TaskSubmissionModalProps> = ({
  assignment,
  onClose,
}) => {
  const { currentUser, submissions, submitAssignment } = useApp();

  const existingSub = submissions.find(
    (s) => s.assignmentId === assignment.id && s.studentId === currentUser.id
  );

  const [photoUrl, setPhotoUrl] = useState(
    existingSub?.photoAnswerUrl ||
      'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80'
  );
  const [textContent, setTextContent] = useState(existingSub?.textContent || '');
  const [groupName, setGroupName] = useState(existingSub?.groupName || 'Kelompok 1 - Kreatif');
  const [membersInput, setMembersInput] = useState(
    existingSub?.groupMembers?.join(', ') || `${currentUser.name}, Budi Santoso, Siti Rahmawati`
  );
  const [attachmentInput, setAttachmentInput] = useState(
    existingSub?.attachmentUrls?.[0] || 'https://drive.google.com/sample/tugas-siswa.pdf'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const members = membersInput
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    setTimeout(() => {
      submitAssignment(assignment.id, {
        photoAnswerUrl: assignment.type === 'LKPD_ESAI' ? photoUrl : undefined,
        textContent,
        groupName: assignment.type === 'KELOMPOK' ? groupName : undefined,
        groupMembers: assignment.type === 'KELOMPOK' ? members : undefined,
        attachmentUrls: [attachmentInput],
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                {assignment.subjectName}
              </span>
              <span className="text-xs font-bold text-slate-400">·</span>
              <span className="text-xs text-slate-500">{assignment.type}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{assignment.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Instruksi Tugas */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
            <span className="font-bold text-slate-700 block mb-1">Instruksi Guru:</span>
            {assignment.description}
          </div>

          {/* Form sesuai Jenis Tugas */}
          {assignment.type === 'LKPD_ESAI' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Foto Jawaban Lembar Kerja Fisik (Sesuai PRD 6.1.a):
              </label>
              
              <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 text-center bg-indigo-50/30">
                <img
                  src={photoUrl}
                  alt="Preview Jawaban Siswa"
                  className="max-h-56 mx-auto rounded-lg shadow-sm border border-slate-200 object-cover mb-3"
                />
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="URL Foto Lembar Jawaban (atau simulasi kamera)"
                    className="text-xs w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoUrl(
                        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="text-[11px] font-bold px-2.5 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 whitespace-nowrap"
                  >
                    Ganti Sampel Foto
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  *Guru akan mengoreksi foto fisik ini secara manual di dasbor guru Kiliko.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan untuk Guru (Opsional):
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={2}
                  placeholder="Misal: Nomor 4 dikerjakan di balik lembar jawaban..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {assignment.type === 'KELOMPOK' && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800">
                <span className="font-bold">Ketentuan Tugas Kelompok (PRD 6.1.d & Aturan Bisnis 5):</span>
                <p>Pengumpulan per folder kelompok. Nilai yang diberikan guru akan otomatis berlaku sama untuk seluruh anggota yang terdaftar.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Kelompok / Folder:
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Contoh: Kelompok 1 - Sosiologi Kritis"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daftar Anggota Kelompok (Pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  required
                  value={membersInput}
                  onChange={(e) => setMembersInput(e.target.value)}
                  placeholder="Contoh: Andi Pratama, Budi Santoso, Siti Rahmawati"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tautan File / Folder Pengumpulan (Video / Infografis / Presentasi):
                </label>
                <input
                  type="url"
                  required
                  value={attachmentInput}
                  onChange={(e) => setAttachmentInput(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {assignment.type === 'PRAKTIKUM' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan Hasil Pengamatan / Praktikum:
                </label>
                <textarea
                  required
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={3}
                  placeholder="Jelaskan prosedur, hasil pengujian, dan kesimpulan praktikum..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tautan Laporan Lengkap / Dokumentasi Foto Praktik:
                </label>
                <input
                  type="url"
                  required
                  value={attachmentInput}
                  onChange={(e) => setAttachmentInput(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 flex items-center gap-1.5"
            >
              <span>{isSubmitting ? 'Mengunggah...' : 'Kumpulkan Tugas Sekarang'}</span>
              <span>✓</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
