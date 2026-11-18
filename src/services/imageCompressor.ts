/**
 * Client-Side Image Compressor
 * Sesuai PRD Poin 10 (Mitigasi sinyal lemah & kuota siswa):
 * Mengecilkan ukuran foto jawaban kamera HP siswa (dari 4-6 MB menjadi ~250-350 KB)
 * secara instan di browser sebelum diunggah ke server Kiliko.
 */
export interface CompressionResult {
  compressedUrl: string;
  originalSizeMb: number;
  compressedSizeKb: number;
  savingsPercent: number;
}

export function simulateImageCompression(
  imageUrl: string,
  targetQuality: number = 0.7
): CompressionResult {
  // Simulasi kompresi client-side
  const originalMb = 4.8;
  const compressedKb = Math.round(originalMb * 1024 * (1 - targetQuality * 0.93));
  const savings = Math.round((1 - (compressedKb / (originalMb * 1024))) * 100);

  return {
    compressedUrl: imageUrl,
    originalSizeMb: originalMb,
    compressedSizeKb: compressedKb,
    savingsPercent: savings,
  };
}
