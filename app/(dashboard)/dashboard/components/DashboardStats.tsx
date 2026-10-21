import { Users, UserCheck, BookOpen, CheckCircle2 } from "lucide-react";

interface StatItem {
  title: string;
  value: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stats: StatItem[] = [
  {
    title: "Total Mahasiswa",
    value: "124",
    subtext: "+4 mahasiswa baru semester ini",
    icon: Users,
  },
  {
    title: "Mahasiswa Aktif",
    value: "118",
    subtext: "95.1% tingkat keaktifan",
    icon: UserCheck,
  },
  {
    title: "Mata Kuliah",
    value: "18",
    subtext: "Tersebar di 6 semester",
    icon: BookOpen,
  },
  {
    title: "Rata-rata Kehadiran",
    value: "92.4%",
    subtext: "Berdasarkan absensi bulan ini",
    icon: CheckCircle2,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="p-5 rounded-xl bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">
                {stat.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-600">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-zinc-900">
                {stat.value}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">{stat.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
