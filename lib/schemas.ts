import { z } from "zod";

/**
 * Pertemuan 10 — Langkah 5: Buat Schema Validasi (dipakai bersama)
 * Berisi aturan tiap field (wajib diisi, minimal karakter, format email).
 * Nilai dari form selalu berupa string, jadi angka perlu z.coerce.number().
 */
export const NoteSchema = z.object({
  title: z
    .string({ error: "Judul catatan wajib diisi" })
    .trim()
    .min(3, "Judul catatan minimal 3 karakter")
    .max(100, "Judul catatan maksimal 100 karakter"),
  content: z
    .string({ error: "Isi catatan wajib diisi" })
    .trim()
    .min(10, "Isi catatan minimal 10 karakter"),
  category: z
    .enum(["Kuliah", "Tugas", "Pribadi", "Ujian"], {
      error: "Pilih salah satu kategori yang valid (Kuliah, Tugas, Pribadi, Ujian)",
    })
    .default("Kuliah"),
  priority: z.coerce
    .number({ error: "Prioritas wajib diisi angka" })
    .min(1, "Prioritas minimal bernilai 1 (Rendah)")
    .max(5, "Prioritas maksimal bernilai 5 (Mendesak)")
    .default(3),
});

export const LoginSchema = z.object({
  email: z
    .string({ error: "Email wajib diisi" })
    .trim()
    .email("Format email tidak valid (contoh: user@univ.ac.id)"),
  password: z
    .string({ error: "Kata sandi wajib diisi" })
    .min(6, "Kata sandi minimal 6 karakter"),
});

export type NoteInput = z.infer<typeof NoteSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
