import Link from "next/link";
import { UserPlus, BookOpen, CalendarCheck, FileSpreadsheet } from "lucide-react";

export function DashboardQuickActions() {
  const actions = [
    {
      label: "Tambah Mahasiswa Baru",
      desc: "Input data mahasiswa dan tetapkan kelas",
      href: "/mahasiswa",
      icon: UserPlus,
    },
    {
      label: "Jadwal Perkuliahan",
      desc: "Lihat daftar mata kuliah aktif",
      href: "/mata-kuliah",
      icon: BookOpen,
    },
    {
      label: "Presensi Harian",
      desc: "Rekap data kehadiran mahasiswa",
      href: "/presensi",
      icon: CalendarCheck,
    },
    {
      label: "Laporan Akademik",
      desc: "Unduh ringkasan data semester",
      href: "#laporan",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs">
      <h2 className="text-sm font-semibold text-zinc-900 mb-1">Aksi Cepat</h2>
      <p className="text-xs text-zinc-500 mb-4">
        Pintasan navigasi untuk tugas-tugas administratif rutin
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.label}
              href={act.href}
              className="p-3.5 rounded-lg border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50/70 transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-md bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-600 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-900 group-hover:text-zinc-950">
                  {act.label}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{act.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
