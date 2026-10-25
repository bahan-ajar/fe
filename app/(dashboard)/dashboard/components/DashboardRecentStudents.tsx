import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { Mahasiswa } from "@/types";

interface DashboardRecentStudentsProps {
  students?: Mahasiswa[];
}

export function DashboardRecentStudents({ students = [] }: DashboardRecentStudentsProps) {
  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">
            Pendaftaran Mahasiswa Terbaru
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Mahasiswa terbaru yang terdaftar dalam database
          </p>
        </div>
        <Link
          href="/mahasiswa"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 hover:text-zinc-950 transition-colors"
        >
          <span>Lihat Semua</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-zinc-100">
        {students.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400 flex flex-col items-center justify-center gap-2">
            <Users className="w-6 h-6 text-zinc-300" />
            <span>Belum ada data mahasiswa di backend server</span>
          </div>
        ) : (
          students.map((item) => (
            <div
              key={item.nim || item.id}
              className="py-3 flex items-center justify-between hover:bg-zinc-50/50 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center justify-center">
                  {(item.nama || "M").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-900">{item.nama}</p>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {item.nim} • {item.kelas}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    item.status === "aktif"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  {item.created_at}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
