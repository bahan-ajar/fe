import { Pencil, Trash2, BookOpen } from "lucide-react";

export interface MataKuliah {
  id: number;
  kode: string;
  nama: string;
  sks: number;
  dosen: string;
}

interface MataKuliahTableProps {
  data: MataKuliah[];
  onEdit: (mk: MataKuliah) => void;
  onDelete: (mk: MataKuliah) => void;
}

export function MataKuliahTable({ data, onEdit, onDelete }: MataKuliahTableProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 font-medium uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4">Kode MK</th>
              <th className="py-3 px-4">Nama Mata Kuliah</th>
              <th className="py-3 px-4">Bobot SKS</th>
              <th className="py-3 px-4">Dosen Pengampu</th>
              <th className="py-3 px-4 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {data.map((mk, idx) => (
              <tr key={mk.id} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3 px-4 text-center text-zinc-400 font-mono">
                  {idx + 1}
                </td>
                <td className="py-3 px-4 font-mono font-medium text-zinc-900">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
                    {mk.kode}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-zinc-400" />
                    <span className="font-medium text-zinc-900">{mk.nama}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-zinc-600">{mk.sks} SKS</span>
                </td>
                <td className="py-3 px-4 text-zinc-600">{mk.dosen}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(mk)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(mk)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
