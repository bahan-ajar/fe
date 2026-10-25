"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { API_URL } from "@/lib/api";
import { NoteSchema } from "@/lib/schemas";
import { ActionFormState } from "@/types";

/**
 * Pertemuan 10 — Langkah 6 & 7: Server Action Tambah Catatan
 * Urutan pengamanan wajib:
 * 1. Cek Login (DAL getCurrentUser())
 * 2. Cek Role jika diperlukan
 * 3. Validasi Zod safeParse di sisi server
 * 4. Mutasi data dengan userId dari sesi login (Langkah 11 - Jangan percaya ID dari form)
 * 5. Revalidasi halaman dengan revalidatePath (Langkah 12)
 */
export async function createNoteAction(
  prevState: ActionFormState | null,
  formData: FormData
): Promise<ActionFormState> {
  // 1. Cek Login via DAL (Otomatis redirect ke /login jika tidak ada sesi)
  const user = await getCurrentUser();

  // 2. Ambil data mentah dari form
  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
    priority: formData.get("priority"),
  };

  // 3. Validasi skema Zod (Langkah 7)
  const validation = NoteSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Validasi gagal. Harap periksa kolom yang ditandai merah.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // 4. Mutasi Data (Langkah 11: Ambil userId dari getCurrentUser(), bukan dari input client!)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        ...validation.data,
        userId: user.id, // Enforce server-side user ID
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || "Gagal menyimpan catatan ke server backend.",
        errors: data?.errors,
      };
    }

    // 5. Revalidasi Cache Next.js (Langkah 12)
    revalidatePath("/notes");

    return {
      success: true,
      message: "Catatan baru berhasil ditambahkan!",
      data: data.data,
    };
  } catch (error) {
    console.error("Create Note Action Error:", error);
    return {
      success: false,
      message: "Tidak dapat terhubung ke database/backend server.",
    };
  }
}

/**
 * Pertemuan 10 — Langkah 14: Server Action Update Catatan (dengan action.bind(null, id))
 * Memastikan proteksi kepemilikan data (Ownership & Cegah IDOR)
 */
export async function updateNoteAction(
  id: number,
  prevState: ActionFormState | null,
  formData: FormData
): Promise<ActionFormState> {
  // 1. Cek Login
  await getCurrentUser();

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
    priority: formData.get("priority"),
  };

  // 2. Validasi input
  const validation = NoteSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Periksa kembali isian form Anda.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // 3. Eksekusi Update ke Backend
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(validation.data),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      // Menolak akses jika bukan pemilik catatan (Cegah IDOR)
      return {
        success: false,
        message: data?.message || "Gagal memperbarui catatan (Mungkin bukan milik Anda).",
      };
    }

    revalidatePath("/notes");
    return {
      success: true,
      message: "Catatan berhasil diperbarui!",
      data: data.data,
    };
  } catch {
    return {
      success: false,
      message: "Gagal terhubung ke server backend.",
    };
  }
}

/**
 * Pertemuan 10 — Langkah 14: Server Action Hapus Catatan
 * Menggunakan ID yang di-bind di server dan memverifikasi kepemilikan
 */
export async function deleteNoteAction(id: number): Promise<{ success: boolean; message: string }> {
  await getCurrentUser();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || "Gagal menghapus catatan.",
      };
    }

    revalidatePath("/notes");
    return {
      success: true,
      message: `Catatan #${id} berhasil dihapus.`,
    };
  } catch {
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus catatan.",
    };
  }
}

/**
 * Pertemuan 10 — Langkah 15: Batasi Aksi Khusus Admin (RBAC)
 * Menghapus pengguna dari sistem (hanya boleh dilakukan oleh admin)
 */
export async function deleteUserByAdminAction(
  targetUserId: number
): Promise<{ success: boolean; message: string }> {
  // Cek login
  const currentUser = await getCurrentUser();

  // Validasi Role di Server Action
  if (currentUser.role !== "admin") {
    return {
      success: false,
      message: "FORBIDDEN (403): Hanya administrator yang diizinkan melakukan tindakan ini.",
    };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/users/${targetUserId}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || "Gagal menghapus pengguna.",
      };
    }

    revalidatePath("/notes");
    return {
      success: true,
      message: `Pengguna #${targetUserId} berhasil dihapus oleh Admin.`,
    };
  } catch {
    return {
      success: false,
      message: "Gagal terhubung ke backend server.",
    };
  }
}
