import { AlertTriangle } from "lucide-react";
import { Mahasiswa } from "@/types";

interface MahasiswaDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mahasiswa: Mahasiswa | null;
}

export function MahasiswaDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  mahasiswa,
}: MahasiswaDeleteModalProps) {
  if (!isOpen || !mahasiswa) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-zinc-200 rounded-xl max-w-sm w-full shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <h3 className="text-sm font-semibold text-zinc-900 mb-1">
            Hapus Data Mahasiswa?
          </h3>

          <p className="text-xs text-zinc-500 leading-relaxed mb-4">
            Anda akan menghapus data mahasiswa{" "}
            <strong className="text-zinc-800 font-medium">
              {mahasiswa.nama}
            </strong>{" "}
            ({mahasiswa.nim}). Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-3.5 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-xs"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
