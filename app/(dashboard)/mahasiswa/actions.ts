"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { API_URL } from "@/lib/api";
import { MahasiswaSchema } from "@/lib/validations/mahasiswa";
import { Mahasiswa, MahasiswaFormState } from "@/types";

export type FormState = MahasiswaFormState;

/**
 * Server Action untuk memvalidasi dan menyimpan (Tambah / Ubah) data Mahasiswa ke Backend API
 */
export async function saveMahasiswaAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Cek Login via DAL
  await getCurrentUser();

  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;

  const rawData = {
    nim: formData.get("nim"),
    nama: formData.get("nama"),
    kelas: formData.get("kelas"),
    status: formData.get("status"),
  };

  // 2. Validasi di sisi server menggunakan Zod Schema
  const validation = MahasiswaSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Validasi gagal. Harap periksa input yang ditandai merah.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const url = id ? `${API_URL}/mahasiswa/${id}` : `${API_URL}/mahasiswa`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(validation.data),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.success) {
      return {
        success: false,
        message: result?.message || "Gagal menyimpan data ke database backend.",
      };
    }

    // 3. Revalidasi cache halaman agar Next.js merender data terbaru
    revalidatePath("/mahasiswa");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: id
        ? `Data mahasiswa "${validation.data.nama}" berhasil diperbarui!`
        : `Mahasiswa baru "${validation.data.nama}" berhasil ditambahkan!`,
      data: result.data,
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
 * Server Action untuk mutasi hapus data Mahasiswa ke Backend API
 */
export async function deleteMahasiswaAction(id: number) {
  // Cek login via DAL
  await getCurrentUser();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/mahasiswa/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.success) {
      return { success: false, error: result?.message || "Gagal menghapus data dari backend" };
    }

    revalidatePath("/mahasiswa");
    revalidatePath("/dashboard");
    return { success: true, id };
  } catch (error) {
    console.error("Delete Action Error:", error);
    return { success: false, error: "Gagal menghapus data di server backend" };
  }
}
