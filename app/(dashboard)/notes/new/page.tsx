import { Suspense } from "react";
import { getCurrentUser } from "@/lib/dal";
import { NoteForm } from "../components/NoteForm";

async function NewNoteContent() {
  await getCurrentUser();
  return <NoteForm />;
}

export default function NewNotePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Tambah Catatan Baru
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Pertemuan 10 — Form Handling & Mutasi Data dengan Server Action dan Validasi Zod.
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Memuat form...</div>}>
        <NewNoteContent />
      </Suspense>
    </div>
  );
}
