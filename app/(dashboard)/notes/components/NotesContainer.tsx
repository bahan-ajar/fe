"use client";

import { useState, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, Shield, User, Filter, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Note, CurrentUser } from "@/types";
import { useNotesFilter } from "@/hooks";
import { NoteCard } from "./NoteCard";
import { deleteNoteAction } from "../actions";

interface NotesContainerProps {
  initialNotes: Note[];
  currentUser: CurrentUser;
}

export function NotesContainer({ initialNotes, currentUser }: NotesContainerProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Langkah 16: Optimistic UI
  // Memakai useOptimistic agar item langsung terhapus dari daftar sebelum server selesai
  const [optimisticNotes, setOptimisticNotes] = useOptimistic(
    notes,
    (current, deletedId: number) => current.filter((n) => n.id !== deletedId)
  );

  // Custom hook untuk filter pencarian dan kategori
  const {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    filteredNotes,
  } = useNotesFilter({ notes: optimisticNotes });

  const isAdmin = currentUser.role === "admin";

  const handleDelete = (noteId: number) => {
    if (!confirm(`Hapus catatan #${noteId}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setFeedback(null);

    // Langkah 16: Optimistic UI segera menghapus card di layar
    startTransition(async () => {
      setOptimisticNotes(noteId);
      const res = await deleteNoteAction(noteId);

      if (res.success) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        setFeedback({ type: "success", text: res.message });
      } else {
        setFeedback({ type: "error", text: res.message || "Gagal menghapus catatan." });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span className="font-medium">{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-zinc-500 hover:text-zinc-800 font-bold ml-3"
          >
            ×
          </button>
        </div>
      )}

      {/* Role & Access Info Banner (Langkah 5, 6, 15) */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isAdmin
            ? "bg-purple-50/80 border-purple-200/80 text-purple-900"
            : "bg-blue-50/80 border-blue-200/80 text-blue-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isAdmin ? "bg-purple-600 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {isAdmin ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">
                {currentUser.name}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isAdmin
                    ? "bg-purple-200 text-purple-900"
                    : "bg-blue-200 text-blue-900"
                }`}
              >
                ROLE: {currentUser.role}
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {isAdmin
                ? "Hak Akses Admin: Anda dapat memantau seluruh catatan di sistem dan mengelola pengguna (RBAC)."
                : "Hak Akses Member: Catatan Anda diisolasi secara aman. Anda hanya dapat melihat dan mengubah catatan milik Anda sendiri (Ownership & Cegah IDOR)."}
            </p>
          </div>
        </div>

        <Link
          href="/notes/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Catatan Baru</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, isi, atau penulis catatan..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {["all", "Kuliah", "Tugas", "Pribadi", "Ujian"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-zinc-900 text-white"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {cat === "all" ? "Semua" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daftar Catatan Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border border-dashed border-zinc-300 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-800">
            Tidak ada catatan yang ditemukan
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {search || selectedCategory !== "all"
              ? "Coba ganti filter atau kata kunci pencarian Anda."
              : "Belum ada catatan yang tersimpan. Mulai buat catatan pertama Anda sekarang."}
          </p>
          <Link
            href="/notes/new"
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Catatan</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              currentUserId={currentUser.id}
              isAdmin={isAdmin}
              onDelete={handleDelete}
              isDeleting={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
