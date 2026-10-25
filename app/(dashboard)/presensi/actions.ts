"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { API_URL } from "@/lib/api";
import { PresensiStatus } from "@/types";

export async function updatePresensiStatusAction(id: number, newStatus: PresensiStatus) {
  await getCurrentUser();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${API_URL}/presensi/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok || !result?.success) {
      return { success: false, message: result?.message || "Gagal memperbarui status presensi di backend" };
    }

    revalidatePath("/presensi");
    revalidatePath("/dashboard");
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Update Presensi Action Error:", error);
    return { success: false, message: "Gagal terhubung ke server backend" };
  }
}
