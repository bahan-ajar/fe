import { NextRequest, NextResponse } from "next/server";

// Daftar rute yang dilindungi (membutuhkan login)
const protectedRoutes = ["/dashboard", "/notes", "/mahasiswa", "/mata-kuliah", "/presensi"];

// Rute otentikasi (halaman publik yang tidak boleh diakses jika sudah login)
const authRoutes = ["/login", "/register"];

/**
 * Pertemuan 9 & 10 — Langkah 4: Pagar Proxy (Next.js 16)
 * Pengecekan cepat di tepi (Proxy/Edge) sebelum halaman dirender.
 * Catatan: Proxy hanya pagar kasar untuk redirect instan, pengecekan data sebenarnya
 * dan validasi izin tetap berada di DAL (Data Access Layer).
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || request.cookies.get("session")?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 1. Pengguna belum login mencoba masuk ke rute privat -> alihkan ke /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Pengguna sudah login mencoba masuk ke halaman /login -> alihkan ke /notes
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
