import { z } from "zod";

export const MataKuliahSchema = z.object({
  kode: z
    .string({ error: "Kode mata kuliah wajib diisi" })
    .trim()
    .min(3, "Kode minimal 3 karakter")
    .max(20, "Kode maksimal 20 karakter"),
  nama: z
    .string({ error: "Nama mata kuliah wajib diisi" })
    .trim()
    .min(3, "Nama mata kuliah minimal 3 karakter")
    .max(100, "Nama mata kuliah maksimal 100 karakter"),
  sks: z.coerce
    .number({ error: "Bobot SKS harus berupa angka" })
    .min(1, "Minimal 1 SKS")
    .max(6, "Maksimal 6 SKS")
    .default(3),
  dosen: z
    .string({ error: "Dosen pengampu wajib diisi" })
    .trim()
    .min(3, "Nama dosen pengampu minimal 3 karakter"),
});

export type MataKuliahInput = z.infer<typeof MataKuliahSchema>;
