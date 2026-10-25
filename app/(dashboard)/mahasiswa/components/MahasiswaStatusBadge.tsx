import { MahasiswaStatus } from "@/types";

interface MahasiswaStatusBadgeProps {
  status: MahasiswaStatus;
}

export function MahasiswaStatusBadge({ status }: MahasiswaStatusBadgeProps) {
  const isAktif = status === "aktif";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isAktif
          ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
          : "bg-amber-50 text-amber-700 border-amber-200/80"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isAktif ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      <span className="capitalize">{status}</span>
    </span>
  );
}
