"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { API_URL } from "@/lib/api";
import { MataKuliahSchema } from "@/lib/validations/mata-kuliah";
import { MataKuliah, MataKuliahFormState } from "@/types";

export type FormState = MataKuliahFormState;

export async function saveMataKuliahAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await getCurrentUser();

  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;

  const rawData = {
    kode: formData.get("kode"),
    nama: formData.get("nama"),
    sks: formData.get("sks"),
    dosen: formData.get("dosen"),
  };

  const validation = MataKuliahSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Validasi gagal. Periksa kembali input yang Anda masukkan.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const url = id ? `${API_URL}/mata-kuliah/${id}` : `${API_URL}/mata-kuliah`;
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
        message: result?.message || "Gagal menyimpan data mata kuliah ke backend server.",
      };
    }

    revalidatePath("/mata-kuliah");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: id
        ? `Mata kuliah "${validation.data.nama}" berhasil diperbarui!`
        : `Mata kuliah "${validation.data.nama}" berhasil ditambahkan!`,
      data: result.data,
    };
  } catch (error) {
    console.error("Save Mata Kuliah Action Error:", error);
    return {
      success: false,
      message: "Gagal terhubung ke backend server.",
    };
  }
}

export async function deleteMataKuliahAction(id: number) {
  await getCurrentUser();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/mata-kuliah/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.success) {
      return { success: false, error: result?.message || "Gagal menghapus data mata kuliah" };
    }

    revalidatePath("/mata-kuliah");
    revalidatePath("/dashboard");
    return { success: true, id };
  } catch (error) {
    console.error("Delete Mata Kuliah Action Error:", error);
    return { success: false, error: "Gagal terhubung ke server backend" };
  }
}
