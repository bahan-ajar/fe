import { Suspense } from "react";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { API_URL } from "@/lib/api";
import { Note } from "@/types";
import { NotesContainer } from "./components/NotesContainer";

async function NotesContent() {
  // 1. Langkah 4: Cek otentikasi sesi melalui DAL
  const user = await getCurrentUser();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 2. Langkah 8: Ambil data catatan dari backend Express
  let initialNotes: Note[] = [];
  try {
    const res = await fetch(`${API_URL}/notes`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      initialNotes = data.data || [];
    }
  } catch (err) {
    console.error("Gagal mengambil catatan dari backend:", err);
  }

  return <NotesContainer initialNotes={initialNotes} currentUser={user} />;
}

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Catatan Akademik & Tugas
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Pertemuan 9 & 10: Autentikasi, Otorisasi RBAC, Ownership, Cegah IDOR, Validasi Zod & Optimistic UI.
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Memuat catatan...</div>}>
        <NotesContent />
      </Suspense>
    </div>
  );
}
