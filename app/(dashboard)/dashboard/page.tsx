import { DashboardStats } from "./components/DashboardStats";
import { DashboardRecentStudents } from "./components/DashboardRecentStudents";
import { DashboardQuickActions } from "./components/DashboardQuickActions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
          Ringkasan Akademik
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Selamat datang kembali. Berikut adalah ikhtisar metrik perkuliahan saat ini.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardRecentStudents />
        <DashboardQuickActions />
      </div>
    </div>
  );
}
