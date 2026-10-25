"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import { loginAction, LoginState } from "../actions";

const initialState: LoginState = {
  success: false,
};

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Jika login berhasil lewat Server Action (Langkah 9 & 10)
  useEffect(() => {
    if (state.success && state.user) {
      if (typeof window !== "undefined") {
        if (state.token) {
          localStorage.setItem("token", state.token);
        }
        localStorage.setItem("user", JSON.stringify(state.user));
      }
      // Redirect ke halaman catatan / dashboard
      router.push("/notes");
      router.refresh();
    }
  }, [state, router]);

  const fillAccount = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
  };

  return (
    <div className="w-full">
      {/* Pesan Kesalahan Global dari Server Action */}
      {!state.success && state.message && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{state.message}</p>
          </div>
        </div>
      )}

      {/* Pesan Sukses */}
      {state.success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{state.message || "Login berhasil! Sedang dialihkan..."}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Email Kampus
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@univ.ac.id"
              className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                state.errors?.email
                  ? "border-red-400 ring-1 ring-red-400"
                  : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              }`}
              required
            />
          </div>
          {/* Tampilkan error validasi per field (Langkah 10) */}
          {state.errors?.email && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
              <span>•</span> {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-zinc-700">
              Kata Sandi
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert("Silakan hubungi administrator IT kampus untuk mereset kata sandi.");
              }}
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Lupa sandi?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full pl-9 pr-10 py-2 text-sm bg-white border rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                state.errors?.password
                  ? "border-red-400 ring-1 ring-red-400"
                  : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {/* Tampilkan error validasi per field (Langkah 10) */}
          {state.errors?.password && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
              <span>•</span> {state.errors.password[0]}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
            />
            <span>Ingat sesi saya (Cookie HttpOnly)</span>
          </label>
        </div>

        {/* Submit Button dengan status isPending (Langkah 9) */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memvalidasi & Menyimpan Sesi...</span>
            </>
          ) : (
            <>
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Akun Demo Switcher untuk Uji 2 Akun & Role (Langkah 13 & 15) */}
      <div className="mt-6 pt-5 border-t border-zinc-100">
        <div className="flex items-center gap-1.5 mb-2.5 text-xs text-zinc-600 font-medium">
          <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
          <span>Pilih Akun Demo untuk Pengujian:</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => fillAccount("admin@univ.ac.id", "adminpassword")}
            className="p-2 border border-zinc-200 hover:border-zinc-900 rounded-lg bg-zinc-50/50 hover:bg-white text-left transition-colors flex flex-col"
          >
            <span className="font-semibold text-zinc-900">Admin</span>
            <span className="text-[10px] text-zinc-500">Akses penuh</span>
          </button>
          <button
            type="button"
            onClick={() => fillAccount("budi.santoso@univ.ac.id", "password123")}
            className="p-2 border border-zinc-200 hover:border-zinc-900 rounded-lg bg-zinc-50/50 hover:bg-white text-left transition-colors flex flex-col"
          >
            <span className="font-semibold text-zinc-900">User A (Budi)</span>
            <span className="text-[10px] text-zinc-500">Role Member</span>
          </button>
          <button
            type="button"
            onClick={() => fillAccount("siti.rahma@univ.ac.id", "password123")}
            className="p-2 border border-zinc-200 hover:border-zinc-900 rounded-lg bg-zinc-50/50 hover:bg-white text-left transition-colors flex flex-col"
          >
            <span className="font-semibold text-zinc-900">User B (Siti)</span>
            <span className="text-[10px] text-zinc-500">Role Member</span>
          </button>
        </div>
      </div>
    </div>
  );
}
