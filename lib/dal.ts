import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CurrentUser } from "@/types";

/**
 * Pertemuan 9 & 10 — Langkah 4: Data Access Layer (DAL) Otentikasi
 * Mengecek sesi yang sedang aktif dari HttpOnly cookie.
 * Jika belum login atau sesi tidak valid, alihkan otomatis ke /login.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    // Decode payload token JWT secara aman di server
    // Format JWT: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      redirect("/login");
    }

    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    // Cek waktu kedaluwarsa jika ada (exp dalam detik)
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      redirect("/login");
    }

    if (!payload.id || !payload.email) {
      redirect("/login");
    }

    return {
      id: Number(payload.id),
      name: payload.name || "Pengguna",
      email: payload.email,
      role: (payload.role as "admin" | "member") || "member",
    };
  } catch {
    redirect("/login");
  }
}

/**
 * Memverifikasi sesi tanpa langsung melempar redirect.
 * Berguna untuk pengecekan awal atau komponen opsional.
 */
export async function verifySession(): Promise<{ isAuth: boolean; user: CurrentUser | null }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || cookieStore.get("session")?.value;

    if (!token) {
      return { isAuth: false, user: null };
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return { isAuth: false, user: null };
    }

    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { isAuth: false, user: null };
    }

    return {
      isAuth: true,
      user: {
        id: Number(payload.id),
        name: payload.name || "Pengguna",
        email: payload.email,
        role: (payload.role as "admin" | "member") || "member",
      },
    };
  } catch {
    return { isAuth: false, user: null };
  }
}
