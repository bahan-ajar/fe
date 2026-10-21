import { Search, Filter, RotateCcw } from "lucide-react";
import { MahasiswaStatus } from "../types";

interface MahasiswaFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedKelas: string;
  onKelasChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  kelasList: string[];
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function MahasiswaFilters({
  searchQuery,
  onSearchChange,
  selectedKelas,
  onKelasChange,
  selectedStatus,
  onStatusChange,
  kelasList,
  onReset,
  hasActiveFilters,
}: MahasiswaFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between py-4">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari berdasarkan NIM atau Nama Mahasiswa..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Kelas Filter */}
        <div className="relative">
          <select
            value={selectedKelas}
            onChange={(e) => onKelasChange(e.target.value)}
            className="pl-3 pr-8 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-700 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 appearance-none cursor-pointer"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k} value={k}>
                Kelas {k}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="pl-3 pr-8 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-700 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 appearance-none cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="cuti">Cuti</option>
          </select>
          <Filter className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-2.5 py-2 text-xs text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            title="Reset filter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
