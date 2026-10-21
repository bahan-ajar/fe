"use server";

import { revalidatePath } from "next/cache";
import { MahasiswaSchema } from "@/lib/validations/mahasiswa";
import { Mahasiswa } from "./types";

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: Mahasiswa;
};

/**
 * Server Action untuk memvalidasi dan menyimpan (Tambah / Ubah) data Mahasiswa
 */
export async function saveMahasiswaAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;

  const rawData = {
    nim: formData.get("nim"),
    nama: formData.get("nama"),
    kelas: formData.get("kelas"),
    status: formData.get("status"),
  };

  // Validasi di sisi server menggunakan Zod Schema
  const validation = MahasiswaSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Validasi gagal. Harap periksa input yang ditandai merah.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const validData = validation.data;

    // Mutasi data: Di sini kamu menghubungkan ke database/ORM project-mu (misal: Prisma/MySQL)
    const resultItem: Mahasiswa = {
      id: id ?? Date.now(),
      nim: validData.nim,
      nama: validData.nama,
      kelas: validData.kelas,
      status: validData.status,
      created_at: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    // Revalidasi cache halaman agar Next.js merender data terbaru
    revalidatePath("/mahasiswa");

    return {
      success: true,
      message: id
        ? `Data mahasiswa "${validData.nama}" berhasil diperbarui!`
        : `Mahasiswa baru "${validData.nama}" berhasil ditambahkan!`,
      data: resultItem,
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    return {
      success: false,
      message: "Gagal menyimpan data ke database. Silakan coba lagi.",
    };
  }
}

/**
 * Server Action untuk mutasi hapus data Mahasiswa
 */
export async function deleteMahasiswaAction(id: number) {
  try {
    // Eksekusi mutasi delete di server/database
    revalidatePath("/mahasiswa");
    return { success: true, id };
  } catch (error) {
    console.error("Delete Action Error:", error);
    return { success: false, error: "Gagal menghapus data" };
  }
}
