import { BookPlus } from "lucide-react";

interface MataKuliahHeaderProps {
  totalCount: number;
  onAddNew: () => void;
}

export function MataKuliahHeader({ totalCount, onAddNew }: MataKuliahHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Mata Kuliah
          </h1>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
            {totalCount} Mata Kuliah
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Daftar mata kuliah aktif dan dosen pengampu semester ini
        </p>
      </div>

      <button
        type="button"
        onClick={onAddNew}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors shadow-xs"
      >
        <BookPlus className="w-4 h-4" />
        <span>Tambah Mata Kuliah</span>
      </button>
    </div>
  );
}
