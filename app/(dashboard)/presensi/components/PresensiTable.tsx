export interface PresensiItem {
  id: number;
  nim: string;
  nama: string;
  mataKuliah: string;
  tanggal: string;
  status: "hadir" | "izin" | "sakit" | "alpa";
}

interface PresensiTableProps {
  data: PresensiItem[];
  onStatusChange: (id: number, newStatus: PresensiItem["status"]) => void;
}

export function PresensiTable({ data, onStatusChange }: PresensiTableProps) {
  const getStatusBadge = (status: PresensiItem["status"]) => {
    switch (status) {
      case "hadir":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "izin":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "sakit":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "alpa":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500 font-medium uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4">Mahasiswa</th>
              <th className="py-3 px-4">Mata Kuliah</th>
              <th className="py-3 px-4">Tanggal Pertemuan</th>
              <th className="py-3 px-4">Status Kehadiran</th>
              <th className="py-3 px-4 text-right">Ubah Presensi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {data.map((item, idx) => (
              <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3 px-4 text-center text-zinc-400 font-mono">
                  {idx + 1}
                </td>
                <td className="py-3 px-4">
                  <div>
                    <span className="font-medium text-zinc-900 block">{item.nama}</span>
                    <span className="font-mono text-[11px] text-zinc-400">{item.nim}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-zinc-800">
                  {item.mataKuliah}
                </td>
                <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                  {item.tanggal}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      onStatusChange(item.id, e.target.value as PresensiItem["status"])
                    }
                    className="px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-700 focus:outline-none focus:border-zinc-900 cursor-pointer"
                  >
                    <option value="hadir">Hadir</option>
                    <option value="izin">Izin</option>
                    <option value="sakit">Sakit</option>
                    <option value="alpa">Alpa</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
