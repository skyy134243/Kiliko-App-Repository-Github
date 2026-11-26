import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Assignment } from '../../types';

interface MultipleChoiceQuizModalProps {
  assignment: Assignment;
  onClose: () => void;
}

export const MultipleChoiceQuizModal: React.FC<MultipleChoiceQuizModalProps> = ({
  assignment,
  onClose,
}) => {
  const { submitAssignment } = useApp();
  const questions = assignment.questions || [];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  const handleSelect = (questionId: string, optionKey: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSubmitQuiz = () => {
    if (answeredCount < questions.length) {
      if (!confirm(`Anda baru menjawab ${answeredCount} dari ${questions.length} soal. Yakin ingin mengumpulkan?`)) {
        return;
      }
    }

    // Auto calculate score
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctKey) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100 * 10) / 10;
    setCalculatedScore(score);
    setIsFinished(true);

    // Kirim ke Context (akan otomatis auto-grade & sinkron ke Gradebook)
    submitAssignment(assignment.id, {
      selectedAnswers,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200"
      >
        {!isFinished ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                  ⚡ Auto-Graded Quiz · {assignment.subjectName}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{assignment.title}</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                ✕
              </button>
            </div>

            {/* Questions list */}
            <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {q.questionText}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {q.options.map((opt) => {
                      const isSelected = selectedAnswers[q.id] === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSelect(q.id, opt.key)}
                          className={`w-full text-left p-3 rounded-lg text-xs font-medium border transition flex items-center gap-3 ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Terjawab: <strong className="text-indigo-600">{answeredCount}</strong> dari {questions.length} soal
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-100 flex items-center gap-1.5"
                >
                  <span>Kirim Jawaban & Hitung Nilai</span>
                  <span>⚡</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Quiz Results Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl shadow-inner">
              ✓
            </div>

            <h3 className="text-xl font-black text-slate-900">
              Kuis Berhasil Dikerjakan!
            </h3>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Sesuai aturan PRD 6.1.b, nilai Anda telah dihitung otomatis oleh bot dan langsung disinkronkan ke tabel nilai sekolah.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-xs mx-auto">
              <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">
                Nilai Akhir
              </span>
              <div className="text-5xl font-black text-indigo-600 my-1">
                {calculatedScore}
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Otomatis Masuk Rapor
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Kembali ke Tugasku
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
