import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { API_URL } from "@/lib/api";
import { Note } from "@/types";
import { NoteForm } from "../components/NoteForm";

interface EditNotePageProps {
  params: Promise<{ id: string }>;
}

async function EditNoteContent({ params }: EditNotePageProps) {
  await getCurrentUser();

  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let note: Note | null = null;
  try {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      notFound();
    }

    const data = await res.json();
    note = data.data;
  } catch {
    notFound();
  }

  if (!note) {
    notFound();
  }

  return <NoteForm initialData={note} />;
}

export default function EditNotePage(props: EditNotePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Edit Catatan
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Pertemuan 10 — Langkah 14: Update Data dengan Cek Ownership & Cegah IDOR.
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Memuat form...</div>}>
        <EditNoteContent {...props} />
      </Suspense>
    </div>
  );
}
