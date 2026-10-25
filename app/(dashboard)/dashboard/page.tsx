import { Suspense } from "react";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/dal";
import { API_URL } from "@/lib/api";
import { DashboardStats, StatItemData } from "./components/DashboardStats";
import { DashboardRecentStudents } from "./components/DashboardRecentStudents";
import { DashboardQuickActions } from "./components/DashboardQuickActions";
import { Mahasiswa } from "@/types";

async function DashboardContent() {
  await getCurrentUser();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let stats: StatItemData[] = [];
  let recentStudents: Mahasiswa[] = [];

  try {
    const [statsRes, studentsRes] = await Promise.all([
      fetch(`${API_URL}/dashboard/stats`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        cache: "no-store",
      }).catch(() => null),
      fetch(`${API_URL}/dashboard/recent-students`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        cache: "no-store",
      }).catch(() => null),
    ]);

    if (statsRes && statsRes.ok) {
      const statsJson = await statsRes.json();
      stats = statsJson.data || [];
    }

    if (studentsRes && studentsRes.ok) {
      const studentsJson = await studentsRes.json();
      recentStudents = studentsJson.data || [];
    }
  } catch (error) {
    console.error("Gagal mengambil data dashboard:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
          Ringkasan Akademik
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Selamat datang kembali. Berikut adalah ikhtisar metrik perkuliahan dari backend server.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardRecentStudents students={recentStudents} />
        <DashboardQuickActions />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-400">
          Memuat ringkasan akademik dari backend server...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
