import { Pencil, Trash2, UserX } from "lucide-react";
import { Mahasiswa } from "../types";
import { MahasiswaStatusBadge } from "./MahasiswaStatusBadge";

interface MahasiswaTableProps {
  data: Mahasiswa[];
  onEdit: (mhs: Mahasiswa) => void;
  onDelete: (mhs: Mahasiswa) => void;
  onResetFilters: () => void;
}

export function MahasiswaTable({
  data,
  onEdit,
  onDelete,
  onResetFilters,
}: MahasiswaTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Tidak ada data mahasiswa ditemukan
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4">
          Coba periksa kata kunci pencarian atau ubah filter kelas dan status yang dipilih.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-3 py-1.5 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg transition-colors"
        >
          Reset Filter
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 font-medium uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4">NIM</th>
              <th className="py-3 px-4">Nama Mahasiswa</th>
              <th className="py-3 px-4">Kelas</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Tanggal Terdaftar</th>
              <th className="py-3 px-4 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {data.map((mhs, idx) => {
              // Extract initials
              const initials = mhs.nama
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <tr
                  key={mhs.id}
                  className="hover:bg-zinc-50/80 transition-colors group"
                >
                  <td className="py-3 px-4 text-center text-zinc-400 font-mono">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-zinc-900">
                    {mhs.nim}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-semibold flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <span className="font-medium text-zinc-900">
                        {mhs.nama}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-mono text-[11px]">
                      {mhs.kelas}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <MahasiswaStatusBadge status={mhs.status} />
                  </td>
                  <td className="py-3 px-4 text-zinc-500 text-[11px]">
                    {mhs.created_at}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(mhs)}
                        title="Edit Mahasiswa"
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(mhs)}
                        title="Hapus Mahasiswa"
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-zinc-100 bg-white flex items-center justify-between text-xs text-zinc-500">
        <div>
          Menampilkan <span className="font-medium text-zinc-800">{data.length}</span> data mahasiswa
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="px-2.5 py-1 text-xs border border-zinc-200 rounded-md text-zinc-400 bg-zinc-50 cursor-not-allowed"
          >
            Sebelumnya
          </button>
          <span className="px-2 text-xs font-medium text-zinc-700">1</span>
          <button
            type="button"
            disabled
            className="px-2.5 py-1 text-xs border border-zinc-200 rounded-md text-zinc-400 bg-zinc-50 cursor-not-allowed"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
