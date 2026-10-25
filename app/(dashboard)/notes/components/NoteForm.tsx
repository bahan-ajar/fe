"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Bookmark,
  AlertCircle,
  Save,
  Loader2,
  ArrowLeft,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { createNoteAction, updateNoteAction } from "../actions";
import { ActionFormState, Note } from "@/types";

interface NoteFormProps {
  initialData?: Note | null;
}

const initialFormState: ActionFormState = {
  success: false,
};

export function NoteForm({ initialData }: NoteFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  // Langkah 9 & 14: Jika editing, gunakan action.bind(null, id)
  const actionToUse = isEditing
    ? updateNoteAction.bind(null, initialData!.id)
    : createNoteAction;

  const [state, formAction, isPending] = useActionState(actionToUse, initialFormState);

  // Redirect ke halaman daftar catatan setelah mutasi berhasil (Langkah 11 & 12)
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push("/notes");
        router.refresh();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden max-w-2xl">
      {/* Header Form */}
      <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/notes"
            className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              {isEditing ? "Perbarui Catatan Akademik" : "Buat Catatan Baru"}
            </h2>
            <p className="text-xs text-zinc-500">
              Form mutasi data dengan validasi Zod skema dan proteksi kepemilikan.
            </p>
          </div>
        </div>
      </div>

      {/* Pesan status global */}
      <div className="p-6 pb-0">
        {state.success && (
          <div className="p-3.5 mb-5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{state.message} Mengalihkan...</span>
          </div>
        )}

        {!state.success && state.message && (
          <div className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{state.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Form Action Hook (Langkah 9) */}
      <form action={formAction} className="p-6 pt-2 space-y-5">
        {/* Judul Catatan */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Judul Catatan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <FileText className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="title"
              defaultValue={initialData?.title || ""}
              placeholder="Contoh: Rangkuman Materi Pertemuan 9 Auth & RBAC"
              className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors ${
                state.errors?.title
                  ? "border-red-400 ring-1 ring-red-400"
                  : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              }`}
            />
          </div>
          {/* Langkah 10: Tampilkan error validasi field */}
          {state.errors?.title && (
            <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
              <span>•</span> {state.errors.title[0]}
            </p>
          )}
        </div>

        {/* Kategori & Prioritas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Kategori Catatan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Bookmark className="h-4 w-4" />
              </div>
              <select
                name="category"
                defaultValue={initialData?.category || "Kuliah"}
                className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl text-zinc-900 focus:outline-none transition-colors appearance-none ${
                  state.errors?.category
                    ? "border-red-400 ring-1 ring-red-400"
                    : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                }`}
              >
                <option value="Kuliah">Kuliah</option>
                <option value="Tugas">Tugas</option>
                <option value="Pribadi">Pribadi</option>
                <option value="Ujian">Ujian</option>
              </select>
            </div>
            {state.errors?.category && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                <span>•</span> {state.errors.category[0]}
              </p>
            )}
          </div>

          {/* Prioritas (Angka 1-5 di-coerce dengan z.coerce.number()) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Prioritas (1 Rendah – 5 Sangat Mendesak)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <Flame className="h-4 w-4" />
              </div>
              <select
                name="priority"
                defaultValue={initialData?.priority || 3}
                className={`w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-xl text-zinc-900 focus:outline-none transition-colors appearance-none ${
                  state.errors?.priority
                    ? "border-red-400 ring-1 ring-red-400"
                    : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                }`}
              >
                <option value="1">1 — Prioritas Rendah</option>
                <option value="2">2 — Prioritas Normal</option>
                <option value="3">3 — Prioritas Standar</option>
                <option value="4">4 — Prioritas Penting</option>
                <option value="5">5 — Prioritas Sangat Mendesak</option>
              </select>
            </div>
            {state.errors?.priority && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                <span>•</span> {state.errors.priority[0]}
              </p>
            )}
          </div>
        </div>

        {/* Isi Catatan */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-zinc-700">
              Isi Catatan <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-zinc-400">Minimal 10 karakter</span>
          </div>
          <textarea
            name="content"
            rows={5}
            defaultValue={initialData?.content || ""}
            placeholder="Tuliskan detail catatan, langkah praktikum, atau tugas di sini..."
            className={`w-full p-3 text-sm bg-white border rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none transition-colors ${
              state.errors?.content
                ? "border-red-400 ring-1 ring-red-400"
                : "border-zinc-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            }`}
          />
          {/* Langkah 10: Tampilkan pesan error Zod */}
          {state.errors?.content && (
            <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
              <span>•</span> {state.errors.content[0]}
            </p>
          )}
        </div>

        {/* Tombol Simpan & Status Pending (Langkah 9) */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3">
          <Link
            href="/notes"
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan ke Server...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Perbarui Catatan" : "Simpan Catatan"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
