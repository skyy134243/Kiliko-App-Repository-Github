import { QuizQuestion } from '../types';

/**
 * AI OCR Simulation Service
 * Sesuai PRD Bagian 6.1.b:
 * Mengubah foto soal cetak buku menjadi data interaktif pilihan ganda,
 * lalu guru memeriksa, memperbaiki, dan mengunci kunci jawaban sebelum rilis.
 */
export async function simulateAiOcrExtraction(
  _imageFileOrUrl?: string
): Promise<QuizQuestion[]> {
  // Simulasi pemrosesan AI Vision (Gemini 1.5/2.0 Flash)
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return [
    {
      id: `q-${Date.now()}-1`,
      questionText: 'Sebuah mobil bergerak dengan kecepatan awal 10 m/s dan mengalami percepatan tetap 2 m/s². Berapakah kecepatan mobil setelah 5 detik?',
      options: [
        { key: 'A', text: '15 m/s' },
        { key: 'B', text: '20 m/s' },
        { key: 'C', text: '25 m/s' },
        { key: 'D', text: '30 m/s' },
        { key: 'E', text: '35 m/s' },
      ],
      correctKey: 'B',
    },
    {
      id: `q-${Date.now()}-2`,
      questionText: 'Hukum Newton yang menjelaskan tentang kelembaman suatu benda adalah...',
      options: [
        { key: 'A', text: 'Hukum Newton I' },
        { key: 'B', text: 'Hukum Newton II' },
        { key: 'C', text: 'Hukum Newton III' },
        { key: 'D', text: 'Hukum Gravitasi Universal' },
        { key: 'E', text: 'Hukum Kekekalan Energi' },
      ],
      correctKey: 'A',
    },
    {
      id: `q-${Date.now()}-3`,
      questionText: 'Satuan Standar Internasional (SI) untuk besaran Usaha dan Energi adalah...',
      options: [
        { key: 'A', text: 'Watt' },
        { key: 'B', text: 'Pascal' },
        { key: 'C', text: 'Joule' },
        { key: 'D', text: 'Newton' },
        { key: 'E', text: 'Kalori' },
      ],
      correctKey: 'C',
    },
  ];
}
