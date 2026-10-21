import { Plus, Download } from "lucide-react";

interface MahasiswaHeaderProps {
  totalCount: number;
  onAddNew: () => void;
}

export function MahasiswaHeader({ totalCount, onAddNew }: MahasiswaHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Data Mahasiswa
          </h1>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
            {totalCount} Total
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Daftar seluruh mahasiswa aktif dan cuti tahun ajaran berjalan
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => alert("Fitur unduh CSV/Excel akan segera tersedia.")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-zinc-500" />
          <span>Ekspor</span>
        </button>

        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mahasiswa</span>
        </button>
      </div>
    </div>
  );
}
