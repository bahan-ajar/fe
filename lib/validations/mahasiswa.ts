import { z } from "zod";

/**
 * Schema validasi Zod untuk data Mahasiswa
 */
export const MahasiswaSchema = z.object({
  nim: z
    .string()
    .trim()
    .min(5, "NIM minimal terdiri dari 5 digit angka")
    .max(20, "NIM maksimal 20 karakter")
    .regex(/^[0-9]+$/, "NIM hanya boleh berisi angka"),
  nama: z
    .string()
    .trim()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(100, "Nama lengkap tidak boleh melebihi 100 karakter"),
  kelas: z
    .string()
    .trim()
    .min(1, "Kelas wajib dipilih"),
  status: z
    .enum(["aktif", "cuti"], {
      error: "Status akademik harus aktif atau cuti",
    }),
});

export type MahasiswaInput = z.infer<typeof MahasiswaSchema>;
