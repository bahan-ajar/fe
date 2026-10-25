"use client";

import Link from "next/link";
import { Note } from "@/types";
import { Edit2, Trash2, Calendar, User, Flame } from "lucide-react";

interface NoteCardProps {
  note: Note;
  currentUserId: number;
  isAdmin: boolean;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export function NoteCard({
  note,
  currentUserId,
  isAdmin,
  onDelete,
  isDeleting,
}: NoteCardProps) {
  const isOwner = note.userId === currentUserId;
  const canModify = isOwner || isAdmin;

  const categoryColors: Record<string, string> = {
    Kuliah: "bg-blue-50 text-blue-700 border-blue-200",
    Tugas: "bg-amber-50 text-amber-700 border-amber-200",
    Pribadi: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Ujian: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const priorityLabels: Record<number, string> = {
    1: "Prioritas Rendah",
    2: "Prioritas Normal",
    3: "Prioritas Standar",
    4: "Prioritas Penting",
    5: "Mendesak!",
  };

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
              categoryColors[note.category] || "bg-zinc-100 text-zinc-700 border-zinc-200"
            }`}
          >
            {note.category}
          </span>

          <div className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50/70 border border-amber-100 px-2 py-0.5 rounded-full">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>P{note.priority} ({priorityLabels[note.priority] || "Standar"})</span>
          </div>
        </div>

        {/* Note Title */}
        <h3 className="font-semibold text-base text-zinc-900 leading-snug tracking-tight mb-2">
          {note.title}
        </h3>

        {/* Note Content */}
        <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed whitespace-pre-line mb-4">
          {note.content}
        </p>
      </div>

      <div className="pt-3 border-t border-zinc-100 mt-auto">
        {/* Author & Date metadata */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate font-medium text-zinc-700">
              {note.authorName || `User #${note.userId}`}
              {isOwner && " (Milik Anda)"}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-zinc-400">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(note.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>

        {/* Actions (Update & Delete with Ownership check) */}
        {canModify && (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/notes/${note.id}`}
              className="px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>

            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(note.id)}
              className="px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
