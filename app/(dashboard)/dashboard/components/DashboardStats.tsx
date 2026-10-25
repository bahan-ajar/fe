import { Users, UserCheck, BookOpen, CheckCircle2 } from "lucide-react";

export interface StatItemData {
  title: string;
  value: string;
  subtext: string;
  iconKey?: string;
}

interface DashboardStatsProps {
  stats?: StatItemData[];
}

const defaultStats: StatItemData[] = [
  {
    title: "Total Mahasiswa",
    value: "0",
    subtext: "Mahasiswa terdaftar di sistem",
    iconKey: "users",
  },
  {
    title: "Mahasiswa Aktif",
    value: "0",
    subtext: "Tingkat keaktifan semester ini",
    iconKey: "userCheck",
  },
  {
    title: "Mata Kuliah",
    value: "0",
    subtext: "Tersebar di semester aktif",
    iconKey: "bookOpen",
  },
  {
    title: "Rata-rata Kehadiran",
    value: "0%",
    subtext: "Berdasarkan absensi terkini",
    iconKey: "checkCircle",
  },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  const getIcon = (key?: string) => {
    switch (key) {
      case "users":
        return Users;
      case "userCheck":
        return UserCheck;
      case "bookOpen":
        return BookOpen;
      case "checkCircle":
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat) => {
        const Icon = getIcon(stat.iconKey);
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
