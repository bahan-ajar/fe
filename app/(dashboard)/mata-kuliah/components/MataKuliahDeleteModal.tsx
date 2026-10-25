"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { MataKuliah } from "@/types";

interface MataKuliahDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  mataKuliah: MataKuliah | null;
}

export function MataKuliahDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  mataKuliah,
}: MataKuliahDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !mataKuliah) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-zinc-200 rounded-xl max-w-sm w-full p-6 shadow-lg animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Hapus Mata Kuliah
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tindakan ini tidak dapat dibatalkan
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-600 mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus mata kuliah{" "}
          <strong className="text-zinc-900 font-semibold">
            {mataKuliah.nama} ({mataKuliah.kode})
          </strong>
          ? Data yang dihapus akan hilang dari server backend.
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <span>Hapus Sekarang</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
