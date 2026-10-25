"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginSchema } from "@/lib/schemas";
import { API_URL } from "@/lib/api";
import { LoginState } from "@/types";

export type { LoginState };

/**
 * Server Action untuk autentikasi login (Pertemuan 9 & 10)
 * Memvalidasi input dengan Zod, mengirim kredensial ke Backend Express,
 * dan menyimpan session token dalam HttpOnly Cookie.
 */
export async function loginAction(
  prevState: LoginState | null,
  formData: FormData
): Promise<LoginState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validasi input dengan Zod safeParse di sisi server
  const validation = LoginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: "Periksa kembali format email dan kata sandi Anda.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || "Email atau kata sandi tidak cocok.",
      };
    }

    // Pertemuan 9 Langkah 2: Set HttpOnly, Secure, SameSite Cookie
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });

    cookieStore.set("session", data.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return {
      success: true,
      message: "Login berhasil! Mengalihkan ke dashboard...",
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error("Login Server Action Error:", error);
    return {
      success: false,
      message: "Koneksi ke backend gagal. Pastikan Express API menyala pada port 5000.",
    };
  }
}

/**
 * Server Action untuk Logout
 * Menghapus HttpOnly cookie dan mengalihkan pengguna ke halaman /login
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("session");
  redirect("/login");
}
